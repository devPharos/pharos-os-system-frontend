'use client'
import { User, UserData } from '@/types/user'
import axios from 'axios'
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

const getUserData = (access_token: string): UserData => {
  let userData: UserData = {
    collaboratorId: '',
    companyId: '',
    userId: '',
  }
  axios
    .get(`http://localhost:3333/accounts/user`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    .then((response) => {
      userData = response.data
    })

  return userData
}

const useRegister = () => {
  const context = useContext(RegisterContext)

  return context
}

export { RegisterProvider, useRegister, getUserData }
