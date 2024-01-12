'use client'
import Loading from '@/components/Loading'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const NotFoundPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/home')
  }, [router])

  return <Loading />
}

export default NotFoundPage
