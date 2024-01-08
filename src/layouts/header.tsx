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

import logo from '../../public/assets/logo-negative-yellow.svg'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useRegister } from '@/hooks/useRegister'
import { useEffect, useState } from 'react'
import { HomeData } from '@/types/home'
import axios from 'axios'

export default function Header() {
  const path = usePathname()
  const router = useRouter()
  const [data, setData] = useState<HomeData>()
  const { token } = useRegister()

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/list/home/data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setData(response.data)
        })
    }
  }, [token])

  const handleUserLogOut = () => {
    if (typeof window !== 'undefined') {
      const localStorage = window.localStorage

      localStorage.clear()
      router.push('/login')
    }
  }

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
        <Image
          src={logo.src}
          alt=""
          className="rounded-none h-5"
          loading="eager"
          height={20}
        />
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
      </NavbarContent>

      <NavbarContent data-justify="end">
        <NavbarItem>
          <Button
            className="bg-transparent p-0 text-gray-100"
            onClick={() => router.push('/profile')}
          >
            <Avatar
              imgProps={{
                loading: 'eager',
              }}
            />
            <span>
              Olá,{' '}
              <span className="font-medium text-yellow-500">{data?.name}</span>!
            </span>
          </Button>

          <Button
            className="bg-red-500/10 text-red-500"
            isIconOnly
            onClick={handleUserLogOut}
          >
            <LogOut size={18} />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
