export interface User {
  access_token: string
  email: string
}

export interface UserData {
  userId: string
  companyId: string
  collaboratorId: string
  clientId: string
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
