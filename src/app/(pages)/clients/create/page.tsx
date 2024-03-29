'use client'

import { useUser } from '@/app/contexts/useUser'
import Loading from '@/components/Loading'
import { states } from '@/data/states'
import {
  getCEPData,
  handleFormatCPForCNPJ,
  handleFormatPhone,
  validateCNPJ,
  validateCPF,
} from '@/functions/auxiliar'
import { createClient, updateClient } from '@/functions/requests'
import { Client } from '@/types/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import axios from 'axios'
import { Save, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { ChangeEvent, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

enum DiasDaSemana {
  SEGUNDA = 'segunda',
  TERCA = 'terca',
  QUARTA = 'quarta',
  QUINTA = 'quinta',
  SEXTA = 'sexta',
  SABADO = 'sabado',
  DOMINGO = 'domingo',
}

export default function CreateClient() {
  const [cep, setCep] = useState<string>('')
  const searchParams = useSearchParams()
  const [client, setClient] = useState<Client>()
  const params = Array.from(searchParams.values())
  const id = params[0]
  const router = useRouter()
  const { auth } = useUser()

  const clientFormSchema = z.object({
    address: z.string().min(1, 'Campo obrigatório'),
    businessName: z.string().min(1, 'Campo obrigatório'),
    cep: z.string().min(1, 'Campo obrigatório'),
    city: z.string().min(1, 'Campo obrigatório'),
    cnpj: z
      .string()
      .min(1, 'Campo obrigatório')
      .max(18, 'Seu CNPJ deve ter 14 dígitos'),
    complement: z.string().optional(),
    country: z.string().min(1, 'Campo obrigatório'),
    fantasyName: z.string().min(1, 'Campo obrigatório'),
    neighborhood: z.string().min(1, 'Campo obrigatório'),
    number: z.string().min(1, 'Campo obrigatório'),
    phone: z.string().min(1, 'Campo obrigatório'),
    paymentDate: z.string().max(2, 'No máximo 2 dígitos').optional(),
    paymentWeekDate: z.string().optional(),
    daysAfterClosing: z.string().optional(),
    state: z.string().min(1, 'Campo obrigatório'),
  })

  type ClientFormSchema = z.infer<typeof clientFormSchema>

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<ClientFormSchema>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: async () =>
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/client/data`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            id,
          },
        })
        .then((response) => {
          setClient(response.data)
          return response.data
        })
        .catch(function (error) {
          console.error(error)
        }),
  })

  const handleClientFormSubmit: SubmitHandler<ClientFormSchema> = async (
    data: ClientFormSchema,
  ) => {
    const cnpjOrCpf = data.cnpj.replace(/\D/g, '')
    const errorMessage =
      cnpjOrCpf.length === 14 ? 'Insira um CNPJ válido' : 'Insira um CPF válido'

    const isAValideCNPJOrCPF =
      cnpjOrCpf.length === 14 ? validateCNPJ(cnpjOrCpf) : validateCPF(cnpjOrCpf)

    if (!isAValideCNPJOrCPF) {
      setError('cnpj', {
        message: errorMessage,
      })
    }

    if (data.paymentWeekDate !== '' && data.paymentWeekDate) {
      const normalizedValue = data.paymentWeekDate
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

      if (
        Object.values(DiasDaSemana).includes(normalizedValue as DiasDaSemana)
      ) {
        data.paymentWeekDate = normalizedValue
      } else {
        setError('paymentWeekDate', {
          message: 'Digite um dia da semana',
        })

        return
      }
    }

    if (!id) {
      try {
        await createClient(auth?.token, data)
        toast.success('Cliente criado com successo!')

        router.push('/clients')
      } catch (error) {
        console.error('Erro ao buscar os dados:', error)

        toast.error('Erro ao tentar criar cliente')
        setError('cnpj', {
          message: 'Já existe um cliente com o mesmo CPF/CNPJ',
        })
      }
    }

    if (id && typeof window !== 'undefined') {
      try {
        await updateClient(auth?.token, data)
        toast.success('Cliente atualizado com successo!')

        router.push('/clients')
      } catch (error) {
        console.error('Erro ao buscar os dados:', error)
        toast.error('Erro ao tentar atualizar cliente')
      }
    }
  }

  const handleCepChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    const formattedCEP = inputValue
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d{3})?(\d{3})?/, '$1.$2-$3')

    e.target.value = formattedCEP

    setCep(e.target.value)
  }

  const buscarCep = async () => {
    const cepData = await getCEPData(cep)

    if (cepData?.erro === true) {
      setError('cep', {
        message: 'CEP não encontrado',
      })
    }

    setValue('city', cepData?.localidade || '')
    setValue('complement', cepData?.complemento || '')
    setValue('neighborhood', cepData?.bairro || '')
    setValue('address', cepData?.logradouro || '')
    setValue('state', cepData?.uf || '')
    setValue('country', 'Brasil')

    if (cepData && client) {
      setClient({
        ...client,
        state: cepData.uf,
      })
    }
  }

  if (id && !client) {
    return <Loading />
  }

  return (
    <form
      onSubmit={handleSubmit(handleClientFormSubmit)}
      className="max-w-7xl w-full space-y-10 px-6"
    >
      <header className={'flex items-center justify-between'}>
        <span className="text-2xl font-bold text-white">
          Cadastro de Cliente
        </span>

        <section className="flex items-center gap-6">
          <Button
            className="rounded-full bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 font-bold"
            onClick={() => router.push('/clients')}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            className="disabled:border-none items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-700 bg-yellow-500 font-bold hover:bg-yellow-600"
          >
            <Save size={16} />
            Salvar cliente
          </Button>
        </section>
      </header>

      <section className="flex flex-wrap  gap-6">
        <section className="flex flex-col gap-2 w-full">
          <span className="text-gray-200">Informações</span>

          <section className="flex flex-wrap gap-6">
            <Input
              id="businessName"
              label="Razão social"
              placeholder={id && ' '}
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('businessName')}
              errorMessage={errors.businessName?.message}
              isInvalid={!!errors.businessName}
            />

            <Input
              id="fantasyName"
              label="Nome fantasia"
              placeholder={id && ' '}
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('fantasyName')}
              errorMessage={errors.fantasyName?.message}
              isInvalid={!!errors.fantasyName}
            />

            <Input
              id="cnpj"
              label="CNPJ/CPF"
              disabled={!!id}
              placeholder={id && ' '}
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('cnpj')}
              onChange={handleFormatCPForCNPJ}
              errorMessage={errors.cnpj?.message}
              isInvalid={!!errors.cnpj}
            />

            <Input
              id="phone"
              label="Telefone"
              placeholder={id && ' '}
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('phone')}
              onChange={handleFormatPhone}
              errorMessage={errors.phone?.message}
              isInvalid={!!errors.phone}
            />

            <Input
              id="paymentDate"
              label="Data de pagamento"
              placeholder={id && ' '}
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('paymentDate')}
              errorMessage={errors.paymentDate?.message}
              isInvalid={!!errors.paymentDate}
            />

            <Input
              id="paymentWeekDate"
              label="Dia da semana para o pagamento"
              placeholder={id && ' '}
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('paymentWeekDate')}
              errorMessage={errors.paymentWeekDate?.message}
              isInvalid={!!errors.paymentWeekDate}
            />

            <Input
              id="daysAfterClosing"
              label="Dias após o fechamento para o pagamento"
              placeholder={id && ' '}
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('daysAfterClosing')}
              errorMessage={errors.daysAfterClosing?.message}
              isInvalid={!!errors.daysAfterClosing}
            />
          </section>
        </section>

        <section className="flex flex-col gap-2 w-full">
          <span className="text-gray-200">Endereço</span>

          <section className="flex flex-wrap gap-6">
            <Input
              id="cep"
              label="CEP"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('cep')}
              errorMessage={errors.cep?.message}
              isInvalid={!!errors.cep}
              placeholder={id && ' '}
              value={cep || (client && client?.cep)}
              onChange={handleCepChange}
              endContent={
                <Button
                  onClick={buscarCep}
                  className="disabled:border-none min-w-fit items-center disabled:bg-gray-600 disabled:text-gray-500 rounded-lg px-6 py-4 text-gray-700 bg-gray-100 font-bold"
                  disabled={cep.length !== 10}
                  startContent={<Search size={18} />}
                >
                  Buscar CEP
                </Button>
              }
            />

            <Input
              id="country"
              label="País"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('country')}
              errorMessage={errors.country?.message}
              isInvalid={!!errors.country}
              placeholder={id || cep.length === 10 ? ' ' : undefined}
            />

            <Select
              id="state"
              label="Estado"
              classNames={{
                trigger:
                  'bg-gray-700  data-[hover=true]:bg-gray-600 rounded-lg',
                listboxWrapper: 'max-h-[400px] rounded-lg',
                base: 'max-w-sm',
              }}
              listboxProps={{
                itemClasses: {
                  base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                },
              }}
              popoverProps={{
                classNames: {
                  base: 'bg-gray-700 rounded-lg',
                },
              }}
              {...register('state')}
              errorMessage={errors.state?.message}
              isInvalid={!!errors.state}
              defaultSelectedKeys={client && [client.state]}
            >
              {states.map((state) => (
                <SelectItem key={state.key} value={state.key}>
                  {state.name}
                </SelectItem>
              ))}
            </Select>

            <Input
              id="city"
              label="Cidade"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('city')}
              errorMessage={errors.city?.message}
              isInvalid={!!errors.city}
              placeholder={id || cep.length === 10 ? ' ' : undefined}
            />

            <Input
              id="neighborhood"
              label="Bairro"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('neighborhood')}
              errorMessage={errors.neighborhood?.message}
              isInvalid={!!errors.neighborhood}
              placeholder={id || cep.length === 10 ? ' ' : undefined}
            />

            <Input
              id="address"
              label="Endereço"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('address')}
              errorMessage={errors.address?.message}
              isInvalid={!!errors.address}
              placeholder={id || cep.length === 10 ? ' ' : undefined}
            />

            <Input
              id="number"
              label="Número"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('number')}
              errorMessage={errors.number?.message}
              isInvalid={!!errors.number}
              placeholder={id && ' '}
            />

            <Input
              id="complement"
              label="Complemento"
              classNames={{
                label: 'text-gray-300',
                base: 'max-w-sm',
                inputWrapper:
                  'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
              }}
              {...register('complement')}
              placeholder={id || cep.length === 10 ? ' ' : undefined}
            />
          </section>
        </section>
      </section>
    </form>
  )
}
