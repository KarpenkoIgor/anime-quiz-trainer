// Stop: check before Claude declares the work finished.
//
// Why (two independent guarantees):
//   1. The build is not broken: if backend/*.cs changed -> `dotnet build`,
//      if frontend/*.ts(x) changed -> `tsc --noEmit`. On error Claude may NOT finish
//      until it fixes it (the hook returns decision: block + the error text).
//   2. Knowledge is not lost: if code changed but docs/specs/CLAUDE.md did not, ask once
//      to confirm nothing needs updating (idea borrowed from a "save findings" Stop hook).
//
// Loop protection: the stop_hook_active field (Claude is already continuing because of a hook)
// + state in temp, so the same changes are not rebuilt twice.

import { execSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { git, hash, projectDir, readEvent, readState, writeState } from './lib.mjs';

const event = readEvent();
if (event.stop_hook_active) process.exit(0);

const root = projectDir();
const sid = String(event.session_id ?? 'nosession').replace(/[^\w-]/g, '');

// --untracked-files=all: otherwise new directories collapse into "?? dir/" and files are invisible
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

// Fingerprint of the current change set (file list + modification time)
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

// 1. Build check (only if the changes are new for this session)
if ((backendChanged || frontendChanged) && readState(`built-${sid}`) !== fingerprint) {
  const errors = [];
  if (backendChanged) {
    try {
      execSync('dotnet build backend/AnimeQuizTrainer.sln -nologo -v q -clp:ErrorsOnly', { cwd: root, encoding: 'utf8', stdio: 'pipe', timeout: 180000 });
    } catch (e) {
      errors.push(`dotnet build failed:\n${tail(`${e.stdout ?? ''}${e.stderr ?? ''}`)}`);
    }
  }
  if (frontendChanged) {
    try {
      execSync('npx tsc --noEmit', { cwd: join(root, 'frontend'), encoding: 'utf8', stdio: 'pipe', timeout: 180000 });
    } catch (e) {
      errors.push(`tsc --noEmit failed:\n${tail(`${e.stdout ?? ''}${e.stderr ?? ''}`)}`);
    }
  }
  if (errors.length) block(`Before finishing, fix the build errors:\n\n${errors.join('\n\n')}`);
  writeState(`built-${sid}`, fingerprint);
}

// 2. Documentation reminder (once per change set)
if (codeChanged && !docsChanged && readState(`docs-${sid}`) !== fingerprint) {
  writeState(`docs-${sid}`, fingerprint);
  block(
    'Code changed but docs/, CLAUDE.md, README and CHANGELOG were not touched. ' +
      'Check whether behavior changed (spec in docs/specs/), an architectural decision was made (ADR in docs/adr/), ' +
      'or the public API / team rules changed. If so, update them. If not, reply with one line: "documentation is up to date".',
  );
}

process.exit(0);
