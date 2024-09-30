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
import { createOrUpdateRevenueGoal } from './routes/create-or-update-revenue-goal'
import { getRevenueGoalsByMonth } from './routes/get-revenue-goals-by-month'
import { adminLogin } from './routes/admin-login'
import { createUser } from './routes/create-user'
import { getUsers } from './routes/get-users'
import { deleteUser } from './routes/delete-user'
import { updateUser } from './routes/update-user'

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

    app.setValidatorCompiler(validatorCompiler)
    app.setSerializerCompiler(serializerCompiler)

    app.register(adminLogin, { prefix: '/api/admin' })
    app.register(createUser, { prefix: '/api/admin' })
    app.register(getUsers, { prefix: '/api/admin' })
    app.register(deleteUser, { prefix: '/api/admin' })
    app.register(updateUser, { prefix: '/api/admin' })

    app.register(userLogin, { prefix: '/api/user' })
    app.register(createDailyTask, { prefix: '/api/user' })
    app.register(getDailyTasks, { prefix: '/api/user' })
    app.register(getDailyTasksByDay, { prefix: '/api/user' })
    app.register(createOrUpdateRevenueGoal, { prefix: '/api/user' })
    app.register(getRevenueGoalsByMonth, { prefix: '/api/user' })

    await app.listen({ port: 3000 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
