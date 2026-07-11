/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-16 18:22:33
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-07-11 23:03:40
 * @FilePath: /webpack-demo/src/LayoutView.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useTranslation } from 'react-i18next'
import {useEffect, useState} from 'react'
import {observer, inject} from 'mobx-react'
import styles from './index.module.less'
import {
  Outlet,
  useLoaderData,
  useNavigate,
  Link,
  useSearchParams,
  useParams,
  useMatches
} from "react-router";
import useStore from '../../store/useStore'
import {cloneDeep} from 'lodash'
import router from '../../router'
import { ErrorBoundary } from '../ErrorBoundary';

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, ColorPicker, Switch, Space } from 'antd';
import logo from '@/assets/images/www.jpg'

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
// let items = [
//   getItem('Option 1', '1', <PieChartOutlined />),
//   getItem('Option 2', '2', <DesktopOutlined />),
//   getItem('User', 'sub1', <UserOutlined />, [
//     getItem('TomTomTomTomTom', '3', null, [getItem('Bill2Bill2Bill2Bill2Bill2', '34', null, [ getItem('Alex', '54'),])]),
//     getItem('Bill', '4'),
//     getItem('Alex', '5'),
//   ]),
//   getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
//   getItem('Files', '9', <FileOutlined />),
// ];


const LayoutView = (props) => {
  const {t} = useTranslation()
  const matches = useMatches()
  const navigate = useNavigate()
  const {appStore} = useStore()
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState([]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const currentYear = new Date().getFullYear();

  // 过滤掉没有 titleKey 的路由
  const crumbs = matches.filter(match => match.handle?.titleKey)
  
  const changeLanguage = () => {
    const lang = appStore.language = appStore.language === 'zh' ? 'en' : 'zh'
    appStore.setLanguage(lang)
  }

  const handleMenuClick = ({ key }) => {
    console.log('navigateKey', key);
    
    navigate(key)  // ✅ 点击菜单跳转路由
  }

  const loopRouter = (arr= [], parentPath = '/') => {
    
    try {
      return arr.filter(item => !item.index).map(item => {
        console.log('item.children', item.children);
        const path = parentPath + item.path
        let child = item?.children ? loopRouter(item.children, path+'/') : null
        return {
          key: path,
          icon: item.icon,
          children: child,
          label: t(item.handle.titleKey),
        }
      })
    } catch (error) {
      
    }
    
  }

  useEffect(() => {
    console.log('arr^^^', router.routes[0].children);
    let arr = loopRouter(router.routes[0].children)
    console.log('arr', arr);
    
    setItems(arr)
  }, [appStore.language])
  
  return (
    <ErrorBoundary>
    <Layout style={{ minHeight: '100vh' }} token={appStore.antdTheme}>
      <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        {/* <div className="demo-logo-vertical">Logo</div> */}
        <Menu 
          theme={appStore.themeMode} 
          defaultSelectedKeys={['home']} 
          mode="inline" 
          items={items}
          onClick={handleMenuClick}
         />
      </Sider>
      <Layout>
        <Header className={styles.header} style={{ background: colorBgContainer }} >
          <div className={styles.left}>
            <img className={styles.logo} src={logo}></img>
          </div>
          <div className={styles.right}>
            <a onClick={changeLanguage}>{appStore.language === 'zh' ? '英文' : '中文'}</a>
             {/* 切换暗色模式 */}
            <Switch
              checkedChildren="🌙 暗色"
              unCheckedChildren="☀️ 亮色"
              checked={appStore.themeMode === 'dark'}
              onChange={(checked) =>
                appStore.setThemeMode(checked ? 'dark' : 'light')
              }
            />
            <ColorPicker
              value={appStore.primaryColor}
              onChange={(_, hex) => appStore.setPrimaryColor(hex)}
              presets={[{
                label: '推荐颜色',
                colors: ['#00b96b', '#1677ff', '#722ed1', '#eb2f96', '#fa8c16']
              }]}
            />
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb
            tyle={{ padding: '16px 0' }}
            items={crumbs.map((match, index) => {
              const isLast = index === crumbs.length - 1
              return {
                title: t(match.handle.titleKey),  // ✅ 用 t() 翻译
                onClick: () => !isLast && navigate(match.pathname),
                style: { cursor: isLast ? 'default' : 'pointer' }
              }
            })}
          />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
           <Outlet></Outlet>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          AI-助手 ©{currentYear} Created by LuoXuanMing 粤ICP备2026093473号-1
        </Footer>
      </Layout>
    </Layout>
    </ErrorBoundary>
  );
};
export default observer(LayoutView);