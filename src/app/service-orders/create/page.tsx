'use client'

import { getUserData, useRegister } from '@/hooks/useRegister'
import Header from '@/layouts/header'
import { UserData } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import {
  AlertCircle,
  Calendar,
  CircleDollarSign,
  ClipboardCheck,
  Clock,
  DollarSign,
  FileUp,
  Save,
  Search,
  User,
} from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Key, useEffect, useState } from 'react'
import axios from 'axios'
import { Client } from '@/types/client'
import { Projects, ProjectServices, ProjectExpenses } from '@/types/projects'
import { Card } from '@/components/Card'
import CreateOSForm from './form'

export default function CreateOS() {
  const localStorage = window.localStorage
  const token: string = localStorage.getItem('access_token') || ''
  const userData: UserData = getUserData(token)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [projects, setProjects] = useState<Projects[]>([])
  const [projectServices, setProjectServices] = useState<ProjectServices[]>([])
  const [projectExpenses, setProjectExpenses] = useState<ProjectExpenses[]>([])

  const osFormSchema = z.object({
    serviceType: z.string().nonempty('Selecione uma opção'),
    date: z.coerce.date(),
    clientId: z.string().uuid(),
    // companyId: z.string().uuid(),
    // collaboratorId: z.string().uuid(),
    startDate: z.string(),
    endDate: z.string(),
    // totalHours: z.string(),
    // serviceOrderId: z.string().uuid(),
    projectId: z.string().uuid(),
    projectExpenseId: z.string().uuid(),
    // fileHours: z.string(),
    // value: z.string(),
    projectServiceId: z.string().uuid(),
    description: z.string().min(1),
  })

  type TOsFormData = z.infer<typeof osFormSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TOsFormData>({
    resolver: zodResolver(osFormSchema),
  })

  const handleOSFormSubmit: SubmitHandler<TOsFormData> = (
    data: TOsFormData,
  ) => {
    console.log(data)
  }

  useEffect(() => {
    setLoading(true)
    axios
      .get('http://localhost:3333/clients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false)
        setClients(response.data)
      })
  }, [token])

  const handleClientProjects = (selectedKey: any) => {
    setLoading(true)
    const clientId = selectedKey.currentKey
    const body = {
      clientId,
    }

    axios
      .get('http://localhost:3333/projects', {
        data: {
          body,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false)
        setProjects(response.data.projects)
      })
  }

  const handleProjectServices = (projectId: string) => {
    setLoading(true)
    const body = {
      projectId,
    }

    axios
      .get('http://localhost:3333/project-services', {
        data: {
          body,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        setLoading(false)
        setProjectServices(response.data.projectsServices)
      })
  }

  const handleProjectExpenses = (projectId: string) => {
    setLoading(true)
    const body = {
      projectId,
    }

    axios
      .get('http://localhost:3333/project-expenses', {
        data: {
          body,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        setLoading(false)
        setProjectExpenses(response.data.projectExpenses)
      })
  }

  const handleSelectsData = (selectedKey: any) => {
    setLoading(true)
    const projectId = selectedKey.currentKey
    const body = {
      projectId,
    }

    handleProjectExpenses(projectId)
    handleProjectServices(projectId)
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <CreateOSForm />
    </div>
  )
}
