import { UserState } from '@/app/contexts/useUser'

export enum ActionTypes {
  AUTHENTICATE = 'AUTHENTICATE',
  LOGOUT = 'LOGOUT',
}

export function authenticateAction(user: UserState) {
  return {
    type: ActionTypes.AUTHENTICATE,
    payload: { ...user },
  }
}

export function logoutAction() {
  return {
    type: ActionTypes.LOGOUT,
    payload: { user: null, token: '', authenticated: false, loading: false },
  }
}
