# Playwright E-commerce Automation

A personal learning project for UI test automation on
[SauceDemo](https://www.saucedemo.com), using Playwright and TypeScript.

## Test Coverage

25 test cases executed on Chromium and Firefox, totaling 50 test executions
before retries.

| Area      | Cases | Coverage                                                                             |
| --------- | ----: | ------------------------------------------------------------------------------------ |
| Login     |     6 | Successful login, locked account, invalid and missing credentials                    |
| Inventory |     6 | Product catalog, four sorting options, add/remove product                            |
| Cart      |     6 | Empty cart, product details, removal including last item, navigation, checkout entry |
| Checkout  |     7 | Required fields, order totals, completion, cancellation                              |

## Project Structure

- `tests/ui/`: Test scenarios and assertions.
- `pages/`: Page Objects containing locators and page actions.
- `fixtures/pages.fixture.ts`: Custom fixtures providing Page Objects.
- `helpers/`: Shared login preparation.
- `test-data/`: Login, product, and customer data.
- `playwright.config.ts`: Browser projects, reporting, and failure capture.
- `.github/workflows/playwright.yml`: GitHub Actions CI configuration.

Each test uses an isolated browser context. Inventory, cart, and checkout tests
log in through a shared helper in `beforeEach`. Assertions remain in the specs.

## Setup

Prerequisites: Node.js 24, npm, Git, and internet access to SauceDemo.

```bash
git clone https://github.com/gamhong00/playwright-ecommerce-automation.git
cd playwright-ecommerce-automation
npm ci
npx playwright install chromium firefox
```

On Linux, install browser system dependencies as well:

```bash
npx playwright install --with-deps chromium firefox
```

The base URL is configured in `playwright.config.ts`. No `.env` file is required
for the current demo tests.

## Run Tests

Run commands from the project root:

```bash
# Run all tests
npx playwright test

# Run checkout tests
npx playwright test tests/ui/checkout.spec.ts

# Run on Chromium only
npx playwright test --project=chromium

# Run with the browser visible
npx playwright test --headed

# List tests without replacing the HTML report
npx playwright test --list --reporter=list
```

If PowerShell blocks `npx.ps1`, use `npx.cmd` instead of `npx`.

## Reports and Failure Evidence

Open the HTML report after running tests:

```bash
npx playwright show-report
```

HTML reports are generated in `playwright-report/`. Screenshots are captured on
failure, and videos and traces are retained for failed test attempts in
`test-results/`. These generated directories are excluded from Git.

Open an individual trace using its actual file path:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

## Continuous Integration

GitHub Actions runs on:

- Pushes to `main`.
- Pull requests targeting `main`.
- Manual runs through **Actions > Playwright Tests > Run workflow**.

CI uses Ubuntu and Node.js 24, installs dependencies and both browsers, and runs
the tests with one worker. Failed tests are retried twice on CI; local runs have
no retries by default.

The workflow uploads `playwright-report` and available `test-results` artifacts
even when tests fail, unless the workflow is cancelled. Artifacts are retained
for 14 days and can be downloaded from the workflow run's summary page.

After extracting the report artifact, open it with:

```bash
npx playwright show-report <extracted-report-folder>
```

## Scope and Limitations

This project currently covers UI testing on a public demo website, not API
testing or a production application. Login credentials are public demo
credentials, and customer details are synthetic. No real orders are created.

The tests depend on SauceDemo availability and its current catalog, selectors,
and checkout behavior. Changes to the demo site may require test updates.
