# Instructions

TODO Add some basic instructions here

## Prerequisites

This project is run with .NET 9, so the `dotnet` command is needed,
also for migrations the `dotnet ef` tool is used which can be installed with:
```
dotnet tool install --global dotnet-ef --version 9
```

## Project local start

```
 ./run.sh
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

(This assumes that you have the `ef` dotnet tool installed)
