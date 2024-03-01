import { useUser } from '@/app/contexts/useUser'
import Loading from '@/components/Loading'
import {
  getServiceOrdersFilters,
  listServiceOrders,
} from '@/functions/requests'
import {
  ServiceOrderCard,
  ServiceOrderDate,
  ServiceOrderPage,
} from '@/types/service-order'
import { Select, SelectItem } from '@nextui-org/react'
import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'

export interface DateFilterProps {
  setServiceOrders: Dispatch<SetStateAction<ServiceOrderCard[]>>
  serviceOrderData: ServiceOrderPage | undefined
}

export function DateFilter({
  setServiceOrders,
  serviceOrderData,
}: DateFilterProps) {
  const { auth } = useUser()
  const [dates, setDates] = useState<ServiceOrderDate[]>([])

  useEffect(() => {
    async function fetchData() {
      const filtersList = await getServiceOrdersFilters(auth?.token)
      setDates(filtersList)
    }

    fetchData()
  }, [auth?.token])

  const getServiceOrdersByMonth: ChangeEventHandler<HTMLSelectElement> = async (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedValue = event.target.value

    const osList = await listServiceOrders(auth.token, selectedValue)
    setServiceOrders(osList.serviceOrders)
  }

  if (dates.length === 0 && serviceOrderData?.serviceOrders) {
    return <Loading />
  }

  return (
    <Select
      id="remote"
      label="Período"
      classNames={{
        trigger:
          'bg-gray-700 max-w-[250px] data-[hover=true]:bg-gray-600 rounded-lg',
        listboxWrapper: 'max-h-[400px] rounded-lg',
        popover: 'bg-gray-700 rounded-lg',
      }}
      listboxProps={{
        itemClasses: {
          base: 'bg-gray-700 data-[hover=true]:bg-gray-500/50 data-[hover=true]:text-gray-200 group-data-[focus=true]:bg-gray-500/50',
        },
      }}
      onChange={getServiceOrdersByMonth}
      defaultSelectedKeys={[
        dates.find((date) => date.date === serviceOrderData?.date)?.date || '',
      ]}
    >
      {dates &&
        dates.map((date) => (
          <SelectItem key={date.date} value={date.date}>
            {date.formattedDate}
          </SelectItem>
        ))}
    </Select>
  )
}
