
import React, { useEffect, useState } from 'react';
import { LanyardData } from '../types';
import GlassCard from './GlassCard';

interface ActivityProps {
  data: LanyardData | null;
}

// Helper to format time
const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const Activity: React.FC<ActivityProps> = ({ data }) => {
  const [elapsed, setElapsed] = useState<string>("0:00");
  const spotify = data?.spotify;
  
  // Filter for rich presence that isn't Spotify or Custom Status
  const richActivity = data?.activities.find(
    (a) => a.type !== 4 && a.name !== "Spotify"
  );

  useEffect(() => {
    if (!spotify && !richActivity) return;

    const interval = setInterval(() => {
      if (richActivity && richActivity.timestamps?.start) {
        const now = Date.now();
        setElapsed(formatTime(now - richActivity.timestamps.start));
      } else if (spotify) {
        const now = Date.now();
        const start = spotify.timestamps.start;
        const current = now - start;
        setElapsed(formatTime(current));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [spotify, richActivity]);

  if (!data) return <div className="h-24 animate-pulse rounded-xl bg-neutral-800/50 w-full" />;

  // 1. Game/App Activity (Prioritized)
  if (richActivity) {
    // Image Logic
    let largeImageUrl = null;
    if (richActivity.assets?.large_image) {
        if (richActivity.assets.large_image.startsWith('mp:')) {
             largeImageUrl = `https://media.discordapp.net/${richActivity.assets.large_image.replace('mp:', '')}`;
        } else if (richActivity.assets.large_image.startsWith('spotify:')) {
             largeImageUrl = `https://i.scdn.co/image/${richActivity.assets.large_image.replace('spotify:', '')}`;
        } else {
             largeImageUrl = `https://cdn.discordapp.com/app-assets/${richActivity.application_id}/${richActivity.assets.large_image}.png`;
        }
    }

    let smallImageUrl = null;
    if (richActivity.assets?.small_image) {
        if (richActivity.assets.small_image.startsWith('mp:')) {
            smallImageUrl = `https://media.discordapp.net/${richActivity.assets.small_image.replace('mp:', '')}`;
        } else if (richActivity.assets.small_image.startsWith('spotify:')) {
            smallImageUrl = `https://i.scdn.co/image/${richActivity.assets.small_image.replace('spotify:', '')}`;
        } else {
            smallImageUrl = `https://cdn.discordapp.com/app-assets/${richActivity.application_id}/${richActivity.assets.small_image}.png`;
        }
    }

    return (
       <GlassCard className="p-6 border-indigo-500/20 w-full">
        <div className="flex items-start gap-5">
          <div className="relative shrink-0">
            {largeImageUrl ? (
                 <img 
                 src={largeImageUrl} 
                 alt={richActivity.name} 
                 className="h-20 w-20 rounded-xl object-cover shadow-lg bg-neutral-900 border border-white/5" 
                 onError={(e) => {
                     e.currentTarget.style.display = 'none';
                     e.currentTarget.nextElementSibling?.classList.remove('hidden');
                     e.currentTarget.nextElementSibling?.classList.add('flex');
                 }}
               />
            ) : null}
            
            {/* Fallback Icon - Hidden by default unless largeImage is missing or errors out */}
            <div className={`h-20 w-20 rounded-xl bg-neutral-900 items-center justify-center border border-white/5 shadow-lg ${largeImageUrl ? 'hidden' : 'flex'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-indigo-500/50">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
            </div>

             {smallImageUrl && (
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-neutral-900 border-2 border-neutral-950 flex items-center justify-center overflow-hidden z-10 shadow-md">
                     <img 
                        src={smallImageUrl}
                        alt="Small Asset"
                        className="h-full w-full object-cover"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                </div>
             )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center h-20">
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Playing</h3>
                {richActivity.timestamps?.start && <span className="text-[10px] font-mono text-neutral-500 bg-white/5 px-1.5 py-0.5 rounded">{elapsed}</span>}
            </div>
            <p className="truncate text-lg font-bold text-white leading-tight" title={richActivity.name}>{richActivity.name}</p>
            <p className="truncate text-sm text-neutral-400 font-medium" title={richActivity.details}>{richActivity.details}</p>
            {richActivity.state && <p className="truncate text-xs text-neutral-500" title={richActivity.state}>{richActivity.state}</p>}
          </div>
        </div>
      </GlassCard>
    );
  }

  // 2. Spotify Card
  if (spotify) {
    return (
      <GlassCard className="p-6 border-green-500/20 w-full">
        <div className="flex items-start gap-5">
          <div className="relative shrink-0 group cursor-pointer" onClick={() => window.open(`https://open.spotify.com/track/${spotify.track_id}`, '_blank')}>
            <img 
              src={spotify.album_art_url} 
              alt="Album Art" 
              className="h-20 w-20 rounded-xl shadow-lg border border-white/5 group-hover:scale-[1.02] transition-transform duration-500" 
            />
            <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#1DB954] text-black z-10 shadow-lg ring-2 ring-[#000]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.6.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.66.24 1.02zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center h-20">
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-green-400">Spotify</h3>
                <span className="text-[10px] font-mono text-neutral-500 bg-white/5 px-1.5 py-0.5 rounded">{elapsed}</span>
            </div>
            <p className="truncate text-lg font-bold text-white leading-tight hover:underline cursor-pointer" onClick={() => window.open(`https://open.spotify.com/track/${spotify.track_id}`, '_blank')} title={spotify.song}>{spotify.song}</p>
            <p className="truncate text-sm text-neutral-400" title={spotify.artist}>by {spotify.artist}</p>
            <p className="truncate text-xs text-neutral-500" title={spotify.album}>on {spotify.album}</p>
          </div>
        </div>
      </GlassCard>
    );
  }

  // 3. Idle/Default State
  return (
    <GlassCard className="p-6 flex items-center justify-center border-neutral-800 w-full min-h-[120px]">
       <div className="text-center space-y-2">
           <div className="inline-flex p-3 rounded-full bg-white/5 mb-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-neutral-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
           </div>
           <p className="text-sm text-neutral-500 font-medium">No active tasks currently.</p>
           <p className="text-xs text-neutral-600">Chilling in the digital void.</p>
       </div>
    </GlassCard>
  );
};

export default Activity;
