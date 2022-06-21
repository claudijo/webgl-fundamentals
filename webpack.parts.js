const path = require('path');
const { WebpackPluginServe } = require('webpack-plugin-serve');
const {
  MiniHtmlWebpackPlugin,
} = require('mini-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require("webpack");

const APP_SOURCE = path.join(__dirname, 'src');

exports.loadJavaScript = () => ({
  module: {
    rules: [
      // Consider extracting include as a parameter
      { test: /\.js$/, include: APP_SOURCE, use: 'babel-loader' },
    ],
  },
});

exports.minifyJavaScript = () => ({
  optimization: { minimizer: [new TerserPlugin()] },
});

exports.minifyCSS = ({ options }) => ({
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({ minimizerOptions: options }),
    ],
  },
});

exports.extractCSS = ({ options = {}, loaders = [] } = {}) => {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader, options },
            'css-loader',
          ].concat(loaders),
          sideEffects: true,
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
    ],
  };
};

exports.devServer = () => ({
  watch: true,
  plugins: [
    new WebpackPluginServe({
      port: parseInt(process.env.PORT, 10) || 8080,
      static: './dist', // Expose if output.path changes
      liveReload: true,
      waitForBuild: true,
    }),
  ],
});

exports.page = (context = {}) => ({
  plugins: [new MiniHtmlWebpackPlugin({ context })],
});

exports.loadCSS = () => ({
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ],
  },
});

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    postcssOptions: { plugins: [require('autoprefixer')()] },
  },
});

exports.loadImages = ({ limit } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        type: 'asset',
        parser: { dataUrlCondition: { maxSize: limit } },
      },
    ],
  },
});

exports.loadSound = ({ limit } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(mp3|wav)$/,
        type: 'asset',
        parser: { dataUrlCondition: { maxSize: limit } },
      },
    ],
  },
});

exports.loadWebGlShaders = () => ({
  module: {
    rules: [
      {
        test: /\.(glsl|vert|frag)$/,
        type: 'asset/source'
      },
    ],
  },
})

exports.loadFonts = ({ limit } = {}) => ({
  module: {
    rules: [
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, // Match .woff?v=1.1.1.
        type: 'asset',
        parser: { dataUrlCondition: { maxSize: 50000 } },
      },
    ],
  },
});

exports.generateSourceMaps = ({ type }) => ({ devtool: type });

exports.clean = () => ({
  output: {
    clean: true,
  },
});

exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [new webpack.DefinePlugin(env)],
  };
};