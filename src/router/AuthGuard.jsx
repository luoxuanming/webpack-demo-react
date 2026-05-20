/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-05-13 13:01:14
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-05-13 13:01:19
 * @FilePath: /webpack-demo/src/router/AuthGuard.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Navigate } from 'react-router';

export default function AuthGuard({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}