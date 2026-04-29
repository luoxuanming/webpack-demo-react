/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-16 17:27:44
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-04-16 17:30:38
 * @FilePath: /webpack-demo/build/paths.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const path = require('node:path')
const rootDir = path.resolve(__dirname, '..')
const srcPath = path.join(rootDir, 'src')
const distPath = path.join(rootDir, 'dist')

module.exports = {
    srcPath,
    distPath,
    rootDir
}
