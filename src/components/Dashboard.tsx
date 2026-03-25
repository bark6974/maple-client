import { useEffect, useRef, useState } from 'react';
import {
  Bot, LogOut, Zap, Shield, MessageSquare,
  Save, Link, CheckCircle, XCircle, Play, Square,
  Eye, EyeOff, Hash, Server,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  validateToken, getGuilds, getGuildChannels, sendMessage,
  DiscordUser, DiscordGuild, DiscordChannel,
} from '../lib/discord';

interface BotConfig {
  id: string;
  server_id: string;
  spam_enabled: boolean;
  spam_message: string;
  spam_interval: number;
  utility_features: {
    moderation: boolean;
    welcome: boolean;
    automod: boolean;
  };
}

interface Profile {
  discord_username: string | null;
  subscription_tier: string;
}

type TokenStatus = 'idle' | 'checking' | 'valid' | 'invalid';

export function Dashboard({ onNavigateToHome }: { onNavigateToHome: () => void }) {
  const { user, signOut } = useAuth();

  // Supabase
  const [profile, setProfile] = useState<Profile | null>(null);
  const [config, setConfig] = useState<BotConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Discord API
  const [tokenInput, setTokenInput] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>('idle');
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);
  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [selectedGuildId, setSelectedGuildId] = useState('');
  const [channels, setChannels] = useState<DiscordChannel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const [loadingChannels, setLoadingChannels] = useState(false);

  // Spam
  const [spamRunning, setSpamRunning] = useState(false);
  const [spamLog, setSpamLog] = useState<string[]>([]);
  const spamRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { loadData(); }, [user]);

  // 저장된 토큰 복원
  useEffect(() => {
    if (!user) return;
    const savedToken = localStorage.getItem(`dc_token_${user.id}`);
    const savedGuild = localStorage.getItem(`dc_guild_${user.id}`);
    const savedChannel = localStorage.getItem(`dc_channel_${user.id}`);
    if (savedToken) {
      setTokenInput(savedToken);
      connectToken(savedToken, savedGuild ?? undefined, savedChannel ?? undefined);
    }
  }, [user]);

  useEffect(() => {
    return () => { if (spamRef.current) clearInterval(spamRef.current); };
  }, []);

  const loadData = async () => {
    if (!user) return;
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('discord_username, subscription_tier')
        .eq('id', user.id)
        .maybeSingle();
      if (profileData) setProfile(profileData);

      const { data: configsData } = await supabase
        .from('bot_configs').select('*').eq('user_id', user.id).limit(1);

      if (configsData && configsData.length > 0) {
        setConfig(configsData[0]);
      } else {
        const defaultCfg = {
          user_id: user.id, server_id: '',
          spam_enabled: false, spam_message: '', spam_interval: 5,
          utility_features: { moderation: false, welcome: false, automod: false },
        };
        const { data: newCfg } = await supabase
          .from('bot_configs').insert(defaultCfg).select().single();
        if (newCfg) setConfig(newCfg);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const connectToken = async (
    token?: string,
    guildId?: string,
    channelId?: string,
  ) => {
    const t = (token ?? tokenInput).trim();
    if (!t) return;
    setTokenStatus('checking');
    try {
      const [userData, guildsData] = await Promise.all([
        validateToken(t),
        getGuilds(t),
      ]);
      setDiscordUser(userData);
      setGuilds(guildsData);
      setTokenStatus('valid');
      if (user) localStorage.setItem(`dc_token_${user.id}`, t);

      if (guildId) {
        setSelectedGuildId(guildId);
        setLoadingChannels(true);
        try {
          const chData = await getGuildChannels(t, guildId);
          setChannels(chData);
          if (channelId) setSelectedChannelId(channelId);
        } catch { /* ignore */ } finally {
          setLoadingChannels(false);
        }
      }
    } catch {
      setTokenStatus('invalid');
      setDiscordUser(null);
      setGuilds([]);
    }
  };

  const handleGuildSelect = async (guildId: string) => {
    setSelectedGuildId(guildId);
    setSelectedChannelId('');
    setChannels([]);
    if (user) localStorage.setItem(`dc_guild_${user.id}`, guildId);
    const token = user ? localStorage.getItem(`dc_token_${user.id}`) : null;
    if (!token) return;
    setLoadingChannels(true);
    try {
      setChannels(await getGuildChannels(token, guildId));
    } catch (e) { console.error(e); } finally { setLoadingChannels(false); }
  };

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId);
    if (user) localStorage.setItem(`dc_channel_${user.id}`, channelId);
  };

  const startSpam = () => {
    if (!config || !selectedChannelId) return;
    const token = user ? localStorage.getItem(`dc_token_${user.id}`) : null;
    if (!token) return;
    setSpamRunning(true);
    setSpamLog([]);
    spamRef.current = setInterval(async () => {
      try {
        await sendMessage(token, selectedChannelId, config.spam_message || '.');
        setSpamLog(p => [`✓ ${new Date().toLocaleTimeString()} — 전송 완료`, ...p.slice(0, 49)]);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : '알 수 없는 오류';
        setSpamLog(p => [`✗ ${new Date().toLocaleTimeString()} — 오류: ${msg}`, ...p.slice(0, 49)]);
      }
    }, (config.spam_interval ?? 5) * 1000);
  };

  const stopSpam = () => {
    if (spamRef.current) { clearInterval(spamRef.current); spamRef.current = null; }
    setSpamRunning(false);
  };

  const saveConfig = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('bot_configs')
        .update({
          server_id: selectedGuildId || config.server_id,
          spam_enabled: config.spam_enabled,
          spam_message: config.spam_message,
          spam_interval: config.spam_interval,
          utility_features: config.utility_features,
        })
        .eq('id', config.id);
      if (error) throw error;
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleSignOut = async () => {
    stopSpam();
    await signOut();
    onNavigateToHome();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="px-6 py-5 border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-semibold text-sm">{user?.email}</p>
              <p className="text-white/50 text-xs capitalize">{profile?.subscription_tier ?? 'free'} Plan</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="grid lg:grid-cols-4 gap-6">

          {/* 왼쪽 사이드바 */}
          <div className="lg:col-span-1 space-y-4">

            {/* Discord 계정 연결 */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
              <div className="flex items-center space-x-2 mb-4">
                <Link className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold text-white">Discord 계정</h2>
              </div>

              {discordUser ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                    {discordUser.avatar ? (
                      <img
                        src={`https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.webp?size=64`}
                        className="w-9 h-9 rounded-full"
                        alt="avatar"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        {(discordUser.global_name ?? discordUser.username)[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {discordUser.global_name ?? discordUser.username}
                      </p>
                      <p className="text-white/50 text-xs">#{discordUser.discriminator}</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  </div>
                  <button
                    onClick={() => {
                      setDiscordUser(null); setGuilds([]); setTokenStatus('idle');
                      setTokenInput(''); setSelectedGuildId(''); setChannels([]);
                      if (user) localStorage.removeItem(`dc_token_${user.id}`);
                    }}
                    className="w-full py-2 text-xs text-white/50 hover:text-white border border-white/10 rounded-lg transition-colors"
                  >
                    연결 해제
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showToken ? 'text' : 'password'}
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && connectToken()}
                      placeholder="User Token"
                      className="w-full px-3 py-2.5 pr-9 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {tokenStatus === 'invalid' && (
                    <div className="flex items-center space-x-1.5 text-red-400 text-xs">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>잘못된 토큰입니다</span>
                    </div>
                  )}
                  <button
                    onClick={() => connectToken()}
                    disabled={tokenStatus === 'checking' || !tokenInput.trim()}
                    className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    {tokenStatus === 'checking' ? '확인 중...' : '연결'}
                  </button>
                </div>
              )}
            </div>

            {/* 서버 목록 */}
            {guilds.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
                <div className="flex items-center space-x-2 mb-3">
                  <Server className="w-5 h-5 text-purple-400" />
                  <h2 className="text-base font-bold text-white">서버 목록</h2>
                  <span className="ml-auto text-white/40 text-xs">{guilds.length}개</span>
                </div>
                <div className="space-y-1 max-h-72 overflow-y-auto">
                  {guilds.map((guild) => (
                    <button
                      key={guild.id}
                      onClick={() => handleGuildSelect(guild.id)}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                        selectedGuildId === guild.id
                          ? 'bg-blue-500/20 border border-blue-400/50 text-white'
                          : 'text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {guild.icon ? (
                        <img
                          src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=32`}
                          className="w-6 h-6 rounded-full flex-shrink-0"
                          alt=""
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs flex-shrink-0">
                          {guild.name[0]}
                        </div>
                      )}
                      <span className="truncate">{guild.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3 space-y-5">

            {/* 채널 설정 */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Hash className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">채널 설정</h2>
              </div>
              {!discordUser ? (
                <p className="text-white/40 text-sm">왼쪽에서 Discord 토큰을 연결하세요.</p>
              ) : !selectedGuildId ? (
                <p className="text-white/40 text-sm">왼쪽에서 서버를 선택하세요.</p>
              ) : loadingChannels ? (
                <p className="text-white/40 text-sm">채널 불러오는 중...</p>
              ) : channels.length === 0 ? (
                <p className="text-white/40 text-sm">접근 가능한 채널이 없습니다.</p>
              ) : (
                <select
                  value={selectedChannelId}
                  onChange={(e) => handleChannelSelect(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="" className="bg-slate-800">채널 선택...</option>
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id} className="bg-slate-800">
                      # {ch.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 스팸 제어 */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-bold text-white">스팸 제어</h2>
                </div>
                {spamRunning && (
                  <span className="flex items-center space-x-1.5 text-green-400 text-sm font-medium">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>실행 중</span>
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">전송 메시지</label>
                  <textarea
                    value={config?.spam_message ?? ''}
                    onChange={(e) => config && setConfig({ ...config, spam_message: e.target.value })}
                    rows={3}
                    disabled={spamRunning}
                    placeholder="보낼 메시지를 입력하세요"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-blue-400 resize-none disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    전송 간격:{' '}
                    <span className="text-white font-semibold">{config?.spam_interval ?? 5}초</span>
                  </label>
                  <input
                    type="range" min="1" max="60"
                    value={config?.spam_interval ?? 5}
                    onChange={(e) => config && setConfig({ ...config, spam_interval: parseInt(e.target.value) })}
                    disabled={spamRunning}
                    className="w-full disabled:opacity-50"
                  />
                  <div className="flex justify-between text-white/30 text-xs mt-1">
                    <span>1초</span><span>60초</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={startSpam}
                    disabled={spamRunning || !selectedChannelId || !config?.spam_message?.trim()}
                    className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-40 text-white rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>스팸 시작</span>
                  </button>
                  <button
                    onClick={stopSpam}
                    disabled={!spamRunning}
                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <Square className="w-5 h-5" />
                    <span>정지</span>
                  </button>
                </div>
                {!selectedChannelId && discordUser && (
                  <p className="text-yellow-400/70 text-xs">⚠ 채널을 먼저 선택해야 스팸을 시작할 수 있습니다.</p>
                )}
                {spamLog.length > 0 && (
                  <div className="bg-black/30 border border-white/10 rounded-xl p-3 max-h-36 overflow-y-auto font-mono space-y-0.5">
                    {spamLog.map((line, i) => (
                      <p key={i} className={`text-xs ${line.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 유훸리티 기능 */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-5">
                <Shield className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">유훸리티 기능</h2>
              </div>
              <div className="space-y-4">
                {(
                  [
                    { key: 'moderation', label: '모더레이션', icon: Shield },
                    { key: 'welcome', label: '웰콤 메시지', icon: MessageSquare },
                    { key: 'automod', label: '자동 모더레이션', icon: Shield },
                  ] as const
                ).map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-white/50" />
                      <span className="text-white">{label}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config?.utility_features[key] ?? false}
                        onChange={(e) =>
                          config &&
                          setConfig({
                            ...config,
                            utility_features: { ...config.utility_features, [key]: e.target.checked },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 저장 버튼 */}
            <button
              onClick={saveConfig}
              disabled={saving || !config}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? '저장 중...' : '설정 저장'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
