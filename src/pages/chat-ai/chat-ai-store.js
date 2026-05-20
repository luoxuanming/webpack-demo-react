/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-24 12:02:09
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-04-24 15:28:23
 * @FilePath: /webpack-demo/src/pages/home/home-store.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * 
 */
import { makeAutoObservable } from "mobx"
class HomeStore {
  title = "test1"
  done = true

  constructor() {
      makeAutoObservable(this)
  }

  setTitle(title) {
    this.title = title  // ✅ 在 action 里修改
  }
}

export default new HomeStore()