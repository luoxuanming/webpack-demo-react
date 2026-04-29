/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-16 15:53:57
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-04-29 11:52:50
 * @FilePath: /webpack-demo/build/webpack.prod.config.cjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { rootDir } = require('./paths.cjs')
const path = require('node:path')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const base = require('./webpack.base.config.cjs')
const isProduction = process.env.NODE_ENV === 'production'
const os = require("node:os");
module.exports = merge(base, {
  mode: 'production',
  devtool: false,
  performance: {
    maxEntrypointSize: 500 * 1024,  // 改成 500KB
    maxAssetSize: 300 * 1024,
    hints: 'warning'  // 'error' | 'warning' | false
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpackDemo',
      template: path.resolve(rootDir, "index.html"),
      filename: "index.html",
      chunks: ['index', 'vendor', 'common', 'chunk-react'] // ✅ 只在生产环境指定
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/chunks/[id].[contenthash:8].css',
    }),
    // new BundleAnalyzerPlugin() // 构建后自动打开分析页面
  ],
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|jsx)$/,
        exclude: /node_modules/,
        use: [
          // 只在生产构建时开多线程（文件多才划算）
          ...(isProduction ? [{
            loader: 'thread-loader',
            options: { workers: os.cpus().length - 1 }
          }] : []),
          {
            loader: 'babel-loader',
            options: {
              // cacheDirectory: true,
              cacheDirectory: path.resolve(rootDir, 'node_modules/.cache/babel'),
              cacheCompression: false,  // 关闭压缩，缓存读写更快（只有磁盘空间极度紧张（比如免费 CI 只有 1GB 磁盘）才开启Gzip 压缩）
              presets: [
                ['@babel/preset-env'],
                ['@babel/preset-react', {
                  runtime: 'automatic', // ✅ React 17+ 不需要手动 import React
                  development: !isProduction, // ✅ 开发模式更好的错误提示
                }]
              ],
              plugins: [
                '@emotion/babel-plugin',  // ✅ 加上这个
                '@babel/plugin-transform-runtime'
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [ MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: false,
              // modules: true, // 处理 CSS Modules
              modules: {
                // 只对 .module.less / .module.css 开启
                // auto: true, // ✅ 自动检测文件名含 .module 才开启
                localIdentName: '[hash:base64:8]',
                namedExport: false,  // ✅ 加上这个，确保默认导出是对象, true 为具名导出
                exportLocalsConvention: 'camelCase',
              },
              importLoaders: 2 // 在 css-loader 前有2个 loader
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      stage: 3,
                      autoprefixer: {
                        grid: true
                      }
                    }
                  ]
                ]
              }
            }
          },
          {
            loader: "less-loader",
            options: {
              additionalData: async (content, loaderContext) => {
                // More information about available properties https://webpack.js.org/api/loaders/
                const { resourcePath, rootContext } = loaderContext;
                const relativePath = path.relative(rootContext, resourcePath);
                if (relativePath.endsWith("src/styles/foo.less")) {
                  return `@value: 100px;${content}`;
                }

                return `@value: 200px;${content}`;
              },
              sourceMap: false,
              lessLogAsWarnOrErr: true
            },
          },
        ],
      },
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,   // 生产环境去掉 console
            drop_debugger: true,
          },
          format: {
            comments: false,
          }
        },
        extractComments: false, // 不生成 LICENSE.txt
      }),
      new CssMinimizerPlugin({
        parallel: true, // 开启并行压缩
        exclude: /node_modules/,
      })
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        react: {
          name: 'chunk-react', // chunk 名称
          test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
          priority: 20,
          chunks: 'all',
        },
        vendor: {
          name: 'vendor', // chunk 名称
          priority: 10, // 权限更高，优先抽离，重要！！！
          test: /node_modules/,
          minSize: 0,  // 大小限制
          minChunks: 1  // 最少复用过几次
        },
        common: {
          name: 'common', // chunk 名称
          priority: 0, // 优先级
          minSize: 20 * 1024,  // 公共模块的大小限制
          minChunks: 2  // 公共模块最少复用过几次
        }
      }
    }
  }
})