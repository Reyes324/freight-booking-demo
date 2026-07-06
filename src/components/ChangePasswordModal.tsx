'use client';

import { Form, Input, Modal, App } from 'antd';

const passwordRules = [
  { required: true, message: '请填写新密码' },
  { min: 8, max: 20, message: '密码为 8–20 位' },
  {
    pattern: /^(?=.*[a-zA-Z])(?=.*\d)[^一-龥\u{1F000}-\u{1FFFF}]*$/u,
    message: '须包含字母和数字，不可含汉字或表情符号',
  },
];

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(() => {
      onClose();
      form.resetFields();
      message.success('密码已修改');
    });
  };

  return (
    <Modal
      title="修改登录密码"
      open={open}
      onOk={handleOk}
      onCancel={() => { onClose(); form.resetFields(); }}
      okText="确定"
      cancelText="取消"
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item label="新密码" name="newPassword" rules={passwordRules}>
          <Input.Password placeholder="8–20 位，须包含字母和数字" />
        </Form.Item>
        <Form.Item
          label="确认新密码"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
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
