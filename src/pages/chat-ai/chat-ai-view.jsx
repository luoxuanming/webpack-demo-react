/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-21 15:25:06
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-06-22 15:50:40
 * @FilePath: /webpack-demo/src/pages/chatAi/index.jsx
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
import styles from './chat-ai.module.less'
import dayjs from 'dayjs'
import { Button, Input, Spin, message, Tooltip, Layout, Dropdown, Space, Avatar, theme } from 'antd';
import {
  SendOutlined,
  DeleteOutlined,
  RobotOutlined,
  UserOutlined,
  MessageOutlined,
  PlusOutlined,
  LoadingOutlined,
  CopyOutlined,
  CheckOutlined,
  DownOutlined,
  SettingOutlined,
  MoreOutlined
} from '@ant-design/icons';
import cx from 'classnames'
// 顶部新增导入
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { chatAiApi } from './chat-ai-server'

const { TextArea } = Input
const { Header, Content, Footer, Sider } = Layout;
const chatAiView = (props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const matches = useMatches()
  const { id } = useParams()
  let data = useLoaderData();

  const { chatAiStore, appStore } = useStore()

  const [dotId, setDotId] = useState('')
  const [sessions, setSessions] = useState([]);   // 当前会话 ID
  const [collapsed, setCollapsed] = useState(false);
  const [sessionId, setSessionId] = useState();   // 当前会话 ID
  const [messages, setMessages] = useState([]);        // 消息列表
  const [input, setInput] = useState('');              // 输入框内容
  const [loading, setLoading] = useState(false);       // 是否正在等待 AI 回复
  const [streamText, setStreamText] = useState('');    // 流式输出的实时文字
  const [initializing, setInitializing] = useState(true); // 是否正在初始化
  const messagesEndRef = useRef(null);                 // 用于自动滚动到底部
  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary, colorBgTextActive, colorBgBase, colorTextLabel},
  } = theme.useToken();
  console.log('token**', theme.useToken());
  
  // const id = searchParams.get('id' )  // id = '2'
  useEffect(() => {
    const currentMatch = matches[matches.length - 1]
    const title = currentMatch?.handle?.title || location.pathname
    getSessions()

  }, [])

  // 消息更新时自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamText]);

  useEffect(() => {
    // createSession()
  }, [])

  // 创建新会话
  async function createSession() {
    try {
      setInitializing(true);
      setMessages([]);
      setStreamText('');
      const res = await chatAiApi.createSession()
      setSessionId(res.data.sessionId);
    } catch (err) {
      message.error('创建会话失败，请检查后端服务是否启动');
    } finally {
      setInitializing(false);
    }
  }

  const getSessions = async () => {
    setLoading(true)
    try {
      // 普通请求
      const {code, data} = await chatAiApi.getSessions({ page: 1, pageSize: 10 })
      if(code == 0) {
        setSessions(data)
        setInitializing(false)
      } else {
        setInitializing(false)
      }
      console.log('data**', data);

      // 带自定义 header 的请求
      // const data2 = await chatAiApi.getListWithHeader('/chatAi/list', { page: 1 })
      // setSessions(data2)
    } catch (error) {
      console.log('error',error);
      message.error('获取会话失败，请重试');
    } finally {
      setLoading(false)
      setInitializing(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // 清空会话，开始新对话
  async function handleNewChat() {
    if (loading) return;
    try {
      // if (sessionId) {
      //   await chatAiApi.deleteSession(sessionId)
      // }
      // await createSession();
      setSessionId(null)
      setMessages([])
      message.success('已开启新对话');
    } catch (error){
      console.log('error',error);
      
      message.error('操作失败，请重试');
    }
    
  }

  function MessageItem({ msg }) {
    const isUser = msg.role === 'user';
    return (
      <div className={`msg-row ${isUser ? 'msg-row--user' : 'msg-row--ai'}`}>
        <div className={`msg-avatar ${isUser ? 'msg-avatar--user' : 'msg-avatar--ai'}`}>
          {isUser ? <UserOutlined /> : <RobotOutlined />}
        </div>
        <div className={`msg-bubble ${isUser ? 'msg-bubble--user' : 'msg-bubble--ai'}`}>
          {isUser ? (
            // 用户消息：纯文本
            msg.content
          ) : (
            // AI 消息：Markdown 渲染
            <ReactMarkdown
              components={{
                // 代码块渲染
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeText = String(children).replace(/\n$/, '');

                  // 每个代码块独立维护复制状态
                  const [copied, setCopied] = useState(false);

                  const handleCopy = () => {
                    navigator.clipboard.writeText(codeText).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000); // 2秒后恢复
                    });
                  };

                  return !inline && match ? (
                    // 代码块容器
                    <div style={{ position: 'relative', margin: '8px 0' }}>
                      {/* 顶部栏：语言标签 + 复制按钮 */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#282c34',
                        padding: '6px 12px',
                        borderRadius: '8px 8px 0 0',
                        fontSize: 12,
                        color: '#abb2bf',
                      }}>
                        {/* 语言标签 */}
                        <span>{match[1]}</span>
                        {/* 复制按钮 */}
                        <span
                          onClick={handleCopy}
                          style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            color: copied ? '#98c379' : '#abb2bf',
                            transition: 'color 0.2s',
                          }}
                        >
                          {copied ? <CheckOutlined /> : <CopyOutlined />}
                          {copied ? '已复制' : '复制'}
                        </span>
                      </div>
                      {/* 代码内容 */}
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          borderRadius: '0 0 8px 8px', // 和顶部栏拼接
                        }}
                        {...props}
                      >
                        {codeText}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code style={{
                      background: '#f0f0f0',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 13,
                      fontFamily: 'monospace',
                    }} {...props}>
                      {children}
                    </code>
                  );
                },
                // 段落去掉默认 margin
                p({ children }) {
                  return <p style={{ margin: '4px 0', lineHeight: 1.7 }}>{children}</p>;
                }
              }}
            >
              {msg.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    );
  }

  // 发送消息
  async function sendMessage() {
    try {
      const text = input.trim();
      if (!text || loading) return;

      // 立即把用户消息显示出来
      const userMsg = { role: 'user', content: text };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setLoading(true);
      setStreamText('');
      // 调用流式接口
      // const response = await chatAiApi.sendMessage({
      //   sessionId,
      //   message: text,
      // }, {
      //   headers: { 'Content-Type': 'application/json' }
      // })
      const token = localStorage.getItem('token')
      let user = localStorage.getItem('user')
      user = user ? JSON.parse(user) : {};
      const response = await fetch('http://localhost:3001/api/chat/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({ sessionId, message: text, email: user.email }),
      });
      // 逐块读取流式数据
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const read = await reader.read()
        const { done, value } = read;
        if (done) break;
        
        const lines = decoder.decode(value).split('\n');
        for (const line of lines) {
          if (line === 'data: [DONE]') break;
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
        
              // 收到 sessionId（新会话第一条消息时）
              if (data.sessionId && !data.text && !data.done) {
                setSessionId(data.sessionId); // 存到状态里，后续消息带上它
              }
        
              // 收到文字内容
              if (data.text) {
                fullText += data.text;
                setStreamText(fullText);
              }
        
              // 收到结束信号
              if (data.done) {
                // 可以在这里刷新左侧会话列表
                getSessions(); // ← 刷新左侧会话列表
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
      console.log('err', err);

      // 如果发送失败，把用户消息从列表中移除
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    message.success('已退出登录');
  }

  const items = [
    {
      key: '1',
      label: '1316570222@qq.com',
      disabled: true,
    },
    {
      type: 'divider',
    },
    // {
    //   key: '2',
    //   label: 'Profile',
    //   extra: '⌘P',
    // },
    // {
    //   key: '3',
    //   label: 'Billing',
    //   extra: '⌘B',
    // },
    // {
    //   key: '4',
    //   label: 'Settings',
    //   icon: <SettingOutlined />,
    //   extra: '⌘S',
    // },
    {
      key: '5',
      label: '退出',
      icon: <SettingOutlined />,
      onClick: handleLogout, 
    },
  ];

  const handleSession = async (sid) => {
    if(sessionId == sid) return;
    if (loading) return;
    try {
      setInitializing(true);
      setMessages([]);
      setStreamText('');
      setSessionId(sid);
  
      const { code, data } = await chatAiApi.getHistory(sid);
      if (code === 0) {
        setMessages(data || []);
      }
    } catch (err) {
      console.log('err', err)
      message.error('加载会话失败，请重试');
    } finally {
      setInitializing(false);
    }
  }

  return (
    <div className={styles.chatPage}>
      {/* ── 顶部标题栏 ── */}
      <Sider collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div className={styles.sideBox}>
          {/* <div className={styles.logoBox}>
            <Avatar style={{ backgroundColor: '#87d068' }} icon={<RobotOutlined />} />
            <span>AI 助手</span>
          </div> */}
          <div className={styles.toolbarBox}>
            <Tooltip title="开启新对话">
              <Button
                type="primary"
                size='small'
                icon={<MessageOutlined />}
                onClick={handleNewChat}
                disabled={loading}
                className="ai-chat__new-btn"
              >
                {t('chatAi.newChat')}
              </Button>
            </Tooltip>
          </div>
          {/* <div>当前会话id:{sessionId}</div> */}
          <div className={styles.sessionListBox}>
            <div className={styles.sessionListTitle}>Recents：{sessions.length}</div>
            <div className={styles.sessionList}>
            {
              sessions?.map((item, index) => (
                <div className={cx(styles.sessionItem, { [styles.active]: sessionId == item.sessionId })} key={item.sessionId} onClick={() => {
                  handleSession(item.sessionId)
                }} style={{
                  background:sessionId == item.sessionId ? colorPrimary : colorBgTextActive,
                  color:sessionId == item.sessionId ? colorBgBase : colorTextLabel,
                  }}>
                  <span className={styles.text}>{item.title}</span>
                  {/* {
                    sessionId == item.sessionId ? <span className={styles.icon}>...</span> : null
                  } */}
                  <div className={cx(styles.icon, { 
                    [styles.active]: sessionId == item.sessionId,
                    [styles.showDot]: item.sessionId == dotId
                    })}>
                    <Dropdown
                    placement="bottomRight"
                      menu={{
                        items: [
                          {
                            label: '删除',
                            key: 'delete',
                            danger: true,
                          },
                          // {
                          //   label: '重命名',
                          //   key: 'rename',
                          // },
                        ],
                        onClick: async({ key }) => {
                          if (key === 'delete') {
                            // 处理删除
                            try {
                              const { code, data } = await chatAiApi.deleteSession(sessionId)
                              if (code === 0) {
                                message.success('成功移除会话');
                                getSessions();
                                setSessionId(null)
                                if(sessionId === item.sessionId) {
                                  setMessages([])
                                }
                              }
                            } catch (error) {
                              message.error('操作失败');
                            }
                            
                          } else if (key === 'rename') {
                            // 处理重命名
                          }
                        },
                      }}
                      trigger={['click']}
                    >
                      <MoreOutlined style={{
                        
                      }} className={styles.dot} onClick={e => {
                        e.stopPropagation();
                        setDotId(item.sessionId)
                      }} />
                    </Dropdown>
                  </div>
                  
                </div>
              ))
            }
            </div>
          </div>
          
          {/* 个人中心 */}
          <div className={styles.userBox}>
            <Dropdown menu={{ items }}>
              <a className={styles.userInfo} onClick={e => e.preventDefault()}>
                <Space>
                  <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                  铭铭就～
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </div>
      </Sider>
      
      <div className={styles.main}>
        {/* ── 消息区域 ── */}
        <div className={styles.messageBox}>
          {initializing ? (
            <div className="ai-chat__empty">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              <p>正在初始化...</p>
            </div>
          ) : !sessionId && !messages?.length ? (
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
                  <div className="msg-avatar msg-avatar--ai"><RobotOutlined /></div>
                  <div className="msg-bubble msg-bubble--ai">
                    <ReactMarkdown
                      components={{
                        code({ inline, className, children }) {
                          return (
                            <code style={{
                              background: '#282c34',
                              color: '#abb2bf',
                              padding: inline ? '2px 6px' : '12px',
                              borderRadius: 6,
                              display: inline ? 'inline' : 'block',
                              fontFamily: 'monospace',
                              fontSize: 13,
                              whiteSpace: 'pre-wrap',
                            }}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {streamText}
                    </ReactMarkdown>
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
        <div className={styles.sendBox}>
          <TextArea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息，Enter 发送，Shift+Enter 换行..."
            autoSize={{ minRows: 1, maxRows: 5 }}
            disabled={loading || initializing}
            className="ai-chat__textarea"
          />
          <div className={styles.toolBox}>
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
      </div>
    </div>
  )
}

export default observer(chatAiView)
