import { Dispatch, SetStateAction } from 'react'
import { OsExpenseCard } from './os-expenses-card'
import { ServiceOrderExpenses } from '.'

interface ServiceOrderExpensesSectionProps {
  expenses: ServiceOrderExpenses[]
  setExpenses: Dispatch<SetStateAction<ServiceOrderExpenses[]>>
  setExpenseOpened: Dispatch<SetStateAction<ServiceOrderExpenses | undefined>>
  setOpenExpenses: Dispatch<SetStateAction<boolean>>
}

export function ServiceOrderExpensesSection({
  expenses,
  setExpenses,
  setExpenseOpened,
  setOpenExpenses,
}: ServiceOrderExpensesSectionProps) {
  return (
    <section className="space-y-6">
      <span className="text-gray-200">Despesas da ordem de serviço</span>

      <section className="flex flex-wrap items-center gap-6">
        {expenses.map((expense, index) => {
          if (!expense.deleted) {
            return (
              <OsExpenseCard
                setExpenseOpened={setExpenseOpened}
                expense={expense}
                index={index}
                expenses={expenses}
                setExpenses={setExpenses}
                setOpenExpenses={setOpenExpenses}
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
