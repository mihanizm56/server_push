const path = require('path');
const { override } = require('customize-cra');
const { addReactRefresh } = require('customize-cra-react-refresh');
const webpack = require('webpack');

const BundleVendorsPlugin = config => ({
    ...config,
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 100,
        maxSize: 300,
        minChunks: 30,
        maxAsyncRequests: 100,
        maxInitialRequests: 100,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          default: {
            minChunks: 10,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
  });

module.exports = override(
  BundleVendorsPlugin,
  addReactRefresh({ disableRefreshCheck: true })
);