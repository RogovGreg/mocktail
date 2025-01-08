FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY Auth.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtim
WORKDIR /app

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Auth.dll"]