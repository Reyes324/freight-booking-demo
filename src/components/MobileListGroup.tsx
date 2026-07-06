'use client';

import { Children, Fragment, isValidElement } from 'react';

/**
 * 移动端列表分组容器：多个 MobileListRow（或包裹过 MobileListRow 的元素，如 Popconfirm）
 * 共用一张圆角白卡，行之间用分割线隔开，左右各缩进 16px（跟文字对齐，不贴卡片边缘）。
 * 分割线色号用 #EBEFF5（模块分割线专用色），不是通用灰色 token。
 */
export default function MobileListGroup({ children }: { children: React.ReactNode }) {
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <div className="rounded-[8px] overflow-hidden">
      {items.map((child, i) => (
        <Fragment key={child.key ?? i}>
          {i > 0 && <div className="h-px bg-[#EBEFF5] mx-4" />}
          {child}
        </Fragment>
      ))}
    </div>
  );
}
