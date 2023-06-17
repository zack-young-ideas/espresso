const LocalStrategy = require('passport-local');
const passport = require('passport');
const path = require('path');
const portfinder = require('portfinder');
const { Builder, By, until } = require('selenium-webdriver');
const createMockDatabase = require('./mockDatabase');

const app = require('../../app');
const database = require('../../lib/database');
const settings = require('../../config');

jest.mock('../../lib/database');

let browser;
let userDatabase;
let blogDatabase;
let port;
let server;
let url;

describe('Admin site', () => {
  beforeAll(async () => {
    port = await portfinder.getPortPromise();
    url = `http://localhost:${port}`;
  });

  beforeEach(async () => {
    server = await app.listen(port);
    browser = await new Builder().forBrowser('chrome').build();
    // * Stub the properties of the settings object.
    settings.databaseUri = 'connection';
    settings.setup = true;
    // * Initialize the blogDatabase and userDatabase variables
    // * with mock databases.
    blogDatabase = [];
    userDatabase = [
      {
        _id: '1234',
        username: 'admin',
        firstName: 'Zack',
        lastName: 'Young',
        role: 'admin',
      },
    ];
    createMockDatabase(database, userDatabase, blogDatabase);
    passport.use(new LocalStrategy(
      { usernameField: 'username', passwordField: 'password' },
      database.getUserByUsername,
    ));
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

  const publishPost = async (title, slug, image, tags, text) => {
    // A function to quickly create or update a blog post.
    const titleField = await browser.findElement(By.name('title'));
    await titleField.sendKeys(title);
    const slugField = await browser.findElement(By.name('slug'));
    const slugValue = await slugField.getAttribute('value');
    expect(slugValue).toBe(slug);
    const imageField = await browser.findElement(By.name('image'));
    await imageField.sendKeys(path.join(__dirname, '/ocean.jpg'));
    const tagsField = await browser.findElement(By.name('tags'));
    await tagsField.sendKeys(tags);
    await browser.executeScript(`tinyMCE.activeEditor.setContent("${text}")`);
    const publishButton = await browser.findElement(By.id('publish-button'));
    await browser.executeScript('arguments[0].click()', publishButton);
  };

  it('should allow admin to create new posts', async () => {
    // The admin user logs into the admin site...
    authenticateAdminUser('admin', 'superSecret');
    // and is redirected to the admin dashboard.
    await browser.wait(until.titleIs('Admin'), 3000);
    let currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin`);

    // They click the button to create a new blog post.
    const addPostButton = await browser.findElement(By.id('add-post'));
    await addPostButton.click();
    await browser.wait(until.titleIs('Create Blog Post | Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin/blog/post/add`);
    // They proceed to create a new post.
    const text = ([
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Phasellus sapien sapien, vulputate sed massa dictum,',
      'sodales maximus neque. Morbi eu velit quis tortor commodo',
      'facilisis vel ac magna. Maecenas posuere fermentum nisl',
      'quis gravida.',
    ]).join(' ');
    await publishPost(
      'New Post',
      'new-post',
      `${__dirname}/ocean.jpg`,
      'example,test',
      text,
    );

    // After publishing the new post, they are redirected to the page
    // that displays all blog posts.
    await browser.wait(until.titleIs('Blog Overview | Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin/blog/post`);
    // The new post is displayed in the list of posts.
    const tableBody = await browser.findElement(By.tagName('tbody'));
    const rows = await tableBody.findElements(By.tagName('tr'));
    expect(rows.length).toBe(1);
    const firstRow = rows[0];
    const rowCells = await firstRow.findElements(By.tagName('td'));
    const title = await rowCells[1].getText();
    const author = await rowCells[2].getText();
    expect(title).toBe('New Post');
    expect(author).toBe('Admin');
  });

  it('should allow admin to edit existing posts', async () => {
    // The admin user logs into the admin site...
    authenticateAdminUser('admin', 'superSecret');
    // and is redirected to the admin dashboard.
    await browser.wait(until.titleIs('Admin'), 3000);
    let currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin`);

    // They click the button to create a new blog post.
    const addPostButton = await browser.findElement(By.id('add-post'));
    await addPostButton.click();
    await browser.wait(until.titleIs('Create Blog Post | Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin/blog/post/add`);
    // They proceed to create a new post.
    const text = ([
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Phasellus sapien sapien, vulputate sed massa dictum,',
      'sodales maximus neque. Morbi eu velit quis tortor commodo',
      'facilisis vel ac magna. Maecenas posuere fermentum nisl',
      'quis gravida.',
    ]).join(' ');
    await publishPost(
      'New Post',
      'new-post',
      `${__dirname}/ocean.jpg`,
      'example,test',
      text,
    );

    // After publishing the new post, they are redirected to the page
    // that lists all blog posts.
    await browser.wait(until.titleIs('Blog Overview | Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin/blog/post`);
    // They click the button to edit the post.
    const tableBody = await browser.findElement(By.tagName('tbody'));
    const rows = await tableBody.findElements(By.tagName('tr'));
    const firstRow = rows[0];
    const editButton = await firstRow.findElement(By.linkText('Edit'));
    await editButton.click();
    // They are redirected to the page that allows them to edit the
    // post.
    await browser.wait(until.titleIs('Edit Blog Post | Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin/blog/post/edit/new-post`);
    // They proceed to edit the post.
    const newText = ([
      'Costanza, what is that you\'re eating over there? That looks',
      'pretty tasty.',
    ]).join(' ');
    await browser.executeScript(
      `tinyMCE.activeEditor.setContent("${newText}")`,
    );
    const publishButton = await browser.findElement(By.id('publish-button'));
    await browser.executeScript('arguments[0].click()', publishButton);
    // After updating the post, they are redirected to the blog post
    // overview page.
    await browser.wait(until.titleIs('Blog Overview | Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin/blog/post`);
    // They view the public post and confirm that the changes have been
    // made.
    await browser.get(`${url}/blog/post/new-post`);
    await browser.wait(until.titleIs('New Post'), 3000);
    const postContent = await browser
      .findElement(By.className('main-content')).getText();
    expect(postContent).toBe(newText);
  });

  it('should allow admin to create new admin users', async () => {
    // The admin user logs into the admin site...
    authenticateAdminUser('admin', 'superSecret');
    // and is redirected to the admin dashboard.
    await browser.wait(until.titleIs('Admin'), 3000);
    let currentUrl = await browser.getCurrentUrl();
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
    await firstNameField.sendKeys('George');
    const lastNameField = await browser.findElement(By.name('lastName'));
    await lastNameField.sendKeys('Costanza');
    const newPasswordField = await browser.findElement(By.name('password'));
    await newPasswordField.sendKeys('S%4eCr35tP45ssw0rDD');
    const confirmPasswordField = await browser
      .findElement(By.name('confirmPassword'));
    await confirmPasswordField.sendKeys('S%4eCr35tP45ssw0rDD');
    const roleField = await browser.findElement(By.id('user-role'));
    await browser.executeScript('arguments[0].value="admin"', roleField);
    const createButton = await browser.findElement(By.name('create'));
    await browser.executeScript('arguments[0].click()', createButton);

    // After creating the new user, they are redirected to the page
    // that lists all users.
    await browser.wait(until.titleIs('Auth Overview | Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin/auth/user`);
    // The page now lists the main admin along with the new user.
    const tableBody = await browser.findElement(By.tagName('tbody'));
    const rows = await tableBody.findElements(By.tagName('tr'));
    expect(rows.length).toBe(2);
    const secondRow = rows[1];
    const rowCells = await secondRow.findElements(By.tagName('td'));
    const username = await rowCells[1].getText();
    const email = await rowCells[2].getText();
    expect(username).toBe('newUser');
    expect(email).toBe('new_user@example.com');
  });

  it('should allow new posts to contain a main image', async () => {
    // The admin user logs into the admin site...
    authenticateAdminUser('admin', 'superSecret');
    // and is redirected to the admin dashboard.
    await browser.wait(until.titleIs('Admin'), 3000);
    let currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin`);

    // They click the button to create a new blog post.
    const addPostButton = await browser.findElement(By.id('add-post'));
    await addPostButton.click();
    await browser.wait(until.titleIs('Create Blog Post | Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin/blog/post/add`);
    // They proceed to create a new post.
    const text = ([
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Phasellus sapien sapien, vulputate sed massa dictum,',
      'sodales maximus neque. Morbi eu velit quis tortor commodo',
      'facilisis vel ac magna. Maecenas posuere fermentum nisl',
      'quis gravida.',
    ]).join(' ');
    await publishPost(
      'New Post',
      'new-post',
      `${__dirname}/ocean.jpg`,
      'example,test',
      text,
    );
    // After publishing the new post, they are redirected to the page
    // that displays all blog posts.
    await browser.wait(until.titleIs('Blog Overview | Admin'), 3000);
    currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(`${url}/admin/blog/post`);
    // They view the public post and confirm that the post displays
    // the image.
    await browser.get(`${url}/blog/post/new-post`);
    await browser.wait(until.titleIs('New Post'), 3000);
    const image = await browser.findElement(By.className('main-image'));
    const altText = await image.getAttribute('alt');
    expect(altText).toBe('New Post');
  });
});
