# Configuring Auth

## Introduction

Welcome back the Backstage 101 workshop! In this section, you will learn how to configure Auth in Backstage.

For this example we will be using Entra ID (Formerly Azure AD), Backstage supports a number of Authentication providers which can be found [here](https://backstage.io/docs/auth/#built-in-authentication-providers).

## Prerequisites

Before you start, you will need to have installed the required tools and installed Backstage using the [Getting Started](../00-getting-started/README.md) guide.

We also recommend that you have completed the tasks in the [Configuring Backstage](../01-configuring/README.md) section.

## Tasks

### 1. Crete an Entra ID app registration

#### 1.1. Create a new app registration

Login to the [Azure Portal](https://portal.azure.com) and create a new app registration.

<img src="/assets/02-auth/01-app-reg.png" height=25%>

#### 1.2. Configure the app registration

Configure the new app registration with a name and a redirect URI.

<img src="/assets/02-auth/02-register-app-name.png" height=25%>

Make note of the tenant ID, client ID.

<img src="/assets/02-auth/03-app-details.png" height=25%>

#### 1.3. Configure a secret

Create a new secret for the app registration.

<img src="/assets/02-auth/05-secrets.png" height=25%>

<img src="/assets/02-auth/06-add-secret.png" height=25%>

Make note of the secret value.

<img src="/assets/02-auth/07-secret-value.png" height=25%>

#### 1.4. Now we will need to add some permissions to the app registration

Navigate to the API permissions tab and add the following permissions:

<img src="/assets/02-auth/08-permissions.png" height=25%>

- Microsoft Graph
  - email (delegated)
  - GroupMember.Read.All (application)
  - openid (delegated)
  - profile (delegated)
  - User.Read (delegated)
  - User.ReadBasic.All (application)

<img src="/assets/02-auth/09-add-permission.png" height=25%>

Once added you will need to grant admin consent.

<img src="/assets/02-auth/10-grant-permissions.png" height=25%>

Finally you will need to ensure that Implicit grant and hybrid flows are unticked.

<img src="/assets/02-auth/12-auth.png" height=25%>

<img src="/assets/02-auth/13-required-auth-settings.png" height=25%>

### 2. Configuring auth in our `app-config.yaml` file

#### 2.1. Add the auth configuration

Add the following configuration to the `app-config.yaml` file.

```yaml
auth:
  environment: development
  providers:
    guest: {}
    microsoftGraphOrg:
      default:
        tenantId: ${AZURE_TENANT_ID}
        user:
          filter: accountEnabled eq true and userType eq 'member'
        group:
          filter: >
            securityEnabled eq false
            and mailEnabled eq true
            and groupTypes/any(c:c+eq+'Unified')
        schedule:
          frequency: PT5H
          timeout: PT50M
    microsoft:
      development:
        clientId: ${AZURE_CLIENT_ID}
        clientSecret: ${AZURE_CLIENT_SECRET}
        tenantId: ${AZURE_TENANT_ID}
        domainHint: ${AZURE_TENANT_ID}
        additionalScopes:
          - Mail.Send
        signIn:
          resolvers:
            - resolver: emailMatchingUserEntityProfileEmail
```

This will allow backstage to authenticate users using Entra ID (Formerly Azure AD). The configuration will allow any user of the tenant to login, we will be implementing more restrictive permissions later.

You will need to add the environment variables or replace them in your configuration

```bash
export AZURE_TENANT_ID=YOUR_TENANT_ID
export AZURE_CLIENT_ID=YOUR_CLIENT_ID
export AZURE_CLIENT_SECRET=YOUR_CLIENT
```

#### 2.2. Install the required packages

You will need to install the required packages to use the Microsoft Graph provider.
This command

```bash
yarn --cwd packages/backend add \
    @backstage/plugin-auth-backend-module-microsoft-provider \
    @backstage/plugin-catalog-backend-module-msgraph
```

#### 2.3. Update the catalog configuration in the `app-config.yaml` file

Add the following configuration to the `app-config.yaml` file.

```yaml
catalog:
  providers:
    microsoftGraphOrg:
      providerId:
        target: https://graph.microsoft.com/v1.0
        authority: https://login.microsoftonline.com
        tenantId: ${AZURE_TENANT_ID}
        clientId: ${AZURE_CLIENT_ID}
        clientSecret: ${AZURE_CLIENT_SECRET}
        queryMode: basic
        user:
          filter: accountEnabled eq true and userType eq 'member'
        group:
          filter: >
            securityEnabled eq false
            and mailEnabled eq true
            and groupTypes/any(c:c+eq+'Unified')
        schedule:
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { hours: 1 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 50 }
          # supports ISO duration, "human duration" as used in code
          initialDelay: { seconds: 15 }
```

This will allow backstage to pull in data from your Azure AD tenant so it can be referenced in the catalog.

#### 2.3. auth.ts

Add the following code to the `packages/backend/src/plugins/auth.ts` file.

```typescript
import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: {
      ...defaultAuthProviderFactories,

      microsoft: providers.microsoft.create({
        signIn: {
          resolver:
            providers.microsoft.resolvers.emailMatchingUserEntityProfileEmail(),
        },
      }),
    },
  });
}
```

#### 2.4. catalog.ts

Add the following code to the `packages/backend/src/plugins/catalog.ts` file.

```typescript
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
```

#### 2.5. Add the required additional lines to `packages/backend/src/index.ts`

```typescript
// auth plugin
backend.add(import('@backstage/plugin-auth-backend-module-microsoft-provider'));

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend-module-msgraph'));
```

#### 2.6. Register the auth provider in the frontend

Add the following code to the `packages/app/src/App.tsx` file.

```typescript
import { microsoftAuthApiRef } from '@backstage/core-plugin-api';

const app = createApp({
  // Existing configuration goes here
  components: {
    SignInPage: props => {
      return (
        <SignInPage
          {...props}
          providers={[
            'guest', // Should be removed in production
            {
              id: 'azure-auth-provider',
              title: 'Entra ID',
              message: 'Sign in with Microsoft',
              apiRef: microsoftAuthApiRef,
            },
          ]}
        />
      );
    },
  },
});
```

### 3. Restart your Backstage app

For your changes to take effect, you will need to restart your Backstage app.

```bash
yarn dev
```

### 4. Verify the changes

Open your browser and navigate to `http://localhost:3000` to see the changes you have made.

<img src="/assets/02-auth/14-new-auth-button.png" height=25%>

You should now see a new button on the login page for Entra ID.

#### 4.1. Login with Entra ID

Click the Entra ID button and login with your Entra ID credentials.

<img src="/assets/02-auth/15-authenticated.png" height=25%>

You should now be logged in to Backstage using Entra ID.

<img src="/assets/02-auth/16-settings-page.png" height=25%>

## Next steps

In the next section, you will learn how to set up the GitHub Integration in Backstage.

- [Setting up GitHub integration](../03-github/README.md)

## Resources

- [Backstage Documentation](https://backstage.io/docs)
- [Backstage GitHub repository](https://github.com/backstage/backstage)
- [Backstage Discord channel](https://discord.com/invite/MUpMjP2)
