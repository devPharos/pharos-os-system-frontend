import './global.css'
import localFont from 'next/font/local'
import { Toaster } from 'sonner'
import { NextUIProvider } from '@nextui-org/react'
import { UserProvider } from '@/app/contexts/useUser'

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

export const metadata = {
  title: 'Pharos IT - Sistema de OS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} font-sans bg-gray-900 text-gray-100`}
      >
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
