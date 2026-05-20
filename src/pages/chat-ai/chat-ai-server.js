/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-28 17:54:26
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-05-14 18:23:04
 * @FilePath: /webpack-demo/src/pages/chat-ai/chat-ai-server.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import http from '@/utils/request'

export const chatAiApi = {
  getSessions: (params) => http.post('/chat/sessions', params),
  sendMessage: (params, config) => http.post('/chat/send', params, config),
  createSession: (params) => http.post('/chat/session', params),
  deleteSession: (sessionId) => http.delete(`/chat/session/${sessionId}`),
  getHistory: (sessionId) => http.get(`/chat/history/${sessionId}`),
}