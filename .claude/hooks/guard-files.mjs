// PreToolUse (Edit|Write|MultiEdit): guard for files and secrets.
//
// Why: some files must not be edited by hand, and secrets must not end up in code.
//
// Denies:
//   1. Editing EF migrations and the model snapshot (created only by `dotnet ef migrations add/remove`).
//   2. Writing to .env*, *.pem, *.sql, *.dump (secrets and DB dumps).
//   3. Writing content that looks like a secret: private keys, GitHub/AWS/OpenAI-style tokens,
//      connection strings to a NON-local database (including Railway).

import { deny, norm, readEvent } from './lib.mjs';

const event = readEvent();
const input = event.tool_input ?? {};
const file = norm(input.file_path ?? '');
if (!file) process.exit(0);

const name = file.split('/').pop() ?? '';

// 1. EF migrations
if (/\/Migrations\/[^/]+\.cs$/.test(file) || /ModelSnapshot\.cs$/.test(file)) {
  deny('EF migrations and ModelSnapshot are not edited by hand. Use `dotnet ef migrations add <Name>` (or `migrations remove` for an unapplied one).');
}

// 2. Secrets and dumps
if (/^\.env(\.|$)/.test(name) && name !== '.env.example') {
  deny('Writing to .env* is forbidden (secrets). Change .env.example; the user sets real values themselves.');
}
if (/\.(pem|key|pfx|sql|dump|bak)$/i.test(name)) {
  deny(`Writing to ${name} is forbidden (secrets/DB dumps are neither created nor edited).`);
}

// 3. Secret detection in the text being written
const chunks = [];
if (typeof input.content === 'string') chunks.push(input.content);
if (typeof input.new_string === 'string') chunks.push(input.new_string);
if (Array.isArray(input.edits)) for (const e of input.edits) if (typeof e?.new_string === 'string') chunks.push(e.new_string);
const text = chunks.join('\n');

if (text) {
  const patterns = [
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
    [/\bghp_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{30,}\b/, 'GitHub token'],
    [/\bAKIA[0-9A-Z]{16}\b/, 'AWS key'],
    [/\bsk-[A-Za-z0-9_-]{24,}\b/, 'API key (sk-...)'],
    [/\.rlwy\.net|\.railway\.app.*(password|postgres)/i, 'Railway address/credentials'],
  ];
  for (const [re, label] of patterns) {
    if (re.test(text)) deny(`A secret was found in the text being written (${label}). Move it to environment variables/user-secrets.`);
  }

  // Connection string with a password to a non-local host
  for (const line of text.split('\n')) {
    if (/password\s*=/i.test(line) && /host\s*=/i.test(line)) {
      const host = /host\s*=\s*([^;:"'\s]+)/i.exec(line)?.[1]?.toLowerCase() ?? '';
      if (!['localhost', '127.0.0.1', '::1', 'postgres', 'db', 'host.docker.internal'].includes(host)) {
        deny(`Connection string with a password to a non-local host "${host}". Use environment variables.`);
      }
    }
  }
}

process.exit(0);
