/**
 * 编辑运营账号弹窗组件
 */

'use client';

import { useState, useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import type { Administrator } from '@/types/auth';
import { updateAdministratorInfo } from '@/utils/administratorManagement';

interface EditAdministratorModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  administrator: Administrator | null;
}

export default function EditAdministratorModal({
  open,
  onCancel,
  onSuccess,
  administrator,
}: EditAdministratorModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && administrator) {
      form.setFieldsValue({
        username: administrator.username,
        name: administrator.name,
      });
    }
  }, [open, administrator, form]);

  const handleSubmit = async () => {
    if (!administrator) return;

    try {
      const values = await form.validateFields();
      setLoading(true);

      const result = updateAdministratorInfo(administrator.id, {
        name: values.name,
        password: values.newPassword,
      });

      if (result.success) {
        message.success('账号信息已更新');
        form.resetFields();
        onSuccess();
      } else {
        message.error(result.error || '更新失败');
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
      title="编辑运营账号"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="保存"
      cancelText="取消"
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="账号"
          name="username"
        >
          <Input disabled className="bg-gray-50" />
        </Form.Item>

        <Form.Item
          label="姓名"
          name="name"
          rules={[
            { required: true, message: '请输入姓名' },
            { min: 2, max: 20, message: '姓名长度应为 2-20 位' },
          ]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>

        <Form.Item
          label="新密码"
          name="newPassword"
          extra="留空则不修改密码"
          rules={[
            { min: 6, max: 20, message: '密码长度应为 6-20 位' },
            {
              pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
              message: '密码必须包含字母和数字',
            },
          ]}
        >
          <Input.Password placeholder="请输入新密码（可选）" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
