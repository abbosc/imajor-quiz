import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import { SoundProvider } from "@/components/audio/SoundManager";

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
        <SoundProvider>
          {children}
        </SoundProvider>
      </body>
    </html>
  );
}
