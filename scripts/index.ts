import * as fs from 'node:fs'
import * as path from 'node:path'
import { prisma } from '../src/lib/prisma'
import { env } from '../src/lib/env'

interface User {
  name: string
  email: string
  purchaseDate: string
}

const JSON_FILE_PATH = './scripts/data-2-years.json'

function convertToDate(dateString: string): Date | null {
  try {
    const [datePart, timePart] = dateString.split(' ')
    const [day, month, year] = datePart.split('/').map(Number)
    const [hours, minutes, seconds] = timePart.split(':').map(Number)

    return new Date(year, month - 1, day, hours, minutes, seconds)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao converter a data:', error.message)
    }
    return null
  }
}

function readJsonFile(filePath: string): User[] | null {
  try {
    const absolutePath = path.resolve(filePath)
    const data = fs.readFileSync(absolutePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao ler o arquivo:', error.message)
    }

    return null
  }
}

async function addUser(user: User) {
  const purchaseDate = convertToDate(user.purchaseDate)

  if (!purchaseDate) return

  const expirationDate = new Date(purchaseDate)

  expirationDate.setFullYear(expirationDate.getFullYear() + 2)

  await prisma.user.create({
    data: {
      name: 'Maria francisca dos Santos Gonçalves',
      email: 'franvip2016@gmail.com',
      password: env.SECRET_PASSWORD,
      purchaseDate,
      expirationDate,
    },
  })
}

const jsonData = readJsonFile(JSON_FILE_PATH)

addUser({
  name: 'Maria francisca dos Santos Gonçalves',
  email: 'franvip2016@gmail.com',
  purchaseDate: '18/11/2024 21:41:43',
})

// if (jsonData) {
//   for (const user of jsonData) {
//     setTimeout(() => {
//       console.log(`Adicionando o usuário ${user.email}...`)
//     }, 3000)

//     addUser(user)
//       .then(() => {
//         console.log(`Usuário ${user.email} adicionado com sucesso!`)
//       })
//       .catch(error => {
//         console.error(`Erro ao adicionar o usuário ${user.email}:`, error)
//       })
//       .finally(() => {
//         prisma.$disconnect()
//       })
//   }
// }
