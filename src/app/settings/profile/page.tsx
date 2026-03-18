'use client';

import { useState } from 'react';
import { Input, Modal } from 'antd';
import { mockUserProfile } from '@/data/mockData';

export default function ProfilePage() {
  const [profile, setProfile] = useState(mockUserProfile);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // 隐藏手机号中间部分
  const maskedPhone = profile.phone.replace(/(\+\d{3}\s\d{2})(\d{6})(\d{2})/, '$1*****$3');

  // 隐藏邮箱中间部分
  const maskedEmail = profile.email.replace(/(.{1})(.*)(@.*)/, '$1******$3');

  const handleChangePassword = () => {
    Modal.info({
      title: '修改密码',
      content: '修改密码功能开发中...',
    });
  };

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: '删除账户',
      content: '确定要删除账户吗？此操作无法撤销。',
      okText: '确认删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk() {
        console.log('删除账户');
      },
    });
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        个人资料
      </h1>

      <div className="space-y-6 max-w-2xl">
        {/* 名字 */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            名字
          </label>
          <Input
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            placeholder="请输入名字"
            className="h-11"
          />
        </div>

        {/* 姓氏 */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            姓氏
          </label>
          <Input
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            placeholder="请输入姓氏"
            className="h-11"
          />
        </div>

        {/* 电话号码 */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            电话号码
          </label>
          <div className="flex items-center gap-3">
            <span className="flex-1 text-gray-900">{maskedPhone}</span>
            <button
              onClick={() => setShowPhoneModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
            >
              编辑
            </button>
          </div>
        </div>

        {/* 邮箱 */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            登录邮箱
          </label>
          <div className="flex items-center gap-3">
            <span className="flex-1 text-gray-900">{maskedEmail}</span>
            <button
              onClick={() => setShowEmailModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
            >
              编辑
            </button>
          </div>
        </div>

        {/* 修改密码 */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm text-gray-700 mb-2">
            密码
          </label>
          <div className="flex items-center gap-3">
            <span className="flex-1 text-gray-900">••••••••</span>
            <button
              onClick={handleChangePassword}
              className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
            >
              修改密码
            </button>
          </div>
        </div>

        {/* 删除账户 */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm text-gray-700 mb-2">
            账户
          </label>
          <div className="flex items-center gap-3">
            <span className="flex-1"></span>
            <button
              onClick={handleDeleteAccount}
              className="text-red-600 hover:text-red-700 text-sm cursor-pointer"
            >
              删除账户
            </button>
          </div>
        </div>
      </div>

      {/* 编辑手机号模态框 */}
      <Modal
        title="编辑电话号码"
        open={showPhoneModal}
        onCancel={() => setShowPhoneModal(false)}
        footer={null}
      >
        <p className="text-gray-600">编辑电话号码功能开发中...</p>
      </Modal>

      {/* 编辑邮箱模态框 */}
      <Modal
        title="编辑邮箱"
        open={showEmailModal}
        onCancel={() => setShowEmailModal(false)}
        footer={null}
      >
        <p className="text-gray-600">编辑邮箱功能开发中...</p>
      </Modal>
    </div>
  );
}
