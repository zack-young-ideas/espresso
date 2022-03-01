const forms = require('../forms');


describe('databaseForm class', () => {

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
