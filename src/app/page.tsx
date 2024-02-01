'use client'
import { UserState, useUser } from './contexts/useUser'
import { redirect } from 'next/navigation'

export default function HomePage() {
  const { auth }: { auth: UserState } = useUser()

  if(!auth.authenticated) {
    redirect('/login')
  } else {
    redirect('/home')
  }

}
