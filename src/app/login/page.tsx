'use client'

import Image from 'next/image'

import img1 from '../../../public/assets/img/auth-1.png'
import img2 from '../../../public/assets/img/auth-2.png'
import img3 from '../../../public/assets/img/auth-3.png'
import logo from '../../../public/assets/logo-negative-yellow.svg'

import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button, Input } from '@nextui-org/react'
import { useState } from 'react'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRegister } from '@/hooks/useRegister'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { user, setUser } = useRegister()
  const router = useRouter()

  const loginFormSchema = z.object({
    email: z.string().email({
      message: 'Insira um e-mail válido',
    }),
    password: z.string().min(1, 'Insira sua senha'),
  })

  type TLoginFormData = z.infer<typeof loginFormSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginFormData>({
    resolver: zodResolver(loginFormSchema),
  })

  const handleLoginSubmit: SubmitHandler<TLoginFormData> = (
    data: TLoginFormData,
  ) => {
    setLoading(true)
    const userLoginData: TLoginFormData = {
      email: data.email,
      password: data.password,
    }

    axios
      .post('http://localhost:3333/sessions', {
        email: userLoginData.email,
        password: userLoginData.password,
      })
      .then(function (response) {
        const data = response.data

        setUser({
          ...user,
          access_token: data.access_token,
          email: userLoginData.email,
        })

        localStorage.setItem('access_token', data.access_token)

        router.push('/')
      })
      .catch(function (error) {
        setLoading(false)
        console.error(error)
      })
  }

  const handleChangePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible)
  }

  return (
    <div className="grid grid-cols-2 w-full min-h-screen max-[1030px]:grid-cols-1">
      <div className="flex flex-col items-center justify-center min-h-screen py-8 max-[1030px]:hidden">
        <section className="max-w-lg flex flex-col gap-10 ">
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

      <div className="flex flex-col items-center justify-center w-full">
        <form
          className="flex items-center flex-col max-w-[500px] w-full gap-10"
          onSubmit={handleSubmit(handleLoginSubmit)}
        >
          <Image src={logo} alt="" quality={100} loading="eager" height={40} />

          <div className="flex flex-col gap-4 w-full">
            <Input
              id="email"
              label="E-mail"
              classNames={{
                label: 'text-gray-300',
                inputWrapper:
                  'bg-gray-700 bg-gradient-to-r from-gray-700 from-30% via-60% via-[rgba(255,206,0,.1)] to-80% to-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              startContent={<Mail className="text-gray-300" size={20} />}
              errorMessage={errors.email?.message}
              validationState={errors.email && 'invalid'}
              {...register('email')}
            />
            <Input
              id="password"
              type={isPasswordVisible ? 'text' : 'password'}
              label="Senha"
              classNames={{
                label: 'text-gray-300',
                inputWrapper:
                  'bg-gray-700 bg-gradient-to-r from-gray-700 from-25% via-50% via-[rgba(255,206,0,.1)] to-75% to-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
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
              errorMessage={errors.password?.message}
              validationState={errors.password && 'invalid'}
              {...register('password')}
            />
          </div>

          <Button
            endContent={<LogIn size={20} />}
            radius="full"
            type="submit"
            size="lg"
            isLoading={loading}
            className="bg-yellow-500 w-full text-normal outline-none font-bold text-gray-700 hover:bg-yellow-600 uppercase"
          >
            Acessar
          </Button>
        </form>
      </div>
    </div>
  )
}
