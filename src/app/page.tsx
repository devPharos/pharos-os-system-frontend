'use client'
import { useVerifyPathPermission } from '@/hooks/usePermission'

export default function Home() {
  useVerifyPathPermission()
}
