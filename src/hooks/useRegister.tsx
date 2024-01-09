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
  getUserData: () => UserData
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const RegisterContext = createContext<IRegisterContext>(
  defaultUser as any,
)

const RegisterProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const userAuth = () => {
    const userToken = localStorage.getItem('access_token')

    setToken(userToken)
  }

  const getUserData = (): UserData => {
    let userData: UserData = {
      collaboratorId: '',
      companyId: '',
      userId: '',
      clientId: '',
      token: '',
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/user/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false)
        return (userData = {
          ...response.data,
          token,
        })
      })
      .catch((error) => {
        if (error) {
          setLoading(false)
        }
      })

    return userData
  }

  useEffect(() => {
    getUserData()
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
        setLoading,
        loading,
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
