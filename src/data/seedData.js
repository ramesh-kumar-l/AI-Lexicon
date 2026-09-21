import { SCHEMA_VERSION, APP_VERSION } from './constants.js';

const TS = '2026-07-10T00:00:00.000Z';

function card(sectionId, id, title, content, prompt, notes, tags) {
  return {
    id,
    sectionId,
    title,
    content,
    prompt,
    notes,
    tags,
    favorite: false,
    archived: false,
    copyCount: 0,
    lastCopiedAt: null,
    createdAt: TS,
    updatedAt: TS,
  };
}

function section(id, title, description, iconKey, color, order, cards) {
  return {
    id,
    title,
    description,
    iconKey,
    color,
    order,
    archived: false,
    createdAt: TS,
    updatedAt: TS,
    cards,
  };
}

export const seedAppData = {
  schemaVersion: SCHEMA_VERSION,
  appVersion: APP_VERSION,
  updatedAt: TS,
  sections: [
    section('sec-debugging', 'Debugging', 'Diagnose and fix issues systematically.', 'bug', 'rose', 0, [
      card(
        'sec-debugging',
        'card-debug-root-cause',
        'Root-Cause an Error From a Stack Trace',
        'Use when you have a raw error message or stack trace and want the AI to identify the likely root cause before proposing a fix, instead of guessing at a patch immediately.',
        'Here is an error I am seeing:\n\n[paste stack trace or error message]\n\nContext: [briefly describe what the code was doing]\n\nBefore suggesting a fix, walk through: (1) what this error actually means, (2) the most likely root causes given the context, and (3) what additional information would help confirm the cause. Do not propose a fix yet.',
        'Forcing a "diagnose before fixing" step reduces hallucinated fixes for symptoms rather than causes.',
        ['debugging', 'root-cause', 'stack-trace']
      ),
      card(
        'sec-debugging',
        'card-debug-bisect-regression',
        'Bisect a Regression Between Two Versions',
        'Use when something worked before a change and broke after it, and you want help narrowing down which change caused the regression.',
        'This behavior worked correctly before a recent change and is now broken.\n\nWorking version behavior: [describe]\nCurrent (broken) behavior: [describe]\nChanges made since it last worked: [list commits/diffs/summary]\n\nHelp me identify which of these changes is most likely responsible, and what I should check first to confirm it.',
        'Pair with `git bisect` or diff summaries for best results.',
        ['debugging', 'regression', 'git']
      ),
      card(
        'sec-debugging',
        'card-debug-explain-stack-trace',
        'Explain an Unfamiliar Stack Trace or Log Format',
        'Use when you are working in an unfamiliar language, framework, or log format and need a plain-language walkthrough before debugging further.',
        'Explain this stack trace/log line by line, in plain language, for someone unfamiliar with [language/framework]:\n\n[paste trace or log excerpt]\n\nHighlight which lines are from my code vs. framework/library internals.',
        'Useful onboarding aid for junior engineers touching a new codebase.',
        ['debugging', 'learning', 'stack-trace']
      ),
    ]),
    section('sec-code-review', 'Code Review', 'Get sharper, more targeted review feedback.', 'git-pull-request', 'blue', 1, [
      card(
        'sec-code-review',
        'card-review-focused-pass',
        'Request a Focused Review Pass',
        'Use to get a targeted review instead of generic "looks good" feedback, by directing the AI to a specific concern.',
        'Review this diff with a focus ONLY on [correctness | performance | security | readability] — ignore style nits unless they affect that concern:\n\n[paste diff]\n\nList findings ordered by severity, and call out anything you are uncertain about rather than guessing.',
        'Running multiple focused passes (one concern at a time) surfaces more real issues than one broad pass.',
        ['code-review', 'diff', 'focused-review']
      ),
      card(
        'sec-code-review',
        'card-review-diff-risk-summary',
        'Summarize the Risk of a Diff',
        'Use before merging to get a quick risk assessment aimed at reviewers or release notes.',
        'Summarize this diff for a reviewer who has not seen the code before:\n\n[paste diff]\n\nInclude: what changed, why it likely changed, blast radius (what could break), and whether it touches any obviously sensitive areas (auth, payments, data migrations, etc.).',
        'Good for PR descriptions when the author has not written one.',
        ['code-review', 'risk', 'pr-description']
      ),
      card(
        'sec-code-review',
        'card-review-security-smells',
        'Check for Common Security Smells',
        'Use as a lightweight first-pass security check, not a substitute for a real security review.',
        'Scan this diff for common security smells: unvalidated input, injection risk, hardcoded secrets, missing authz checks, unsafe deserialization, and overly broad permissions.\n\n[paste diff]\n\nFor each finding, explain the concern and suggest a safer alternative.',
        'Treat findings as prompts for a human security reviewer, not a final verdict.',
        ['code-review', 'security']
      ),
    ]),
    section('sec-testing', 'Testing', 'Cover edge cases and write meaningful tests.', 'flask-conical', 'green', 2, [
      card(
        'sec-testing',
        'card-testing-edge-cases',
        'Generate an Edge-Case Checklist',
        'Use before writing tests to make sure you are not missing obvious edge cases.',
        'Given this function/feature:\n\n[paste code or description]\n\nList edge cases I should test, grouped by category: boundary values, invalid input, concurrency/ordering, empty/null states, and failure of external dependencies.',
        'Treat the list as a checklist to prune, not a mandate to test every single item.',
        ['testing', 'edge-cases', 'checklist']
      ),
      card(
        'sec-testing',
        'card-testing-regression-from-bug',
        'Write a Regression Test From a Bug Report',
        'Use to turn a bug report or incident into a concrete failing test before fixing the underlying issue.',
        'Here is a bug report:\n\n[paste bug report or repro steps]\n\nWrite a test in [test framework] that reproduces this bug (it should fail against the current code). Do not fix the underlying bug yet — just write the failing test.',
        'Writing the failing test first keeps the fix honest and prevents silent regressions later.',
        ['testing', 'regression', 'tdd']
      ),
      card(
        'sec-testing',
        'card-testing-coverage-gaps',
        'Review Test Coverage Gaps',
        'Use when a test suite exists but you suspect it is missing meaningful cases (not just line coverage).',
        'Here are the existing tests for this module:\n\n[paste test file(s)]\n\nAnd here is the module itself:\n\n[paste source]\n\nIdentify behaviors that are NOT covered by these tests, focusing on realistic usage and failure modes rather than trivial line coverage.',
        'Pairs well with a coverage report, but goes beyond raw percentage numbers.',
        ['testing', 'coverage']
      ),
    ]),
    section('sec-architecture', 'Architecture', 'Reason through design trade-offs and decisions.', 'layers', 'amber', 3, [
      card(
        'sec-architecture',
        'card-arch-tradeoff',
        'Evaluate a Design Trade-off',
        'Use when deciding between two or more architectural approaches and you want a structured comparison rather than a single opinion.',
        'I am deciding between these approaches for [problem]:\n\nOption A: [describe]\nOption B: [describe]\n\nCompare them on: complexity, performance, failure modes, and long-term maintainability. Recommend one, but explain the conditions under which the other would be the better choice.',
        'Asking for "conditions where the other option wins" avoids one-sided recommendations.',
        ['architecture', 'trade-off', 'design']
      ),
      card(
        'sec-architecture',
        'card-arch-adr-draft',
        'Draft an Architecture Decision Record (ADR)',
        'Use after a decision has been made, to produce a concise written record for the team.',
        'Draft a short ADR for this decision:\n\nContext: [describe the problem/situation]\nDecision: [what was decided]\nAlternatives considered: [list]\n\nUse the standard ADR sections: Context, Decision, Consequences (both positive and negative).',
        'Keep ADRs short — a few paragraphs, not a design doc.',
        ['architecture', 'adr', 'documentation']
      ),
      card(
        'sec-architecture',
        'card-arch-schema-sanity-check',
        'Sanity-Check a Proposed Data Schema',
        'Use when designing a new schema or data model and want a second pass before committing to it.',
        'Here is a proposed schema:\n\n[paste schema/model]\n\nCheck for: missing indexes for likely query patterns, normalization issues, fields that will be hard to migrate later, and any ambiguity in field meaning or nullability.',
        'Especially useful before a schema ships to production and becomes expensive to change.',
        ['architecture', 'schema', 'data-model']
      ),
    ]),
    section('sec-prompt-engineering', 'Prompt Engineering', 'Sharpen how you ask for what you need.', 'sparkles', 'purple', 4, [
      card(
        'sec-prompt-engineering',
        'card-prompt-vague-to-structured',
        'Turn a Vague Ask Into a Structured Prompt',
        'Use as a meta-prompt when your own request feels too vague to get a reliably useful answer.',
        'Here is what I want, roughly: [describe your vague goal]\n\nHelp me turn this into a clear, structured prompt by identifying: the specific outcome I want, missing context you would need, and any constraints I have not stated yet. Then write the improved prompt.',
        'Use this before starting complex tasks, not after getting a bad answer.',
        ['prompt-engineering', 'clarity']
      ),
      card(
        'sec-prompt-engineering',
        'card-prompt-role-constraints',
        'Add Role and Constraints to a Prompt',
        'Use to sharpen a prompt that keeps producing overly generic or overly long responses.',
        'Rewrite this prompt to include: (1) a specific role for the AI to adopt, (2) explicit output format constraints (length, structure), and (3) what to explicitly avoid doing.\n\nOriginal prompt: [paste prompt]',
        'Explicit "what to avoid" instructions are often more effective than only stating what to do.',
        ['prompt-engineering', 'constraints']
      ),
      card(
        'sec-prompt-engineering',
        'card-prompt-assumptions-first',
        'Ask for Assumptions Before Execution',
        'Use for any non-trivial task where a wrong assumption early on would waste a lot of downstream effort.',
        'Before doing this task: [describe task]\n\nFirst, list the assumptions you are making about requirements, scope, and constraints. Wait for me to confirm or correct them before proceeding.',
        'Cheap way to catch misunderstandings before the AI spends a long response on the wrong interpretation.',
        ['prompt-engineering', 'assumptions']
      ),
    ]),
  ],
};
