// Hook tests: emulate Claude Code events and check exit codes / output.
// Run: node .claude/hooks/tests/hooks.test.mjs
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..').replace(/\\/g, '/');
const hook = (name) => `${root}/.claude/hooks/${name}.mjs`;

// Опасные литералы собираем из частей, чтобы сам тестовый файл не срабатывал на хуки.
const PK = '-----BEGIN RSA ' + 'PRIVATE KEY-----';
const RWY = 'junction.proxy.' + 'rlwy.net';
const cs = (host, pw) => ['Ho', 'st'].join('') + '=' + host + ';' + ['Pass', 'word'].join('') + '=' + pw;

function run(name, event) {
  const r = spawnSync('node', [hook(name)], {
    input: JSON.stringify(event),
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: root },
  });
  return { code: r.status, out: (r.stdout || '').slice(0, 160), err: (r.stderr || '').slice(0, 160) };
}

const bash = (command) => ({ tool_name: 'Bash', tool_input: { command } });
const file = (file_path, extra = {}) => ({ tool_name: 'Write', tool_input: { file_path, ...extra } });

const cases = [
  ['guard-bash', bash('git status'), 0],
  ['guard-bash', bash('git push --force origin feat/x'), 2],
  ['guard-bash', bash('git push -f'), 2],
  ['guard-bash', bash('git push origin main'), 2],
  ['guard-bash', bash('git push -u origin chore/claude-setup'), 0],
  ['guard-bash', bash('git push -u origin feat/main-menu'), 0],
  ['guard-bash', bash('git push origin HEAD:main'), 2],
  ['guard-bash', bash('git push origin +main'), 2],
  ['guard-bash', bash('git commit -m x --no-verify'), 2],
  ['guard-bash', bash('git reset --hard HEAD~1'), 0, '"ask"'],
  ['guard-bash', bash('dotnet ef database update'), 0, '"ask"'],
  ['guard-bash', bash('rm -rf /'), 2],
  ['guard-bash', bash('rm -rf ./bin'), 0],
  ['guard-bash', bash('cat backend/.env'), 2],
  ['guard-bash', bash('cat frontend/.env.example'), 0],
  ['guard-bash', bash('dotnet build backend && git push --force'), 2],
  ['guard-files', file(`${root}/backend/src/X/Data/Migrations/2026_Init.cs`, { content: 'x' }), 2],
  ['guard-files', file(`${root}/backend/src/X/Data/AppDbContextModelSnapshot.cs`, { content: 'x' }), 2],
  ['guard-files', file(`${root}/frontend/.env.local`, { content: 'x' }), 2],
  ['guard-files', file(`${root}/frontend/.env.example`, { content: 'A=1' }), 0],
  ['guard-files', file(`${root}/dump.sql`, { content: 'x' }), 2],
  ['guard-files', file(`${root}/a.cs`, { content: cs(RWY + ':1', 'abc') }), 2],
  ['guard-files', file(`${root}/a.json`, { content: cs('db.example.com', 's3cret') }), 2],
  ['guard-files', file(`${root}/a.json`, { content: cs('localhost', 'root') }), 0],
  ['guard-files', file(`${root}/a.txt`, { content: PK }), 2],
  ['guard-files', { tool_name: 'Edit', tool_input: { file_path: `${root}/a.cs`, new_string: 'var x = 1;' } }, 0],
  ['session-start', { source: 'startup' }, 0, 'additionalContext'],
  ['stop-check', { session_id: 't', stop_hook_active: true }, 0, ''],
];

let failed = 0;
for (const [name, ev, code, sub] of cases) {
  const r = run(name, ev);
  const ok = r.code === code && (sub === undefined || sub === '' || r.out.includes(sub));
  if (!ok) failed++;
  const label = ev.tool_input?.command ?? ev.tool_input?.file_path ?? JSON.stringify(ev);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name} [exit ${r.code}, want ${code}] ${label.slice(0, 70)}${ok ? '' : ` | out=${r.out} err=${r.err}`}`);
}
console.log(failed ? `\n${failed} FAILED` : '\nALL PASSED');
process.exit(failed ? 1 : 0);
