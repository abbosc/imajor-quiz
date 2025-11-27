import type { Metadata, Viewport } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import LenisProvider from "@/components/providers/LenisProvider";
import { StructuredData } from "@/components/SEO/StructuredData";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap', // Prevent font blocking
  preload: true,
});
const caveat = Caveat({
  subsets: ["latin"],
  variable: '--font-caveat',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://imajor.app'),
  title: {
    default: "iMajor - Discover Your Perfect College Major",
    template: "%s | iMajor"
  },
  description: "Take the free Major Exploration Quiz to discover how deeply you've explored your college major options. Win free consultation slots with expert mentors and find your ideal career path.",
  keywords: [
    "college major quiz",
    "major exploration",
    "career quiz",
    "college planning",
    "university major",
    "career assessment",
    "college counseling",
    "major decision",
    "career path finder",
    "college major test"
  ],
  authors: [{ name: "iMajor" }],
  creator: "iMajor",
  publisher: "iMajor",
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://imajor.app',
    siteName: 'iMajor',
    title: 'iMajor - Discover Your Perfect College Major',
    description: 'Take the free Major Exploration Quiz to discover how deeply you\'ve explored your college major options. Win free consultation slots with expert mentors!',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'iMajor - Major Exploration Quiz',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iMajor - Discover Your Perfect College Major',
    description: 'Take the free Major Exploration Quiz and win consultation slots with expert mentors!',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
  alternates: {
    canonical: 'https://imajor.app',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external services for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://supabase.co" />
        <link rel="dns-prefetch" href="https://t.me" />
        <StructuredData />
      </head>
      <body className={`${inter.className} ${caveat.variable} antialiased`}>
        <LenisProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                style: {
                  background: 'white',
                  border: '1px solid #E2E8F0',
                },
              }}
            />
          </AuthProvider>
        </LenisProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
