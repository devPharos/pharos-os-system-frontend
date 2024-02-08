'use client'
import {
  Avatar,
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react'
import Image from 'next/image'

import logo from '../../public/assets/logo-negative-yellow.svg'
import { useRouter, usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { UserState, useUser } from '@/app/contexts/useUser'

export default function Header({ auth }: { auth: UserState }) {
  const { logOut }: { logOut: any } = useUser()
  const path = usePathname()
  const router = useRouter()

  return (
    <Navbar
      classNames={{
        base: 'bg-black mb-6',
        content: 'gap-6',
        item: 'flex gap-6',
      }}
      maxWidth="xl"
    >
      <NavbarBrand>
        <Image src={logo} alt="" className="mb- rounded-none h-5" height={20} />
      </NavbarBrand>

      <NavbarContent>
        <NavbarItem isActive={path.includes('home')}>
          <Link
            className={
              path.includes('home')
                ? 'text-gray-100 font-semibold cursor-pointer'
                : 'text-gray-300 cursor-pointer'
            }
            href="/home"
          >
            Home
          </Link>
        </NavbarItem>

        <NavbarItem isActive={path.includes('clients')}>
          <Link
            className={
              path.includes('clients')
                ? 'text-gray-100 font-semibold cursor-pointer'
                : 'text-gray-300 cursor-pointer'
            }
            href="/clients"
          >
            Clientes
          </Link>
        </NavbarItem>

        <NavbarItem isActive={path.includes('company')}>
          <Link
            className={
              path.includes('company')
                ? 'text-gray-100 font-semibold cursor-pointer'
                : 'text-gray-300 cursor-pointer'
            }
            href="/company"
          >
            Empresas
          </Link>
        </NavbarItem>

        <NavbarItem isActive={path.includes('projects')}>
          <Link
            className={
              path.includes('projects')
                ? 'text-gray-100 font-semibold cursor-pointer'
                : 'text-gray-300 cursor-pointer'
            }
            href="/projects"
          >
            Projetos
          </Link>
        </NavbarItem>

        <NavbarItem isActive={path.includes('service-orders')}>
          <Link
            className={
              path.includes('service-orders')
                ? 'text-gray-100 font-semibold cursor-pointer'
                : 'text-gray-300 cursor-pointer'
            }
            href="/service-orders"
          >
            Ordens de serviço
          </Link>
        </NavbarItem>

        <NavbarItem isActive={path.includes('support')}>
          <Link
            className={
              path.includes('support')
                ? 'text-gray-100 font-semibold cursor-pointer'
                : 'text-gray-300 cursor-pointer'
            }
            href="/support"
          >
            Suporte
          </Link>
        </NavbarItem>

        {auth?.user.groupId === 1 && (
          <NavbarItem isActive={path.includes('closing')}>
            <Link
              className={
                path.includes('closing')
                  ? 'text-gray-100 font-semibold cursor-pointer'
                  : 'text-gray-300 cursor-pointer'
              }
              href="/closing"
            >
              Fechamento
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent data-justify="end" suppressHydrationWarning>
        <NavbarItem>
          <Button
            className="bg-transparent p-0 text-gray-100"
            onClick={() => router.push('/profile')}
          >
            <Avatar
              src={auth?.user?.url}
              imgProps={{
                loading: 'eager',
              }}
            />
            <span>
              Olá,{' '}
              <span className="font-medium text-yellow-500">
                {auth?.user?.name}
              </span>
              !
            </span>
          </Button>

          <Button
            className="bg-red-500/10 text-red-500"
            isIconOnly
            onClick={() => logOut()}
          >
            <LogOut size={18} />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
