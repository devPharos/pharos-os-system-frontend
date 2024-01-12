'use client'
import { CircularProgress } from '@nextui-org/react'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2 min-h-screen">
      <CircularProgress
        classNames={{
          indicator: 'stroke-yellow-500',
        }}
        label="Loading..."
      />
    </div>
  )
}
