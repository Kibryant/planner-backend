import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import Fastify from 'fastify'
import { env } from './lib/env'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { registerRoutes } from './routes'
import { registerMiddlewares } from './middleware'

const app = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>()

const start = async () => {
  try {
    app.setErrorHandler((error, request, reply) => {
      app.log.error(error)
      reply.send({
        error: 'Internal Server Error',
        message: error.message,
      })
    })

    app.setValidatorCompiler(validatorCompiler)
    app.setSerializerCompiler(serializerCompiler)

    await registerMiddlewares(app)
    await registerRoutes(app)

    await app.listen({ port: 3000 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
