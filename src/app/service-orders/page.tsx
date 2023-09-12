'use client'
import ServiceOrdersTable from '@/components/tables/service-orders'
import Header from '@/layouts/header'
import PageHeader from '@/layouts/page-header'

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

        <ServiceOrdersTable />
      </main>
    </div>
  )
}
