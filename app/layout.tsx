import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import { Providers } from "./providers";
import { Inter } from 'next/font/google';

// Load Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "Farcaster RPS Showdown",
  description: "Challenge your Farcaster friends to Rock, Paper, Scissors right in your feed.",
  applicationName: "RPS Showdown",
  authors: [{ name: "RPS Showdown Team" }],
  keywords: ["Farcaster", "Rock Paper Scissors", "Game", "Web3", "Blockchain"],
  colorScheme: "light",
  themeColor: "#4F46E5",
  manifest: "/manifest.json",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE || "https://i.imgur.com/placeholder.png",
      button: {
        title: "Launch Farcaster RPS Showdown",
        action: {
          type: "launch_frame",
          name: "Farcaster RPS Showdown",
          url: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
          splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE || "https://i.imgur.com/placeholder-splash.png",
          splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#4F46E5",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body className="min-h-screen bg-bg text-text-primary">
        <Providers>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-white">
            Skip to main content
          </a>
          <main id="main-content">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
