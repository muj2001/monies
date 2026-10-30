---
description: Draft a PR description from this branch using the repo's PR template
argument-hint: "[base branch, default main]"
allowed-tools: Bash(git status:*), Bash(git log:*), Bash(git diff:*), Bash(git branch:*), Bash(git rev-parse:*), Read
---

Draft a pull request description for the current branch. Base branch: `$ARGUMENTS` (use `main` if blank).

1. Gather context:
   - `git branch --show-current` and `git status --short`
   - `git log --oneline <base>...HEAD`
   - `git diff --stat <base>...HEAD`, then `git diff <base>...HEAD` for the files that matter
   - Read `.github/pull_request_template.md`
2. Fill in the template's sections in order:
   - **Summary**: 1-3 bullets on what changed, written for a reviewer.
   - **Why**: the goal or problem, taken from commit messages and the diff. Do not invent motivation; if it isn't clear, write `TODO: add motivation`.
   - **How I tested**: list only checks that the commits or the diff show. Leave every checkbox unchecked for the author to tick, and add `TODO: describe device testing`.
   - **Screenshots**: keep the section only if UI files under `src/app/` or components changed; otherwise remove it.
   - **Checklist**: leave boxes unchecked, but add a short note under any item the diff clearly triggers, such as a changed `package.json` native dependency, an `app.json` plugin, or a new `EXPO_PUBLIC_` variable.
   - **What I learned**: leave the comment in place for the author to fill in.
3. Remove the template's HTML comments in sections you filled in.
4. Suggest a PR title under 70 characters.

Output the title, then the description in a single markdown code block ready to paste. End the description with:

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Do not push, create the PR, or change any files.
