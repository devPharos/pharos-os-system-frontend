'use client'
import { User } from '@/types/user'
import { createContext, useContext, useState } from 'react'

const defaultUser: User = {
  access_token: '',
  email: '',
}

interface IRegisterContext {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
}

export const RegisterContext = createContext<IRegisterContext>(
  defaultUser as any,
)

const RegisterProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser)

  return (
    <RegisterContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </RegisterContext.Provider>
  )
}

const useRegister = () => {
  const context = useContext(RegisterContext)

  return context
}

export { RegisterProvider, useRegister }
