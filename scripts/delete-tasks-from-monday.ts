import { prisma } from '../src/lib/prisma'

export async function deleteTasksFromMonday() {
  try {
    const deletedPostPlans = await prisma.postPlan.deleteMany({})
    console.log(`PostPlans deletados: ${deletedPostPlans.count}`)
  } catch (error) {
    console.error('Erro ao deletar PostPlans:', error)
  }
}
