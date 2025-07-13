# Heimdall Web E2E Testing with Playwright

This directory contains end-to-end tests for the Heimdall blog management system using Playwright.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

3. Set up environment variables:
```bash
# Create a .env.test file
cp .env.example .env.test
```

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests in UI mode (recommended for development)
```bash
npm run test:e2e:ui
```

### Run tests with visible browser
```bash
npm run test:e2e:headed
```

### Run specific test suites
```bash
# Authentication tests
npm run test:e2e:auth

# Post management tests
npm run test:e2e:posts

# Tag management tests
npm run test:e2e:tags

# Comment management tests
npm run test:e2e:comments
```

### Run tests on specific browsers
```bash
# Chrome only
npm run test:e2e:chrome

# Firefox only
npm run test:e2e:firefox

# Safari only
npm run test:e2e:webkit

# Mobile browsers
npm run test:e2e:mobile
```

### Debug tests
```bash
npm run test:e2e:debug
```

### Generate test code
```bash
npm run test:e2e:codegen
```

## View Test Reports

After running tests, view the HTML report:
```bash
npm run test:e2e:report
```

## Test Structure

```
tests/e2e/
├── fixtures/
│   └── test-fixtures.ts    # Test data and custom fixtures
├── helpers/
│   ├── auth.helper.ts      # Authentication helper functions
│   ├── post.helper.ts      # Post management helpers
│   ├── tag.helper.ts       # Tag management helpers
│   └── comment.helper.ts   # Comment management helpers
├── auth.spec.ts            # Authentication tests
├── posts.spec.ts           # Post management tests
├── tags.spec.ts            # Tag management tests
└── comments.spec.ts        # Comment management tests
```

## Writing New Tests

1. Create a new spec file in `tests/e2e/`
2. Import necessary fixtures and helpers
3. Use the test structure:

```typescript
import { test, expect } from '../fixtures/test-fixtures';
import { YourHelper } from '../helpers/your.helper';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Your test code
  });
});
```

## Best Practices

1. **Use Page Object Model**: Create helper classes for each feature
2. **Use data-testid**: Add test IDs to elements for reliable selection
3. **Wait for elements**: Use Playwright's auto-waiting features
4. **Avoid hard-coded waits**: Use `waitForSelector` instead of `waitForTimeout`
5. **Clean up test data**: Ensure tests don't leave residual data
6. **Run tests in parallel**: Tests should be independent

## Debugging Tips

1. Use `--debug` flag to step through tests
2. Use `page.pause()` to pause execution
3. Use VS Code Playwright extension for better debugging
4. Take screenshots on failure (automatically configured)
5. Use trace viewer for detailed debugging:
   ```bash
   npx playwright show-trace trace.zip
   ```

## CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Install dependencies
  run: npm ci
  
- name: Install Playwright browsers
  run: npx playwright install --with-deps
  
- name: Run E2E tests
  run: npm run test:e2e
  
- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Troubleshooting

### Tests fail with "No element found"
- Check if the application is running on the expected port
- Verify selectors are correct
- Add data-testid attributes to elements

### Tests timeout
- Increase timeout in playwright.config.ts
- Check if the application is slow to load
- Verify network conditions

### Browser not installed
- Run `npx playwright install`
- For CI, use `npx playwright install --with-deps`

## Environment Variables

Create a `.env.test` file:

```bash
BASE_URL=http://localhost:3000
API_URL=http://localhost:8080
TEST_AUTH_TOKEN=your-test-token
TEST_REFRESH_TOKEN=your-refresh-token
```