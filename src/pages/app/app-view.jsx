/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-28 11:24:58
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-06-22 12:34:53
 * @FilePath: /webpack-demo/src/pages/app/app-view.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import React from 'react'
import {observer, inject} from 'mobx-react'
import { RouterProvider } from "react-router/dom";

import router from '../../router'
import { store, StoreContext} from '../../store'
import useStore from '../../store/useStore'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import styles from './app.module.less'

const localeMap = {
  zh: zhCN,
  en: enUS,
}

// dayjs locale 映射表
const dayjsLocaleMap = {
  zh: 'zh',
  en: 'en',
}

const App = () => {
  const {appStore} = useStore()
  
  dayjs.locale(dayjsLocaleMap[appStore.language])
  
  return (
    <ConfigProvider 
      locale={localeMap[appStore.language]}
      theme={appStore.antdTheme}
      >
      <React.Suspense fallback={<div>Loading...</div>}>
      <StoreContext.Provider value={store}>
        <RouterProvider router={router} />
      </StoreContext.Provider>
      </React.Suspense>
    </ConfigProvider>
  )
}

export default observer(App)