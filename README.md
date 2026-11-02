# BoxLite CI Playground

A small public repository for exercising GitHub Actions on ephemeral BoxLite runners.
The sample has no npm dependencies: it validates and sums a list of numbers.

## Workflows

| Workflow | Trigger | What it exercises |
| --- | --- | --- |
| Lint | Push to main, same-repository PR | Checkout, tool installation and syntax checks |
| Test | Push to main, same-repository PR | Node 22/24 matrix, assertions and job conclusions |
| Build | Push to main, same-repository PR, manual | Job output, artifact upload, download in a fresh worker, checksum and packaged-code verification |
| Release | Published GitHub release | Tag checkout, tests, packaging and release asset upload |

Every job uses `runs-on: boxlite-ci-runner`. A repository-scoped BoxLite Listener
must be running with that Scale Set name. The Listener can authenticate using a
GitHub App or a personal access token. Its management credentials stay outside
this repository and outside the CI worker. Each job gets a fresh worker.

The setup action installs Node and make explicitly. These workflows do not assume
the full `ubuntu-latest` software image. They check that known Listener credential
variables, private-key files and JIT bootstrap files are absent from the worker.
This is a configuration check, not a complete sandbox security assessment.

## Try the full lifecycle

1. Push a commit to main: Lint, Test and Build run automatically.
2. Create a branch in this repository, change a test and open a PR against main.
3. Wait for the checks, then merge the PR; main push checks run again.
4. Publish a release whose tag matches `v` plus `package.json` version, for example `v0.1.0`.
5. Download `playground.tar.gz` and `SHA256SUMS` from the release and verify the archive.

Fork PRs are deliberately skipped on this self-hosted demo. All external actions
are pinned to commit SHAs. Normal jobs have read-only repository access; only the
release job receives `contents: write`. No PAT, App key or BoxLite key is needed
in repository Actions secrets. The short-lived workflow token uploads release assets.

## Local checks

With Node 22+ and make installed:

```sh
make lint test build verify
```

The release archive contains the sample module, package metadata and this README.
`make verify` checks its SHA-256 digest and executes the extracted module.

## References

The trigger split, matrix testing and release lifecycle are simplified from
[BoxLite's public workflows](https://github.com/boxlite-ai/boxlite/tree/30a7c982d40da3118c6a59547904666c1412b756/.github/workflows).
See GitHub's [event reference](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
and [artifact actions](https://github.com/actions/upload-artifact) for their contracts.
