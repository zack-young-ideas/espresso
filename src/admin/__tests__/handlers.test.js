const handlers = require('../handlers');

describe('homepage handler', () => {
  describe('GET requests', () => {
    it('should render homepage.html template', () => {
      const res = { render: jest.fn() };

      handlers.homepage.get({}, res);

      expect(res.render).toHaveBeenCalledWith('admin/homepage');
    });
  });
});
