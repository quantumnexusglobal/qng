import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Join the Quantum Community — Free for Students',
  description:
    'Join QNexus (Quantum Nexus Global), a free student-first quantum computing community. Connect with researchers, industry leaders, and peers through talks, mentorship, and workshops.',
  alternates: { canonical: '/join' },
};

export default function JoinLayout({ children }: { children: ReactNode }) {
  return children;
}
