import { Card } from '@/components/Card'
import { Trash2 } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { ServiceOrderExpenses } from '.'

export interface OsExpenseCardProps {
  expense: ServiceOrderExpenses
  index: number
  setExpenses: Dispatch<SetStateAction<ServiceOrderExpenses[]>>
  expenses: ServiceOrderExpenses[]
  setExpenseOpened: Dispatch<SetStateAction<ServiceOrderExpenses | undefined>>
  setOpenExpenses: Dispatch<SetStateAction<boolean>>
}

export function OsExpenseCard({
  expense,
  index,
  setExpenses,
  setExpenseOpened,
  expenses,
  setOpenExpenses,
}: OsExpenseCardProps) {
  function handleOpenExpenseForm() {
    const openedExpense = {
      ...expense,
      index,
    }

    setExpenseOpened(openedExpense)
    setOpenExpenses(true)
  }

  function handleDeleteExpense() {
    const newExpensesList = [...expenses]
    newExpensesList[index] = {
      ...expense,
      deleted: true,
    }

    setExpenses(newExpensesList)
  }

  return (
    <main className="flex items-center gap-6 justify-center bg-gray-700 px-5 py-4 max-w-fit rounded-lg">
      <span
        onClick={handleOpenExpenseForm}
        className="text-sm text-gray-300 cursor-pointer"
      >
        {expense.value}
      </span>
      <Card.Badge
        status=""
        icon={Trash2}
        className=" text-red-500 bg-red-500/10 py-2 cursor-pointer px-2 rounded-md"
        onClick={handleDeleteExpense}
      />
    </main>
  )
}
