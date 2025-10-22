# Mocktail

A .NET 9 microservice application for generating and serving mock data using TypeScript types as templates.

## Prerequisites
- Docker and Docker Compose v2
- Python 3 (to run `run.py`)
- .NET EF CLI for manual migrations: `dotnet tool install -g dotnet-ef`
- Node.js and npm (for local frontend dev via Vite)
- OpenAI API key

## Running locally
Create a local environment file from the provided sample and configure the `OPENAI_API_KEY`:
```
cp .env.sample .env
```
Run the following script from the repository root:
```
./run.py --migrate
```
Details about the `run.py` script can be found below.

## Overview

This repository contains a .NET 9 application orchestrated with Docker Compose, an Ocelot gateway, and a React + Vite frontend served by NGINX.

Components:
- Frontend (React, Vite, NGINX)
- API Gateway (Ocelot)
- Services: Auth, Backend, Content, Generator
- Infrastructure: Postgres, Redis, RabbitMQ

## Project structure
```
docker-compose*.yml           # Compose base + dev/prod overlays
run.py                        # Script used for local development
services/
	Auth/                       # Identity and JWT
	Backend/                    # Backend APIs
	Content/                    # Content APIs; uses Redis and RabbitMQ
	Generator/                  # Generator service
	Gateway/                    # Ocelot gateway; routes in services/Gateway/ocelot.json
	Shared/Contracts/           # Shared gRPC/Proto contracts
frontend/                     # React app (Vite), built and served by NGINX in containers
```

## Architecture

The application consists of three core .NET services (Backend, Content, Generator) and two supporting services (Gateway, Auth).
There is also an NGINX service that hosts the frontend.

### Services

#### Gateway
All traffic flows through the gateway. It forwards requests to the appropriate microservice.
It is built with Ocelot.

#### Auth
Stores user profiles. Issues JWTs for user authentication and stores API bearer tokens used by the Content service.

#### Backend
Serves data to the frontend. Manages projects and templates used for data generation.

#### Content
Routes API requests to the appropriate generated data and manages generation status.

#### Generator
Interacts with the OpenAI API to generate data based on a template.
Configuration for the model and OpenAI API keys are stored here.

#### NGINX
Hosts the compiled frontend and acts as the main entry point. Proxies API requests (e.g., /api/) to the gateway.

### Service interactions
The three main services interact via gRPC as follows.

#### Backend → Content
Backend sends a request to Content to initiate data generation, passing the template and related data.
Content responds with a pending status and enqueues the task to RabbitMQ.

#### Content → Generator
The Content service consumes generation requests from RabbitMQ and forwards them to Generator.
When generation is finished, Content updates the status.

#### Backend → Generator
Backend sends the model configuration and OpenAI API keys for the project to Generator.

## Local development

### Frontend (Vite hot reload)

Install dependencies, then run the dev server:

```
cd frontend
npm ci
npm run dev
```

### Backend services
The main way to run backend services locally is through `run.py`, which is essentially a wrapper around:
```
docker compose -f ./docker-compose.yml -f ./docker-compose.dev.yml up -d --build,
```

While the script is running you can enter commands:
* `restart` — stops and restarts the services
* `migrate` — iterates through service directories and runs migrations for each

## Database migrations

Create migrations manually with the following commands. Ensure the correct connection string is available in your environment:
```
cd services/<ServiceName>
export ConnectionStrings__ServiceNameDb=xxxxxxxxx
dotnet ef migrations add <migration_name>
```
After migrations are created they can be applied with:
```
./run.py --migrate

# or

./run.py
# wait for startup
migrate # run command
```


## Proto contracts sync

Protobuf is used for gRPC communication between the three main services.
When `.proto` files in `services/Shared/Contracts/` change, sync them into each service:

```
./sync-proto.sh
```

This copies to:
- `services/Backend/Protos/`
- `services/Content/Protos/`
- `services/Generator/Protos/`

## Troubleshooting

- Ensure `.env` exists and contains all required `ConnectionStrings__*` variables.
- If migrations fail, verify you installed the EF CLI and that Postgres is healthy.
- If the frontend can’t reach the API in dev, confirm containers are up and Vite is proxying to port 80 (`frontend/nginx.conf` forwards `/api/` to the Gateway).
- If ports are taken, stop conflicting services or adjust mappings in `docker-compose.dev.yml`.

## Performance tips

If starting containers is slow:
1. Reduce Docker resources (Docker Desktop → Settings → Resources)
2. Clean Docker caches and dangling images/volumes

## License

This project uses the MIT license for the frontend. If you need a top-level license, add `LICENSE` at the repository root.
