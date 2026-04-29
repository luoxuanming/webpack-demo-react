/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-28 13:42:19
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-04-28 13:42:24
 * @FilePath: /webpack-demo/src/locales/i18n.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// src/locales/i18n.js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhCN from './zh-CN'
import enUS from './en-US'

i18n
  .use(initReactI18next)  // 注入 react-i18next
  .init({
    resources: {
      zh: { translation: zhCN },
      en: { translation: enUS },
    },
    lng: localStorage.getItem('language') || 'zh',  // 初始语言
    fallbackLng: 'zh',     // 找不到翻译时降级语言
    interpolation: {
      escapeValue: false,  // React 已经处理 XSS，不需要转义
    }
  })

export default i18n