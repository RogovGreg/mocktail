FROM mcr.microsoft.com/dotnet/sdk:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy the Shared directory first
COPY Shared ./Shared/

# Copy the project file and restore dependencies
COPY Backend/Backend.csproj .
RUN dotnet restore

# Copy the rest of the source code
COPY Backend/ .

# Build and publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Backend.dll"]
