const validator = require('validator');

exports.DatabaseForm = class {
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
