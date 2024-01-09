'use client'
import { useRegister } from '@/hooks/useRegister'
import '../global.css'
import { Providers } from '../providers'
import { useVerifyPathPermission } from '@/hooks/usePermission'
import Loading from '@/components/Loading'
import { useEffect, useState } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useVerifyPathPermission()

  const { token, user } = useRegister()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      setLoading(false)
    }
  }, [token, user?.email])

  if (loading) {
    return <Loading />
  }

  return <Providers>{children}</Providers>
}
