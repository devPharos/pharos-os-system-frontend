'use client'

import {
  Avatar,
  Button,
  Image,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react'

import logo from '../../public/assets/logo-negative-yellow.png'
import { usePathname } from 'next/navigation'

export default function Header() {
  const path = usePathname()

  return (
    <Navbar
      classNames={{
        base: 'bg-gray-950',
      }}
      maxWidth="xl"
    >
      <NavbarBrand>
        <Image src={logo.src} alt="" className="rounded-none" />
      </NavbarBrand>

      <NavbarContent>
        <NavbarItem isActive={path === '/'}>
          <Link
            className={
              path === '/'
                ? 'text-gray-100 font-semibold cursor-pointer'
                : 'text-gray-300 cursor-pointer'
            }
            href="/"
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
              path === '/service-orders'
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
          >
            Suporte
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent data-justify="end">
        <NavbarItem>
          <Button className="bg-transparent p-0 text-gray-100">
            <Avatar src="https://www.github.com/gitirana.png" />
            <span>
              Olá, <span className="font-medium text-yellow-500">Thayná</span>!
            </span>
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
