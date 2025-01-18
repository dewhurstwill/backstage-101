# Getting started

## Introduction

Welcome to the Backstage 101 workshop! This workshop is designed to help you get started with Backstage, the open-source platform for building developer portals.

In this workshop, you will learn how to:

- Set up a Backstage app

## Prerequisites

Before you start, you will need to have the following installed:

The following tools are required to complete this workshop:

> I have included the steps to install these tools on macOS. If you are using a different operating system, you can find the installation instructions on the respective websites.
The full list of prerequisites can be found [here](https://backstage.io/docs/getting-started/#prerequisites).

- Build Tools

```bash
xcode-select --install
```


- [NVM)](https://github.com/nvm-sh/nvm)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```


- [Node.js](https://nodejs.org/)

```bash
nvm install lts/iron
```


- [Yarn](https://yarnpkg.com/)

```bash
npm install --global yarn
yarn -v
```

> Ensure you are using Yarn version 4.4.1 or later.

## Tasks

### 1. Run the following command to scaffold a new Backstage app:

```bash
npx @backstage/create-app@latest
```

> At the time of writing this workshop, the latest version of the @backstage/create-app is `0.24.0`. If you want to use the exact same version this can be done by running `npx @backstage/create-app@0.24.0`

### 2. Change into the directory of the newly created app:

```bash
cd my-backstage-app
```

> Replace `my-backstage-app` with the name of your app if you used a different name.

### 3. Start the Backstage app:

```bash
yarn dev
```

> This will start the Backstage app on `http://localhost:3000` and the backend at `http://localhost:7007`.

### 4. Open the Backstage app in your browser:

Navigate to `http://localhost:3000` in your browser to see the Backstage app running.

### 5. Congratulations!

You have successfully set up a Backstage app. You can now move on to the next section to learn how to configure Backstage.
Before you move on, make sure to familiarize yourself with the folder structure of the Backstage app you just created.

#### Folder structure

The Backstage app you just created has the following folder structure:

```bash
my-backstage-app/
│   ├── packages/
│   │   ├── app/
│   │   ├── backend/
│   ├── examples/
│   ├── plugins/
├── app-config.yaml/
├── app-config.local.yaml
├── app-config.production.yaml
├── package.json
├── catalog-info.yaml
```

Backstage is built on [mono-repo architecture](https://github.com/dewhurstwill/yarn-workspaces-example), which means that the app is divided into multiple packages, each containing a different part of the app. The `app` package contains the frontend code, the `backend` package contains the backend code, and the `plugins` package contains the plugins that extend the functionality of the app.

## Next steps

Now that you have set up a Backstage app, you can move on to the next section to learn how to configure Backstage.

- [Configuring Backstage](../01-configuring/README.md)

## Resources

- [Backstage Documentation](https://backstage.io/docs)
- [Backstage GitHub repository](https://github.com/backstage/backstage)
- [Backstage Discord channel](https://discord.com/invite/MUpMjP2)
