'use client'
import { useRegister } from '@/hooks/useRegister'
import '../global.css'
import { Providers } from '../providers'
import { useVerifyPathPermission } from '@/hooks/usePermission'
import Loading from '@/components/Loading'

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

  return <Providers>{children}</Providers>
}
