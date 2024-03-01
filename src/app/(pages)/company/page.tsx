'use client'

import { PlusCircle } from 'lucide-react'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Collaborator } from '@/types/collaborator'
import { UserState, useUser } from '@/app/contexts/useUser'
import { getCollaborators } from '@/functions/requests'
import { CompanyHeader } from './company-header'
import { CompanyStatusFilter } from './filters/company-status-filter'
import { CompanySearchFilter } from './filters/company-search-filter'
import { CompanyCard } from './company-card'

export default function Company() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const router = useRouter()
  const { auth }: { auth: UserState } = useUser()

  useEffect(() => {
    async function fetchData() {
      const response = await getCollaborators(auth?.token)
      setCollaborators(response)
    }

    fetchData()
  }, [auth?.token])

  return (
    <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
      <CompanyHeader />

      <header className="flex items-center justify-between gap-6">
        <CompanySearchFilter
          collaborators={collaborators}
          setCollaborators={setCollaborators}
        />

        <CompanyStatusFilter
          collaborators={collaborators}
          setCollaborators={setCollaborators}
        />

        {auth.user?.groupId === 1 && (
          <Button
            onClick={() => router.push('/company/collaborators')}
            className="rounded-full px-6 py-4 hover:text-gray-700 text-yellow-500 font-bold border-dashed border-2 min-w-fit bg-transparent border-yellow-500 hover:bg-yellow-500"
          >
            <PlusCircle size={18} />
            Adicionar colaborador
          </Button>
        )}
      </header>

      <section className="flex flex-wrap w-full gap-6">
        {collaborators &&
          collaborators.map((collaborator) => {
            if (!collaborator.hide) {
              return (
                <CompanyCard
                  collaborator={collaborator}
                  key={collaborator.id}
                />
              )
            }

            return null
          })}
      </section>
    </main>
  )
}
