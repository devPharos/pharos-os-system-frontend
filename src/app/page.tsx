'use client'
import Loading from '@/components/Loading'
import { UserState, useUser } from './contexts/useUser'
import { redirect } from 'next/navigation'

export default function HomePage() {
  const { auth }: { auth: UserState } = useUser()

  if(!auth.authenticated) {
    redirect('/login')
  } else {
    redirect('/home')
  }

  return null

}
