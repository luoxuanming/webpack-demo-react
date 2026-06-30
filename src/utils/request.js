// src/utils/request.js
import axios from 'axios'
import { message } from 'antd'
import i18n from '../locales/i18n'

// 不同环境的 baseURL
const baseURLMap = {
  development: 'http://localhost:3001/api',
  production: 'https://47.107.43.140/api',
}

const request = axios.create({
  baseURL: baseURLMap[process.env.NODE_ENV] || baseURLMap.development,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// ─── 请求拦截器 ────────────────────────────────────────────
request.interceptors.request.use(
  (config) => {
    // 自动带上 token
    const token = localStorage.getItem('token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 带上当前语言
    config.headers['Accept-Language'] = i18n.language

    return config
  },
  (error) => Promise.reject(error)
)

// ─── 响应拦截器 ────────────────────────────────────────────
request.interceptors.response.use(
  (response) => {
    try {
      const { data } = response

      // 约定后端返回格式 { code, data, message }
      if (data.code === 0 || data.code === 200) {
        return data  // ✅ 只返回 data 字段，组件里直接用
      }

      // 业务错误
      message.error(data.error || data.message || '请求失败')
      return Promise.reject(new Error(data.error || data.message))
    } catch (error) {
      console.log('error*', error);
      
    }
  },
  (error) => {
    // HTTP 错误
    const status = error.response?.status

    const errorMap = {
      400: '请求参数错误',
      401: '登录已过期，请重新登录',
      403: '没有权限',
      404: '接口不存在',
      500: '服务器错误',
      502: '网关错误',
      503: '服务不可用',
    }

    const msg = errorMap[status] || error.message || '网络错误'
    message.error(msg)

    // 401 跳转登录页
    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user');
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

// ─── 封装常用方法 ──────────────────────────────────────────
const http = {
  get(url, params, config = {}) {
    return request.get(url, { params, ...config })
  },

  post(url, data, config = {}) {
    return request.post(url, data, config)
  },

  put(url, data, config = {}) {
    return request.put(url, data, config)
  },

  delete(url, params, config = {}) {
    return request.delete(url, { params, ...config })
  },

  // 文件上传
  upload(url, file, onProgress) {
    const formData = new FormData()
    formData.append('file', file)
    return request.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded / e.total) * 100)
        onProgress?.(percent)
      }
    })
  },

  // 文件下载
  download(url, params, filename) {
    return request.get(url, {
      params,
      responseType: 'blob'
    }).then(blob => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename || 'download'
      link.click()
      URL.revokeObjectURL(link.href)
    })
  }
}

export default http