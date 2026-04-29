import React from 'react'
import { createBrowserRouter, redirect } from "react-router";

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const Layout = React.lazy(() => import('../components/Layout'))
const Home = React.lazy(() => import('../pages/home/home-view'))
const About = React.lazy(() => import('../pages/about/about-view'))
const User = React.lazy(() => import('../pages/user/user-view'))
const Admin = React.lazy(() => import('../pages/admin/admin-view'))


const getName = (name = 'app') => { 
  let obj = {
    app: 'appName',
    home: 'homeName',
    about: 'aboutName',
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(obj[name])
    }, 2000)
  })
  
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,      // App 作为所有页面的公共布局
    handle: { titleKey: 'menu.home' },  
    icon: <DesktopOutlined/>,
    children: [
      {
        index: true,
        loader: () => redirect('/home'),  // ✅ 访问 / 直接跳转到 /home
      },
      // {
      //   index: true,        // 匹配 / 首页
      //   element: <Home />   // 或者你的首页组件
      // },
      {
        path: "home",
        element: <Home />,
        handle: { titleKey: 'menu.home' },
        icon: <DesktopOutlined/>,
        // loader: async () => {
        //   const cname = await getName('app')
        //   return { name: cname }
        // },
        children: [
          { 
            title: '关于', 
            path: "about", 
            element: <About />, 
            handle: { titleKey: 'menu.about' },
            icon: <PieChartOutlined/>,
          }
        ]
      },
      {
        path: "user",
        element: <User />,
        handle: { titleKey: 'menu.user' },
        icon: <UserOutlined/>,
      },
      {
        path: "admin",
        element: <Admin />,
        handle: { titleKey: 'menu.admin' },
        icon: <TeamOutlined/>,
      }
    ]
  }
])

export default router