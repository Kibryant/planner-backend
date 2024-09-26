import type { FastifyInstance } from 'fastify'
import { middleware } from '../middleware'

export async function userRoute(app: FastifyInstance) {
  app.get('/', async (req, reply) => {
    const token = app.jwt.sign({
      payload: {
        email: 'admin@gmail.com',
      },
    })

    reply.send({ token })
  })

  app.get('/protected', { preHandler: [middleware] }, (req, reply) => {
    reply.send({ message: 'This is a protected route' })
  })
}
