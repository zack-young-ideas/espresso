const path = require('path');

module.exports = [
  {
    mode: 'production',
    entry: {
      deleteButton: './src/deleteButton.js',
      editor: './src/editor.js',
      slugAutoFill: './src/slugAutoFill.js',
    },
    resolve: {
      extensions: ['.js']
    },
    output: {
      path: path.resolve(__dirname, '../public/js'),
      filename: '[name].bundle.js',
      clean: true,
    },
  },
];
