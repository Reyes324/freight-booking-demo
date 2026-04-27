'use client';

import { useState } from 'react';
import { Input, Modal } from 'antd';
import { mockUserProfile } from '@/data/mockData';
import { useT } from '@/hooks/useT';

export default function ProfilePage() {
  const t = useT();
  const [profile, setProfile] = useState(mockUserProfile);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // 隐藏手机号中间部分
  const maskedPhone = profile.phone.replace(/(\+\d{3}\s\d{2})(\d{6})(\d{2})/, '$1*****$3');

  // 隐藏邮箱中间部分
  const maskedEmail = profile.email.replace(/(.{1})(.*)(@.*)/, '$1******$3');

  const handleChangePassword = () => {
    Modal.info({
      title: t.settings.profile.changePassword,
      content: t.settings.profile.editPhoneDesc,
    });
  };

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: t.settings.profile.deleteAccount,
      content: t.settings.profile.deleteConfirm,
      okText: t.settings.profile.deleteConfirmOk,
      cancelText: t.settings.profile.cancel,
      okButtonProps: { danger: true },
      onOk() {
        console.log('删除账户');
      },
    });
  };

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-6">
        {t.settings.profile.title}
      </h1>

      <div className="space-y-6 max-w-2xl">
        {/* 名字 */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            {t.settings.profile.firstName}
          </label>
          <Input
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            placeholder={t.settings.profile.firstNamePlaceholder}
            className="h-11"
          />
        </div>

        {/* 姓氏 */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            {t.settings.profile.lastName}
          </label>
          <Input
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            placeholder={t.settings.profile.lastNamePlaceholder}
            className="h-11"
          />
        </div>

        {/* 电话号码 */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            {t.settings.profile.phone}
          </label>
          <div className="flex items-center gap-3">
            <span className="flex-1 text-gray-900">{maskedPhone}</span>
            <button
              onClick={() => setShowPhoneModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
            >
              {t.settings.profile.edit}
            </button>
          </div>
        </div>

        {/* 邮箱 */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            {t.settings.profile.email}
          </label>
          <div className="flex items-center gap-3">
            <span className="flex-1 text-gray-900">{maskedEmail}</span>
            <button
              onClick={() => setShowEmailModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
            >
              {t.settings.profile.edit}
            </button>
          </div>
        </div>

        {/* 修改密码 */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm text-gray-700 mb-2">
            {t.settings.profile.password}
          </label>
          <div className="flex items-center gap-3">
            <span className="flex-1 text-gray-900">••••••••</span>
            <button
              onClick={handleChangePassword}
              className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
            >
              {t.settings.profile.changePassword}
            </button>
          </div>
        </div>

        {/* 删除账户 */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm text-gray-700 mb-2">
            {t.settings.profile.account}
          </label>
          <div className="flex items-center gap-3">
            <span className="flex-1"></span>
            <button
              onClick={handleDeleteAccount}
              className="text-red-600 hover:text-red-700 text-sm cursor-pointer"
            >
              {t.settings.profile.deleteAccount}
            </button>
          </div>
        </div>
      </div>

      {/* 编辑手机号模态框 */}
      <Modal
        title={t.settings.profile.editPhoneTitle}
        open={showPhoneModal}
        onCancel={() => setShowPhoneModal(false)}
        footer={null}
      >
        <p className="text-gray-600">{t.settings.profile.editPhoneDesc}</p>
      </Modal>

      {/* 编辑邮箱模态框 */}
      <Modal
        title={t.settings.profile.editEmailTitle}
        open={showEmailModal}
        onCancel={() => setShowEmailModal(false)}
        footer={null}
      >
        <p className="text-gray-600">{t.settings.profile.editEmailDesc}</p>
      </Modal>
    </div>
  );
}
