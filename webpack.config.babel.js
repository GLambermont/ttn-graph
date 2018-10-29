import fileConfig from './webpack.config.files'; // File containing entries and html paths
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlCriticalWebpackPlugin from 'html-critical-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import HappyPack from 'happypack';
import LiveReloadPlugin from 'webpack-livereload-plugin';

// Generate HtmlWebpackPlugin instance for each html file in files from webpack.config.files
const createHtmlPlugins = (htmlConfig, dev) => {
  const defaultProperties = {
    hash: false,
    minify: {
      collapseWhitespace: !dev,
      minifyCSS: !dev,
      minifyJS: !dev,
      minifyURLs: !dev,
      removeAttributeQuotes: !dev,
      removeEmptyAttributes: !dev,
      removeOptionalTags: !dev,
      removeRedundantAttributes: !dev,
      removeScriptTypeAttributes: !dev,
      removeStyleLinkTypeAttributese: !dev,
    }
  };  
  
  // Return HTML Plugins with combined defaultProperties and properties from given config
  return htmlConfig.map(properties => new HtmlWebpackPlugin({ ...defaultProperties, ...properties }));
};

// Generate HtmlCriticalWebpackPlugin instance for each html file in files from webpack.config.files
const createCriticalPlugins = (htmlConfig, dev) => dev 
  ? [] 
  : fileConfig.html.map(properties => new HtmlCriticalWebpackPlugin({
    base: path.resolve(__dirname, 'dist'),
    src: properties.filename,
    dest: properties.filename,
    inline: true,
    minify: true,
    extract: true,
    width: 1300,
    height: 900,
    penthouse: {
      blockJSRequests: false,
    }
}));

export default (env, argv) => {   
  const happyThreadPool = HappyPack.ThreadPool({ size: 5 }); // Threadpool for Happypack used for js and styles
  const IS_DEV = argv.mode === 'development';  

  return {
    mode: IS_DEV ? 'development' : 'production',
    context: fileConfig.context,
    entry: {
      ...IS_DEV ? { devSync:  path.resolve(__dirname, 'dev-sync.js') } : {}, 
      ...fileConfig.entries 
    },
    output: {
      filename: 'js/[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    devtool: IS_DEV ? 'source-map' : false,
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCssAssetsPlugin
      ]
    },
    module: {
      rules: [
        // JS
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'happypack/loader?id=js'
        },

        // SASS/SCSS/CSS
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
               publicPath: '../'
              }
            },
            'happypack/loader?id=styles'
          ]
        },
        
        // Images
        {
          test: /\.(ico|gif|png|jpg|jpeg|webp)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                fallback: 'file-loader',
                name: '[path][name].[ext]',
              }
            },
            {
              loader: 'image-webpack-loader',
              options: { disable: IS_DEV }
            },
          ]
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                limit: 8192,
                noquotes: true,
                fallback: 'file-loader',
                name: '[path][name].[ext]',
              }
            },
            {
              loader: 'image-webpack-loader',
              options: { disable: IS_DEV }
            }
          ]
        },

        //Fonts
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                fallback: 'file-loader',
                name: '[path][name].[ext]',
              }
            }
          ]
        },
      ]
    },
    plugins: [
      new webpack.DefinePlugin({ IS_DEV: JSON.stringify(IS_DEV) }),
      new LiveReloadPlugin,
      new CleanWebpackPlugin(['dist']),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
        chunkFilename: 'css/[id].css'
      }),
      new CompressionPlugin({
        test: /\.js$|\.css$|\.html$/,
        cache: true,
        threshold: 2048
      }),
      new HappyPack({
        id: 'js',
        threadPool: happyThreadPool,
        loaders: [
          'babel-loader',
          'eslint-loader'
        ]
      }),
      new HappyPack({
        id: 'styles',
        threadPool: happyThreadPool,
        loaders: [
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      }),
    ].concat(
      createHtmlPlugins(fileConfig.html, IS_DEV),
      createCriticalPlugins(fileConfig.html, IS_DEV)
    )
  };
}