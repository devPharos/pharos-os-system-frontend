'use client'
import { redirect } from 'next/navigation'

export default function NotFoundPage() {
  redirect('/home')
}
