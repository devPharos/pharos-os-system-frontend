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
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: UserData | null
}

export const RegisterContext = createContext<IRegisterContext>(
  defaultUser as any,
)

const RegisterProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser)
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const userAuth = () => {
    const userToken =
      typeof window !== 'undefined' &&
      window.sessionStorage.getItem('access_token')

    if (!userToken) {
      setLoading(false)
    }

    if (userToken) {
      setToken(userToken)
      getUserData(userToken)
    }
  }

  const getUserData = (userToken: string): UserData => {
    let userData: UserData = {
      collaboratorId: '',
      companyId: '',
      userId: '',
      clientId: '',
      token: '',
      fantasyName: '',
      name: '',
      url: '',
    }

    userToken &&
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/user/data`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          setLoading(false)
          setCurrentUser(response.data)
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
    userAuth()
  }, [])

  return (
    <RegisterContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        setLoading,
        loading,
        currentUser,
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
