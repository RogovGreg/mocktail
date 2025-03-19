FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["Backend.csproj", "Backend/"]
COPY ["../Shared/Shared.csproj", "Shared/"]
RUN dotnet restore "Backend/Backend.csproj"

COPY . Backend/
COPY ../Shared/. Shared/
WORKDIR "/src/Backend"
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Backend.dll"]
