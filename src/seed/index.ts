import { env } from '../lib/env'
import { prisma } from '../lib/prisma'
import * as bcrypt from 'bcrypt'

async function seed() {
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: env.ADMIN_EMAIL,
      role: 'ADMIN',
      password: await bcrypt.hash(env.ADMIN_PASSWORD, 10),
      purchaseDate: new Date(),
      expirationDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 100)
      ),
      postPlan: {
        create: [],
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
    },
  })

  console.log(admin)
}

seed()
