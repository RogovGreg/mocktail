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

ENV ConnectionStrings__DefaultConnection="Server=mssql;Database=BackendDb;User=sa;Password=Admin@123;TrustServerCertificate=True;"

# ENTRYPOINT ["sh", "-c", "dotnet ef database update --no-build && dotnet Backend.dll"]
ENTRYPOINT ["dotnet", "Backend.dll"]