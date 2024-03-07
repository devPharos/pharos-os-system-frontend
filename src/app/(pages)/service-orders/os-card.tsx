import { useUser } from '@/app/contexts/useUser'
import { Card } from '@/components/Card'
import { ServiceOrderCard } from '@/types/service-order'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react'
import { format } from 'date-fns'
import {
  AlertCircle,
  ArrowRightCircle,
  CheckCircle2,
  CircleDashed,
  CircleDollarSign,
  Clock,
  Pencil,
  PencilLine,
  Trash,
  User,
  XCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Key, useState } from 'react'
import { OsModal } from './os-modal'
import {
  deleteServiceOrder,
  updateServiceOrderStatus,
} from '@/functions/requests'

export interface OsCardProps {
  serviceOrder: ServiceOrderCard
}

export function OsCard({ serviceOrder }: OsCardProps) {
  const [selectedOs, setSelectedOs] = useState('')
  const { onOpen, isOpen, onOpenChange } = useDisclosure()
  const { auth } = useUser()
  const router = useRouter()

  const handleChangeOsStatus = async (
    id: string,
    status: 'Aberto' | 'Enviado' | 'Faturado' | 'Validado' | 'Rascunho',
  ) => {
    if (typeof window !== 'undefined' && auth?.token) {
      await updateServiceOrderStatus(auth.token, status, id)
    }
  }

  const handleAction = async (key: Key, id: string) => {
    if (key === 'edit') {
      router.push(`/service-orders/create?id=${id}`)
    }

    if (key === 'delete') {
      if (typeof window !== 'undefined' && auth?.token) {
        await deleteServiceOrder(auth.token, id)
      }
    }

    if (key === 'confirm') {
      handleChangeOsStatus(id, 'Aberto')
    }

    if (key === 'validate') {
      handleChangeOsStatus(id, 'Validado')
    }

    if (key === 'remove-validation') {
      handleChangeOsStatus(id, 'Aberto')
    }

    if (key === 'change-status') {
      handleOpenModal(id)
    }
  }

  const handleOpenModal = (id: string) => {
    onOpen()
    setSelectedOs(id)
  }

  return (
    <>
      <Dropdown
        classNames={{
          base: 'bg-gray-700 rounded-lg w-full flex-1',
        }}
        backdrop="opaque"
        key={serviceOrder.id}
        isDisabled={
          serviceOrder.collaborator?.supervisorId !==
            auth?.user?.collaboratorId &&
          serviceOrder.status !== 'Aberto' &&
          serviceOrder.status !== 'Rascunho'
        }
      >
        <DropdownTrigger>
          <Button className="p-0 rounded-none h-fit  w-full  bg-transparent min-w-fit max-w-sm">
            <Card.Root className="hover:bg-gray-600 hover:border-2 hover:border-gray-500 min-w-fit">
              <Card.Header>
                <section className="flex items-center gap-2">
                  <Card.Title label={serviceOrder?.client?.fantasyName} />
                </section>
                <Card.Badge
                  className={
                    serviceOrder.status === 'Rascunho'
                      ? 'text-gray-300/80 bg-gray-500/10'
                      : serviceOrder.status === 'Aberto'
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : serviceOrder.status === 'Enviado'
                      ? 'bg-orange-600/10 text-orange-600'
                      : serviceOrder.status === 'Faturado'
                      ? 'text-green-500/80 bg-green-500/10'
                      : 'bg-blue-500/10 text-blue-400'
                  }
                  status={
                    serviceOrder.status === 'Aberto'
                      ? 'Em aberto'
                      : serviceOrder.status === 'Enviado'
                      ? 'Enviado ao cliente'
                      : serviceOrder.status
                  }
                  icon={
                    serviceOrder.status === 'Rascunho'
                      ? Pencil
                      : serviceOrder.status === 'Aberto'
                      ? AlertCircle
                      : serviceOrder.status === 'Enviado'
                      ? ArrowRightCircle
                      : serviceOrder.status === 'Faturado'
                      ? CircleDollarSign
                      : CheckCircle2
                  }
                />
              </Card.Header>
              <Card.Content>
                <Card.Info icon={User} info={serviceOrder.collaborator.name} />
                <Card.Info
                  icon={Clock}
                  info={`${format(
                    new Date(serviceOrder.startDate),
                    'HH:mm',
                  )} - ${format(new Date(serviceOrder.endDate), 'HH:mm')}`}
                />
                <Card.Badge
                  className="text-gray-300/80 rounded-md bg-gray-500/20"
                  status={format(new Date(serviceOrder.date), 'dd/LL/yyyy')}
                />
              </Card.Content>
            </Card.Root>
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          itemClasses={{
            base: 'rounded-lg data-[hover=true]:bg-gray-800 data-[hover=true]:text-gray-200 data-[selected=true]:text-gray-100 data-[selected=true]:font-bold',
          }}
          onAction={(key: Key) => handleAction(key, serviceOrder.id)}
        >
          <DropdownSection
            className={
              serviceOrder.collaborator?.supervisorId ===
              auth?.user?.collaboratorId
                ? ''
                : 'hidden'
            }
          >
            <DropdownItem
              startContent={
                <Card.Badge
                  status=""
                  className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                  icon={
                    serviceOrder.status === 'Validado' ? XCircle : CheckCircle2
                  }
                />
              }
              key={
                serviceOrder.status === 'Validado'
                  ? 'remove-validation'
                  : 'validate'
              }
            >
              {serviceOrder.status === 'Validado' ? 'Estonar OS' : 'Validar OS'}
            </DropdownItem>

            <DropdownItem
              startContent={
                <Card.Badge
                  status=""
                  className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                  icon={CircleDashed}
                />
              }
              key={'change-status'}
            >
              Alterar status da ordem de serviço
            </DropdownItem>
          </DropdownSection>

          <DropdownSection
            className={
              serviceOrder.collaborator?.supervisorId !==
                auth?.user?.collaboratorId && serviceOrder.status === 'Aberto'
                ? ''
                : 'hidden'
            }
          >
            <DropdownItem
              startContent={
                <Card.Badge
                  status=""
                  className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                  icon={PencilLine}
                />
              }
              key={'edit'}
            >
              Editar ordem de serviço
            </DropdownItem>

            <DropdownItem
              startContent={
                <Card.Badge
                  status=""
                  className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                  icon={Trash}
                />
              }
              key={'delete'}
            >
              Excluir ordem de serviço
            </DropdownItem>
          </DropdownSection>

          <DropdownSection
            className={
              serviceOrder.collaborator?.supervisorId !==
                auth?.user?.collaboratorId && serviceOrder.status === 'Rascunho'
                ? ''
                : 'hidden'
            }
          >
            <DropdownItem
              startContent={
                <Card.Badge
                  status=""
                  className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                  icon={CheckCircle2}
                />
              }
              key={'confirm'}
            >
              Confirmar OS
            </DropdownItem>
            <DropdownItem
              startContent={
                <Card.Badge
                  status=""
                  className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                  icon={PencilLine}
                />
              }
              key={'edit'}
            >
              Editar ordem de serviço
            </DropdownItem>

            <DropdownItem
              startContent={
                <Card.Badge
                  status=""
                  className="text-gray-300/80 bg-gray-500/10  py-2 px-2 rounded-md"
                  icon={Trash}
                />
              }
              key={'delete'}
            >
              Excluir ordem de serviço
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

      <OsModal
        onOpenChange={onOpenChange}
        selectedOs={selectedOs}
        isOpen={isOpen}
      />
    </>
  )
}
