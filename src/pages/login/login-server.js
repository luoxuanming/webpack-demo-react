/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-28 17:54:26
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-05-13 14:43:39
 * @FilePath: /webpack-demo/src/pages/chat-ai/chat-ai-server.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import http from '@/utils/request'

export const loginApi = {
  sendCode: (params) => http.post('/auth/send-code', params),
  login: (params) => http.post('/auth/login', params),
  register: (params) => http.post('/auth/register', params),
  resetPassword: (params) => http.post('/auth/reset-password', params),
}