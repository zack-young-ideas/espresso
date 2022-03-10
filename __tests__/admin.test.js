const LocalStrategy = require('passport-local');
const passport = require('passport');
const portfinder = require('portfinder');
const { Builder, By, until } = require('selenium-webdriver');

const app = require('../index');
const database = require('../src/database');
const settings = require('../config');

jest.mock('../src/database');

let browser;
let port;
let server;
let url;

describe('Admin site', () => {
  beforeAll(async () => {
    port = await portfinder.getPortPromise();
    url = `http://localhost:${port}`;

    // Stub the getUserByUsername() method of the database object
    // and then configure Passport to use this stubbed method
    // when authenticating users.
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
    settings.databaseUri = 'connection';
    settings.setup = true;
  });

  afterEach(async () => {
    await browser.quit();
    await server.close();
  });

  it('should allow admin to create new posts', async () => {
    // The admin user visits the site's homepage and notes there are
    // currently no blog posts available.
    await browser.get(`${url}/`);
    await browser.wait(until.titleIs('Basic Blog'), 3000);
    const blogposts = await browser.findElements(By.className('blogpost'));
    expect(blogposts.length).toBe(0);

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

    // They create a new blog post.
    const createButton = await browser.findElement(By.linkText('Add Post'));
    await createButton.click();
    await browser.wait(until.titleIs('Create Blog Post | Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin/blog/post/add`);
    const titleField = await browser.findElement(By.name('title'));
    await titleField.sendKeys('New Post');
    // The slug field is automatically filled in with a value based
    // on the title.
    const slugField = await browser.findElement(By.name('slug'));
    const slugValue = await slugField.getAttribute('value');
    expect(slugValue).toBe('new-post');
    const tagsField = await browser.findElement(By.name('tags'));
    await tagsField.sendKeys('example,test');
    const contentField = await browser.findElement(By.name('content'));
    await contentField.sendKeys(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
      'Phasellus sapien sapien, vulputate sed massa dictum, sodales ',
      'maximus neque. Morbi eu velit quis tortor commodo facilisis vel ',
      'ac magna. Maecenas posuere fermentum nisl quis gravida.',
    );
    const publishButton = await browser.findElement(By.id('publish-button'));
    await publishButton.click();

    // The user is redirected to the admin dashboard.
    await browser.wait(until.titleIs('Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin`);
  });
});
