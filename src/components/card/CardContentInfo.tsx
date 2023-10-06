import { ElementType } from 'react'

interface CardContentInfoProps {
  info: string
  icon: ElementType
}

export function CardContentInfo({ info, icon: Icon }: CardContentInfoProps) {
  return (
    <section className="text-sm flex items-center gap-2">
      <Icon className="w-4 h-4 text-gray-400" />
      <span className="text-gray-300 text-sm">{info}</span>
    </section>
  )
}
