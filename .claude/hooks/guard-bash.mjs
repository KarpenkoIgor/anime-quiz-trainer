// PreToolUse (Bash): страж опасных команд.
//
// Зачем: CLAUDE.md лишь просит не делать опасного, а хук — гарантирует это.
// Жёстко запрещаем необратимое/нарушающее процесс, а спорное отдаём человеку (ask).
//
// Блокируем:  force-push, push в main/master, commit прямо в main, --no-verify,
//             rm -rf от корня/домашней/текущей папки, чтение .env через shell.
// Спрашиваем: reset --hard, clean -f, checkout -- / restore (откат правок),
//             dotnet ef database update|drop (применение к БД).

import { ask, currentBranch, deny, readEvent } from './lib.mjs';

const event = readEvent();
const cmd = String(event.tool_input?.command ?? '');
if (!cmd) process.exit(0);

// Разбиваем составную команду (a && b; c | d) на простые, чтобы проверять каждую отдельно.
const parts = cmd.split(/&&|\|\||;|\n/).map((s) => s.trim()).filter(Boolean);
const branch = currentBranch();

for (const part of parts) {
  const isGit = /^git\s/.test(part) || /^(sudo\s+)?git\s/.test(part);

  if (isGit && /\bpush\b/.test(part)) {
    if (/(--force\b|--force-with-lease|\s-f(\s|$)|--mirror|\s\+\S)/.test(part)) {
      deny('git push с force запрещён. Если это действительно нужно — попроси пользователя выполнить вручную.');
    }
    if (/\b(main|master)\b/.test(part) || (!/\borigin\s+\S+/.test(part) && ['main', 'master'].includes(branch))) {
      deny('Прямой push в main/master запрещён (trunk-based: работа в ветке + PR). Создай ветку feat/fix/chore/docs.');
    }
  }

  if (isGit && /\bcommit\b/.test(part) && ['main', 'master'].includes(branch)) {
    deny(`Коммит прямо в ${branch} запрещён. Создай ветку: git switch -c feat/<тема> (или fix/chore/docs).`);
  }

  if (isGit && /--no-verify\b/.test(part)) {
    deny('--no-verify запрещён: не обходим проверки. Исправь причину падения хука.');
  }

  if (isGit && (/\breset\s+--hard\b/.test(part) || /\bclean\s+-\w*f/.test(part) || /\bcheckout\s+(--\s|\.\s*$)/.test(part) || /\brestore\b(?!\s+--staged)/.test(part))) {
    ask('Команда необратимо отбросит локальные изменения. Подтвердите, что эти правки не нужны.');
  }

  if (/\brm\s+-\w*[rR]\w*\s+(-\w+\s+)*(\/|~|\.|\*|\.\/\*)(\s|$)/.test(part)) {
    deny('rm -r от корня/домашней/текущей папки запрещён. Удаляй конкретные пути.');
  }

  if (/\b(cat|type|head|tail|less|more|Get-Content|gc)\b[^|><]*\.env(\.[\w-]+)?(\s|$)/.test(part) && !/\.env\.example/.test(part)) {
    deny('Чтение .env запрещено (секреты). Используй .env.example как образец.');
  }

  if (/\bdotnet\s+ef\s+database\s+(update|drop)\b/.test(part)) {
    ask('Применение/удаление БД через EF. Убедитесь, что это ЛОКАЛЬНАЯ база, а не прод/Railway.');
  }
}

process.exit(0);
