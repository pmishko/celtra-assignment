# celtra-assignment

This repository contains end-to-end tests, utilizing CodeceptJS with Playwright for browser automation. The configuration supports both single and parallel test executions across multiple browsers.

## Prerequisites

- **Node.js**: Ensure Node.js is installed on your machine.
- **Dependencies**: Install project dependencies by running:

  ```bash
  npm install
  ```

## Running Tests

### Single Browser Execution

To execute tests in a single browser (default is Chromium):

```bash
npx codeceptjs run
```

If you wish to specify a different browser (e.g., Firefox), set the `BROWSER` environment variable:

```bash
BROWSER=firefox npx codeceptjs run
```

### Parallel Execution Across Multiple Browsers

The configuration allows running tests in parallel across multiple browsers. By default, tests are executed in Chromium and Firefox. To initiate this:

```bash
npx codeceptjs run-multiple parallel
```

This command runs the tests in parallel across the browsers specified in the multiple configuration.

- **Helpers**: Utilizes Playwright for browser automation and REST for API interactions.
- **Multiple Browsers**: Configured to run tests in parallel across Chromium and Firefox with 2 chunks.
- **Plugins**: Includes plugins for retrying failed steps, conditional execution, and screenshot capture on failure.

## Additional Resources

For more detailed information on configuring and running tests with CodeceptJS, refer to the [CodeceptJS documentation](https://codecept.io/).