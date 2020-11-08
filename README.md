# Trådfri Control Panel

This repository contains the source code for my latest hobby project: The Trådfri control panel.

*TODO: Description*

## Running the app

First install dependencies with `yarn install`

To run the application in development mode:

```
yarn run dev
```

Or in production mode:

```
yarn build
yarn start
```

The client application runs on port `3000` when running the dev server. In development mode all fetch-requests to `/api` are proxied to `localhost:8080` where the express server is hosted.

In production mode, the `dist` folder contents built by webpack will be served by the back-end server at `localhost:8080`. You can run the app in a different port in production by launching the app by setting the `PORT` environment variable.

### Registering gateways

When you launch the application the first time, you will be prompted with a setup wizard for registering your gateway.

## Deploying to a remote server (like Raspberry Pi)

First make sure you have `git`, `node` (tested working with version `10.14`), `yarn` and `pm2` installed on your server.
PM2 also has to be installed on the computer where you run the deployment.

The deployment is done over SSH so make sure you have a public key installed to your server to allow easier deployments without the need for passwords. More information about this can be found [from PM2 deploy documentation](https://pm2.keymetrics.io/docs/usage/deployment/)

When you have created the deploy configuration, you can deploy the app with:

```
pm2 deploy production setup
pm2 deploy production
```

The env variables `DEPLOY_BRANCH` and `DEPLOY_HOST` need to be set before deploying.

To deploy a specific branch use:

```
pm2 deploy production ref origin/<BRANCH>
```

## Development

### Mock JSON server

A mock `json-server` can be used instead by running `npm run dev-mock`. Mock data will be served on `http://localhost:8080`.
