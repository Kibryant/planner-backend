import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import Fastify from 'fastify'
import { userLogin } from './routes/user-login'
import { env } from './lib/env'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createDailyTask } from './routes/create-daily-task'
import { getDailyTasks } from './routes/get-daily-tasks'
import { getDailyTasksByDay } from './routes/get-daily-tasks-by-day'
import { adminLogin } from './routes/admin-login'
import { createUser } from './routes/create-user'
import { getUsers } from './routes/get-users'
import { deleteUser } from './routes/delete-user'
import { updateUser } from './routes/update-user'
import { startCronJobs } from './lib/cron-job'
import { completeDailyTask } from './routes/complete-daily-taks'
import { getWeeklyProgress } from './routes/get-weekly-progess'
import { createOrUpdateRevenueGoal } from './routes/create-or-update-revenue-goal'
import { getRevenueGoalByMonth } from './routes/get-revenue-goal-by-month'

const app = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>()

const start = async () => {
  try {
    app.register(fastifyCors, {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    })

    app.register(fastifyJwt, {
      secret: env.JWT_SIGNING_KEY,
    })

    app.get('/', async () => {
      return { hello: 'world' }
    })

    app.setValidatorCompiler(validatorCompiler)
    app.setSerializerCompiler(serializerCompiler)

    app.register(adminLogin, { prefix: '/api/admin' })
    app.register(createUser, { prefix: '/api/admin' })
    app.register(getUsers, { prefix: '/api/admin' })
    app.register(deleteUser, { prefix: '/api/admin' })
    app.register(updateUser, { prefix: '/api/admin' })

    app.register(userLogin, { prefix: '/api/user' })
    app.register(createDailyTask, { prefix: '/api/user' })
    app.register(createOrUpdateRevenueGoal, { prefix: '/api/user' })
    app.register(getRevenueGoalByMonth, { prefix: '/api/user' })
    app.register(completeDailyTask, { prefix: '/api/user' })
    app.register(getDailyTasks, { prefix: '/api/user' })
    app.register(getDailyTasksByDay, { prefix: '/api/user' })
    app.register(getWeeklyProgress, { prefix: '/api/user' })

    await app.listen({ port: 3000 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

startCronJobs()
start()
