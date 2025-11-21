
export interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  global_name?: string;
  public_flags?: number;
}

export interface Activity {
  type: number;
  state: string;
  name: string;
  details: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  };
  application_id?: string;
}

export interface Spotify {
  track_id: string;
  timestamps: {
    start: number;
    end: number;
  };
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
}

export interface LanyardData {
  kv: Record<string, string>;
  spotify: Spotify | null;
  discord_user: DiscordUser;
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Activity[];
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  listening_to_spotify: boolean;
}

export interface LanyardMessage {
  op: number;
  t?: string;
  d?: LanyardData | { heartbeat_interval: number };
}

export enum LanyardOp {
  Event = 0,
  Hello = 1,
  Initialize = 2,
  Heartbeat = 3,
}
