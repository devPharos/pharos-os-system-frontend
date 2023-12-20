'use client'

import Header from '@/layouts/header'
import { Card } from '@/components/Card'

import {
  Building2,
  CheckCircle2,
  Eraser,
  PencilLine,
  PlusCircle,
  Search,
  XCircle,
} from 'lucide-react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { Key, useEffect, useState } from 'react'
import axios from 'axios'
import { Collaborator } from '@/types/collaborator'

export default function Company() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const router = useRouter()

  useEffect(() => {
    if (window !== undefined) {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')

      axios
        .get('http://localhost:3333/collaborators/data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCollaborators(response.data)
        })
    }
  }, [])

  const handleEdit = (key: Key, id: string, userId: string | undefined) => {
    router.push(`/company/${key}?id=${key === 'collaborators' ? id : userId}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
        <header className="flex items-center justify-between">
          <section className="flex flex-col">
            <span className="font-bold text-2xl text-white">Sua empresa</span>
            <span className="text-gray-300">
              Gerencie todos os seus colaboradores
            </span>
          </section>

          <section className="space-x-6">
            <Button
              onClick={() => router.push('/company/collaborators')}
              className="rounded-full px-6 py-4 border-2 border-dashed border-yellow-500 hover:text-gray-700 text-yellow-500 font-bold bg-transparent hover:bg-yellow-500"
            >
              <PlusCircle size={18} />
              Adicionar colaborador
            </Button>

            <Button
              onClick={() => router.push('/company/users')}
              className="rounded-full px-6 py-4 text-gray-700 font-bold bg-yellow-500 hover:bg-yellow-600"
            >
              <PlusCircle size={18} className="text-gray-700" />
              Adicionar usuário
            </Button>
          </section>
        </header>

        <header className="flex items-center justify-between">
          <section className="flex w-6/12 gap-6">
            <Input
              placeholder="Buscar"
              startContent={<Search className="w-5 h-5 text-gray-300" />}
              classNames={{
                label: 'font-semibold text-gray-300',
                inputWrapper:
                  'bg-transparent border border-1 rounded-lg border-gray-300 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 px-4 py-2',
              }}
            />
          </section>
        </header>

        <section className="flex flex-wrap w-full gap-6">
          {collaborators &&
            collaborators.map((collaborator) => (
              <Dropdown
                classNames={{
                  base: 'bg-gray-700 rounded-lg w-full flex-1',
                }}
                backdrop="opaque"
                key={collaborator.id}
              >
                <DropdownTrigger>
                  <Button className="p-0 rounded-none h-fit  w-full  bg-transparent min-w-fit max-w-sm">
                    <Card.Root
                      key={collaborator.id}
                      className="hover:bg-gray-600 hover:border-2 hover:border-gray-500 items-stretch min-w-fit max-w-sm"
                    >
                      <Card.Header>
                        <Card.Title
                          label={
                            collaborator.name + ' ' + collaborator.lastName
                          }
                        />
                        <section className="flex items-center gap-2">
                          {!collaborator.userId && (
                            <Card.Badge
                              className="text-blue-500 bg-blue-500/10"
                              status={'Sem acesso'}
                            />
                          )}
                        </section>
                      </Card.Header>
                    </Card.Root>
                  </Button>
                </DropdownTrigger>

                <DropdownMenu
                  itemClasses={{
                    base: 'rounded-lg data-[hover=true]:bg-gray-800 data-[hover=true]:text-gray-200 data-[selected=true]:text-gray-100 data-[selected=true]:font-bold',
                  }}
                  onAction={(key: Key) =>
                    handleEdit(key, collaborator.id, collaborator?.userId)
                  }
                >
                  <DropdownItem
                    startContent={
                      <Card.Badge
                        status=""
                        className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                        icon={PencilLine}
                      />
                    }
                    key={'collaborators'}
                  >
                    Editar colaborador
                  </DropdownItem>

                  <DropdownItem
                    startContent={
                      <Card.Badge
                        status=""
                        className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                        icon={PencilLine}
                      />
                    }
                    key={'users'}
                    className={!collaborator.userId ? 'hidden' : undefined}
                  >
                    Editar usuário
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ))}
        </section>
      </main>
    </div>
  )
}
