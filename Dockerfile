FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app
EXPOSE 80

# Copy csproj and restore as distinct layers
COPY *.sln .
COPY DigitalScreensMap_API/*.csproj ./DigitalScreensMap_API/
RUN dotnet restore

# Copy everything else and build
COPY DigitalScreensMap_API/. ./DigitalScreensMap_API/
WORKDIR /app
# RUN dotnet publish -c Release -o out
RUN dotnet build "DigitalScreensMap_API/DigitalScreensMap_API.csproj" -c Release -o /app/build

FROM build-env AS publish
RUN dotnet publish "DigitalScreensMap_API/DigitalScreensMap_API.csproj" -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS runtime
COPY --from=publish /app/publish ./
ENTRYPOINT ["dotnet", "DigitalScreensMap_API.dll"]