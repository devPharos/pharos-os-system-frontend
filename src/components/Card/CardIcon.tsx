import { ElementType } from 'react'

interface CardIconProps {
  icon: ElementType
}
export function CardIcon({ icon: Icon }: CardIconProps) {
  return <Icon className="w-4 h-4 text-gray-200" />
}
