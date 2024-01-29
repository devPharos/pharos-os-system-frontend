import { UserState } from "../../app/contexts/useUser"
import { ActionTypes } from "./actions"

export function userReducer(state: UserState, action: any) {

    console.log('TYPE', action.type)
    console.log('PAYLOAD', action.payload)

    switch(action.type) {
      case ActionTypes.AUTHENTICATE:
        return {...state, user: action.payload.user, token: action.payload.token, authenticated: true, loading: false }
      case ActionTypes.LOGOUT:
        return action.payload 
      default:
        return state
    }

}