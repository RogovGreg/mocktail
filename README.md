# Instructions

## Prerequisites
- Dotnet `ef` tool is needed for this project to run locally.
- `Node.js` and `NPM` is required to run the frontend part of the application locally.

## Project local start
To run the project locally use our python script. It can be run from the root with:
```
 ./run.py
```

To run the frontend part of the application with hot reloading go to the frontend directory in your terminal and run:
```
npm run dev
```

Before the first run of the frontend part it is required to install all frontend's dependencies. Do this with the command:
```
npm ci
```

## DB migration

### Running migrations with our python script

Migrations can be ran when starting docker containers locally by passing the parameter `--migrate` to the `run.py` script, or by entering `migrate` after the `run.py` script starts.

It will run migrations for all services for which there is a connection string in *.env* file.
Here is the template for a connection string variable's name: `ConnectionStrings__ServiceNameDb`

### Manual
Also you can run a migration manually. To do this, go to the service directory and run this command with your own *migration_name*:
```
dotnet ef migrations add migration_name
```
And after that, run this command to apply the migration to the database:
```
dotnet ef database update
```

## Performance issues
If you are experiencing performance issues when starting containers, you can:
1. Reduce the resources allocated to Docker *(Docker Dashboard -> Settings -> Resources)*.
2. Clean the Docker's cache