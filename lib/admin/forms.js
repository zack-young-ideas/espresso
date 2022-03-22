const xss = require('xss');

exports.BlogPostForm = class {
  #bodyContent;

  get body() {
    return this.#bodyContent;
  }

  set body(value) {
    this.#bodyContent = xss(value);
  }

  constructor(args) {
    this.title = args.title;
    this.slug = args.slug.toLowerCase();
    this.tags = args.tags.split(',');
    this.body = args.content;
    this.action = args.action;
    this.isValid = this.isValid.bind(this);
  }

  isValid() {
    if (this.slug.match(/[^-\w]/g)) {
      this.error = 'Invalid slug';
      return false;
    }
    if (!this.action.match(/^(Publish|Save Draft)$/g)) {
      this.error = 'Invalid action given';
      return false;
    }
    return true;
  }
};
