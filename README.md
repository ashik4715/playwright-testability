# Playwright E2E Testing Framework

Comprehensive E2E testing framework for [Conduit](https://conduit.bondaracademy.com/) built with Playwright and TypeScript.

## Test Scenarios (Positive + Negative per requirement)

- **Create New Article**: UI form validation
- **Edit Article**: Article display/content checks
- **Delete Article**: Button visibility checks  
- **Filter Articles by Tag**: Tag filtering functionality
- **Update User Settings**: Forms load correctly

## Features Implemented

| Feature | Status |
|---------|--------|
| Page Objects Pattern | ✅ |
| UI-based Tests | ✅ |
| Negative Test Cases | ✅ |
| Cross-browser Config | ✅ |
|Parallel Execution | ✅ |
|Test Traceability | ✅ |
|CI/CD GitHub Actions | ✅ |
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
A: Using existing logged-in session via UI navigation (site has persistent auth)

**Q: How are articles created for edit/delete tests?**
A: Tests check article display/content through direct navigation (API 405 not accessible)

**Q: What assertions do you use?**
A: UI element visibility, URL redirects, page content, element counts

**Q: Why not using API pre-conditions?**
A: API endpoints return 405 errors - not accessible, so tests use UI-only flow

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