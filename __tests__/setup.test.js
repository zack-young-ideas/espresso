const { Builder, By, until } = require('selenium-webdriver');

const app = require('../index');
const database = require('../src/database');

jest.mock('../src/database');

const url = 'http://localhost:3000';
let browser;
let server;

beforeAll(async () => {
  server = await app.listen(3000);
  browser = await new Builder().forBrowser('chrome').build();
});

afterAll(async () => {
  await browser.quit();
  await server.close();
});

describe('Setup', () => {
  it('should prompt user for database info', async () => {
    // Requests made to any URL path redirect to /setup.
    await browser.get(`${url}/`);
    await browser.wait(until.titleIs('Setup Database'), 3000);
    const currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/setup`);

    // The user is prompted for their database login credentials.
    const databaseNameField = await browser
      .findElement(By.name('databaseName'));
    await databaseNameField.sendKeys('blog');
    const usernameField = await browser.findElement(By.name('username'));
    await usernameField.sendKeys('admin');
    const passwordField = await browser.findElement(By.name('password'));
    await passwordField.sendKeys('secretPassword');
    const databaseHostField = await browser
      .findElement(By.name('databaseHost'));
    await databaseHostField.sendKeys('localhost');
    const submitButton = await browser.findElement(By.name('submit'));
    await submitButton.click();
  });
});
