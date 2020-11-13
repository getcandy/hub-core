const path = require('path');

module.exports = ({ config, mode }) => {

  config.module.rules.push({
    test: /\.css$/,
    loaders: [
      {
        loader: 'postcss-loader',
      },
    ],
    include: path.resolve(__dirname),
  });

  return config;
};
