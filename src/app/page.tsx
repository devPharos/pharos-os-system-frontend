'use client'
import { Card } from '@/components/Card'
import { useRegister } from '@/hooks/useRegister'
import Header from '@/layouts/header'
import PageHeader from '@/layouts/page-header'
import {
  AlertCircle,
  ArrowRightCircle,
  CheckCircle2,
  GaugeCircle,
} from 'lucide-react'

export default function Home() {
  const { user } = useRegister()

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="flex flex-col gap-14 max-w-7xl w-full px-6 py-14">
        <PageHeader label="Lançar OS de hoje" title="Bem vindo (a), Thayná!" />

        <section className="flex gap-6 max-lg:flex-wrap">
          <Card.Root>
            <Card.Header icon={GaugeCircle} label="Tickets em aberto" />
            <Card.Content color="gray-100" quantity={32} />
          </Card.Root>

          <Card.Root>
            <Card.Header icon={AlertCircle} label="Tickets em atraso" />
            <Card.Content color="red-500" quantity={2} />
          </Card.Root>

          <Card.Root>
            <Card.Header icon={ArrowRightCircle} label="Tickets em andamento" />
            <Card.Content color="yellow-500" quantity={12} />
          </Card.Root>

          <Card.Root>
            <Card.Header
              icon={CheckCircle2}
              label="Tickets concluídos esse mês"
            />
            <Card.Content color="green-500" quantity={12} />
          </Card.Root>
        </section>
      </main>
    </div>
  )
}
