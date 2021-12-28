import { ManifestItem } from '@daisugi/kado';

// Clients.
import { PostgreSQLClient } from './clients/PostgreSQLClient.js';

// Root.
import { RootController } from './use-cases/root/RootController.js';
import { mapRootRoutes } from './use-cases/root/mapRootRoutes.js';

// Clicked.
import { ClickedController } from './use-cases/clicked/ClickedController.js';
import { mapClickedRoutes } from './use-cases/clicked/mapClickedRoutes.js';

export const diToken = {
  // Clients.
  PostgreSQLClient: Symbol('PostgreSQLClient'),
  postgreSQLHost: Symbol('postgreSQLHost'),
  postgreSQLPort: Symbol('postgreSQLPort'),
  postgreSQLUser: Symbol('postgreSQLUser'),
  postgreSQLPassword: Symbol('postgreSQLPassword'),
  postgreSQLDatabaseName: Symbol('postgreSQLDatabaseName'),
  // Root.
  RootController: Symbol('RootController'),
  mapRootRoutes: Symbol('mapRootRoutes'),
  // Clicked.
  ClickedController: Symbol('ClickedController'),
  mapClickedRoutes: Symbol('mapClickedRoutes'),
};

export const diRoutesManifestTokens = [
  diToken.mapRootRoutes,
  diToken.mapClickedRoutes,
];

export function buildDIManifest(
  envs: Record<string, unknown>,
): ManifestItem[] {
  return [
    // Clients.
    {
      token: diToken.postgreSQLHost,
      useValue: envs.POSTGRE_SQL_HOST,
    },
    {
      token: diToken.postgreSQLPort,
      useValue: envs.POSTGRE_SQL_PORT,
    },
    {
      token: diToken.postgreSQLUser,
      useValue: envs.POSTGRE_SQL_USER,
    },
    {
      token: diToken.postgreSQLPassword,
      useValue: envs.POSTGRE_SQL_PASSWORD,
    },
    {
      token: diToken.postgreSQLDatabaseName,
      useValue: envs.POSTGRE_SQL_DATABASE_NAME,
    },
    {
      token: diToken.PostgreSQLClient,
      useClass: PostgreSQLClient,
      params: [
        diToken.postgreSQLHost,
        diToken.postgreSQLPort,
        diToken.postgreSQLUser,
        diToken.postgreSQLPassword,
        diToken.postgreSQLDatabaseName,
      ],
    },
    // Root.
    {
      token: diToken.RootController,
      useClass: RootController,
      params: [diToken.PostgreSQLClient],
    },
    {
      token: diToken.mapRootRoutes,
      useFactory: mapRootRoutes,
      params: [diToken.RootController],
    },
    // Clicked.
    {
      token: diToken.ClickedController,
      useClass: ClickedController,
    },
    {
      token: diToken.mapClickedRoutes,
      useFactory: mapClickedRoutes,
      params: [diToken.ClickedController],
    },
  ];
}
