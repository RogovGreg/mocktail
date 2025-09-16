FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /src

COPY Auth.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish

WORKDIR /app

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Auth.dll"]