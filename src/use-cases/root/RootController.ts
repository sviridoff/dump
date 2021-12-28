import { FastifyReply, FastifyRequest } from 'fastify';

import { Controller } from '../../types/Controller.js';

export class RootController implements Controller {
  async handler(_: FastifyRequest, reply: FastifyReply) {
    return reply.view('use-cases/root/templates/root.ejs', {
      text: 'text',
    });
  }
}
