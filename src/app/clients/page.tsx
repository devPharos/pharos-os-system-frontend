'use client'
import ClientTable from '@/components/tables/client'
import { useRegister } from '@/hooks/useRegister'
import Header from '@/layouts/header'
import PageHeader from '@/layouts/page-header'
import { Card } from '@/components/Card'
import axios from 'axios'
import {
  ArrowRightCircle,
  Building2,
  Eye,
  Monitor,
  Pencil,
  PlusCircle,
  Search,
} from 'lucide-react'
import { useEffect } from 'react'
import { Button, Input } from '@nextui-org/react'

export default function Clients() {
  const token = localStorage.getItem('access_token')

  useEffect(() => {
    axios
      .get('http://localhost:3333/clients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        const data = response.data
        console.log(data)
      })
      .catch(function (error) {
        console.error(error)
      })
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
        <PageHeader
          title="Clientes"
          subtitle="Gerencie todos os clientes"
          label="Adicionar cliente"
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
              className="rounded-lg border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:font-bold"
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

        <section className="flex gap-6">
          <Card.Root>
            <Card.Header>
              <Card.Title label="Pharos IT Solutions" />
              <Card.Badge status="Ativo" />
            </Card.Header>
            <Card.Content>
              <Card.Info icon={Building2} info="36.321.105/0001-90" />
              <Card.Info icon={Monitor} info="24" />
            </Card.Content>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Title label="Pharos IT Solutions" />
              <Card.Badge status="Inativo" />
            </Card.Header>
            <Card.Content>
              <Card.Info icon={Building2} info="36.321.105/0001-90" />
              <Card.Info icon={Building2} info="24" />
            </Card.Content>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Title label="Pharos IT Solutions" />
              <Card.Badge status="Ativo" />
            </Card.Header>
            <Card.Content>
              <Card.Info icon={Building2} info="36.321.105/0001-90" />
              <Card.Info icon={Building2} info="24" />
            </Card.Content>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Title label="Pharos IT Solutions" />
              <Card.Badge status="Ativo" />
            </Card.Header>
            <Card.Content>
              <Card.Info icon={Building2} info="36.321.105/0001-90" />
              <Card.Info icon={Building2} info="24" />
            </Card.Content>
          </Card.Root>
        </section>
      </main>
    </div>
  )
}
