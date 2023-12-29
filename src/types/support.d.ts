export interface SupportTicketProject {
  id: string
  name: string
}
export interface SupportTicketClient {
  id: string
  fantasyName: string
}

export interface SupportTicket {
  id: string
  priority: 'Alta' | 'Media' | 'Baixa'
  status: 'Atraso' | 'NaoIniciado' | 'Iniciado' | 'Finalizado'
  title: string
  client: SupportTicketClient
  hide?: boolean
  helperTopic:
    | 'Desenvolvimento'
    | 'Suporte'
    | 'Infraestrutura'
    | 'Modulos'
    | 'Faturamento'
}

export interface SupportTicketCollaborator {
  id: string
  name: string
  lastName: string
}

export interface SupportTicketCompany {
  id: string
  name: string
}

export interface SupportTicketUser {
  id: string
  collaborator: SupportTicketCollaborator
  client: SupportTicketClient
  company: SupportTicketCompany
}

export interface SupportTicketMessage {
  id: string
  message: string
  user: SupportTicketUser
  createdAt: Date
}

export interface Ticket {
  title: string
  collaborator: SupportTicketCollaborator
  status: 'Atraso' | 'NaoIniciado' | 'Iniciado' | 'Finalizado'
  priority: 'Alta' | 'Media' | 'Baixa'
  endDate: string
  client: SupportTicketClient
  project: SupportTicketProject
  helperTopic:
    | 'Desenvolvimento'
    | 'Suporte'
    | 'Infraestrutura'
    | 'Modulos'
    | 'Faturamento'
  SupportMessage: SupportTicketMessage[]
}
