'use client'

import ProjectTable from '@/components/tables/projects'
import Header from '@/layouts/header'
import PageHeader from '@/layouts/page-header'

export default function Projects() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
        <PageHeader
          title="Projetos"
          subtitle="Gerencie todos os seus projetos"
          label="Adicionar projeto"
        />

        <ProjectTable />
      </main>
    </div>
  )
}
