import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { APP_CONFIG } from '@/config/app';

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} - ${APP_CONFIG.tagline}`,
  description: APP_CONFIG.description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://baseplay.vercel.app'),
  openGraph: {
    title: `${APP_CONFIG.name} - ${APP_CONFIG.tagline}`,
    description: APP_CONFIG.description,
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_CONFIG.name} - ${APP_CONFIG.tagline}`,
    description: APP_CONFIG.description,
    images: ['/og-image.png'],
  },
  other: {
    'base:app_id': APP_CONFIG.verificationMeta.baseAppId,
    'talentapp:project_verification': APP_CONFIG.verificationMeta.talentappVerification,
  },
  themeColor: '#0a0a0a',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content={APP_CONFIG.verificationMeta.baseAppId} />
        <meta name="talentapp:project_verification" content={APP_CONFIG.verificationMeta.talentappVerification} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
