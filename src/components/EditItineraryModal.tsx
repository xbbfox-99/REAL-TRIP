import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Pencil, MapPin, Tag as TagIcon, Clock, AlignLeft } from 'lucide-react';
import { Tag as TagType, ItineraryItem } from '../types';

interface EditItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayIndex: number;
  dayTitle: string;
  itemIndex: number;
  item: ItineraryItem | null;
  onSave: (updatedItem: ItineraryItem) => void;
  themeColor: string;
}

const CATEGORY_OPTIONS: { type: ItineraryItem['type']; label: string; defaultIcon: string }[] = [
  { type: 'sight', label: '🎡 景點', defaultIcon: '📸' },
  { type: 'food', label: '🍱 美食/咖啡', defaultIcon: '🍜' },
  { type: 'transit', label: '🚗 交通/移動', defaultIcon: '🚗' },
  { type: 'hotel', label: '🏨 住宿/ Check-in', defaultIcon: '🛏️' },
  { type: 'misc', label: '🛍️ 購物/其他', defaultIcon: '🛍️' },
];

const EMOJI_OPTIONS = [
  '📸', '⛩️', '🌊', '⛰️', '🌺', '🍁', '🌈', '🐶', '🦙', 
  '🍜', '☕', '🍱', '🥩', '🍔', '🥐', '🦞', '🍣', '🍞', 
  '🚗', '✈️', '🛫', '🛬', '🚆', '🚢', '🛵', '🧳', 
  '🏨', '🛏️', '🛍️', '⏰', '🎟️', '🍊'
];

export const EditItineraryModal: React.FC<EditItineraryModalProps> = ({
  isOpen,
  onClose,
  dayIndex,
  dayTitle,
  itemIndex,
  item,
  onSave,
  themeColor,
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<ItineraryItem['type']>('sight');
  const [icon, setIcon] = useState('📸');
  const [body, setBody] = useState('');
  const [map, setMap] = useState('');
  const [tagText, setTagText] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setTime(item.time || '');
      setType(item.type || 'sight');
      setIcon(item.icon || '📍');
      setBody(item.body || '');
      setMap(item.map || '');
      setTagText(item.tags && item.tags.length > 0 ? item.tags.map(t => t.text).join(', ') : '');
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tagCategory: TagType['type'] = type === 'food' ? 'food' : type === 'sight' ? 'sight' : 'buy';

    const formattedTags: TagType[] | undefined = tagText.trim()
      ? tagText.split(',').map(t => t.trim()).filter(Boolean).map(text => ({
          type: tagCategory,
          text
        }))
      : undefined;

    // Build clean item object WITHOUT undefined properties
    const updatedItem: ItineraryItem = {
      title: title.trim(),
      type,
      icon: icon || '📍',
      ...(time.trim() ? { time: time.trim() } : {}),
      ...(body.trim() ? { body: body.trim() } : {}),
      ...(map.trim() ? { map: map.trim() } : {}),
      ...(formattedTags && formattedTags.length > 0 ? { tags: formattedTags } : {}),
      guide: item.guide || title.trim(),
    };

    onSave(updatedItem);
    onClose();
  };

  const handleCategorySelect = (selectedType: ItineraryItem['type'], defaultIcon: string) => {
    setType(selectedType);
    if (!icon) setIcon(defaultIcon);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white border border-border shadow-2xl z-10 flex flex-col max-h-[80vh] sm:max-h-[85vh] overflow-hidden rounded-md"
        >
          {/* Header (Fixed Top) */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-zinc-50 shrink-0">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-sm flex items-center justify-center font-bold text-lg"
                style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
              >
                <Pencil className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 leading-tight">
                  編輯行程內容
                </h3>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
                  DAY {dayIndex + 1} ({dayTitle}) · 項目 #{itemIndex + 1}
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

          {/* Form Content (Scrollable Middle) */}
          <form id="edit-itinerary-form" onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
            {/* Category Select */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 block mb-1.5">
                行程類別
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat.type}
                    type="button"
                    onClick={() => handleCategorySelect(cat.type, cat.defaultIcon)}
                    className={`text-xs font-bold py-2 px-3 border transition-all text-left flex items-center gap-2 ${
                      type === cat.type
                        ? 'border-zinc-800 bg-zinc-900 text-white shadow-xs'
                        : 'border-border text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 block mb-1">
                行程名稱 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如: 正房瀑布、倫敦貝果博物館"
                className="w-full text-sm p-3 border border-border focus:border-zinc-800 focus:outline-none bg-zinc-50/50"
              />
            </div>

            {/* Time */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                預定時間 <span className="text-zinc-400 font-normal">(選填，無寫時間可留白)</span>
              </div>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="例如: 10:00、08:30~09:00"
                className="w-full text-sm p-2.5 border border-border focus:border-zinc-800 focus:outline-none bg-zinc-50/50"
              />
            </div>

            {/* Icon Picker */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 block mb-1">
                代表圖示 ({icon})
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-zinc-50 border border-border max-h-24 overflow-y-auto">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setIcon(emoji)}
                    className={`w-8 h-8 rounded-xs text-base flex items-center justify-center transition-all ${
                      icon === emoji
                        ? 'bg-white border-2 border-zinc-900 scale-110 shadow-xs'
                        : 'hover:bg-zinc-200/60'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Body / Notes */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                <AlignLeft className="w-3.5 h-3.5 text-zinc-400" />
                行程說明 / 亮點說明 <span className="text-zinc-400 font-normal">(選填)</span>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="例如：白帶魚套餐是招牌，店員會協助去骨..."
                rows={3}
                className="w-full text-sm p-2.5 border border-border focus:border-zinc-800 focus:outline-none bg-zinc-50/50 resize-none"
              />
            </div>

            {/* Map Keyword */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                地圖搜尋關鍵字 <span className="text-zinc-400 font-normal">(用於開啟導航)</span>
              </div>
              <input
                type="text"
                value={map}
                onChange={(e) => setMap(e.target.value)}
                placeholder="例如: 정방폭포 或 西歸浦偶來市場"
                className="w-full text-sm p-2.5 border border-border focus:border-zinc-800 focus:outline-none bg-zinc-50/50"
              />
            </div>

            {/* Tag */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                <TagIcon className="w-3.5 h-3.5 text-zinc-400" />
                標籤貼紙 <span className="text-zinc-400 font-normal">(多個可用逗號分開)</span>
              </div>
              <input
                type="text"
                value={tagText}
                onChange={(e) => setTagText(e.target.value)}
                placeholder="例如: 門票 ₩5,000, 必吃黑豬肉"
                className="w-full text-sm p-2.5 border border-border focus:border-zinc-800 focus:outline-none bg-zinc-50/50"
              />
            </div>
          </form>

          {/* Action Buttons (Fixed Bottom Footer) */}
          <div className="p-4 border-t border-border bg-white flex items-center justify-end gap-3 shrink-0 z-10">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-zinc-600 hover:text-zinc-900 px-4 py-2 border border-border hover:bg-zinc-100 transition-colors uppercase tracking-wider"
            >
              取消
            </button>
            <button
              type="submit"
              form="edit-itinerary-form"
              style={{ backgroundColor: themeColor }}
              className="text-xs font-bold text-white px-6 py-2.5 hover:opacity-90 active:scale-[0.98] transition-all uppercase tracking-wider shadow-xs"
            >
              儲存修改
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
