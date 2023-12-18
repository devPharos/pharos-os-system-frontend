'use client'

import Loading from '@/components/Loading'
import Header from '@/layouts/header'
import { Client } from '@/types/client'
import { Collaborator } from '@/types/collaborator'
import { Company } from '@/types/company'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import axios from 'axios'
import { Clock, Save } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

export default function CreateClient() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const searchParams = useSearchParams()
  const params = Array.from(searchParams.values())
  const [client, setClient] = useState<Client>()
  const id = params[0]
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const localStorage = window.localStorage
  const token = localStorage.getItem('access_token')

  const collaboratorFormSchema = z.object({
    companyId: z.string().uuid('Selecione uma opção'),
    supervisorId: z.string().uuid().optional(),
    name: z.string().min(1, 'Campo obrigatório'),
    lastName: z.string().min(1, 'Campo obrigatório'),
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
    cep: z.string().min(1, 'Campo obrigatório'),
    city: z.string().min(1, 'Campo obrigatório'),
    cnpj: z.string().min(1, 'Campo obrigatório'),
    complement: z.string().min(1, 'Campo obrigatório'),
    country: z.string().min(1, 'Campo obrigatório'),
    neighborhood: z.string().min(1, 'Campo obrigatório'),
    number: z.string().min(1, 'Campo obrigatório'),
    phone: z.string().min(1, 'Campo obrigatório'),
    pixKey: z.string().min(1, 'Campo obrigatório'),
    state: z.string().min(1, 'Campo obrigatório'),
  })

  type CollaboratorFormSchema = z.infer<typeof collaboratorFormSchema>

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CollaboratorFormSchema>({
    resolver: zodResolver(collaboratorFormSchema),
  })

  const handleCollaboratorFormSubmit: SubmitHandler<CollaboratorFormSchema> = (
    data: CollaboratorFormSchema,
  ) => {
    setLoading(true)
    if (window !== undefined) {
      const localStorage = window.localStorage
      const token = localStorage.getItem('access_token')

      axios
        .post('http://localhost:3333/accounts/collaborator', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(function () {
          setLoading(false)
          router.push('/company')
        })
        .catch(function (error) {
          console.error(error)
        })
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
        })

      axios
        .get('http://localhost:3333/list/collaborators', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(function (response) {
          const data = response.data
          setCollaborators(data)
          setLoading(false)
        })
        .catch(function (error) {
          console.error(error)
        })
    }
  }, [id])

  return (
    <div className="min-h-screen flex flex-col items-center gap-14">
      <Header />

      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center w-full gap-2 pb-6">
          <form
            onSubmit={handleSubmit(handleCollaboratorFormSubmit)}
            className="max-w-7xl w-full space-y-10 px-6"
          >
            <header className={'flex items-center justify-between'}>
              <span className="text-2xl font-bold text-white">
                Cadastro de Colaborador
              </span>

              <section className="flex items-center gap-6">
                <Button
                  disabled={loading}
                  type="submit"
                  className="disabled:border-none items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-700 bg-yellow-500 font-bold hover:bg-yellow-600"
                >
                  <Save size={16} />
                  Salvar colaborador
                </Button>
              </section>
            </header>

            <section className="flex flex-wrap  gap-6">
              <section className="flex flex-col gap-2 w-full">
                <span className="text-gray-200">Informações</span>

                <section className="flex flex-wrap gap-6">
                  <Select
                    id="companyId"
                    label="Empresa"
                    classNames={{
                      trigger:
                        'bg-gray-700  data-[hover=true]:bg-gray-600 rounded-lg',
                      listboxWrapper: 'max-h-[400px] rounded-lg',
                      popover: 'bg-gray-700 rounded-lg ',
                      base: 'max-w-sm',
                    }}
                    listboxProps={{
                      itemClasses: {
                        base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                      },
                    }}
                    {...register('companyId')}
                    errorMessage={errors.companyId?.message}
                    validationState={errors.companyId && 'invalid'}
                  >
                    {companies.map((company) => (
                      <SelectItem key={company.id}>{company.name}</SelectItem>
                    ))}
                  </Select>

                  <Controller
                    name="supervisorId"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <Select
                        label="Supervisor"
                        {...field}
                        classNames={{
                          trigger:
                            'bg-gray-700  data-[hover=true]:bg-gray-600 rounded-lg',
                          listboxWrapper: 'max-h-[400px] rounded-lg',
                          popover: 'bg-gray-700 rounded-lg ',
                          base: 'max-w-sm',
                        }}
                        listboxProps={{
                          itemClasses: {
                            base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                          },
                        }}
                      >
                        {collaborators.map((collaborator) => (
                          <SelectItem key={collaborator.id}>
                            {collaborator.name + ' ' + collaborator.lastName}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />

                  <Input
                    id="name"
                    label="Nome"
                    placeholder={id && ' '}
                    classNames={{
                      label: 'text-gray-300',
                      base: 'max-w-sm',
                      inputWrapper:
                        'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
                    }}
                    {...register('name')}
                    errorMessage={errors.name?.message}
                    validationState={errors.name && 'invalid'}
                  />

                  <Input
                    id="lastName"
                    label="Sobrenome"
                    placeholder={id && ' '}
                    classNames={{
                      label: 'text-gray-300',
                      base: 'max-w-sm',
                      inputWrapper:
                        'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
                    }}
                    {...register('lastName')}
                    errorMessage={errors.lastName?.message}
                    validationState={errors.lastName && 'invalid'}
                  />

                  <Input
                    id="cnpj"
                    label="CNPJ"
                    placeholder={id && ' '}
                    classNames={{
                      label: 'text-gray-300',
                      base: 'max-w-sm',
                      inputWrapper:
                        'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
                    }}
                    {...register('cnpj')}
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
                    errorMessage={errors.phone?.message}
                    validationState={errors.phone && 'invalid'}
                  />
                </section>
              </section>

              <section className="flex flex-col gap-2 w-full">
                <span className="text-gray-200">Endereço</span>

                <section className="flex flex-wrap gap-6">
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
                    placeholder={id && ' '}
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
                    placeholder={id && ' '}
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
                    placeholder={id && ' '}
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
                    placeholder={id && ' '}
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
                    placeholder={id && ' '}
                  />

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