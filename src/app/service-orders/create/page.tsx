'use client'

import Header from '@/layouts/header'
import CreateOSForm from './form'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ServiceOrder } from '@/types/service-order'
import Loading from '@/components/Loading'

export default function CreateOS() {
  const searchParams = useSearchParams()
  const params = Array.from(searchParams.values())
  const [serviceOrder, setServiceOrder] = useState<ServiceOrder>()
  const id = params[0]
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    if (window !== undefined && id) {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')

      const body = {
        serviceOrderId: id,
      }

      axios
        .post('http://localhost:3333/service-order/data', body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoading(false)
          setServiceOrder(response.data)
        })
    }
  }, [id])

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      {loading ? (
        <Loading />
      ) : (
        <CreateOSForm id={id} serviceOrder={serviceOrder} />
      )}
    </div>
  )
}
