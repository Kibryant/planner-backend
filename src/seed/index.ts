import { prisma } from '../lib/prisma'
import * as bcrypt from 'bcrypt'

async function seed() {
  const user = await prisma.user.create({
    data: {
      name: 'Arthur Gustavo',
      email: 'arthurgustavo@example.com',
      password: await bcrypt.hash('123456', 10),
      purchaseDate: new Date(),
      expirationDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ),
      postPlan: {
        create: [
          {
            day: 'MONDAY',
            title: 'Fazer café',
            description: 'Preparar o café da manhã para começar o dia.',
          },
          {
            day: 'MONDAY',
            title: 'Reunião com equipe',
            description: 'Participar da reunião de planejamento semanal.',
          },
          {
            day: 'TUESDAY',
            title: 'Estudar TypeScript',
            description: 'Ler a documentação oficial do TypeScript.',
          },
          {
            day: 'TUESDAY',
            title: 'Desenvolver nova feature',
            description: 'Implsementar a nova feature no sistema.',
          },
        ],
      },
      revenueGoal: {
        create: {
          month: 'SEPTEMBER',
          monthlyGoal: '10000.0',
          dailyGoal: '500.0',
          actions: {
            create: [
              { description: 'Melhorar SEO do site' },
              { description: 'Aumentar investimento em tráfego pago' },
              { description: 'Enviar emails para leads' },
              { description: 'Fazer postagens diárias nas redes sociais' },
            ],
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      postPlan: {
        select: {
          id: true,
          day: true,
          title: true,
          description: true,
        },
      },
      revenueGoal: {
        select: {
          id: true,
          month: true,
          monthlyGoal: true,
          dailyGoal: true,
          actions: {
            select: {
              description: true,
            },
          },
        },
      },
    },
  })

  console.log({ user })
}

seed()
