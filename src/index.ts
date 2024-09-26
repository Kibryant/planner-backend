import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import Fastify from 'fastify'

import { userRoute } from './routes/user-route'
import { env } from './lib/env'

const app = Fastify({
  logger: true,
})

const start = async () => {
  try {
    app.register(fastifyCors, {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    })

    app.register(fastifyJwt, {
      secret: env.JWT_SIGNING_KEY,
    })

    app.register(userRoute, { prefix: '/api/user' })

    await app.listen({ port: 3000 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
