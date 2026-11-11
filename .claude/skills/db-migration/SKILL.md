---
name: db-migration
description: Безопасно создаёт EF Core миграцию для PostgreSQL — генерация, проверка кода и SQL, план отката. Используй при любом изменении сущностей или конфигураций EF, влияющем на схему БД.
argument-hint: "<ИмяМиграции>"
disable-model-invocation: true
---

# /db-migration — миграция схемы

Имя миграции: **$ARGUMENTS** (PascalCase, глагол+суть, например `AddUserRating`).

1. Убедись, что сущности/конфигурации (`Infrastructure/Data/Configurations/`) изменены и `dotnet build backend` проходит.
2. Сгенерируй:
   ```bash
   dotnet ef migrations add $ARGUMENTS --project backend/src/AnimeQuizTrainer.Infrastructure --startup-project backend/src/AnimeQuizTrainer.API --output-dir Data/Migrations
   ```
3. Прочитай созданный файл миграции и проверь (привлеки `db-engineer`): нет ли `DropColumn/DropTable` с потерей данных, NOT NULL без значения по умолчанию, пересоздания вместо `RenameColumn/RenameTable`, лишних изменений снимка.
4. Покажи пользователю итог проверки и план отката (`dotnet ef migrations remove` для неприменённой; для применённой — новая обратная миграция).
5. **Не выполняй `dotnet ef database update`.** Применение — только на локальную БД и только после явной просьбы пользователя (хук запросит подтверждение). Никогда на прод.
6. Миграции и `ModelSnapshot` руками не правятся (хук `guard-files` это блокирует).
