interface CardHeaderBadgeProps {
  status: string
}
export function CardHeaderBadge({ status }: CardHeaderBadgeProps) {
  return (
    <section
      className={`text-${
        status === 'Ativo' ? 'green' : 'red'
      }-900 font-bold text-xs flex gap-2 items-center bg-${
        status === 'Ativo' ? 'green' : 'red'
      }-100 px-2.5 py-1 rounded-full`}
    >
      {status}
    </section>
  )
}
