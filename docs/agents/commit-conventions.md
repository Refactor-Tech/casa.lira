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

## Internal PR workflow

For an internal change that will be reviewed and merged through GitHub:

1. Start from an up-to-date `main` and create an English branch named `<type>/<scope>-<short-description>`, using lowercase kebab-case. Use a Conventional Commit type and a concise scope, for example `refactor/api-hexagonal-architecture`.
2. Keep each commit focused on one independently reviewable change. Use Conventional Commit messages; include tests with the implementation they cover, and keep standalone documentation in a separate `docs` commit.
3. Review the staged diff and whitespace before committing. Run the relevant checks for the change and report any checks that could not be run.
4. Push the branch and open a GitHub pull request targeting `main`. Use a concise Conventional Commit title and describe the change, validation performed, and any known limitations.
5. Report the branch, commit hashes, PR URL, and check results when the PR is ready for review.

Do not create commits or publish a PR unless the user requested that workflow.
