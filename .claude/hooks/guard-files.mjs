// PreToolUse (Edit|Write|MultiEdit): страж файлов и секретов.
//
// Зачем: часть файлов нельзя править руками, а секреты не должны попасть в код.
//
// Блокируем:
//   1. Правку EF-миграций и снимка модели (создаются только `dotnet ef migrations add/remove`).
//   2. Запись в .env*, *.pem, *.sql, *.dump (секреты и дампы БД).
//   3. Запись контента, похожего на секрет: приватные ключи, токены GitHub/AWS/OpenAI,
//      строки подключения к НЕ локальной БД (в т.ч. Railway).

import { deny, norm, readEvent } from './lib.mjs';

const event = readEvent();
const input = event.tool_input ?? {};
const file = norm(input.file_path ?? '');
if (!file) process.exit(0);

const name = file.split('/').pop() ?? '';

// 1. Миграции EF
if (/\/Migrations\/[^/]+\.cs$/.test(file) || /ModelSnapshot\.cs$/.test(file)) {
  deny('EF-миграции и ModelSnapshot не правятся вручную. Используй `dotnet ef migrations add <Name>` (или `migrations remove` для неприменённой).');
}

// 2. Секреты и дампы
if (/^\.env(\.|$)/.test(name) && name !== '.env.example') {
  deny('Запись в .env* запрещена (секреты). Меняй .env.example, а реальные значения пользователь задаст сам.');
}
if (/\.(pem|key|pfx|sql|dump|bak)$/i.test(name)) {
  deny(`Запись в ${name} запрещена (секреты/дампы БД не создаём и не правим).`);
}

// 3. Поиск секретов в записываемом тексте
const chunks = [];
if (typeof input.content === 'string') chunks.push(input.content);
if (typeof input.new_string === 'string') chunks.push(input.new_string);
if (Array.isArray(input.edits)) for (const e of input.edits) if (typeof e?.new_string === 'string') chunks.push(e.new_string);
const text = chunks.join('\n');

if (text) {
  const patterns = [
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'приватный ключ'],
    [/\bghp_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{30,}\b/, 'токен GitHub'],
    [/\bAKIA[0-9A-Z]{16}\b/, 'ключ AWS'],
    [/\bsk-[A-Za-z0-9_-]{24,}\b/, 'API-ключ (sk-…)'],
    [/\.rlwy\.net|\.railway\.app.*(password|postgres)/i, 'адрес/доступ Railway'],
  ];
  for (const [re, label] of patterns) {
    if (re.test(text)) deny(`В записываемом тексте найден секрет (${label}). Вынеси в переменные окружения/user-secrets.`);
  }

  // Строка подключения с паролем к нелокальному хосту
  for (const line of text.split('\n')) {
    if (/password\s*=/i.test(line) && /host\s*=/i.test(line)) {
      const host = /host\s*=\s*([^;:"'\s]+)/i.exec(line)?.[1]?.toLowerCase() ?? '';
      if (!['localhost', '127.0.0.1', '::1', 'postgres', 'db', 'host.docker.internal'].includes(host)) {
        deny(`Строка подключения с паролем к нелокальному хосту «${host}». Используй переменные окружения.`);
      }
    }
  }
}

process.exit(0);
