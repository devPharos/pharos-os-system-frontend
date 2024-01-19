'use client'

import Loading from '@/components/Loading'
import Header from '@/layouts/header'
import MainHeader from '@/layouts/mainHeader'
import { useEffect, useState } from 'react'

export default function Closing() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      {loading ? (
        <Loading />
      ) : (
        <>
          <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
            <MainHeader
              buttonLabel="Criar fechamento"
              route="/closing/create"
              title="Fechamento mensal"
            />

            <section className="flex flex-wrap w-full gap-6"> </section>
          </main>
        </>
      )}
    </div>
  )
}
