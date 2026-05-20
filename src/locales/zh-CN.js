/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-28 13:41:47
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-05-07 18:10:03
 * @FilePath: /webpack-demo/src/locales/zh-CN.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// src/locales/zh-CN.js
export default {
  common: {
    pressMe: '点击我',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
  },
  menu: {
    home: '首页',
    about: '关于',
    user: '用户',
    admin: '管理员',
    chatAi: '聊天AI',
  },
  home: {
    title: '首页',
    welcome: '欢迎来到首页',
    name: '名字为：{{name}}',  // ✅ i18next 支持插值
  },
  about: {
    title: '关于',
  },
  chatAi: {
    newChat: '新对话',
    send: '发送'
  }
}