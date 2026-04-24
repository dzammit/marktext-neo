# Repository Guidelines

## Project Structure & Module Organization

MarkText is an Electron/Vue markdown editor. Application code lives in `src/`: `src/main` is Electron main-process code, `src/renderer` is Vue renderer code, `src/common` holds shared utilities, and `src/muya` contains the editor engine package. Static assets are split between `static`, `resources`, and `src/renderer/assets`. Tests live in `test/unit`, `test/e2e`, and `test/specs`. Developer documentation is in `docs/dev`.

## Build, Test, and Development Commands

Use Yarn, as this repository includes `yarn.lock`.

- `yarn install`: install dependencies, rebuild native modules, and run postinstall lint fixes.
- `yarn run dev`: start the Electron development runner.
- `yarn run build:dev`: compile development bundles without packaging.
- `yarn run build`: build and package the app with `electron-builder`.
- `yarn run build:bin`: build unpacked binaries with `electron-builder --dir`.
- `yarn run lint`: run ESLint on `src` and `test`.
- `yarn run lint:fix`: apply supported ESLint fixes.
- `yarn run unit`: run Karma/Mocha unit tests in Electron.
- `yarn run e2e`: package the app and run Playwright end-to-end tests.
- `yarn run test`: run unit and e2e suites.
- `yarn run test:specs`: run CommonMark and GFM spec comparisons.

## Coding Style & Naming Conventions

Follow `.editorconfig`: UTF-8, LF line endings, final newline, trimmed trailing whitespace, and 2-space indentation. ESLint extends Standard, Vue base rules, and import checks. JavaScript and Vue files avoid semicolons, use ES modules, and may use aliases: `common`, `@` for `src/renderer`, and `muya`. Prefer existing naming patterns for components, services, commands, and utilities.

## Testing Guidelines

Add focused tests near the relevant suite: renderer/main behavior in `test/unit`, user workflows in `test/e2e`, and markdown parser compatibility in `test/specs` or `test/unit/data`. Run `yarn run lint` plus the smallest relevant test command before opening a PR; use `yarn run test` for broad changes.

## Commit & Pull Request Guidelines

Recent commits use concise subjects, often with prefixes such as `fix:`, `chore:`, or `[i18n]`, and may include issue/PR numbers, for example `fix #3150: Win32 error in renderer process`. Submit PRs against `develop`, link the related issue, describe the problem and solution, and include screenshots or recordings for UI changes. New features should start with a suggestion issue and rationale. Ensure lint, tests, and CI pass before review.

## Security & Configuration Tips

Do not commit local secrets, signing credentials, generated packages, or machine-specific app data. Review `docs/dev/BUILD.md`, `docs/dev/DEBUGGING.md`, and `docs/ENVIRONMENT.md` before changing build, runtime, or platform-specific behavior.
