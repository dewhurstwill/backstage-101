# Integrating with GitHub

## Introduction

Welcome to the third section of the Backstage 101 workshop! In this section, you will learn how to integrate Backstage with GitHub.

## Prerequisites

Before you start, you will need to have installed the required tools and installed Backstage using the [Getting Started](../00-getting-started/README.md) guide.

We also recommend that you have completed the tasks in the [Configuring Backstage](../01-configuring/README.md) section.


## Tasks

> For learning / demo purposes you can follow the steps in 1a. Otherwise, you should follow the steps in 1b.

### 1a. Create a PAT token in GitHub

#### 1a.1. Navigate to your GitHub account

Navigate to your GitHub account and click on your profile picture in the top right corner.

<img src="/assets/03-github/01-profile.png" height=25%>

#### 1a.2. Click on settings

Click on settings in the dropdown menu.

<img src="/assets/03-github/02-settings.png" height=25%>

#### 1a.3. Click on Developer settings

Click on Developer settings in the left-hand menu.

<img src="/assets/03-github/03-dev-settings.png" height=25%>

#### 1a.4. Click on Personal access tokens

Click on Personal access tokens in the left-hand menu.

<img src="/assets/03-github/04-pat.png" height=25%>

#### 1a.5. Click on Generate new token

Click on Generate new token.

<img src="/assets/03-github/05-tokens.png" height=25%>

<img src="/assets/02-auth/06-generate.png" height=25%>

<img src="/assets/02-auth/07-generate.png" height=25%>

#### 1a.6. Name your token and set an expiration

Name your token and set an expiration date.

<img src="/assets/03-github/08-name.png" height=25%>

#### 1a.7. Set the permissions for the token

Set the permissions for the token.

<img src="/assets/03-github/09-scopes.png" height=25%>

<img src="/assets/02-auth/10-scopes.png" height=25%>

#### 1a.8. Generate the token

Click on Generate token.

<img src="/assets/02-auth/11-generate.png" height=25%>

#### 1a.9. Copy the token

<img src="/assets/02-auth/12-copy-token.png" height=25%>

#### 1a.10. Add the configuration to the `app-config.yaml` file

```yaml
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}
```

> You can now proceed to step 2

### 1b. Setup a GitHub App

#### 1b.1. Navigate to your GitHub account

Navigate to your GitHub account and click on your profile picture in the top right corner.

<img src="/assets/03-github/01-profile.png" height=25%>

#### 1b.2. Click on settings

Click on settings in the dropdown menu.

<img src="/assets/03-github/02-settings.png" height=25%>

#### 1b.3. Click on Developer settings

Click on Developer settings in the left-hand menu.

<img src="/assets/03-github/03-dev-settings.png" height=25%>

#### 1b.4. Click on GitHub Apps

<img src="/assets/03-github/22-github-apps.png" height=25%>

#### 1b.5. Click on New GitHub App

<img src="/assets/03-github/23-new-github-app.png" height=25%>

#### 1b.6. Fill in the details

Fill in the details for your GitHub App.

<img src="/assets/03-github/24-github-app-name.png" height=25%>

<img src="/assets/03-github/25-callback.png" height=25%>

<img src="/assets/03-github/26-perms.png" height=25%>

<img src="/assets/03-github/27-webhook.png" height=25%>

<img src="/assets/03-github/28-create.png" height=25%>

#### 1b.7. Copy the App ID & Client ID

Copy the App ID & Client ID.

<img src="/assets/03-github/29-app-details.png" height=25%>

#### 1b.8. Generate a client secret

Generate a client secret.

<img src="/assets/03-github/30-generate-secret.png" height=25%>

#### 1b.9. Generate a private key

Generate a private key.

<img src="/assets/03-github/31-generate-private-key.png" height=25%>

You will want to open the downloaded file in a text editior (VSCode/TextEdit) and copy the contents.

#### 1b.10. Add the configuration to the `app-config.yaml` file

```yaml
auth:
  github:
    development:
      clientId: ${AUTH_GITHUB_CLIENT_ID}
      clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}

integrations:
  github:
    - host: github.com
      apps:
        - appId: ${AUTH_GITHUB_APP_ID}
          clientId: ${AUTH_GITHUB_CLIENT_ID}
          clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}
          privateKey: |
            ${AUTH_GITHUB_PRIVATE_KEY}
          webhookSecret: ${AUTH_GITHUB_WEBHOOK_SECRET}
```

> Note that the `privateKey` should be a multiline string. When putting into an environment variable, you should replace the newlines with `\n`.


#### 2. Restart your Backstage app

For your changes to take effect, you will need to restart your Backstage app.

```bash
yarn dev
```

#### 3. Verify the changes

Open your browser and navigate to `http://localhost:3000` to see the changes you have made.

#### 4. Test the token by using the demo template

Navigate to the demo template

<img src="/assets/03-github/13-test-token.png" height=25%>

<img src="/assets/03-github/14-deploy.png" height=25%>

<img src="/assets/03-github/15-name-the-component.png" height=25%>

<img src="/assets/03-github/16-github-details.png" height=25%>

> Note: You will need to enter your own GitHub username and repository name.

<img src="/assets/03-github/17-review.png" height=25%>

<img src="/assets/03-github/18-complete.png" height=25%>

You should now see a new repo in your GitHub account and the component in Backstage.

## Next steps

In the next section, you will learn how to set up Auth in Backstage.

- [Setting up GitHub integration](../03-github/README.md)

## Resources

- [Backstage Documentation](https://backstage.io/docs)
- [Backstage GitHub repository](https://github.com/backstage/backstage)
- [Backstage Discord channel](https://discord.com/invite/MUpMjP2)
