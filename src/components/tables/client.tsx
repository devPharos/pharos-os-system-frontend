'use client'

import { Button, Input } from '@nextui-org/react'
import {
  ChevronsUpDown,
  Eye,
  Pencil,
  PlusCircle,
  Search,
  Square,
} from 'lucide-react'

export default function ClientTable() {
  return (
    <div className="flex flex-col gap-4">
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

          <Button
            className="rounded-lg border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold"
            startContent={<PlusCircle size={40} />}
          >
            Status
          </Button>
        </section>

        <section className="space-x-6">
          <Button className="rounded-full border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold">
            <Pencil size={16} />
            Alterar
          </Button>

          <Button className="rounded-full border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold">
            <Eye size={16} />
            Visualizar
          </Button>
        </section>
      </header>

      <table className="bg-gray-700 rounded-lg">
        <thead>
          <tr className="flex items-center">
            <th className="px-4 py-2">
              <Square size={18} className="text-gray-200" />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-3/12">
              Razão social
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-3/12">
              Nome fantasia
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-2/12">
              CNPJ
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-2/12">
              Situação
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs">
              Projetos
              <ChevronsUpDown size={14} />
            </th>
          </tr>
        </thead>

        <tbody className="w-full">
          <tr className="flex items-center">
            <td className="px-4 py-2">
              <Square size={18} className="text-gray-100" />
            </td>

            <td className="px-4 py-2 w-3/12 text-gray-100 font-normal text-sm">
              Pharos IT Solutions LTDA
            </td>

            <td className="px-4 py-2 w-3/12 text-gray-100 font-normal text-sm">
              Pharos IT Solutions
            </td>

            <td className="px-4 py-2  w-2/12 text-gray-100 font-normal text-sm">
              00110000222
            </td>

            <td className="px-4 py-2  w-2/12 text-gray-100 font-normal text-sm flex gap-2 items-center">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              Ativo
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm">24</td>
          </tr>

          <tr className="flex items-center">
            <td className="px-4 py-2">
              <Square size={18} className="text-gray-100" />
            </td>

            <td className="px-4 py-2 w-3/12 text-gray-100 font-normal text-sm">
              Pharos IT Solutions LTDA
            </td>

            <td className="px-4 py-2 w-3/12 text-gray-100 font-normal text-sm">
              Pharos IT Solutions
            </td>

            <td className="px-4 py-2  w-2/12 text-gray-100 font-normal text-sm">
              00110000222
            </td>

            <td className="px-4 py-2  w-2/12 text-gray-100 font-normal text-sm flex gap-2 items-center">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              Inativo
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm">24</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
