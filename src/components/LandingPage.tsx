import { useState } from 'react';
import {
  Zap, Shield, MessageSquare, Sparkles, CheckCircle,
  ChevronDown, Star, Users, LogIn,
  Swords, Radio, Hash, Smile, RefreshCw, UserX, Lock,
} from 'lucide-react';
import { AuthModal } from './AuthModal';

const DISCORD_SERVER_URL = 'https://discord.gg/zwQtZAsj3H';

const BRAND = 'BUZI SELF BOT';

export function LandingPage({ onNavigateToDashboard }: { onNavigateToDashboard: () => void }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: <Zap className="w-7 h-7" />,
      color: 'from-yellow-500 to-orange-500',
      title: '자동 스팸',
      desc: '원하는 채널에 설정한 간격으로 메시지를 자동 전송. 인터벌 조절 가능.',
    },
    {
      icon: <MessageSquare className="w-7 h-7" />,
      color: 'from-blue-500 to-cyan-500',
      title: '자동 응답',
      desc: '특정 키워드 감지 시 자동으로 답장. 완전 커스터마이징 가능.',
    },
    {
      icon: <Swords className="w-7 h-7" />,
      color: 'from-red-500 to-pink-500',
      title: '레이드 기능',
      desc: '대량 계정으로 특정 서버 동시 입장 및 메시지 전송 자동화.',
    },
    {
      icon: <Radio className="w-7 h-7" />,
      color: 'from-purple-500 to-violet-500',
      title: '상태 변경',
      desc: '온라인/오프라인/자리비움 상태 및 커스텀 상태 메시지 자동 순환.',
    },
    {
      icon: <Smile className="w-7 h-7" />,
      color: 'from-green-500 to-emerald-500',
      title: '자동 반응',
      desc: '특정 메시지에 이모지 자동 반응 추가. 다수 이모지 설정 가능.',
    },
    {
      icon: <RefreshCw className="w-7 h-7" />,
      color: 'from-indigo-500 to-blue-500',
      title: '닉네임 변경',
      desc: '서버별 닉네임을 타이머에 맞춰 자동으로 순환 변경.',
    },
    {
      icon: <Hash className="w-7 h-7" />,
      color: 'from-teal-500 to-green-500',
      title: 'DM 스팸',
      desc: '서버 멤버에게 자동 DM 전송. 대상 필터 및 딜레이 설정 지원.',
    },
    {
      icon: <UserX className="w-7 h-7" />,
      color: 'from-rose-500 to-red-500',
      title: '계정 보호',
      desc: '토큰 탈취 시도 감지 및 자동 로그아웃. 2단계 안전장치 내장.',
    },
  ];

  const plans = [
    {
      name: '베이직',
      price: '9,900',
      period: '/월',
      color: 'border-white/20',
      btn: 'bg-white/10 hover:bg-white/20 border border-white/20',
      items: [
        '자동 스팸 기능',
        '자동 응답 기능',
        '상태 변경',
        '자동 반응',
        '커뮤니티 지원',
      ],
    },
    {
      name: 'VIP',
      price: '24,900',
      period: '/월',
      popular: true,
      color: 'border-violet-500',
      btn: 'bg-gradient-to-r from-violet-600 to-blue-600 hover:shadow-lg hover:shadow-violet-500/40',
      items: [
        '베이직 모든 기능',
        '레이드 기능',
        'DM 스팸',
        '닉네임 변경',
        '계정 보호',
        '1:1 전용 지원',
        '신기능 선공개',
      ],
    },
    {
      name: '평생',
      price: '79,000',
      period: ' 일회성',
      color: 'border-yellow-500/60',
      btn: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-lg hover:shadow-yellow-500/40',
      items: [
        'VIP 모든 기능',
        '평생 업데이트',
        '프리미엄 전용 기능',
        '최우선 1:1 지원',
        '커스텀 기능 요청',
      ],
    },
  ];

  const faqs = [
    {
      q: '셀프봇이 밴 당할 위험은 없나요?',
      a: 'PhantomBot은 자체 우회 알고리즘을 탑재해 탐지율을 최소화합니다. 단, 과도한 사용은 자제하시길 권장드립니다.',
    },
    {
      q: '구매 후 어떻게 사용하나요?',
      a: '구매 후 디스코드 서버에서 라이선스 키를 받고, 대시보드에 로그인 → 토큰 연결하면 즉시 사용 가능합니다.',
    },
    {
      q: '어떤 기능이 계속 업데이트되나요?',
      a: '디스코드 API 변경에 대응하는 패치 및 커뮤니티 요청 기능이 정기적으로 업데이트됩니다.',
    },
    {
      q: '환불은 가능한가요?',
      a: '구매 후 24시간 이내, 기능 미작동 확인 시 전액 환불 가능합니다. 디스코드 서버로 문의 주세요.',
    },
  ];

  const bypassStats = [
    { val: '99.7%', label: '우회 성공률', color: 'from-green-500 to-emerald-500' },
    { val: '0건', label: '2025년 밴 기록', color: 'from-blue-500 to-cyan-500' },
    { val: '월 2회+', label: '알고리즘 업데이트', color: 'from-violet-500 to-purple-500' },
    { val: '<300ms', label: '탐지 반응 속도', color: 'from-yellow-500 to-orange-500' },
  ];

  const reviews = [
    { name: 'phantom_kr', text: '진짜 스팸 기능 미쳤음. 간격 조절도 되고 안 잡힘', stars: 5, tier: '베이직' },
    { name: 'void_user', text: '레이드 기능 써봤는데 개편함. VIP 가치 충분히 함', stars: 5, tier: 'VIP' },
    { name: 'shadow_99', text: '대시보드 UI도 깔끔하고 토큰 연결도 쉬움', stars: 5, tier: '베이직' },
    { name: 'bypass_king', text: '디스코드 업데이트 후에도 바이패스 문제없이 작동함. 경쟁 제품이랑 차원이 다름', stars: 5, tier: 'VIP' },
    { name: 'kr_raider09', text: '레이드 30분 돌렸는데 한 번도 안 잡힘. 우회 알고리즘 진짜 탄탄함', stars: 5, tier: '평생' },
    { name: 'tokenfarm_z', text: '자동응답이랑 DM 스팸 동시에 써도 감지 없음. 평생권 질렀는데 후회없다', stars: 5, tier: '평생' },
  ];

  return (
    <div className="min-h-screen bg-[#080810] text-white overflow-x-hidden">

      {/* ─── Nav ─── */}
      <nav className="sticky top-0 z-50 px-6 py-4 border-b border-white/5 bg-[#080810]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <img src="/logo.svg" alt={BRAND} className="w-9 h-9" />
            <span className="text-xl font-black text-white tracking-tight">{BRAND}</span>
            <span className="px-2 py-0.5 text-xs font-bold bg-violet-600/30 text-violet-300 border border-violet-500/30 rounded-full">SELF-BOT</span>
          </div>
          <div className="flex items-center space-x-3">
            <a href={DISCORD_SERVER_URL} target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
              <Users className="w-4 h-4" />
              <span>디스코드 서버</span>
              <span className="px-1.5 py-0.5 text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded-full font-bold">398명</span>
            </a>
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/30"
            >
              <LogIn className="w-4 h-4" />
              <span>로그인</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative px-6 pt-20 pb-20 text-center overflow-hidden">
        {/* Glow bg */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-violet-700/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[400px] h-[300px] bg-blue-700/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[300px] bg-purple-700/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500/30 rounded-full blur-2xl scale-150" />
              <img src="/logo.svg" alt={BRAND} className="relative w-24 h-24 drop-shadow-2xl" />
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/30 rounded-full text-violet-300 text-sm mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>한국 NO.1 디스코드 셀프봇 — 탐지 우회 최강</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none tracking-tight">
            디스코드
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400">
              최강 셀프봇
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 mb-5 max-w-2xl mx-auto leading-relaxed">
            자동 스팸, 레이드, DM 폭탄, 자동 응답까지 — 디스코드에서 할 수 있는
            모든 자동화를 하나의 봇으로.
          </p>

          {/* Bypass highlight badge */}
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl text-green-300 text-sm font-semibold mb-10">
            <Lock className="w-4 h-4" />
            <span>업계 최고 바이패스 알고리즘 — 2025년 밴 기록 0건</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={DISCORD_SERVER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-violet-500/40 transition-all hover:scale-105"
            >
              지금 구매하기
            </a>
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
            >
              대시보드 체험
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
            {[['1,200+', '활성 유저'], ['398명', '디스코드 서버'], ['99.9%', '업타임']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-black text-white">{val}</p>
                <p className="text-white/40 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">강력한 기능</h2>
            <p className="text-white/40 text-lg">경쟁자들이 따라올 수 없는 기능들</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i}
                className="group p-6 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:bg-white/[0.06] hover:border-white/15 transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">{f.icon}</div>
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bypass Performance ─── */}
      <section className="px-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/20 via-transparent to-blue-950/20 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-300 text-sm mb-5">
              <Lock className="w-3.5 h-3.5" />
              <span>탐지 우회 성능</span>
            </div>
            <h2 className="text-4xl font-black mb-4">
              업계 최고의{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                바이패스 기술
              </span>
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              독자적인 우회 알고리즘으로 디스코드 탐지 시스템을 완벽히 회피.
              경쟁 제품 대비 압도적인 우회 성능.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
            {bypassStats.map(({ val, label, color }) => (
              <div
                key={label}
                className="relative p-7 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-center overflow-hidden group hover:border-white/20 transition-all hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-[0.07] transition-opacity rounded-2xl`} />
                <p className={`text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${color}`}>{val}</p>
                <p className="text-white/40 text-sm mt-2">{label}</p>
              </div>
            ))}
          </div>

          <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-green-950/30 to-emerald-950/30 border border-green-500/20">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-xl font-black mb-2 text-green-300">왜 우리 바이패스가 다른가요?</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  BUZI SELF BOT은 매달 2회 이상 우회 알고리즘을 갱신합니다.
                  디스코드 API 변경 감지 시 48시간 내 패치 배포.
                  실시간 탐지 패턴 분석으로 항상 한 발 앞서 있습니다.
                </p>
              </div>
              <div className="space-y-2.5">
                {[
                  '헤더 위조 및 클라이언트 핑거프린팅 우회',
                  '요청 빈도 자동 조절 (Rate Limit 완벽 회피)',
                  '브라우저 동작 에뮬레이션',
                  '디스코드 업데이트 48시간 내 즉시 패치',
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-white/70 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Why us banner ─── */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-violet-900/40 to-blue-900/40 border border-violet-500/20 overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                  왜 <span className="text-violet-400">{BRAND}</span>인가요?
                </h2>
                <p className="text-white/50 leading-relaxed">
                  수백 개의 셀프봇 중에서 BUZI SELF BOT만이 안정성, 기능, 탐지 우회를 동시에 제공합니다.
                  매달 업데이트되는 우회 알고리즘으로 디스코드 변경에 즉각 대응합니다.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  '디스코드 API 변경 즉각 대응',
                  '브라우저 기반 — 설치 불필요',
                  '토큰은 로컬에만 저장 (보안)',
                  '한국어 전용 지원 채널',
                  '구매 후 즉시 사용 가능',
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-violet-400 flex-shrink-0" />
                    <span className="text-white/70 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section className="px-6 py-24" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">가격 플랜</h2>
            <p className="text-white/40 text-lg">필요에 맞는 플랜을 선택하세요</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-2xl border-2 bg-white/[0.03] backdrop-blur-xl transition-all hover:-translate-y-1 ${
                  plan.popular ? 'border-violet-500 bg-violet-500/5' : plan.color
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-black rounded-full tracking-widest">
                    인기
                  </div>
                )}
                <h3 className="text-2xl font-black mb-1">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">₩{plan.price}</span>
                  <span className="text-white/40 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {plan.items.map((item, j) => (
                    <li key={j} className="flex items-start space-x-2.5">
                      <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/70 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={DISCORD_SERVER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-3 text-center rounded-xl font-bold text-sm transition-all text-white ${plan.btn}`}
                >
                  구매하기
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Reviews ─── */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">실제 사용자 후기</h2>
            <p className="text-white/40">검증된 구매자들의 실제 후기</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {reviews.map((r, i) => (
              <div key={i} className="p-6 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-white/15 transition-all hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex">
                    {Array.from({ length: r.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded-full border border-violet-500/30">{r.tier}</span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">"{r.text}"</p>
                <p className="text-white/30 text-xs font-mono">@{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">자주 묻는 질문</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-white/[0.07] rounded-xl bg-white/[0.02] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left"
                >
                  <span className="font-semibold text-sm text-white/90">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-white/40 transition-transform flex-shrink-0 ml-4 ${
                    openFaq === i ? 'rotate-180' : ''
                  }`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-violet-900/50 to-blue-900/50 border border-violet-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-blue-600/10 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-4">지금 바로 시작하세요</h2>
              <p className="text-white/50 mb-8">구매 후 즉시 사용 가능. 지금 디스코드 서버에서 라이선스를 받으세요.</p>
              <a
                href={DISCORD_SERVER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-10 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-black text-lg hover:shadow-2xl hover:shadow-violet-500/50 transition-all hover:scale-105"
              >
                <Shield className="w-5 h-5" />
                <span>디스코드 서버 입장</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="px-6 py-10 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-white/30 text-sm">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt={BRAND} className="w-6 h-6" />
            <span>{BRAND}</span>
          </div>
          <p>© 2025 {BRAND}. All rights reserved.</p>
          <a href={DISCORD_SERVER_URL} target="_blank" rel="noopener noreferrer"
            className="hover:text-white transition-colors">문의 / 구매 → 디스코드</a>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={onNavigateToDashboard}
      />
    </div>
  );
}
