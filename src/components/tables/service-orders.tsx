'use client'

import { Button, Input } from '@nextui-org/react'
import {
  AlertCircle,
  ArrowRightCircle,
  CheckCircle2,
  ChevronsUpDown,
  CircleDollarSign,
  Eye,
  Pencil,
  PlusCircle,
  Search,
  Square,
  XCircle,
} from 'lucide-react'

export default function ServiceOrdersTable() {
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

      <table className="bg-gray-700 rounded-lg flex flex-col gap-2">
        <thead>
          <tr className="flex items-center">
            <th className="px-4 py-2">
              <Square size={18} className="text-gray-200" />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-[118.49px]">
              Data
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-2/12">
              Cliente
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-2/12">
              Usuário
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-1/12">
              Início
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-1/12">
              Término
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-2/12">
              Coordenador
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-2/12">
              Status
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-2/12">
              Atendimento
              <ChevronsUpDown size={14} />
            </th>
          </tr>
        </thead>

        <tbody className="w-full flex flex-col gap-2">
          <tr className="flex items-center">
            <td className="px-4 py-2">
              <Square size={18} className="text-gray-100" />
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-[105px]">
              01/02/2023
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12">
              PharosIT Solutions
            </td>

            <td className="px-4 py-2  text-gray-100 font-normal text-sm w-2/12">
              Thayná Gitirana
            </td>

            <td className="px-4 py-2  text-gray-100 font-normal text-sm w-1/12">
              09:30
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12">
              18:30
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12">
              Denis Varella
            </td>

            <td className="px-4 py-2  text-gray-100 font-normal text-sm flex gap-2 items-center w-2/12">
              <AlertCircle size={16} />
              Em aberto
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12">
              <div className="border border-1 border-gray-300 font-medium rounded-md py-1 flex items-center justify-center text-xs">
                <span>Remoto</span>
              </div>
            </td>
          </tr>

          <tr className="flex items-center">
            <td className="px-4 py-2">
              <Square size={18} className="text-gray-100" />
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-[105px]">
              01/02/2023
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12">
              PharosIT Solutions
            </td>

            <td className="px-4 py-2  text-gray-100 font-normal text-sm w-2/12">
              Thayná Gitirana
            </td>

            <td className="px-4 py-2  text-gray-100 font-normal text-sm w-1/12">
              09:30
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12">
              18:30
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12">
              Denis Varella
            </td>

            <td className="px-4 py-2  text-gray-100 font-normal text-sm flex gap-2 items-center w-2/12">
              <ArrowRightCircle size={16} />
              Enviado ao cliente
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12">
              <div className="border border-1 border-gray-300 font-medium rounded-md py-1 flex items-center justify-center text-xs">
                <span>Remoto</span>
              </div>
            </td>
          </tr>

          <tr className="flex items-center">
            <td className="px-4 py-2">
              <Square size={18} className="text-gray-100" />
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-[105px]">
              01/02/2023
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12">
              PharosIT Solutions
            </td>

            <td className="px-4 py-2  text-gray-100 font-normal text-sm w-2/12">
              Thayná Gitirana
            </td>

            <td className="px-4 py-2  text-gray-100 font-normal text-sm w-1/12">
              09:30
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12">
              18:30
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12">
              Denis Varella
            </td>

            <td className="px-4 py-2  text-gray-100 font-normal text-sm flex gap-2 items-center w-2/12">
              <CircleDollarSign size={16} />
              Faturado
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12">
              <div className="border border-1 border-gray-300 font-medium rounded-md py-1 flex items-center justify-center text-xs">
                <span>Remoto</span>
              </div>
            </td>
          </tr>

          <tr className="flex items-center">
            <td className="px-4 py-2">
              <Square size={18} className="text-gray-100" />
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-[105px]">
              01/02/2023
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12">
              PharosIT Solutions
            </td>

            <td className="px-4 py-2  text-gray-100 font-normal text-sm w-2/12">
              Thayná Gitirana
            </td>

            <td className="px-4 py-2  text-gray-100 font-normal text-sm w-1/12">
              09:30
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12">
              18:30
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12">
              Denis Varella
            </td>

            <td className="px-4 py-2  text-gray-100 font-normal text-sm flex gap-2 items-center w-2/12">
              <XCircle size={16} />
              Cancelado
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12">
              <div className="border border-1 border-gray-300 font-medium rounded-md py-1 flex items-center justify-center text-xs">
                <span>Remoto</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
