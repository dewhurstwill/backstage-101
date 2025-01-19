# Configuring Backstage

## Introduction

Welcome back the Backstage 101 workshop! In this section, you will learn how to configure Backstage.

## Prerequisites

Before you start, you will need to have installed the required tools and installed Backstage using the [Getting Started](../00-getting-started/README.md) guide.

## Tasks

### 1. Open the `app-config.yaml` file

The `app-config.yaml` file is where you can configure Backstage. You can find this file in the root directory of your backstage app.

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

### 5. Environment variables

When running backstage you will need to configure the following environment variable:

```bash
export NODE_OPTIONS=--no-node-snapshot
```

### 6. Restart your Backstage app

To apply the changes, you will need to restart your Backstage app.

```bash
yarn dev
```

Not Working? Check the logs in the terminal where you started the Backstage app.

Still not working? Check out our example `app-config.yaml` file [here](./backstage/app-config.yaml).

### 7. Verify the changes

Open your browser and navigate to `http://localhost:3000` to see the changes you have made.

## Next steps

In the next section, you will learn how to set up Auth in Backstage.

- [Setting up Auth](../02-auth/README.md)

Want to skip ahead? You can come back to this section later.

- [Setting up GitHub integration](../03-github/README.md)

## Resources

- [Backstage Documentation](https://backstage.io/docs)
- [Backstage GitHub repository](https://github.com/backstage/backstage)
- [Backstage Discord channel](https://discord.com/invite/MUpMjP2)
