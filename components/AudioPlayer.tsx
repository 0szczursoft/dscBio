
import React, { useState, useRef, useEffect } from 'react';
import { PLAYLIST } from '../constants';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isShuffle, setIsShuffle] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHoveringVolume, setIsHoveringVolume] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    playNext();
  };

  const playNext = () => {
    if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * PLAYLIST.length);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    }
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setShowPlaylist(false);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
      if(audioRef.current) {
          audioRef.current.currentTime = percent * duration;
          setCurrentTime(percent * duration);
      }
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
        <audio
          ref={audioRef}
          src={currentTrack.src}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />

        {/* Playlist Popover */}
        <div className={`absolute bottom-full left-0 right-0 mb-4 mx-4 sm:mx-0 bg-[#09090b]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 transition-all duration-300 origin-bottom shadow-2xl ${showPlaylist ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}>
            <div className="max-h-48 overflow-y-auto scrollbar-hide flex flex-col gap-1">
                {PLAYLIST.map((track, idx) => (
                    <button 
                        key={idx}
                        onClick={() => selectTrack(idx)}
                        className={`cursor-target group w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${currentTrackIndex === idx ? 'bg-white/10 text-white' : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'}`}
                    >
                        <span className="truncate">{track.title}</span>
                        {currentTrackIndex === idx && (
                             <div className="flex gap-0.5 items-end h-2.5">
                                <div className="w-0.5 bg-indigo-400 animate-[music-bar_0.5s_ease-in-out_infinite]" style={{height: '60%'}}></div>
                                <div className="w-0.5 bg-indigo-400 animate-[music-bar_0.7s_ease-in-out_infinite_0.1s]" style={{height: '100%'}}></div>
                                <div className="w-0.5 bg-indigo-400 animate-[music-bar_0.4s_ease-in-out_infinite_0.2s]" style={{height: '40%'}}></div>
                             </div>
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* Main Player Card */}
        <div className="relative bg-[#18181b]/80 backdrop-blur-md border border-white/10 rounded-[24px] p-4 shadow-2xl ring-1 ring-white/5">
            <div className="flex flex-col gap-3">
                {/* Top Row: Info & Progress */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-xs font-bold text-neutral-200 truncate tracking-wide">{currentTrack.title}</h3>
                        <span className="text-[10px] font-mono text-neutral-500">{formatTime(currentTime)} / {formatTime(duration)}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div 
                        className="cursor-target group relative h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden"
                        onClick={handleProgressChange}
                    >
                         <div 
                            className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full transition-all duration-100 ease-linear group-hover:bg-indigo-400" 
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between mt-1">
                    <button 
                        onClick={() => setShowPlaylist(!showPlaylist)} 
                        className={`cursor-target p-2 rounded-full hover:bg-white/5 transition-colors ${showPlaylist ? 'text-white' : 'text-neutral-500'}`}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    </button>

                    <div className="flex items-center gap-2">
                        <button onClick={playPrev} className="cursor-target p-2 text-neutral-400 hover:text-white transition-colors hover:scale-110 active:scale-95">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                        </button>

                        <button 
                            onClick={togglePlay} 
                            className="cursor-target w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-transform"
                        >
                            {isPlaying ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                            )}
                        </button>

                        <button onClick={playNext} className="cursor-target p-2 text-neutral-400 hover:text-white transition-colors hover:scale-110 active:scale-95">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                        </button>
                    </div>

                    {/* Volume Control */}
                    <div 
                        className="relative"
                        onMouseEnter={() => setIsHoveringVolume(true)}
                        onMouseLeave={() => setIsHoveringVolume(false)}
                    >
                        <button className="cursor-target p-2 text-neutral-500 hover:text-white transition-colors">
                            {volume === 0 ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                            )}
                        </button>
                        
                        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-[#09090b] border border-white/10 rounded-full transition-all duration-200 ${isHoveringVolume ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                            <div className="h-20 w-1.5 relative bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className="absolute bottom-0 left-0 w-full bg-indigo-500 rounded-full"
                                    style={{ height: `${volume * 100}%` }}
                                />
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="1" 
                                    step="0.01" 
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="cursor-target absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    style={{ transform: 'rotate(-90deg) translateX(36px)', transformOrigin: '50% 50%' }} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
         <style>{`
            @keyframes music-bar {
            0%, 100% { height: 20%; }
            50% { height: 100%; }
            }
        `}</style>
    </div>
  );
};

export default AudioPlayer;
