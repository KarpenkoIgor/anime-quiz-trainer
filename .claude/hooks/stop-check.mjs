// Stop: проверка перед тем, как Claude объявит работу законченной.
//
// Зачем (две независимые гарантии):
//   1. Сборка не сломана: если менялись backend/*.cs — `dotnet build`,
//      если менялись frontend/*.ts(x) — `tsc --noEmit`. При ошибке Claude НЕ может
//      закончить, пока не исправит (хук возвращает decision: block + текст ошибки).
//   2. Знания не теряются: если менялся код, а документация/спеки/CLAUDE.md — нет,
//      один раз просим подтвердить, что обновлять нечего (идея заимствована у
//      Stop-хука «сохрани находки»).
//
// Защита от зацикливания: поле stop_hook_active (Claude уже продолжал из-за хука)
// + состояние в temp, чтобы не гонять сборку для тех же самых изменений дважды.

import { execSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { git, hash, projectDir, readEvent, readState, writeState } from './lib.mjs';

const event = readEvent();
if (event.stop_hook_active) process.exit(0);

const root = projectDir();
const sid = String(event.session_id ?? 'nosession').replace(/[^\w-]/g, '');

// --untracked-files=all: иначе новые каталоги сворачиваются в «?? dir/» и файлов не видно
const porcelain = git(['status', '--porcelain', '--untracked-files=all']);
if (!porcelain) process.exit(0);

const files = porcelain
  .split('\n')
  .map((l) => l.slice(3).replace(/^"|"$/g, '').replace(/.* -> /, '').trim())
  .filter(Boolean);

const backendChanged = files.some((f) => /^backend\/.*\.(cs|csproj|props)$/.test(f));
const frontendChanged = files.some((f) => /^frontend\/.*\.(ts|tsx)$/.test(f));
const docsChanged = files.some((f) => /^(docs\/|CLAUDE\.md$|README\.md$|CHANGELOG\.md$|.*\/CLAUDE\.md$)/.test(f));
const codeChanged = files.some((f) => /^(backend\/src|frontend\/(app|service|hooks|types|Auth))\//.test(f));

// Отпечаток текущего набора изменений (список файлов + время правки)
const fingerprint = hash(
  files
    .map((f) => {
      try {
        return `${f}:${statSync(join(root, f)).mtimeMs}`;
      } catch {
        return `${f}:gone`;
      }
    })
    .join('|'),
);

function block(reason) {
  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
  process.exit(0);
}

function tail(text, n = 25) {
  return String(text).trim().split('\n').slice(-n).join('\n');
}

// 1. Проверка сборки (только если изменения новые для этой сессии)
if ((backendChanged || frontendChanged) && readState(`built-${sid}`) !== fingerprint) {
  const errors = [];
  if (backendChanged) {
    try {
      execSync('dotnet build backend/AnimeQuizTrainer.sln -nologo -v q -clp:ErrorsOnly', { cwd: root, encoding: 'utf8', stdio: 'pipe', timeout: 180000 });
    } catch (e) {
      errors.push(`dotnet build упал:\n${tail(`${e.stdout ?? ''}${e.stderr ?? ''}`)}`);
    }
  }
  if (frontendChanged) {
    try {
      execSync('npx tsc --noEmit', { cwd: join(root, 'frontend'), encoding: 'utf8', stdio: 'pipe', timeout: 180000 });
    } catch (e) {
      errors.push(`tsc --noEmit упал:\n${tail(`${e.stdout ?? ''}${e.stderr ?? ''}`)}`);
    }
  }
  if (errors.length) block(`Прежде чем завершить, исправь ошибки сборки:\n\n${errors.join('\n\n')}`);
  writeState(`built-${sid}`, fingerprint);
}

// 2. Напоминание о документации (один раз на набор изменений)
if (codeChanged && !docsChanged && readState(`docs-${sid}`) !== fingerprint) {
  writeState(`docs-${sid}`, fingerprint);
  block(
    'Изменён код, но не затронуты docs/, CLAUDE.md, README, CHANGELOG. ' +
      'Проверь: изменилось ли поведение (спека docs/specs/), архитектурное решение (ADR docs/adr/), ' +
      'публичный API или правила для команды? Если да — обнови. Если нет — ответь одной строкой «документация актуальна».',
  );
}

process.exit(0);
