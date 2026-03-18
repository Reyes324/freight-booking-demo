export default function TermsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        条款和政策
      </h1>

      <div className="max-w-2xl space-y-6">
        <section>
          <h2 className="text-sm font-medium text-gray-900 mb-2">
            服务条款
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            服务条款内容待补充...
          </p>
        </section>

        <section className="pt-6 border-t border-gray-200">
          <h2 className="text-sm font-medium text-gray-900 mb-2">
            隐私政策
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            隐私政策内容待补充...
          </p>
        </section>

        <section className="pt-6 border-t border-gray-200">
          <h2 className="text-sm font-medium text-gray-900 mb-2">
            用户协议
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            用户协议内容待补充...
          </p>
        </section>
      </div>
    </div>
  );
}
