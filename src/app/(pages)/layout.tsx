'use client'
import Header from '@/layouts/header'
import '../global.css'
import { UserState, useUser } from '../contexts/useUser'
import { redirect } from 'next/navigation'
import { useMounted } from '../(public)/layout'
import Loading from '@/components/Loading'

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { auth } = useUser()

  return (
    <>
      <Header auth={auth} />
      {children}
    </>
  )
}
