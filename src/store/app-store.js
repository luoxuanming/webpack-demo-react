/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-24 12:02:09
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-04-28 16:15:16
 * @FilePath: /webpack-demo/src/pages/home/home-store.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * 
 */
import i18n from '../locales/i18n'
import { makeAutoObservable } from "mobx"
class AppStore {
  // 语言：'zh' | 'en'
  language = "zh"

  // 主题模式：'light' | 'dark'
  themeMode = 'light'

  // 主题色
  primaryColor = '#00b96b'

  constructor() {
      makeAutoObservable(this)
  }

  setTitle(title) {
    this.title = title  // ✅ 在 action 里修改
  }

  setLanguage(lang) {
    this.language = lang
    i18n.changeLanguage(lang)  // ✅ 同步切换 i18next 语言
  }

  setThemeMode(mode) {
    this.themeMode = mode
  }

  setPrimaryColor(color) {
    this.primaryColor = color
  }

  // computed：当前 antd theme 配置
  get antdTheme() {
    return {
      token: {
        colorPrimary: this.primaryColor,
        // colorBgContainer: this.themeMode === 'dark' ? '#1f1f1f' : '#f6ffed',
      },
      algorithm: this.themeMode === 'dark' 
        ? require('antd/es/theme').darkAlgorithm 
        : require('antd/es/theme').defaultAlgorithm,
      components: {
        Layout: {
          siderBg: this.themeMode === 'dark' ? '#1f1f1f' : '#f6ffed',
          triggerBg: this.themeMode === 'dark' ? '#1f1f1f' : '#f6ffed',
          triggerColor: this.themeMode === 'dark' ? '#fff' : '#1f1f1f',
        },
        Menu: {
          darkItemBg: this.themeMode === 'dark' ? '#1f1f1f' : '#f6ffed',
        }
      }  
    }
  }
}

export default new AppStore()