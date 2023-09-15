import { User } from '@/types/user'
import { usePathname, useRouter } from 'next/navigation'

export function useVerifyPathPermission(accessToken: string | null) {
  const pathName = usePathname()
  const APP_ROUTES = {
    public: {
      login: '/login',
    },
  }
  const router = useRouter()

  const isPublic = Object.values(APP_ROUTES.public).includes(pathName)

  const isHome = pathName === '/'

  if (!isPublic && !accessToken) {
    router.push('/login')
  }

  if (isPublic && accessToken) {
    router.push('/')
  }
}
