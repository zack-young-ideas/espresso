/* eslint-disable max-classes-per-file */
const validator = require('validator');

const commonPasswords = require('./commonPasswords');

class DatabaseForm  {
  constructor(args) {
    const [databaseIp, databasePort] = args.databaseHost.split(':');
    this.databaseName = args.databaseName;
    this.username = args.username;
    this.password = args.password;
    this.databaseIp = databaseIp;
    this.databasePort = databasePort || '27017';
    this.isValid = this.isValid.bind(this);
  }

  isValid() {
    if (this.databaseIp !== 'localhost' && !validator.isIP(this.databaseIp)) {
      this.error = 'Invalid host name';
      return false;
    } if (!validator.isPort(this.databasePort)) {
      this.error = 'Invalid host name';
      return false;
    } if (!this.databaseName) {
      this.error = 'No database name given';
      return false;
    } if (!this.username) {
      this.error = 'No username given';
      return false;
    } if (!this.password) {
      this.error = 'No password given';
      return false;
    }
    return true;
  }
};

class UserForm {
  validRoles = [
    'admin',
  ];

  constructor(args) {
    this.username = args.username;
    this.password = args.password;
    this.secondPassword = args.confirmPassword;
    this.email = args.email;
    this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.role = args.role;
    this.isValid = this.isValid.bind(this);
  }

  isValid() {
    if (this.password !== this.secondPassword) {
      this.error = 'Passwords do not match';
      return false;
    } if (this.password.length < 9) {
      this.error = 'Password must be at least 9 characters long';
      return false;
    } if (!validator.isEmail(this.email)) {
      this.error = 'Invalid email';
      return false;
    } if (commonPasswords.indexOf(this.password) > -1) {
      this.error = 'Choose a less common password';
      return false;
    } if (this.validRoles.indexOf(this.role) === -1) {
      this.error = 'Invalid role';
      return false;
    }
    return true;
  }
};

module.exports = { DatabaseForm, UserForm };
/* eslint-disable max-classes-per-file */
