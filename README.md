# Smart Home Panel

This repository contains the source code for my latest hobby project: The Smart Home panel.
The repo is divided into two JavaScript projects: `smart-home-panel-client` and `smart-home-panel-server`.

*TODO: Description*

## Client

Front-end application spawned from the default `create-react-app` template.

### Running the app

```
cd client
npm i
npm start
```
The client application runs on port 3000 by default. You can run the app in a different port by launching the app like this: `PORT=<PORT_NUMBER> npm start`
All fetch-requests are proxied to `localhost:3001` by default. You can change this behavior by modifying the proxy-attribute in package.json

### Mock JSON server

A mock `json-server` can be used instead by running `npm run mock-api`. The contents of `test/mock/db.json` will be served on `http://localhost:3001`

## Server

Back-end API built on top of express

### Database server

The server uses SQLite3 for storing persistent data. A `docker-compose.yml` is provided to set up a web interface for managing the data. It can be accessed from `http://localhost:8080`.

### Registering gateways

You can discover gateways or create authentication keys with the `bin/tradfri` utility.

Currently the backend application expects the SQLite database to contain a table named `tradfri_gateway` which contain rows describing the gateways to connect to.
Example gateway:

| id    | name              | hostname      | identity  | psk       |
|-------|-------------------|---------------|-----------|-----------|
| 1     | Trådfri gateway   | 192.168.0.9   | XXXXXX    | XXXXXX    |

The `identity` and `psk` properties contain the identity and pre shared key generated with the `bin/tradfri` utility.

### Running the server

```
cd server
npm i
npm start
```
The server runs on port 3001 by default. You can run the app in a different port by launching the server like this: `PORT=<PORT_NUMBER> npm start`
