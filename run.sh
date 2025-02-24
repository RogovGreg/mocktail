#!/bin/bash

docker compose -f ./docker-compose.yml -f ./docker-compose.override.yml up -d --build

root_dir=$PWD

dotnet_dirs=$(ls -d -- services/*/)
dotnet_dirs=($dotnet_dirs)

for i in "${dotnet_dirs[@]}"
do
    echo Running migrations in $i...
    cd $root_dir/$i

    # TODO Configure migrations properly with scafolding like in:
    # https://stackoverflow.com/questions/43398483/command-line-connection-string-for-ef-core-database-update

    connection_string=$(cat appsettings.json | python3 -c 'import sys, json; cfg=json.load(sys.stdin); print(cfg.get("ConnectionStrings", {}).get("DefaultConnection", ""))')
    
    if [ -z "$connection_string" ]; then
        echo "Connection string not found. Skipping migrations for $i."
        echo
        continue
    fi

    connection_string=${connection_string//mssql/localhost}

    dotnet ef database update --connection "$connection_string"
    echo
done
