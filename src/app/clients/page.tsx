'use client'
import ClientTable from '@/components/tables/client'
import Header from '@/layouts/header'
import PageHeader from '@/layouts/page-header'

export default function Clients() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
        <PageHeader
          title="Clientes"
          subtitle="Gerencie todos os clientes"
          label="Adicionar cliente"
        />

        <ClientTable />
      </main>
    </div>
  )
}
