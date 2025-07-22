# Instructions

TODO Add some basic instructions here

## Prerequisites
Dotnet `ef` tool is needed for this project to run locally.

## Project local start
To run the project loaclly a python script is used which can be ran with
```
 ./run.py
```

## DB migartion

To run a migration on mssql, go to project directory and run the following commant to create migration:
```
dotnet ef migrations add migration_name
```

To apply migration to db:
```
dotnet ef database update
```

### Running migrations with python script
Migrations can be ran when starting docker containers locally by passing `--migrate` to the `run.py` script,
or by entering `migrate` after the `run.py` script starts.

### Performance issues
If you are experiencing performance issues when starting containers, reduce the resources allocated to Docker (Docker Dashboard -> Settings -> Resources).