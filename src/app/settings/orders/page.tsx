'use client';

import { useState } from 'react';
import { Switch, Modal } from 'antd';
import { mockOrderSettings } from '@/data/mockData';
import { useT } from '@/hooks/useT';

export default function OrdersPage() {
  const t = useT();
  const [settings, setSettings] = useState(mockOrderSettings);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // 隐藏邮箱中间部分
  const maskedEmail = settings.receiptEmail.replace(/(.{1})(.*)(@.*)/, '$1******$3');

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-6">
        {t.settings.orders.title}
      </h1>

      <div className="space-y-8 max-w-2xl">
        {/* 电子收据 */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                {t.settings.orders.receipt}
              </h3>
              <p className="text-sm text-gray-500">
                {t.settings.orders.receiptDesc}
              </p>
            </div>
            <Switch
              checked={settings.electronicReceipt}
              onChange={(checked) =>
                setSettings({ ...settings, electronicReceipt: checked })
              }
            />
          </div>
        </div>

        {/* 接收收据的邮箱 */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            {t.settings.orders.receiptEmail}
          </label>
          <div className="flex items-center gap-3">
            <span className="flex-1 text-sm text-gray-900">{maskedEmail}</span>
            <button
              onClick={() => setShowEmailModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
            >
              {t.settings.orders.edit}
            </button>
          </div>
        </div>

        {/* 配送证明 */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                {t.settings.orders.deliveryProof}
              </h3>
              <p className="text-sm text-gray-500">
                {t.settings.orders.deliveryProofDesc}
              </p>
            </div>
            <Switch
              checked={settings.deliveryProof}
              onChange={(checked) =>
                setSettings({ ...settings, deliveryProof: checked })
              }
            />
          </div>
        </div>
      </div>

      {/* 编辑邮箱模态框 */}
      <Modal
        title={t.settings.orders.editEmailTitle}
        open={showEmailModal}
        onCancel={() => setShowEmailModal(false)}
        footer={null}
      >
        <p className="text-gray-600">{t.settings.orders.editEmailDesc}</p>
      </Modal>
    </div>
  );
}
