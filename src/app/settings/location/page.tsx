'use client';

import { useState } from 'react';
import { Select, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { mockUserProfile } from '@/data/mockData';
import { useT } from '@/hooks/useT';

export default function LocationPage() {
  const t = useT();
  const [city, setCity] = useState(mockUserProfile.city);
  const [language, setLanguage] = useState<'zh' | 'en'>(mockUserProfile.language);

  const cityOptions = [
    { label: t.settings.location.hongkong, value: 'hongkong' },
    { label: t.settings.location.shenzhen, value: 'shenzhen' },
    { label: t.settings.location.guangzhou, value: 'guangzhou' },
    { label: t.settings.location.beijing, value: 'beijing' },
    { label: t.settings.location.shanghai, value: 'shanghai' },
  ];

  const languageOptions = [
    { label: t.settings.location.chinese, value: 'zh' },
    { label: t.settings.location.english, value: 'en' },
  ];

  const handleLanguageChange = (e: RadioChangeEvent) => {
    setLanguage(e.target.value);
  };

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-6">
        {t.settings.location.title}
      </h1>

      <div className="space-y-6 max-w-2xl">
        {/* 城市选择 */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            {t.settings.location.city}
          </label>
          <Select
            value={city}
            onChange={setCity}
            options={cityOptions}
            className="w-full"
          />
        </div>

        {/* 语言选择 */}
        <div className="pt-6 border-t border-gray-200">
          <label className="block text-sm text-gray-700 mb-3">
            {t.settings.location.language}
          </label>
          <Radio.Group
            value={language}
            onChange={handleLanguageChange}
            className="flex flex-col gap-3"
          >
            {languageOptions.map((option) => (
              <Radio
                key={option.value}
                value={option.value}
                className="text-sm"
              >
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </div>
    </div>
  );
}
