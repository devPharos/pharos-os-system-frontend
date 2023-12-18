import { Project } from '@/types/projects'
import axios from 'axios'
import { ChangeEvent, Key, useState } from 'react'

export const parseDate = (date: string): Date => {
  const [hours, minutes] = date.split(':').map(Number)
  const newDate = new Date()
  newDate.setHours(hours)
  newDate.setMinutes(minutes)

  return newDate
}

interface FilterProps {
  status?: Key | null
  search?: string
  array: Project[]
  setArray: React.Dispatch<React.SetStateAction<Project[]>>
}

export const onFilter = ({
  status = null,
  search = '',
  array,
  setArray,
}: FilterProps) => {
  const filteredItem = array.map((item) => {
    item.hide = true

    if (status) {
      if (item.status === status || status === 'Limpar') {
        item.hide = false
      }
    }

    if (search) {
      if (item.name.includes(search)) {
        item.hide = false
      }
    }

    if (!search && !status) {
      item.hide = false
    }

    return item
  })

  setArray(filteredItem)
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
