'use client'

import { useUser } from '@/app/contexts/useUser'
import Loading from '@/components/Loading'
import { states } from '@/data/states'
import {
  Bank,
  getBanksData,
  getCEPData,
  handleFormatCPForCNPJ,
  handleFormatPhone,
  validateCNPJ,
  validateCPF,
} from '@/functions/auxiliar'
import {
  createCollaborator,
  getSupervisors,
  updateCollaborator,
} from '@/functions/requests'
import { Collaborator } from '@/types/collaborator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import axios from 'axios'
import { Save, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const collaboratorFormSchema = z.object({
  bank: z.string().min(1, 'Campo obrigatório'),
  supervisorId: z.optional(z.string().nullable()),
  name: z.string().min(1, 'Campo obrigatório'),
  lastName: z.string().min(1, 'Campo obrigatório'),
  account: z.string().min(1, 'Campo obrigatório'),
  accountDigit: z.string().max(1, 'No máximo um dígito'),
  address: z.string().min(1, 'Campo obrigatório'),
  agency: z.string().min(1, 'Campo obrigatório'),
  agencyDigit: z.string().max(1, 'No máximo um dígito'),
  cep: z.string().min(1, 'Campo obrigatório'),
  city: z.string().min(1, 'Campo obrigatório'),
  cnpj: z.string().min(1, 'Campo obrigatório'),
  complement: z.string(),
  country: z.string().min(1, 'Campo obrigatório'),
  neighborhood: z.string().min(1, 'Campo obrigatório'),
  number: z.string().min(1, 'Campo obrigatório'),
  phone: z.string().min(1, 'Campo obrigatório'),
  pixKey: z.string(),
  state: z.string().min(1, 'Campo obrigatório'),
})

export type CollaboratorFormSchema = z.infer<typeof collaboratorFormSchema>

export default function CreateClient() {
  const [cep, setCep] = useState<string>('')
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [collaborator, setCollaborator] = useState<Collaborator>()
  const [banks, setBanks] = useState<Bank[]>([])
  const searchParams = useSearchParams()
  const params = Array.from(searchParams.values())
  const id = params[0]
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { auth } = useUser()

  useEffect(() => {
    async function fetchData() {
      const response = await getSupervisors(auth?.token)
      setCollaborators(response)
    }

    getBanks()
    fetchData()
  }, [id, auth?.token])

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<CollaboratorFormSchema>({
    resolver: zodResolver(collaboratorFormSchema),
    defaultValues: async () =>
      id &&
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/find/collaborator`, {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
            id,
          },
        })
        .then((response) => {
          setCollaborator(response.data)
          return response.data
        })
        .catch(function (error) {
          console.error(error)
        }),
  })

  const handleCepChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    const formattedCEP = inputValue
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d{3})?(\d{3})?/, '$1.$2-$3')

    e.target.value = formattedCEP

    setCep(e.target.value)
  }

  const getBanks = async () => {
    const banks = await getBanksData()

    setBanks(banks)
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
    setValue('country', 'Brasil')
  }

  const handleCollaboratorFormSubmit: SubmitHandler<
    CollaboratorFormSchema
  > = async (data: CollaboratorFormSchema) => {
    setLoading(true)

    const supervisorId = !data.supervisorId
      ? null
      : data.supervisorId === ''
      ? null
      : data.supervisorId

    const body = {
      ...data,
      supervisorId,
    }

    const cnpjOrCpf = data.cnpj.replace(/\D/g, '')
    const errorMessage =
      cnpjOrCpf.length === 14 ? 'Insira um CNPJ válido' : 'Insira um CPF válido'

    const isAValidCNPJOrCPF =
      cnpjOrCpf.length === 14 ? validateCNPJ(cnpjOrCpf) : validateCPF(cnpjOrCpf)

    if (!isAValidCNPJOrCPF) {
      setError('cnpj', {
        message: errorMessage,
      })
      setLoading(false)
    }

    if (typeof window !== 'undefined' && isAValidCNPJOrCPF && auth?.token) {
      if (!id) {
        try {
          await createCollaborator(auth?.token, body)
          toast.success('Colaborador criado com successo!')

          router.push('/company')
        } catch (error) {
          console.error('Erro ao buscar os dados:', error)

          toast.error('Erro ao tentar criar colaborador')
          setError('cnpj', {
            message: 'Já existe um colaborador com o mesmo CPF/CNPJ',
          })
        }

        return
      }

      try {
        await updateCollaborator(auth?.token, body)
        toast.success('Colaborador atualizado com successo!')

        router.push('/company')
      } catch (error) {
        console.error('Erro ao buscar os dados:', error)

        toast.error('Erro ao tentar atualizar colaborador')
        setError('cnpj', {
          message: 'Já existe um colaborador com o mesmo CPF/CNPJ',
        })
      }
    }
  }

  const handleSelectsData = (keys: any) => {
    setValue('bank', keys.currentKey)
  }

  if (id && !collaborator) {
    return <Loading />
  }

  return (
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
              className="rounded-full bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 font-bold"
              onClick={() => router.push('/company')}
            >
              Cancelar
            </Button>

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
              <Controller
                name="supervisorId"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <Select
                    label="Supervisor"
                    {...field}
                    value={field.value || ''}
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
                    errorMessage={errors.supervisorId?.message}
                    isInvalid={!!errors.supervisorId}
                    defaultSelectedKeys={
                      id && collaborator?.id ? [collaborator?.id || ''] : []
                    }
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
                isInvalid={!!errors.name}
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
                isInvalid={!!errors.lastName}
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
                value={!id ? cep : undefined}
                onChange={handleCepChange}
                endContent={
                  !id && (
                    <Button
                      onClick={buscarCep}
                      className="disabled:border-none min-w-fit items-center disabled:bg-gray-600 disabled:text-gray-500 rounded-lg px-6 py-4 text-gray-700 bg-gray-100 font-bold"
                      disabled={cep.length !== 10}
                      startContent={<Search size={18} />}
                    >
                      Buscar CEP
                    </Button>
                  )
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
                  popover: 'bg-gray-700 rounded-lg ',
                  base: 'max-w-sm',
                }}
                listboxProps={{
                  itemClasses: {
                    base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
                  },
                }}
                {...register('state')}
                errorMessage={errors.state?.message}
                isInvalid={!!errors.state}
                defaultSelectedKeys={collaborator && [collaborator.state]}
              >
                {states.map((state) => (
                  <SelectItem key={state.key}>{state.name}</SelectItem>
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

          <section className="flex flex-col gap-2 w-full">
            <span className="text-gray-200">Dados bancários</span>

            <section className="flex flex-wrap gap-6">
              <Select
                id="bank"
                label="Banco"
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
                {...register('bank')}
                errorMessage={errors.bank?.message}
                isInvalid={!!errors.bank}
                defaultSelectedKeys={
                  collaborator && collaborator?.bank && [collaborator.bank]
                }
                onSelectionChange={(keys) => handleSelectsData(keys)}
              >
                {banks.map((bank) => (
                  <SelectItem key={bank.fullName} value={bank.fullName}>
                    {bank.fullName}
                  </SelectItem>
                ))}
              </Select>

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
                isInvalid={!!errors.agency}
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
                isInvalid={!!errors.agencyDigit}
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
                isInvalid={!!errors.account}
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
                isInvalid={!!errors.accountDigit}
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
                isInvalid={!!errors.pixKey}
                placeholder={id && ' '}
              />
            </section>
          </section>
        </section>
      </form>
    </div>
  )
}
