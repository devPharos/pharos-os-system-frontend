import { usePathname, redirect } from 'next/navigation'

export function useVerifyPathPermission(
  loading?: boolean,
  token?: string | null,
) {
  const pathName = usePathname()

  const APP_ROUTES = {
    public: {
      login: '/login',
    },
  }

  const isPublic = Object.values(APP_ROUTES.public).includes(pathName)

  const isHome = pathName === '/'

  if (!isPublic && !token && !loading) {
    redirect('/login')
  }

  if ((isPublic || isHome) && token && !loading) {
    redirect('/home')
  }
}
