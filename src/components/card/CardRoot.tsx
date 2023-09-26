import { ReactNode } from 'react'

interface CardRootProps {
  children: ReactNode
}

export default function CardRoot({ children }: CardRootProps) {
  return (
    <div className="w-full flex flex-col gap-4 rounded-lg bg-gray-700 p-6">
      {children}
    </div>
  )
}
