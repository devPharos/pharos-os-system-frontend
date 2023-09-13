'use client'
import Card from '@/components/card'
import Header from '@/layouts/header'
import PageHeader from '@/layouts/page-header'
import {
  AlertCircle,
  ArrowRightCircle,
  CheckCircle2,
  GaugeCircle,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="flex flex-col gap-14 max-w-7xl w-full px-6 py-14">
        <PageHeader label="Lançar OS de hoje" title="Bem vindo (a), Thayná!" />

        <section className="flex gap-6">
          <Card
            color="gray-100"
            icon={GaugeCircle}
            label="Tickets em aberto"
            quantity={32}
          />

          <Card
            color="red-500"
            icon={AlertCircle}
            label="Tickets em atraso"
            quantity={2}
          />

          <Card
            color="yellow-500"
            icon={ArrowRightCircle}
            label="Tickets em andamento"
            quantity={12}
          />

          <Card
            color="green-500"
            icon={CheckCircle2}
            label="Tickets concluídos esse mês"
            quantity={52}
          />
        </section>
      </main>
    </div>
  )
}
