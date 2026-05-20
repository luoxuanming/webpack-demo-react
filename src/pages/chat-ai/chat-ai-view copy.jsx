// src/pages/ai/index.jsx
// AI 对话页面

import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Spin, message, Tooltip } from 'antd';
import {
  SendOutlined,
  DeleteOutlined,
  RobotOutlined,
  UserOutlined,
  PlusOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import './index.css';

const { TextArea } = Input;

// 后端地址，本地开发用 localhost，部署后改成服务器地址
const API_BASE = 'http://localhost:3001/api/chat';

export default function AiChat() {
  const [sessionId, setSessionId] = useState(null);   // 当前会话 ID
  const [messages, setMessages] = useState([]);        // 消息列表
  const [input, setInput] = useState('');              // 输入框内容
  const [loading, setLoading] = useState(false);       // 是否正在等待 AI 回复
  const [streamText, setStreamText] = useState('');    // 流式输出的实时文字
  const [initializing, setInitializing] = useState(true); // 是否正在初始化
  const messagesEndRef = useRef(null);                 // 用于自动滚动到底部

  // ── 初始化：自动创建一个会话 ──
  useEffect(() => {
    createSession();
  }, []);

  // ── 消息更新时，自动滚动到底部 ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamText]);

  // 创建新会话
  async function createSession() {
    try {
      setInitializing(true);
      setMessages([]);
      setStreamText('');
      const res = await axios.post(`${API_BASE}/session`);
      setSessionId(res.data.sessionId);
    } catch (err) {
      message.error('创建会话失败，请检查后端服务是否启动');
    } finally {
      setInitializing(false);
    }
  }

  // 发送消息
  async function sendMessage() {
    const text = input.trim();
    if (!text || loading || !sessionId) return;

    // 立即把用户消息显示出来
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setStreamText('');

    try {
      // 调用流式接口
      const response = await fetch(`${API_BASE}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: text }),
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      // 逐块读取流式数据
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value).split('\n');
        for (const line of lines) {
          if (line === 'data: [DONE]') break;
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.error) throw new Error(data.error);
              if (data.text) {
                fullText += data.text;
                setStreamText(fullText); // 实时更新打字机效果
              }
            } catch (_) {}
          }
        }
      }

      // 流式结束，把完整回复加入消息列表
      setMessages(prev => [...prev, { role: 'assistant', content: fullText }]);
      setStreamText('');

    } catch (err) {
      message.error('发送失败，请稍后重试');
      // 如果发送失败，把用户消息从列表中移除
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  // 清空会话，开始新对话
  async function handleNewChat() {
    if (loading) return;
    try {
      if (sessionId) {
        await axios.delete(`${API_BASE}/session/${sessionId}`);
      }
      await createSession();
      message.success('已开启新对话');
    } catch {
      message.error('操作失败，请重试');
    }
  }

  // 按 Enter 发送，Shift+Enter 换行
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // ── 渲染单条消息 ──
  function MessageItem({ msg }) {
    const isUser = msg.role === 'user';
    return (
      <div className={`msg-row ${isUser ? 'msg-row--user' : 'msg-row--ai'}`}>
        {/* 头像 */}
        <div className={`msg-avatar ${isUser ? 'msg-avatar--user' : 'msg-avatar--ai'}`}>
          {isUser ? <UserOutlined /> : <RobotOutlined />}
        </div>
        {/* 气泡 */}
        <div className={`msg-bubble ${isUser ? 'msg-bubble--user' : 'msg-bubble--ai'}`}>
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="ai-chat">
      {/* ── 顶部标题栏 ── */}
      <div className="ai-chat__header">
        <div className="ai-chat__title">
          <RobotOutlined className="ai-chat__title-icon" />
          <span>AI 助手</span>
        </div>
        <Tooltip title="开启新对话">
          <Button
            icon={<PlusOutlined />}
            onClick={handleNewChat}
            disabled={loading}
            className="ai-chat__new-btn"
          >
            新对话
          </Button>
        </Tooltip>
      </div>

      {/* ── 消息区域 ── */}
      <div className="ai-chat__messages">
        {initializing ? (
          <div className="ai-chat__empty">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            <p>正在初始化...</p>
          </div>
        ) : messages.length === 0 && !streamText ? (
          // 空状态提示
          <div className="ai-chat__empty">
            <RobotOutlined className="ai-chat__empty-icon" />
            <p className="ai-chat__empty-title">你好！我是 AI 助手</p>
            <p className="ai-chat__empty-subtitle">有什么我可以帮到你的吗？</p>
            <div className="ai-chat__suggestions">
              {['帮我写一段 JavaScript 代码', '解释一下什么是 RESTful API', '如何学好前端开发？'].map(s => (
                <div
                  key={s}
                  className="ai-chat__suggestion"
                  onClick={() => { setInput(s); }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageItem key={i} msg={msg} />
            ))}
            {/* 流式输出中的 AI 消息（打字机效果） */}
            {streamText && (
              <div className="msg-row msg-row--ai">
                <div className="msg-avatar msg-avatar--ai">
                  <RobotOutlined />
                </div>
                <div className="msg-bubble msg-bubble--ai">
                  {streamText}
                  <span className="msg-cursor">▌</span>
                </div>
              </div>
            )}
            {/* loading 状态：等待 AI 开始回复 */}
            {loading && !streamText && (
              <div className="msg-row msg-row--ai">
                <div className="msg-avatar msg-avatar--ai">
                  <RobotOutlined />
                </div>
                <div className="msg-bubble msg-bubble--ai msg-bubble--loading">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── 输入区域 ── */}
      <div className="ai-chat__input-area">
        <TextArea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息，Enter 发送，Shift+Enter 换行..."
          autoSize={{ minRows: 1, maxRows: 5 }}
          disabled={loading || initializing}
          className="ai-chat__textarea"
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={sendMessage}
          loading={loading}
          disabled={!input.trim() || initializing}
          className="ai-chat__send-btn"
        >
          发送
        </Button>
      </div>
    </div>
  );
}