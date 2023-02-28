const nrwlConfig = require('@nrwl/react/plugins/webpack.js');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = (config, context) => {
  nrwlConfig(config);
  return {
    ...config,
    node: {
      global: true,
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          enforce: 'pre',
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                // Prefer `dart-sass`
                implementation: require("sass"),
              },
            },
            "source-map-loader"
          ],
        },
      ],
    },
    ignoreWarnings: [/Failed to parse source map/],
    plugins: [...config.plugins, new NodePolyfillPlugin()],
  };
};