import { ReactNode } from 'react'

interface CardRootProps {
  children: ReactNode
}

export default function CardRoot({ children }: CardRootProps) {
  return (
    <div className="w-full cursor-pointer flex flex-col gap-4 border-2 border-transparent rounded-lg bg-gray-700 p-6 hover:bg-gray-600 hover:border-2 hover:border-gray-500">
      {children}
    </div>
  )
}
