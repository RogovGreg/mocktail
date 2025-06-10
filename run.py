#!/usr/bin/env python3
from pathlib import Path
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

env_path = Path(__file__).parent / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        if line and not line.startswith("#"):
            k, v = line.split("=", 1)
            os.environ.setdefault(k, v)


def get_connection_string_for(service_name: str):
    key = f"{service_name.upper()}_CONNECTION_STRING"
    val = os.getenv(key)
    if not val:
        # fallback
        val = os.getenv("CONNECTION_STRING")
    if not val:
        print(f"Error: neither {key} nor CONNECTION_STRING found in .env")
        exit(1)
    return val.replace("mssql", "localhost")


def run_migrations():
    conn = get_connection_string_for("backend")
    backend_path = os.path.join("services", "Backend")
    migrations_path = os.path.join(backend_path, "Migrations")

    if os.path.isdir(migrations_path):
        print("Running migrations for Backend...")
    else:
        print("No migrations folder: creating initial migration for Backend...")
        try:
            subprocess.run(
                ["dotnet", "ef", "migrations", "add", "InitialCreate"],
                cwd=backend_path,
                check=True,
            )
        except subprocess.CalledProcessError:
            print("⚠️ InitialCreate migration already exists or failed to generate.")

    subprocess.run(
        ["dotnet", "ef", "database", "update", "--connection", conn],
        cwd=os.path.join("services", "Backend"),
        check=True,
    )


def start_docker():
    print("Creating mssqldata volume...")
    subprocess.run(
        ["docker", "volume", "create", "mssqldata"],
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
    print("Applying EF migrations for Backend locally…")
    run_migrations()


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
