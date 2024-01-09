'use client'
import Loading from '@/components/Loading'
import { useRouter } from 'next/navigation'

const NotFoundPage = () => {
  const router = useRouter()

  router.push('/home')

  return <Loading />
}

export default NotFoundPage
