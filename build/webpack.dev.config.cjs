/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-16 15:53:57
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-04-29 11:45:26
 * @FilePath: /webpack-demo/build/webpack.dev.config.cjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const path = require('node:path')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const base = require("./webpack.base.config.cjs");
const { rootDir } = require('./paths.cjs')
const isProduction = process.env.NODE_ENV === 'production'
const os = require("node:os");
const config = merge(base, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
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
              "exclude": [
                // \\ for Windows, / for macOS and Linux
                /node_modules[\\/]core-js/,
                /node_modules[\\/]webpack[\\/]buildin/,
              ],
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
                'react-refresh/babel',       
                '@emotion/babel-plugin',  // ✅ 加上这个
                '@babel/plugin-transform-runtime'
              ]
            }
          }
        ]
      },
     
      {
        test: /\.css$/i,
        use: [ 'style-loader', 'css-loader'],
      },
      {
        test: /\.less$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2, // ✅ 恢复，前面有2个 loader
              // modules: true //modules: true 在 css-loader v7 中默认开启了 namedExport: true
              modules: {
                // 只对 .module.less / .module.css 开启
                // auto: true, // ✅ 自动检测文件名含 .module 才开启
                localIdentName: '[name]__[local]__[hash:base64:5]',
                namedExport: false,  // ✅ 加上这个，确保默认导出是对象, true 为具名导出
                exportLocalsConvention: 'camel-case',
              }
            }
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
            loader: 'less-loader',
            options: {
              sourceMap: true,
              lessLogAsWarnOrErr: true,
              additionalData: async (content, loaderContext) => {
                const { resourcePath, rootContext } = loaderContext
                const relativePath = path.relative(rootContext, resourcePath)
                if (relativePath.endsWith('src/styles/foo.less')) {
                  return `@value: 100px;${content}`
                }
                return `@value: 200px;${content}`
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),  
    new HtmlWebpackPlugin({
      title: 'webpackDemo',
      template: path.resolve(__dirname, "../index.html"), // 按你当前目录结构调整
      filename: "index.html",
    })
  ],
  devServer: {
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true,
      },
    },
    compress: true, // 是否开启gzip压缩
    port: 9000, 
    hot: true,
    liveReload: false, // 防止 HMR失败时自动整页刷新
    historyApiFallback: true, // ✅ SPA 路由刷新不 404
    // open: true // 是否自动打开浏览器
  },
})
module.exports = config
