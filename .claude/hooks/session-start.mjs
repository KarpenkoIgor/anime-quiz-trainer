// SessionStart: стартовый контекст сессии.
//
// Зачем: Claude не помнит прошлых сессий. Хук сразу даёт ему ориентиры — ветка,
// незакоммиченные файлы, последние коммиты — и напоминает ключевые правила.
// Вывод хука уходит в контекст модели как additionalContext.

import { currentBranch, git, readEvent } from './lib.mjs';

readEvent();

const branch = currentBranch() || '(не git-репозиторий)';
const status = git(['status', '--porcelain']);
const changed = status ? status.split('\n').length : 0;
const log = git(['log', '--oneline', '-5']);

const lines = [
  `Ветка: ${branch}. Незакоммиченных файлов: ${changed}.`,
  log ? `Последние коммиты:\n${log}` : '',
  ['main', 'master'].includes(branch)
    ? 'ВНИМАНИЕ: ты на main. Коммиты в main запрещены хуком — сначала создай ветку (feat/fix/chore/docs) по правилам .claude/rules/git-workflow.md.'
    : '',
  'Напоминание: Clean Architecture (API → Infrastructure → Application → Domain), секреты не коммитим, новая логика — с тестами, перед «готово» — сборка/typecheck. См. CLAUDE.md.',
].filter(Boolean);

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: lines.join('\n') },
  }),
);
