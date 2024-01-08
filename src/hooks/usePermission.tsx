import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useVerifyPathPermission() {
  const token =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('access_token')
      : ''
  const pathName = usePathname()

  const APP_ROUTES = {
    public: {
      login: '/login',
    },
  }
  const router = useRouter()

  const isPublic = Object.values(APP_ROUTES.public).includes(pathName)

  useEffect(() => {
    if (!isPublic && !token) {
      router.push('/login')
    }

    if (isPublic && token) {
      router.push('/')
    }
  }, [isPublic, token, router])
}
