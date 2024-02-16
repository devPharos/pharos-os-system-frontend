export interface Client {
  id: string
  active?: boolean
  hide?: boolean
  companyId: string
  userId: string | null
  address: string
  businessName: string
  cep: string
  city: string
  cnpj: string
  complement: string
  country: string
  fantasyName: string
  neighborhood: string
  number: string
  phone: string
  state: string
  paymentDate: string
}
