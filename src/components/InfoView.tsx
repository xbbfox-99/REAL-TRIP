import React, { useState, useEffect } from 'react';
import { Plane, Home, Utensils, ShieldAlert, ExternalLink, MapPin, Plus, X, Loader2, ThumbsUp, ThumbsDown, CheckSquare, Square, ShoppingBag, Briefcase, Trash2, ChevronRight, ListChecks, Info, Sparkles, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { db, auth } from '../lib/firebase';
import { useTrip } from '../context/TripContext';
import { 
  collection, 
  query, 
  onSnapshot, 
  setDoc, 
  doc, 
  serverTimestamp,
  deleteDoc,
  orderBy,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('Firestore Error:', errorMessage, 'Path:', path);

  if (errorMessage.includes('Failed to fetch')) {
    console.warn("Transient fetch error in Firestore operation");
    return;
  }
}

export const InfoView: React.FC = () => {
  const { currentTrip } = useTrip();
  const [activeTab, setActiveTab] = useState<'overview' | 'packing' | 'shopping'>('overview');

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Sticky Tab Header */}
      <div className="sticky top-0 z-40 bg-bg-dark/80 backdrop-blur-md border-b border-border">
        <div className="flex px-6 h-14">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "flex-[1.2] h-full text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
              activeTab === 'overview' ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
            )}
            style={activeTab === 'overview' ? { color: currentTrip.themeColor } : undefined}
          >
            概覽
            {activeTab === 'overview' && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-0.5" 
                style={{ backgroundColor: currentTrip.themeColor }}
              />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('packing')}
            className={cn(
              "flex-1 h-full text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
              activeTab === 'packing' ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
            )}
            style={activeTab === 'packing' ? { color: currentTrip.themeColor } : undefined}
          >
            行李
            {activeTab === 'packing' && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-0.5" 
                style={{ backgroundColor: currentTrip.themeColor }}
              />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('shopping')}
            className={cn(
              "flex-1 h-full text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
              activeTab === 'shopping' ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
            )}
            style={activeTab === 'shopping' ? { color: currentTrip.themeColor } : undefined}
          >
            待買
            {activeTab === 'shopping' && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-0.5" 
                style={{ backgroundColor: currentTrip.themeColor }}
              />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1">
        {activeTab === 'overview' && (
          <div className="p-6 space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Flight Section */}
            <section>
              <div className="text-xs font-black tracking-[0.3em] uppercase text-zinc-400 mb-6 flex items-center gap-4">
                <div 
                  className="w-12 h-0.5" 
                  style={{ backgroundColor: currentTrip.themeColor }}
                />
                航班資訊
              </div>
              <div className="space-y-8">
                {currentTrip.info.flights.map((flight, idx) => (
                  <FlightCard 
                    key={idx}
                    date={flight.date}
                    from={flight.from}
                    fromName={flight.fromName}
                    to={flight.to}
                    toName={flight.toName}
                    depTime={flight.depTime}
                    arrTime={flight.arrTime}
                    note={flight.note}
                    back={flight.back}
                    tripCode={currentTrip.bgCode}
                    themeColor={currentTrip.themeColor}
                  />
                ))}
              </div>
            </section>

            {/* Hotel Section */}
            <section>
              <div className="text-xs font-black tracking-[0.3em] uppercase text-zinc-400 mb-6 flex items-center gap-4">
                <div 
                  className="w-12 h-0.5"
                  style={{ backgroundColor: currentTrip.themeColor }}
                />
                住宿資訊
              </div>
              <div className="space-y-6">
                {currentTrip.info.hotels.map((hotel, idx) => (
                  <HotelCard 
                    key={idx}
                    name={hotel.name}
                    dates={hotel.dates}
                    price={hotel.price}
                    note={hotel.note}
                    link={hotel.link}
                    themeColor={currentTrip.themeColor}
                  />
                ))}
              </div>
            </section>

            {/* Travel Tips Section (if available) */}
            {currentTrip.info.tips && currentTrip.info.tips.length > 0 && (
              <section>
                <div className="text-xs font-black tracking-[0.3em] uppercase text-zinc-400 mb-6 flex items-center gap-4">
                  <div 
                    className="w-12 h-0.5"
                    style={{ backgroundColor: currentTrip.themeColor }}
                  />
                  行前須知與在地訣竅
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentTrip.info.tips.map((tip, idx) => (
                    <div 
                      key={idx}
                      className="border border-border bg-surface p-4 flex flex-col justify-between shadow-sm relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black tracking-tight text-zinc-900">{tip.title}</span>
                        {tip.tag && (
                          <span 
                            className="text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider"
                            style={{ 
                              color: currentTrip.themeColor,
                              backgroundColor: `${currentTrip.themeColor}15`
                            }}
                          >
                            {tip.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 font-medium leading-relaxed">{tip.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bookings Section */}
            {currentTrip.info.bookings && currentTrip.info.bookings.length > 0 && (
              <section>
                <div className="text-xs font-black tracking-[0.3em] uppercase text-zinc-400 mb-6 flex items-center gap-4">
                  <div className="w-12 h-0.5 bg-border" />
                  已確認預訂與門票
                </div>
                <div className="border border-border bg-surface p-6 space-y-6 shadow-sm">
                  {currentTrip.info.bookings.map((booking, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <div className="w-full h-px bg-border/50" />}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div 
                            className="text-[9px] font-black uppercase tracking-widest mb-1"
                            style={{ color: currentTrip.themeColor }}
                          >
                            {booking.category}
                          </div>
                          <div className="text-xl font-black tracking-tight uppercase text-zinc-800">{booking.name}</div>
                          <div className="text-[10px] text-zinc-400 font-bold uppercase mt-1 tracking-widest">{booking.time}</div>
                        </div>
                        <div 
                          className="text-[8px] font-black uppercase tracking-widest border px-2 py-0.5"
                          style={{ borderColor: currentTrip.themeColor, color: currentTrip.themeColor }}
                        >
                          {booking.bookedBy}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </section>
            )}

            {/* Emergency Section */}
            <section>
              <div 
                className="text-xs font-black tracking-[0.3em] uppercase mb-6 flex items-center gap-4"
                style={{ color: currentTrip.themeColor }}
              >
                <div 
                  className="w-12 h-0.5" 
                  style={{ backgroundColor: `${currentTrip.themeColor}40` }}
                />
                緊急求助與代表處
              </div>
              <div className="grid grid-cols-2 gap-4">
                {currentTrip.info.emergencies.map((em, idx) => (
                  <EmergencyCard 
                    key={idx} 
                    label={em.label} 
                    number={em.number} 
                    className={em.colSpan ? 'col-span-2 py-6' : ''} 
                    themeColor={currentTrip.themeColor}
                  />
                ))}
              </div>
            </section>

            {/* Scenery Grid Section */}
            <section className="pb-12">
              <div className="text-xs font-black tracking-[0.3em] uppercase text-zinc-400 mb-6 flex items-center gap-4">
                <div className="w-12 h-0.5 bg-border" />
                {currentTrip.name} 風景剪影
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(currentTrip.id === 'jeju' ? [
                  'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=500&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=500&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=500&auto=format&fit=crop&q=80'
                ] : [
                  'https://duk.tw/FUMSMp.jpg',
                  'https://duk.tw/25Imqx.jpg',
                  'https://duk.tw/mGOasn.jpg',
                  'https://duk.tw/VCI89S.jpg'
                ]).map((url, i) => (
                  <div key={i} className="aspect-[3/4] overflow-hidden border-2 border-zinc-900 group relative bg-zinc-100">
                    <img 
                      src={url}
                      alt={`Trip snapshot ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                ))}
              </div>
            </section>

            {/* User Upload Grid Section */}
            <section className="pb-12">
              <div className="text-xs font-black tracking-[0.3em] uppercase text-zinc-400 mb-6 flex items-center gap-4">
                <div className="w-12 h-0.5 bg-border" />
                旅伴自由上傳
              </div>
              <UserPhotoGrid themeColor={currentTrip.themeColor} />
            </section>
          </div>
        )}

        {activeTab === 'packing' && (
          <div className="p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ChecklistView 
              type="packing" 
              tripId={currentTrip.id}
              title="行李清單" 
              icon={<Briefcase className="w-4 h-4" />} 
              themeColor={currentTrip.themeColor}
            />
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ChecklistView 
              type="shopping" 
              tripId={currentTrip.id}
              title="待買清單" 
              icon={<ShoppingBag className="w-4 h-4" />} 
              themeColor={currentTrip.themeColor}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ChecklistView: React.FC<{ 
  type: 'packing' | 'shopping'; 
  tripId: string;
  title: string; 
  icon: React.ReactNode;
  themeColor: string;
}> = ({ type, tripId, title, icon, themeColor }) => {
  const [checklist, setChecklist] = useState<any>(null);
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(type === 'packing' ? '隨身行李' : '藥品');
  const [loading, setLoading] = useState(true);

  const packingCategories = ['隨身行李', '後背包', '托運行李'];
  const shoppingCategories = ['伴手禮', '美妝保養', '服飾', '其他'];
  const currentCategories = type === 'packing' ? packingCategories : shoppingCategories;

  const defaultItemsByTrip: Record<string, Record<string, { text: string, category: string }[]>> = {
    osaka: {
      packing: [
        { text: '護照 (及其影本)', category: '隨身行李' },
        { text: '日幣現金 / 信用卡', category: '隨身行李' },
        { text: 'Suica / ICOCA / 交通票券', category: '隨身行李' },
        { text: '手機 / eSIM 漫遊開通', category: '隨身行李' },
        { text: '行動電源 (需隨身攜帶)', category: '後背包' },
        { text: '充電線 / 轉接頭', category: '後背包' },
        { text: '摺疊傘 / 雨具', category: '後背包' },
        { text: '備用眼鏡 / 隱形眼鏡', category: '後背包' },
        { text: '隨身感冒藥 / 止痛藥', category: '後背包' },
        { text: '衣物 (視天數而定)', category: '托運行李' },
        { text: '盥洗用品 / 保養品', category: '托運行李' },
        { text: '休足時間 / 痠痛貼布', category: '托運行李' },
        { text: '購物用大摺疊袋', category: '托運行李' },
      ],
      shopping: [
        { text: '合利他命 EX Plus', category: '其他' },
        { text: '參天眼藥水', category: '其他' },
        { text: 'UNIQLO 限定 T', category: '服飾' },
      ]
    },
    jeju: {
      packing: [
        { text: '護照 (有效期限 6 個月以上)', category: '隨身行李' },
        { text: 'WOWPASS 卡 / T-Money 交通卡', category: '隨身行李' },
        { text: '台幣現金 (可於機台儲值) / 信用卡', category: '隨身行李' },
        { text: '國際駕照 (若規劃自駕租車)', category: '隨身行李' },
        { text: '手機 / 韓國 eSIM 網卡 (推薦 SKT/KT)', category: '隨身行李' },
        { text: '韓國轉接頭 (220V 4.8mm 雙圓孔)', category: '後背包' },
        { text: '行動電源 (需隨身攜帶)', category: '後背包' },
        { text: '防風薄外套 (海島風大必備)', category: '後背包' },
        { text: '墨鏡 / 遮陽防曬乳', category: '後背包' },
        { text: '隨身常備藥 / 暈船藥 (牛島渡輪用)', category: '後背包' },
        { text: '海邊拖鞋 / 輕便球鞋', category: '托運行李' },
        { text: '度假美衣 / 泳裝 (飯店泳池)', category: '托運行李' },
        { text: '特大摺疊購物袋 (裝橘子伴手禮)', category: '托運行李' },
      ],
      shopping: [
        { text: 'Udo Sand (牛島香濃花生夾心餅)', category: '伴手禮' },
        { text: 'Audrant Bakery (오드랑 爆漿大蒜法棍麵包)', category: '伴手禮' },
        { text: 'London Bagel Museum (倫敦貝果博物館)', category: '伴手禮' },
        { text: 'Seongsan Cookies (城山果子店手工造型餅乾)', category: '伴手禮' },
        { text: 'Accord_jeju (DIY 手作客製化專屬香水)', category: '其他' },
        { text: '樂天超市 (泡麵 / 零食 / 濟州海苔伴手禮)', category: '伴手禮' },
        { text: 'Olive Young 韓妝護膚品補貨', category: '美妝保養' },
        { text: 'My 濟州禮物 (Miffy 米飛兔專賣店小物)', category: '其他' },
        { text: '漢拏峰柑橘巧克力夾心 / 濟州橘子酒', category: '伴手禮' },
        { text: '星巴克 The 濟州 Songdang Park R 店限定杯', category: '其他' },
      ]
    }
  };

  const docId = `${tripId}_${type}`;

  useEffect(() => {
    setLoading(true);
    // Listen to docId
    const docRef = doc(db, 'checklists', docId);
    const unsubscribe = onSnapshot(docRef, async (snap) => {
      if (!snap.exists()) {
        // If osaka and legacy doc exists, check for `${type}_main`
        if (tripId === 'osaka') {
          const legacySnap = await getDoc(doc(db, 'checklists', `${type}_main`));
          if (legacySnap.exists()) {
            setChecklist({ id: docId, ...legacySnap.data() });
            setLoading(false);
            return;
          }
        }
        
        // Initialize with default items
        const defaults = (defaultItemsByTrip[tripId] && defaultItemsByTrip[tripId][type]) 
          || defaultItemsByTrip.osaka[type];
        
        const initialItems = defaults.map((item, idx) => ({
          id: `item_${Date.now()}_${idx}`,
          text: item.text,
          completed: false,
          category: item.category
        }));

        const newDocData = {
          id: docId,
          type,
          items: initialItems,
          updatedAt: serverTimestamp()
        };

        await setDoc(docRef, newDocData);
        setChecklist(newDocData);
      } else {
        setChecklist(snap.data());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [tripId, type, docId]);

  const toggleItem = async (itemId: string) => {
    if (!checklist) return;
    const updatedItems = checklist.items.map((item: any) => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    await updateDoc(doc(db, 'checklists', docId), {
      items: updatedItems,
      updatedAt: serverTimestamp()
    });
  };

  const addItem = async () => {
    if (!newItemText.trim() || !checklist) return;
    const newItem = {
      id: `item_${Date.now()}`,
      text: newItemText.trim(),
      completed: false,
      category: type === 'packing' ? selectedCategory : '其他'
    };
    await updateDoc(doc(db, 'checklists', docId), {
      items: [...checklist.items, newItem],
      updatedAt: serverTimestamp()
    });
    setNewItemText('');
  };

  const removeItem = async (itemId: string) => {
    if (!checklist) return;
    const updatedItems = checklist.items.filter((item: any) => item.id !== itemId);
    await updateDoc(doc(db, 'checklists', docId), {
      items: updatedItems,
      updatedAt: serverTimestamp()
    });
  };

  const moveItem = async (itemId: string, direction: 'up' | 'down') => {
    if (!checklist || !checklist.items) return;
    const currentFilteredIndex = filteredItems.findIndex((item: any) => item.id === itemId);
    if (currentFilteredIndex === -1) return;

    const targetFilteredIndex = direction === 'up' ? currentFilteredIndex - 1 : currentFilteredIndex + 1;
    if (targetFilteredIndex < 0 || targetFilteredIndex >= filteredItems.length) return;

    const currentItem = filteredItems[currentFilteredIndex];
    const targetItem = filteredItems[targetFilteredIndex];

    const fullIndexCurrent = checklist.items.findIndex((item: any) => item.id === currentItem.id);
    const fullIndexTarget = checklist.items.findIndex((item: any) => item.id === targetItem.id);

    if (fullIndexCurrent === -1 || fullIndexTarget === -1) return;

    const newItems = [...checklist.items];
    newItems[fullIndexCurrent] = targetItem;
    newItems[fullIndexTarget] = currentItem;

    setChecklist((prev: any) => ({ ...prev, items: newItems }));

    try {
      await updateDoc(doc(db, 'checklists', docId), {
        items: newItems,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `checklists/${docId}`);
    }
  };

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedItemId && draggedItemId !== id) {
      setDragOverItemId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverItemId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverItemId(null);
    const sourceId = draggedItemId || e.dataTransfer.getData('text/plain');
    setDraggedItemId(null);
    if (!sourceId || sourceId === targetId || !checklist?.items) return;

    const currentFilteredIndex = filteredItems.findIndex((item: any) => item.id === sourceId);
    const targetFilteredIndex = filteredItems.findIndex((item: any) => item.id === targetId);
    if (currentFilteredIndex === -1 || targetFilteredIndex === -1) return;

    const sourceItem = filteredItems[currentFilteredIndex];
    const targetItem = filteredItems[targetFilteredIndex];

    const sourceFullIndex = checklist.items.findIndex((item: any) => item.id === sourceItem.id);
    if (sourceFullIndex === -1) return;

    const newItems = [...checklist.items];
    const [removed] = newItems.splice(sourceFullIndex, 1);
    const targetFullIndex = newItems.findIndex((item: any) => item.id === targetItem.id);
    if (targetFullIndex === -1) return;

    const insertIndex = currentFilteredIndex < targetFilteredIndex ? targetFullIndex + 1 : targetFullIndex;
    newItems.splice(insertIndex, 0, removed);

    setChecklist((prev: any) => ({ ...prev, items: newItems }));

    try {
      await updateDoc(doc(db, 'checklists', docId), {
        items: newItems,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `checklists/${docId}`);
    }
  };

  const filteredItems = checklist 
    ? (type === 'packing' 
        ? checklist.items.filter((item: any) => (item.category || '隨身行李') === selectedCategory)
        : checklist.items)
    : [];

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="text-[10px] font-black uppercase tracking-widest">LOADING LIST...</span>
    </div>
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs font-black tracking-[0.3em] uppercase text-zinc-400 flex items-center gap-4">
          <div 
            className="w-8 h-0.5" 
            style={{ backgroundColor: themeColor }}
          />
          {icon}
          {type === 'packing' ? selectedCategory : title}
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[9px] font-bold text-zinc-400">
            可使用上下箭頭或拖曳調整順序
          </span>
          <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase bg-zinc-100 px-2 py-0.5 rounded-sm">
            {filteredItems.filter((i: any) => i.completed).length} / {filteredItems.length}
          </div>
        </div>
      </div>

      <div className="space-y-6 min-h-[300px]">
        {/* Category Tabs (Only for Packing List) */}
        {type === 'packing' && (
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-border/30">
            {currentCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border",
                  selectedCategory === cat 
                    ? "text-white shadow-md" 
                    : "bg-surface text-zinc-500 border-border hover:border-zinc-400"
                )}
                style={selectedCategory === cat ? { backgroundColor: themeColor, borderColor: themeColor } : undefined}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Reorderable Items List */}
        <div className="flex flex-col space-y-1.5 animate-in fade-in duration-300">
          {filteredItems.map((item: any, idx: number) => (
            <motion.div 
              layout
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e as any, item.id)}
              onDragOver={(e) => handleDragOver(e as any, item.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e as any, item.id)}
              className={cn(
                "flex items-center justify-between group py-2.5 px-3 bg-surface hover:bg-surface/90 border border-border/40 rounded-sm transition-all",
                dragOverItemId === item.id && "border-primary bg-primary/5 ring-1 ring-primary/40",
                draggedItemId === item.id && "opacity-40"
              )}
            >
              {/* Drag Handle & Up/Down Movement Controls */}
              <div className="flex items-center gap-0.5 mr-2 shrink-0">
                <div 
                  className="cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-600 p-1"
                  title="拖曳以排序"
                >
                  <GripVertical className="w-3.5 h-3.5" />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveItem(item.id, 'up');
                  }}
                  disabled={idx === 0}
                  className="p-1 text-zinc-400 hover:text-zinc-900 disabled:opacity-20 hover:bg-zinc-100 rounded transition-colors"
                  title="往上移動"
                  aria-label="往上移動"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveItem(item.id, 'down');
                  }}
                  disabled={idx === filteredItems.length - 1}
                  className="p-1 text-zinc-400 hover:text-zinc-900 disabled:opacity-20 hover:bg-zinc-100 rounded transition-colors"
                  title="往下移動"
                  aria-label="往下移動"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Checkbox and Item Name */}
              <button 
                onClick={() => toggleItem(item.id)}
                className="flex items-center gap-3 flex-1 text-left min-w-0"
              >
                {item.completed ? (
                  <div 
                    className="w-4 h-4 rounded-sm flex-shrink-0 flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: themeColor }}
                  >
                    <CheckSquare className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <div className="w-4 h-4 border-2 border-zinc-300 rounded-sm flex-shrink-0 group-hover:border-primary transition-colors" />
                )}
                <span className={cn(
                  "text-[13px] font-bold tracking-tight transition-all truncate",
                  item.completed ? "text-zinc-400 line-through decoration-zinc-400/40" : "text-zinc-800"
                )}>
                  {item.text}
                </span>
              </button>

              {/* Delete button */}
              <div className="flex items-center pl-2">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="opacity-40 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition-all"
                  title="刪除項目"
                  aria-label="刪除項目"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
          {filteredItems.length === 0 && (
            <div className="py-12 text-center text-zinc-400 text-xs font-bold uppercase tracking-widest bg-surface/30 border border-dashed border-border/50">
              尚無項目，請由下方新增
            </div>
          )}
        </div>

        {/* Add Item Input */}
        <div className="flex gap-2 pt-4">
          <input 
            type="text" 
            placeholder={type === 'packing' ? `新增到「${selectedCategory}」...` : "新增購買項目..."}
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            className="flex-1 bg-surface border border-border px-4 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-zinc-800"
          />
          <button 
            onClick={addItem}
            className="px-5 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
            style={{ backgroundColor: themeColor }}
          >
            <Plus className="w-4 h-4" /> 新增
          </button>
        </div>
      </div>
    </section>
  );
};

const FlightCard: React.FC<any> = ({ date, from, fromName, to, toName, depTime, arrTime, note, back, tripCode, themeColor }) => {
  return (
    <div className="border-t border-border pt-6 flex flex-col bg-surface hover:bg-surface/80 transition-colors px-4 pb-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col">
          <span 
            className="font-mono text-[9px] tracking-[0.2em] uppercase mb-1 font-bold"
            style={{ color: themeColor }}
          >
            {back ? '回程' : '去程'} // {tripCode}
          </span>
          <h3 className="text-4xl font-black tracking-tighter uppercase leading-none text-zinc-900">{date}</h3>
        </div>
        <Plane 
          className={cn("w-8 h-8 opacity-40", back && "rotate-180")} 
          style={{ color: themeColor }}
        />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="text-left">
          <div className="text-2xl font-black tracking-tighter uppercase text-zinc-800">{from}</div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{fromName}</div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-0 px-4">
          <div className="w-full h-1 bg-border/50 overflow-hidden">
            <div 
              className={cn("h-full animate-pulse", back ? "w-full" : "w-1/2")} 
              style={{ backgroundColor: themeColor }}
            />
          </div>
          <div className="text-[8px] font-mono text-zinc-400 mt-2 tracking-widest uppercase">直飛航班</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black tracking-tighter uppercase text-zinc-800">{to}</div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{toName}</div>
        </div>
      </div>

      <div 
        className="grid grid-cols-2 gap-4 border-l-2 pl-4 py-2"
        style={{ borderColor: `${themeColor}40` }}
      >
        <div>
          <div className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold mb-1">起飛時間</div>
          <div className="text-sm font-black text-zinc-800">{depTime}</div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold mb-1">抵達時間</div>
          <div className="text-sm font-black text-zinc-800">{arrTime}</div>
        </div>
      </div>
      
      {note && (
        <div className="mt-6 flex items-center gap-2 text-[9px] text-zinc-500 font-black uppercase tracking-widest border border-border w-fit px-3 py-1 bg-bg-dark/50">
          <MapPin className="w-3 h-3 text-zinc-400" />
          {note}
        </div>
      )}
    </div>
  );
};

const HotelCard: React.FC<any> = ({ name, dates, price, note, link, themeColor }) => (
  <div className="border-t border-border pt-6 pb-6 hover:bg-surface transition-colors px-2">
    <div className="flex justify-between items-start mb-2">
      <div 
        className="text-xs font-black tracking-widest uppercase"
        style={{ color: themeColor }}
      >
        {dates}
      </div>
      {price && <div className="text-[10px] font-mono font-bold bg-bg-dark px-2 py-0.5 border border-border uppercase text-zinc-500">{price}</div>}
    </div>
    <div className="text-xl font-black tracking-tighter uppercase mb-2 leading-tight text-zinc-800">{name}</div>
    {note && <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{note}</div>}
    {link && (
      <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 text-[9px] font-black uppercase tracking-widest group text-zinc-400 hover:text-primary transition-colors">
        <div className="w-6 h-6 rounded-none bg-bg-dark border border-border flex items-center justify-center group-hover:border-primary transition-colors">
          <ExternalLink className="w-2.5 h-2.5 group-hover:text-primary transition-colors" />
        </div>
        登記表單連結
      </a>
    )}
  </div>
);

const EmergencyCard: React.FC<any> = ({ label, number, className, themeColor }) => (
  <div className={cn("border border-border bg-surface pt-6 pb-4 px-4 flex flex-col items-center justify-center text-center shadow-sm", className)}>
    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">{label}</div>
    <div 
      className="text-3xl sm:text-4xl font-black tracking-tighter"
      style={{ color: themeColor }}
    >
      {number}
    </div>
  </div>
);

const UserPhotoGrid: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  const [photos, setPhotos] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const path = 'userPhotos';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Record<number, any> = {};
      snapshot.forEach((document) => {
        const photo = document.data();
        if (photo.slotIndex !== undefined && !data[photo.slotIndex]) {
          data[photo.slotIndex] = { id: document.id, ...photo };
        }
      });
      setPhotos(data);
      setError(null);
    }, (err) => {
      setError("無法取得相片資訊，請稍後再試。");
      handleFirestoreError(err, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(prev => ({ ...prev, [slotIndex]: true }));

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const base64 = canvas.toDataURL('image/jpeg', 0.7);

          const photoId = `slot_${slotIndex}_${Date.now()}`;
          const path = `userPhotos/${photoId}`;
          try {
            await setDoc(doc(db, 'userPhotos', photoId), {
              id: photoId,
              url: base64,
              slotIndex,
              userId: auth.currentUser?.uid || 'anon',
              userName: auth.currentUser?.displayName || '旅客',
              likes: [],
              dislikes: [],
              likesCount: 0,
              dislikesCount: 0,
              createdAt: serverTimestamp()
            });
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, path);
          }
          setLoading(prev => ({ ...prev, [slotIndex]: false }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed", error);
      setLoading(prev => ({ ...prev, [slotIndex]: false }));
    }
  };

  const handleDelete = async (slotIndex: number, photoId: string) => {
    const path = `userPhotos/${photoId}`;
    try {
      await deleteDoc(doc(db, 'userPhotos', photoId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleReaction = async (photoId: string, type: 'likes' | 'dislikes') => {
    const userId = auth.currentUser?.uid || 'anon';
    const photo = Object.values(photos).find(p => p.id === photoId);
    if (!photo) return;

    const oppositeType = type === 'likes' ? 'dislikes' : 'likes';
    const hasCurrentReaction = photo[type]?.includes(userId);
    const hasOppositeReaction = photo[oppositeType]?.includes(userId);

    const docRef = doc(db, 'userPhotos', photoId);
    const path = `userPhotos/${photoId}`;

    const countField = `${type}Count`;
    const oppositeCountField = `${oppositeType}Count`;

    try {
      if (hasCurrentReaction) {
        await updateDoc(docRef, { 
          [type]: arrayRemove(userId),
          [countField]: (photo[countField] || 1) - 1
        });
      } else {
        const updateData: any = {
          [type]: arrayUnion(userId),
          [countField]: (photo[countField] || 0) + 1
        };

        if (hasOppositeReaction) {
          updateData[oppositeType] = arrayRemove(userId);
          updateData[oppositeCountField] = (photo[oppositeCountField] || 1) - 1;
        }

        await updateDoc(docRef, updateData);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 p-3 flex items-center gap-3 text-red-600">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-tight">{error}</span>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {[...Array(8).keys()].map((slotIndex) => {
        const photo = photos[slotIndex];
        const userId = auth.currentUser?.uid || 'anon';
        const hasLiked = photo?.likes?.includes(userId);
        const hasDisliked = photo?.dislikes?.includes(userId);

        return (
          <div key={slotIndex} className="aspect-square border-2 border-zinc-900 bg-zinc-100 flex items-center justify-center relative group overflow-hidden">
            {photo ? (
              <>
                <img 
                  src={photo.url} 
                  alt={`Slot ${slotIndex}`} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => handleDelete(slotIndex, photo.id)}
                  className="absolute top-2 left-2 p-1 bg-transparent hover:bg-black/10 text-white/80 hover:text-white transition-colors z-10"
                >
                  <X className="w-3 h-3 drop-shadow-md" />
                </button>
                
                <div className="absolute bottom-1 right-1 flex gap-1 z-10">
                  <button 
                    onClick={() => handleReaction(photo.id, 'likes')}
                    className={cn(
                      "p-1.5 rounded-full transition-all flex items-center gap-1 backdrop-blur-md border border-white/20",
                      hasLiked ? "text-white shadow-lg" : "bg-black/60 text-white/70 hover:bg-black/80"
                    )}
                    style={hasLiked ? { backgroundColor: themeColor } : undefined}
                  >
                    <ThumbsUp className={cn("w-2.5 h-2.5", hasLiked && "fill-current")} />
                    {(photo.likesCount ?? 0) > 0 && (
                      <span className="text-[9px] font-bold">{photo.likesCount}</span>
                    )}
                  </button>
                  <button 
                    onClick={() => handleReaction(photo.id, 'dislikes')}
                    className={cn(
                      "p-1.5 rounded-full transition-all flex items-center gap-1 backdrop-blur-md border border-white/20",
                      hasDisliked ? "bg-zinc-800 text-white shadow-lg" : "bg-black/60 text-white/70 hover:bg-black/80"
                    )}
                  >
                    <ThumbsDown className={cn("w-2.5 h-2.5", hasDisliked && "fill-current")} />
                    {(photo.dislikesCount ?? 0) > 0 && (
                      <span className="text-[9px] font-bold">{photo.dislikesCount}</span>
                    )}
                  </button>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent text-white text-[8px] py-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center pr-20">
                  <span className="truncate max-w-[60px] font-medium">{photo.userName}</span>
                </div>
              </>
            ) : (
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-400 hover:text-primary transition-colors">
                {loading[slotIndex] ? (
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                ) : (
                  <>
                    <Plus className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest">上傳</span>
                  </>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleUpload(slotIndex, e)} 
                  disabled={!!loading[slotIndex]}
                />
              </label>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
};
