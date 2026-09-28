# Conventional Commits

Use Conventional Commits for commit messages in this repository.

## Message format

```text
<type>(<scope>): <short imperative summary>
```

Add a body when it helps explain why a change was made. Mark breaking changes with `!` after the type or scope and describe the migration in the body.

Use these types:

- `feat`: user-facing capability
- `fix`: bug fix
- `test`: tests or test tooling
- `docs`: documentation
- `refactor`: code restructuring without behavior change
- `perf`: performance improvement
- `build`: dependencies and build configuration
- `ci`: continuous integration configuration
- `chore`: maintenance that does not fit another type
- `revert`: reverting an earlier commit

Use a concise scope when it clarifies the affected area, such as `api`, `web`, `contracts`, or `agents`. The scope is optional for repository-wide changes.

## Commit boundaries

- Keep each commit focused on one logical change that can be reviewed independently.
- Order commits so prerequisites come before changes that depend on them.
- Keep dependency manifests and their lockfile changes together.
- Keep tests with the behavior they verify when they are part of one implementation; split test-tooling setup from behavior tests when each can stand alone.
- If a file contains changes for multiple commits, stage only the relevant hunks with `git add -p`.
- Before committing, inspect the staged diff and confirm it contains only the intended commit's changes.
- Do not create commits unless the user asks for them.

## Examples

```text
test(api): add HTML coverage reporting
test(api): cover missing API branches
docs(agents): document commit conventions
```
