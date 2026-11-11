import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, StickyNote, Trash2, Check, Sparkles } from 'lucide-react';
import { ItineraryItem } from '../types';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItineraryItem | null;
  dayIndex: number;
  itemIndex: number;
  initialNote?: string;
  onSave: (note: string) => void;
  onDelete?: () => void;
  themeColor: string;
}

const QUICK_TAGS = [
  { label: '💡 提醒事項', prefix: '【💡 提醒事項】' },
  { label: '🍱 必吃必點', prefix: '【🍱 推薦必點】' },
  { label: '⏰ 預約/集合', prefix: '【⏰ 預約時間】' },
  { label: '🛍️ 必買伴手禮', prefix: '【🛍️ 必買清單】' },
  { label: '🎟️ 門票/交通', prefix: '【🎟️ 門票交通】' },
];

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  item,
  dayIndex,
  itemIndex,
  initialNote = '',
  onSave,
  onDelete,
  themeColor,
}) => {
  const [noteText, setNoteText] = useState(initialNote);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setNoteText(initialNote);
    setIsSaved(false);
  }, [initialNote, isOpen]);

  if (!isOpen || !item) return null;

  const handleAddTag = (prefix: string) => {
    setNoteText(prev => {
      if (!prev.trim()) return `${prefix} `;
      return `${prev}\n${prefix} `;
    });
  };

  const handleSave = () => {
    onSave(noteText);
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleDelete = () => {
    if (confirm('確定要刪除這筆自訂備註嗎？')) {
      if (onDelete) onDelete();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        {/* Backdrop click */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white border border-border shadow-2xl z-10 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-zinc-50/70">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-8 h-8 rounded-sm flex items-center justify-center"
                style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
              >
                <StickyNote className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mt-0.5">
                  第 {dayIndex + 1} 天行程自訂備註
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 transition-colors rounded-sm hover:bg-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {/* Quick Templates */}
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                <Sparkles className="w-3 h-3 text-amber-500" />
                快速標籤範本
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => handleAddTag(tag.prefix)}
                    className="text-[10px] font-medium px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-sm border border-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Note Textarea */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 block">
                備註內容
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="在此填寫景點注意事項、推薦餐點、預約時間、必買伴手禮或交通心得..."
                rows={5}
                maxLength={1000}
                className="w-full text-sm p-3.5 border border-border focus:border-zinc-800 focus:outline-none rounded-none bg-zinc-50/50 resize-none font-sans leading-relaxed text-zinc-800 placeholder:text-zinc-400 transition-colors"
                autoFocus
              />
              <div className="flex justify-between items-center text-[10px] text-zinc-400">
                <span>支援自由換行與筆記記錄</span>
                <span>{noteText.length} / 1000</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border bg-zinc-50 flex items-center justify-between gap-3">
            {initialNote ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-2 transition-colors hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                刪除備註
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-zinc-600 hover:text-zinc-900 px-4 py-2 border border-border hover:bg-zinc-100 transition-colors uppercase tracking-wider"
              >
                取消
              </button>

              <button
                type="button"
                onClick={handleSave}
                style={{ backgroundColor: themeColor }}
                className="flex items-center gap-1.5 text-xs font-bold text-white px-5 py-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-xs uppercase tracking-wider"
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    已儲存
                  </>
                ) : (
                  '儲存備註'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
