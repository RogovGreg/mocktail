# gRPC Setup for Backend and Content Services

This document explains how gRPC is set up between the Backend and Content services.

## Architecture

- **Content Service**: Acts as a gRPC server, implementing the `ContentService` interface
- **Backend Service**: Acts as a gRPC client, consuming the Content service via gRPC
- **Shared Proto**: The `content.proto` file defines the contract between services

## File Structure

```
services/
├── Shared/
│   └── Contracts/
│       └── content.proto          # Source of truth for proto definitions
├── Backend/
│   ├── Protos/
│   │   └── content.proto          # Copy of shared proto (generates client code)
│   ├── ContentHandlers.cs         # Handles gRPC client calls
│   └── Program.cs                 # Configures gRPC client
└── Content/
    ├── Protos/
    │   └── content.proto          # Copy of shared proto (generates server code)
    ├── Services/
    │   └── ContentService.cs      # Implements gRPC server
    └── Program.cs                 # Configures gRPC server
```

## Proto File Management

Since each service needs its own copy of the proto file for Docker builds, we use a copy-based approach:

1. **Source of Truth**: `services/Shared/Contracts/content.proto`
2. **Service Copies**: Each service has its own copy in `Protos/content.proto`
3. **Sync Script**: Use `./sync-proto.sh` to keep copies in sync

## Configuration

### Content Service (Server)
- Generates server code from `Protos/content.proto`
- Exposes gRPC on port 8080
- Implements `ContentServiceImpl` class

### Backend Service (Client)
- Generates client code from `Protos/content.proto`
- Configures gRPC client to connect to `http://content:8080`
- Uses `ContentService.ContentServiceClient` for communication

## Docker Compose

The services are configured to work with Docker Compose:
- Content service exposes port 8080 for gRPC
- Backend service connects to Content service via service name `content`
- Proto files are copied into each service's container during build

## Usage

### Running Locally
```bash
# Build both services
cd services/Backend && dotnet build
cd ../Content && dotnet build

# Run Content service (gRPC server)
cd services/Content && dotnet run

# Run Backend service (gRPC client)
cd services/Backend && dotnet run
```

### Running with Docker Compose
```bash
# Build and run all services
docker-compose up --build
```

### Syncing Proto Changes
```bash
# After updating Shared/Contracts/content.proto
./sync-proto.sh
```

## API Endpoints

The Backend service exposes REST endpoints that internally use gRPC:

- `GET /content?userId={userId}` - List content for a user
- `POST /content` - Create new content

These endpoints communicate with the Content service via gRPC and return the results as JSON.

## Troubleshooting

1. **Build Errors**: Ensure proto files are synced using `./sync-proto.sh`
2. **Connection Issues**: Verify Content service is running on port 8080
3. **Docker Issues**: Check that service names match in docker-compose.yml 