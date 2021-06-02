# Flink SQL Toolkit for VS Code Guidelines

Thank you so much for willing to contribute to Flink SQL Toolkit! Here are a few important things you should know about contributing:

  1. Ruleset changes require discussion, use cases, etc. Code comes later.
  2. Pull requests are great for small fixes for bugs, documentation, etc.
  3. Code contributions require updating relevant documentation.

This project takes all contributions through <a href='https://help.github.com/articles/using-pull-requests'>pull requests</a>.
Code should *not* be pushed directly to `master`.

The following guidelines apply to all contributors.

## General Guidelines
- Only one logical change per commit
- Do not mix whitespace changes with functional code changes
- Do not mix unrelated functional changes
- When writing a commit message:
  - Describe *why* a change is being made
  - Do not assume the reviewer understands what the original problem was
  - Do not assume the code is self-evident/self-documenting
  - Describe any limitations of the current code
- Any significant changes should be accompanied by tests.
- The project already has good test coverage, so look at some of the existing tests if you're unsure how to go about it.
- Please squash all commits for a change into a single commit (this can be done using `git rebase -i`).

## Commit Message Guidelines
* Provide a brief description of the change in the first line.
* Insert a single blank line after the first line
* Provide a detailed description of the change in the following lines, breaking
 paragraphs where needed.
* The first line should be limited to 50 characters and should not end in a
 period.
* Subsequent lines should be wrapped at 72 characters.
* Put `Closes #XXX` line at the very end (where `XXX` is the actual issue number) if the proposed change is relevant to a tracked issue.

Note: In Git commits the first line of the commit message has special significance. It is used as the email subject line, in git annotate messages, in gitk viewer annotations, in merge commit messages and many more places where space is at a premium. Please make the effort to write a good first line!

## Ruleset Change Guidelines
We need to make public ruleset changes, including adding new rules, very carefully to maintain backward compatibility for contributions. Because of this, if you're interested in seeing a new rule, the best approach is to create an Github issue (or comment on an existing issue if there is one) requesting the rule and describing specific use cases for it.

If the rule has merit, it will go through a thorough process of rule design and review. Any code should come after this.

## Making Changes
* Fork the `vsc-flink-sql` repository
* Make your changes
* <a href='rulesets/tests/README.md'>Run tests</a>
* Push your changes to a branch in your fork
* See our commit message guidelines further down in this document
* Submit a pull request to the repository
* Update `vsc-flink-sql` GITHUB issue with the generated pull request link