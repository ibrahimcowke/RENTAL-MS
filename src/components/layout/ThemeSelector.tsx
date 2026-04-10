import { Palette, Check } from 'lucide-react';
import { useStore, AppTheme } from '../../store/useStore';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const THEMES: { id: AppTheme; name: string; color: string }[] = [
  { id: 'ocean', name: 'Ocean Teal', color: 'bg-[#0f766e]' },
  { id: 'midnight', name: 'Midnight Pro', color: 'bg-[#18181b]' },
  { id: 'rose', name: 'Rose Gold', color: 'bg-[#e11d48]' },
  { id: 'desert', name: 'Warm Desert', color: 'bg-[#b45309]' },
  { id: 'arctic', name: 'Arctic Blue', color: 'bg-[#1d4ed8]' },
  { id: 'forest', name: 'Deep Forest', color: 'bg-[#166534]' },
  { id: 'slate', name: 'Slate Gray', color: 'bg-[#334155]' },
];

const ThemeSelector = () => {
  const { theme, setTheme, language } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-100 outline-none"
        title={language === 'so' ? 'Dooro Midabka' : 'Change Theme'}
      >
        <Palette className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-semibold hidden sm:inline">
          {language === 'so' ? 'Maduush' : 'Theme'}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 overflow-hidden"
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">
              {language === 'so' ? 'Xulo Midabka' : 'Select Theme'}
            </p>
            <div className="grid grid-cols-1 gap-1">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    theme === t.id ? 'bg-primary/5 text-primary' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${t.color} border border-white/20 shadow-sm`} />
                    <span className="text-xs font-bold">{t.name}</span>
                  </div>
                  {theme === t.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
