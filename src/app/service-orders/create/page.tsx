'use client'

import Header from '@/layouts/header'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { Calendar, Clock, DollarSign, FileUp, Save, Search } from 'lucide-react'

export default function CreateOS() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <section className="max-w-7xl w-full px-6 py-14 space-y-10">
        <header className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">
            Cadastro de Ordem de Serviço
          </span>

          <section className="flex items-center gap-6">
            <Button className="rounded-full border-2 border-dashed bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 hover:border-solid hover:font-bold">
              Cancelar
            </Button>
            <Button className="rounded-full px-6 py-4 text-gray-700 font-bold bg-yellow-500 hover:bg-yellow-600">
              <Save size={16} />
              Salvar OS
            </Button>
          </section>
        </header>

        <section className="flex items-center gap-6">
          <Select
            label="Atendimento"
            classNames={{
              trigger: 'bg-gray-700 data-[hover=true]:bg-gray-600 rounded-lg',
              listboxWrapper: 'max-h-[400px] rounded-lg',
              popover: 'bg-gray-700 rounded-lg',
            }}
            listboxProps={{
              itemClasses: {
                base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
              },
            }}
          >
            <SelectItem key={0}>Remoto</SelectItem>
          </Select>

          <Input
            type="date"
            label="Emissão"
            placeholder=" "
            classNames={{
              label: 'text-gray-300 font-normal',
              inputWrapper:
                'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
              input: '[color-scheme]:dark',
            }}
          />

          <Select
            label="Cliente"
            classNames={{
              trigger: 'bg-gray-700 data-[hover=true]:bg-gray-600 rounded-lg',
              listboxWrapper: 'max-h-[400px] rounded-lg',
              popover: 'bg-gray-700 rounded-lg',
            }}
            listboxProps={{
              itemClasses: {
                base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
              },
            }}
            selectorIcon={<Search />}
          >
            <SelectItem key={0}>MILA</SelectItem>
            <SelectItem key={1}>Musical Express</SelectItem>
            <SelectItem key={2}>PharosIT</SelectItem>
          </Select>
        </section>

        <header className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">
            Cadastro de Ordem de Serviço
          </span>

          <section className="flex items-center gap-6">
            <Button className="rounded-full px-6 py-4 hover:text-gray-700 text-yellow-500 font-bold bg-transparent border-2 border-dashed border-yellow-500 hover:bg-yellow-500">
              <Save size={16} />
              Adicionar Detalhamento
            </Button>
          </section>
        </header>

        <section className="space-y-6">
          <section className="flex items-center gap-6">
            <Select
              label="Projeto"
              classNames={{
                trigger: 'bg-gray-700 data-[hover=true]:bg-gray-600 rounded-lg',
                listboxWrapper: 'max-h-[400px] rounded-lg',
                popover: 'bg-gray-700 rounded-lg',
              }}
              listboxProps={{
                itemClasses: {
                  base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                },
              }}
              selectorIcon={<Search />}
            >
              <SelectItem key={0}>MILA Student Web</SelectItem>
              <SelectItem key={1}>Stock Management APP</SelectItem>
              <SelectItem key={2}>PharosIT OS System</SelectItem>
            </Select>

            <Input
              label="Hora inicial"
              classNames={{
                label: 'text-gray-300',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              endContent={<Clock className="text-gray-300" size={20} />}
            />

            <Input
              label="Hora final"
              classNames={{
                label: 'text-gray-300',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              endContent={<Clock className="text-gray-300" size={20} />}
            />

            <Input
              label="Reembolso"
              classNames={{
                label: 'text-gray-300',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              endContent={<DollarSign className="text-gray-300" size={20} />}
            />

            <label
              htmlFor="reembolso_arqv"
              className="cursor-pointer text-gray-300 text-wrap text-sm relative w-full inline-flex tap-highlight-transparent shadow-sm px-3 min-h-unit-10 rounded-medium  items-center justify-between gap-0 transition-background motion-reduce:transition-none !duration-150 outline-none focus:z-10 h-14 py-2 bg-gray-700 hover:bg-gray-800 focus:bg-gray-800  focus:ring-yellow-500"
            >
              Anexar nota fiscal
              <FileUp className="text-gray-300" size={20} />
            </label>

            <input type="file" id="reembolso_arqv" className="sr-only" />
          </section>
          <Textarea
            label="Descrição"
            classNames={{
              label: 'text-gray-300',
              inputWrapper:
                'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
            }}
          />
        </section>
      </section>
    </div>
  )
}
