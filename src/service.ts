import Fastify, { FastifyInstance } from 'fastify';
import pointOfView from 'point-of-view';
import fastifyStatic from 'fastify-static';
import fastifyFormbody from 'fastify-formbody';
import fastifyCompress from 'fastify-compress';
import ejs from 'ejs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(
  fileURLToPath(import.meta.url),
);

async function start() {
  const server: FastifyInstance = Fastify({
    logger: true,
  });

  // Should go before static.
  server.register(fastifyCompress);

  server.register(fastifyFormbody);

  server.register(pointOfView, {
    engine: {
      ejs,
    },
    root: __dirname,
  });

  server.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/public/',
  });

  server.get('/', async (_, reply) => {
    return reply.view('components/root.ejs', {
      text: 'text',
    });
  });

  server.post('/clicked', async (request, reply) => {
    console.log(request.body);

    return reply.view('components/clicked.ejs', {});
  });

  try {
    await server.listen(3001);
  } catch (error) {
    server.log.error(error);

    process.exit(1);
  }
}

start();
