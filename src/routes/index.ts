import type { FastifyInstance } from 'fastify'
import { adminLogin } from './admin-login'
import { createDailyTask } from './create-daily-task'
import { createOrUpdateRevenueGoal } from './create-or-update-revenue-goal'
import { createUser } from './create-user'
import { deleteUser } from './delete-user'
import { getDailyTasksByDay } from './get-daily-tasks-by-day'
import { getRevenueGoalByMonth } from './get-revenue-goal-by-month'
import { getUsers } from './get-users'
import { getWeeklyProgress } from './get-weekly-progess'
import { updateUser } from './update-user'
import { userLogin } from './user-login'

export async function registerRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    return { hello: 'world' }
  })

  app.register(adminLogin, { prefix: '/api/admin' })
  app.register(createUser, { prefix: '/api/admin' })
  app.register(getUsers, { prefix: '/api/admin' })
  app.register(deleteUser, { prefix: '/api/admin' })
  app.register(updateUser, { prefix: '/api/admin' })

  app.register(userLogin, { prefix: '/api/user' })
  app.register(createDailyTask, { prefix: '/api/user' })
  app.register(getDailyTasksByDay, { prefix: '/api/user' })
  app.register(getWeeklyProgress, { prefix: '/api/user' })
  app.register(createOrUpdateRevenueGoal, { prefix: '/api/user' })
  app.register(getRevenueGoalByMonth, { prefix: '/api/user' })
}
