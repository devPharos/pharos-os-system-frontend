interface CardContentProps {
  color: string
  quantity: number
}
export function CardContent({ color, quantity }: CardContentProps) {
  return <span className={`text-2xl font-bold text-${color}`}>{quantity}</span>
}
