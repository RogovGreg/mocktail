#!/usr/bin/env python3
import os
import subprocess
import argparse
from datetime import datetime

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
    env_file = ".env"
    db_key = f"ConnectionStrings__{service_name}Db"
    connection_string = None

    print(f"🔍 Looking for connection string '{db_key}' in {env_file}...")
    if not os.path.exists(env_file):
        print(f"❌ Error: {env_file} file not found.")
        exit(1)

    print("📂 Reading .env file contents:")
    with open(env_file, "r") as file:
        for line in file:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            print(f"   • {line}")
            if line.startswith(db_key + "="):
                connection_string = line.split("=", 1)[1]
                print(f"✅ Found connection string for {service_name}: {connection_string}")
                break

    if connection_string:
        return connection_string.replace("mssql", "localhost")
    else:
        print(f"⚠️ Warning: Connection string '{db_key}' not found in {env_file}.")
        return None


def run_migrations():
    services_dir = "services"

    for service in os.listdir(services_dir):
        service_path = os.path.join(services_dir, service)
        migrations_path = os.path.join(service_path, "Migrations")
        connection_string = get_connection_string(service)

        if connection_string is None:
            print(f"⚠️ Warning: connection string is not found for {service}. Skipping migrations.")
            continue

        print(f"🔧 Using connection string for {service}: {connection_string}")

        initial_migration_needed = not os.path.isdir(migrations_path) or not os.listdir(migrations_path)
        
        if initial_migration_needed:
            print(f"📦 No migrations found for {service}. Creating initial migration...")
            migration_name = "InitialCreate"
        else:
            print(f"📦 Creating automatic migration for {service}...")
            migration_name = f"AutoMigration{datetime.now().strftime('%Y%m%d_%H%M')}"

        env = os.environ.copy()
        env[f"ConnectionStrings__{service}Db"] = connection_string

        try:
            subprocess.run(
                [
                    "dotnet",
                    "ef",
                    "migrations",
                    "add",
                    migration_name,
                ],
                cwd=service_path,
                check=True,
                env=env,
            )
            print(f"✅ Migration '{migration_name}' for {service} created successfully.")
        except subprocess.CalledProcessError as error:
            print(f"❌ Failed to create migration for {service}: {error}")
            continue

        print(f"🚀 Applying migrations for {service}...")

        try:
            subprocess.run(
                [
                    "dotnet",
                    "ef",
                    "database",
                    "update",
                ],
                cwd=service_path,
                check=True,
                env=env,
            )
            print(f"✅ Migrations for {service} applied successfully.\n")
        except subprocess.CalledProcessError as error:
            print(f"❌ Failed to apply migrations for {service}: {error}")


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