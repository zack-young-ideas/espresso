const forms = require('../lib/setup/forms');

describe('DatabaseForm class', () => {
  it('contains error message if no database name is given', () => {
    const form = new forms.DatabaseForm({
      databaseName: '',
      username: 'Steve',
      password: 'BadPassword',
      databaseHost: 'localhost',
    });
    expect(form.isValid()).toBe(false);
    expect(form.error).toBe('No database name given');
  });

  it('contains error message if no username is given', () => {
    const form = new forms.DatabaseForm({
      databaseName: 'blog',
      username: '',
      password: 'BadPassword',
      databaseHost: 'localhost',
    });
    expect(form.isValid()).toBe(false);
    expect(form.error).toBe('No username given');
  });

  it('contains error message if no password is given', () => {
    const form = new forms.DatabaseForm({
      databaseName: 'blog',
      username: 'Steve',
      password: '',
      databaseHost: 'localhost',
    });
    expect(form.isValid()).toBe(false);
    expect(form.error).toBe('No password given');
  });

  it('contains error message if invalid hostname is given', () => {
    const form = new forms.DatabaseForm({
      databaseName: 'blog',
      username: 'Steve',
      password: 'BadPassword',
      databaseHost: 'notAValidHostname',
    });
    expect(form.isValid()).toBe(false);
    expect(form.error).toBe('Invalid host name');
  });

  it('isValid() method returns true if valid data is given', () => {
    let form = new forms.DatabaseForm({
      databaseName: 'blog',
      username: 'Steve',
      password: 'BadPassword',
      databaseHost: 'localhost',
    });
    expect(form.isValid()).toBe(true);
    expect(form.error).toBeUndefined();
    form = new forms.DatabaseForm({
      databaseName: 'blog',
      username: 'Steve',
      password: 'BadPassword',
      databaseHost: '192.168.2.1:8000',
    });
    expect(form.isValid()).toBe(true);
    expect(form.error).toBeUndefined();
  });
});

describe('UserForm class', () => {
  it("contains error message if passwords don't match", () => {
    const form = new forms.UserForm({
      username: 'Steve',
      password: 'BadPassword',
      confirmPassword: 'OtherBadPassword',
      email: 'steve@example.com',
    });
    expect(form.isValid()).toBe(false);
    expect(form.error).toBe('Passwords do not match');
  });

  it('contains error message if password is less than 9 characters', () => {
    const form = new forms.UserForm({
      username: 'Steve',
      password: 'short',
      confirmPassword: 'short',
      email: 'steve@example.com',
    });
    expect(form.isValid()).toBe(false);
    expect(form.error).toBe('Password must be at least 9 characters long');
  });

  it('contains error message if email is invalid', () => {
    const form = new forms.UserForm({
      username: 'Steve',
      password: 'LongerPassword',
      confirmPassword: 'LongerPassword',
      email: 'thisIsNotAnEmail',
    });
    expect(form.isValid()).toBe(false);
    expect(form.error).toBe('Invalid email');
  });

  it('contains error message if password is weak', () => {
    const form = new forms.UserForm({
      username: 'Steve',
      password: 'passwords',
      confirmPassword: 'passwords',
      email: 'steve@example.com',
    });
    expect(form.isValid()).toBe(false);
    expect(form.error).toBe('Choose a less common password');
  });

  it('isValid() method returns true if valid data is given', () => {
    const form = new forms.UserForm({
      username: 'Steve',
      password: '56tR3$aa2!sdjj',
      confirmPassword: '56tR3$aa2!sdjj',
      email: 'steve@example.com',
    });
    expect(form.isValid()).toBe(true);
    expect(form.error).toBeUndefined();
  });
});
