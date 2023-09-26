interface CardHeaderTitleProps {
  label: string
}
export function CardHeaderTitle({ label }: CardHeaderTitleProps) {
  return <span className="text-sm font-medium text-gray-200">{label}</span>
}
