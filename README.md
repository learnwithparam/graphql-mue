<h1 align="center">
  <img src="https://s.tarkus.me/graphql-logo.png" width="128" height="128" alt="GraphQL" /><br>
  Graphql MUI
</h1>

<!-- <p align="center">
  <img src="https://api.dependabot.com/badges/status?host=github&repo=kriasoft/nodejs-api-starter" alt="Dependabot" height="20" />
  <a href="https://discord.gg/PkRad23"><img src="https://img.shields.io/badge/chat-discord-kriasoft.svg?logo=discord&style=flat" height="20"></a>
  <a href="https://patreon.com/koistya"><img src="https://img.shields.io/badge/donate-patreon-kriasoft.svg?logo=patreon&style=flat" height="20"></a>
  <a href="https://github.com/kriasoft/nodejs-api-starter/stargazers"><img src="https://img.shields.io/github/stars/kriasoft/nodejs-api-starter.svg?style=social&label=Star&maxAge=3600" height="20"></a>
  <a href="https://twitter.com/ReactStarter"><img src="https://img.shields.io/twitter/follow/ReactStarter.svg?style=social&label=Follow&maxAge=3600" height="20"></a>
</p> -->

GraphQL API for Microhabit.


---


## Tech Stack

* [Node.js][node], [Yarn][yarn], [TypeScript][ts], [Babel][babel], [Prettier][prettier] — core platform and dev tools
* [GraphQL.js][gqljs], [GraphQL.js Relay][gqlrelay], [DataLoader][loader], [validator][validator] — [GraphQL][gql] schema and API endpoint
* [PostgreSQL][pg], [Knex][knex], [pg][nodepg] — data access and db automation (migrations, seeds)
* [Jest][jest] - unit and snapshot testing

## Directory Layout

```bash
.
├── /build/                     # The compiled output (via Babel)
├── /migrations/                # Database schema migrations
├── /scripts/                   # Build automation scripts and utilities
├── /seeds/                     # Scripts with reference/sample data
├── /src/                       # Node.js application source files
│   ├── /mutations/             # GraphQL API mutations
│   ├── /queries/               # GraphQL API query fields
│   ├── /types/                 # GraphQL custom types
│   ├── /utils/                 # Utility functions (mapTo, mapToMany etc.)
│   ├── /auth.js                # Authentication middleware
│   ├── /context.ts             # Data loaders and other context-specific stuff
│   ├── /db.ts                  # Database access and connection pooling (via Knex)
│   ├── /errors.ts              # Custom errors and error reporting
│   ├── /fields.ts              # Helper functions for creating GraphQL query fields
│   ├── /index.ts               # Node.js application entry point
│   ├── /node.ts                # GraphQL Node interface
│   ├── /schema.ts              # GraphQL schema type
│   └── /validator.ts           # Input validation helpers
├── babel.config.js             # Babel configuration
├── docker-stack.yml            # Allows to launch PostgreSQL via Docker
├── package.json                # List of project dependencies
├── schema.graphql              # GraphQL schema file (auto-generated)
└── tsconfig.json               # TypeScript configuration
```


## Prerequisites

* [Node.js][node] v10 or higher + [Yarn][yarn] package manager
* [PostgreSQL][pg] (can be local or remote instance, e.g. Google Cloud SQL)
* Optionally [VS Code][code] editor with [Project Snippets][vcsnippets],
  [EditorConfig][vceditconfig], [ESLint][vceslint], and [Prettier][vcprettier]
  plug-ins.


## Getting Started

Just clone the repo, tweak `.env` file in the root of the project, and run `yarn start`:

```bash
$ git clone https://github.com/kriasoft/nodejs-api-starter.git example-api
$ cd example-api                # Change current directory to the newly created one
$ yarn install                  # Install Node.js dependencies
$ yarn start                    # Launch Node.js API application. Or, yarn start --env=local
```

The API server must become available at [http://localhost:8080/graphql](http://localhost:8080/graphql)
([live demo][demo]).


### How to Migrate Database Schema

While the app is in development, you can use a simplified migration workflow by
creating a backup of your existing database, making changes to the existing
migration file (see `migrations/20180101000000_initial.ts`), re-apply the
migration and restore data from the backup file (`backup.sql`):

```bash
$ yarn db-backup --env=dev      # Or, yarn db-backup --env=test
$ yarn db-reset-dev             # Or, yarn db-reset-test
```

Upon deployment to production, switch to normal migration workflow:

```bash
$ yarn db-change <name>         # Create a new database migration file
$ yarn db-migrate --env=dev     # Migrate database to the latest version
```

**HINT**: Test your migration thoroughly with a local instance of the DB first
(by using `--env=local` or `--env=dev` (default) flag) then apply it to your
`test` or `prod` database instance using `--env=test` or `--env=prod` command
argument.

Other helpful database scripts:

```bash
$ yarn db-version --env=dev     # Print the version number of the last migration
$ yarn db-rollback --env=dev    # Rollback the latest migration
$ yarn db-restore --env=dev     # Restore database from backup.sql
$ yarn db-seed --env=dev        # Seed database with test data
$ yarn db --env=dev             # Open Knex.js REPL shell (type ".exit" for exit)
$ yarn psql --env=dev           # Open PostgreSQL shell (type "\q" for exit)
```

### How to Test

```bash
$ yarn lint                     # Check JavaScript and CSS code for potential issues
$ yarn lint-fix                 # Attempt to automatically fix ESLint warnings
$ yarn check                    # Check source code for type errors
$ yarn test                     # Run unit tests. Or, `yarn test --watch`
```

For more information visit https://jestjs.io/docs/getting-started

### How to Deploy

```bash
$ yarn build                    # Build the app in production mode (NODE_ENV=production)
$ yarn deploy-test              # Deploy the app to TEST environment
$ yarn deploy-prod              # Deploy the app to PROD environment
```

For more information refer to the [Deployment](https://github.com/kriasoft/nodejs-api-starter/wiki/deployment)
guide in the project's Wiki.


## How to Debug

Use `yarn start-debug` instead of `yarn start` then attach VS Code debugger to the running
instance of the app.


## License

This material is available for private, non-commercial use under the [GPL version 3](http://www.gnu.org/licenses/gpl-3.0-standalone.html). If you would like to use this material, please contact me at [paramanantham@live.com](mailto:paramanantham@live.com)
