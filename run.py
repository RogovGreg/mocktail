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
    env_file = ".env"
    db_key = f"ConnectionStrings__{service_name}Db"
    connection_string = None

    print(f"🔍 Looking for connection string '{db_key}' in {env_file}...")
    if not os.path.exists(env_file):
        print(f"❌ Error: {env_file} file not found.")
        exit(1)

    # Do not print entire .env; only search for the needed key.
    with open(env_file, "r") as file:
        for line in file:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith(db_key + "="):
                connection_string = line.split("=", 1)[1]
                # Mask password if present when echoing.
                masked = connection_string
                if "Password=" in masked:
                    masked = masked.replace(
                        masked.split("Password=", 1)[1].split(";", 1)[0], "****"
                    )
                print(f"✅ Found connection string for {service_name}: {masked}")
                break

    if connection_string:
        return connection_string.replace("postgres", "localhost", 1)
    else:
        print(f"⚠️ Warning: Connection string '{db_key}' not found in {env_file}.")
        return None


def run_migrations():
    services_dir = "services"

    for service in os.listdir(services_dir):
        service_path = os.path.join(services_dir, service)

        if not os.path.isdir(service_path):
            continue

        # Only process directories that contain a .csproj.
        csproj_files = [f for f in os.listdir(service_path) if f.endswith(".csproj")]
        if not csproj_files:
            continue

        # Skip services that do not reference EF Core Design package.
        csproj_path = os.path.join(service_path, csproj_files[0])
        try:
            with open(csproj_path, "r", encoding="utf-8") as f:
                csproj_text = f.read()
            if "Microsoft.EntityFrameworkCore.Design" not in csproj_text:
                print(f"⏭️  Skipping {service}: no EF Core Design reference in {csproj_files[0]}.")
                continue
        except Exception as read_error:
            print(f"⚠️ Could not read {csproj_path}: {read_error}. Skipping.")
            continue

        connection_string = get_connection_string(service)

        if connection_string is None:
            print(f"⚠️ Warning: connection string is not found for {service}. Skipping migrations.")
            continue

        # Mask password for display
        masked = connection_string
        if "Password=" in masked:
            masked = masked.replace(
                masked.split("Password=", 1)[1].split(";", 1)[0], "****"
            )
        print(f"🔧 Using connection string for {service}: {masked}")

        env = os.environ.copy()
        env[f"ConnectionStrings__{service}Db"] = connection_string

        # Verify there is at least one DbContext. If not, skip this service.
        try:
            result = subprocess.run(
                [
                    "dotnet",
                    "ef",
                    "dbcontext",
                    "list",
                ],
                cwd=service_path,
                check=False,
                env=env,
                capture_output=True,
                text=True,
            )
            dbcontexts_output = (result.stdout or "") + (result.stderr or "")
            has_dbcontext = result.returncode == 0 and any(
                line.strip() and not line.lower().startswith("build") for line in dbcontexts_output.splitlines()
            )
            if not has_dbcontext:
                print(f"⏭️  Skipping {service}: no DbContext found.")
                continue
        except Exception as list_error:
            print(f"⚠️ Could not enumerate DbContexts for {service}: {list_error}. Skipping.")
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
    print("Creating postgresdata volume...")
    subprocess.run(
        ["docker", "volume", "create", "postgresdata"],
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