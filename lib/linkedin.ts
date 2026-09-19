// LinkedIn OAuth 2.0 + native posting (UGC Posts API).
// One QNexus LinkedIn account connects once; the access token is stored in
// Mongo (single document, like the settings store) and reused for posting.
import { getMongoDbDatabase } from './mongodb';

const AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const USERINFO_URL = 'https://api.linkedin.com/v2/userinfo';
const UGC_POSTS_URL = 'https://api.linkedin.com/v2/ugcPosts';

const CONNECTION_KEY = 'linkedin-connection';
const SCOPES = 'openid profile w_member_social';

export interface LinkedInConnection {
  accessToken: string;
  expiresAt: number; // epoch ms
  personUrn: string; // e.g. "urn:li:person:abc123"
  name?: string;
  connectedAt: string;
}

export function getLinkedInAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID!,
    redirect_uri: redirectUri,
    state,
    scope: SCOPES,
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForConnection(code: string, redirectUri: string): Promise<LinkedInConnection> {
  const tokenRes = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    }).toString(),
  });
  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange LinkedIn authorization code');
  }

  const userRes = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();
  if (!userRes.ok || !userData.sub) {
    throw new Error('Failed to fetch LinkedIn profile info');
  }

  return {
    accessToken: tokenData.access_token,
    expiresAt: Date.now() + (tokenData.expires_in || 0) * 1000,
    personUrn: `urn:li:person:${userData.sub}`,
    name: userData.name,
    connectedAt: new Date().toISOString(),
  };
}

export async function saveLinkedInConnection(connection: LinkedInConnection): Promise<void> {
  const db = await getMongoDbDatabase();
  if (!db) throw new Error('MongoDB not configured');
  await db.collection('integrations').updateOne(
    { _key: CONNECTION_KEY },
    { $set: { ...connection, _key: CONNECTION_KEY } },
    { upsert: true }
  );
}

export async function getLinkedInConnection(): Promise<LinkedInConnection | null> {
  const db = await getMongoDbDatabase();
  if (!db) return null;
  const doc = await db.collection('integrations').findOne({ _key: CONNECTION_KEY });
  if (!doc) return null;
  return {
    accessToken: doc.accessToken,
    expiresAt: doc.expiresAt,
    personUrn: doc.personUrn,
    name: doc.name,
    connectedAt: doc.connectedAt,
  };
}

export async function disconnectLinkedIn(): Promise<void> {
  const db = await getMongoDbDatabase();
  if (!db) return;
  await db.collection('integrations').deleteOne({ _key: CONNECTION_KEY });
}

export async function postToLinkedIn(text: string): Promise<{ success: boolean; error?: string }> {
  const connection = await getLinkedInConnection();
  if (!connection) return { success: false, error: 'LinkedIn is not connected yet.' };
  if (connection.expiresAt < Date.now()) {
    return { success: false, error: 'LinkedIn connection expired — reconnect from the admin dashboard.' };
  }

  const res = await fetch(UGC_POSTS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${connection.accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      author: connection.personUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    return { success: false, error: errBody.message || `LinkedIn API error (${res.status})` };
  }

  return { success: true };
}
