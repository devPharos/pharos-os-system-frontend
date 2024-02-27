import { ProjectExpenseCard } from './project-expense-card'
import { ProjectExpenses } from '.'
import { ExpenseOpened } from '@/app/hooks/useProjects'
import { Dispatch, SetStateAction } from 'react'

interface ProjectExpensesSectionProps {
  expenses: ProjectExpenses[]
  setExpenses: Dispatch<SetStateAction<ProjectExpenses[]>>
  setExpenseOpened: Dispatch<SetStateAction<ExpenseOpened | undefined>>
  setOpenExpense: Dispatch<SetStateAction<boolean>>
}

export function ProjectExpensesSection({
  expenses,
  setExpenseOpened,
  setExpenses,
  setOpenExpense,
}: ProjectExpensesSectionProps) {
  return (
    <section className="space-y-6">
      <span className="text-gray-200">Despesas do projeto</span>

      <section className="flex flex-wrap items-center gap-6">
        {expenses.map((expense, index) => {
          if (!expense.deleted) {
            return (
              <ProjectExpenseCard
                expenses={expenses}
                setExpenseOpened={setExpenseOpened}
                setExpenses={setExpenses}
                setOpenExpense={setOpenExpense}
                expense={expense}
                index={index}
                key={index}
              />
            )
          }

          return null
        })}
      </section>
    </section>
  )
}
