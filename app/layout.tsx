import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import { SoundProvider } from "@/components/audio/SoundManager";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });
const caveat = Caveat({
  subsets: ["latin"],
  variable: '--font-caveat',
});

export const metadata: Metadata = {
  title: "iMajor - Major Exploration Depth Quiz",
  description: "Discover how deeply you've explored your major options and win consultation slots with experts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${caveat.variable} antialiased`}>
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
      </body>
    </html>
  );
}
