const { mode } = require('webpack-nano/argv');
const { merge } = require('webpack-merge');
const parts = require('./webpack.parts');

const cssLoaders = [parts.autoprefix()];

const commonConfig = merge([
  { entry: ['./src/main.js'] },
  parts.clean(),
  parts.page({ title: 'Vector' }),
  parts.extractCSS({ loaders: cssLoaders }),
  parts.loadImages({ limit: 15000 }),
  parts.loadSound({ limit: 15000 }),
  parts.loadWebGlShaders(),

  // https://survivejs.com/webpack/loading/fonts/
  parts.loadFonts({ limit: 15000 }),

  parts.loadJavaScript(),
  parts.setFreeVariable("HELLO", "hello from config"),
]);

const productionConfig = merge([
  {
    output: {
      chunkFilename: "[name].[contenthash].js",
      filename: "[name].[contenthash].js",
      assetModuleFilename: "[name].[contenthash][ext][query]",
    },
  },

  // https://survivejs.com/webpack/optimizing/separating-runtime/ or not?
  { optimization: { splitChunks: { chunks: "all" } } },
  // {
  //   optimization: {
  //     splitChunks: { chunks: "all" },
  //     runtimeChunk: { name: "runtime" },
  //   },
  // },

  parts.minifyJavaScript(),
  parts.minifyCSS({ options: { preset: ["default"] } }),
  parts.generateSourceMaps({ type: 'source-map' }),
  {
    performance: {
      hints: "warning", // "error" or false are valid too
      maxEntrypointSize: 16000, // in bytes, default 250k
      maxAssetSize: 16000, // in bytes
    },
  },
]);

const developmentConfig = merge([
  { entry: ['webpack-plugin-serve/client'] },
  parts.devServer(),
]);

const getConfig = (mode) => {
  // process.env.NODE_ENV = mode;
  switch (mode) {
    case 'production':
      return merge(commonConfig, productionConfig, { mode });
    case 'development':
      return merge(commonConfig, developmentConfig, { mode });
    default:
      throw new Error(`Trying to use an unknown mode, ${mode}`);
  }
};

module.exports = getConfig(mode);