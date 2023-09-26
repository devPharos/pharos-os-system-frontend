import { ElementType } from 'react'

interface CardHeaderProps {
  icon: ElementType
  label: string
}

export function CardHeader({ icon: Icon, label }: CardHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-200">{label}</span>
      <Icon className="w-4 h-4 text-gray-200" />
    </header>
  )
}
