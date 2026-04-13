'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// i18n 翻译对象
const i18n = {
  zh: {
    langLabel: '中文',
    formTitle: '登录账户',
    formSubtitle: '货拉拉企业国际版',
    labelPhone: '手机号',
    phonePlaceholder: '请输入手机号',
    labelPwd: '密码',
    pwdPlaceholder: '请输入密码',
    btnSubmit: '登 录',
    contactTitle: '还没有账户？',
    contactBody: '请联系运营人员申请开通账户：',
    formFooter: '登录即表示您同意货拉拉的服务条款及隐私政策',
    brandHeadline: '连接中国企业<br/>与东南亚市场',
    brandSub: '货运物流叫车平台',
  },
  en: {
    langLabel: 'English',
    formTitle: 'Sign In',
    formSubtitle: 'Lalamove Enterprise International',
    labelPhone: 'Phone Number',
    phonePlaceholder: 'Enter phone number',
    labelPwd: 'Password',
    pwdPlaceholder: 'Enter password',
    btnSubmit: 'Sign In',
    contactTitle: 'No account?',
    contactBody: 'Contact our operations team to apply:',
    formFooter: "By signing in, you agree to Lalamove's Terms of Service and Privacy Policy",
    brandHeadline: 'Connecting Chinese Enterprises<br/>with Southeast Asia',
    brandSub: 'Freight & Logistics On-Demand Platform',
  },
  id: {
    langLabel: 'Indonesia',
    formTitle: 'Masuk',
    formSubtitle: 'Lalamove Enterprise Internasional',
    labelPhone: 'Nomor Telepon',
    phonePlaceholder: 'Masukkan nomor telepon',
    labelPwd: 'Kata Sandi',
    pwdPlaceholder: 'Masukkan kata sandi',
    btnSubmit: 'Masuk',
    contactTitle: 'Belum punya akun?',
    contactBody: 'Hubungi tim operasional kami:',
    formFooter: 'Dengan masuk, Anda menyetujui Syarat Layanan Lalamove',
    brandHeadline: 'Menghubungkan Perusahaan China<br/>dengan Asia Tenggara',
    brandSub: 'Platform logistik lintas batas<br/>untuk perusahaan China',
  },
  vi: {
    langLabel: 'Tiếng Việt',
    formTitle: 'Đăng Nhập',
    formSubtitle: 'Lalamove Enterprise Quốc Tế',
    labelPhone: 'Số Điện Thoại',
    phonePlaceholder: 'Nhập số điện thoại',
    labelPwd: 'Mật Khẩu',
    pwdPlaceholder: 'Nhập mật khẩu',
    btnSubmit: 'Đăng Nhập',
    contactTitle: 'Chưa có tài khoản?',
    contactBody: 'Liên hệ bộ phận vận hành để đăng ký:',
    formFooter: 'Đăng nhập đồng nghĩa với việc bạn đồng ý với Điều khoản của Lalamove',
    brandHeadline: 'Kết Nối Doanh Nghiệp Trung Quốc<br/>với Đông Nam Á',
    brandSub: 'Nền tảng logistics xuyên biên giới<br/>dành cho doanh nghiệp Trung Quốc',
  },
  ms: {
    langLabel: 'Melayu',
    formTitle: 'Log Masuk',
    formSubtitle: 'Lalamove Enterprise Antarabangsa',
    labelPhone: 'Nombor Telefon',
    phonePlaceholder: 'Masukkan nombor telefon',
    labelPwd: 'Kata Laluan',
    pwdPlaceholder: 'Masukkan kata laluan',
    btnSubmit: 'Log Masuk',
    contactTitle: 'Tiada akaun?',
    contactBody: 'Hubungi pasukan operasi kami:',
    formFooter: 'Dengan log masuk, anda bersetuju dengan Terma Perkhidmatan Lalamove',
    brandHeadline: 'Menghubungkan Syarikat China<br/>dengan Asia Tenggara',
    brandSub: 'Platform logistik rentas sempadan<br/>untuk syarikat China',
  },
  th: {
    langLabel: 'ภาษาไทย',
    formTitle: 'เข้าสู่ระบบ',
    formSubtitle: 'Lalamove Enterprise นานาชาติ',
    labelPhone: 'หมายเลขโทรศัพท์',
    phonePlaceholder: 'กรอกหมายเลขโทรศัพท์',
    labelPwd: 'รหัสผ่าน',
    pwdPlaceholder: 'กรอกรหัสผ่าน',
    btnSubmit: 'เข้าสู่ระบบ',
    contactTitle: 'ยังไม่มีบัญชี?',
    contactBody: 'ติดต่อทีมปฏิบัติการเพื่อสมัคร:',
    formFooter: 'การเข้าสู่ระบบหมายความว่าคุณยอมรับข้อกำหนดของ Lalamove',
    brandHeadline: 'เชื่อมต่อบริษัทจีน<br/>กับเอเชียตะวันออกเฉียงใต้',
    brandSub: 'แพลตฟอร์มโลจิสติกส์ข้ามพรมแดน<br/>สำหรับบริษัทจีนในต่างประเทศ',
  },
};

const themeNames = {
  stripe: 'Stripe',
  linear: 'Linear',
  revolut: 'Revolut',
  notion: 'Notion',
  wise: 'Wise',
  apple: 'Apple'
};

type Language = 'zh' | 'en';
type Theme = 'stripe' | 'linear' | 'revolut' | 'notion' | 'wise' | 'apple';

export default function LoginPage() {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState<Language>('zh');
  const [currentTheme, setCurrentTheme] = useState<Theme>('stripe');
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 初始化时从 localStorage 读取应用语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem("appLanguage");
    if (savedLanguage && (savedLanguage === "zh" || savedLanguage === "en")) {
      setCurrentLang(savedLanguage as Language);
    }
  }, []);

  // 关闭下拉菜单（点击外部时）
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // 检查点击是否在语言菜单内
      if (!target.closest('.lang-bar') && !target.closest('.lang-trigger') && !target.closest('.lang-dropdown')) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // 切换语言
  const applyLang = (lang: Language) => {
    setCurrentLang(lang);
    // 如果切换到中英文，同步保存到应用语言设置
    if (lang === 'zh' || lang === 'en') {
      localStorage.setItem("appLanguage", lang);
    }
    setLangDropdownOpen(false);
  };

  // 切换主题
  const applyTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    setThemeDropdownOpen(false);
  };

  // 超简单的登录逻辑 - 任何输入都能成功
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 清除之前的错误
    setPhoneError('');
    setPasswordError('');

    // 验证手机号
    if (!phoneValue.trim()) {
      setPhoneError(currentLang === 'zh' ? '请输入手机号' : 'Please enter phone number');
      return;
    }

    // 验证密码
    if (!passwordValue.trim()) {
      setPasswordError(currentLang === 'zh' ? '请输入密码' : 'Please enter password');
      return;
    }

    setSubmitting(true);

    // 模拟加载
    setTimeout(() => {
      // 设置登录标志
      localStorage.setItem('isLoggedIn', 'true');
      // 跳转到首页
      router.push('/');
    }, 800);
  };

  const t = i18n[currentLang];

  return (
    <div data-theme={currentTheme}>
      {/* Language Switcher */}
      <div className="lang-bar">
        <div
          className="lang-trigger"
          onClick={(e) => {
            e.stopPropagation();
            setLangDropdownOpen(!langDropdownOpen);
            setThemeDropdownOpen(false);
          }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  applyLang(lang);
                }}
              >
                <span className="flag">{getLangFlag(lang)}</span> {i18n[lang].langLabel}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Page */}
      <div className="page">
        <div className="card">
          {/* Brand Panel */}
          <div className="brand-panel">
            {/* 地球装饰 */}
            <svg className="brand-globe" viewBox="0 0 300 300" fill="none">
              <defs>
                <radialGradient id="globe-light" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
                <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="70%" stopColor="rgba(34,87,212,0)" />
                  <stop offset="100%" stopColor="rgba(34,87,212,0.08)" />
                </radialGradient>
              </defs>
              <circle cx="150" cy="150" r="130" fill="url(#globe-glow)" />
              <circle cx="150" cy="150" r="120" fill="url(#globe-light)" />
              <circle cx="150" cy="150" r="120" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" fill="none" />
              <ellipse cx="150" cy="150" rx="25" ry="120" stroke="rgba(255,255,255,0.10)" strokeWidth="0.8" fill="none" />
              <ellipse cx="150" cy="150" rx="55" ry="120" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" fill="none" />
              <ellipse cx="150" cy="150" rx="85" ry="120" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" fill="none" />
              <ellipse cx="150" cy="150" rx="110" ry="120" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" fill="none" />
              <ellipse cx="150" cy="150" rx="120" ry="28" stroke="rgba(255,255,255,0.10)" strokeWidth="0.8" fill="none" />
              <ellipse cx="150" cy="105" rx="108" ry="20" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" fill="none" />
              <ellipse cx="150" cy="195" rx="108" ry="20" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" fill="none" />
              <ellipse cx="150" cy="68" rx="80" ry="14" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" fill="none" />
              <ellipse cx="150" cy="232" rx="80" ry="14" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" fill="none" />
            </svg>
            <div className="brand-logo">
              <img
                src="https://www.figma.com/api/mcp/asset/22745a69-5d3a-4704-a178-e6f136e28c81"
                alt="LALA i LOGISTICS"
                style={{ height: '50px', width: 'auto', opacity: 0.95 }}
              />
              <div className="brand-name">
                <span className="zh" style={{ fontSize: '12px', opacity: 0.70, marginTop: '4px' }}>货拉拉企业国际版</span>
              </div>
            </div>
            <div className="brand-body">
              <p className="brand-headline" dangerouslySetInnerHTML={{ __html: t.brandHeadline }}></p>
              <p className="brand-sub" dangerouslySetInnerHTML={{ __html: t.brandSub }}></p>
            </div>
            <div className="brand-markets">
              <div className="market-tag"><span className="flag">🇮🇩</span> Indonesia</div>
              <div className="market-tag"><span className="flag">🇻🇳</span> Vietnam</div>
              <div className="market-tag"><span className="flag">🇲🇾</span> Malaysia</div>
              <div className="market-tag"><span className="flag">🇹🇭</span> Thailand</div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="form-panel">
            {/* Notion logo (shows instead of brand panel on mobile) */}
            <div className="form-logo">
              <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="7" fill="#1A3A6B"/>
                <path d="M6 14h16v10H6V14z" fill="white" opacity=".9"/>
                <path d="M22 17h5l3 4v3h-8V17z" fill="white" opacity=".75"/>
                <circle cx="10" cy="25" r="2.5" fill="transparent" stroke="white" strokeWidth="1.5"/>
                <circle cx="26" cy="25" r="2.5" fill="transparent" stroke="white" strokeWidth="1.5"/>
              </svg>
              <div>
                <div className="fn">货拉拉企业国际版</div>
                <div className="fs">Lalamove Enterprise</div>
              </div>
            </div>
            <div className="notion-divider"></div>

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
                    </select>
                    <svg className="cc-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <input
                    type="tel"
                    value={phoneValue}
                    onChange={(e) => {
                      setPhoneValue(e.target.value);
                      if (phoneError) setPhoneError('');
                    }}
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
                    onChange={(e) => {
                      setPasswordValue(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
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
      </div>

      <style jsx global>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        /* ════════════════════════════════════════════
           THEME TOKENS — each theme sets its own DNA
        ════════════════════════════════════════════ */

        /* ── 1. Stripe: 专业克制，白底分栏，蓝调阴影 ── */
        :root {
          --page-bg:        #F1F5F9;
          --card-bg:        #FFFFFF;
          --card-radius:    16px;
          --card-shadow:    0 0 0 1px rgba(15,23,42,.06), 0 8px 32px rgba(15,23,42,.10), 0 2px 8px rgba(15,23,42,.06);
          --brand-bg:       #1B46AA;
          --brand-text:     rgba(255,255,255,.95);
          --brand-sub:      rgba(255,255,255,.65);
          --brand-deco:     rgba(255,255,255,.10);
          --text-title:     #0F172A;
          --text-body:      #475569;
          --text-muted:     #94A3B8;
          --border:         #E2E8F0;
          --input-bg:       #F8FAFC;
          --input-h:        44px;
          --input-radius:   8px;
          --input-border:   #E2E8F0;
          --focus-border:   #2257D4;
          --focus-ring:     rgba(34,87,212,.12);
          --btn-bg:         #2257D4;
          --btn-hover-bg:   #1B46AA;
          --btn-text:       #FFFFFF;
          --btn-radius:     8px;
          --btn-h:          44px;
          --btn-shadow:     0 1px 3px rgba(34,87,212,.30);
          --btn-hover-shadow: 0 4px 12px rgba(34,87,212,.35);
          --note-bg:        #F8FAFC;
          --note-border:    #E2E8F0;
          --link:           #2257D4;
          --title-size:     22px;
          --title-weight:   600;
          --title-spacing:  -0.3px;
          --label-size:     13px;
          --label-weight:   500;
          --label-transform: none;
          --label-spacing:  0;
          --label-color:    #0F172A;
          --field-gap:      20px;
          --form-pad:       52px 48px;
          --show-brand:     flex;
          --card-max:       900px;
          --brand-width:    42%;
        }

        /* ── 2. Linear: 暗色系，字重轻，靛蓝点缀，几乎透明的边框 ── */
        [data-theme="linear"] {
          --page-bg:        #08090A;
          --card-bg:        #0F1011;
          --card-radius:    12px;
          --card-shadow:    0 0 0 1px rgba(255,255,255,.06), 0 24px 64px rgba(0,0,0,.60);
          --brand-bg:       #0F1011;
          --brand-text:     #F7F8F8;
          --brand-sub:      rgba(247,248,248,.35);
          --brand-deco:     rgba(255,255,255,.03);
          --text-title:     #F7F8F8;
          --text-body:      rgba(247,248,248,.50);
          --text-muted:     rgba(247,248,248,.28);
          --border:         rgba(255,255,255,.07);
          --input-bg:       rgba(255,255,255,.04);
          --input-h:        40px;
          --input-radius:   6px;
          --input-border:   rgba(255,255,255,.08);
          --focus-border:   #5E6AD2;
          --focus-ring:     rgba(94,106,210,.18);
          --btn-bg:         #5E6AD2;
          --btn-hover-bg:   #6B77E0;
          --btn-text:       #FFFFFF;
          --btn-radius:     6px;
          --btn-h:          40px;
          --btn-shadow:     none;
          --btn-hover-shadow: 0 4px 16px rgba(94,106,210,.35);
          --note-bg:        rgba(255,255,255,.03);
          --note-border:    rgba(255,255,255,.06);
          --link:           #7170FF;
          --title-size:     20px;
          --title-weight:   500;
          --title-spacing:  -0.5px;
          --label-size:     12px;
          --label-weight:   400;
          --label-transform: none;
          --label-spacing:  0;
          --label-color:    rgba(247,248,248,.50);
          --field-gap:      16px;
          --form-pad:       48px 44px;
          --show-brand:     flex;
          --card-max:       900px;
          --brand-width:    42%;
        }

        /* ── 3. Revolut: 深紫渐变背景，毛玻璃卡片，强视觉冲击 ── */
        [data-theme="revolut"] {
          --page-bg:        #070714;
          --card-bg:        rgba(255,255,255,.05);
          --card-radius:    24px;
          --card-shadow:    0 0 0 1px rgba(255,255,255,.09), 0 32px 80px rgba(0,0,0,.70);
          --brand-bg:       linear-gradient(150deg,#160F3A 0%,#2A1060 60%,#0D0920 100%);
          --brand-text:     #FFFFFF;
          --brand-sub:      rgba(255,255,255,.45);
          --brand-deco:     rgba(139,92,246,.15);
          --text-title:     #FFFFFF;
          --text-body:      rgba(255,255,255,.55);
          --text-muted:     rgba(255,255,255,.32);
          --border:         rgba(255,255,255,.10);
          --input-bg:       rgba(255,255,255,.07);
          --input-h:        48px;
          --input-radius:   12px;
          --input-border:   rgba(255,255,255,.12);
          --focus-border:   #8B5CF6;
          --focus-ring:     rgba(139,92,246,.20);
          --btn-bg:         linear-gradient(135deg,#7C3AED,#5B21B6);
          --btn-hover-bg:   linear-gradient(135deg,#8B5CF6,#6D28D9);
          --btn-text:       #FFFFFF;
          --btn-radius:     12px;
          --btn-h:          48px;
          --btn-shadow:     0 4px 20px rgba(124,58,237,.45);
          --btn-hover-shadow: 0 8px 28px rgba(124,58,237,.55);
          --note-bg:        rgba(255,255,255,.04);
          --note-border:    rgba(255,255,255,.10);
          --link:           #A78BFA;
          --title-size:     24px;
          --title-weight:   600;
          --title-spacing:  -0.4px;
          --label-size:     12px;
          --label-weight:   500;
          --label-transform: uppercase;
          --label-spacing:  0.06em;
          --label-color:    rgba(255,255,255,.45);
          --field-gap:      20px;
          --form-pad:       56px 52px;
          --show-brand:     flex;
          --card-max:       900px;
          --brand-width:    42%;
        }

        /* ── 4. Notion: 纯白，无品牌栏，字体即设计，极低噪声 ── */
        [data-theme="notion"] {
          --page-bg:        #FFFFFF;
          --card-bg:        #FFFFFF;
          --card-radius:    0px;
          --card-shadow:    none;
          --brand-bg:       #FFFFFF;
          --brand-text:     #37352F;
          --brand-sub:      rgba(55,53,47,.50);
          --brand-deco:     transparent;
          --text-title:     #37352F;
          --text-body:      rgba(55,53,47,.65);
          --text-muted:     rgba(55,53,47,.35);
          --border:         rgba(55,53,47,.14);
          --input-bg:       rgba(55,53,47,.04);
          --input-h:        40px;
          --input-radius:   4px;
          --input-border:   rgba(55,53,47,.14);
          --focus-border:   #37352F;
          --focus-ring:     rgba(55,53,47,.08);
          --btn-bg:         #37352F;
          --btn-hover-bg:   #2F2D28;
          --btn-text:       #FFFFFF;
          --btn-radius:     4px;
          --btn-h:          40px;
          --btn-shadow:     none;
          --btn-hover-shadow: none;
          --note-bg:        rgba(55,53,47,.04);
          --note-border:    rgba(55,53,47,.10);
          --link:           #2383E2;
          --title-size:     28px;
          --title-weight:   700;
          --title-spacing:  -0.5px;
          --label-size:     11px;
          --label-weight:   600;
          --label-transform: uppercase;
          --label-spacing:  0.08em;
          --label-color:    rgba(55,53,47,.55);
          --field-gap:      18px;
          --form-pad:       64px 52px;
          --show-brand:     none;
          --card-max:       420px;
          --brand-width:    0%;
        }

        /* ── 5. Wise: 黑底品牌 + 白表单，胶囊形，跃动交互 ── */
        [data-theme="wise"] {
          --page-bg:        #FFFFFF;
          --card-bg:        #FFFFFF;
          --card-radius:    24px;
          --card-shadow:    0 0 0 1px rgba(14,15,12,.10), 0 12px 48px rgba(14,15,12,.10);
          --brand-bg:       #0E0F0C;
          --brand-text:     #FFFFFF;
          --brand-sub:      rgba(255,255,255,.45);
          --brand-deco:     rgba(159,232,112,.12);
          --text-title:     #0E0F0C;
          --text-body:      #454745;
          --text-muted:     #868685;
          --border:         rgba(14,15,12,.12);
          --input-bg:       #FFFFFF;
          --input-h:        52px;
          --input-radius:   9999px;
          --input-border:   rgba(14,15,12,.20);
          --focus-border:   #9FE870;
          --focus-ring:     rgba(159,232,112,.30);
          --btn-bg:         #9FE870;
          --btn-hover-bg:   #CDFFAD;
          --btn-text:       #163300;
          --btn-radius:     9999px;
          --btn-h:          52px;
          --btn-shadow:     none;
          --btn-hover-shadow: none;
          --note-bg:        #F4FCF0;
          --note-border:    rgba(159,232,112,.50);
          --link:           #054D28;
          --title-size:     26px;
          --title-weight:   700;
          --title-spacing:  -0.4px;
          --label-size:     13px;
          --label-weight:   600;
          --label-transform: none;
          --label-spacing:  0;
          --label-color:    #0E0F0C;
          --field-gap:      22px;
          --form-pad:       52px 48px;
          --show-brand:     flex;
          --card-max:       900px;
          --brand-width:    42%;
        }

        /* ── 6. Apple: 黑色品牌栏，冷白表单，蓝色单点，超宽松间距 ── */
        [data-theme="apple"] {
          --page-bg:        #F5F5F7;
          --card-bg:        #FFFFFF;
          --card-radius:    18px;
          --card-shadow:    rgba(0,0,0,.12) 0px 4px 40px 0px;
          --brand-bg:       #000000;
          --brand-text:     #FFFFFF;
          --brand-sub:      rgba(255,255,255,.50);
          --brand-deco:     rgba(255,255,255,.04);
          --text-title:     #1D1D1F;
          --text-body:      rgba(0,0,0,.55);
          --text-muted:     rgba(0,0,0,.38);
          --border:         rgba(0,0,0,.10);
          --input-bg:       #F5F5F7;
          --input-h:        46px;
          --input-radius:   10px;
          --input-border:   rgba(0,0,0,.10);
          --focus-border:   #0071E3;
          --focus-ring:     rgba(0,113,227,.15);
          --btn-bg:         #0071E3;
          --btn-hover-bg:   #0077ED;
          --btn-text:       #FFFFFF;
          --btn-radius:     980px;
          --btn-h:          46px;
          --btn-shadow:     none;
          --btn-hover-shadow: none;
          --note-bg:        #F5F5F7;
          --note-border:    rgba(0,0,0,.08);
          --link:           #0066CC;
          --title-size:     24px;
          --title-weight:   600;
          --title-spacing:  -0.4px;
          --label-size:     12px;
          --label-weight:   400;
          --label-transform: none;
          --label-spacing:  -0.2px;
          --label-color:    rgba(0,0,0,.55);
          --field-gap:      24px;
          --form-pad:       56px 52px;
          --show-brand:     flex;
          --card-max:       900px;
          --brand-width:    42%;
        }

        /* ════════════════════════════════════════════
           BASE STYLES
        ════════════════════════════════════════════ */
        html, body {
          height: 100%;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont,
                       'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
          background: var(--page-bg);
          color: var(--text-title);
          -webkit-font-smoothing: antialiased;
          transition: background .3s ease;
        }

        /* ── Theme Switcher (top-left) ── */
        .theme-bar {
          position: fixed; top: 20px; left: 24px; z-index: 200;
        }
        .theme-trigger {
          display: flex; align-items: center; gap: 7px;
          padding: 7px 13px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          box-shadow: var(--card-shadow);
          cursor: pointer; font-size: 12.5px; font-weight: 500;
          color: var(--text-body); transition: all .15s; user-select: none; white-space: nowrap;
        }
        .theme-trigger:hover { color: var(--text-title); }
        .theme-badge {
          display: inline-flex; align-items: center;
          padding: 2px 8px; border-radius: 20px;
          font-size: 11px; font-weight: 600; letter-spacing: .03em;
          background: var(--btn-bg); color: var(--btn-text);
        }
        .theme-dropdown {
          position: absolute; top: calc(100% + 6px); left: 0;
          background: var(--card-bg); border: 1px solid var(--border);
          border-radius: 10px; box-shadow: var(--card-shadow);
          overflow: hidden; min-width: 220px;
        }
        .theme-option {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 16px; cursor: pointer; transition: background .1s;
          border-bottom: 1px solid var(--border);
        }
        .theme-option:last-child { border-bottom: none; }
        .theme-option:hover { background: var(--input-bg); }
        .theme-swatch { width: 28px; height: 28px; border-radius: 6px; flex-shrink: 0; }
        .theme-info { display: flex; flex-direction: column; gap: 1px; }
        .theme-name { font-size: 13px; font-weight: 500; color: var(--text-title); }
        .theme-desc { font-size: 11px; color: var(--text-muted); }
        .theme-check { margin-left: auto; opacity: 0; color: var(--focus-border); flex-shrink: 0; }
        .theme-option.active .theme-check { opacity: 1; }

        /* ── Language Switcher (top-right) ── */
        .lang-bar {
          position: fixed; top: 20px; right: 24px; z-index: 200;
        }
        .lang-trigger {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 13px;
          background: var(--card-bg); border: 1px solid var(--border);
          border-radius: 8px; box-shadow: var(--card-shadow);
          cursor: pointer; font-size: 13px; font-weight: 500;
          color: var(--text-body); transition: all .15s; user-select: none;
        }
        .lang-trigger:hover { color: var(--text-title); }
        .lang-dropdown {
          position: absolute; top: calc(100% + 6px); right: 0;
          background: var(--card-bg); border: 1px solid var(--border);
          border-radius: 10px; box-shadow: var(--card-shadow);
          overflow: hidden; min-width: 185px;
        }
        .lang-option {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px; font-size: 13px; color: var(--text-title);
          cursor: pointer; transition: background .1s;
          border-bottom: 1px solid var(--border);
        }
        .lang-option:last-child { border-bottom: none; }
        .lang-option:hover { background: var(--input-bg); }
        .lang-option.active { color: var(--link); font-weight: 500; }
        .lang-option .flag { font-size: 16px; }

        /* ── Page & Card ── */
        .page {
          min-height: 100vh; display: flex;
          align-items: center; justify-content: center;
          padding: 72px 16px 40px; transition: background .3s;
        }
        .card {
          display: flex; width: 100%; max-width: var(--card-max);
          background: var(--card-bg);
          border-radius: var(--card-radius);
          box-shadow: var(--card-shadow);
          overflow: hidden; transition: all .3s ease;
        }

        /* ── Brand Panel ── */
        .brand-panel {
          width: var(--brand-width);
          background: linear-gradient(160deg, #0B1D40 0%, #163A6E 100%);
          padding: 48px 40px;
          display: var(--show-brand);
          flex-direction: column; justify-content: space-between;
          position: relative; overflow: hidden; flex-shrink: 0;
          transition: width .3s;
        }
        .brand-globe {
          position: absolute; right: -180px; bottom: 40px;
          width: 380px; height: 380px;
          z-index: 0; pointer-events: none; opacity: 0.9;
        }
        .brand-panel::before {
          content: ''; position: absolute;
          top: -60px; right: -60px; width: 280px; height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34,87,212,0.12) 0%, transparent 70%);
        }
        .brand-panel::after {
          content: ''; position: absolute;
          bottom: -40px; left: -40px; width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34,87,212,0.08) 0%, transparent 70%);
        }

        /* Linear: accent glow */
        [data-theme="linear"] .brand-panel {
          border-right: 1px solid rgba(94,106,210,.15);
        }
        [data-theme="linear"] .brand-panel::before {
          background: radial-gradient(circle, rgba(94,106,210,.12) 0%, transparent 70%);
          border: none; top: -40px; right: -40px; width: 260px; height: 260px;
        }

        /* Revolut: brand panel gradient */
        [data-theme="revolut"] .brand-panel {
          background: linear-gradient(150deg,#160F3A 0%,#2A1060 60%,#0D0920 100%);
        }
        [data-theme="revolut"] .brand-panel::before {
          background: radial-gradient(circle, rgba(139,92,246,.20) 0%, transparent 70%);
          border: none; width: 300px; height: 300px;
        }

        /* Wise: lime glow on black */
        [data-theme="wise"] .brand-panel::before {
          background: radial-gradient(circle, rgba(159,232,112,.18) 0%, transparent 70%);
          border: none; top: -60px; right: -60px; width: 320px; height: 320px;
        }
        [data-theme="wise"] .brand-panel::after {
          background: radial-gradient(circle, rgba(159,232,112,.08) 0%, transparent 70%);
          border: none;
        }

        /* Apple: pure black, no deco circles */
        [data-theme="apple"] .brand-panel::before,
        [data-theme="apple"] .brand-panel::after { display: none; }

        .brand-logo { display: flex; align-items: center; gap: 12px; position: relative; z-index: 1; }
        .brand-name { display: flex; flex-direction: column; }
        .brand-name .en {
          font-size: 11px; font-weight: 500; letter-spacing: .08em;
          text-transform: uppercase; color: var(--brand-sub); line-height: 1; margin-bottom: 3px;
        }
        .brand-name .zh {
          font-size: 15px; font-weight: 600; color: var(--brand-text); line-height: 1;
        }
        .brand-body { position: relative; z-index: 1; }
        .brand-headline {
          font-size: 22px; font-weight: 300; color: var(--brand-text);
          line-height: 1.5; letter-spacing: -.2px; margin-bottom: 14px;
        }
        [data-theme="linear"] .brand-headline { font-weight: 400; letter-spacing: -.5px; font-size: 20px; }
        [data-theme="wise"] .brand-headline { font-weight: 700; font-size: 24px; letter-spacing: -.4px; }
        [data-theme="apple"] .brand-headline { font-weight: 600; letter-spacing: -.5px; font-size: 24px; line-height: 1.1; }
        .brand-sub { font-size: 13px; color: var(--brand-sub); line-height: 1.7; }

        .brand-markets { display: flex; gap: 8px; flex-wrap: wrap; position: relative; z-index: 1; }
        .market-tag {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 10px;
          background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
          border-radius: 20px; font-size: 12px; color: rgba(255,255,255,.70);
        }
        [data-theme="wise"] .market-tag {
          background: rgba(159,232,112,.10); border-color: rgba(159,232,112,.20); color: rgba(255,255,255,.65);
        }
        .market-tag .flag { font-size: 13px; }

        /* ── Form Panel ── */
        .form-panel {
          flex: 1; padding: var(--form-pad);
          display: flex; flex-direction: column; justify-content: center;
        }

        /* Notion: logo in form panel */
        .form-logo { display: none; align-items: center; gap: 10px; margin-bottom: 36px; }
        [data-theme="notion"] .form-logo { display: flex; }
        .form-logo .fn { font-size: 14px; font-weight: 600; color: var(--text-title); }
        .form-logo .fs { font-size: 11px; color: var(--text-muted); margin-top: 1px; letter-spacing: .04em; text-transform: uppercase; }

        /* Notion: divider under logo */
        .notion-divider { display: none; height: 1px; background: var(--border); margin-bottom: 36px; }
        [data-theme="notion"] .notion-divider { display: block; }

        /* ── Typography ── */
        .form-title {
          font-size: var(--title-size);
          font-weight: var(--title-weight);
          letter-spacing: var(--title-spacing);
          color: var(--text-title);
          margin-bottom: 28px;
          line-height: 1.2;
        }
        .form-subtitle {
          font-size: 14px; color: var(--text-body); margin-bottom: 36px; line-height: 1.5;
        }
        [data-theme="notion"] .form-subtitle { font-size: 13px; margin-bottom: 32px; }
        [data-theme="apple"] .form-subtitle { font-size: 13px; letter-spacing: -0.1px; margin-bottom: 40px; }

        /* ── Fields ── */
        .field { margin-bottom: var(--field-gap); }
        .field-label {
          display: block;
          font-size: var(--label-size);
          font-weight: var(--label-weight);
          text-transform: var(--label-transform);
          letter-spacing: var(--label-spacing);
          color: var(--label-color);
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

        /* Country code */
        .cc-wrapper { position: relative; flex-shrink: 0; }
        .cc-select {
          appearance: none; -webkit-appearance: none;
          height: var(--input-h);
          padding: 0 30px 0 14px;
          background: var(--input-bg); border: 1px solid var(--input-border);
          border-radius: var(--input-radius);
          font-family: inherit; font-size: 14px; color: var(--text-title);
          cursor: pointer; outline: none; width: 108px;
          transition: border-color .15s, box-shadow .15s;
        }
        .cc-select:focus {
          border-color: var(--focus-border);
          box-shadow: 0 0 0 3px var(--focus-ring);
        }
        .cc-arrow {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          pointer-events: none; color: var(--text-muted);
        }

        /* Inputs */
        input[type="tel"], input[type="password"], input[type="text"] {
          width: 100%; height: var(--input-h);
          padding: 0 14px;
          background: var(--input-bg); border: 1px solid var(--input-border);
          border-radius: var(--input-radius);
          font-family: inherit; font-size: 14px; color: var(--text-title);
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        input::placeholder { color: var(--text-muted); }
        input:focus {
          border-color: var(--focus-border);
          box-shadow: 0 0 0 3px var(--focus-ring);
        }

        /* Wise: pill inputs need more left padding */
        [data-theme="wise"] input[type="tel"],
        [data-theme="wise"] input[type="password"],
        [data-theme="wise"] input[type="text"],
        [data-theme="wise"] .cc-select { padding-left: 20px; }

        /* Password */
        .pwd-wrapper { position: relative; }
        .pwd-wrapper input { padding-right: 44px; }
        .pwd-toggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: var(--text-muted);
          padding: 0; display: flex; transition: color .15s;
        }
        .pwd-toggle:hover { color: var(--text-body); }

        /* ── Submit button ── */
        .btn-submit {
          width: 100%; height: var(--btn-h);
          background: var(--btn-bg); color: var(--btn-text);
          border: none; border-radius: var(--btn-radius);
          font-family: inherit; font-size: 15px; font-weight: 500;
          cursor: pointer; margin-top: 10px;
          box-shadow: var(--btn-shadow);
          transition: background .15s, box-shadow .15s, transform .15s;
        }
        .btn-submit:hover:not(:disabled) {
          background: var(--btn-hover-bg);
          box-shadow: var(--btn-hover-shadow);
        }
        .btn-submit:disabled { opacity: .6; cursor: default; }

        /* Wise: scale animation */
        [data-theme="wise"] .btn-submit:hover:not(:disabled) { transform: scale(1.03); }
        [data-theme="wise"] .btn-submit:active { transform: scale(0.97); }

        /* Revolut: gradient needs special handling */
        [data-theme="revolut"] .btn-submit:hover:not(:disabled) {
          background: linear-gradient(135deg,#8B5CF6,#6D28D9);
        }

        /* ── Contact note ── */
        .contact-note {
          margin-top: 28px; padding: 14px 16px;
          background: var(--note-bg); border: 1px solid var(--note-border);
          border-radius: calc(var(--input-radius) + 2px);
          font-size: 12.5px; color: var(--text-body); line-height: 1.7;
        }
        /* Apple: pill-style note uses a "learn more" link feel */
        [data-theme="apple"] .contact-note { border-radius: 10px; font-size: 12px; }
        /* Wise: rounded note */
        [data-theme="wise"] .contact-note { border-radius: 16px; }

        .contact-note a {
          color: var(--link); text-decoration: none; font-weight: 500;
        }
        .contact-note a:hover { text-decoration: underline; }

        /* ── Footer ── */
        .form-footer {
          margin-top: 22px; font-size: 11.5px; color: var(--text-muted); line-height: 1.6;
        }

        /* ── Responsive ── */
        @media (max-width: 680px) {
          .brand-panel { display: none !important; }
          .card { max-width: 440px; border-radius: 16px; }
          .form-panel { padding: 40px 28px; }
          .form-logo { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

// Helper functions
function getThemeSwatch(theme: Theme): string {
  const swatches = {
    stripe: 'linear-gradient(135deg,#1A3A6B 50%,#F1F5F9 50%)',
    linear: 'linear-gradient(135deg,#08090A 60%,#5E6AD2 100%)',
    revolut: 'linear-gradient(135deg,#070714 0%,#7C3AED 100%)',
    notion: '#FFFFFF',
    wise: 'linear-gradient(135deg,#0E0F0C 50%,#9FE870 100%)',
    apple: 'linear-gradient(135deg,#000000 50%,#0071E3 100%)',
  };
  return swatches[theme];
}

function getThemeDesc(theme: Theme): string {
  const descs = {
    stripe: '白底分栏 · 克制专业',
    linear: '纯黑暗色 · 字轻间距紧',
    revolut: '深紫渐变 · 毛玻璃大圆角',
    notion: '纯白无边 · 字即设计',
    wise: '黑底青绿 · 胶囊形 · 跃动',
    apple: '黑白蓝 · 宽松留白 · 胶囊钮',
  };
  return descs[theme];
}

function getLangFlag(lang: Language): string {
  const flags = {
    zh: '🇨🇳',
    en: '🌐',
    id: '🇮🇩',
    vi: '🇻🇳',
    ms: '🇲🇾',
    th: '🇹🇭',
  };
  return flags[lang];
}
