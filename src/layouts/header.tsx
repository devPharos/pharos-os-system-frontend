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

export default function Header() {
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
        <NavbarItem isActive>
          <Link className="text-gray-100 font-semibold cursor-pointer">
            Home
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link className="text-gray-300 cursor-pointer">Clientes</Link>
        </NavbarItem>

        <NavbarItem>
          <Link className="text-gray-300 cursor-pointer">Projetos</Link>
        </NavbarItem>

        <NavbarItem>
          <Link className="text-gray-300 cursor-pointer">
            Ordens de serviço
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link className="text-gray-300 cursor-pointer">Suporte</Link>
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
