const forms = require('../lib/admin/forms');

describe('BlogPostForm class', () => {
  it('contains error message if invalid action is given', () => {
    const form = new forms.BlogPostForm({
      title: 'Test Post',
      slug: 'test-post',
      tags: 'tests',
      body: 'This is just a test.',
      action: 'Wait',
    });
    expect(form.isValid()).toBe(false);
    expect(form.error).toBe('Invalid action given');
  });

  it('isValid() method returns true if valid action is given', () => {
    const form = new forms.BlogPostForm({
      title: 'Test Post',
      slug: 'test-post',
      tags: 'tests',
      body: 'This is just a test.',
      action: 'Publish',
    });
    expect(form.isValid()).toBe(true);
    expect(form.error).toBeUndefined();
  });
});
