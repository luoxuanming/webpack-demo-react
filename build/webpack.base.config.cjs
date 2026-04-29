/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-16 15:53:57
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-04-27 11:03:55
 * @FilePath: /webpack-demo/build/webpack.base.config.cjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const path = require('node:path')
const os = require("node:os");
const { DefinePlugin } = require('webpack')
const webpack = require("webpack");

const { rootDir } = require('./paths.cjs')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: {
    index: path.resolve(rootDir, "src", 'index.js')
  },
  output: {
    filename: "[name][contenthash:8].js",
    publicPath: '/', // 加这一行，所有资源从根路径加载
    path: path.resolve(rootDir, "dist"),
    clean: true // 每次构建前自动清除 dist 目录
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // ✅ 自动解析这些后缀
    alias: {
      '@': path.resolve(rootDir, 'src'), // ✅ @ 指向 src 目录
    }
  },
  plugins: [
    // 只保留中文语言包
    new webpack.ContextReplacementPlugin(
      /moment[/\\]locale$/,
      /zh-cn/
    ),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      '__DEV__': JSON.stringify(!isProduction),
    })
  ],
  module: {
    noParse: /^(lodash|moment|dayjs)$/, // 引入不打包
    rules: [
      // ── 图片（替代 url-loader）────────────────────────────────
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        type: 'asset', // 自动判断：小于阈值转 base64，大于输出文件
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8KB 以下转 base64
          }
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      },

      // ── SVG（单独处理，通常不转 base64）──────────────────────
      {
        test: /\.svg$/i,
        type: 'asset/resource', // 替代 file-loader，直接输出文件
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      },

      // ── 字体（替代 file-loader）──────────────────────────────
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      },

      // ── 媒体文件 ─────────────────────────────────────────────
      {
        test: /\.(mp4|webm|ogg|mp3|wav)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'media/[name].[hash:8][ext]'
        }
      },
      
    ],
  },
  cache: {
    type: 'filesystem',
    
    // 缓存目录，默认是 node_modules/.cache/webpack
    cacheDirectory: path.resolve(rootDir, 'node_modules/.cache/webpack'), 
    
    // 构建依赖，这些文件变化时缓存自动失效
    buildDependencies: {
        config: [__filename],           // webpack.config.js 变化时失效
        lockfile: [                     // 依赖锁文件变化时失效
          path.resolve(rootDir, 'package-lock.json'),
          // path.resolve(rootDir, 'yarn.lock'),
        ]
    },
    
    // 缓存名称，区分不同环境的缓存
    name: `${process.env.NODE_ENV}-cache`,
    
    // 缓存版本，手动让缓存失效时修改这里
    version: '1.0.0',
  }
}