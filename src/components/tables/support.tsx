'use client'

import { Button, Input } from '@nextui-org/react'
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowRightCircle,
  ArrowUp,
  CheckCircle2,
  ChevronsUpDown,
  CircleDollarSign,
  Eye,
  Flag,
  GaugeCircle,
  Pencil,
  PlusCircle,
  Search,
  Square,
  Trash,
  User,
  XCircle,
} from 'lucide-react'

export default function SupportTable() {
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

          <div className="flex items-center gap-4">
            <Button
              className="rounded-lg border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold"
              startContent={<PlusCircle size={16} />}
            >
              Status
            </Button>

            <Button
              className="rounded-lg border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold"
              startContent={<PlusCircle size={16} />}
            >
              Prioridade
            </Button>
          </div>
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

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-2/12">
              Última atualização
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs flex-1">
              Assunto
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-1/12">
              Cliente
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-1/12">
              Atribuído
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-1/12">
              Prazo
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-2/12">
              Status
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-1/12">
              Prioridade
              <ChevronsUpDown size={14} />
            </th>

            <th className="px-4 py-2 flex items-center gap-1 font-normal text-xs w-2/12">
              Opções
              <ChevronsUpDown size={14} />
            </th>
          </tr>
        </thead>

        <tbody className="w-full flex flex-col gap-2">
          <tr className="flex items-center">
            <td className="px-4 py-2">
              <Square size={18} className="text-gray-100" />
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12">
              01/05/2023 às 19:00
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm flex-1">
              Erro no arquivo
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12">
              Pharos IT Solutions
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12">
              Thayná Gitirana
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12">
              02/05/2023
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12 flex items-center gap-2">
              <AlertCircle size={16} />
              Em atraso
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12 flex items-center gap-2">
              <ArrowUp size={16} className="text-red-500" />
              Alta
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12 flex items-center">
              <Button
                isIconOnly
                className="bg-transparent hover:bg-gray-500 text-gray-100"
              >
                <Flag size={16} />
              </Button>

              <Button
                isIconOnly
                className="bg-transparent hover:bg-gray-500 text-gray-100"
              >
                <User size={16} />
              </Button>

              <Button
                isIconOnly
                className="bg-transparent hover:bg-gray-500 text-gray-100  hover:text-red-500"
              >
                <Trash size={16} />
              </Button>
            </td>
          </tr>

          <tr className="flex items-center">
            <td className="px-4 py-2">
              <Square size={18} className="text-gray-100" />
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12">
              01/05/2023 às 19:00
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm flex-1">
              Erro no arquivo
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12">
              Pharos IT Solutions
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12">
              Thayná Gitirana
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12">
              02/05/2023
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12 flex items-center gap-2">
              <GaugeCircle size={16} />
              Não iniciado
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12 flex items-center gap-2">
              <ArrowUp size={16} className="text-red-500" />
              Alta
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12 flex items-center">
              <Button
                isIconOnly
                className="bg-transparent hover:bg-gray-500 text-gray-100"
              >
                <Flag size={16} />
              </Button>

              <Button
                isIconOnly
                className="bg-transparent hover:bg-gray-500 text-gray-100"
              >
                <User size={16} />
              </Button>

              <Button
                isIconOnly
                className="bg-transparent hover:bg-gray-500 text-gray-100  hover:text-red-500"
              >
                <Trash size={16} />
              </Button>
            </td>
          </tr>

          <tr className="flex items-center">
            <td className="px-4 py-2">
              <Square size={18} className="text-gray-100" />
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12">
              01/05/2023 às 19:00
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm flex-1">
              Erro no arquivo
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12">
              Pharos IT Solutions
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12">
              Thayná Gitirana
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12">
              02/05/2023
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12 flex items-center gap-2">
              <ArrowRightCircle size={16} />
              Iniciado
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12 flex items-center gap-2">
              <ArrowRight size={16} className="text-orange-500" />
              Média
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12 flex items-center">
              <Button
                isIconOnly
                className="bg-transparent hover:bg-gray-500 text-gray-100"
              >
                <Flag size={16} />
              </Button>

              <Button
                isIconOnly
                className="bg-transparent hover:bg-gray-500 text-gray-100"
              >
                <User size={16} />
              </Button>

              <Button
                isIconOnly
                className="bg-transparent hover:bg-gray-500 text-gray-100  hover:text-red-500"
              >
                <Trash size={16} />
              </Button>
            </td>
          </tr>

          <tr className="flex items-center">
            <td className="px-4 py-2">
              <Square size={18} className="text-gray-100" />
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12">
              01/05/2023 às 19:00
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm flex-1">
              Erro no arquivo
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12">
              Pharos IT Solutions
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12">
              Thayná Gitirana
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12">
              02/05/2023
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12 flex items-center gap-2">
              <CheckCircle2 size={16} />
              Finalizado
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-1/12 flex items-center gap-2">
              <ArrowDown size={16} className="text-blue-500" />
              Baixa
            </td>

            <td className="px-4 py-2 text-gray-100 font-normal text-sm w-2/12 flex items-center">
              <Button
                isIconOnly
                className="bg-transparent hover:bg-gray-500 text-gray-100"
              >
                <Flag size={16} />
              </Button>

              <Button
                isIconOnly
                className="bg-transparent hover:bg-gray-500 text-gray-100"
              >
                <User size={16} />
              </Button>

              <Button
                isIconOnly
                className="bg-transparent hover:bg-gray-500 text-gray-100  hover:text-red-500"
              >
                <Trash size={16} />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
