'use client'
import Loading from '@/components/Loading'
import { useUser } from '../contexts/useUser'
import { NextUIProvider } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { Toaster } from 'sonner'
import { useEffect, useState } from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [hasMounted, setHasMounted] = useState(false)
  const { auth } = useUser()
  const router = useRouter()

  useEffect(() => {
    setHasMounted(true)
    if (auth.authenticated) {
      router.push('/home')
    }
  }, [])

  if (!hasMounted) {
    return <Loading />
  }

  return (
    <NextUIProvider>
      {children}
      <Toaster richColors />
    </NextUIProvider>
  )
}
