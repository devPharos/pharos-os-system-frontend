'use client'

import { CircularProgress } from '@nextui-org/react'

export default function Loading() {
  return (
    <div className="flex flex-col items-center w-full gap-2">
      <CircularProgress
        classNames={{
          indicator: 'stroke-yellow-500',
        }}
        label="Loading..."
      />
    </div>
  )
}
