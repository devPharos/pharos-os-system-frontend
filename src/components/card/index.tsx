import { ElementType } from 'react'

interface CardProps {
  icon: ElementType
  label: string
  color: string
  quantity: number
}

export default function Card({
  icon: Icon,
  label,
  color,
  quantity,
}: CardProps) {
  return (
    <div className="w-full flex flex-col gap-4 rounded-lg bg-gray-700 p-6">
      <header className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-200">{label}</span>
        <Icon className="w-4 h-4 text-gray-200" />
      </header>

      <span className={`text-2xl font-bold text-${color}`}>{quantity}</span>
    </div>
  )
}
