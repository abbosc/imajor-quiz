import type { Metadata, Viewport } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import { SoundProvider } from "@/components/audio/SoundManager";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import LenisProvider from "@/components/providers/LenisProvider";
import { StructuredData } from "@/components/SEO/StructuredData";

const inter = Inter({ subsets: ["latin"] });
const caveat = Caveat({
  subsets: ["latin"],
  variable: '--font-caveat',
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
        <StructuredData />
      </head>
      <body className={`${inter.className} ${caveat.variable} antialiased`}>
        <LenisProvider>
          <AuthProvider>
            <SoundProvider>
              {children}
            </SoundProvider>
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
      </body>
    </html>
  );
}
