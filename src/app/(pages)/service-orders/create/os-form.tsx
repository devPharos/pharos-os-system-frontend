import { useUser } from '@/app/contexts/useUser'
import {
  createServiceOrder,
  findServiceOrderById,
  getClients,
} from '@/functions/requests'
import { Client } from '@/types/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { PencilLine, Save, Search } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { OsFormHeader } from './os-form-header'
import { OSDetails } from './details'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import Loading from '@/components/Loading'

const createServiceOrderSchema = z.object({
  clientId: z.string().uuid(),
  serviceType: z.string().nonempty('Selecione uma opção'),
  date: z.string(),
})

type CreateServiceOrderSchema = z.infer<typeof createServiceOrderSchema>

interface OsFormProps {
  setSelectedClient: Dispatch<SetStateAction<string | undefined>>
  selectedClient: string | undefined
  setOpenDetails: Dispatch<SetStateAction<boolean>>
  openDetails: boolean
  details: OSDetails[]
  setDetails: Dispatch<SetStateAction<OSDetails[]>>
}

export interface OS extends CreateServiceOrderSchema {
  details: OSDetails[]
}

export default function OsForm({
  setSelectedClient,
  setOpenDetails,
  openDetails,
  selectedClient,
  details,
  setDetails,
}: OsFormProps) {
  const { auth } = useUser()
  const [clients, setClients] = useState<Client[]>([])
  const [status, setStatus] = useState('')
  const [serviceOrder, setServiceOrder] = useState<OS>()
  const searchParams = useSearchParams()
  const params = Array.from(searchParams.values())
  const id = params[0]

  const router = useRouter()

  const serviceTypes: string[] = ['Remoto', 'Presencial']

  useEffect(() => {
    async function fetchData() {
      const clientsList = await getClients(auth?.token)
      setClients(clientsList)

      if (id) {
        const serviceOrderFounded = await findServiceOrderById(auth?.token, id)
        setServiceOrder(serviceOrderFounded)
      }
    }

    fetchData()
  }, [auth?.token, id])

  useEffect(() => {
    if (serviceOrder) {
      setDetails(serviceOrder.details)
    }
  }, [serviceOrder, setDetails])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateServiceOrderSchema>({
    resolver: zodResolver(createServiceOrderSchema),
    values: {
      clientId: serviceOrder?.clientId ?? '',
      date: serviceOrder?.date ?? '',
      serviceType: serviceOrder?.serviceType ?? '',
    },
  })

  async function handleServiceOrderSubmit(data: CreateServiceOrderSchema) {
    try {
      if (status !== '') {
        const body = {
          ...data,
          status,
          details,
        }

        if (details.length === 0) {
          toast.error('Você precisa adicionar um detalhamento')
        }

        try {
          await createServiceOrder(auth?.token, body)
          toast.success('OS criada com sucesso')
        } catch {
          toast.error('Já existe uma OS salva nesse horário')
        }

        router.push('/service-orders')
      }
    } catch (error) {
      console.log(error)
    }
  }

  function handleSetSelectedClient(selectedKey: any) {
    const clientId = selectedKey.currentKey
    setSelectedClient(clientId)
    setOpenDetails(true)
  }

  const handleSaveOS = (event: React.MouseEvent<HTMLButtonElement>) => {
    const status = event.currentTarget.id

    setStatus(status)
  }

  if (id && !serviceOrder) {
    return <Loading />
  }

  return (
    <form
      onSubmit={handleSubmit(handleServiceOrderSubmit)}
      className="flex flex-col gap-10"
    >
      <header className={'flex items-center justify-between'}>
        <span className="text-2xl font-bold text-white">
          Cadastro de Ordem de Serviço
        </span>

        <section className="flex items-center gap-6">
          <Button
            className="rounded-full bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 font-bold"
            onClick={() => router.push('/service-orders')}
          >
            Cancelar
          </Button>

          <Button
            id="Rascunho"
            type="submit"
            className="disabled:border-none disabled:bg-transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-700 font-bold bg-gray-100 hover:bg-gray-200"
            onClick={handleSaveOS}
          >
            <PencilLine size={16} />
            Salvar Rascunho
          </Button>

          <Button
            id="Aberto"
            type="submit"
            className="disabled:border-none items-center disabled:transparent disabled:hover:bg-gray-600 disabled:text-gray-500 rounded-full px-6 py-4 text-gray-700 bg-yellow-500 font-bold hover:bg-yellow-600"
            onClick={handleSaveOS}
          >
            <Save size={16} />
            Salvar OS
          </Button>
        </section>
      </header>

      <OsFormHeader
        openDetails={openDetails}
        clientId={selectedClient}
        setOpenDetails={setOpenDetails}
      />

      <section className="flex justify-between flex-wrap gap-6">
        <Select
          label="Atendimento"
          classNames={{
            trigger: 'bg-gray-700  data-[hover=true]:bg-gray-600 rounded-lg',
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
          {...register('serviceType')}
          errorMessage={errors.serviceType?.message}
          isInvalid={!!errors.serviceType}
          defaultSelectedKeys={serviceOrder && [serviceOrder?.serviceType]}
        >
          {serviceTypes.map((service) => (
            <SelectItem key={service}>{service}</SelectItem>
          ))}
        </Select>

        <Input
          id="date"
          type="date"
          label="Emissão"
          placeholder=" "
          classNames={{
            label: 'text-gray-300',
            base: 'max-w-sm',
            inputWrapper:
              'bg-gray-700 data-[hover=true]:bg-gray-800 group-data-[focus=true]:bg-gray-800 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-yellow-500',
          }}
          {...register('date')}
          errorMessage={errors.date?.message}
          isInvalid={!!errors.date}
        />

        <Select
          id="clientId"
          label="Cliente"
          classNames={{
            trigger: 'bg-gray-700  data-[hover=true]:bg-gray-600 rounded-lg',
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
          onSelectionChange={(keys) => handleSetSelectedClient(keys)}
          selectorIcon={<Search />}
          {...register('clientId')}
          errorMessage={errors.clientId?.message}
          isInvalid={!!errors.clientId}
          defaultSelectedKeys={serviceOrder && [serviceOrder?.clientId]}
        >
          {clients.map((client) => {
            return <SelectItem key={client.id}>{client.fantasyName}</SelectItem>
          })}
        </Select>
      </section>
    </form>
  )
}
