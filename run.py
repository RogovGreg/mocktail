#!/usr/bin/env python3
import os
import subprocess
import argparse

""" Initial propmpt used to generate script:

I am developing a dotnet app with multiple microservices whose folders are located in the `services` directory.
I want to create a script which starts their docker container, optionally runs migrations, and after that waits for additional commands.
When quit is typed it shuts down the docker containers.

Can you create a python3 script named run.py that runs:
`docker compose -f ./docker-compose.yml -f ./docker-compose.override.yml up -d --build`

The script should accept a flag `--migrate` which will run migration in all of the microservices subdirectories, if there are migrations present.
Migrations will be located in the Migrations folder in the subdirectory, if there isn't a folder there, migrations shouldn't be ran.
To run a migration, a connection string is needed which can be found in the `.env` file in the root directory.
The value will be in the `CONNECTION_STRING` variable, and it will look something like:
`Server=mssql;Database=AuthDb;User=sa;Password=password;TrustServerCertificate=True;`
Here `mssql` should be replaced with `localhost` when running, and the command needed to run is:
`dotnet ef database update --connection $connection_string`

After starting the script wait for commands.
One command is `migrate` which will run migrations once again, and the other command is `quit` which will shutdown docker containers with:
`docker compose down`

The python script shouldn't use any external libraries, only the standard library.

Let me know if there is anything else that you need for this.

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
            subprocess.run([
                "dotnet", "ef", "database", "update", "--connection", connection_string
            ], cwd=service_path, check=True)
        else:
            print(f"No migrations found for {service}, skipping...")

def start_docker():
    print("Starting Docker containers...")
    subprocess.run([
        "docker", "compose", "-f", "./docker-compose.yml", "-f", "./docker-compose.override.yml", "up", "-d", "--build"
    ], check=True)
    print("Docker containers started.")

def stop_docker():
    print("Stopping Docker containers...")
    subprocess.run(["docker", "compose", "down"], check=True)
    print("Docker containers stopped.")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--migrate", action="store_true", help="Run migrations before starting commands")
    args = parser.parse_args()
    
    start_docker()
    
    if args.migrate:
        run_migrations()
    
    while True:
        print()
        command = input("Waiting for further commands (migrate/quit): ").strip().lower()
        if command == "migrate":
            run_migrations()
        elif command == "quit":
            stop_docker()
            break
        else:
            print("Unknown command. Use 'migrate' or 'quit'.")

if __name__ == "__main__":
    main()
