'use client'
import SupportTable from '@/components/tables/support'
import Header from '@/layouts/header'
import PageHeader from '@/layouts/page-header'

export default function Support() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
        <PageHeader
          title="Suporte"
          subtitle="Gerencie todos os tickets abertos em seu nome"
          label="Abrir ticket"
        />

        <SupportTable />
      </main>
    </div>
  )
}
