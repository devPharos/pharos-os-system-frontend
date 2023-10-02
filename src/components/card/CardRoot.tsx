import { HTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface CardRootProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

export default function CardRoot({ children, ...rest }: CardRootProps) {
  return (
    <div
      {...rest}
      className={twMerge(
        'w-full cursor-pointer flex flex-col gap-4 border-2 border-transparent rounded-lg bg-gray-700 p-6',
        rest.className,
      )}
    >
      {children}
    </div>
  )
}
