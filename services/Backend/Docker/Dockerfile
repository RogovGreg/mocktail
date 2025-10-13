FROM mcr.microsoft.com/dotnet/sdk:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY Backend.csproj ./
RUN dotnet restore "Backend.csproj"

COPY . ./
RUN dotnet publish "Backend.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

ENV ConnectionStrings__DefaultConnection="Host=postgres;Database=mocktail_backend;Username=postgres;Password=Admin@123"

ENTRYPOINT ["dotnet", "Backend.dll"]