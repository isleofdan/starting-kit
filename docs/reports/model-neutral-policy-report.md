# FIELD REPORT - model-neutral-policy - 2026-10-30

Nothing on Dan's screen changed. This is a local rules draft, not a released
template change. No commit, push, pull request, merge or deploy occurred.

## What stands

CLAUDE.md applies its safety boundaries to every coding harness, defaults new
suitable work to verified native ChatGPT/Codex cloud, records specific exceptions
and safe handoff of ongoing tasks, and preserves Claude/OpenRig as an optional
lane. It requires executor/harness/model/checker/rationale and independent review
evidence. Machine sessions never merge; other merge/deploy actions still need
Dan's explicit approval. No settings, secrets, data or deployment code changed.

Source: Dan's accepted production direction and explicit cloud default in the
parent transcript (Sentinel_e043a2f423c881919ab41b8ee8b53c7f). Baseline:
4ec08445cce46ee4ff81ca06e2f57bd23871da31. The former mandatory OpenRig section
is replaced; the existing procedure remains in agent-machine/docs/FACTS.md.
Companion report: agent-machine/docs/reports/model-neutral-policy-report.md.

## What the brief got wrong

Nothing. This task authorizes local preparation only.

## Deliberate divergences

No settings enforcement was ported to another harness. Claude's permissions are
not automatically Codex permissions: verify native controls and instruction
discovery before adopting the route. Existing apps are not silently rewritten.

## Verify

`git diff --check` passed. The companion agent-machine draft has 128 passing
offline assertion/guard checks and 17 prepared semantic replay cases. Semantic
replay and independent review remain pending; no checker PASS claimed. No UI or
application behavior changed, so screenshot/application tests were not run.

## Asks

None for local drafting. Parent must resolve release validation and instruction
adoption before release. Existing permissions, secret/privacy restrictions and
explicit merge/workflow approval remain in force.

## What the next session needs

Review the companion diff and evidence, then obtain the existing required release
approval. This template-only draft causes no live restart; future copies/adoption
take the rules. The companion agent-machine config changes would trigger a
restart on an authorized merge, so its session coordination gate must remain.

## Review follow-up

Companion reviewer corrections now fail closed for unsafe secret handoffs, validate
output schemas and require independent PR-head evidence. Release remains blocked
on the reviewed Spine native-mode forwarding contract and verified native repo
instruction loading/enforcement. CLAUDE.md wording alone does not establish either.

Root AGENTS.md now explicitly points Codex to the full canonical rules and SIGN.
Forty-two cross-repository static entry checks pass; no actual native load or
permission hook was tested. A local Spine companion is included with 19 passing
MCP/proxy contract checks; independent review and release validation remain.
