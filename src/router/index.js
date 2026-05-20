/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-21 15:31:42
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-05-13 13:02:55
 * @FilePath: /webpack-demo/src/router/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import { createBrowserRouter, redirect } from "react-router";

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { RouteErrorPage } from '../components/ErrorBoundary';
const Layout = React.lazy(() => import('../components/Layout'))
const Login = React.lazy(() => import('../pages/login/login-view'))
const Home = React.lazy(() => import('../pages/home/home-view'))
const About = React.lazy(() => import('../pages/about/about-view'))
const User = React.lazy(() => import('../pages/user/user-view'))
const Admin = React.lazy(() => import('../pages/admin/admin-view'))
const ChatAi = React.lazy(() => import('../pages/chat-ai/chat-ai-view'))
// 路由守卫
const AuthGuard = React.lazy(() => import('./AuthGuard'))


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
    errorElement: <RouteErrorPage/>,
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
      },
    ]
  },
  {
    path: "/chat-ai",
    element: <AuthGuard><ChatAi /></AuthGuard>,
    handle: { titleKey: 'menu.chatAi' },
    icon: <TeamOutlined/>,
  },
  {
    path: '/login',
    element: <Login />
  }
])

export default router