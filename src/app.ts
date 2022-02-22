import Fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from 'fastify';
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
import { validateEnvs } from './validateEnvs.js';
import { AppRoute } from './types/AppRoute.js';

const __dirname = path.dirname(
  fileURLToPath(import.meta.url),
);

function registerRoutes(
  server: FastifyInstance,
  container: Container,
  diRoutesManifestTokens: Token[],
) {
  diRoutesManifestTokens.forEach(
    (diRoutesManifestToken) => {
      const routes: AppRoute[] = container.resolve(
        diRoutesManifestToken,
      );

      routes.forEach((route) => {
        const method = route.method.toLowerCase();

        // @ts-ignore
        server[method](
          route.path,
          async (
            request: FastifyRequest,
            reply: FastifyReply,
          ) => {
            const response = await route.handler({
              params: (request.params as any) ?? {},
              body: (request.body as any) ?? {},
              method: request.method as any,
            });

            if (response.isFailure) {
              throw response.getError();
            }

            const {
              redirectToURL,
              templatePath,
              templateData,
            } = response.getValue();

            if (redirectToURL) {
              return reply.redirect(redirectToURL);
            }

            return reply.view(templatePath!, templateData);
          },
        );
      });
    },
  );
}

async function startWEB() {
  const { container } = kado();

  const envs = validateEnvs();
  container.register(buildDIManifest(envs));

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
    await server.listen(3001, '0.0.0.0');
  } catch (error) {
    server.log.error(error);

    process.exit(1);
  }
}

startWEB();
