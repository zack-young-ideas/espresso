/* eslint-disable no-param-reassign */
const createMockDatabase = (databaseObject, userDatabase, blogDatabase) => {
  // This function accepts a mock database object and defines mock
  // methods to use during end-to-end testing.

  databaseObject.getUsers = () => userDatabase;

  databaseObject.createUser = (data) => {
    const newUser = {
      username: data.username,
      password: data.password,
      email: data.email,
      created: new Date(),
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
    };
    userDatabase.push(newUser);
    return newUser;
  };

  databaseObject.createBlogPost = (data) => {
    const blogPost = {
      title: data.title,
      slug: data.slug,
      author: 'Admin',
      created: new Date(),
      modified: new Date(),
      image: '',
      body: data.body,
      published: 'Publish',
      tags: data.tags,
      views: 0,
      comments: [],
    };
    blogDatabase.push(blogPost);
    return blogPost;
  };

  databaseObject.getBlogPostBySlug = (slug) => {
    const blogPost = blogDatabase.find((item) => (item.slug === slug));
    return blogPost;
  };

  databaseObject.getBlogPosts = () => blogDatabase;

  databaseObject.getUserByUsername = (username, password, callback) => {
    const user = userDatabase.find((item) => (item.username === username));
    if (user) {
      return callback(null, user);
    }
    return callback(
      null,
      false,
      { message: 'Incorrect username or password' },
    );
  };

  databaseObject.updateBlogPost = (data) => {
    const { slug } = data;
    const blogPost = blogDatabase.find((item) => (item.slug === slug));
    blogPost.title = data.title;
    blogPost.body = data.body;
    blogPost.tags = data.tags;
  };
};
/* eslint-disable no-param-reassign */

module.exports = createMockDatabase;
