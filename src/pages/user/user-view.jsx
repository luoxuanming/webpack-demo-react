/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-21 15:25:06
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-04-28 15:17:29
 * @FilePath: /webpack-demo/src/pages/UserView/index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, {useEffect} from 'react'
import {useOutletContext} from 'react-router'
import {StoreContext} from '@/store/index'

class UserView extends React.Component {
  static contextType = StoreContext  // 绑定 context

  constructor(props, context) {
    super(props, context);
    console.log('constructor', this.context);
  }

  componentDidMount() {
    console.log('mount', this.context);
    
  }

  render() {
    const { homeStore } = this.context  // 直接用 this.context
    return (
      <div>
        个人中心
      </div>
    )
  }
}

export default UserView