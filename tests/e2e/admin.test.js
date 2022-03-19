const LocalStrategy = require('passport-local');
const passport = require('passport');
const portfinder = require('portfinder');
const { Builder, By, until } = require('selenium-webdriver');

const app = require('../../app');
const database = require('../../lib/database');
const settings = require('../../config');

jest.mock('../../lib/database');

let browser;
let port;
let server;
let url;

describe('Admin site', () => {
  beforeAll(async () => {
    port = await portfinder.getPortPromise();
    url = `http://localhost:${port}`;

    // * Stub the getUserByUsername() method of the database object
    // * and then configure Passport to use this stubbed method when
    // * authenticating users.
    database.getUserByUsername = (username, password, callback) => {
      const user = {
        _id: '1234',
        username: 'admin',
        firstName: 'Zack',
        lastName: 'Young',
        admin: true,
      };
      return callback(null, user);
    };
    passport.use(new LocalStrategy(
      { usernameField: 'username', passwordField: 'password' },
      database.getUserByUsername,
    ));
  });

  beforeEach(async () => {
    server = await app.listen(port);
    browser = await new Builder().forBrowser('chrome').build();
    // * Stub the properties of the settings object.
    settings.databaseUri = 'connection';
    settings.setup = true;
  });

  afterEach(async () => {
    await browser.quit();
    await server.close();
  });

  it('should allow admin user to log in', async () => {
    // If the admin user is not logged in yet, all requests to the
    // admin URL redirect to the login page.
    await browser.get(`${url}/admin`);
    await browser.wait(until.titleIs('Admin Login'), 3000);
    let currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin/login`);

    // The user is prompted for their login credentials.
    const usernameField = await browser.findElement(By.name('username'));
    await usernameField.sendKeys('admin');
    const passwordField = await browser.findElement(By.name('password'));
    await passwordField.sendKeys('superSecret');
    const submitButton = await browser.findElement(By.name('submit'));
    await submitButton.click();

    // They are redirected to the admin dashboard.
    await browser.wait(until.titleIs('Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin`);
  });

  const authenticateAdminUser = async (username, password) => {
    // A function that quickly logs a user in to the admin site.
    await browser.get(`${url}/admin/login`);
    await browser.wait(until.titleIs('Admin Login'), 3000);
    const usernameField = await browser.findElement(By.name('username'));
    await usernameField.sendKeys(username);
    const passwordField = await browser.findElement(By.name('password'));
    await passwordField.sendKeys(password);
    const submitButton = await browser.findElement(By.name('submit'));
    await submitButton.click();
  };

  it('should allow admin to create new posts', async () => {
    // The admin user logs into the admin site...
    authenticateAdminUser('admin', 'superSecret');
    // and is redirected to the admin dashboard.
    await browser.wait(until.titleIs('Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin`);

    // They click the button to create a new blog post.
    const addPostButton = await browser.findElement(By.id('add-post'));
    await addPostButton.click();
    await browser.wait(until.titleIs('Create Blog Post | Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin/blog/post/add`);
    // They proceed to create a new post.
    const titleField = await browser.findElement(By.name('title'));
    await titleField.sendKeys('New Post');
    // The slug field is automatically filled in with a value based
    // on the title.
    const slugField = await browser.findElement(By.name('slug'));
    const slugValue = await slugField.getAttribute('value');
    expect(slugValue).toBe('new-post');
    const tagsField = await browser.findElement(By.name('tags'));
    await tagsField.sendKeys('example,test');
    const text = ([
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Phasellus sapien sapien, vulputate sed massa dictum,',
      'sodales maximus neque. Morbi eu velit quis tortor commodo',
      'facilisis vel ac magna. Maecenas posuere fermentum nisl',
      'quis gravida.',
    ]).join(' ');
    await browser.executeScript(`tinyMCE.activeEditor.setContent("${text}")`);
    const publishButton = await browser.findElement(By.id('publish-button'));
    await browser.executeScript('arguments[0].click()', publishButton);

    // After publishing the new post, they are redirected to the admin
    // dashboard.
    await browser.wait(until.titleIs('Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin`);
  });

  it('should allow admin to create new admin users', async () => {
    // The admin user logs into the admin site...
    authenticateAdminUser('admin', 'superSecret');
    // and is redirected to the admin dashboard.
    await browser.wait(until.titleIs('Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin`);

    // After logging in, they click on the button to add a new user.
    const addUserButton = await browser.findElement(By.id('add-user'));
    await addUserButton.click();
    // They are brought to a page prompting them to enter the new
    // user's information.
    await browser.wait(until.titleIs('Create User | Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin/auth/user/add`);
    const newUsernameField = await browser.findElement(By.name('username'));
    await newUsernameField.sendKeys('newUser');
    const emailField = await browser.findElement(By.name('email'));
    await emailField.sendKeys('new_user@example.com');
    const firstNameField = await browser.findElement(By.name('firstName'));
    await firstNameField.sendKeys('Zack');
    const lastNameField = await browser.findElement(By.name('lastName'));
    await lastNameField.sendKeys('Young');
    const newPasswordField = await browser.findElement(By.name('password'));
    await newPasswordField.sendKeys('S%4eCr35tP45ssw0rDD');
    const confirmPasswordField = await browser
      .findElement(By.name('confirmPassword'));
    await confirmPasswordField.sendKeys('S%4eCr35tP45ssw0rDD');
    const roleField = await browser
      .findElement(By.css('option[value="admin"])'));
    await roleField.click();
    const createButton = await browser.findElement(By.name('create'));
    await createButton.click();

    // After creating the new user, they are redirected to the page
    // that lists all users.
    await browser.wait(until.titleIs('Users | Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin/auth/user`);
  });
});
