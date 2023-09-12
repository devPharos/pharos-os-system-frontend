import { Button } from '@nextui-org/react'
import { PlusCircle } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string | undefined
  label: string
}

export default function PageHeader({
  label,
  title,
  subtitle = undefined,
}: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <section className="flex flex-col">
        <span className="font-bold text-2xl text-white">{title}</span>
        {subtitle && <span className="text-gray-300">{subtitle}</span>}
      </section>

      <Button className="rounded-full px-6 py-4 text-gray-700 font-bold bg-yellow-500 hover:bg-yellow-600">
        <PlusCircle size={18} className="text-gray-700" />
        {label}
      </Button>
    </header>
  )
}
