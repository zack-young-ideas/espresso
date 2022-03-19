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

describe('Public pages', () => {
  beforeAll(async () => {
    port = await portfinder.getPortPromise();
    url = `http://localhost:${port}`;

    // Stub the getBlogPosts() method of the database object.
    database.getBlogPosts = () => {
      const blogPostsArray = [{
        title: 'First Post',
        created: new Date(),
        body: 'This is the first post',
        views: 0,
      }, {
        title: 'Second Post',
        created: new Date(),
        body: 'This is the second post',
        views: 1,
      }];
      return blogPostsArray;
    };
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

  it('should display all blog posts', async () => {
    // Upon viewing the site's homepage, a summary of each blog post
    // is displayed.
    await browser.get(`${url}/`);
    await browser.wait(until.titleIs('Basic Blog'), 3000);
    const blogposts = await browser.findElements(By.className('blogpost'));
    expect(blogposts.length).toBe(2);

    const firstPost = blogposts[0];
    const firstPostTitle = await firstPost
      .findElement(By.css('a.text-dark')).getText();
    expect(firstPostTitle).toBe('First Post');
    const firstPostContent = await firstPost
      .findElement(By.css('p.card-text')).getText();
    expect(firstPostContent).toBe('This is the first post');

    const secondPost = blogposts[1];
    const secondPostTitle = await secondPost
      .findElement(By.css('a.text-dark')).getText();
    expect(secondPostTitle).toBe('Second Post');
    const secondPostContent = await secondPost
      .findElement(By.css('p.card-text')).getText();
    expect(secondPostContent).toBe('This is the second post');
  });
});
