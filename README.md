# Paribu Case Test Automation Project

This project includes both **API** and **Web UI** test automation for the Paribu platform.  
It is built using `Cucumber`, `Playwright`, `Node.js`, and the `Page Object Model` (POM) structure.

## 🗂️ Project Structure

```
paribu-case/
├── config/              # Environment variables and global configuration
├── features/            # Gherkin .feature files
├── pages/               # Page Object Model classes (API and Web)
├── reports/             # JSON test reports
├── step-definitions/    # Step implementation files
├── support/             # Hooks, World, cucumber configuration
```

## 🚀 Setup & Installation

If you're cloning this project for the first time, follow the steps below:

```bash
npm install                                 # Install all dependencies
npm install @cucumber/cucumber --save-dev   # Install Cucumber.js
npm install @playwright/test --save-dev     # Install Playwright
npx playwright install                      # Download browser binaries
npm install axios dotenv --save             # (Optional) Used for API and env handling
npm install --save-dev npm-run-all          # Required to run multiple npm scripts in parallel (e.g., for multi-browser test runs)
```

> `npx playwright install` downloads necessary browser binaries (Chromium, Firefox, WebKit)

## ✅ Running the Tests.

```bash
npm test           # Run all tests
npm run test:api   # Run API tests
npm run test:web   # Run Web UI tests
npm run generate-report   # Generate HTML report from JSON results
```

## 📦 Technologies Used

- [Playwright](https://playwright.dev/)
- [Cucumber.js](https://github.com/cucumber/cucumber-js)
- [Node.js](https://nodejs.org/)
- [Page Object Model](https://martinfowler.com/bliki/PageObject.html)

## 📁 Environment Variables

URLs for the Web and API environments are defined in the `config/env.js` file.

## 📊 Generating Reports

After executing your tests, you can generate a visual HTML report using the following command:

```bash
npm run generate-report
```

This will use the `report-generator.js` script to read the Cucumber JSON report and output a user-friendly HTML report inside the `reports/` directory.

## ✍️ Notes

- To avoid code duplication, all page-related actions are organized under the `pages/` directory.
- The `hooks.js` file contains operations to be executed before and after tests.
- Playwright configuration is located in `playwright.config.js`.# Paribu-Case
