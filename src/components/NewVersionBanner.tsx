'use client';

import { useEffect } from 'react';
import { Modal } from 'antd';
import { useVersionCheck } from '@/hooks/useVersionCheck';

export default function NewVersionBanner() {
  const hasUpdate = useVersionCheck();

  useEffect(() => {
    if (!hasUpdate) return;
    Modal.confirm({
      title: '系统已更新',
      content: '检测到新版本，刷新页面以获取最新内容。',
      okText: '立即刷新',
      cancelText: '稍后再说',
      onOk: () => window.location.reload(),
      centered: true,
    });
  }, [hasUpdate]);

  return null;
}
