// SessionStart: initial session context.
//
// Why: Claude does not remember previous sessions. This hook gives it bearings right away —
// branch, uncommitted files, recent commits — and reminds it of the key rules.
// The output goes into the model context as additionalContext.

import { currentBranch, git, readEvent } from './lib.mjs';

readEvent();

const branch = currentBranch() || '(not a git repository)';
const status = git(['status', '--porcelain', '--untracked-files=all']);
const changed = status ? status.split('\n').length : 0;
const log = git(['log', '--oneline', '-5']);

const lines = [
  `Branch: ${branch}. Uncommitted files: ${changed}.`,
  log ? `Recent commits:\n${log}` : '',
  ['main', 'master'].includes(branch)
    ? 'WARNING: you are on main. Commits to main are blocked by a hook — create a branch first (feat/fix/chore/docs) per .claude/rules/git-workflow.md.'
    : '',
  'Reminder: Clean Architecture (API → Infrastructure → Application → Domain), never commit secrets, new logic comes with tests, verify build/typecheck before saying "done". See CLAUDE.md. Talk to the user in Russian.',
].filter(Boolean);

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: lines.join('\n') },
  }),
);
