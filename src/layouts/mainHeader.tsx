'use client'

import { Button } from '@nextui-org/react'
import { PlusCircle, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface MainHeaderProps {
  title: string
  description?: string
  route: string
  buttonLabel: string
  hasCancelButton?: boolean
  hasSubmitButton?: boolean
  form?: string
}

export default function MainHeader({
  buttonLabel,
  route,
  title,
  description,
  hasCancelButton = false,
  hasSubmitButton = false,
  form,
}: MainHeaderProps) {
  const router = useRouter()

  return (
    <header className="flex items-center justify-between">
      <section className="flex flex-col">
        <span className="font-bold text-2xl text-white">{title}</span>
        {description && <span className="text-gray-300">{description}</span>}
      </section>

      <section className="space-x-6">
        {hasCancelButton && (
          <Button
            className="rounded-full bg-transparent text-gray-100 hover:bg-gray-100 hover:text-gray-700 font-bold"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
        )}

        <Button
          className="rounded-full px-6 py-4 text-gray-700 font-bold bg-yellow-500 hover:bg-yellow-600"
          onClick={() => router.push(`${route}`)}
          type={hasSubmitButton ? 'submit' : 'button'}
          form={hasSubmitButton ? form : undefined}
        >
          {hasSubmitButton ? (
            <Save size={18} className="text-gray-700" />
          ) : (
            <PlusCircle size={18} className="text-gray-700" />
          )}
          {buttonLabel}
        </Button>
      </section>
    </header>
  )
}
