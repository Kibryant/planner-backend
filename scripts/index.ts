import * as fs from 'node:fs'
import * as path from 'node:path'
import { prisma } from '../src/lib/prisma'
import { env } from '../src/lib/env'

interface User {
  name: string
  email: string
  purchaseDate: string
}

const JSON_FILE_PATH = './scripts/data.json'

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

  expirationDate.setFullYear(expirationDate.getFullYear() + 1)

  await prisma.user.create({
    data: {
      name: user.name,
      email: user.email.toLowerCase(),
      password: env.SECRET_PASSWORD,
      purchaseDate,
      expirationDate,
    },
  })
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function processUsers(users: User[]) {
  for (const user of users) {
    console.log(`Adicionando o usuário ${user.email}...`)
    try {
      await addUser(user)
      console.log(`Usuário ${user.email} adicionado com sucesso!`)
    } catch (error) {
      console.error(`Erro ao adicionar o usuário ${user.email}:`, error)
    }

    await delay(1000)
  }
}

const jsonData = readJsonFile(JSON_FILE_PATH)

if (jsonData) {
  processUsers(jsonData)
    .then(() => {
      console.log('Todos os usuários foram processados!')
      process.exit(0)
    })
    .finally(() => {
      prisma.$disconnect()
      console.log('Conexão com o banco de dados encerrada!')
    })
}
