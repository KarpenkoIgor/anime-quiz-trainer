---
name: verify
description: Полная проверка проекта перед коммитом/PR — сборка и тесты backend, typecheck, lint и сборка frontend. Запускай, когда нужно убедиться, что всё зелёное, или перед созданием PR.
allowed-tools: Bash(dotnet build:*), Bash(dotnet test:*), Bash(npm run:*), Bash(git status:*)
---

# /verify — проверка проекта

Выполни по порядку, останавливаясь на первой ошибке, и сообщи результат каждого шага:

1. **Backend сборка** (предупреждения = ошибки): `dotnet build backend -nologo -v q`
2. **Backend тесты** (если проект `backend/tests` уже есть): `dotnet test backend --no-build -nologo`
3. **Frontend typecheck** (из `frontend/`): `npm run typecheck`
4. **Frontend lint** (из `frontend/`): `npm run lint` — ошибки недопустимы; предупреждения (их сейчас ~155) не растут.
5. **Frontend build** (только если просили полную проверку): `npm run build`

В конце — таблица `шаг | результат | время`. Если что-то упало: покажи ключевые строки ошибки, назови причину и предложи исправление; **ничего не заявляй «зелёным», не запустив**. Если тестов ещё нет — так и напиши.
