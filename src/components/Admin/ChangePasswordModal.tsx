/**
 * 修改密码弹窗组件
 */

'use client';

import { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { changePassword } from '@/utils/adminAuth';

interface ChangePasswordModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  isMandatory?: boolean; // 是否强制修改密码（首次登录）
}

export default function ChangePasswordModal({
  open,
  onCancel,
  onSuccess,
  isMandatory = false,
}: ChangePasswordModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const result = changePassword(values.oldPassword, values.newPassword);

      if (result.success) {
        message.success('密码修改成功');
        form.resetFields();
        onSuccess();
      } else {
        message.error(result.error || '修改密码失败');
      }
    } catch (error) {
      // 表单验证失败
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isMandatory) {
      message.warning('首次登录必须修改密码');
      return;
    }
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isMandatory ? '首次登录，请修改密码' : '修改密码'}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="确认修改"
      cancelText={isMandatory ? undefined : '取消'}
      closable={!isMandatory}
      mask={{ closable: !isMandatory }}
      keyboard={!isMandatory}
      cancelButtonProps={isMandatory ? { style: { display: 'none' } } : undefined}
    >
      {isMandatory && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
          检测到您正在使用初始密码，为了账号安全，请立即修改密码。
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="旧密码"
          name="oldPassword"
          rules={[{ required: true, message: '请输入旧密码' }]}
        >
          <Input.Password placeholder="请输入旧密码" />
        </Form.Item>

        <Form.Item
          label="新密码"
          name="newPassword"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, max: 20, message: '密码长度应为 6-20 位' },
            {
              pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
              message: '密码必须包含字母和数字',
            },
          ]}
        >
          <Input.Password placeholder="6-20位，包含字母和数字" />
        </Form.Item>

        <Form.Item
          label="确认新密码"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
