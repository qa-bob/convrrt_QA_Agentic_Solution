# SKILLS.md — Available Claude Code Skills

This file documents every skill (slash command) available in this repository.
Invoke any skill by typing its command in Claude Code.

---

## Built-in Skills

| Command | File | Description |
|---------|------|-------------|
| `/analyze-site` | `.claude/commands/analyze-site.md` | Crawl the live site and update `site.config.json` with discovered nav items, forms, and page structure |
| `/generate-full-suite` | *(built-in)* | Analyze the website and regenerate the complete POM + all test suites from scratch |
| `/run-smoke` | `.claude/commands/run-smoke.md` | Execute `@smoke` tests and return a pass/fail summary |
| `/update-baseline` | `.claude/commands/update-baseline.md` | Re-capture all `@visual` screenshot baselines after intentional UI changes |
| `/generate-report` | `.claude/commands/generate-report.md` | Read the latest `test-results/results.json` and produce a formatted Markdown summary |

---

## Sub-Agents

| Agent | File | Role |
|-------|------|------|
| `site-analyzer` | `.claude/agents/site-analyzer.md` | Crawl and analyze live sites to produce a fully populated `site.config.json` |
| `test-generator` | `.claude/agents/test-generator.md` | Generate site-specific Playwright tests beyond the shared generic suite |

---

## When to Use Each Skill

### `/analyze-site`
Run this when:
- Onboarding a new site (first time)
- A site redesign has changed nav structure or form locations
- `site.config.json` has empty `expectedNavItems`

### `/generate-full-suite`
Run this when:
- Starting from scratch on a new company repo
- The site has been significantly redesigned and most selectors are stale
- A project was cloned from the template and needs to be customized

### `/run-smoke`
Run this when:
- Verifying the site is reachable before running the full suite
- Checking if a recent site deployment broke anything critical
- A quick sanity check is needed in under 60 seconds

### `/update-baseline`
Run this when:
- The site's visual design has changed intentionally (rebrand, new hero image)
- Snapshot files are failing due to known UI updates (not regressions)
- Setting up the suite for the first time after confirming the site looks correct

### `/generate-report`
Run this when:
- Sharing test results with a client or team member
- Creating a QA summary after a test run
- Generating documentation of current test coverage status

---

## Adding a New Skill

1. Create a Markdown file in `.claude/commands/<skill-name>.md`
2. Follow the format of existing skill files (title, usage, what it does, output)
3. Add an entry to this SKILLS.md file
4. The skill is immediately available as `/<skill-name>` in Claude Code

---

## Skill Invocation Examples

```
/analyze-site
/analyze-site https://www.convrrt.com

/run-smoke

/update-baseline

/generate-report
```
