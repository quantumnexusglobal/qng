import type { Metadata } from 'next';
import TeamPageClient from './TeamPageClient';

export const metadata: Metadata = {
  title: 'Our Team — The People Behind QNexus',
  description:
    'Meet the students and quantum enthusiasts building QNexus (Quantum Nexus Global), a free, student-first quantum computing community.',
  alternates: { canonical: '/team' },
};

export default function TeamPage() {
  return <TeamPageClient />;
}
