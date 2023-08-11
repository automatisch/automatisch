# Development Setup

Clone main branch of Automatisch.

```bash
git clone git@github.com:automatisch/automatisch.git
```

Then, install the dependencies.

```bash
cd automatisch
yarn install
```

## Backend

Make sure that you have **PostgreSQL** and **Redis** installed and running.

:::warning
Scripts we have prepared for Automatisch work with PostgreSQL version 14. If you have a different version, you might have some problems with the database setup.
:::

Create a `.env` file in the backend package:

```bash
cd packages/backend
cp .env-example .env
```

Create the development database in the backend folder.

```bash
yarn db:create
```

:::warning
`yarn db:create` commands expect that you have the `postgres` superuser. If not, you can create a superuser called `postgres` manually or you can create the database manually by checking PostgreSQL-related default values from the [app config](https://github.com/automatisch/automatisch/blob/main/packages/backend/src/config/app.ts).
:::

Run the database migrations in the backend folder.

```bash
yarn db:migrate
```

Create a seed user with `user@automatisch.io` email and `sample` password.

```bash
yarn db:seed:user
```

Start the main backend server.

```bash
yarn dev
```

Start the worker server in another terminal tab.

```bash
yarn worker
```

## Frontend

Create a `.env` file in the web package:

```bash
cd packages/web
cp .env-example .env
```

Start the frontend server in another terminal tab.

```bash
cd packages/web
yarn dev
```

It will automatically open [http://localhost:3001](http://localhost:3001) in your browser. Then, use the `user@automatisch.io` email address and `sample` password to login.

## Docs server

```bash
cd packages/docs
yarn dev
```

You can check the docs server via [http://localhost:3002](http://localhost:3002).
