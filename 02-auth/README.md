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

<img src="/assets/02-auth/09-add-permissions.png" height=25%>

### 2. Configure the `app-config.yaml` file

#### 2.1. Change the title

You can change the title of your Backstage app by changing the `title` field in the `app-config.yaml` file.

```yaml
app:
  title: 'My Backstage App'
```

#### 2.2. Change the organization name

You can change the organization name by changing the `organization` field in the `app-config.yaml` file.

```yaml
app:
  organization:
    name: ACME Corp
```

#### 2.3. Change the host configuration (optional)

Here you can change the port and host that Backstage listens on. By default, Backstage listens on port TCP/3000 & TCP/7007 on localhost.

```yaml
app:
  listen:
    port: 3000
    host: 0.0.0.0

backend:
  listen:
    port: 7007
    host: 0.0.0.0
```

If you change the frontend (app) port you will also need to change the CORS configuration.

```yaml
backend:
  cors:
    origin: http://localhost:YOUR_UPDATED_PORT
```

### 3. Deploy a Postgres database

You can deploy a Postgres database using Docker. Run the following command:

```bash
docker pull postgres:17.0-bookworm
docker run -d --name backstage-postgres --restart=always -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword postgres:17.0-bookworm
```

### 4. Update the `app-config.yaml` file with the Postgres database connection

```yaml
backend:
  database:
    client: pg
    connection:
      host: localhost
      port: 5432
      user: postgres
      password: mysecretpassword
```

This is fine for local development, but in production, you should use environment variables to store sensitive information.

```yaml
backend:
  database:
    client: pg
    connection:
      host: ${POSTGRES_HOST}
      port: ${POSTGRES_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
```

### 5. Restart your Backstage app

To apply the changes, you will need to restart your Backstage app.

```bash
yarn dev
```

Not Working? Check the logs in the terminal where you started the Backstage app.

Still not working? Check out our example `app-config.yaml` file [here](./backstage/app-config.yaml).

### 6. Verify the changes

Open your browser and navigate to `http://localhost:3000` to see the changes you have made.

## Next steps

In the next section, you will learn how to set up Auth in Backstage.

- [Setting up Auth](../02-auth/README.md)

## Resources

- [Backstage Documentation](https://backstage.io/docs)
- [Backstage GitHub repository](https://github.com/backstage/backstage)
- [Backstage Discord channel](https://discord.com/invite/MUpMjP2)
