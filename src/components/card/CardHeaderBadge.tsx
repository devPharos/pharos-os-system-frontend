import { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface CardHeaderBadgeProps extends HTMLAttributes<HTMLElement> {
  status: string
}
export function CardHeaderBadge({ status, ...rest }: CardHeaderBadgeProps) {
  return (
    <section
      {...rest}
      className={twMerge(
        'font-bold text-xs flex gap-2 items-center px-2.5 py-1 rounded-full',
        rest.className,
      )}
    >
      {status}
    </section>
  )
}
