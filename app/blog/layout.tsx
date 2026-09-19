import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Quantum Computing Blog — Articles, Insights & Community Updates',
  description:
    'Read articles and updates from QNexus (Quantum Nexus Global) — insights on quantum computing, careers, events, and student opportunities.',
  alternates: { canonical: '/blog' },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}
