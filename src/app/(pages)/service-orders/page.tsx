'use client'

import PageHeader from '@/layouts/page-header'
import { ServiceOrderCard, ServiceOrderPage } from '@/types/service-order'
import { useEffect, useState } from 'react'
import { useUser } from '@/app/contexts/useUser'
import { listServiceOrders } from '@/functions/requests'
import { ServiceOrderHeader } from './service-order-header'
import { OsCard } from './os-card'

export default function ServiceOrders() {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrderCard[]>([])

  const [serviceOrderData, setServiceOrderData] = useState<ServiceOrderPage>()

  const { auth } = useUser()

  useEffect(() => {
    async function fetchData() {
      if (typeof window !== 'undefined' && auth?.token) {
        const osList = await listServiceOrders(auth?.token)
        console.log(osList)
        setServiceOrders(osList.serviceOrders)
        setServiceOrderData(osList)
      }
    }

    fetchData()
  }, [auth?.token])

  return (
    <>
      <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
        <PageHeader
          title="Ordens de serviço"
          subtitle="Gerencie todas suas ordens de serviço"
          label="Adicionar OS"
        />

        <>
          <ServiceOrderHeader
            serviceOrderData={serviceOrderData}
            setServiceOrders={setServiceOrders}
            serviceOrders={serviceOrders}
          />

          <section className="flex flex-wrap w-full gap-6">
            {serviceOrders?.map((serviceOrder) => {
              if (!serviceOrder.hide) {
                return (
                  <OsCard serviceOrder={serviceOrder} key={serviceOrder.id} />
                )
              } else {
                return null
              }
            })}
          </section>
        </>
      </main>
    </>
  )
}
