// src/components/ErrorBoundary/index.jsx
import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate, useRouteError } from 'react-router';

// ── 路由级错误页（配合 React Router v6 的 errorElement 使用）──
export function RouteErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  // 判断错误类型
  const is404 = error?.status === 404;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Result
        status={is404 ? '404' : '500'}
        title={is404 ? '404' : '500'}
        subTitle={is404 ? '页面不存在' : (error?.message || '服务器发生了一些错误')}
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/')}>
            回到首页
          </Button>,
          <Button key="back" onClick={() => navigate(-1)}>
            返回上页
          </Button>,
        ]}
      />
    </div>
  );
}

// ── Class 组件级错误边界（捕获组件内部运行时错误）──
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // 这里可以接入 Sentry 等错误监控
    console.error('组件错误:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40 }}>
          <Result
            status="error"
            title="页面出现错误"
            subTitle={this.state.error?.message || '组件渲染失败，请刷新重试'}
            extra={
              <Button type="primary" onClick={() => this.setState({ hasError: false, error: null })}>
                重试
              </Button>
            }
          />
        </div>
      );
    }
    return this.props.children;
  }
}