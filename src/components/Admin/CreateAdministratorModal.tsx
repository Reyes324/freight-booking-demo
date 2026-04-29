/**
 * 创建管理员弹窗组件
 */

'use client';

import { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import type { AdminRole, CreateAdministratorData } from '@/types/auth';
import { createAdministrator, validateUsername } from '@/utils/administratorManagement';

interface CreateAdministratorModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  creatorId: string; // 当前登录管理员的 ID
}

export default function CreateAdministratorModal({
  open,
  onCancel,
  onSuccess,
  creatorId,
}: CreateAdministratorModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const data: CreateAdministratorData = {
        username: values.username,
        password: values.password,
        role: values.role,
        name: values.name,
      };

      const result = createAdministrator(data, creatorId);

      if (result.success) {
        message.success('管理员创建成功');
        form.resetFields();
        onSuccess();
      } else {
        message.error(result.error || '创建失败');
      }
    } catch (error) {
      // 表单验证失败
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="创建运营账号"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="创建"
      cancelText="取消"
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        initialValues={{ role: 'admin' }}
      >
        <Form.Item
          label="姓名"
          name="name"
          rules={[
            { required: true, message: '请输入姓名' },
            { min: 2, max: 20, message: '姓名长度应为 2-20 位' },
            {
              validator: (_, value: string) => {
                if (value && /\p{Emoji_Presentation}/u.test(value)) {
                  return Promise.reject('不能包含表情符号');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>

        <Form.Item
          label="账号"
          name="username"
          rules={[
            { required: true, message: '请输入账号' },
            {
              pattern: /^[a-zA-Z0-9]{4,20}$/,
              message: '账号仅允许字母和数字，4-20位',
            },
            {
              validator: async (_, value) => {
                if (value && !validateUsername(value)) {
                  throw new Error('账号已存在');
                }
              },
            },
          ]}
          validateTrigger="onBlur"
        >
          <Input placeholder="登录账号（字母或数字，4-20位）" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, max: 20, message: '密码长度应为 6-20 位' },
            {
              pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
              message: '密码必须包含字母和数字',
            },
            {
              validator: (_, value: string) => {
                if (!value) return Promise.resolve();
                if (/[一-鿿㐀-䶿]/.test(value)) {
                  return Promise.reject('密码不能包含汉字');
                }
                if (/\p{Emoji_Presentation}/u.test(value)) {
                  return Promise.reject('密码不能包含表情符号');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password placeholder="密码（6-20位，包含字母和数字）" />
        </Form.Item>

        {/* 角色固定为普通管理员，不显示选择 */}
        <Form.Item name="role" hidden initialValue="admin">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
