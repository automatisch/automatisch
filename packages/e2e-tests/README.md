# Setting up the test environment
In order to get tests running, there are a few requirements 

1. Setting up the development/test environment
2. Installing playwright
3. Installing the test browsers
4. Setting up environment variables for testing
5. Running in vscode

## Setting up the development/test environment

Following the instructions found in the [development documentation](https://automatisch.io/docs/contributing/development-setup) is a great place to start. Note there is one **caveat**

> You should have the backend server be running off of a **non-production database**. This is because the test suite will actively **drop the database and reset** between test runs in order to ensure repeatability of tests.

## Installing playwright and test browsers

You can install all the required packages by going into the tests package

```sh
cd packages/e2e-tests
```

and installing the required dependencies with

```sh
yarn install
```

At the end of installation, this should display a CLI for installing the test browsers. For more information, check out the [Playwright documentation](https://playwright.dev/docs/intro#installing-playwright).

### Installing the test browsers

If you find you need to install the browsers for running tests at a later time, you can run

```sh
npx playwright install
```

and it should install the associated browsers for the test running. For more information, check out the [Playwright documentation](https://playwright.dev/docs/browsers#install-browsers).


## Running in VSCode

We recommend using [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) maintained by Microsoft. This lets you run playwright tests from within the code editor, giving you access to additional tools, such as easily running subsets of tests.

[Global setup and teardown](https://playwright.dev/docs/test-global-setup-teardown) are part of the tests.

By running `yarn test` setup and teardown actions will take place.

If you need to setup Admin account (if you didn't seed the DB with the admin account or have clean DB) you should run `auth.setup.js` file.

If you want to clean the database (drop tables) and perform required migrations run `global.teardown.js`.

# Test failures

If there are failing tests in the test suite, this can be caused by a myriad of reasons, but one of the best places to start is either running the test in a headed browser, looking at the associated trace file for the failed test, or checking out the output of a failed GitHub Action.

Playwright has their [own documentation](<https://playwright.dev/docs/trace-viewer#trace-viewer-features)>) on the trace viewer which is very helpful for reviewing the exact browser steps made during a failed test execution.
