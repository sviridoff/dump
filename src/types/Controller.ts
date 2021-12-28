import { FastifyReply, FastifyRequest } from 'fastify';

export interface Controller {
  handler(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<FastifyReply>;
}
