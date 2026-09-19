import { NextResponse } from 'next/server';
import { exchangeCodeForConnection, saveLinkedInConnection } from '@/lib/linkedin';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const expectedState = request.headers.get('cookie')?.match(/li_oauth_state=([^;]+)/)?.[1];

  const redirectTo = (params: Record<string, string>) =>
    NextResponse.redirect(`${url.origin}/admin/social-post?${new URLSearchParams(params).toString()}`);

  if (error) {
    return redirectTo({ linkedin: 'error', message: 'Authorization was cancelled or denied.' });
  }
  if (!code || !state || state !== expectedState) {
    return redirectTo({ linkedin: 'error', message: 'Invalid or expired authorization request.' });
  }

  try {
    const redirectUri = `${url.origin}/api/linkedin/callback`;
    const connection = await exchangeCodeForConnection(code, redirectUri);
    await saveLinkedInConnection(connection);
    const response = redirectTo({ linkedin: 'connected' });
    response.cookies.delete('li_oauth_state');
    return response;
  } catch (err: any) {
    console.error('LinkedIn OAuth callback error:', err);
    return redirectTo({ linkedin: 'error', message: err.message || 'Failed to connect LinkedIn.' });
  }
}
