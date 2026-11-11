import { TripConfig, Day } from './types';

export const JPY_TWD = 0.213;
export const KRW_TWD = 0.024;

export const OSAKA_DAYS: Day[] = [
  { 
    label: '5/3 日', title: '台灣出發', loc: '京都市', lat: 34.985, lon: 135.758,
    items: [
      { time: '04:00', type: 'transit', icon: '🚗', title: 'Uber 出發', body: '前往小港機場 (台灣時間)' },
      { time: '04:30', type: 'transit', icon: '✈️', title: '抵達小港機場', body: '' },
      { time: '07:00', type: 'transit', icon: '🛫', title: '小港機場起飛 (IT284)', body: '航班號碼 IT284' },
      { time: '11:00', type: 'transit', icon: '🛬', title: '抵達關西機場 (KIX)', body: '日本時間 11:00' },
      { time: '12:30', type: 'misc', icon: '🍱', title: '出關 / 逛機場 / 午餐', body: '', guide: '關西機場 抵達 逛街 午餐 推薦' },
      { time: '14:44', type: 'transit', icon: '🚆', title: '搭乘 HARUKA JR 快線', body: '目前未定票 (約台幣 408*4 元)\n所需時間 1 小時 20 分鐘', map: '關西機場駅' },
      { time: '16:04', type: 'transit', icon: '🏯', title: '抵達京都車站', body: '' },
      { time: '16:30', type: 'hotel', icon: '🛏️', title: 'Hostel Kyoto Kizuna CHECK IN', body: '烏丸線五條站 5 號出口步行 4 分鐘\n¥26,484 元已付 (BOOKING明叡預定)', tags: [{ type: 'booking', text: 'BOOKING明叡預定' }, { type: 'price', text: '¥26,484 PAID' }], map: 'Hostel Kyoto Kizuna' },
      { time: '18:00', type: 'misc', icon: '😴', title: '休息結束前往東寺', body: '' },
      { time: '18:30', type: 'sight', icon: '⛩️', title: '東寺', body: '金堂・講堂夜間特別點燈\n開放時間：18:00–21:30', tags: [{ type: 'price', text: '¥1,000/人' }], map: '東寺 京都', guide: '東寺 京都 夜間點燈 歷史' },
      { time: '19:30', type: 'food', icon: '🍜', title: '京都車站吃飯', body: '京都車站拉麵小路 (10樓) / Porta 地下街 / 鐵板酒場 Hiroshi', tags: [{ type: 'food', text: '拉麵小路 10F' }, { type: 'menu', text: '鐵板酒場 Hiroshi' }], map: '京都駅 拉麵小路', guide: '京都車站拉麵小路 推薦' },
    ]
  },
  { 
    label: '5/4 一', title: '海之京都一日遊', loc: '天橋立', lat: 35.565, lon: 135.183,
    items: [
      { time: '05:50', type: 'misc', icon: '⏰', title: 'Hostel Kyoto Kizuna 起床', body: '' },
      { time: '06:30', type: 'transit', icon: '🚶', title: '出發', body: '' },
      { time: '07:00', type: 'transit', icon: '🧳', title: '京都車站寄放行李 / 超商早餐', body: '注意有無位置', map: '京都駅 コインロッカー' },
      { time: '08:00', type: 'transit', icon: '🚌', title: '集合：海之京都一日遊', body: '京都車站八条口・祭時計廣場\nkkday 偉晉預定 (台幣 9,880 元)', tags: [{ type: 'booking', text: '偉晉 KKday' }, { type: 'price', text: 'TWD 9,880' }], map: '京都駅八条口' },
      { time: '09:00', type: 'sight', icon: '🪷', title: '1. 智恩寺', body: '約40~60分鐘', map: '智恩寺 天橋立', guide: '智恩寺 天橋立 歷史 特色' },
      { time: '10:30', type: 'sight', icon: '⛩️', title: '2. 元伊勢籠神社', body: '含用餐，合計停留約 120 分鐘', map: '元伊勢籠神社', guide: '元伊勢籠神社 歷史 能量景點' },
      { time: '11:00', type: 'food', icon: '🦞', title: '3. 烤鮑魚海鮮鍋御膳套餐', body: '含於一日遊套票', tags: [{ type: 'food', text: '烤鮑魚' }], guide: '天橋立 烤鮑魚海鮮鍋 推薦' },
      { time: '13:00', type: 'sight', icon: '🚡', title: '4. 天橋立傘松公園', body: '在「府中站」搭纜車或單人吊車', map: '天橋立傘松公園', guide: '天橋立 傘松公園 昇龍觀' },
      { time: '14:00', type: 'sight', icon: '🐲', title: '5. 「股見」欣賞「昇龍觀」', body: '' },
      { time: '14:30', type: 'sight', icon: '🚤', title: '6. 漫步伊根舟屋群', body: '約 30~45 分鐘', map: '伊根舟屋', guide: '伊根舟屋 日本重要傳統建築' },
      { time: '15:00', type: 'transit', icon: '🚌', title: '回程', body: '' },
      { time: '17:30', type: 'transit', icon: '🏯', title: '預估時間到達京都', body: '' },
      { time: '18:00', type: 'hotel', icon: '🛏️', title: '取行李 Check in RESI STAY HEART', body: '¥79,300 元 (agoda 明叡預定)\n1 樓設有自助洗衣房\n(需回覆預計抵達時間)', tags: [{ type: 'price', text: '¥79,300' }, { type: 'booking', text: '明叡預定' }], map: 'RESI STAY HEART Kyoto' },
      { time: '19:00', type: 'food', icon: '🍣', title: '晚餐 / 逛街', body: '', map: '京都駅' },
    ]
  },
  { 
    label: '5/5 二', title: '鐵道博物館 × 伏見稻荷', loc: '京都市', lat: 34.985, lon: 135.758,
    items: [
      { time: '08:30', type: 'misc', icon: '⏰', title: 'RESI STAY HEART 起床', body: '' },
      { time: '09:00', type: 'transit', icon: '🚶', title: '出門 / 超商早餐', body: '' },
      { time: '10:00', type: 'sight', icon: '🚂', title: '京都鐵道博物館', body: '¥1,500 元 (未預定)', tags: [{ type: 'price', text: '¥1,500/人' }], map: '京都鉄道博物館', guide: '京都鐵道博物館 展覽 必看' },
      { time: '13:00', type: 'food', icon: '🍜', title: '離開 / 簡單午餐', body: '' },
      { time: '14:30', type: 'sight', icon: '⛩️', title: '伏見稻荷大社', body: '朱紅千本鳥居', map: '伏見稻荷大社', guide: '伏見稻荷大社 千本鳥居 歷史 攻略' },
      { time: '16:20', type: 'transit', icon: '🚶', title: '離開', body: '' },
      { time: '17:00', type: 'food', icon: '🐟', title: 'Ginsui 銀水', body: '無法預定，現場排隊', tags: [{ type: 'food', text: '現場排隊' }], map: 'Ginsui 銀水 京都', guide: '銀水 京都 鴨川 壽喜燒 推薦' },
      { time: '19:00', type: 'misc', icon: '🌊', title: '高島屋 / 鴨川附近逛逛', body: '', map: '京都高島屋', guide: '京都 高島屋 鴨川 漫步 攻略' },
    ]
  },
  { 
    label: '5/6 三', title: '清水寺晨遊 × 燒肉之夜', loc: '京都市', lat: 34.994, lon: 135.785,
    items: [
      { time: '04:30', type: 'misc', icon: '⏰', title: 'RESI STAY HEART 起床', body: '' },
      { time: '05:00', type: 'transit', icon: '🚗', title: '出門清水寺', body: '約 2.6km (uber 約日幣 2500，可以先預約)', tags: [{ type: 'price', text: 'Uber ~¥2,500' }] },
      { time: '05:10', type: 'sight', icon: '📸', title: '拍八坂通、清水通、一二三年坂', body: '' },
      { time: '06:00', type: 'sight', icon: '⛩️', title: '清水寺開門', body: '建議先直奔清水舞台 → 奧之院\n(內部御朱印/御守 08:00/08:30 開放)', map: '清水寺', guide: '清水寺 清晨 攻略 奧之院 音羽之瀑' },
      { time: '08:30', type: 'misc', icon: '🛍️', title: '逛清水寺開門店家', body: '八坂神社、星巴克二寧坂店、橡子共和國、七味家本舖、Snoopy Chocolat', tags: [{ type: 'buy', text: '逛街' }], map: '二寧坂 星巴克', guide: '清水寺 店家 推薦' },
      { time: '11:00', type: 'food', icon: '🍱', title: '午餐', body: '清水寺吃 / 京都車站吃', map: '清水寺' },
      { time: '13:00', type: 'hotel', icon: '💤', title: '飯店睡爛', body: 'RESI STAY HEART' },
      { time: '16:00', type: 'misc', icon: '🗼', title: '出門逛逛', body: '京都塔、JR 京都伊勢丹、京都站前地下街 (Porta)、東本願寺', map: '京都塔', guide: '京都車站 購物攻略' },
      { time: '19:30', type: 'food', icon: '🥩', title: '京的燒肉處 弘 京都站前店', body: '耀軒預定', tags: [{ type: 'booking', text: '耀軒預定' }, { type: 'food', text: '和牛燒肉' }], map: '京の焼肉處 弘 京都駅前店', guide: '京の燒肉處 弘 菜單 必點' },
    ]
  },
  { 
    label: '5/7 四', title: '移動大阪', loc: '大阪市', lat: 34.693, lon: 135.502,
    items: [
      { time: '07:10', type: 'misc', icon: '⏰', title: 'RESI STAY HEART 起床', body: '' },
      { time: '07:50', type: 'transit', icon: '🧳', title: '退房', body: '' },
      { time: '08:00', type: 'transit', icon: '🧳', title: '京都車站寄行李', body: '' },
      { time: '08:30', type: 'food', icon: '🥞', title: 'Kacto 早餐', body: '無預定現場排', tags: [{ type: 'food', text: '現場排隊' }], map: 'Kacto Kyoto', guide: 'Kacto Kyoto 早餐 推薦' },
      { time: '10:30', type: 'transit', icon: '🚶', title: '離開餐廳', body: '' },
      { time: '11:00', type: 'sight', icon: '🌿', title: '下鴨神社', body: '世界遺產', map: '下鴨神社', guide: '下鴨神社 歷史 特色' },
      { time: '13:30', type: 'transit', icon: '🚶', title: '離開下鴨', body: '' },
      { time: '14:10', type: 'food', icon: '🍱', title: '抵達京都車站 / 午餐簡單吃', body: '' },
      { time: '15:00', type: 'transit', icon: '🚆', title: '前往大阪', body: '東海道、山陽本線', map: '京都駅' },
      { time: '16:00', type: 'hotel', icon: '🏨', title: '東橫 INN 大阪難波 CHECK IN', body: '台幣 12,704 元 (Trip 耀軒預定)', tags: [{ type: 'price', text: 'TWD 12,704' }, { type: 'booking', text: '耀軒預定' }], map: '東橫INN大阪難波' },
      { time: '17:00', type: 'misc', icon: '🛍️', title: '逛街心齋橋筋、道頓堀漫步', body: '', guide: '大阪 心齋橋 道頓堀 購物 美食 攻略' },
      { time: '19:00', type: 'food', icon: '🥩', title: '燒肉力丸 難波道頓掘店', body: '偉晉預定', tags: [{ type: 'booking', text: '偉晉預定' }], map: '燒肉力丸 難波道頓堀店', guide: '燒肉力丸 推薦 菜單' },
    ]
  },
  { 
    label: '5/8 五', title: '勝尾寺 × 大阪', loc: '大阪市', lat: 34.693, lon: 135.502,
    items: [
      { time: '06:50', type: 'misc', icon: '⏰', title: '東橫 INN 大阪難波 起床', body: '' },
      { time: '07:30', type: 'transit', icon: '🚶', title: '出門 / 早餐', body: '' },
      { time: '08:16', type: 'transit', icon: '🚆', title: '搭車前往勝尾寺', body: '' },
      { time: '09:30', type: 'sight', icon: '🎎', title: '抵達勝尾寺', body: '達摩寺', map: '勝尾寺 大阪', guide: '勝尾寺 大阪 達摩 歷史 攻略' },
      { time: '12:00', type: 'transit', icon: '🚶', title: '離開勝尾寺', body: '' },
      { time: '12:20', type: 'transit', icon: '🚌', title: '搭乘公車', body: '' },
      { time: '13:30', type: 'food', icon: '🥘', title: 'お好み鉄板酒場どら十 (DORAJYU) 午餐', body: '大阪風鐵板燒', tags: [{ type: 'food', text: '鐵板燒' }], map: 'どら十 大阪', guide: '大阪 鐵板燒 どら十 推薦' },
      { time: '15:00', type: 'misc', icon: '🛍️', title: '吃完午餐逛街', body: '' },
      { time: '19:00', type: 'food', icon: '🍛', title: 'KUSAKA CURRY 晚餐', map: 'KUSAKA CURRY 大阪', guide: '大阪 KUSAKA CURRY 推薦' },
      { time: '23:00', type: 'food', icon: '🍜', title: '人情麵家 牛骨王 宵夜', map: '人情麺家 牛骨王 大阪', guide: '大阪 人情麵家 牛骨王 推薦' },
    ]
  },
  { 
    label: '5/9 六', title: '回家囉', loc: '關西機場', lat: 34.434, lon: 135.244,
    items: [
      { time: '06:40', type: 'misc', icon: '⏰', title: '東橫 INN 大阪難波 起床', body: '' },
      { time: '07:20', type: 'hotel', icon: '🧳', title: '退房 / 超商早餐', body: '' },
      { time: '08:10', type: 'transit', icon: '🚆', title: '搭乘南海本線', body: '前二日劃位車票 (¥970*4 人)', tags: [{ type: 'price', text: '¥3,880 total' }], map: 'なんば駅 南海' },
      { time: '08:57', type: 'transit', icon: '🛬', title: '關西機場入關 / 逛機場 / 午餐', body: '' },
      { time: '11:55', type: 'transit', icon: '🛫', title: '飛機起飛時間 (IT285)', body: '航班號碼 IT285' },
      { time: '14:00', type: 'misc', icon: '🏠', title: '抵達高雄', body: '台灣時間' },
    ]
  }
];

export const JEJU_DAYS: Day[] = [
  {
    label: '11/13 五', 
    title: '出發抵達・西歸浦首夜', 
    loc: '西歸浦市', 
    lat: 33.2483, 
    lon: 126.5638,
    items: [
      { 
        time: '16:00 -> 19:30', 
        type: 'transit', 
        icon: '🛫', 
        title: '高雄小港 16:00 -> 19:30 濟州 (虎航 IT670)', 
        body: '台灣虎航 IT670 直飛濟州國際機場 (CJU)，韓國時間 19:30 抵達',
        map: '濟州國際機場'
      },
      { 
        type: 'food', 
        icon: '🍗', 
        title: '晚餐 (二選一)', 
        body: '1. 제주스럽닭 서귀포올레점 (濟州特色炸雞 西歸浦偶來店)\n2. 濟州肥腸제주곱', 
        tags: [{ type: 'food', text: '特色炸雞 / 烤肥腸' }], 
        map: '제주스럽닭 서귀포올레점', 
        guide: '西歸浦 濟州炸雞 濟州肥腸 宵夜 推薦' 
      },
      { 
        type: 'hotel', 
        icon: '🏨', 
        title: '住宿: 바당꽃펜션 (BADANG KKOT)', 
        body: '西歸浦海景溫馨民宿',
        tags: [{ type: 'booking', text: '民宿預訂 (3晚)' }],
        map: '바당꽃펜션'
      }
    ]
  },
  {
    label: '11/14 六', 
    title: '正房瀑布・山房山與沙溪夕陽', 
    loc: '西歸浦 / 山房山', 
    lat: 33.2361, 
    lon: 126.3183,
    items: [
      { time: '07:50', type: 'misc', icon: '⏰', title: '起床', body: '' },
      { time: '08:30~08:45', type: 'transit', icon: '🚗', title: '出發', body: '' },
      { 
        type: 'food', 
        icon: '☕', 
        title: '早餐: lavarr (페이지 라바르)', 
        body: '澡堂改造復古美學咖啡廳', 
        tags: [{ type: 'food', text: '特色美學咖啡' }], 
        map: '페이지 라바르',
        guide: '페이지 라바르 咖啡 西歸浦 必訪'
      },
      { 
        time: '10:00', 
        type: 'sight', 
        icon: '🌊', 
        title: '出發正房瀑布정방폭포', 
        body: '旁邊約300公尺還有免費「小正房瀑布」，可以一起看，整趟瀑布行程約1個小時', 
        tags: [{ type: 'sight', text: '瀑布行程約1hr' }], 
        map: '정방폭포', 
        guide: '正房瀑布 小正房瀑布 西歸浦 拍照 門票' 
      },
      { 
        type: 'food', 
        icon: '🐟', 
        title: '午餐: 滿足的商會 만족한상회', 
        body: '白帶魚套餐是招牌，店員會處理魚刺', 
        tags: [{ type: 'food', text: '招牌白帶魚套餐' }], 
        map: '만족한상회', 
        guide: '滿足的商會 濟州 白帶魚套餐 推薦 去刺服務' 
      },
      { 
        type: 'sight', 
        icon: '⛰️', 
        title: '山房山 산방산、山房窟寺산방굴사(제주)', 
        body: '停留約1小時', 
        map: '산방산', 
        guide: '山房山 山房窟寺 濟州 歷史 門票 參拜' 
      },
      { 
        type: 'sight', 
        icon: '🐉', 
        title: '龍頭海岸용머리해안', 
        body: '天然海蝕絕壁奇岩步道（請留意潮汐開放時間）', 
        tags: [{ type: 'sight', text: '注意潮汐' }], 
        map: '용머리해안', 
        guide: '龍頭海岸 濟州 潮汐 開放時間 拍照攻略' 
      },
      { 
        type: 'food', 
        icon: '☕', 
        title: '山房山景觀咖啡廳', 
        body: '眺望山房山與壯闊海景', 
        map: '원앤온리 제주' 
      },
      { 
        type: 'sight', 
        icon: '🌅', 
        title: '沙溪海岸 (拍照，等夕陽)', 
        body: '特殊多孔海蝕地貌，等待浪漫夕陽', 
        map: '사계해안', 
        guide: '沙溪海岸 濟州 火星地貌 夕陽 打卡' 
      },
      { 
        type: 'food', 
        icon: '🥩', 
        title: '晚餐: 1. Donbellong 돈벨롱', 
        body: '晚餐後可在逛逛西歸浦偶來市場，類似夜市但是是室內!', 
        tags: [{ type: 'food', text: '黑豬肉烤肉' }, { type: 'buy', text: '西歸浦偶來市場' }], 
        map: '돈벨롱',
        guide: '西歸浦偶來市場 必吃 大蒜炸雞 橘子大福' 
      },
      { 
        type: 'hotel', 
        icon: '🏨', 
        title: '住宿: 바당꽃펜션 (BADANG KKOT)', 
        body: '', 
        map: '바당꽃펜션' 
      }
    ]
  },
  {
    label: '11/15 日', 
    title: '橘花閣樓・山茶花之丘與海鮮湯', 
    loc: '安德 / 濟州市', 
    lat: 33.3039, 
    lon: 126.3703,
    items: [
      { time: '08:50', type: 'misc', icon: '⏰', title: '起床', body: '' },
      { time: '09:30', type: 'transit', icon: '🚗', title: '出發', body: '' },
      { 
        type: 'food', 
        icon: '🍊', 
        title: '早餐: 橘花閣樓카페 귤꽃다락', 
        body: '柑橘庭園復古美學咖啡廳', 
        tags: [{ type: 'food', text: '橘子庭園咖啡' }], 
        map: '귤꽃다락', 
        guide: '카페 귤꽃다락 濟州 柑橘園 咖啡廳 推薦' 
      },
      { 
        time: '11:00', 
        type: 'sight', 
        icon: '🌺', 
        title: '出發 山茶花之丘카멜리아 힐', 
        body: '11 月份山茶花花季盛開，粉黛亂子草與落羽松林超夢幻', 
        tags: [{ type: 'price', text: '門票 ₩10,000' }, { type: 'sight', text: '11月山茶花季' }], 
        map: '카멜리아힐', 
        guide: '山茶花之丘 濟州 11月 花期 拍照 攻略' 
      },
      { 
        time: '13:30', 
        type: 'food', 
        icon: '🥐', 
        title: '前往 濟州堂제주당', 
        body: '超大型自然採光庭園烘焙麵包咖啡館', 
        tags: [{ type: 'food', text: '大型庭園烘焙' }], 
        map: '제주당 베이커리' 
      },
      { 
        type: 'sight', 
        icon: '🦙', 
        title: '晨星朋友새별프렌즈', 
        body: '晨星岳旁可愛羊駝、水豚君互動體驗', 
        tags: [{ type: 'sight', text: '羊駝水豚互動' }], 
        map: '새별프렌즈', 
        guide: '새별프렌즈 晨星朋友 羊駝 水豚 門票 體驗' 
      },
      { 
        type: 'food', 
        icon: '🍲', 
        title: '晚餐: 三姓穴海鮮湯 本店삼성혈해물탕 본점', 
        body: '活章魚、九孔鮑魚生猛海鮮鍋', 
        tags: [{ type: 'food', text: '生猛活海鮮鍋' }], 
        map: '삼성혈해물탕 본점', 
        guide: '三姓穴海鮮湯 本店 菜單 活章魚 鮑魚鍋 推薦' 
      },
      { 
        type: 'hotel', 
        icon: '🏨', 
        title: '住宿: 바당꽃펜션 (BADANG KKOT)', 
        body: '', 
        map: '바당꽃펜션' 
      }
    ]
  },
  {
    label: '11/16 一', 
    title: '城山日出峰・牛島與熟成到', 
    loc: '城山 / 牛島 / 濟州市', 
    lat: 33.4583, 
    lon: 126.9425,
    items: [
      { 
        type: 'sight', 
        icon: '⛰️', 
        title: '城山日出峰성산일출봉', 
        body: 'UNESCO 世界自然遺產，登頂眺望碧海天際線', 
        tags: [{ type: 'price', text: '門票 ₩5,000' }], 
        map: '성산일출봉', 
        guide: '城山日出峰 步道 火山口 世界遺產 攻略' 
      },
      { 
        type: 'food', 
        icon: '🍪', 
        title: '步行到 Seongsan Cookies성산과자점', 
        body: '城山造型可愛手作餅乾小點', 
        tags: [{ type: 'buy', text: '造型餅乾' }], 
        map: '성산과자점' 
      },
      { 
        type: 'food', 
        icon: '☕', 
        title: '開車前往 Cafe The Light카페더라이特', 
        body: '正面欣賞城山日出峰落地窗海景咖啡', 
        map: '카페더라이트' 
      },
      { 
        type: 'transit', 
        icon: '🚢', 
        title: '開車前往 城山浦港停車場성산포항 공영 주차장，準備買船票去牛島', 
        body: '填乘船申告書、購票搭船前往牛島', 
        tags: [{ type: 'price', text: '來回船票' }], 
        map: '성산포항 공영 주차장' 
      },
      { 
        type: 'misc', 
        icon: '🛵', 
        title: '順時針繞完牛島', 
        body: '租電動車順時針環島巡禮', 
        map: '산호해수욕장' 
      },
      { 
        type: 'sight', 
        icon: '🏖️', 
        title: 'Hongjodangoe (Coralsand beach)西濱白沙灘(不過風可能蠻大，應該無法拍照)', 
        body: '紅藻石白沙灘與清澈玻璃海', 
        map: '산호해수욕장' 
      },
      { 
        type: 'food', 
        icon: '🍔', 
        title: '午餐 (二選一)', 
        body: '1. 哈哈呵呵 牛島店하하호호 우도점 (厚切花生黑豬漢堡)\n2. On-off 炸豬排專賣店온오프 (爆漿起司黑豬炸豬排)', 
        tags: [{ type: 'food', text: '花生漢堡 / 起司豬排' }], 
        map: '하하호호 우도점', 
        guide: '牛島 美食 哈哈呵呵漢堡 On-off炸豬排 必吃' 
      },
      { 
        type: 'food', 
        icon: '🥪', 
        title: '路上看到 Udo Sand就直接進去買', 
        body: '牛島限定花生夾心餅乾', 
        tags: [{ type: 'buy', text: '牛島花生夾心餅' }], 
        map: '우도샌드' 
      },
      { 
        type: 'food', 
        icon: '🥯', 
        title: 'London Bagel Museum 倫敦貝果 (來得及的話就去買)', 
        body: '人氣貝果名店', 
        tags: [{ type: 'buy', text: '來得及就去買！' }], 
        map: '런던베이글뮤지엄 제주', 
        guide: '倫敦貝果博物館 濟州店 排隊 必吃 攻略' 
      },
      { 
        type: 'food', 
        icon: '🥖', 
        title: 'Audrant Bakery(大蒜麵包)', 
        body: '招牌爆漿濃郁蒜香法棍', 
        tags: [{ type: 'buy', text: '招牌大蒜麵包' }], 
        map: '오드랑베이커리' 
      },
      { 
        type: 'misc', 
        icon: '🛍️', 
        title: '東門市場 동문재래시장+中央地下街제주시중앙지하상가', 
        body: '傳統市場採購伴手禮、逛地下街', 
        map: '동문재래시장' 
      },
      { 
        type: 'food', 
        icon: '🥩', 
        title: '晚餐: 熟成到', 
        body: '濟州必吃頂級熟成黑豬肉', 
        tags: [{ type: 'food', text: '熟成黑豬肉' }], 
        map: '숙성도 노형본점', 
        guide: '숙성도 熟成到 濟州 黑豬肉 排隊 必點 菜單' 
      },
      { 
        type: 'hotel', 
        icon: '🏨', 
        title: '住宿: Cony Ocean Suite', 
        body: '濟州市海景公寓套房', 
        tags: [{ type: 'booking', text: '市區住宿 (2晚)' }], 
        map: 'Cony Ocean Suite' 
      }
    ]
  },
  {
    label: '11/17 二', 
    title: '涯月・天娥溪谷賞楓・Snoopy與採購', 
    loc: '涯月 / 漢拏山 / 濟州市', 
    lat: 33.4619, 
    lon: 126.3114,
    items: [
      { 
        type: 'food', 
        icon: '☕', 
        title: '早餐: 涯月咖啡街', 
        body: '海岸散步路海景咖啡', 
        map: '애월카페거리' 
      },
      { 
        type: 'sight', 
        icon: '🌈', 
        title: '道頭洞彩虹海岸道路(도두동 무지개 해안도로)、犁湖紅白馬燈塔', 
        body: '七彩方塊防波堤與可愛紅白小馬燈塔打卡拍照', 
        map: '도두동 무지개 해안도로', 
        guide: '彩虹海岸道路 紅白馬燈塔 濟州 打卡 拍照 攻略' 
      },
      { 
        type: 'misc', 
        icon: '🧪', 
        title: 'Accord_jeju (DIY香水)', 
        body: '調配專屬香氣香水', 
        tags: [{ type: 'booking', text: '手作香水預約' }], 
        map: '어코드 제주' 
      },
      { 
        type: 'sight', 
        icon: '🍁', 
        title: '天娥溪谷 (可賞楓)', 
        body: '11 月中旬秋季限定賞楓秘境', 
        tags: [{ type: 'sight', text: '秋季賞楓' }], 
        map: '천아계곡', 
        guide: '天娥溪谷 濟州 楓葉 11月 最佳賞楓時機 路線' 
      },
      { 
        type: 'sight', 
        icon: '🐶', 
        title: 'snoppy garden', 
        body: '史努比主題自然庭園步道與展覽', 
        tags: [{ type: 'price', text: '門票 ₩18,000' }], 
        map: '스누피가든', 
        guide: 'Snoopy Garden 濟州 史努比 戶外園區 必拍' 
      },
      { 
        type: 'food', 
        icon: '☕', 
        title: '星巴克The济州Songdang Park R店', 
        body: '全韓最大特等門市與庭園', 
        map: '스타벅스 더제주송당파크R점' 
      },
      { 
        type: 'food', 
        icon: '🍜', 
        title: '午餐: 偶來麵條', 
        body: '濃郁豬骨白湯排隊麵條', 
        tags: [{ type: 'food', text: '排隊豬肉麵' }], 
        map: '올래국수', 
        guide: '올래국수 偶來麵條 濟州 豬肉湯麵 必吃' 
      },
      { 
        type: 'misc', 
        icon: '🛍️', 
        title: '逛街行程: 樂天超市롯데마트 제주점/大創、Olive YOUNG、My濟州禮物(Miffy)', 
        body: '市區伴手禮、美妝、生活用品集中採買', 
        tags: [{ type: 'buy', text: '樂天超市/OliveYoung/Miffy' }], 
        map: '롯데마트 제주점' 
      },
      { 
        type: 'food', 
        icon: '🍲', 
        title: '晚餐: 豬肉湯飯', 
        body: '熱騰騰濟州道地豬肉湯飯', 
        tags: [{ type: 'food', text: '道地豬肉湯飯' }], 
        map: '濟州 豬肉湯飯' 
      },
      { 
        time: '20:30', 
        type: 'transit', 
        icon: '🚗', 
        title: '20:30 還車', 
        body: '租車歸還手續', 
        tags: [{ type: 'booking', text: '20:30還車' }] 
      },
      { 
        type: 'hotel', 
        icon: '🏨', 
        title: '住宿: Cony Ocean Suite', 
        body: '', 
        map: 'Cony Ocean Suite' 
      }
    ]
  },
  {
    label: '11/18 三', 
    title: '美味早餐・滿載歸賦', 
    loc: '濟州市', 
    lat: 33.5104, 
    lon: 126.5282,
    items: [
      { 
        type: 'food', 
        icon: '🍳', 
        title: '早餐: EggDrop or 恩熙解酒湯(豬肉湯飯)', 
        body: '起司歐姆蛋吐司 或 鮮辣解酒湯飯 (二選一)', 
        tags: [{ type: 'food', text: '人氣早餐' }], 
        map: '은희네해장국', 
        guide: '은희네해장국 恩熙解酒湯 EggDrop 濟州 推薦' 
      },
      { 
        time: '11:15 -> 12:35', 
        type: 'transit', 
        icon: '🛫', 
        title: '濟州11:15 -> 12:35高雄小港 (虎航 IT675)', 
        body: '台灣虎航 IT675 直飛，韓國時間 11:15 起飛，台灣時間 12:35 抵達高雄小港機場，平安返家！' 
      }
    ]
  }
];

export const TRIPS: Record<string, TripConfig> = {
  osaka: {
    id: 'osaka',
    name: '大阪・京都',
    country: '日本',
    flag: '🇯🇵',
    cityEn: 'OSAKA',
    year: '2026',
    dateRange: '5月03日 — 5月09日',
    durationLabel: '7 天',
    tagSeason: '春季版',
    bgCode: 'JP',
    themeColor: '#A6301A',
    headerGradient: 'from-[#A6301A] to-[#7f2413]',
    currency: 'JPY',
    currencySymbol: '¥',
    exchangeRate: JPY_TWD,
    members: ['耀軒', '偉晉', '小六', '明叡'],
    memberColors: ['#e94560', '#f5a623', '#06d6a0', '#c77dff'],
    categories: ['🍜 餐飲', '🚃 交通', '🎡 景點', '🛍️ 購物', '🏨 住宿', '📦 其他'],
    days: OSAKA_DAYS,
    info: {
      flights: [
        {
          date: '5月03日',
          from: 'KHH', fromName: '高雄',
          to: 'KIX', toName: '大阪關西',
          depTime: '07:00', arrTime: '11:00',
          note: 'IT284 航班 // 04:00 UBER 出發'
        },
        {
          date: '5月09日',
          from: 'KIX', fromName: '大阪關西',
          to: 'KHH', toName: '高雄',
          depTime: '11:55', arrTime: '14:00',
          note: 'IT285 航班 // 08:10 南海電鐵',
          back: true
        }
      ],
      hotels: [
        {
          name: 'Hostel Kyoto Kizuna',
          dates: '05/03 – 05/04',
          price: '¥26,484 (已付)',
          note: 'BOOKING明叡預定 // 五條站 5 號出口步行 4 分鐘',
          link: 'https://forms.zohopublic.jp/suninc/form/hostelkizunabookingGuestRegister/formperma/Dm4nrTHLLMDMcYe0PVNFYMfAlqxs3OArUvok-7zAmPI'
        },
        {
          name: 'RESI STAY HEART',
          dates: '05/04 – 05/07',
          price: '¥79,300',
          note: 'Agoda 明叡預定 // 需回覆預計抵達時間 // 1 樓有洗衣房'
        },
        {
          name: '東橫 INN 大阪難波',
          dates: '05/07 – 05/09',
          price: 'TWD 12,704',
          note: 'Trip.com 耀軒預定'
        }
      ],
      bookings: [
        {
          category: '京都 / 燒肉',
          name: '京の燒肉處 弘',
          time: '5月06日 (三) 19:30 // 京都站前店',
          bookedBy: '耀軒預定'
        },
        {
          category: '大阪 / 燒肉',
          name: '燒肉力丸',
          time: '5月07日 (四) 19:00 // 難波道頓堀店',
          bookedBy: '偉晉預定'
        },
        {
          category: '海之京都一日遊',
          name: '伊根 / 天橋立',
          time: '5月04日 (一) 08:00 AM // 京都站八条口',
          bookedBy: '偉晉 (KKday)'
        }
      ],
      emergencies: [
        { label: '警察', number: '110' },
        { label: '救護車 / 火警', number: '119' },
        { label: '外交部急難救助', number: '+886 800-085-095', colSpan: true }
      ]
    }
  },
  jeju: {
    id: 'jeju',
    name: '韓國・濟州島',
    country: '韓國',
    flag: '🇰🇷',
    cityEn: 'JEJU',
    year: '2026',
    dateRange: '11月13日 — 11月18日',
    durationLabel: '6 天',
    tagSeason: '秋季賞楓版',
    bgCode: 'JEJU',
    themeColor: '#EA580C',
    headerGradient: 'from-[#EA580C] to-[#C2410C]',
    currency: 'KRW',
    currencySymbol: '₩',
    exchangeRate: KRW_TWD,
    members: ['菁菁', '恩齊', '明叡'],
    memberColors: ['#EC4899', '#3B82F6', '#10B981'],
    categories: ['🍜 餐飲', '🚕 交通', '🏝️ 景點', '🛍️ 購物', '🏨 住宿', '☕ 咖啡', '📦 其他'],
    days: JEJU_DAYS,
    info: {
      flights: [
        {
          date: '11月13日 (五)',
          from: 'KHH', fromName: '高雄小港',
          to: 'CJU', toName: '濟州國際機場',
          depTime: '16:00', arrTime: '19:30',
          note: '台灣虎航 IT670 直飛航班 // 航程約 2.5 小時 // 入境租車'
        },
        {
          date: '11月18日 (三)',
          from: 'CJU', fromName: '濟州國際機場',
          to: 'KHH', toName: '高雄小港',
          depTime: '11:15', arrTime: '12:35',
          note: '台灣虎航 IT675 直飛航班 // 提早 2 小時至機場辦理海關退稅',
          back: true
        }
      ],
      hotels: [
        {
          name: '바당꽃펜션 (BADANG KKOT)',
          dates: '11/13 – 11/16 (3晚)',
          price: '西歸浦海景民宿',
          note: '面朝大海放鬆首選，近正房瀑布、山房山與西歸浦每日偶來市場'
        },
        {
          name: 'Cony Ocean Suite',
          dates: '11/16 – 11/18 (2晚)',
          price: '濟州市海景公寓',
          note: '近東門市場、中央地下街與樂天超市，方便最後兩天購物採買與搭機'
        }
      ],
      bookings: [
        {
          category: '濟州 / 熟成黑豬肉',
          name: '熟成到 (숙성도 熟成度)',
          time: '11/16 (一) 19:45 晚餐 // 必吃排隊名店',
          bookedBy: 'CatchTable 排隊候位'
        },
        {
          category: '手作香水體驗',
          name: 'Accord_jeju (DIY 調香香水)',
          time: '11/17 (二) 10:45 // 客製化專屬濟州香氣',
          bookedBy: '線上預約'
        },
        {
          category: '牛島渡輪與環島租車',
          name: '城山浦港 ⇋ 牛島渡輪 + 環島電動車',
          time: '11/16 (一) 11:30 // 城山浦港公營停車場購票',
          bookedBy: '現場購票 (需帶護照)'
        },
        {
          category: '租車自駕',
          name: '濟州租車 (機場取車 ➔ 11/17 20:30 還車)',
          time: '11/13 20:00 取車 // 11/17 20:30 還車',
          bookedBy: '租車預約'
        }
      ],
      emergencies: [
        { label: '韓國警察', number: '112' },
        { label: '火警 / 急救', number: '119' },
        { label: '韓國觀光公社 (24hr 中文專線)', number: '1330' },
        { label: '駐韓國台北代表部急難救助', number: '+82-10-9080-2761', colSpan: true }
      ],
      tips: [
        {
          title: '租車自駕與導航',
          content: '濟州島租車自駕非常舒服！需準備台灣駕照、國際駕照（IDP）與護照。韓國導航建議使用車載導航（輸入電話號碼精準搜尋）或手機下載 KakaoMap / Naver Map。11/17 20:30 記得準時還車。',
          tag: '自駕'
        },
        {
          title: '秋季賞楓與花期 (11月中旬)',
          content: '11月中旬是濟州島天娥溪谷（漢拏山）最美楓紅時期，巨石溪谷鋪滿金紅秋葉；山茶花之丘 (Camellia Hill) 正好進入初花期與粉黛亂子草尾聲，拍照光線極佳。',
          tag: '季節'
        },
        {
          title: '支付與 WOWPASS',
          content: '韓國幾乎全店支援刷卡或行動支付。可於機場機台開通 WOWPASS 卡（用台幣現鈔直接換匯存入韓元），卡片具備 T-money 交通卡功能，搭公車或超商消費皆通用。',
          tag: '換匯'
        },
        {
          title: '電壓與轉換插頭',
          content: '韓國電壓為 220V / 60Hz，插頭形狀為兩腳圓形（直徑 4.8mm，歐洲/德規規格），台灣一般雙扁插頭記得攜帶轉接頭。',
          tag: '電器'
        }
      ]
    }
  }
};
