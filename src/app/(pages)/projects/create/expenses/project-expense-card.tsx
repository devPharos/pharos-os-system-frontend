import { Card } from '@/components/Card'
import { Trash2 } from 'lucide-react'
import { ExpenseOpened } from '@/app/hooks/useProjects'
import { ProjectExpenses } from '.'
import { Dispatch, SetStateAction } from 'react'

export interface ProjectExpenseCardProps {
  expense: ProjectExpenses
  expenses: ProjectExpenses[]
  setExpenses: Dispatch<SetStateAction<ProjectExpenses[]>>
  setExpenseOpened: Dispatch<SetStateAction<ExpenseOpened | undefined>>
  setOpenExpense: Dispatch<SetStateAction<boolean>>
  index: number
}

export function ProjectExpenseCard({
  expense,
  index,
  expenses,
  setExpenseOpened,
  setExpenses,
  setOpenExpense,
}: ProjectExpenseCardProps) {
  function handleOpenExpenseForm() {
    const openedExpense = {
      ...expense,
      index,
    }

    setExpenseOpened(openedExpense)
    setOpenExpense(true)
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
        {expense.description}
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
