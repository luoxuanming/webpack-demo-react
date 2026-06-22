/*
 * @Author: luoxuanming 1316570222@qq.com
 * @Date: 2026-04-21 15:25:06
 * @LastEditors: luoxuanming 1316570222@qq.com
 * @LastEditTime: 2026-06-22 13:17:02
 * @FilePath: /webpack-demo/src/pages/UserView/index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, {useEffect, useState} from 'react'
import {useOutletContext} from 'react-router'
import {StoreContext} from '@/store/index'
import {
  Table, Button, Switch, InputNumber,
  message, Tag, Space, Modal, Form, Input, Avatar
} from 'antd'
import {
  UserOutlined,
  EditOutlined,
  StopOutlined,
  CheckCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { userApi } from './user-server'

const UserView = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 })
 
  // 修改次数弹窗
  const [quotaModal, setQuotaModal] = useState({ open: false, record: null })
  const [quotaValue, setQuotaValue] = useState(0)
  const [quotaLoading, setQuotaLoading] = useState(false)
 
  useEffect(() => {
    fetchList(1)
  }, [])
 
  // 获取用户列表
  const fetchList = async (page = 1) => {
    setLoading(true)
    try {
      const { code, data, pagination: pg } = await userApi.getUsers({
        page,
        pageSize: pagination.pageSize,
      })
      if (code === 0) {
        setList(data)
        setPagination(prev => ({ ...prev, page, total: pg.total }))
      }
    } catch (err) {
      message.error('获取用户列表失败')
    } finally {
      setLoading(false)
    }
  }
 
  // 禁用/启用用户
  const handleStatusChange = async (record, checked) => {
    const status = checked ? 1 : 0
    const action = checked ? '启用' : '禁用'
    try {
      const { code } = await userApi.updateStatus(record.id, status)
      if (code === 0) {
        message.success(`已${action}用户 ${record.nickname || record.email}`)
        setList(prev =>
          prev.map(item => item.id === record.id ? { ...item, status } : item)
        )
      }
    } catch (err) {
      message.error(`${action}失败`)
    }
  }
 
  // 打开修改次数弹窗
  const openQuotaModal = (record) => {
    setQuotaModal({ open: true, record })
    setQuotaValue(record.quota)
  }
 
  // 确认修改次数
  const handleQuotaConfirm = async () => {
    if (quotaValue < 0) return message.warning('次数不能小于 0')
    setQuotaLoading(true)
    try {
      const { code } = await userApi.updateQuota(quotaModal.record.id, quotaValue)
      if (code === 0) {
        message.success('次数修改成功')
        setList(prev =>
          prev.map(item =>
            item.id === quotaModal.record.id ? { ...item, quota: quotaValue } : item
          )
        )
        setQuotaModal({ open: false, record: null })
      }
    } catch (err) {
      message.error('修改失败')
    } finally {
      setQuotaLoading(false)
    }
  }
 
  const columns = [
    {
      title: '用户',
      dataIndex: 'email',
      render: (email, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#4f6ef7' }} icon={<UserOutlined />} size="small" />
          <div>
            <div style={{ fontWeight: 500, fontSize: 13 }}>
              {record.nickname || '未设置昵称'}
            </div>
            <div style={{ color: '#999', fontSize: 12 }}>{email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 80,
      render: (role) => (
        <Tag color={role === 1 ? 'gold' : 'blue'}>
          {role === 1 ? '管理员' : '普通用户'}
        </Tag>
      ),
    },
    {
      title: '剩余次数',
      dataIndex: 'quota',
      width: 100,
      render: (quota) => (
        <Tag color={quota <= 0 ? 'red' : quota <= 5 ? 'orange' : 'green'}>
          {quota} 次
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status, record) => (
        <Switch
          checked={status === 1}
          checkedChildren="正常"
          unCheckedChildren="禁用"
          onChange={(checked) => handleStatusChange(record, checked)}
          disabled={record.role === 1} // 管理员不能被禁用
        />
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      width: 160,
      render: (val) => dayjs(val).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => (
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => openQuotaModal(record)}
          disabled={record.role === 1}
        >
          修改次数
        </Button>
      ),
    },
  ]
 
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 16, fontWeight: 600 }}>用户管理</span>
        <span style={{ color: '#999', fontSize: 13 }}>共 {pagination.total} 个用户</span>
      </div>
 
      <Table
        rowKey="id"
        columns={columns}
        dataSource={list}
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: false,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page) => fetchList(page),
        }}
      />
 
      {/* 修改次数弹窗 */}
      <Modal
        title={`修改次数 - ${quotaModal.record?.nickname || quotaModal.record?.email}`}
        open={quotaModal.open}
        onOk={handleQuotaConfirm}
        onCancel={() => setQuotaModal({ open: false, record: null })}
        confirmLoading={quotaLoading}
        okText="确认"
        cancelText="取消"
        width={360}
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 8, color: '#666' }}>
            当前剩余：<strong>{quotaModal.record?.quota}</strong> 次
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>设置为：</span>
            <InputNumber
              min={0}
              max={9999}
              value={quotaValue}
              onChange={setQuotaValue}
              style={{ width: 120 }}
              addonAfter="次"
            />
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            {[10, 20, 50, 100].map(n => (
              <Button
                key={n}
                size="small"
                onClick={() => setQuotaValue((quotaModal.record?.quota || 0) + n)}
              >
                +{n}
              </Button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default UserView
