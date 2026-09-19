import React from "react"
import type { Metadata } from 'next'
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono, Caveat, Space_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { FooterSection } from '@/components/landing/footer-section'
import { CurtainTransition } from '@/components/ui/curtain-transition'
import './globals.css'

const instrumentSans = Instrument_Sans({ 
  subsets: ["latin"],
  variable: '--font-instrument'
});

const instrumentSerif = Instrument_Serif({ 
  subsets: ["latin"],
  weight: "400",
  variable: '--font-instrument-serif'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains'
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
});

const siteDescription =
  'QNexus (Quantum Nexus Global) is a free, student-first quantum computing community. We connect students with researchers, industry leaders, and peers through free talks, mentorship, and workshops — helping you learn, explore, and build your path in quantum. Open to students everywhere.';

export const metadata: Metadata = {
  title: {
    default: 'QNexus — Quantum Nexus Global | Student-First Quantum Computing Community',
    template: '%s | QNexus — Quantum Nexus Global',
  },
  description: siteDescription,
  keywords: [
    'Quantum Nexus',
    'Quantum Nexus Global',
    'QNexus',
    'QNG',
    'Quantum Community',
    'Quantum Collective',
    'Global Quantum Community',
    'Quantum Computing Community',
    'Student Quantum Community',
    'Free Quantum Talks',
    'Quantum Mentorship',
    'Learn Quantum Computing',
    'Quantum Computing for Beginners',
    'Quantum Computing Events',
    'Quantum Computing Workshops',
    'Join Quantum Community',
    'Quantum Computing Students',
  ],
  authors: [{ name: 'QNexus Team' }],
  creator: 'QNexus',
  publisher: 'QNexus',
  metadataBase: new URL('https://www.quantumnexusglobal.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'QNexus — Quantum Nexus Global | Student-First Quantum Computing Community',
    description: siteDescription,
    url: 'https://www.quantumnexusglobal.org',
    siteName: 'QNexus — Quantum Nexus Global',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'QNexus — Quantum Nexus Global',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QNexus — Quantum Nexus Global',
    description: siteDescription,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'QNexus',
      alternateName: ['Quantum Nexus Global', 'Quantum Nexus', 'QNG', 'Quantum Collective'],
      url: 'https://www.quantumnexusglobal.org',
      logo: 'https://www.quantumnexusglobal.org/logo.png',
      description: siteDescription,
      sameAs: [
        'https://www.linkedin.com/company/quantumnexusglobal/',
        'https://twitter.com/qnexusglobal',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'QNexus — Quantum Nexus Global',
      alternateName: ['Quantum Nexus', 'Quantum Nexus Global', 'QNexus', 'QNG'],
      url: 'https://www.quantumnexusglobal.org',
      description: siteDescription,
    },
  ];

  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XVFLLRLN56" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-XVFLLRLN56');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${caveat.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} font-sans antialiased`}>
        <CurtainTransition />
        {children}
        <FooterSection />
        <Analytics />
      </body>
    </html>
  );
}
