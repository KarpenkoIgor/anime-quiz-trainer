// Общие утилиты для хуков Claude Code этого проекта.
//
// Как работают хуки: харнесс запускает команду, передаёт JSON события в stdin
// и смотрит на результат:
//   - exit 0            -> всё ок (stdout может содержать JSON-решение);
//   - exit 2            -> блокировка; текст из stderr показывается Claude;
//   - любой другой код  -> ошибка хука, действие НЕ блокируется.
// Подробности и примеры: docs/claude/GUIDE.md (раздел «Хуки»).

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** Читает JSON события из stdin. При пустом/битом вводе возвращает {}. */
export function readEvent() {
  try {
    const raw = readFileSync(0, 'utf8');
    return raw.trim() ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Блокирует действие: сообщение уходит Claude, чтобы он выбрал другой путь. */
export function deny(message) {
  process.stderr.write(`[hook] ${message}\n`);
  process.exit(2);
}

/** Просит подтверждение у человека (вместо жёсткого запрета). */
export function ask(message) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: message,
      },
    }),
  );
  process.exit(0);
}

/** Запускает git в корне проекта; при ошибке возвращает ''. */
export function git(args, cwd = projectDir()) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

export function projectDir() {
  return process.env.CLAUDE_PROJECT_DIR || process.cwd();
}

export function currentBranch() {
  return git(['rev-parse', '--abbrev-ref', 'HEAD']);
}

/** Нормализует путь: прямые слэши. */
export function norm(p = '') {
  return String(p).replace(/\\/g, '/');
}

/** Небольшое файловое состояние в temp (например, «уже напоминали»). */
function stateFile(name) {
  const dir = join(tmpdir(), 'aqt-claude-hooks');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return join(dir, name);
}

export function readState(name) {
  try {
    return readFileSync(stateFile(name), 'utf8');
  } catch {
    return '';
  }
}

export function writeState(name, value) {
  try {
    writeFileSync(stateFile(name), value);
  } catch {
    /* состояние необязательно */
  }
}

export function hash(text) {
  return createHash('sha1').update(text).digest('hex').slice(0, 12);
}
