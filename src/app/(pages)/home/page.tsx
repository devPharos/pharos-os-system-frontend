'use client'
import { Card } from '@/components/Card'
import { useRegister } from '@/hooks/useRegister'
import Header from '@/layouts/header'
import PageHeader from '@/layouts/page-header'
import { HomeData } from '@/types/home'
import axios from 'axios'
import {
  AlertCircle,
  ArrowRightCircle,
  CheckCircle2,
  GaugeCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Home() {
  const [data, setData] = useState<HomeData>()
  const { token } = useRegister()
  console.log(token)

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/list/home/data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data)
          setData(response.data)
        })
    }
  }, [token])

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="flex flex-col gap-14 max-w-7xl w-full px-6 py-14">
        <PageHeader
          label="Lançar OS de hoje"
          title={`Bem vindo (a), ${data?.name}!`}
        />

        <section className="flex gap-6 max-lg:flex-wrap">
          <Card.Root>
            <Card.Header>
              <Card.Title label="Tickets em aberto" />
              <Card.Icon icon={GaugeCircle} />
            </Card.Header>
            <Card.Content>
              <Card.Quantity
                color="gray-100"
                quantity={data?.openTickets || 0}
              />
            </Card.Content>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Title label="Tickets em atraso" />
              <Card.Icon icon={AlertCircle} />
            </Card.Header>
            <Card.Content>
              <Card.Quantity
                color="red-500"
                quantity={data?.overdueTickets || 0}
              />
            </Card.Content>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Title label="Tickets em andamento" />
              <Card.Icon icon={ArrowRightCircle} />
            </Card.Header>
            <Card.Content>
              <Card.Quantity
                color="yellow-500"
                quantity={data?.inProgressTickets || 0}
              />
            </Card.Content>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Title label="Tickets concluídos esse mês" />
              <Card.Icon icon={CheckCircle2} />
            </Card.Header>
            <Card.Content>
              <Card.Quantity
                color="green-500"
                quantity={data?.doneTickets || 0}
              />
            </Card.Content>
          </Card.Root>
        </section>
      </main>
    </div>
  )
}
