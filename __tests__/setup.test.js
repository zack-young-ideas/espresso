const { Builder, By, until } = require('selenium-webdriver');

const app = require('../index');
const database = require('../src/database');
const settings = require('../config');

jest.mock('../src/database');

const url = 'http://localhost:3000';
let browser;
let server;

beforeEach(async () => {
  server = await app.listen(3000);
  browser = await new Builder().forBrowser('chrome').build();
  settings.databaseUri = null;
});

afterEach(async () => {
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

  const intializeDatabaseInfo = async (dbName, username, password, host) => {
    // Completes the first step of the setup process.
    await browser.get(`${url}/setup`);
    await browser.wait(until.titleIs('Setup Database'), 3000);
    const databaseNameField = await browser
      .findElement(By.name('databaseName'));
    await databaseNameField.sendKeys(dbName);
    const usernameField = await browser.findElement(By.name('username'));
    await usernameField.sendKeys(username);
    const passwordField = await browser.findElement(By.name('password'));
    await passwordField.sendKeys(password);
    const databaseHostField = await browser
      .findElement(By.name('databaseHost'));
    await databaseHostField.sendKeys(host);
    const submitButton = await browser.findElement(By.name('submit'));
    await submitButton.click();
  };

  it('should prompt user to create admin login credentials', async () => {
    database.createAdminUser = jest.fn(() => {
      const user = {
        _id: '1234',
        username: 'admin',
        firstName: 'Zack',
        lastName: 'Young',
        admin: true,
      };
      return user;
    });
    // After the user enters the database login info...
    await intializeDatabaseInfo('blog', 'admin', 'password', 'localhost');

    // they are redirected to a page prompting them to create a
    // username and password for the admin user.
    await browser.wait(until.titleIs('Setup Admin User'), 3000);
    let currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/setup/user`);

    // The user enters a username, password, and email, then clicks
    // "Submit."
    const usernameField = await browser.findElement(By.name('username'));
    await usernameField.sendKeys('adminUser');
    const passwordField = await browser.findElement(By.name('password'));
    await passwordField.sendKeys('superSecret');
    const confirmPasswordField = await browser
      .findElement(By.name('confirmPassword'));
    await confirmPasswordField.sendKeys('superSecret');
    const emailField = await browser.findElement(By.name('email'));
    await emailField.sendKeys('theboss@example.com');
    const submitButton = await browser.findElement(By.name('submit'));
    await submitButton.click();

    // They are redirected to the admin dashboard.
    await browser.wait(until.titleIs('Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin`);
  });
});
