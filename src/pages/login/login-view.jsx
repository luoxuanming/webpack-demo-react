/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-21 15:25:06
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-07-12 13:57:22
 * @FilePath: /webpack-demo/src/pages/login/index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useTranslation } from 'react-i18next'
import React, { useEffect, useContext, useState, useRef } from 'react'
import {
  Outlet,
  useLoaderData,
  useNavigate,
  Link,
  useSearchParams,
  useParams,
  useLocation,
  useMatches
} from "react-router";
import { observer, inject } from 'mobx-react'
import useStore from '../../store/useStore'
import styles from './login.module.less'
import dayjs from 'dayjs'
import { Form, Input, Button, message, Space } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  SafetyOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import CryptoJS from 'crypto-js';
// 顶部新增导入
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { loginApi } from './login-server'

const { TextArea } = Input

const SALT = 'ai_app_2026'; // 固定盐值，前后端一致

const loginView = (props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const matches = useMatches()
  const { id } = useParams()
  let data = useLoaderData();

  const { loginStore, appStore } = useStore()

  const [tab, setTab] = useState('login');         // login / register / reset
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);   // 发送验证码 loading
  const [countdown, setCountdown] = useState(0);   // 倒计时秒数
  const [form] = Form.useForm();

  // const id = searchParams.get('id')  // id = '2'
  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/chat-ai');
  }, [])


  // 发送验证码
  async function handleSendCode() {
    const email = form.getFieldValue('email');
    if (!email) return message.warning('请先输入邮箱');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return message.warning('邮箱格式不正确');
 
    setSending(true);
    try {
      const type = tab === 'register' ? 'register' : 'reset';
      await loginApi.sendCode({ email, type });
      message.success('验证码已发送，请查收邮件');
      setCountdown(60);
    } catch (err) {
      message.error(err.response?.data?.error || '发送失败');
    } finally {
      setSending(false);
    }
  }


  // 登陆
  async function handleLogin(values) {
    try {
      setLoading(true);
      const hashedPassword = CryptoJS.SHA256(SALT + values.password).toString();
      const {code, data, error} = await loginApi.login({
        email: values.email,
        password: hashedPassword,
      })
      // 存储 Token 和用户信息
      if(code == 0) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        message.success('登录成功！');
        navigate('/chat-ai');
      } else {
        message.error(error);
      }
      
    } catch (err) {
      console.log('err', err);
    } finally {
      setLoading(false);
    }
  }

   // 注册
  const handleRegister = async (values) => {
    setLoading(true)
    try {
      const hashedPassword = CryptoJS.SHA256(SALT + values.password).toString();
      const {code, data} = await loginApi.register({
        password: hashedPassword,
        confirmPassword: hashedPassword,
        email: values.email,
        nickname: values.nickname,
      })
      if(code == 0) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        message.success('注册成功！');
        navigate('/chat-ai');
      } else {
        
      }
     
    } catch (err) {
      console.log('err', err);
    } finally {
      setLoading(false);
    }
  }

  // 重置密码
  async function handleReset(values) {
    setLoading(true);
    try {
      await loginApi.resetPassword({
        email: values.email,
        code: values.code,
        newPassword: values.newPassword,
      });
      message.success('密码重置成功，请重新登录');
      form.resetFields();
      setTab('login');
    } catch (err) {
      message.error(err.response?.data?.error || '重置失败');
    } finally {
      setLoading(false);
    }
  }

  // 验证码按钮
  const CodeButton = () => (
    <Button
      onClick={handleSendCode}
      loading={sending}
      disabled={countdown > 0}
      className={styles.codeBtn}
    >
      {countdown > 0 ? `${countdown}s` : '发送验证码'}
    </Button>
  );

  return (
    <div className={styles.loginPage}>
      {/* 背景装饰 */}
      <div className={styles.bg}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
        <div className={styles.circle3} />
      </div>
 
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}><RobotOutlined /></div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>AI 助手</span>
            <span className={styles.logoSub}>智能对话平台</span>
          </div>
        </div>
 
        {/* Tab 切换 */}
        <div className={styles.tabs}>
          {[
            { key: 'login', label: '登录' },
            { key: 'register', label: '注册' },
            { key: 'reset', label: '忘记密码' },
          ].map(t => (
            <button
              key={t.key}
              className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
              onClick={() => { setTab(t.key); form.resetFields(); }}
            >
              {t.label}
            </button>
          ))}
        </div>
 
        {/* 登录表单 */}
        {tab === 'login' && (
          <Form form={form} onFinish={handleLogin} size="large" className={styles.form}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入QQ邮箱' },
                { type: 'email', message: '邮箱格式不正确' },
              ]}
            >
                <Input prefix={<MailOutlined />} placeholder="QQ邮箱地址" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="密码" />
            </Form.Item>
            <div className={styles.forgotLink}>
              <span onClick={() => setTab('reset')}>忘记密码？</span>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block className={styles.submitBtn}>
                登录
              </Button>
            </Form.Item>
            <div className={styles.switchTip}>
              还没有账号？<span onClick={() => setTab('register')}>立即注册</span>
            </div>
          </Form>
        )}
 
        {/* 注册表单 */}
        {tab === 'register' && (
          <Form form={form} onFinish={handleRegister} size="large" className={styles.form}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入QQ邮箱' },
                { type: 'email', message: '邮箱格式不正确' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="QQ邮箱地址" />
            </Form.Item>
            {/* <Form.Item name="code" rules={[{ required: true, message: '请输入验证码' }]}>
              <Input
                prefix={<SafetyOutlined />}
                placeholder="邮箱验证码"
                suffix={<CodeButton />}
              />
            </Form.Item> */}
            <Form.Item name="nickname">
              <Input prefix={<UserOutlined />} placeholder="昵称（选填）" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码不能少于6位' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="密码（至少6位）" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('两次密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block className={styles.submitBtn}>
                注册
              </Button>
            </Form.Item>
            <div className={styles.switchTip}>
              已有账号？<span onClick={() => setTab('login')}>立即登录</span>
            </div>
          </Form>
        )}
 
        {/* 忘记密码表单 */}
        {tab === 'reset' && (
          <Form form={form} onFinish={handleReset} size="large" className={styles.form}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入注册邮箱' },
                { type: 'email', message: '邮箱格式不正确' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="注册邮箱" />
            </Form.Item>
            <Form.Item name="code" rules={[{ required: true, message: '请输入验证码' }]}>
              <Input
                prefix={<SafetyOutlined />}
                placeholder="邮箱验证码"
                suffix={<CodeButton />}
              />
            </Form.Item>
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码不能少于6位' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="新密码（至少6位）" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                    return Promise.reject(new Error('两次密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block className={styles.submitBtn}>
                重置密码
              </Button>
            </Form.Item>
            <div className={styles.switchTip}>
              想起来了？<span onClick={() => setTab('login')}>返回登录</span>
            </div>
          </Form>
        )}
      </div>
    </div>
  )
}

export default observer(loginView)
