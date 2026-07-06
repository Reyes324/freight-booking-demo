'use client';

interface MobileListRowProps {
  label: string;
  value?: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
  /** 右侧内容自带链接/按钮样式时（如蓝色文字链），不需要再显示箭头 */
  hideChevron?: boolean;
}

/**
 * 移动端列表行：左侧文案 + 右侧可选内容/箭头。配合 MobileListGroup 使用。
 * 不传 onClick 时渲染为纯展示行（无箭头、无点击态），传了才是可交互按钮。
 */
export default function MobileListRow({ label, value, danger, onClick, hideChevron }: MobileListRowProps) {
  const Tag = onClick ? 'button' : 'div';
  const showChevron = !!onClick && !danger && !hideChevron;

  return (
    <Tag
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 h-[52px] bg-white text-left ${
        onClick ? 'active:bg-gray-50 transition-colors cursor-pointer' : ''
      } ${danger ? 'text-red-500' : 'text-gray-900'}`}
    >
      <span className="text-sm">{label}</span>
      <span className="flex items-center gap-1 text-sm text-gray-400">
        {value}
        {showChevron && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </span>
    </Tag>
  );
}
