

# Shuffle

This was made for a assignment and is a backend project for a scheduling API. Because of the nature of the description I had some conclusions about the project and decided to choose the tech from that point.

## Conclusions from the assignments

- The project is smaller side at first and the focus should be on the speed of development 
- The project should be modular and structured to be easy to maintain
- The project should not have a lot of dependencies
- The project should be able to be scalable and be able create a new features without touching the schema
- The project should be accessed easily by friends, so there should not be any authentication, but should be somewhat proetected by the outside world
- The project should be fun!


## Important Info

Running on upcloud server with 1GB ram and 1CPU. 3€ per month plan so can be a little slow at times.
Swagger can be found at `https://shuffle.emiltoivainen.com`


## Tech stack

- **Runtime**: Bun
- **Framework**: Hono with `@hono/zod-openapi`
- **Database**: PostgreSQL via Drizzle ORM
- **Validation**: Zod
- **Monorepo**: Bun workspaces

### Runtime and framework 

I decided to use Bun as the runtime and Hono as the framework. I'm fairly new to Bun and Hono, but Bun being the rising star in the JS ecosystem, I thought it would be a good choice. Hono looks like a good fit for the project, it has a lot of features and it's easy to learn. Also the "Batteries Included" features should be good fit for the project. The more corporate options could be for example NestJS .

 I supercharged the framework with `@hono/zod-openapi` which is a Zod-based OpenAPI generator. That way i can also generate OpenAPI spec at the same time as the API. That way I don't have to come back to write the spec later. Decreasing the time to write new endpoints.

### Database and ORM
I decided to use PostgreSQL as the database. I'm most familiar with Postgres and it's battletested. First i decided to use Prisma orm for the database, but it wasn't a good fit for the project. I changed it to Drizzle ORM because it's a bit more flexible, when it comes to the database queries. The hardest part was to get the return queries right. The most easiest solutions would be to just have a marshal the object to a correct form after fetching it from the database and return it. I wanted a little challenge so I tried to do as much on the database level as possible. The solution is not the clearest or most readable, but overall I did not like the return types in the assignment. I wanted to to keep the relation to fully harness the power of postges and keep the ability to rapidly create new feature without create migration scprit to move data to the new database. With relations you can easily modify the database models and give them new fields easily. 

I created a relations between the event, event dates and users. So i would have just return the naturally created objects instead of the arrays. That's why i switched from Prisma to Drizzle. To get more control on the returning types. Prisma would return an array of objects after insert although drizzle was not that familiar to me. 

Instead of using auto increment id's I decided to use uuids. Simply for giving a little more randomness to the ids. That way the events could be only known when the event id is shared ( The /events endpoints defeats the purpose of uuids, but im thinking of a real world scenario )

### Project structure

Project is structured in a monorepo with tightly combinded by Bun workspaces. the main applications (backend) is located in the apps folder. In the future it could also be location for the web or mobile applications. The shared folder contains the database schema, validators and environment config. That way the schema types can be used accross the applications aswell as the validators. reducing the amount of code duplication and increasing the productivity.

Also catalogs are used to install packages that appear in multiple places. One thing i don't like is that when project grows the number of package.json also grows. I tried to avoid this by combining the shared packages under one package, therefore being only one package.json. Originally i had mind to separate the the packages in the /packages folder (/packages/databas, packages/validators, packages/shared) but I decided to go with the current structure.

### After ~2 hour mark

Fair game to say that the project is not finished yet when the 2 hour mark was reached. I also added basic tests and CI just to finish the project.


### Testing

    Made simple tests for the backend. Unit tests

### CI

Made a base skeleton structure for continous integration. Uses github actions and git tags to update the project in the server. DHowever did not add github secrets or activate the pipeline, because of the project being public. I just cloned the application to the server and started the docker compose with docker-compose up command. Caddy should handle the ssl cert and i just added A record to my own domain. Not really the most ideal way but at first sufficient and most importantly fast way to get things going. Update now has to be done manually with `docker-compose build backend` command


### AI in the development

As we know much of the development nowdays is done by AI or AI agents. I made sure to use AI as little as possible. All code is written by me and the template is created by me. The thoughts represented in this project are mine and they are formed from own experience. Only thing where i used AI was when i changes the Prisma ORM to Drizzle ORM after a while.



