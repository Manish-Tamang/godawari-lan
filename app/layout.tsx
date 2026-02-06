import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from "@/components/ui/sonner"
import { Footer } from "@/components/footer"
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const kenarose = localFont({
  src: '../public/fonts/Kenarose.otf',
  variable: '--font-kenarose',
});

export const metadata: Metadata = {
  title: 'Free Fire Tournament - Sushma Godawari College',
  description: 'Register your team for the Free Fire Tournament organized by Sushma Godawari College. Compete, win prizes, and show your gaming skills!',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      {
        url: '/hero.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/hero.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/hero.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/hero.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${kenarose.variable}`}>
      <body className="antialiased bg-background text-foreground transition-colors duration-300">
        <div className="max-w-4xl mx-auto min-h-screen border-x border-border bg-white flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Analytics />
        </div>
        <Toaster />
      </body>
    </html>
  )
}
