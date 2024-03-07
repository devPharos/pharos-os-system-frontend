import { useUser } from '@/app/contexts/useUser'
import { Card } from '@/components/Card'
import { updateServiceOrderStatus } from '@/functions/requests'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { ArrowRightCircle, CircleDollarSign } from 'lucide-react'

export interface OsModalProps {
  selectedOs: string
  isOpen: boolean
  onOpenChange: () => void
}

export function OsModal({ selectedOs, isOpen, onOpenChange }: OsModalProps) {
  const { auth } = useUser()

  const handleChangeOsStatus = (
    id: string,
    status: 'Aberto' | 'Enviado' | 'Faturado' | 'Validado' | 'Rascunho',
  ) => {
    if (typeof window !== 'undefined' && auth?.token) {
      updateServiceOrderStatus(auth.token, status, id)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="opaque"
      classNames={{
        base: 'bg-gray-700 rounded-lg',
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Alterar status da ordem de serviço
            </ModalHeader>
            <ModalBody>
              <Button
                className="bg-transparent hover:bg-gray-800 text-gray-100 justify-start"
                startContent={
                  <Card.Badge
                    status=""
                    className="bg-orange-600/10 text-orange-600 py-2 px-2 rounded-md"
                    icon={ArrowRightCircle}
                  />
                }
                onClick={() => handleChangeOsStatus(selectedOs, 'Enviado')}
              >
                Enviado ao cliente
              </Button>

              <Button
                className="bg-transparent hover:bg-gray-800 text-gray-100 justify-start"
                startContent={
                  <Card.Badge
                    status=""
                    className="bg-green-500/10 text-green-500 py-2 px-2 rounded-md"
                    icon={CircleDollarSign}
                  />
                }
                onClick={() => handleChangeOsStatus(selectedOs, 'Faturado')}
              >
                Faturado
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
