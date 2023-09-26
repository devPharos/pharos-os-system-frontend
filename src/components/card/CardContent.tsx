import { ReactNode } from 'react'

interface CardContentProps {
  children: ReactNode
}
export function CardContent({ children }: CardContentProps) {
  return <main className="flex gap-4">{children}</main>
}
