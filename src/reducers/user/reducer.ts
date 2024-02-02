import { UserState } from '../../app/contexts/useUser'
import { ActionTypes } from './actions'

export function userReducer(state: UserState, action: any) {
  switch (action.type) {
    case ActionTypes.AUTHENTICATE:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        authenticated: true,
        loading: false,
      }
    case ActionTypes.LOGOUT:
      return action.payload
    default:
      return state
  }
}
