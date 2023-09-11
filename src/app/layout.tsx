import './global.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Providers } from './providers'

const roboto = localFont({
  src: [
    {
      path: '../../public/fonts/Roboto-Regular.ttf',
      weight: '400',
    },
    {
      path: '../../public/fonts/Roboto-Medium.ttf',
      weight: '500',
    },
    {
      path: '../../public/fonts/Roboto-Bold.ttf',
      weight: '700',
    },
  ],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'PharosIT OS System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} font-sans bg-gray-950 text-gray-100`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
