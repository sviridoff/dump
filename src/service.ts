import Fastify, { FastifyInstance } from 'fastify';
import pointOfView from 'point-of-view';
import fastifyStatic from 'fastify-static';
import fastifyFormbody from 'fastify-formbody';
import fastifyCompress from 'fastify-compress';
import ejs from 'ejs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { kado, Container, Token } from '@daisugi/kado';

import {
  buildDIManifest,
  diRoutesManifestTokens,
} from './buildDIManifest.js';
import { Route } from './types/Route.js';

const __dirname = path.dirname(
  fileURLToPath(import.meta.url),
);

function registerRoutes(
  server: FastifyInstance,
  container: Container,
  tokens: Token[],
) {
  tokens.forEach((token) => {
    const routes: Route[] = container.resolve(token);

    routes.forEach((route) => {
      const method = route.method.toLowerCase();

      // @ts-ignore
      server[method](route.path, route.handler);
    });
  });
}

async function start() {
  const { container } = kado();

  container.register(buildDIManifest());

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
    preCompressed: true,
  });

  registerRoutes(server, container, diRoutesManifestTokens);

  try {
    await server.listen(3001);
  } catch (error) {
    server.log.error(error);

    process.exit(1);
  }
}

start();
