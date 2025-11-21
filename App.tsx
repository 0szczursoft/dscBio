
import React, { useState } from 'react';
import { useLanyard } from './hooks/useLanyard';
import { DISCORD_ID, SOCIAL_LINKS } from './constants';
import PrismaticBurst from './components/PrismaticBurst';
import GlassCard from './components/GlassCard';
import Activity from './components/Activity';
import TextPressure from './components/TextPressure';
import AnimatedContent from './components/AnimatedContent';
import TargetCursor from './components/TargetCursor';
import LoadingScreen from './components/LoadingScreen';
import AudioPlayer from './components/AudioPlayer';

// Icons
const Icons = {
  Github: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
  Twitter: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>,
  Instagram: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  Mail: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Link: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Steam: (props: any) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M11.979 0C5.666 0 .48 4.902.024 11.11l3.993 1.634a3.06 3.06 0 0 1 2.598-.405l2.656-3.824a5.31 5.31 0 0 1 5.378-3.158 5.328 5.328 0 0 1 4.675 5.316 5.328 5.328 0 0 1-5.316 5.316 5.31 5.31 0 0 1-3.158-.95l-3.824 2.656a3.06 3.06 0 0 1 .405 2.598L5.797 24.43c6.208-.456 11.11-5.642 11.11-11.955C16.907 5.606 12.511 1.225 11.979 0zM9.28 15.28a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm5.38-5.38a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5z"/></svg>,
  Roblox: (props: any) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M5.186 0L0 18.814 18.814 24 24 5.186 5.186 0zm9.497 14.365l-5.64.963.963-5.64 5.64-.963-.963 5.64z"/></svg>,
  Spotify: (props: any) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.6.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.66.24 1.02zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>,
  Youtube: (props: any) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
};

const statusColors = {
  online: 'bg-green-500',
  idle: 'bg-yellow-500',
  dnd: 'bg-red-500',
  offline: 'bg-neutral-500',
};

function App() {
  const { data } = useLanyard(DISCORD_ID);
  const [hasEntered, setHasEntered] = useState(false);
  const user = data?.discord_user;
  const status = data?.discord_status || 'offline';
  
  // Find custom status (Activity Type 4)
  const customStatus = data?.activities.find((a) => a.type === 4);

  return (
    <div className="relative min-h-screen w-full font-sans overflow-hidden bg-black">
      <LoadingScreen onEnter={() => setHasEntered(true)} />
      
      {hasEntered && <AudioPlayer />}
      <TargetCursor />
      
      {/* Background Container */}
      <div className="fixed inset-0 h-full w-full bg-black pointer-events-none z-0">
           <PrismaticBurst paused={!hasEntered} />
           {/* Overlay to ensure text contrast if background is too bright */}
           <div className="absolute inset-0 bg-black/40 pointer-events-none" /> 
      </div>
      
      {/* Main Content Container */}
      <div className={`relative w-full min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center z-10 transition-opacity duration-1000 ${hasEntered ? 'opacity-100' : 'opacity-0'}`}>
      <div className="w-full max-w-2xl flex flex-col gap-5 pb-24 sm:pb-0">
        
        {/* 1. Profile Card (Lanyard) */}
        <AnimatedContent distance={150} direction="vertical" reverse={false} initialOpacity={0} animateOpacity scale={0.9} threshold={0.2}>
        <GlassCard className="p-6 sm:p-8 w-full relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 relative z-10">
                
                {/* Avatar Column */}
                <div className="relative shrink-0 group">
                    <div className="relative">
                        {user?.avatar ? (
                            <img 
                                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=1024`} 
                                alt={user.username} 
                                className="h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-neutral-800/50 shadow-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-neutral-800 animate-pulse border-4 border-neutral-800/50" />
                        )}
                         {/* Online Status Indicator (Dot) */}
                        <div className={`absolute bottom-1 right-1 sm:bottom-2 sm:right-2 h-6 w-6 sm:h-7 sm:w-7 rounded-full border-[3px] border-neutral-900 ${statusColors[status]} shadow-md z-20`} title={status}></div>
                    </div>
                </div>
                
                {/* Content Column */}
                <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start w-full">
                     
                     {/* Header: Name */}
                     <div className="w-full flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-4 mb-2">
                         
                         {/* Name Container - Responsive height */}
                         <div className="relative h-20 sm:h-24 w-full max-w-[300px] sm:max-w-[400px] flex items-center justify-center sm:justify-start"> 
                            <TextPressure 
                                text={user?.global_name || user?.username || "User"} 
                                flex={true} 
                                alpha={false} 
                                stroke={false} 
                                width={true} 
                                weight={true} 
                                italic={true}
                                textColor="#ffffff"
                                minFontSize={36}
                            />
                         </div>
                     </div>

                     {/* Custom Status & Bio Wrapper */}
                     <div className="w-full flex flex-col items-center sm:items-start gap-3 text-center sm:text-left">
                         {/* Custom Status */}
                         {customStatus && (customStatus.state || customStatus.emoji) && (
                             <div className="inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/5 px-3 py-2 text-sm text-neutral-200 shadow-sm max-w-full">
                                {customStatus.emoji && (
                                    customStatus.emoji.id ? (
                                        <img 
                                            src={`https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? 'gif' : 'png'}`}
                                            alt={customStatus.emoji.name}
                                            className="h-4 w-4 shrink-0"
                                        />
                                    ) : <span className="shrink-0">{customStatus.emoji.name}</span>
                                )}
                                <span className="truncate">{customStatus.state}</span>
                             </div>
                         )}

                         {/* Bio */}
                         <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-lg">
                             Drawing art from time to time, gaming and all.
                         </p>
                     </div>
                </div>
            </div>
        </GlassCard>
        </AnimatedContent>

        {/* 2. Activity / Status Bar */}
        <AnimatedContent distance={150} direction="vertical" delay={0.2} initialOpacity={0} animateOpacity scale={0.9} threshold={0.2}>
            <Activity data={data} />
        </AnimatedContent>

        {/* 3. Connect Card */}
        <AnimatedContent distance={150} direction="vertical" delay={0.4} initialOpacity={0} animateOpacity scale={0.9} threshold={0.2}>
        <GlassCard className="p-6 w-full">
             <div className="flex flex-col gap-4">
                <h3 className="text-sm uppercase tracking-wider text-indigo-400 font-semibold mb-2">Connect</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SOCIAL_LINKS.map(link => {
                        const Icon = (Icons as any)[link.icon] || Icons.Link;
                        const customColor = (link as any).color;
                        return (
                            <a 
                                key={link.name} 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="cursor-target group flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:scale-[1.02] border border-transparent hover:border-white/10 relative overflow-hidden"
                            >
                                <div className="p-2 rounded-lg bg-black/20 text-white group-hover:text-white transition-colors relative z-10" style={{ color: customColor }}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col relative z-10">
                                    <span className="text-sm font-bold text-neutral-200 group-hover:text-white transition-colors">{link.name}</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                            </a>
                        )
                    })}
                </div>
             </div>
        </GlassCard>
        </AnimatedContent>

      </div>
      </div>
    </div>
  );
}

export default App;
