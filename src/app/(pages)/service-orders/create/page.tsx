'use client'

import { useState } from 'react'
import OsForm from './os-form'
import CreateOSDetails, { OSDetails } from './details'
import { ServiceOrderDetailsSection } from './details/os-details-section'

export default function CreateOS() {
  const [selectedClient, setSelectedClient] = useState<string | undefined>()
  const [openDetails, setOpenDetails] = useState(false)
  const [details, setDetails] = useState<OSDetails[]>([])
  const [detailOpened, setDetailOpened] = useState<OSDetails>()

  function onDetailCreation(detail: OSDetails, index?: number) {
    if (details) {
      if (index || index === 0) {
        const newDetailsList = [...details]
        newDetailsList[index] = detail

        setDetails(newDetailsList)
        setDetailOpened(undefined)

        return
      }

      const newDetailsList = [...details]
      newDetailsList.push(detail)

      setDetails(newDetailsList)
      setDetailOpened(undefined)
    }
  }

  return (
    <main className="max-w-7xl w-full space-y-10 px-6 pt-10 mb-10">
      <OsForm
        details={details}
        setOpenDetails={setOpenDetails}
        setSelectedClient={setSelectedClient}
        openDetails={openDetails}
        setDetails={setDetails}
        selectedClient={selectedClient}
      />

      {openDetails && (
        <CreateOSDetails
          setDetailOpened={setDetailOpened}
          handleCreateServiceOrderDetail={onDetailCreation}
          setOpenDetails={setOpenDetails}
          clientId={selectedClient}
          detailOpened={detailOpened}
        />
      )}

      {details && details.length > 0 && (
        <ServiceOrderDetailsSection
          setDetailOpened={setDetailOpened}
          setOpenDetails={setOpenDetails}
          details={details}
        />
      )}
    </main>
  )
}
