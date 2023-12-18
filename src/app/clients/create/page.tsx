'use client'

import Loading from '@/components/Loading'
import {
  getCEPData,
  handleFormatCPForCNPJ,
  handleFormatPhone,
  validateCNPJ,
  validateCPF,
} from '@/functions/auxiliar'
import Header from '@/layouts/header'
import { Client } from '@/types/client'
import { Company } from '@/types/company'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import axios from 'axios'
import { Clock, Save } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, MouseEventHandler, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

export default function CreateClient() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [cep, setCep] = useState<string>('')
  const searchParams = useSearchParams()
  const params = Array.from(searchParams.values())
  const [client, setClient] = useState<Client>()
  const id = params[0]
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const localStorage = window.localStorage
  const token = localStorage.getItem('access_token')

  const clientFormSchema = z.object({
    account: z.string().min(1, 'Campo obrigatório'),
    accountDigit: z
      .string()
      .max(1, 'No máximo um dígito')
      .min(1, 'Campo obrigatório'),
    address: z.string().min(1, 'Campo obrigatório'),
    agency: z.string().min(1, 'Campo obrigatório'),
    agencyDigit: z
      .string()
      .max(1, 'No máximo um dígito')
      .min(1, 'Campo obrigatório'),
    bank: z.string().min(1, 'Campo obrigatório'),
    businessName: z.string().min(1, 'Campo obrigatório'),
    cep: z.string().min(1, 'Campo obrigatório'),
    city: z.string().min(1, 'Campo obrigatório'),
    cnpj: z
      .string()
      .min(1, 'Campo obrigatório')
      .max(18, 'Seu CNPJ deve ter 14 dígitos'),
    complement: z.string().min(1, 'Campo obrigatório'),
    country: z.string().min(1, 'Campo obrigatório'),
    fantasyName: z.string().min(1, 'Campo obrigatório'),
    neighborhood: z.string().min(1, 'Campo obrigatório'),
    number: z.string().min(1, 'Campo obrigatório'),
    phone: z.string().min(1, 'Campo obrigatório'),
    pixKey: z.string().min(1, 'Campo obrigatório'),
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
      axios
        .get('http://localhost:3333/client/data', {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const handleClientFormSubmit: SubmitHandler<ClientFormSchema> = (
    data: ClientFormSchema,
  ) => {
    setLoading(true)

    const cnpjOrCpf = data.cnpj.replace(/\D/g, '')
    const errorMessage =
      cnpjOrCpf.length === 14 ? 'Insira um CNPJ válido' : 'Insira um CPF válido'

    const isAValideCNPJOrCPF =
      cnpjOrCpf.length === 14 ? validateCNPJ(cnpjOrCpf) : validateCPF(cnpjOrCpf)

    if (!isAValideCNPJOrCPF) {
      setError('cnpj', {
        message: errorMessage,
      })
      setLoading(false)
    }

    if (window !== undefined) {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')

      if (!id) {
        axios
          .post('http://localhost:3333/accounts/client', data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(function () {
            setLoading(false)
            router.push('/clients')
          })
          .catch(function (error) {
            console.error(error)
            setLoading(false)
            setError('cnpj', {
              message: 'Já existe um cliente com o mesmo CPF/CNPJ',
            })
          })
      }

      if (id) {
        axios
          .put('http://localhost:3333/update/client', data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(function () {
            setLoading(false)
            router.push('/clients')
          })
          .catch(function (error) {
            console.error(error)
            setLoading(false)
          })
      }
    }
  }

  useEffect(() => {
    setLoading(true)

    if (window !== undefined) {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')

      axios
        .get('http://localhost:3333/companies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(function (response) {
          const data = response.data
          setCompanies(data)
          setLoading(false)
        })
        .catch(function (error) {
          console.error(error)
          setLoading(false)
        })
    }
  }, [id])

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
    setValue('state', cepData?.uf || '')
    setValue('complement', cepData?.complemento || '')
    setValue('neighborhood', cepData?.bairro || '')
    setValue('address', cepData?.logradouro || '')
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-14">
      <Header />

      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center w-full gap-2 pb-6">
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
                  disabled={loading}
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
                    validationState={errors.businessName && 'invalid'}
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
                    validationState={errors.fantasyName && 'invalid'}
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
                    validationState={errors.cnpj && 'invalid'}
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
                    validationState={errors.phone && 'invalid'}
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
                    validationState={errors.cep && 'invalid'}
                    placeholder={id && ' '}
                    value={cep}
                    onChange={handleCepChange}
                    endContent={
                      <Button
                        onClick={buscarCep}
                        className="disabled:border-none items-center disabled:bg-gray-600 disabled:text-gray-500 rounded-lg px-6 py-4 text-gray-700 bg-gray-100 font-bold"
                        disabled={cep.length !== 10}
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
                    validationState={errors.country && 'invalid'}
                    placeholder={id && ' '}
                  />

                  <Input
                    id="state"
                    label="Estado"
                    classNames={{
                      label: 'text-gray-300',
                      base: 'max-w-sm',
                      inputWrapper:
                        'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
                    }}
                    {...register('state')}
                    errorMessage={errors.state?.message}
                    validationState={errors.state && 'invalid'}
                    placeholder={id || cep.length === 10 ? ' ' : undefined}
                  />

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
                    validationState={errors.city && 'invalid'}
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
                    validationState={errors.neighborhood && 'invalid'}
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
                    validationState={errors.address && 'invalid'}
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
                    validationState={errors.number && 'invalid'}
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
                    errorMessage={errors.complement?.message}
                    validationState={errors.complement && 'invalid'}
                    placeholder={id || cep.length === 10 ? ' ' : undefined}
                  />
                </section>
              </section>

              <section className="flex flex-col gap-2 w-full">
                <span className="text-gray-200">Dados bancários</span>

                <section className="flex flex-wrap gap-6">
                  <Input
                    id="bank"
                    label="Banco"
                    classNames={{
                      label: 'text-gray-300',
                      base: 'max-w-sm',
                      inputWrapper:
                        'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
                    }}
                    {...register('bank')}
                    errorMessage={errors.bank?.message}
                    validationState={errors.bank && 'invalid'}
                    placeholder={id && ' '}
                  />

                  <Input
                    id="agency"
                    label="Agência"
                    classNames={{
                      label: 'text-gray-300',
                      base: 'max-w-sm',
                      inputWrapper:
                        'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
                    }}
                    {...register('agency')}
                    errorMessage={errors.agency?.message}
                    validationState={errors.agency && 'invalid'}
                    placeholder={id && ' '}
                  />

                  <Input
                    id="agencyDigit"
                    label="Dígito"
                    classNames={{
                      label: 'text-gray-300',
                      base: 'max-w-sm',
                      inputWrapper:
                        'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
                    }}
                    {...register('agencyDigit')}
                    errorMessage={errors.agencyDigit?.message}
                    validationState={errors.agencyDigit && 'invalid'}
                    placeholder={id && ' '}
                  />

                  <Input
                    id="account"
                    label="Conta"
                    classNames={{
                      label: 'text-gray-300',
                      base: 'max-w-sm',
                      inputWrapper:
                        'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
                    }}
                    {...register('account')}
                    errorMessage={errors.account?.message}
                    validationState={errors.account && 'invalid'}
                    placeholder={id && ' '}
                  />

                  <Input
                    id="accountDigit"
                    label="Dígito"
                    classNames={{
                      label: 'text-gray-300',
                      base: 'max-w-sm',
                      inputWrapper:
                        'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
                    }}
                    {...register('accountDigit')}
                    errorMessage={errors.accountDigit?.message}
                    validationState={errors.accountDigit && 'invalid'}
                    placeholder={id && ' '}
                  />

                  <Input
                    id="pixKey"
                    label="Chave PIX"
                    classNames={{
                      label: 'text-gray-300',
                      base: 'max-w-sm',
                      inputWrapper:
                        'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
                    }}
                    {...register('pixKey')}
                    errorMessage={errors.pixKey?.message}
                    validationState={errors.pixKey && 'invalid'}
                    placeholder={id && ' '}
                  />
                </section>
              </section>
            </section>
          </form>
        </div>
      )}
    </div>
  )
}
