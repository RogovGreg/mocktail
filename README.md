# Instructions

TODO Add some basic instructions here

## Project local start

```
docker compose -f ./docker-compose.yml -f ./docker-compose.override.yml up -d --build
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
