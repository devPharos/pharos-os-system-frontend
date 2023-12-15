import { ElementType, HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface CardHeaderBadgeProps extends HTMLAttributes<HTMLElement> {
  status: string | undefined
  icon?: ElementType
}
export function CardHeaderBadge({
  status,
  icon: Icon,
  ...rest
}: CardHeaderBadgeProps) {
  return (
    <section
      {...rest}
      className={twMerge(
        'font-bold text-xs flex gap-2 items-center px-2.5 py-1 rounded-full',
        rest.className,
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {status}
    </section>
  )
}
