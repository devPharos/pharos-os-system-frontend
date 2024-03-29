export interface User {
  name?: string
  lastName?: string
  collaboratorId?: string
  email: string
  password: string
}

export interface UserData {
  userId: string
  companyId: string
  collaboratorId: string
  clientId: string
  groupId: number
  token?: string
  name: string
  fantasyName: string
  url?: string
}

export interface Profile {
  firstName: string
  lastName: string
  phone: string
  address: string
  number: string
  cep: string
  complement: string
}
