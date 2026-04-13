# Playwright E2E Testing Framework

Comprehensive E2E testing framework for [Conduit](https://conduit.bondaracademy.com/) built with Playwright and TypeScript.

## Test Scenarios

- **Create New Article**: Positive + negative test cases
- **Edit Article**: API pre-condition, positive + negative
- **Delete Article**: API pre-condition, positive + negative  
- **Filter Articles by Tag**: Tag filtering functionality
- **Update User Settings**: Settings updates with validation
- **Authentication**: Login flow with valid/invalid credentials

## Features Implemented

| Feature | Status |
|---------|--------|
| Page Objects Pattern | ✅ |
| Session Management | ✅ |
| API Pre-conditions | ✅ |
| Dynamic Test Data (faker) | ✅ |
| Cross-browser (Chromium/Firefox/WebKit) | ✅ |
| Parallel Execution | ✅ |
| Test Traces & Screenshots | ✅ |
| Allure Reports | ✅ |
| GitHub Actions CI/CD | ✅ |
| Negative Test Cases | ✅ |

## Project Structure

```
src/
├── config/          # App constants
├── test-data/      # Dynamic test data
├── utils/          # API client, session manager
├── page-objects/  # POM (Login, Home, Article, Settings)
└── tests/ui/      # Test specs
```

## Run Tests

```bash
npm test                    # All tests
npm run test:cross-browser # Multi-browser
npm run test:parallel      # Parallel
```

---

## Q&A Overview

**Q: What testing framework did you use?**
A: Playwright with TypeScript

**Q: How did you handle authentication?**
A: Session management with API login - reusable authenticated sessions stored in memory to avoid repeated logins

**Q: How are articles created for edit/delete tests?**
A: Created via API as pre-condition in beforeEach hooks

**Q: What assertions do you use?**
A: UI elements, text content, URL redirects, data persistence, error messages

**Q: How do you generate test data?**
A: Using @faker-js/faker for dynamic/randomized data

**Q: What browsers are supported?**
A: Chromium, Firefox, WebKit (configured in playwright.config.ts)

**Q: How do you run tests in parallel?**
A: `workers: 2` in CI, `--workers=4` CLI option

**Q: Where are test reports configured?**
A: HTML, JSON, Allure reporters in playwright.config.ts

**Q: How do you capture failures?**
A: Traces on retry, screenshots/video on failure

**Q: How is CI/CD set up?**
A: GitHub Actions workflow in .github/workflows/playwright.yml