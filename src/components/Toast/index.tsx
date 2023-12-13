import { CheckCircle2, XCircle } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'error' | 'success'
}

export default function Toast({ message, type = 'success' }: ToastProps) {
  return (
    <div
      className={
        type === 'success'
          ? 'absolute bottom-6 right-6 p-6 rounded-lg bg-green-100 flex flex-col gap-2'
          : 'absolute bottom-6 right-6 p-6 rounded-lg bg-red-100 flex flex-col gap-2'
      }
      role="alert"
    >
      <span
        className={
          type === 'success'
            ? 'flex gap-2 items-center text-green-900 font-medium'
            : 'flex gap-2 items-center text-red-900 font-medium'
        }
      >
        {type === 'success' ? (
          <CheckCircle2 size={20} />
        ) : (
          <XCircle size={20} />
        )}
        {message}
      </span>
    </div>
  )
}
