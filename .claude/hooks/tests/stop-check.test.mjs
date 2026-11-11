// Stop-hook scenarios in a throwaway git repo (prints results; inspect manually).
// Run: node .claude/hooks/tests/stop-check.test.mjs
import { spawnSync, execSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const hook = resolve(dirname(fileURLToPath(import.meta.url)), '../stop-check.mjs');
const dir = mkdtempSync(join(tmpdir(), 'stoptest-'));
const sh = (c) => execSync(c, { cwd: dir, stdio: 'ignore' });
sh('git init -q');
sh('git config user.email t@t && git config user.name t');
writeFileSync(join(dir, 'a.txt'), 'x');
sh('git add . && git commit -qm init');

const call = (sid, extra = {}) => {
  const r = spawnSync('node', [hook], { input: JSON.stringify({ session_id: sid, ...extra }), encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: dir } });
  return { code: r.status, out: r.stdout.slice(0, 200) };
};

const sid = 'sid' + Date.now();
console.log('1 clean tree        ->', JSON.stringify(call(sid)));

mkdirSync(join(dir, 'frontend/app'), { recursive: true });
writeFileSync(join(dir, 'frontend/app/notes.txt'), 'changed');
console.log('2 code, no docs     ->', JSON.stringify(call(sid)));
console.log('3 same changes again->', JSON.stringify(call(sid)));
console.log('4 stop_hook_active  ->', JSON.stringify(call(sid, { stop_hook_active: true })));

writeFileSync(join(dir, 'CLAUDE.md'), 'docs');
console.log('5 code + docs       ->', JSON.stringify(call('other' + Date.now())));

mkdirSync(join(dir, 'backend/src'), { recursive: true });
writeFileSync(join(dir, 'backend/src/X.cs'), 'class X {');
console.log('6 backend, no sln   ->', JSON.stringify(call('b' + Date.now())).slice(0, 220));
