# How To Setup The Project?

This project is `Nuxt` based web app it use `Bun` as package manager and `TypeScript` as language

## Prerequisite

### Docker

To use this dev environment please try to install [Docker](https://www.docker.com/get-started/) first and make sure that it's running on your machine.

### Bun

`Bun` is a package manger like `npm|pnpm|yarn` to be sure to run this project try to download `Bun` first

### A Github Auth Token

To create a github auth token

- Go to your github settings on your profile
- Click on the `Developer Settings` in the bottom of the nav sidebar
- Select `Personal Access Token` and click to `Tokens(classic)`

You will be redirected to an interface then fill the necessary information and select your token scope
> Be sure that your token have the necessary authorizations to `read repositories, access github users information`
After your token is created copy it you will have to add it to your `GITHUB_TOKEN` var

### Scripts

To init the project you have to run the initialization script via:

```sh
bun init:all
```

this script will so:

- Create an `.env` file for you with the default envs included
- Pull the `postgres` docker image and run it on your machine
- Migrate the database scheme to your db
- And run the seeders

> Notice that all envs vars are not setup automatically you have to setup the missing one
