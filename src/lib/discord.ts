const DISCORD_API = 'https://discord.com/api/v10';

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  global_name: string | null;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: number;
}

async function discordFetch(
  path: string,
  token: string,
  options?: RequestInit
): Promise<unknown> {
  const res = await fetch(`${DISCORD_API}${path}`, {
    ...options,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? `Discord API 오류: ${res.status}`);
  }
  return res.json();
}

export async function validateToken(token: string): Promise<DiscordUser> {
  return discordFetch('/users/@me', token) as Promise<DiscordUser>;
}

export async function getGuilds(token: string): Promise<DiscordGuild[]> {
  return discordFetch('/users/@me/guilds', token) as Promise<DiscordGuild[]>;
}

export async function getGuildChannels(
  token: string,
  guildId: string
): Promise<DiscordChannel[]> {
  const channels = await discordFetch(`/guilds/${guildId}/channels`, token) as DiscordChannel[];
  return channels.filter((c) => c.type === 0); // 텍스트 채널만
}

export async function sendMessage(
  token: string,
  channelId: string,
  content: string
): Promise<void> {
  await discordFetch(`/channels/${channelId}/messages`, token, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}
