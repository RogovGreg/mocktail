FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["Content.csproj", "Content/"]
COPY ["../Shared/Shared.csproj", "Shared/"]
RUN dotnet restore "Content/Content.csproj"

COPY . Content/
COPY ../Shared/. Shared/
WORKDIR "/src/Content"
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Content.dll"]
