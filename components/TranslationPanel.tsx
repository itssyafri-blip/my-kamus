import React, { useState } from 'react';
import { ArrowRightLeft, Volume2, Copy, X, Zap, Sparkles, LayoutDashboard } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { translateText, playTextToSpeech } from '../services/geminiService';
import { TranslationState, AppView } from '../types';
import { Button } from './Button';

interface TranslationPanelProps {
    onNavigate: (view: AppView) => void;
}

export const TranslationPanel: React.FC<TranslationPanelProps> = ({ onNavigate }) => {
  const [state, setState] = useState<TranslationState>({
    sourceText: '',
    targetText: '',
    sourceLang: 'English',
    targetLang: 'Indonesian',
    isLoading: false,
    error: null,
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingSpeed, setPlayingSpeed] = useState<number | null>(null);

  const handleSwapLanguages = () => {
    setState(prev => ({
      ...prev,
      sourceLang: prev.targetLang,
      targetLang: prev.sourceLang,
      sourceText: prev.targetText,
      targetText: prev.sourceText
    }));
  };

  const handleTranslate = async () => {
    if (!state.sourceText.trim()) {
        setState(prev => ({ ...prev, error: "Silakan ketik teks terlebih dahulu ya!" }));
        return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await translateText(state.sourceText, state.sourceLang, state.targetLang);
      setState(prev => ({ ...prev, targetText: result, isLoading: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
    }
  };

  const handleTTS = async (text: string, speed: number) => {
    if (!text || isPlaying) return;
    setIsPlaying(true);
    setPlayingSpeed(speed);
    try {
      await playTextToSpeech(text, speed);
    } catch (err) {
      alert("Gagal memutar audio.");
    } finally {
      setIsPlaying(false);
      setPlayingSpeed(null);
    }
  };

  const handleCopy = (text: string) => {
    if(!text) return;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      
      {/* Controls Bar - Colorful Card */}
      <div className="bg-white rounded-3xl shadow-[0_8px_0_rgb(226,232,240)] border-4 border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4 w-full">
            <div className="flex-1 bg-sky-50 p-2 rounded-2xl border-2 border-sky-100">
                <LanguageSelector 
                    label="Dari Bahasa" 
                    value={state.sourceLang} 
                    onChange={(v) => setState(s => ({...s, sourceLang: v}))} 
                />
            </div>
            <button 
                onClick={handleSwapLanguages}
                className="mt-6 p-3 rounded-full bg-yellow-400 text-yellow-900 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all hover:bg-yellow-300 shadow-md shrink-0"
                title="Tukar Bahasa"
            >
                <ArrowRightLeft size={24} strokeWidth={3} />
            </button>
            <div className="flex-1 bg-indigo-50 p-2 rounded-2xl border-2 border-indigo-100">
                <LanguageSelector 
                    label="Ke Bahasa" 
                    value={state.targetLang} 
                    onChange={(v) => setState(s => ({...s, targetLang: v}))} 
                />
            </div>
        </div>
      </div>

      {/* Translation Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* Source Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_0_rgb(224,242,254)] border-4 border-sky-200 p-6 flex flex-col relative overflow-hidden transition-all focus-within:ring-4 focus-within:ring-sky-300">
           <div className="absolute top-0 left-0 w-full h-2 bg-sky-400"></div>
           
           <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-black text-sky-600 bg-sky-100 px-4 py-1 rounded-full uppercase tracking-wider shadow-sm border border-sky-200">{state.sourceLang}</span>
                {state.sourceText && (
                    <button onClick={() => setState(s => ({...s, sourceText: '', targetText: ''}))} className="p-2 hover:bg-rose-100 text-rose-400 hover:text-rose-600 rounded-full transition-colors">
                        <X size={24} strokeWidth={3} />
                    </button>
                )}
           </div>
           
           <textarea
            className="w-full h-48 md:h-64 resize-none text-xl md:text-2xl text-slate-700 bg-transparent focus:outline-none placeholder-slate-300 leading-relaxed font-bold rounded-xl p-2"
            placeholder="Ketik teks yang ingin diterjemahkan disini ya..."
            value={state.sourceText}
            onChange={(e) => setState(prev => ({ ...prev, sourceText: e.target.value }))}
            spellCheck="false"
           />

           {/* Actions Area */}
           <div className="mt-4 space-y-4">
               <Button 
                onClick={handleTranslate} 
                variant="primary"
                isLoading={state.isLoading}
                className="w-full text-lg shadow-lg"
               >
                 <Zap size={24} className="mr-2 fill-current" />
                 Terjemahkan Cepat!
               </Button>

               <div className="flex gap-3 pt-4 border-t-2 border-dashed border-sky-100">
                   <button 
                        onClick={() => handleTTS(state.sourceText, 0.75)}
                        disabled={!state.sourceText || isPlaying}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wide transition-all border-b-4 active:border-b-0 active:translate-y-1 ${playingSpeed === 0.75 && isPlaying ? 'bg-sky-500 text-white border-sky-700' : 'bg-sky-100 text-sky-600 border-sky-200 hover:bg-sky-200'}`}
                    >
                        <Volume2 size={20} />
                        Suara Dasar
                    </button>
                    <button 
                        onClick={() => handleTTS(state.sourceText, 1.0)}
                        disabled={!state.sourceText || isPlaying}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wide transition-all border-b-4 active:border-b-0 active:translate-y-1 ${playingSpeed === 1.0 && isPlaying ? 'bg-sky-500 text-white border-sky-700' : 'bg-sky-100 text-sky-600 border-sky-200 hover:bg-sky-200'}`}
                    >
                        <Volume2 size={20} />
                        Suara Mahir
                    </button>
               </div>
           </div>
        </div>

        {/* Target Card */}
        <div className="bg-indigo-50 rounded-3xl shadow-[0_8px_0_rgb(199,210,254)] border-4 border-indigo-200 p-6 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-400"></div>

            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-black text-indigo-600 bg-white px-4 py-1 rounded-full uppercase tracking-wider shadow-sm border border-indigo-200">{state.targetLang}</span>
                <button onClick={() => handleCopy(state.targetText)} className="p-2 bg-white hover:bg-indigo-100 rounded-xl text-indigo-400 hover:text-indigo-600 transition-colors shadow-sm border border-indigo-100" title="Salin">
                    <Copy size={20} strokeWidth={2.5} />
                </button>
           </div>
           
           <div className="flex-grow h-48 md:h-64 overflow-y-auto p-2 rounded-xl">
               {state.isLoading ? (
                   <div className="animate-pulse space-y-4 opacity-60">
                       <div className="h-6 bg-indigo-200 rounded-full w-3/4"></div>
                       <div className="h-6 bg-indigo-200 rounded-full w-1/2"></div>
                       <div className="h-6 bg-indigo-200 rounded-full w-5/6"></div>
                   </div>
               ) : (
                   <div className="text-xl md:text-2xl text-indigo-900 leading-relaxed font-bold">
                    {state.targetText || (
                        <div className="flex flex-col items-center justify-center h-full text-indigo-300 opacity-70">
                            <Sparkles size={48} className="mb-2" />
                            <span className="italic font-semibold text-lg">Hasil terjemahan disini...</span>
                        </div>
                    )}
                   </div>
               )}
           </div>

           {state.error && (
             <div className="mb-4 text-base font-bold text-rose-600 bg-rose-100 p-4 rounded-xl border-2 border-rose-200">
                ⚠️ {state.error}
             </div>
           )}

           <div className="flex gap-3 pt-4 border-t-2 border-dashed border-indigo-200">
                <button 
                    onClick={() => handleTTS(state.targetText, 0.75)}
                    disabled={!state.targetText || isPlaying}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wide transition-all border-b-4 active:border-b-0 active:translate-y-1 ${playingSpeed === 0.75 && isPlaying ? 'bg-indigo-500 text-white border-indigo-700' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-100'}`}
                >
                    <Volume2 size={20} />
                    Suara Dasar
                </button>
                <button 
                    onClick={() => handleTTS(state.targetText, 1.0)}
                    disabled={!state.targetText || isPlaying}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wide transition-all border-b-4 active:border-b-0 active:translate-y-1 ${playingSpeed === 1.0 && isPlaying ? 'bg-indigo-500 text-white border-indigo-700' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-100'}`}
                >
                    <Volume2 size={20} />
                    Suara Mahir
                </button>
           </div>
        </div>
      </div>
      
      <div className="mt-10 flex flex-col items-center gap-4">
        <span className="inline-block bg-white px-6 py-2 rounded-full text-slate-400 text-sm font-bold shadow-sm border border-slate-100">
            🌟 Belajar Bahasa Itu Menyenangkan! 🌟
        </span>
        
        <Button 
            variant="ghost" 
            onClick={() => onNavigate(AppView.ADMIN_DASHBOARD)}
            className="text-xs text-sky-400 opacity-70 hover:opacity-100"
        >
            <LayoutDashboard size={14} className="mr-1" />
            Ke Dashboard Admin
        </Button>
      </div>
    </div>
  );
};