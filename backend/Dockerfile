FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY AnimeQuizTrainer.sln .
COPY src/AnimeQuizTrainer.Domain/AnimeQuizTrainer.Domain.csproj              src/AnimeQuizTrainer.Domain/
COPY src/AnimeQuizTrainer.Application/AnimeQuizTrainer.Application.csproj    src/AnimeQuizTrainer.Application/
COPY src/AnimeQuizTrainer.Infrastructure/AnimeQuizTrainer.Infrastructure.csproj src/AnimeQuizTrainer.Infrastructure/
COPY src/AnimeQuizTrainer.API/AnimeQuizTrainer.API.csproj                    src/AnimeQuizTrainer.API/
RUN dotnet restore

COPY . .
RUN dotnet publish src/AnimeQuizTrainer.API/AnimeQuizTrainer.API.csproj \
    -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "AnimeQuizTrainer.API.dll"]
