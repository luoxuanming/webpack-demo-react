/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-21 15:25:06
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-04-24 14:17:49
 * @FilePath: /webpack-demo/src/pages/About/index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, {useEffect} from 'react'
import {useOutletContext} from 'react-router'
import {StoreContext} from '@/store/index'
// const About = (props) => {
//   const outletContext = useOutletContext()
//   useEffect(() => {
//     console.log('aboutProps', outletContext);
    
//   }, [])
//   return <div>This is About Component</div>
// }

class About extends React.Component {
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
        <p>{homeStore.count}</p>
        <button onClick={() => homeStore.increment()}>+1</button>
      </div>
    )
  }
}

export default About