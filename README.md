# ACME Learning Center Application (`learning-center`)

## Overview
`learning-center` is an Angular 21 client application for managing learning information in the ACME Learning Center domain. The current implementation focuses on maintaining categories and courses, with the codebase organized around bounded contexts and layered responsibilities.

In development mode, the application consumes a local fake API exposed through `json-server`. The frontend is configured to call `http://localhost:3000/api/v1` for learning resources.

## Features
- Category maintenance with create, read, update, and delete behavior
- Course maintenance with create, read, update, and delete behavior
- Course-to-category association through category selection
- Internationalization with English and Spanish resources using `ngx-translate`
- Client-side navigation with Angular Router
- HTTP communication through Angular `HttpClient`
- Angular Material-based presentation components
- Layered organization by bounded context:
  - `learning`
  - `iam`
  - `shared`

## Current Scope
The currently enabled application routes expose:
- `home`
- `about`
- `learning/categories`
- `learning/courses`

The codebase also contains an `iam` bounded context, including routes, store, interceptor, and endpoint classes. However, IAM routes are currently not enabled in `src/app/app.routes.ts`, so authentication is present in the codebase but not active in the running application.

## Architecture Overview
The application structure follows bounded contexts and layers under `src/app`:

- `learning`
  - `domain`
  - `application`
  - `infrastructure`
  - `presentation`
- `iam`
  - `domain`
  - `application`
  - `infrastructure`
  - `presentation`
- `shared`
  - `domain`
  - `infrastructure`
  - `presentation`

This structure helps keep domain concepts, API integration, application state, and UI concerns clearly separated.

## Technologies
- Angular 21
- TypeScript
- RxJS
- Angular Router
- Angular `HttpClient`
- Angular Material
- `ngx-translate`
- `json-server`
- PlantUML

## Documentation
### User Stories
Functional requirements are documented in [`docs/user-stories.md`](docs/user-stories.md).

### Class Diagram
The class diagram is available in [`docs/class-diagram.puml`](docs/class-diagram.puml).

## Prerequisites
Before running the project, make sure the environment includes:
- Node.js
- npm

## Installation
Install project dependencies from the project root:

```bash
npm install
```

## Running the Application
Start the Angular development server from the project root:

```bash
npm start
```

This starts the application at:

- `http://localhost:4200/`

## Starting the Fake API
The development environment is configured to consume the fake API at:

- `http://localhost:3000/api/v1`

The fake API configuration files are located in the `server` folder:
- `server/db.json`
- `server/routes.json`
- `server/start.sh`

### Option 1: Start from the project root

```bash
npx json-server --watch server/db.json --routes server/routes.json --port 3000
```

### Option 2: Use the provided script
The provided script uses relative paths, so it should be executed from inside the `server` directory:

```bash
cd server
sh start.sh
```

## Development Workflow
For local development, start the fake API first and then start the Angular application:

```bash
npx json-server --watch server/db.json --routes server/routes.json --port 3000
npm start
```

## Available Scripts
From the project root, the following scripts are available:

```bash
npm start
npm run build
npm run watch
npm test
```

## Fake API Notes
- The fake API currently provides learning resources for `categories` and `courses`.
- The development environment maps `/api/v1/*` requests through `server/routes.json`.
- IAM endpoint paths exist in the environment configuration, but they are not currently backed by the fake API data in `server/db.json`.

## Project Notes
- Translation files are located in `public/i18n/`.
- The development API base URL is defined in `src/environments/environment.development.ts`.
- The production environment file points to `http://localhost:8080/api/v1`, which may require adjustment for a real deployment target.

