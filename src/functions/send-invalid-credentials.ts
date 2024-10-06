import type { FastifyReply } from 'fastify/types/reply'
import { HTTP_STATUS_CODE } from '../types'

export function sendInvalidCredentials(reply: FastifyReply) {
  reply
    .status(HTTP_STATUS_CODE.BAD_REQUEST)
    .send({ message: 'Credencias Inválidas' })
}
