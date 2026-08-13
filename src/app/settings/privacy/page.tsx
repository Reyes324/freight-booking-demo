'use client';

import { useT } from '@/hooks/useT';
import MobileDetailHeader from '@/components/MobileDetailHeader';
import LegalDocument, { type LegalDoc } from '@/components/LegalDocument';
import privacyData from '@/data/legal/privacy.json';

const privacy = privacyData as LegalDoc;

export default function PrivacyPage() {
  const t = useT();

  return (
    <div className="min-h-screen bg-white lg:bg-transparent lg:min-h-0">
      <div className="lg:hidden">
        <MobileDetailHeader title={t.settings.terms.privacyPolicy} />
      </div>

      {/* max-w-2xl 会被 globals.css 里未分层的 `* { max-width:100% }` 吃掉，改用内联 style 绕开 */}
      <div className="mx-auto px-4 py-6 lg:px-12 lg:py-12" style={{ maxWidth: 800 }}>
        <LegalDocument doc={privacy} />
      </div>
    </div>
  );
}
