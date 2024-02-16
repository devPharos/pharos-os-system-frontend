'use client'
import { useUser } from '@/app/contexts/useUser'
import { Button } from '@nextui-org/react'
import { PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ProjectHeader() {
  const { auth } = useUser()
  const router = useRouter()

  return (
    <header className="flex items-center justify-between">
      <section className="flex flex-col">
        <span className="font-bold text-2xl text-white">Projetos</span>
        <span className="text-gray-300">Gerencie todos os projetos</span>
      </section>

      {auth?.user?.groupId === 1 && (
        <Button
          className="rounded-full px-6 py-4 text-gray-700 font-bold bg-yellow-500 hover:bg-yellow-600"
          onClick={() => router.push('/projects/create')}
        >
          <PlusCircle size={18} className="text-gray-700" />
          Adicionar projeto
        </Button>
      )}
    </header>
  )
}
