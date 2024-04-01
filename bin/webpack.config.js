const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
  {
    mode: 'production',
    entry: {
      deleteButton: './src/deleteButton.js',
      slugAutoFill: './src/slugAutoFill.js',
      tinymce: './src/editor.js',
    },
    resolve: {
      extensions: ['.js']
    },
    plugins: [
      new MiniCssExtractPlugin(),
    ],
    module: {
      rules: [
        {
          test: /skin\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /content\.css$/i,
          loader: 'css-loader',
          options: {
            esModule: false,
          },
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, '../public/js'),
      filename: '[name].bundle.js',
      clean: true,
    },
  },
];
