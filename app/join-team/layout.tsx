import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Join the QNexus Team',
  description: 'Share your skills, interests, and time to help build the Quantum Nexus Global community.',
  alternates: { canonical: '/join-team' },
};

export default function JoinTeamLayout({ children }: { children: ReactNode }) {
  return children;
}
