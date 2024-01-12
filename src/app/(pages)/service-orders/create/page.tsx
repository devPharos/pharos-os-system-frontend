'use client'

import Header from '@/layouts/header'
import CreateOSForm from './form'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ServiceOrder } from '@/types/service-order'
import Loading from '@/components/Loading'
import { useRegister } from '@/hooks/useRegister'

export default function CreateOS() {
  const searchParams = useSearchParams()
  const params = Array.from(searchParams.values())
  const [serviceOrder, setServiceOrder] = useState<ServiceOrder>()
  const id = params[0]
  const [loading, setLoading] = useState<boolean>(false)
  const { token } = useRegister()

  useEffect(() => {
    if (typeof window !== undefined && id) {
      setLoading(true)

      const body = {
        serviceOrderId: id,
      }

      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/service-order/data`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoading(false)
          setServiceOrder(response.data)
        })
    }
  }, [id, token])

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
