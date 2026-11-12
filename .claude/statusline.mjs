// Optional personal status line for Claude Code (not enabled for the whole team).
//
// Shows: [model] | context usage bar | 5-hour and 7-day rate limits with time to reset.
// Port of a bash+jq status line to Node, so no jq binary is needed.
//
// Enable it for yourself in `.claude/settings.local.json` (git-ignored):
//   { "statusLine": { "type": "command", "command": "node .claude/statusline.mjs" } }
//
// Claude Code passes a JSON object on stdin; fields used:
//   model.display_name, context_window.used_percentage,
//   rate_limits.five_hour.{used_percentage,resets_at}, rate_limits.seven_day.{...}
// resets_at is a Unix timestamp in seconds. Rate limits appear only after the first turn.

import { readFileSync } from 'node:fs';

let data = {};
try {
  data = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  /* print the fallback line below */
}

const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const model = data.model?.display_name ?? 'Claude';
const pct = Math.floor(Number(data.context_window?.used_percentage ?? 0)) || 0;
const barColor = pct >= 90 ? RED : pct >= 70 ? YELLOW : GREEN;
const filled = Math.min(10, Math.max(0, Math.floor(pct / 10)));
const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);

const now = Math.floor(Date.now() / 1000);

function limit(label, window, unitSeconds, unitLabel) {
  if (window?.used_percentage === undefined || window?.used_percentage === null) return '';
  const used = Math.round(Number(window.used_percentage));
  let reset = '';
  if (window.resets_at) {
    const left = Math.max(0, Math.floor((Number(window.resets_at) - now) / unitSeconds));
    reset = ` (resets in ${left}${unitLabel})`;
  }
  return `${label}: ${used}%${reset}`;
}

const parts = [
  limit('5h', data.rate_limits?.five_hour, 60, 'm'),
  limit('7d', data.rate_limits?.seven_day, 3600, 'h'),
].filter(Boolean);

console.log(`${CYAN}[${model}]${RESET} | ${barColor}${bar}${RESET} ${pct}% context usage`);
console.log(parts.length ? `Limits - ${parts.join(' | ')}` : `${DIM}Limits - (available after first turn)${RESET}`);
