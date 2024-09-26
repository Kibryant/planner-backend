import type { FastifyReply, FastifyRequest } from 'fastify'
import { HTTP_STATUS_CODE } from '../types'

export async function middleware(req: FastifyRequest, reply: FastifyReply) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    reply.code(HTTP_STATUS_CODE.UNAUTHORIZED).send({ message: 'Unauthorized' })
    return
  }

  try {
    req.jwtVerify()
  } catch (err) {
    reply.code(HTTP_STATUS_CODE.UNAUTHORIZED).send({ message: 'Unauthorized' })
  }
}
