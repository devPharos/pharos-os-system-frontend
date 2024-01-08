interface CardContentQuantityProps {
  color: string
  quantity: number
}

export function CardContentQuantity({
  color,
  quantity,
}: CardContentQuantityProps) {
  return <span className={`text-2xl font-bold text-${color}`}>{quantity}</span>
}
