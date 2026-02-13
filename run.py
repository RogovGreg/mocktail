#!/usr/bin/env python3
import os
import subprocess
import argparse

DESCRIPTION = """
This script manages the lifecycle of a .NET application with multiple microservices.\n

Features:
- Starts Docker containers using docker-compose.
- Runs database migrations for each microservice if a Migrations folder is present.
- Waits for user commands:
  - 'migrate' to run migrations again.
  - 'restart' to stop and start Docker containers.
  - 'quit' to stop Docker containers and exit.

"""


def get_connection_string(service_name):
    """This function is kept for compatibility but not used in new migrations approach."""
    return None


def run_migrations():
    """Run database migrations using the migrations Docker container."""
    print("🚀 Running database migrations...")
    print("Building and starting migrations container...")
    
    try:
        # Build and run migrations container
        subprocess.run(
            [
                "docker",
                "build",
                "-f",
                "Dockerfile.migrations",
                "-t",
                "mocktail-migrations",
                ".",
            ],
            check=True,
        )
        
        subprocess.run(
            [
                "docker",
                "run",
                "--rm",
                "--network",
                "mocktail_default",
                "--env-file",
                ".env",
                "mocktail-migrations",
            ],
            check=True,
        )
        print("✅ All migrations completed successfully.\n")
    except subprocess.CalledProcessError as error:
        print(f"❌ Failed to run migrations: {error}")
        print("💡 Make sure Docker containers are running and .env file exists.")


def start_docker():
    print("Creating mocktail_data volume...")
    subprocess.run(
        ["docker", "volume", "create", "mocktail_data"],
        check=True,
    )
    print("Starting Docker containers...")
    subprocess.run(
        [
            "docker",
            "compose",
            "-f",
            "./docker-compose.yml",
            "-f",
            "./docker-compose.dev.yml",
            "up",
            "-d",
            "--build",
        ],
        check=True,
    )
    print("Docker containers started.")


def stop_docker():
    print("Stopping Docker containers...")
    subprocess.run(["docker", "compose", "down"], check=True)
    print("Docker containers stopped.")


def main():
    parser = argparse.ArgumentParser(
        description=DESCRIPTION,
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument(
        "--migrate", action="store_true", help="Run migrations before starting commands"
    )
    args = parser.parse_args()

    start_docker()

    if args.migrate:
        run_migrations()

    while True:
        print()
        command = input("Waiting for further commands (migrate/restart/quit): ").strip().lower()
        if command == "migrate":
            run_migrations()
        elif command == "restart":
            stop_docker()
            start_docker()
        elif command == "quit":
            stop_docker()
            break
        else:
            print("Unknown command. Use 'migrate' or 'quit'.")


if __name__ == "__main__":
    main()