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
    connection_string=$(cat appsettings.json | python3 -c 'import sys, json; print(json.load(sys.stdin)["ConnectionStrings"]["DefaultConnection"].replace("mssql", "localhost"))') &&
        dotnet ef database update --connection $connection_string

    echo
done
