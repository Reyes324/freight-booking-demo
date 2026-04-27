'use client';

import { useState } from 'react';
import { Switch } from 'antd';
import { mockNotificationSettings } from '@/data/mockData';
import { useT } from '@/hooks/useT';

export default function NotificationPage() {
  const t = useT();
  const [settings, setSettings] = useState(mockNotificationSettings);

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-6">
        {t.settings.notification.title}
      </h1>

      <div className="space-y-8 max-w-2xl">
        {/* 优惠和促销通知 */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            {t.settings.notification.promotions}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {t.settings.notification.promotionsDesc}
          </p>

          <div className="space-y-4">
            {/* SMS */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">{t.settings.notification.sms}</label>
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
              <label className="text-sm text-gray-700">{t.settings.notification.email}</label>
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
            {t.settings.notification.orderUpdates}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {t.settings.notification.orderUpdatesDesc}
          </p>

          <div className="space-y-4">
            {/* 浏览器通知 */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">
                {t.settings.notification.browserNotification}
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
