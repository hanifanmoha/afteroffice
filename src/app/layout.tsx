import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import cx from 'classnames'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cryptarithm',
  description: 'After office games',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={cx(inter.className, 'bg-slate-900')}>{children}</body>
    </html>
  )
}
