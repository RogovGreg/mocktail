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


def run_migrations():
    services_dir = Path("services")

    for service_dir in services_dir.iterdir():
        if not service_dir.is_dir():
            continue

        service_name = service_dir.name

        csproj_files = list(service_dir.glob("*.csproj"))
        if not csproj_files:
            print(f"⚠️  Skipping {service_name} — no .csproj file found.")
            continue

        csproj_path = csproj_files[0]

        csproj_content = csproj_path.read_text()
        has_ef = any(
            keyword in csproj_content
            for keyword in [
                "Microsoft.EntityFrameworkCore.Design",
                "Microsoft.EntityFrameworkCore.Tools",
            ]
        )
        if not has_ef:
            print(f"⚠️  Skipping {service_name} — no EF Core tools package referenced.")
            continue

        if service_name.lower() == "backend":
            conn_string = os.getenv("BACKEND_CONNECTION_STRING")
            db_type = "MSSQL"
        else:
            conn_string = os.getenv("CONNECTION_STRING")
            db_type = "MSSQL"

        if not conn_string:
            print(f"❌ No connection string found for {service_name}")
            continue

        if db_type == "MSSQL":
            conn_string = conn_string.replace("mssql", "localhost")

        def safe_mask(conn: str) -> str:
            if "Password=" in conn:
                before, after = conn.split("Password=", 1)
                masked_pass = after.split(";", 1)[0]
                return conn.replace(masked_pass, "****")
            return conn

        print(f"🔄 Running migrations for {service_name} ({db_type})")
        print(f"   → Using connection string: {safe_mask(conn_string)}")

        migrations_path = service_dir / "Migrations"

        if migrations_path.exists():
            print(f"   ↪ Found Migrations folder.")
        else:
            print(f"   📁 No migrations folder: attempting to create InitialCreate...")
            try:
                subprocess.run(
                    ["dotnet", "ef", "migrations", "add", "InitialCreate"],
                    cwd=service_dir,
                    check=True,
                )
            except subprocess.CalledProcessError:
                print(f"   ⚠️  Could not create InitialCreate for {service_name} — already exists or failed.")

        try:
            subprocess.run(
                ["dotnet", "ef", "database", "update", "--connection", conn_string],
                cwd=service_dir,
                check=True,
            )
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to apply migrations for {service_name} ({db_type})")


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
