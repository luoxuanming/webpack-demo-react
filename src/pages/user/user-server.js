/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-06-22 13:08:48
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-06-22 13:21:53
 * @FilePath: /webpack-demo/src/pages/user/user-server.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// src/pages/user/users/user-server.js
import http from '@/utils/request'// 改成你项目实际的 axios 路径

export const userApi = {
  // 获取用户列表
  getUsers: (params) => http.post('/user/list', params),

  // 修改用户次数
  updateQuota: (id, quota) => http.post(`/user/users/${id}/quota`, { quota }),

  // 修改用户状态（1启用 0禁用）
  updateStatus: (id, status) => http.post(`/user/users/${id}/status`, { status }),
}