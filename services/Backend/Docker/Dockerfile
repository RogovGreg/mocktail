FROM mcr.microsoft.com/dotnet/sdk:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY Shared/Contracts ./Shared/Contracts/

COPY Backend/Backend.csproj .
RUN dotnet restore

COPY Backend/ .

RUN dotnet publish -c Release -o /app/publish

FROM base AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Backend.dll"]
