'use client'
import { User, UserData } from '@/types/user'
import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'

const defaultUser: User = {
  email: '',
  password: '',
  collaboratorId: '',
  lastName: '',
  name: '',
}

interface IRegisterContext {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
  token: string | null
  setToken: React.Dispatch<React.SetStateAction<string | null>>
  getUserData: () => Promise<UserData>
}

export const RegisterContext = createContext<IRegisterContext>(
  defaultUser as any,
)

const RegisterProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser)
  const [token, setToken] = useState<string | null>(null)

  const userAuth = () => {
    const userToken = localStorage.getItem('access_token')

    setToken(userToken)
  }

  const getUserData = async (): Promise<UserData> => {
    let userData: UserData = {
      collaboratorId: '',
      companyId: '',
      userId: '',
      clientId: '',
      token: '',
    }

    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/user/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return (userData = {
          ...response.data,
          token,
        })
      })

    return userData
  }

  useEffect(() => {
    userAuth()
  }, [])

  return (
    <RegisterContext.Provider
      value={{
        user,
        setUser,
        token,
        getUserData,
        setToken,
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
