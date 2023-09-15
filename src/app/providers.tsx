// app/providers.tsx
'use client'

import { RegisterProvider } from '@/hooks/useRegister'
import { NextUIProvider } from '@nextui-org/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <RegisterProvider>{children}</RegisterProvider>
    </NextUIProvider>
  )
}
