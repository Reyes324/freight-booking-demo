'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { accountPresets } from '@/data/mockData';

// i18n 翻译对象
const i18n = {
  zh: {
    langLabel: '中文',
    formTitle: '登录账户',
    labelPhone: '手机号',
    phonePlaceholder: '请输入手机号',
    labelPwd: '密码',
    pwdPlaceholder: '请输入密码',
    btnSubmit: '登录',
    contactTitle: '还没有账户？',
    contactBody: '请联系运营人员申请开通账户：',
    formFooter: '登录即表示您同意货拉拉的服务条款及隐私政策',
  },
  en: {
    langLabel: 'English',
    formTitle: 'Sign In',
    labelPhone: 'Phone Number',
    phonePlaceholder: 'Enter phone number',
    labelPwd: 'Password',
    pwdPlaceholder: 'Enter password',
    btnSubmit: 'Sign In',
    contactTitle: 'No account?',
    contactBody: 'Contact our operations team to apply:',
    formFooter: "By signing in, you agree to Lalamove's Terms of Service and Privacy Policy",
  },
  id: {
    langLabel: 'Indonesia',
    formTitle: 'Masuk',
    labelPhone: 'Nomor Telepon',
    phonePlaceholder: 'Masukkan nomor telepon',
    labelPwd: 'Kata Sandi',
    pwdPlaceholder: 'Masukkan kata sandi',
    btnSubmit: 'Masuk',
    contactTitle: 'Belum punya akun?',
    contactBody: 'Hubungi tim operasional kami:',
    formFooter: 'Dengan masuk, Anda menyetujui Syarat Layanan Lalamove',
  },
  vi: {
    langLabel: 'Tiếng Việt',
    formTitle: 'Đăng Nhập',
    labelPhone: 'Số Điện Thoại',
    phonePlaceholder: 'Nhập số điện thoại',
    labelPwd: 'Mật Khẩu',
    pwdPlaceholder: 'Nhập mật khẩu',
    btnSubmit: 'Đăng Nhập',
    contactTitle: 'Chưa có tài khoản?',
    contactBody: 'Liên hệ bộ phận vận hành để đăng ký:',
    formFooter: 'Đăng nhập đồng nghĩa với việc bạn đồng ý với Điều khoản của Lalamove',
  },
  ms: {
    langLabel: 'Melayu',
    formTitle: 'Log Masuk',
    labelPhone: 'Nombor Telefon',
    phonePlaceholder: 'Masukkan nombor telefon',
    labelPwd: 'Kata Laluan',
    pwdPlaceholder: 'Masukkan kata laluan',
    btnSubmit: 'Log Masuk',
    contactTitle: 'Tiada akaun?',
    contactBody: 'Hubungi pasukan operasi kami:',
    formFooter: 'Dengan log masuk, anda bersetuju dengan Terma Perkhidmatan Lalamove',
  },
  th: {
    langLabel: 'ภาษาไทย',
    formTitle: 'เข้าสู่ระบบ',
    labelPhone: 'หมายเลขโทรศัพท์',
    phonePlaceholder: 'กรอกหมายเลขโทรศัพท์',
    labelPwd: 'รหัสผ่าน',
    pwdPlaceholder: 'กรอกรหัสผ่าน',
    btnSubmit: 'เข้าสู่ระบบ',
    contactTitle: 'ยังไม่มีบัญชี?',
    contactBody: 'ติดต่อทีมปฏิบัติการเพื่อสมัคร:',
    formFooter: 'การเข้าสู่ระบบหมายความว่าคุณยอมรับข้อกำหนดของ Lalamove',
  },
};

type Language = 'zh' | 'en';

// Demo 演示角色（母子账号原型用，对应 accountPresets 的 key）
type DemoRole = 'parent' | 'childVN' | 'childTH';
const demoRoleLabels: Record<DemoRole, { zh: string; en: string }> = {
  parent: { zh: '母账号管理员', en: 'Parent admin' },
  childVN: { zh: '越南子账号', en: 'Vietnam sub' },
  childTH: { zh: '泰国子账号', en: 'Thailand sub' },
};

export default function LoginPage() {
  const router = useRouter();

  const [isDesignMode, setIsDesignMode] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('zh');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [phoneError] = useState('');
  const [passwordError] = useState('');
  const [demoRole, setDemoRole] = useState<DemoRole>('parent');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage === 'zh' || savedLanguage === 'en') {
      setCurrentLang(savedLanguage as Language);
    }
    const params = new URLSearchParams(window.location.search);
    const designMode = params.get('designMode') === 'true';
    setIsDesignMode(designMode);
    if (designMode) setLangDropdownOpen(true);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isDesignMode) return;
      const target = e.target as HTMLElement;
      if (!target.closest('.lang-bar')) setLangDropdownOpen(false);
      if (!target.closest('.role-bar')) setRoleDropdownOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isDesignMode]);

  const applyLang = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('appLanguage', lang);
    if (!isDesignMode) setLangDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentAccount', JSON.stringify(accountPresets[demoRole]));
      router.push('/');
    }, 800);
  };

  const t = i18n[currentLang];

  return (
    <div>
      {/* 预加载背景图，避免 CSS background-image 延迟 */}
      <link rel="preload" as="image" href="/login-bg.png" />

      {/* Demo 角色切换（左下角浮动，仅原型演示用） */}
      <div className="role-bar">
        <div
          className="role-trigger"
          onClick={(e) => { e.stopPropagation(); setRoleDropdownOpen(!roleDropdownOpen); }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{currentLang === 'zh' ? '演示角色' : 'Demo'}：{demoRoleLabels[demoRole][currentLang]}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        {roleDropdownOpen && (
          <div className="role-dropdown">
            {(Object.keys(demoRoleLabels) as DemoRole[]).map((role) => (
              <div
                key={role}
                className={`role-option ${demoRole === role ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setDemoRole(role); setRoleDropdownOpen(false); }}
              >
                {demoRoleLabels[role][currentLang]}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 语言切换（右上角固定） */}
      <div className="lang-bar">
        <div
          className="lang-trigger"
          onClick={(e) => { e.stopPropagation(); if (!isDesignMode) setLangDropdownOpen(!langDropdownOpen); }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 1C8 1 5.5 4 5.5 8S8 15 8 15M8 1C8 1 10.5 4 10.5 8S8 15 8 15M1.5 8h13" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span>{t.langLabel}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        {langDropdownOpen && (
          <div className="lang-dropdown">
            {(['zh', 'en'] as Language[]).map((lang) => (
              <div
                key={lang}
                className={`lang-option ${currentLang === lang ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); applyLang(lang); }}
              >
                <span className="flag">{lang === 'zh' ? '🇨🇳' : '🌏'}</span>
                {i18n[lang].langLabel}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 页面主体 — 全屏背景图 */}
      <div className="page">
        {/* Logo 居中顶部 — 单张图片（LALAMOVE + 分隔线 + 货拉拉·企业国际版） */}
        <img
          src="/login-logo.png"
          alt="LALAMOVE 货拉拉·企业国际版"
          className="page-logo-img"
          fetchPriority="high"
        />

        {/* 登录卡片 */}
        <div className="login-card">
          <h1 className="form-title">{t.formTitle}</h1>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="field-label">{t.labelPhone}</label>
              <div className="phone-row">
                <div className="cc-wrapper">
                  <select className="cc-select">
                    <option value="+66">🇹🇭 +66</option>
                    <option value="+84">🇻🇳 +84</option>
                    <option value="+60">🇲🇾 +60</option>
                    <option value="+62">🇮🇩 +62</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+63">🇵🇭 +63</option>
                    <option value="+852">🇭🇰 +852</option>
                  </select>
                  <svg className="cc-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <input
                  type="tel"
                  value={phoneValue}
                  onChange={(e) => setPhoneValue(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  autoComplete="tel"
                  className={phoneError ? 'input-error' : ''}
                />
              </div>
              {phoneError && <div className="field-error">{phoneError}</div>}
            </div>

            <div className="field">
              <label className="field-label">{t.labelPwd}</label>
              <div className="pwd-wrapper">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  placeholder={t.pwdPlaceholder}
                  autoComplete="current-password"
                  className={passwordError ? 'input-error' : ''}
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M2 2L18 18M7.9 7.9A2.5 2.5 0 0 0 12.1 12.1M5.6 5.6C3.3 7 1.8 9.4 1.8 10c0 0 3.5 6.5 8.2 6.5a7.4 7.4 0 0 0 3.6-.9M10 3.5c.7 0 1.4.1 2 .3C14.8 5 17 7.8 18.2 10c-.5 1.1-1.3 2.3-2.3 3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M1 10C1 10 4.5 3.5 10 3.5S19 10 19 10 15.5 16.5 10 16.5 1 10 1 10z" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && <div className="field-error">{passwordError}</div>}
            </div>

            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? '···' : t.btnSubmit}
            </button>
          </form>

          <div className="contact-note">
            <strong>{t.contactTitle}</strong><br/>
            <span>{t.contactBody}</span>
            <a href="mailto:nora.xiang@huolala.cn">nora.xiang@huolala.cn</a>
          </div>

          <p className="form-footer">{t.formFooter}</p>
        </div>
      </div>

      <style jsx global>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
          height: 100%;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont,
                       'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* ── 语言切换（右上角） ── */
        .lang-bar {
          position: fixed; top: 20px; right: 24px; z-index: 200;
        }
        .lang-trigger {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 13px;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.55);
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.10);
          cursor: pointer; font-size: 13px; font-weight: 500;
          color: #0F1229; transition: background .15s; user-select: none;
        }
        .lang-trigger:hover { background: rgba(255,255,255,0.96); }
        .lang-dropdown {
          position: absolute; top: calc(100% + 6px); right: 0;
          background: #FFFFFF; border: 1px solid #E2E8F0;
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          overflow: hidden; min-width: 150px;
        }
        .lang-option {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px; font-size: 13px; color: #0F1229;
          cursor: pointer; transition: background .1s;
          border-bottom: 1px solid #E2E8F0;
        }
        .lang-option:last-child { border-bottom: none; }
        .lang-option:hover { background: #F8FAFC; }
        .lang-option.active { color: #2257D4; font-weight: 500; }
        .lang-option .flag { font-size: 16px; }

        /* ── Demo 角色切换（右下角） ── */
        .role-bar {
          position: fixed; bottom: 24px; right: 24px; z-index: 200;
        }
        .role-trigger {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 13px;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px dashed rgba(0,0,0,0.22);
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.10);
          cursor: pointer; font-size: 13px; font-weight: 500;
          color: #475569; transition: all .15s; user-select: none; white-space: nowrap;
        }
        .role-trigger:hover { color: #0F1229; border-color: #2257D4; }
        .role-dropdown {
          position: absolute; bottom: calc(100% + 6px); right: 0;
          background: #FFFFFF; border: 1px solid #E2E8F0;
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          overflow: hidden; min-width: 170px;
        }
        .role-option {
          display: flex; align-items: center;
          padding: 10px 16px; font-size: 13px; color: #0F1229;
          cursor: pointer; transition: background .1s;
          border-bottom: 1px solid #E2E8F0;
        }
        .role-option:last-child { border-bottom: none; }
        .role-option:hover { background: #F8FAFC; }
        .role-option.active { color: #2257D4; font-weight: 500; }

        /* ── 页面容器 — 全屏背景图 ── */
        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 16px 140px;
          gap: 24px;
          background-image: url('/login-bg.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-color: #D0E6F8;
        }

        /* ── Logo 居中顶部 ── */
        .page-logo-img {
          height: 38px;
          width: auto;
          display: block;
        }

        /* ── 登录卡片 ── */
        .login-card {
          background: #FFFFFF;
          border-radius: 28px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.07);
          padding: 44px 40px;
          width: 100%;
          max-width: 420px;
        }

        /* ── 标题 ── */
        .form-title {
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -0.3px;
          color: #0F172A;
          margin-bottom: 28px;
          line-height: 1.2;
        }

        /* ── 字段 ── */
        .field { margin-bottom: 20px; }
        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #0F172A;
          margin-bottom: 7px;
        }
        .field-error {
          margin-top: 6px;
          font-size: 12px;
          color: #EF4444;
          line-height: 1.4;
        }
        input.input-error, .pwd-wrapper:has(input.input-error) {
          border-color: #EF4444 !important;
        }
        .phone-row { display: flex; gap: 8px; }

        .cc-wrapper { position: relative; flex-shrink: 0; }
        .cc-select {
          appearance: none; -webkit-appearance: none;
          height: 44px;
          padding: 0 30px 0 14px;
          background: #F8FAFC; border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-family: inherit; font-size: 14px; color: #0F172A;
          cursor: pointer; outline: none; width: 108px;
          transition: border-color .15s, box-shadow .15s;
        }
        .cc-select:focus {
          border-color: #2257D4;
          box-shadow: 0 0 0 3px rgba(34,87,212,.12);
        }
        .cc-arrow {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          pointer-events: none; color: #94A3B8;
        }

        input[type="tel"], input[type="password"], input[type="text"] {
          width: 100%; height: 44px;
          padding: 0 14px;
          background: #F8FAFC; border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-family: inherit; font-size: 14px; color: #0F172A;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        input::placeholder { color: #94A3B8; }
        input:focus {
          border-color: #2257D4;
          box-shadow: 0 0 0 3px rgba(34,87,212,.12);
        }

        .pwd-wrapper { position: relative; }
        .pwd-wrapper input { padding-right: 44px; }
        .pwd-toggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #94A3B8;
          padding: 0; display: flex; transition: color .15s;
        }
        .pwd-toggle:hover { color: #475569; }

        /* ── 登录按钮 ── */
        .btn-submit {
          width: 100%; height: 44px;
          background: #2257D4; color: #FFFFFF;
          border: none; border-radius: 8px;
          font-family: inherit; font-size: 16px; font-weight: 500;
          cursor: pointer; margin-top: 10px;
          box-shadow: 0 1px 3px rgba(34,87,212,.30);
          transition: background .15s, box-shadow .15s;
        }
        .btn-submit:hover:not(:disabled) {
          background: #1C47AC;
          box-shadow: 0 4px 12px rgba(34,87,212,.35);
        }
        .btn-submit:disabled { opacity: .6; cursor: default; }

        /* ── 联系提示 ── */
        .contact-note {
          margin-top: 24px; padding: 14px 16px;
          background: #F8FAFC; border: 1px solid #E2E8F0;
          border-radius: 10px;
          font-size: 12.5px; color: #475569; line-height: 1.7;
        }
        .contact-note a {
          color: #2257D4; text-decoration: none; font-weight: 500;
        }
        .contact-note a:hover { text-decoration: underline; }

        /* ── 底部说明 ── */
        .form-footer {
          margin-top: 18px; font-size: 11.5px; color: #94A3B8; line-height: 1.6;
        }

        /* ── 响应式 ── */
        @media (max-width: 480px) {
          .login-card { border-radius: 20px; padding: 36px 24px; }
          .page { padding: 72px 16px 40px; gap: 18px; }
          .page-logo-img { height: 30px; }
        }
      `}</style>
    </div>
  );
}
