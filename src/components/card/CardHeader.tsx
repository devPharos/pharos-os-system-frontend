import { ElementType, ReactNode } from 'react'

interface CardHeaderProps {
  children: ReactNode
}

export function CardHeader({ children }: CardHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-2">{children}</header>
  )
}
