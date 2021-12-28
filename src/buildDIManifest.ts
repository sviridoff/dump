import { ManifestItem } from '@daisugi/kado';

// Root.
import { RootController } from './use-cases/root/RootController.js';
import { mapRootRoutes } from './use-cases/root/mapRootRoutes.js';

// Clicked.
import { ClickedController } from './use-cases/clicked/ClickedController.js';
import { mapClickedRoutes } from './use-cases/clicked/mapClickedRoutes.js';

export const diToken = {
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

export function buildDIManifest(): ManifestItem[] {
  return [
    // Root.
    {
      token: diToken.RootController,
      useClass: RootController,
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
