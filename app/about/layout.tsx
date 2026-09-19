import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'About Us — Our Mission for Student-First Quantum Education',
  description:
    'QNexus (Quantum Nexus Global) is on a mission to make quantum education and opportunities accessible to every student, regardless of background or resources — through free talks, mentorship, and workshops.',
  alternates: { canonical: '/about' },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
