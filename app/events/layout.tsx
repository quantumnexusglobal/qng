import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Quantum Events & Workshops — Free Talks, Hackathons & Meetups',
  description:
    'Explore upcoming quantum computing events hosted by QNexus (Quantum Nexus Global) — free expert talks, hands-on workshops, hackathons, and mentor panels for students.',
  alternates: { canonical: '/events' },
};

export default function EventsLayout({ children }: { children: ReactNode }) {
  return children;
}
