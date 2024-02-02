'use client'
import Header from '@/layouts/header'
import '../global.css'
import { useUser } from '../contexts/useUser'
import { useRouter } from 'next/navigation'
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

  useEffect(() => {
    setHasMounted(true)
    if (!auth.authenticated) {
      router.push('/login')
    }
  }, [auth.authenticated, router])

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
