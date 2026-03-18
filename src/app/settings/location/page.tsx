'use client';

import { useState } from 'react';
import { Select, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { mockUserProfile } from '@/data/mockData';

const cityOptions = [
  { label: '香港', value: 'hongkong' },
  { label: '深圳', value: 'shenzhen' },
  { label: '广州', value: 'guangzhou' },
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
];

const languageOptions = [
  { label: '中文', value: 'zh' },
  { label: 'English', value: 'en' },
];

export default function LocationPage() {
  const [city, setCity] = useState(mockUserProfile.city);
  const [language, setLanguage] = useState<'zh' | 'en'>(mockUserProfile.language);

  const handleLanguageChange = (e: RadioChangeEvent) => {
    setLanguage(e.target.value);
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        位置和语言
      </h1>

      <div className="space-y-6 max-w-2xl">
        {/* 城市选择 */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            城市
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
            语言
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
