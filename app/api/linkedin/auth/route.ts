import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getLinkedInAuthUrl } from '@/lib/linkedin';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/linkedin/callback`;
  const state = randomBytes(16).toString('hex');

  const authUrl = getLinkedInAuthUrl(redirectUri, state);
  const response = NextResponse.redirect(authUrl);

  // Short-lived cookie to verify the callback isn't forged (CSRF protection).
  response.cookies.set('li_oauth_state', state, {
    httpOnly: true,
    secure: url.protocol === 'https:',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });

  return response;
}
