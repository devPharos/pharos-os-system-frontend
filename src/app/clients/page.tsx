'use client'
import ClientTable from '@/components/tables/client'
import { useRegister } from '@/hooks/useRegister'
import Header from '@/layouts/header'
import PageHeader from '@/layouts/page-header'
import axios from 'axios'
import { useEffect } from 'react'

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

        <ClientTable />
      </main>
    </div>
  )
}
