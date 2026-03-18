'use client';

import { useState } from 'react';
import { Switch } from 'antd';
import { mockNotificationSettings } from '@/data/mockData';

export default function NotificationPage() {
  const [settings, setSettings] = useState(mockNotificationSettings);

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-6">
        通知设置
      </h1>

      <div className="space-y-8 max-w-2xl">
        {/* 优惠和促销通知 */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            优惠和促销通知
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            接收促销、奖励和折扣相关通知
          </p>

          <div className="space-y-4">
            {/* SMS */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">SMS</label>
              <Switch
                checked={settings.promotions.sms}
                onChange={(checked) =>
                  setSettings({
                    ...settings,
                    promotions: { ...settings.promotions, sms: checked },
                  })
                }
              />
            </div>

            {/* 邮件 */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">邮件</label>
              <Switch
                checked={settings.promotions.email}
                onChange={(checked) =>
                  setSettings({
                    ...settings,
                    promotions: { ...settings.promotions, email: checked },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* 运输更新 */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            运输更新
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            接收订单状态和新消息更新
          </p>

          <div className="space-y-4">
            {/* 浏览器通知 */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">
                浏览器通知（仅浏览器）
              </label>
              <Switch
                checked={settings.orderUpdates.browser}
                onChange={(checked) =>
                  setSettings({
                    ...settings,
                    orderUpdates: { ...settings.orderUpdates, browser: checked },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
