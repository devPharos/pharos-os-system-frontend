'use client'

import Header from '@/layouts/header'
import { Card } from '@/components/Card'

import { CheckCircle2, Eraser, PlusCircle, Search, XCircle } from 'lucide-react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
} from '@nextui-org/react'

export default function Company() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
        <header className="flex items-center justify-between">
          <section className="flex flex-col">
            <span className="font-bold text-2xl text-white">Clientes</span>
            <span className="text-gray-300">Gerencie todos os clientes</span>
          </section>

          <Button className="rounded-full px-6 py-4 text-gray-700 font-bold bg-yellow-500 hover:bg-yellow-600">
            <PlusCircle size={18} className="text-gray-700" />
            Adicionar cliente
          </Button>
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

        <section className="flex flex-wrap w-full gap-6"></section>
      </main>
    </div>
  )
}
