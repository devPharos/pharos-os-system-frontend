'use client'
import Header from '@/layouts/header'
import { Button, Input } from '@nextui-org/react'
import { Camera } from 'lucide-react'
import Image from 'next/image'

export default function Profile() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="max-w-7xl w-full p-6">
        <form className="flex flex-col items-end gap-8">
          <section className="relative">
            <Image
              src="https://www.github.com/gitirana.png"
              alt=""
              width={100}
              height={100}
              className="rounded-full"
              quality={100}
            />

            <div className="cursor-pointer hover:bg-yellow-600 absolute right-0 bottom-0 w-8 h-8 flex rounded-full bg-yellow-500 items-center justify-center">
              <Camera size={20} className="text-gray-500" />
            </div>
          </section>

          <section className="w-full flex items-center gap-6 flex-wrap">
            <Input
              id="date"
              label="Primeiro Nome"
              defaultValue="Thayná Luiza Gitirana da Cunha"
              placeholder=" "
              classNames={{
                label: 'text-gray-300 font-normal',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                input: '[color-scheme]:dark',
              }}
            />

            <Input
              id="date"
              label="Sobrenome"
              defaultValue="thayna@pharosit.com.br"
              placeholder=" "
              classNames={{
                base: 'max-w-sm',
                label: 'text-gray-300 font-normal',
                inputWrapper:
                  'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                input: '[color-scheme]:dark',
              }}
            />
            <Input
              id="date"
              label="Telefone"
              defaultValue="81 988436241"
              placeholder=" "
              classNames={{
                base: 'max-w-sm',
                label: 'text-gray-300 font-normal',
                inputWrapper:
                  'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                input: '[color-scheme]:dark',
              }}
            />

            <Input
              id="date"
              label="Endereço"
              defaultValue="Rua Frutuoso Gomes"
              placeholder=" "
              classNames={{
                base: 'max-w-sm',
                label: 'text-gray-300 font-normal',
                inputWrapper:
                  'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                input: '[color-scheme]:dark',
              }}
            />

            <Input
              id="date"
              label="Número"
              defaultValue="44"
              placeholder=" "
              classNames={{
                base: 'max-w-[80px]',
                label: 'text-gray-300 font-normal',
                inputWrapper:
                  'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                input: '[color-scheme]:dark',
              }}
            />

            <Input
              id="date"
              label="CEP"
              defaultValue="50740150"
              placeholder=" "
              classNames={{
                base: 'max-w-[275px]',
                label: 'text-gray-300 font-normal',
                inputWrapper:
                  'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                input: '[color-scheme]:dark',
              }}
            />

            <Input
              id="date"
              label="Complemento"
              defaultValue="Casa, primeiro andar"
              placeholder=" "
              classNames={{
                base: 'max-w-sm',
                label: 'text-gray-300 font-normal',
                inputWrapper:
                  'bg-gray-700 rounded-lg text-gray-100 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 color-scheme:dark',
                input: '[color-scheme]:dark',
              }}
            />
          </section>

          <Button
            className="disabled:border-none items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-700 bg-yellow-500 font-bold hover:bg-yellow-600"
            // eslint-disable-next-line react/jsx-no-undef
            startContent={<Save size={16} />}
          >
            Salvar
          </Button>
        </form>
      </main>
    </div>
  )
}
