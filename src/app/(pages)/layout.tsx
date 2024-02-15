'use client'
import Header from '@/layouts/header'
import '../global.css'
import { useUser } from '../contexts/useUser'
import { usePathname, useRouter } from 'next/navigation'
import Loading from '@/components/Loading'
import { NextUIProvider } from '@nextui-org/react'
import { Toaster } from 'sonner'
import { useEffect, useState } from 'react'

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [hasMounted, setHasMounted] = useState(false)
  const { auth } = useUser()
  const router = useRouter()
  const path = usePathname()

  useEffect(() => {
    setHasMounted(true)

    if (!auth.authenticated) {
      router.push('/login')
    }

    if (auth.authenticated) {
      if (
        auth?.user.groupId !== 1 &&
        (path.includes('closing') ||
          path.includes('clients/create') ||
          path.includes('projects/create') ||
          path.includes('clients/users') ||
          path.includes('company/collaborators') ||
          path.includes('company/users'))
      ) {
        router.push('/home')
      }
    }
  }, [auth.authenticated, router, path])

  if (!hasMounted) {
    return <Loading />
  }

  return (
    <NextUIProvider>
      <Header auth={auth} />
      {children}
      <Toaster richColors />
    </NextUIProvider>
  )
}
