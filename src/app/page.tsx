'use client'

import Loading from '@/components/Loading'
import { useVerifyPathPermission } from '@/hooks/usePermission'

export default function HomePage() {
  useVerifyPathPermission()

  return <Loading />
}
