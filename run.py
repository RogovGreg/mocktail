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


def get_connection_string():
    env_file = ".env"
    connection_string = None

    if os.path.exists(env_file):
        with open(env_file, "r") as file:
            for line in file:
                if line.startswith("CONNECTION_STRING="):
                    connection_string = line.strip().split("=", 1)[1]
                    break

    if connection_string:
        return connection_string.replace("mssql", "localhost")
    else:
        print("Error: CONNECTION_STRING not found in .env file.")
        exit(1)


def run_migrations():
    connection_string = get_connection_string()
    services_dir = "services"

    for service in os.listdir(services_dir):
        service_path = os.path.join(services_dir, service)
        migrations_path = os.path.join(service_path, "Migrations")

        if os.path.isdir(migrations_path):
            print(f"Running migrations for {service}...")
            subprocess.run(
                [
                    "dotnet",
                    "ef",
                    "database",
                    "update",
                    "--connection",
                    connection_string,
                ],
                cwd=service_path,
                check=True,
            )
        else:
            print(f"No migrations found for {service}, skipping...")


def start_docker():
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
        command = (
            input("Waiting for further commands (migrate/restart/quit): ")
            .strip()
            .lower()
        )
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
