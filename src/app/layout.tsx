import type { Metadata } from 'next'
import { Inter, Lora } from 'next/font/google'
import './globals.css'
import PageTransition from '@/components/ui/PageTransition'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ihahiro',
  description: 'Modern Agrimarket',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className={`${inter.variable} ${lora.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans text-foreground antialiased">
        <div className="noise-overlay" />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
