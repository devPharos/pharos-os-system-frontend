import { CheckCircle2 } from 'lucide-react'

interface ToastProps {
  message: string
}

export default function Toast({ message }: ToastProps) {
  return (
    <div
      className="absolute bottom-6 right-6 p-6 rounded-lg bg-green-100 flex flex-col gap-2"
      role="alert"
    >
      <span className="flex gap-2 items-center text-green-900 font-medium">
        <CheckCircle2 size={20} />
        {message}
      </span>
    </div>
  )
}
