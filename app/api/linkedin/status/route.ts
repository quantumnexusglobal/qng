import { NextResponse } from 'next/server';
import { getLinkedInConnection, disconnectLinkedIn } from '@/lib/linkedin';

export async function GET() {
  const connection = await getLinkedInConnection();
  if (!connection) {
    return NextResponse.json({ success: true, connected: false });
  }
  return NextResponse.json({
    success: true,
    connected: connection.expiresAt > Date.now(),
    name: connection.name,
    connectedAt: connection.connectedAt,
    expiresAt: connection.expiresAt,
  });
}

export async function DELETE() {
  await disconnectLinkedIn();
  return NextResponse.json({ success: true });
}
