FROM mcr.microsoft.com/dotnet/sdk:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY Shared/Contracts ./Shared/Contracts/

COPY Backend/Backend.csproj ./
RUN dotnet restore "Backend.csproj"

COPY Backend/. ./
RUN dotnet publish "Backend.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

# ENV ASPNETCORE_URLS=http://+:80 \
#     ConnectionStrings__DefaultConnection="Host=backend_db;Port=5432;Database=MyServiceDb;Username=myuser;Password=S3cr3tP@ss"
ENV ConnectionStrings__DefaultConnection=Host=backend_db;Port=5432;Database=MyServiceDb;Username=myuser;Password=S3cr3tP@ss

# ENTRYPOINT ["sh", "-c", "dotnet ef database update --no-build && dotnet Backend.dll"]
ENTRYPOINT ["dotnet", "Backend.dll"]