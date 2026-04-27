'use client';

import { useT } from '@/hooks/useT';

export default function TermsPage() {
  const t = useT();

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-6">
        {t.settings.terms.title}
      </h1>

      <div className="max-w-2xl space-y-6">
        <section>
          <h2 className="text-sm font-medium text-gray-900 mb-2">
            {t.settings.terms.termsOfService}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            {t.settings.terms.termsContent}
          </p>
        </section>

        <section className="pt-6 border-t border-gray-200">
          <h2 className="text-sm font-medium text-gray-900 mb-2">
            {t.settings.terms.privacyPolicy}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            {t.settings.terms.privacyContent}
          </p>
        </section>

        <section className="pt-6 border-t border-gray-200">
          <h2 className="text-sm font-medium text-gray-900 mb-2">
            {t.settings.terms.userAgreement}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            {t.settings.terms.userContent}
          </p>
        </section>
      </div>
    </div>
  );
}
