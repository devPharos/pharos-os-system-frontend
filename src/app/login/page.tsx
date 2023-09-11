'use client'

import Image from 'next/image'

import img1 from '../../../public/assets/img/auth-1.png'
import img2 from '../../../public/assets/img/auth-2.png'
import img3 from '../../../public/assets/img/auth-3.png'
import logo from '../../../public/assets/logo-negative-yellow.png'

import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button, Input } from '@nextui-org/react'
import { useState } from 'react'

export default function Login() {
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false)

  const handleChangePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible)
  }

  return (
    <div className="grid grid-cols-2 w-full">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <section className="max-w-lg flex flex-col gap-10">
          <span className="text-3xl text-white font-semibold">
            <span className="text-yellow-500">Soluções</span> em tecnologia para
            empresas
          </span>

          <section className="flex flex-col gap-4">
            <Image alt="" src={img1} />

            <div className="flex w-full justify-between">
              <Image alt="" src={img2} />
              <Image alt="" src={img3} />
            </div>
          </section>

          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            vulputate libero et velit interdum, ac aliquet odio mattis. Class
            aptent taciti sociosqu ad litora torquent per conubia nostra, per
            inceptos himenaeos. Curabitur tempus urna at turpis condimentum
            lobortis.
          </span>
        </section>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen">
        <section className="flex flex-col max-w-[500px] w-full gap-10">
          <Image src={logo} alt="" quality={100} loading="lazy" />

          <div className="flex flex-col gap-4 w-full">
            <Input
              id="email"
              label="E-mail"
              classNames={{
                label: 'text-gray-300',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              startContent={<Mail className="text-gray-300" size={20} />}
            />

            <Input
              id="password"
              type={isPasswordVisible ? 'text' : 'password'}
              label="Senha"
              classNames={{
                label: 'text-gray-300',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              startContent={<Lock className="text-gray-300" size={20} />}
              endContent={
                isPasswordVisible ? (
                  <Eye
                    className="text-gray-300 cursor-pointer"
                    size={20}
                    onClick={handleChangePasswordVisibility}
                  />
                ) : (
                  <EyeOff
                    className="text-gray-300 cursor-pointer"
                    size={20}
                    onClick={handleChangePasswordVisibility}
                  />
                )
              }
            />
          </div>

          <Button
            endContent={<LogIn size={20} />}
            radius="full"
            size="lg"
            className="bg-yellow-500 text-normal outline-none font-bold text-gray-700 hover:bg-yellow-600 uppercase"
          >
            Acessar
          </Button>
        </section>
      </div>
    </div>
  )
}
