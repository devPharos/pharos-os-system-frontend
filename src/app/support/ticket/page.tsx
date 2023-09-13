'use client'
import Header from '@/layouts/header'
import { Avatar } from '@nextui-org/react'

export default function SupportTicket() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <main className="flex flex-col gap-16 max-w-7xl w-full px-6 py-14">
        <header>
          <span className="text-2xl text-white font-semibold">
            Chamado <span className="text-yellow-500">#00001</span>: Erro no
            arquivo
          </span>
        </header>

        <section className="flex items-center justify-between">
          <section className="flex flex-col leading-relaxed">
            <span className="text-gray-300 font-medium">
              Status: <span className="text-gray-100 font-normal">Aberto</span>
            </span>
            <span className="text-gray-300 font-medium">
              Prioridade:{' '}
              <span className="text-gray-100 font-normal">Normal</span>
            </span>
            <span className="text-gray-300 font-medium">
              Departamento:{' '}
              <span className="text-gray-100 font-normal">Pharos</span>
            </span>
            <span className="text-gray-300 font-medium">
              Data de Criação:{' '}
              <span className="text-gray-100 font-normal">06/09/23 09:05</span>
            </span>
            <span className="text-gray-300 font-medium">
              Atribuído a:{' '}
              <span className="text-gray-100 font-normal">Denis Varella</span>
            </span>
            <span className="text-gray-300 font-medium">
              Plano de SLA:{' '}
              <span className="text-gray-100 font-normal">SLA Padrão</span>
            </span>
            <span className="text-gray-300 font-medium">
              Data de vencimento:{' '}
              <span className="text-gray-100 font-normal">07/09/23 09:05</span>
            </span>
          </section>

          <section className="flex flex-col leading-relaxed">
            <span className="text-gray-300 font-medium">
              Usuário:{' '}
              <span className="text-gray-100 font-normal">
                Júlia Rodrigues - Bola de Neve
              </span>
            </span>
            <span className="text-gray-300 font-medium">
              E-mail:{' '}
              <span className="text-gray-100 font-normal">
                julia.rodrigues@boladeneve.com
              </span>
            </span>
            <span className="text-gray-300 font-medium">
              Organização:{' '}
              <span className="text-gray-100 font-normal">Bola de Neve</span>
            </span>
            <span className="text-gray-300 font-medium">
              Origem: <span className="text-gray-100 font-normal">Email</span>
            </span>
            <span className="text-gray-300 font-medium">
              Tópico de ajuda:{' '}
              <span className="text-gray-100 font-normal">Nenhum</span>
            </span>
            <span className="text-gray-300 font-medium">
              Última mensagem:{' '}
              <span className="text-gray-100 font-normal">
                06/09/23 às 09:05
              </span>
            </span>
            <span className="text-gray-300 font-medium">
              Última Resposta:{' '}
              <span className="text-gray-100 font-normal"></span>
            </span>
          </section>
        </section>

        <section className="space-y-8">
          <section className="flex gap-2">
            <Avatar
              className="min-w-[40px]"
              imgProps={{
                loading: 'eager',
              }}
            />
            <div className="flex flex-col gap-2 text-sm  max-w-4xl">
              <span>
                Julia Rodrigues -{' '}
                <span className="font-medium text-yellow-500">
                  Bola de Neve
                </span>
              </span>
              <span className="bg-gray-700 py-3 px-4 rounded-lg">
                Morbi congue sodales tristique. In ut tortor sodales nisi
                vulputate lobortis sit amet non nisi. Vivamus ac lacus feugiat
                mi vestibulum sollicitudin. Vestibulum pulvinar lectus libero, a
                elementum velit dignissim quis. Proin sodales semper ligula a
                malesuada. Donec nec dapibus velit. Pellentesque sodales feugiat
                augue vel cursus. Ut sed orci a est ullamcorper pretium. Donec
                efficitur pellentesque est, ultrices eleifend leo porttitor eu.
              </span>
            </div>
          </section>

          <section className="flex gap-2">
            <div className="flex items-end flex-col gap-2 text-sm max-w-4xl">
              <span>
                Thayná Gitirana -{' '}
                <span className="font-medium text-yellow-500">PharosIT</span>
              </span>
              <span className="bg-gray-400 py-3 px-4 rounded-lg">
                Morbi congue sodales tristique. In ut tortor sodales nisi
                vulputate lobortis sit amet non nisi. Vivamus ac lacus feugiat
                mi vestibulum sollicitudin. Vestibulum pulvinar lectus libero, a
                elementum velit dignissim quis. Proin sodales semper ligula a
                malesuada. Donec nec dapibus velit. Pellentesque sodales feugiat
                augue vel cursus. Ut sed orci a est ullamcorper pretium. Donec
                efficitur pellentesque est, ultrices eleifend leo porttitor eu.
              </span>
            </div>

            <Avatar
              className="min-w-[40px]"
              imgProps={{
                loading: 'eager',
              }}
            />
          </section>
        </section>
      </main>
    </div>
  )
}
