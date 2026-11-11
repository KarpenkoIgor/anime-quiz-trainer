// PreToolUse (Bash): guard against dangerous commands.
//
// Why: CLAUDE.md only asks Claude not to do dangerous things; a hook guarantees it.
// Irreversible or process-breaking actions are denied outright, debatable ones go to the human (ask).
//
// Denied:  force-push, push to main/master, commit directly on main, --no-verify,
//          rm -rf of root/home/current dir, reading .env via shell.
// Asked:   reset --hard, clean -f, checkout -- / restore (discarding edits),
//          dotnet ef database update|drop (applying to a DB).

import { ask, currentBranch, deny, readEvent } from './lib.mjs';

const event = readEvent();
const cmd = String(event.tool_input?.command ?? '');
if (!cmd) process.exit(0);

// Split compound commands (a && b; c | d) into simple ones and check each separately.
const parts = cmd.split(/&&|\|\||;|\n/).map((s) => s.trim()).filter(Boolean);
const branch = currentBranch();

for (const part of parts) {
  const isGit = /^git\s/.test(part) || /^(sudo\s+)?git\s/.test(part);

  if (isGit && /\bpush\b/.test(part)) {
    if (/(--force\b|--force-with-lease|\s-f(\s|$)|--mirror|\s\+\S)/.test(part)) {
      deny('git push with force is forbidden. If it is truly needed, ask the user to run it manually.');
    }
    if (/\b(main|master)\b/.test(part) || (!/\borigin\s+\S+/.test(part) && ['main', 'master'].includes(branch))) {
      deny('Pushing directly to main/master is forbidden (trunk-based: work in a branch + PR). Create a feat/fix/chore/docs branch.');
    }
  }

  if (isGit && /\bcommit\b/.test(part) && ['main', 'master'].includes(branch)) {
    deny(`Committing directly on ${branch} is forbidden. Create a branch first: git switch -c feat/<topic> (or fix/chore/docs).`);
  }

  if (isGit && /--no-verify\b/.test(part)) {
    deny('--no-verify is forbidden: do not bypass checks. Fix the cause of the failing hook instead.');
  }

  if (isGit && (/\breset\s+--hard\b/.test(part) || /\bclean\s+-\w*f/.test(part) || /\bcheckout\s+(--\s|\.\s*$)/.test(part) || /\brestore\b(?!\s+--staged)/.test(part))) {
    ask('Команда необратимо отбросит локальные изменения. Подтвердите, что эти правки не нужны.');
  }

  if (/\brm\s+-\w*[rR]\w*\s+(-\w+\s+)*(\/|~|\.|\*|\.\/\*)(\s|$)/.test(part)) {
    deny('rm -r on the root/home/current directory is forbidden. Delete specific paths only.');
  }

  if (/\b(cat|type|head|tail|less|more|Get-Content|gc)\b[^|><]*\.env(\.[\w-]+)?(\s|$)/.test(part) && !/\.env\.example/.test(part)) {
    deny('Reading .env is forbidden (secrets). Use .env.example as a template.');
  }

  if (/\bdotnet\s+ef\s+database\s+(update|drop)\b/.test(part)) {
    ask('Применение/удаление БД через EF. Убедитесь, что это ЛОКАЛЬНАЯ база, а не прод/Railway.');
  }
}

process.exit(0);
