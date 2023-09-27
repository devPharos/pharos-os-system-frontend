'use client'
import { Card } from '@/components/Card'
import ServiceOrdersTable from '@/components/tables/service-orders'
import Header from '@/layouts/header'
import PageHeader from '@/layouts/page-header'
import { Button, Input } from '@nextui-org/react'
import { AlertCircle, ArrowRightCircle, Building2, Calendar, CircleDashed, CircleDollarSign, Clock, Eye, Pencil, PersonStanding, PlusCircle, Search, User, Users2, XCircle } from 'lucide-react'

export default function ServiceOrders() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
        <PageHeader
          title="Ordens de serviço"
          subtitle="Gerencie todas suas ordens de serviço"
          label="Adicionar OS"
        />

        <header className="flex items-center justify-between">
          <section className="flex w-6/12 gap-6">
            <Input
              placeholder="Buscar"
              startContent={<Search className="w-5 h-5 text-gray-300" />}
              classNames={{
                label: 'font-semibold text-gray-300',
                inputWrapper:
                  'bg-transparent border border-1 rounded-lg border-gray-300 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 px-4 py-2',
              }}
            />

            <Button
              className="rounded-lg border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold"
              startContent={<PlusCircle size={40} />}
            >
              Status
            </Button>
          </section>

          <section className="space-x-6">
            <Button className="rounded-full border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold">
              <Pencil size={16} />
              Alterar
            </Button>

            <Button className="rounded-full border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold">
              <Eye size={16} />
              Visualizar
            </Button>
          </section>
        </header>

        <section className="flex flex-wrap gap-6">
          <Card.Root className='hover:bg-gray-600 hover:border-2 hover:border-gray-500 min-w-fit max-w-sm'>
            <Card.Header>
              <section className='flex items-center gap-2'>
                <Card.Badge
                  className="text-gray-300/80  rounded-md bg-gray-500/20"
                  status="01/02/23"
                />
                <Card.Title label="Pharos IT Solutions" />
              </section>
              <Card.Badge
                className="text-red-500 bg-red-500/10"
                status="Em aberto"
                icon={AlertCircle}
              />
            </Card.Header>
            <Card.Content>
              <Card.Info icon={User} info="Thayná Gitirana" />
              <Card.Info icon={Clock} info="09:30 - 17:30" />
            </Card.Content>
          </Card.Root>

          <Card.Root className='hover:bg-gray-600 hover:border-2 hover:border-gray-500 min-w-fit max-w-sm'>
            <Card.Header>
              <section className='flex items-center gap-2'>
                <Card.Badge
                  className="text-gray-300/80  rounded-md bg-gray-500/20"
                  status="01/02/23"
                />
                <Card.Title label="Pharos IT Solutions" />
              </section>
              <Card.Badge
                className="text-orange-600 bg-orange-600/10"
                status="Enviado ao cliente"
                icon={ArrowRightCircle}
              />
            </Card.Header>
            <Card.Content>
              <Card.Info icon={User} info="Thayná Gitirana" />
              <Card.Info icon={Clock} info="09:30 - 17:30" />
            </Card.Content>
          </Card.Root>

          <Card.Root className='hover:bg-gray-600 hover:border-2 hover:border-gray-500 min-w-fit max-w-sm'>
            <Card.Header>
              <section className='flex items-center gap-2'>
                <Card.Badge
                  className="text-gray-300/80  rounded-md bg-gray-500/20"
                  status="01/02/23"
                />
                <Card.Title label="Pharos IT Solutions" />
              </section>
              <Card.Badge
                className="text-green-500 bg-green-500/10"
                status="Faturado"
                icon={CircleDollarSign}
              />
            </Card.Header>
            <Card.Content>
              <Card.Info icon={User} info="Thayná Gitirana" />
              <Card.Info icon={Clock} info="09:30 - 17:30" />
            </Card.Content>
          </Card.Root>

          <Card.Root className='hover:bg-gray-600 hover:border-2 hover:border-gray-500 min-w-fit max-w-sm'>
            <Card.Header>
              <section className='flex items-center gap-2'>
                <Card.Badge
                  className="text-gray-300/80  rounded-md bg-gray-500/20"
                  status="01/02/23"
                />
                <Card.Title label="Pharos IT Solutions" />
              </section>
              <Card.Badge
                className="text-gray-300/80 bg-gray-500/10"
                status="Cancelado"
                icon={XCircle}
              />
            </Card.Header>
            <Card.Content>
              <Card.Info icon={User} info="Thayná Gitirana" />
              <Card.Info icon={Clock} info="09:30 - 17:30" />
            </Card.Content>
          </Card.Root>
        </section>
      </main>
    </div>
  )
}
