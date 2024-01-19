'use client'
import './global.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Providers } from './providers'
import { useVerifyPathPermission } from '@/hooks/usePermission'
import metadata from './metadata'
import { useRegister } from '@/hooks/useRegister'
import Loading from '@/components/Loading'
import { Toaster } from 'sonner'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { loading, currentUser, token } = useRegister()
  useVerifyPathPermission(loading)

  if (loading && !currentUser && !token) {
    return <Loading />
  }

  return (
    <html lang="en">
      <body
        className={`${roboto.variable} font-sans bg-gray-900 text-gray-100`}
      >
        <Providers>
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  )
}
