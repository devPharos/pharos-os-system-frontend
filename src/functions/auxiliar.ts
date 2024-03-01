import { CreateMonthlyClosingSchema } from '@/app/(pages)/closing/create/page'
import axios from 'axios'
import saveAs from 'file-saver'
import { ChangeEvent } from 'react'
import { toast } from 'sonner'

export const parseDate = (date: string): Date => {
  const [hours, minutes] = date.split(':').map(Number)
  const newDate = new Date()
  newDate.setHours(hours)
  newDate.setMinutes(minutes)

  return newDate
}

export const validateCNPJ = (cnpj: string): boolean => {
  if (cnpj.length !== 14) {
    return false
  }

  let firstDigit = 0

  const digitsSum =
    Number(cnpj[0]) * 5 +
    Number(cnpj[1]) * 4 +
    Number(cnpj[2]) * 3 +
    Number(cnpj[3]) * 2 +
    Number(cnpj[4]) * 9 +
    Number(cnpj[5]) * 8 +
    Number(cnpj[6]) * 7 +
    Number(cnpj[7]) * 6 +
    Number(cnpj[8]) * 5 +
    Number(cnpj[9]) * 4 +
    Number(cnpj[10]) * 3 +
    Number(cnpj[11]) * 2

  const rest = digitsSum % 11

  if (rest < 2) {
    firstDigit = 0
  }

  if (rest >= 2) {
    firstDigit = 11 - rest
  }

  const secondDigitsSum =
    Number(cnpj[0]) * 6 +
    Number(cnpj[1]) * 5 +
    Number(cnpj[2]) * 4 +
    Number(cnpj[3]) * 3 +
    Number(cnpj[4]) * 2 +
    Number(cnpj[5]) * 9 +
    Number(cnpj[6]) * 8 +
    Number(cnpj[7]) * 7 +
    Number(cnpj[8]) * 6 +
    Number(cnpj[9]) * 5 +
    Number(cnpj[10]) * 4 +
    Number(cnpj[11]) * 3 +
    firstDigit * 2

  const secondRest = secondDigitsSum % 11
  let secondDigit = 0

  if (secondRest < 2) {
    secondDigit = 0
  }

  if (secondRest >= 2) {
    secondDigit = 11 - secondRest
  }

  if (
    firstDigit.toString() !== cnpj[12] ||
    secondDigit.toString() !== cnpj[13]
  ) {
    return false
  }

  return true
}

export const handleFormatCPForCNPJ = (e: ChangeEvent<HTMLInputElement>) => {
  const inputValue = e.target.value

  if (inputValue.length <= 14) {
    const inputValue = e.target.value

    const formattedCPF = inputValue
      .replace(/\D/g, '')
      .replace(/^(\d{3})(\d{3})?(\d{3})?(\d{2})?/, '$1.$2.$3-$4')

    e.target.value = formattedCPF
  }

  if (inputValue.length > 14) {
    const formattedCNPJ = inputValue
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, '$1.$2.$3/$4-$5')

    e.target.value = formattedCNPJ
  }
}

export const handleFormatPhone = (e: ChangeEvent<HTMLInputElement>) => {
  const inputValue = e.target.value

  const formattedPhone = inputValue
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d{5})?(\d{4})?/, '($1) $2-$3')

  e.target.value = formattedPhone
}

export const validateCPF = (cpf: string): boolean => {
  if (cpf.length !== 11) {
    return false
  }

  let firstDigit = 0

  const digitsSum =
    Number(cpf[0]) * 10 +
    Number(cpf[1]) * 9 +
    Number(cpf[2]) * 8 +
    Number(cpf[3]) * 7 +
    Number(cpf[4]) * 6 +
    Number(cpf[5]) * 5 +
    Number(cpf[6]) * 4 +
    Number(cpf[7]) * 3 +
    Number(cpf[8]) * 2

  const rest = (digitsSum * 10) % 11
  firstDigit = rest === 10 ? 0 : rest

  if (firstDigit !== Number(cpf[9])) {
    return false
  }

  const secondDigitsSum =
    Number(cpf[0]) * 11 +
    Number(cpf[1]) * 10 +
    Number(cpf[2]) * 9 +
    Number(cpf[3]) * 8 +
    Number(cpf[4]) * 7 +
    Number(cpf[5]) * 6 +
    Number(cpf[6]) * 5 +
    Number(cpf[7]) * 4 +
    Number(cpf[8]) * 3 +
    firstDigit * 2

  const secondRest = (secondDigitsSum * 10) % 11
  const secondDigit = secondRest === 10 ? 0 : secondRest

  if (secondDigit !== Number(cpf[10])) {
    return false
  }

  return true
}

interface AddressData {
  bairro: string
  cep: string
  complemento: string
  ddd: string
  gia: string
  ibge: string
  localidade: string
  logradouro: string
  siafi: string
  uf: string
  erro?: boolean
}

export const handleFormatCEP = (e: ChangeEvent<HTMLInputElement>) => {
  const inputValue = e.target.value

  const formattedPhone = inputValue
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d{3})?(\d{3})?/, '$1.$2-$3')

  e.target.value = formattedPhone
}

export const getCEPData = async (cep: string): Promise<AddressData | null> => {
  const newCep = cep.replace(/\D/g, '')

  let data = {
    bairro: '',
    cep: '',
    complemento: '',
    ddd: '',
    gia: '',
    ibge: '',
    localidade: '',
    logradouro: '',
    siafi: '',
    uf: '',
  }

  await axios
    .get(`https://viacep.com.br/ws/${newCep}/json/`)
    .then(function (response) {
      data = response.data
    })
    .catch(function (error) {
      console.error(error)
    })

  return data
}

export interface Bank {
  code: number
  fullName: string
}

export const getBanksData = async (): Promise<Bank[]> => {
  let banks: Bank[] = []

  await axios
    .get(`https://brasilapi.com.br/api/banks/v1`)
    .then(function (response) {
      banks = response.data
        .sort(function (a: Bank, b: Bank) {
          return a.code < b.code ? -1 : a.code > b.code ? 1 : 0
        })
        .filter((bank: Bank) => bank.code)
    })
    .catch(function (error) {
      console.error(error)
    })

  return banks
}

export interface PDFProps extends CreateMonthlyClosingSchema {
  selectedProjects: string[]
}

export const handleCreateClosingPdf = async (body: PDFProps, token: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/report/pdf`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const pdfsPaths: {
    path: string
    pathName: string
    users: {
      name: string
      lastName: string
      value: string
      userId?: string | null
    }[]
    serviceOrders: {
      date: Date
      startDate: Date
      endDate: Date
      client: {
        fantasyName: string
      }
      collaborator: {
        name: string
        lastName: string
        value: string
        userId?: string | null
      }
      serviceOrderExpenses: {
        value: string
      }[]
    }
  }[] = response.data

  pdfsPaths.forEach(async (file) => {
    const downloadResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/report/pdf`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          fileName: file.pathName,
        },
        responseType: 'blob',
      },
    )

    const pdfBlob = new Blob([downloadResponse.data], {
      type: 'application/pdf',
    })
    saveAs(pdfBlob, `${file.pathName}.pdf`)

    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/report/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
          fileName: file.pathName,
        },
      })
      .then(() => {
        file.users.forEach(async (user) => {
          await axios
            .post(
              `${process.env.NEXT_PUBLIC_API_URL}/mail/monthly-closing`,
              {
                user,
                serviceOrders: file.serviceOrders,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            )
            .catch((err) => {
              if (err) {
                toast.error('Um erro inesperado aconteceu!')
              }
            })
        })
      })
  })

  toast.success('Fechamento concluído')
}
