import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Contact Us — QNexus Quantum Community',
  description:
    'Get in touch with QNexus (Quantum Nexus Global) for questions about joining, mentorship, speaking, or partnerships in our student-first quantum computing community.',
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
