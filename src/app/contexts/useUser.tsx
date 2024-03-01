'use client'
import { UserData } from '@/types/user'
import axios from 'axios'
import { createContext, useContext, useEffect, useReducer } from 'react'
import { userReducer } from '../../reducers/user/reducer'
import { authenticateAction, logoutAction } from '@/reducers/user/actions'
import { toast } from 'sonner'
import { ProjectProvider } from '../hooks/useProjects'

export const UserContext = createContext<any>({
  authenticated: false,
  user: {
    name: '',
    fantasyName: '',
  },
  token: '',
})
export interface UserState {
  authenticated: boolean
  user: UserData
  token: string
}

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, dispatch] = useReducer(
    userReducer,
    {
      authenticated: false,
      user: {
        name: '',
        fantasyName: '',
      },
      token: '',
    },
    (initialState) => {
      if (typeof localStorage !== 'undefined') {
        const storedStateAsJSON = localStorage.getItem('@pharosit:auth-1.0.0')

        if (storedStateAsJSON) {
          const stored = JSON.parse(storedStateAsJSON)
          return stored
        }
      }
      return initialState
    },
  )

  function logIn(userLoginData: any) {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/sessions`, {
        email: userLoginData.email,
        password: userLoginData.password,
      })
      .then((response) => {
        const data = response.data

        axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/user/data`, {
            headers: {
              Authorization: `Bearer ${data.access_token}`,
            },
          })
          .then((response2) => {
            dispatch(
              authenticateAction({
                user: response2.data,
                token: data.access_token,
                authenticated: true,
              }),
            )
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        if (err) {
          toast.error('Credenciais incorretas')
          console.log(err)
        }
      })
  }

  function logOut() {
    dispatch(logoutAction())
  }

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const stateJSON = JSON.stringify(auth)
      localStorage.setItem('@pharosit:auth-1.0.0', stateJSON)
    }
  }, [auth])

  return (
    <UserContext.Provider
      value={{
        auth,
        logIn,
        logOut,
      }}
    >
      <ProjectProvider>{children}</ProjectProvider>
    </UserContext.Provider>
  )
}

const useUser = () => {
  const context = useContext(UserContext)

  return context
}

export { UserProvider, useUser }
