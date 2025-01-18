import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-catalog-backend-module-scaffolder-entity-model';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { MicrosoftGraphOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-msgraph';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);

  builder.addEntityProvider(
    MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { hours: 1 },
        timeout: { minutes: 50 },
        initialDelay: { seconds: 15 },
      }),
    }),
  );

  builder.addProcessor(new ScaffolderEntitiesProcessor());
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
