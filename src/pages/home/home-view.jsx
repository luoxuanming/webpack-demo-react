/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-21 15:25:06
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-04-28 18:27:57
 * @FilePath: /webpack-demo/src/pages/home/index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useTranslation } from 'react-i18next'
import React, {useEffect, useContext} from 'react'
import {
  Outlet,
  useLoaderData,
  useNavigate,
  Link,
  useSearchParams,
  useParams,
  useLocation,
  useMatches
} from "react-router";
import {observer, inject} from 'mobx-react'
import useStore from '../../store/useStore'
import styles from './home.module.less'
import dayjs from 'dayjs'
import { Button, DatePicker, Empty } from 'antd';
import { homeApi } from './home-server'

const HomeView = (props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const matches = useMatches()
  const { id } = useParams()
  let data = useLoaderData();
  
  const {homeStore, appStore} = useStore()
  
  // const id = searchParams.get('id')  // id = '2'
  useEffect(() => {
    const currentMatch = matches[matches.length - 1]
    const title = currentMatch?.handle?.title || location.pathname
    // fetchList()
    
  }, [])

  const fetchList = async () => {
    setLoading(true)
    try {
      // 普通请求
      const data = await homeApi.getList('/home/list', { page: 1, size: 10 }, {
        headers: {
          'X-Trace-Id': 'abc123',
          'X-Source': 'home-page',
        }
      })
      setList(data)

      // 带自定义 header 的请求
      const data2 = await homeApi.getListWithHeader('/home/list', { page: 1 })
      setList(data2)
    } finally {
      setLoading(false)
    }
  }
 
  
  return (
    <div>
      <h2>{t('home.welcome')}</h2>
      
      {/* 插值用法 */}
      <p>{t('home.name', { name: '张三' })}</p>

      <Button type="primary">
        {t('common.pressMe')}
      </Button>
      <DatePicker placeholder="select date" />
      <Empty/>
      <Link to="/home/about">Dashboard</Link>
      <Outlet context={{ accountName: 'lxm' }} />
    </div>
  )
}

export default observer(HomeView)