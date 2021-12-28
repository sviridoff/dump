import { FastifyReply, FastifyRequest } from 'fastify';

import { Controller } from '../../types/Controller.js';

export class ClickedController implements Controller {
  async handler(_: FastifyRequest, reply: FastifyReply) {
    return reply.view(
      'use-cases/clicked/templates/clicked.ejs',
      {},
    );
  }
}
