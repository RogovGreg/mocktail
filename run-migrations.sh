#!/bin/bash

# Mocktail Migration Runner
# This script runs database migrations using a dedicated Docker container

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"

print_status "Starting Mocktail Database Migrations..."

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found. Please create it first."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Create volume if it doesn't exist
if ! docker volume ls | grep -q mocktail_data; then
    print_status "Creating mocktail_data volume..."
    docker volume create mocktail_data
    print_success "Created mocktail_data volume"
fi

# Start PostgreSQL first
print_status "Starting PostgreSQL..."
docker-compose $COMPOSE_FILES up -d postgres

# Wait for PostgreSQL to be ready
print_status "Waiting for PostgreSQL to be ready..."
until docker exec postgres pg_isready -U postgres >/dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo ""
print_success "PostgreSQL is ready!"

# Create databases if they don't exist
print_status "Creating databases if they don't exist..."
databases=("mocktail_auth" "mocktail_backend" "mocktail_content" "mocktail_generator")

for db in "${databases[@]}"; do
    if ! docker exec postgres psql -U postgres -lqt | cut -d \| -f 1 | grep -qw "$db"; then
        print_status "Creating database: $db"
        docker exec postgres createdb -U postgres "$db"
    fi
done

# Run migrations using the migration container
print_status "Running migrations..."
print_status "Building migration container..."
if docker-compose $COMPOSE_FILES build migrations; then
    print_success "Migration container built successfully!"
else
    print_error "Failed to build migration container!"
    exit 1
fi

print_status "Running migration container..."
if docker-compose $COMPOSE_FILES run --rm migrations; then
    print_success "All migrations completed successfully!"
else
    print_error "Migration failed!"
    print_status "Checking migration container logs..."
    docker-compose $COMPOSE_FILES logs migrations
    exit 1
fi

print_success "Database migrations completed!"
echo ""
echo "📝 Next steps:"
echo "   Start all services: docker-compose $COMPOSE_FILES up -d"
echo "   View logs: docker-compose $COMPOSE_FILES logs -f"
echo "   Stop services: docker-compose $COMPOSE_FILES down"
