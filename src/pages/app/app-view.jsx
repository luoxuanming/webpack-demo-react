
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