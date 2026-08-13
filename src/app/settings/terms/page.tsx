'use client';

import { useT } from '@/hooks/useT';
import MobileDetailHeader from '@/components/MobileDetailHeader';
import LegalDocument, { type LegalDoc } from '@/components/LegalDocument';
import termsData from '@/data/legal/terms.json';
import privacyData from '@/data/legal/privacy.json';

const terms = termsData as LegalDoc;
const privacy = privacyData as LegalDoc;

export default function TermsPage() {
  const t = useT();

  return (
    <div className="min-h-screen bg-white lg:bg-transparent lg:min-h-0">
      <div className="lg:hidden">
        <MobileDetailHeader title={t.settings.terms.title} />
      </div>

      {/* max-w-2xl 会被 globals.css 里未分层的 `* { max-width:100% }` 吃掉，改用内联 style 绕开 */}
      <div className="mx-auto px-4 py-6 lg:px-12 lg:py-12 space-y-12" style={{ maxWidth: 800 }}>
        <LegalDocument doc={terms} id="user-agreement" />
        <LegalDocument doc={privacy} id="privacy-policy" />
      </div>
    </div>
  );
}
