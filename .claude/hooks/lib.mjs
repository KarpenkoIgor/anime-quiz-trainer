// Shared utilities for this project's Claude Code hooks.
//
// How hooks work: the harness runs a command, passes the event JSON on stdin
// and inspects the result:
//   - exit 0            -> fine (stdout may contain a JSON decision);
//   - exit 2            -> block; the stderr text is shown to Claude;
//   - any other code    -> hook error, the action is NOT blocked.
// Details and examples: docs/claude/GUIDE.md (section "Hooks").

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** Reads the event JSON from stdin. Returns {} on empty/invalid input. */
export function readEvent() {
  try {
    const raw = readFileSync(0, 'utf8');
    return raw.trim() ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Blocks the action: the message goes to Claude so it can choose another path. */
export function deny(message) {
  process.stderr.write(`[hook] ${message}\n`);
  process.exit(2);
}

/** Asks the human for confirmation (instead of a hard block). The reason is shown to the user. */
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

/** Runs git in the project root; returns '' on error. */
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

/** Normalizes a path to forward slashes. */
export function norm(p = '') {
  return String(p).replace(/\\/g, '/');
}

/** Small file-based state in temp (e.g. "already reminded"). */
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
    /* state is optional */
  }
}

export function hash(text) {
  return createHash('sha1').update(text).digest('hex').slice(0, 12);
}
