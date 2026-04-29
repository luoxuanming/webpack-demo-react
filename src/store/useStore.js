/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-24 13:59:21
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-04-24 13:59:33
 * @FilePath: /webpack-demo/src/store/useStore.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useContext } from 'react'
import { StoreContext } from './index'

const useStore = () => useContext(StoreContext)

export default useStore