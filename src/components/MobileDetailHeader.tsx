'use client';

import { useRouter } from 'next/navigation';

interface MobileDetailHeaderProps {
  title: string;
  onBack?: () => void;
}

/** 二级页通用头部：返回箭头（左）+ 居中标题。仅用于移动端二级页，不带 Tab 栏。 */
export default function MobileDetailHeader({ title, onBack }: MobileDetailHeaderProps) {
  const router = useRouter();

  return (
    <div
      className="sticky top-0 z-10 h-14 flex items-center justify-center bg-white border-b border-gray-100 px-4"
      style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.04)' }}
    >
      <button
        onClick={onBack ?? (() => router.back())}
        className="absolute left-1 w-11 h-11 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
    </div>
  );
}
