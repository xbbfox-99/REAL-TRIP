import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cloud, MapPin, Navigation, BookOpen, Loader2, Compass, StickyNote, 
  Plus, ArrowUp, ArrowDown, Trash2, RotateCcw, PlusCircle, Pencil 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { cn } from '../lib/utils';
import { Tag as TagType, ItineraryItem } from '../types';
import { subscribeTripNotes, saveItineraryNote, deleteItineraryNote, ItineraryNote } from '../services/notesService';
import { NoteModal } from './NoteModal';
import { AddItineraryModal } from './AddItineraryModal';
import { EditItineraryModal } from './EditItineraryModal';

interface ItineraryViewProps {
  onOpenGuide: (title: string, query: string) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ onOpenGuide }) => {
  const { 
    currentTripId, 
    currentTrip, 
    addItineraryItem, 
    updateItineraryItem,
    deleteItineraryItem, 
    moveItineraryItem, 
    resetItineraryDay 
  } = useTrip();

  const [currentDay, setCurrentDay] = useState(0);
  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, ItineraryNote>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit itinerary modal state
  const [editModalState, setEditModalState] = useState<{
    isOpen: boolean;
    itemIndex: number;
    item: ItineraryItem | null;
  }>({
    isOpen: false,
    itemIndex: 0,
    item: null
  });

  // Note modal state
  const [noteModalState, setNoteModalState] = useState<{
    isOpen: boolean;
    item: ItineraryItem | null;
    dayIndex: number;
    itemIndex: number;
  }>({
    isOpen: false,
    item: null,
    dayIndex: 0,
    itemIndex: 0
  });

  // Reset currentDay when trip changes
  useEffect(() => {
    setCurrentDay(0);
  }, [currentTrip.id]);

  // Subscribe to real-time notes for the current trip
  useEffect(() => {
    const unsubscribe = subscribeTripNotes(currentTrip.id, (updatedNotes) => {
      setNotes(updatedNotes);
    });
    return () => unsubscribe();
  }, [currentTrip.id]);

  const days = currentTrip.days;
  const dayData = days[currentDay] || days[0];

  useEffect(() => {
    if (!dayData) return;
    async function fetchWeather() {
      setWeatherLoading(true);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${dayData.lat}&longitude=${dayData.lon}&current=temperature_2m,weathercode,relative_humidity_2m,wind_speed_10m&timezone=Asia/Tokyo&forecast_days=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setWeather(data.current);
      } catch (e: any) {
        if (e.message && e.message.includes('Failed to fetch')) {
          console.warn("Weather fetch failed (likely transient network issue)");
        } else {
          console.error("Weather fetch Error:", e);
        }
        setWeather(null);
      } finally {
        setWeatherLoading(false);
      }
    }
    fetchWeather();
  }, [currentDay, dayData?.lat, dayData?.lon, currentTrip.id]);

  const weatherCodeInfo = (code: number) => {
    if (code === 0) return { icon: '☀️', desc: '晴天' };
    if (code <= 2) return { icon: '🌤️', desc: '多雲時晴' };
    if (code <= 3) return { icon: '☁️', desc: '陰天' };
    if (code <= 48) return { icon: '🌫️', desc: '有霧' };
    if (code <= 67) return { icon: '🌧️', desc: '下雨' };
    if (code <= 99) return { icon: '⛈️', desc: '雷陣雨' };
    return { icon: '🌤️', desc: '晴朗' };
  };

  const handleOpenNote = (item: ItineraryItem, idx: number) => {
    setNoteModalState({
      isOpen: true,
      item,
      dayIndex: currentDay,
      itemIndex: idx
    });
  };

  const handleCloseNote = () => {
    setNoteModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleSaveNote = async (text: string) => {
    if (!noteModalState.item) return;
    await saveItineraryNote(
      currentTrip.id,
      noteModalState.dayIndex,
      noteModalState.itemIndex,
      noteModalState.item.title,
      text
    );
  };

  const handleDeleteNote = async () => {
    const noteId = `${currentTrip.id}_d${noteModalState.dayIndex}_i${noteModalState.itemIndex}`;
    await deleteItineraryNote(noteId);
  };

  const handleAddItem = (newItem: ItineraryItem) => {
    addItineraryItem(currentTrip.id, currentDay, newItem);
  };

  const handleOpenEdit = (item: ItineraryItem, idx: number) => {
    setEditModalState({
      isOpen: true,
      itemIndex: idx,
      item
    });
  };

  const handleSaveEdit = (updatedItem: ItineraryItem) => {
    updateItineraryItem(currentTrip.id, currentDay, editModalState.itemIndex, updatedItem);
  };

  const handleDeleteItem = (idx: number, title: string) => {
    if (confirm(`確定要刪除行程「${title}」嗎？`)) {
      deleteItineraryItem(currentTrip.id, currentDay, idx);
    }
  };

  const handleMoveUp = (idx: number) => {
    moveItineraryItem(currentTrip.id, currentDay, idx, 'up');
  };

  const handleMoveDown = (idx: number) => {
    moveItineraryItem(currentTrip.id, currentDay, idx, 'down');
  };

  const handleResetDay = () => {
    if (confirm(`確定要將 DAY ${currentDay + 1} 的行程重置為初始預設內容嗎？`)) {
      resetItineraryDay(currentTrip.id, currentDay);
    }
  };

  if (!dayData) return null;

  const currentSelectedNoteKey = `${currentTrip.id}_d${noteModalState.dayIndex}_i${noteModalState.itemIndex}`;
  const currentSelectedNote = notes[currentSelectedNoteKey]?.note || '';

  return (
    <div className="p-6 pb-24 space-y-8">
      {/* Day Selector */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
        {days.map((day, i) => (
          <button
            key={`${currentTrip.id}-${i}`}
            onClick={() => setCurrentDay(i)}
            className={cn(
              "flex-shrink-0 px-6 py-2.5 rounded-none border-t-2 transition-all text-[11px] font-bold tracking-[0.2em] uppercase",
              currentDay === i 
                ? "border-primary text-primary bg-primary/10 shadow-sm" 
                : "border-border text-zinc-400 hover:text-zinc-600"
            )}
            style={currentDay === i ? { borderColor: currentTrip.themeColor, color: currentTrip.themeColor } : undefined}
          >
            DAY {i < 9 ? `0${i+1}` : i+1}
          </button>
        ))}
      </div>

      {/* Weather & Day Title Header */}
      <div className="flex flex-col gap-4">
        {/* Day Title Header (Full un-squished width) */}
        <div className="flex items-baseline gap-4 w-full">
          <span 
            className="text-7xl font-black leading-none shrink-0"
            style={{ color: currentTrip.themeColor }}
          >
            {currentDay < 9 ? `0${currentDay+1}` : currentDay+1}
          </span>
          <div className="flex flex-col flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase leading-tight text-zinc-900 break-words">{dayData.title}</h2>
            <span className="text-[10px] font-mono text-zinc-400 mt-1 uppercase tracking-[0.2em]">
              {dayData.loc} // {currentTrip.country} ({dayData.label})
            </span>
          </div>
        </div>

        {/* Weather Bar */}
        <motion.div 
          key={`weather-${currentTrip.id}-${currentDay}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6 py-4 border-y border-border"
        >
          {weatherLoading ? (
            <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
              正在更新天氣數據...
            </div>
          ) : weather ? (
            <div className="flex items-center gap-8 w-full justify-between">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center">
                   <span className="text-4xl font-bold tracking-tighter text-zinc-900">{Math.round(weather.temperature_2m)}°</span>
                   <div className="h-0.5 w-full bg-accent-gold/40 mt-1" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent-sage mb-0.5">{weatherCodeInfo(weather.weathercode).desc}</span>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tighter">濕度: {weather.relative_humidity_2m}% // 風速: {weather.wind_speed_10m}km/h</span>
                </div>
              </div>
              <div className="text-4xl drop-shadow-sm">{weatherCodeInfo(weather.weathercode).icon}</div>
            </div>
          ) : (
            <div className="text-xs text-zinc-400">目前無法取得即時天氣資料</div>
          )}
        </motion.div>

        {/* Action Bar for Adding & Resetting Itinerary Items */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{ backgroundColor: currentTrip.themeColor }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white shadow-xs hover:opacity-90 active:scale-95 transition-all rounded-xs"
          >
            <Plus className="w-4 h-4" />
            <span>新增行程項目</span>
          </button>

          <button
            onClick={handleResetDay}
            className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-zinc-700 transition-colors py-1.5 px-2.5 border border-border hover:bg-zinc-50 rounded-xs"
            title="重置此日行程為預設"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重置此日行程</span>
          </button>
        </div>
      </div>

      {/* Timeline Items */}
      <div className="space-y-10 relative pt-2">
        {dayData.items.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-zinc-200 rounded-sm p-6 space-y-3">
            <div className="text-4xl">📝</div>
            <p className="text-sm font-bold text-zinc-500">今日尚無行程項目</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{ color: currentTrip.themeColor }}
              className="text-xs font-bold underline"
            >
              點擊立即新增行程
            </button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`day-${currentTrip.id}-${currentDay}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {dayData.items.map((item, idx) => {
                const noteId = `${currentTrip.id}_d${currentDay}_i${idx}`;
                const itemNote = notes[noteId];

                return (
                  <TimelineItem 
                    key={`${currentTrip.id}-${currentDay}-${idx}-${item.title}`} 
                    item={item} 
                    idx={idx}
                    totalItems={dayData.items.length}
                    isLast={idx === dayData.items.length - 1} 
                    onOpenGuide={onOpenGuide}
                    themeColor={currentTrip.themeColor}
                    isKorea={currentTrip.id === 'jeju'}
                    note={itemNote}
                    onOpenNote={() => handleOpenNote(item, idx)}
                    onEdit={() => handleOpenEdit(item, idx)}
                    onMoveUp={() => handleMoveUp(idx)}
                    onMoveDown={() => handleMoveDown(idx)}
                    onDelete={() => handleDeleteItem(idx, item.title)}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Bottom Add & Reset Actions */}
        <div className="pt-6 border-t border-border flex items-center justify-between gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 text-xs font-bold py-2.5 px-4 bg-zinc-900 text-white hover:bg-zinc-800 transition-colors uppercase tracking-wider shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>新增行程至今天</span>
          </button>

          <button
            onClick={handleResetDay}
            className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-zinc-700 transition-colors py-2 px-3 border border-border hover:bg-zinc-50"
            title="重置此日行程為預設"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重置此日行程</span>
          </button>
        </div>
      </div>

      {/* Add Itinerary Item Modal */}
      <AddItineraryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        dayIndex={currentDay}
        dayTitle={dayData.title}
        onAdd={handleAddItem}
        themeColor={currentTrip.themeColor}
      />

      {/* Edit Itinerary Item Modal */}
      <EditItineraryModal
        isOpen={editModalState.isOpen}
        onClose={() => setEditModalState(prev => ({ ...prev, isOpen: false }))}
        dayIndex={currentDay}
        dayTitle={dayData.title}
        itemIndex={editModalState.itemIndex}
        item={editModalState.item}
        onSave={handleSaveEdit}
        themeColor={currentTrip.themeColor}
      />

      {/* Note Modal */}
      <NoteModal
        isOpen={noteModalState.isOpen}
        onClose={handleCloseNote}
        item={noteModalState.item}
        dayIndex={noteModalState.dayIndex}
        itemIndex={noteModalState.itemIndex}
        initialNote={currentSelectedNote}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
        themeColor={currentTrip.themeColor}
      />
    </div>
  );
};

const TimelineItem: React.FC<{ 
  item: ItineraryItem; 
  idx: number;
  totalItems: number;
  isLast: boolean; 
  onOpenGuide: (t: string, q: string) => void;
  themeColor: string;
  isKorea?: boolean;
  note?: ItineraryNote;
  onOpenNote: () => void;
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}> = ({ 
  item, 
  idx, 
  totalItems, 
  isLast, 
  onOpenGuide, 
  themeColor, 
  isKorea, 
  note, 
  onOpenNote,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDelete
}) => {
  const hasTime = Boolean(item.time && String(item.time).trim());

  return (
    <motion.div 
      layout
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="flex flex-col gap-4 relative group/item border-b border-border/40 pb-6 last:border-b-0"
    >
      <div className="flex items-center gap-4">
        {hasTime ? (
          <div 
            className="text-[11px] font-bold tracking-[0.1em] uppercase px-3 py-1 border rounded-sm shrink-0"
            style={{ 
              color: themeColor,
              borderColor: `${themeColor}40`,
              backgroundColor: `${themeColor}10`
            }}
          >
            {item.time}
          </div>
        ) : (
          <div 
            className="w-2.5 h-2.5 rounded-full border-2 shrink-0 ml-1"
            style={{ 
              borderColor: themeColor,
              backgroundColor: `${themeColor}40`
            }}
          />
        )}
        <div className="h-[1px] flex-1 bg-border/60" />

        {/* Reorder, Edit & Delete Controls */}
        <div className="flex items-center gap-1 opacity-90 transition-opacity">
          <button
            onClick={onMoveUp}
            disabled={idx === 0}
            className={cn(
              "p-1 border border-border rounded-2xs transition-colors",
              idx === 0 
                ? "text-zinc-200 cursor-not-allowed bg-zinc-50 border-zinc-100" 
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 active:scale-95"
            )}
            title="向上調整順序"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={onMoveDown}
            disabled={idx === totalItems - 1}
            className={cn(
              "p-1 border border-border rounded-2xs transition-colors",
              idx === totalItems - 1 
                ? "text-zinc-200 cursor-not-allowed bg-zinc-50 border-zinc-100" 
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 active:scale-95"
            )}
            title="向下調整順序"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onEdit}
            className="p-1 border border-sky-200 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-2xs transition-colors active:scale-95 ml-1"
            title="編輯此行程內容"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onDelete}
            className="p-1 border border-rose-200 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-2xs transition-colors active:scale-95 ml-1"
            title="刪除此行程"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      <div className="pl-2 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold tracking-tight text-zinc-900 leading-tight mb-2 uppercase">{item.title}</h3>
            {item.body && <p className="text-sm text-zinc-600 font-medium leading-relaxed mb-3 whitespace-pre-line">{item.body}</p>}
          </div>
          <div className="text-2xl mt-1 opacity-100">{item.icon}</div>
        </div>
        
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag: TagType, i: number) => {
              const colorClass = 
                tag.type === 'price' ? 'border-amber-400/40 text-amber-700 bg-amber-50' :
                tag.type === 'booking' ? 'border-rose-400/40 text-rose-700 bg-rose-50' :
                tag.type === 'food' ? 'border-emerald-400/40 text-emerald-700 bg-emerald-50' :
                tag.type === 'sight' ? 'border-sky-400/40 text-sky-700 bg-sky-50' :
                'border-border text-zinc-500 bg-surface';
              
              return (
                <span 
                  key={i} 
                  className={cn("text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 border transition-all", colorClass)}
                >
                  {tag.text}
                </span>
              );
            })}
          </div>
        )}

        {/* Action Buttons: Maps, Guide, and Note button */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          {item.map && (
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.map)}`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors"
            >
              <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                <Navigation className="w-2.5 h-2.5" />
              </div>
              Google Maps
            </a>
          )}

          {item.map && isKorea && (
            <a 
              href={`https://map.naver.com/p/search/${encodeURIComponent(item.map)}`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors"
              title="韓國推薦使用 Naver Map 導航更精準"
            >
              <div className="w-5 h-5 rounded-full border border-emerald-300 flex items-center justify-center group-hover:border-emerald-600 transition-colors">
                <Compass className="w-2.5 h-2.5" />
              </div>
              Naver 地圖
            </a>
          )}

          {item.guide && (
            <button 
              onClick={() => onOpenGuide(item.title, item.guide!)}
              className="group flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors"
            >
              <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                <BookOpen className="w-2.5 h-2.5" />
              </div>
              專家指南
            </button>
          )}

          {/* Note Button (Only opens note on click) */}
          <button 
            onClick={onOpenNote}
            className={cn(
              "group flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 transition-all rounded-xs border",
              note?.note 
                ? "bg-amber-100/90 border-amber-400 text-amber-900 font-bold shadow-2xs hover:bg-amber-200" 
                : "border-border text-zinc-500 hover:text-zinc-800 hover:border-zinc-400"
            )}
            title={note?.note ? "點擊開啟觀看/修改備註" : "點擊新增自訂備註"}
          >
            <div className={cn(
              "w-4 h-4 rounded-full flex items-center justify-center transition-colors",
              note?.note ? "bg-amber-200/80" : "border border-border group-hover:border-zinc-500"
            )}>
              <StickyNote className={cn("w-2.5 h-2.5", note?.note ? "text-amber-800 fill-amber-300" : "text-zinc-400 group-hover:text-zinc-700")} />
            </div>
            {note?.note ? "查看備註" : "備註"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
