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
import { redirect, usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { UserState, useUser } from '@/app/contexts/useUser'

export default function Header({ auth }: { auth: UserState }) {
  const { logOut }: { logOut: any } = useUser()
  const path = usePathname()

  return (
    <Navbar
      classNames={{
        base: 'bg-black',
        content: 'gap-6',
        item: 'flex gap-6',
      }}
      maxWidth="xl"
    >
      <NavbarBrand>
        <Image src={logo} alt="" className="rounded-none h-5" height={20} />
      </NavbarBrand>

      <NavbarContent>
        <NavbarItem isActive={path === '/home'}>
          <Link
            className={
              path === '/home'
                ? 'text-gray-100 font-semibold cursor-pointer'
                : 'text-gray-300 cursor-pointer'
            }
            href="/home"
          >
            Home
          </Link>
        </NavbarItem>

        <NavbarItem isActive={path === '/clients'}>
          <Link
            className={
              path === '/clients'
                ? 'text-gray-100 font-semibold cursor-pointer'
                : 'text-gray-300 cursor-pointer'
            }
            href="/clients"
          >
            Clientes
          </Link>
        </NavbarItem>

        <NavbarItem isActive={path === '/company'}>
          <Link
            className={
              path === '/company'
                ? 'text-gray-100 font-semibold cursor-pointer'
                : 'text-gray-300 cursor-pointer'
            }
            href="/company"
          >
            Empresas
          </Link>
        </NavbarItem>

        <NavbarItem isActive={path === '/projects'}>
          <Link
            className={
              path === '/projects'
                ? 'text-gray-100 font-semibold cursor-pointer'
                : 'text-gray-300 cursor-pointer'
            }
            href="/projects"
          >
            Projetos
          </Link>
        </NavbarItem>

        <NavbarItem isActive={path === '/service-orders'}>
          <Link
            className={
              path === ('/service-orders' || '/service-orders/create')
                ? 'text-gray-100 font-semibold cursor-pointer'
                : 'text-gray-300 cursor-pointer'
            }
            href="/service-orders"
          >
            Ordens de serviço
          </Link>
        </NavbarItem>

        <NavbarItem isActive={path === '/support'}>
          <Link
            className={
              path === '/support'
                ? 'text-gray-100 font-semibold cursor-pointer'
                : 'text-gray-300 cursor-pointer'
            }
            href="/support"
          >
            Suporte
          </Link>
        </NavbarItem>

        <NavbarItem isActive={path === '/closing'}>
          <Link
            className={
              path === '/closing'
                ? 'text-gray-100 font-semibold cursor-pointer'
                : 'text-gray-300 cursor-pointer'
            }
            href="/closing"
          >
            Fechamento
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent data-justify="end" suppressHydrationWarning>
        <NavbarItem>
          <Button
            className="bg-transparent p-0 text-gray-100"
            onClick={() => redirect('/profile')}
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
