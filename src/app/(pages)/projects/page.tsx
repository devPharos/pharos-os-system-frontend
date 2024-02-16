'use client'

import { useUser } from '@/app/contexts/useUser'
import { getProjects } from '@/functions/requests'
import { Project } from '@/types/projects'
import { useEffect, useState } from 'react'
import { ProjectHeader } from './project-header'
import { ProjectSearchFilter } from './filters/project-search-filter'
import { ProjectStatusFilter } from './filters/project-status-filter'
import { ProjectCard } from './project-card'

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const { auth } = useUser()

  useEffect(() => {
    async function fetchData() {
      const projectsList = await getProjects(auth?.token)
      setProjects(projectsList)
    }

    fetchData()
  }, [auth.token])

  return (
    <main className="max-w-7xl w-full  flex flex-col px-6 py-14 gap-16 flex-1">
      <ProjectHeader />

      <header className="flex items-center justify-between">
        <section className="flex w-full gap-6">
          <ProjectSearchFilter projects={projects} setProjects={setProjects} />

          <ProjectStatusFilter projects={projects} setProjects={setProjects} />
        </section>
      </header>

      <section className="flex flex-wrap gap-6">
        {projects &&
          projects.map((project) => {
            if (!project.hide) {
              return <ProjectCard project={project} key={project.id} />
            }

            return null
          })}
      </section>
    </main>
  )
}
