import preGeneratedGuides from '../data/preGeneratedGuides.json';

export interface ScannedReceipt {
  date: string;
  store: string;
  amount: number;
  preTaxAmount?: number;
  items: { name: string; translatedName: string; price: number }[];
}

export function buildFallbackGuide(title: string, query?: string): string {
  const cleanTitle = title
    .replace(/\(.*?\)/g, '')
    .replace(/（.*?）/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/【.*?】/g, '')
    .replace(/^(早餐:|午餐:|晚餐:|出發|前往|住宿:|1\.|2\.|3\.|4\.|5\.|6\.)\s*/, '')
    .trim();

  const isJeju = title.includes('濟州') || (query && query.includes('濟州')) || title.includes('西歸浦') || title.includes('城山') || title.includes('牛島') || title.includes('涯月');

  return `📍 **${cleanTitle || title} - 旅遊導覽**

🌟 **特色與景點亮點**
${cleanTitle || title} 是${isJeju ? '韓國濟州島' : '旅遊行程'}中極具特色的熱門推薦點！不論是在在地特色體驗、景點打卡還是特調美食品嚐，都非常值得專程前往。

✨ **必看必吃重點**
- **特色體驗**：感受充滿在地風情的獨特氣氛，記錄旅遊美好的每一刻。
- **經典美味 / 特色伴手**：品嚐在地招牌風味餐點或人氣限定小吃，解鎖地道美味。
- **美照取景**：建議選在光線明亮或夕陽時段前來，能拍出高質感旅遊照！

💡 **旅遊小祕訣**
- **營業與候位**：熱門時段人潮較多，建議提早抵達或使用 KakaoMap / Naver Map / CatchTable 查看即時營業與候位資訊。
- **行程穿著**：若包含戶外步道或海岸地形，建議穿著舒適平底鞋並帶齊相機與隨身必備品。
- **導航導引**：建議事先儲存韓文地點名稱或電話號碼，輸入車載導航更為精準流暢！`;
}

export function getPreGeneratedGuide(title: string, query: string): string | null {
  const guideMap = preGeneratedGuides as Record<string, string>;
  const exactKey = `${title}_${query}`;
  if (guideMap[exactKey]) return guideMap[exactKey];

  if (guideMap[title]) return guideMap[title];

  // Clean title: remove parenthesized content and prefixes like "早餐: ", "晚餐: ", "1. "
  const cleanTitle = title
    .replace(/\(.*?\)/g, '')
    .replace(/（.*?）/g, '')
    .replace(/^(早餐:|午餐:|晚餐:|出發|前往|住宿:|\d+\.)\s*/, '')
    .trim();

  if (guideMap[cleanTitle]) return guideMap[cleanTitle];

  // Fuzzy match against existing keys
  for (const [k, val] of Object.entries(guideMap)) {
    if (k === exactKey || k === title || k === cleanTitle) return val;
    const [kTitle, kQuery] = k.split('_');
    if (kTitle) {
      const cleanKTitle = kTitle
        .replace(/\(.*?\)/g, '')
        .replace(/（.*?）/g, '')
        .replace(/^(早餐:|午餐:|晚餐:|出發|前往|住宿:|\d+\.)\s*/, '')
        .trim();

      if (cleanKTitle && cleanTitle && (cleanKTitle.includes(cleanTitle) || cleanTitle.includes(cleanKTitle))) {
        return val;
      }
    }
  }

  return null;
}

export async function getDestinationGuideStream(
  title: string, 
  query: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  // Check pre-generated guides first
  const cached = getPreGeneratedGuide(title, query);
  if (cached) {
    onChunk(cached);
    return;
  }

  try {
    const response = await fetch('/api/gemini/guide-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, query }),
    });

    if (!response.ok) {
      // Stream fallback guide directly instead of outputting "SERVER RESPONDED WITH 405" error
      console.warn(`Guide API returned status ${response.status}. Using fallback guide.`);
      onChunk(buildFallbackGuide(title, query));
      return;
    }

    if (!response.body) {
      onChunk(buildFallbackGuide(title, query));
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6).trim();
          if (dataStr === '[DONE]') {
            return;
          }
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.text) {
              onChunk(parsed.text);
            } else if (parsed.error) {
              onChunk(buildFallbackGuide(title, query));
            }
          } catch {
            // Raw text chunk pass-through
          }
        }
      }
    }
  } catch (error: any) {
    console.error('Gemini Guide Stream Client Error:', error);
    onChunk(buildFallbackGuide(title, query));
  }
}

export async function getDestinationGuide(title: string, query: string): Promise<string> {
  const cached = getPreGeneratedGuide(title, query);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch('/api/gemini/guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, query }),
    });

    if (!response.ok) {
      return buildFallbackGuide(title, query);
    }

    const data = await response.json();
    return data.text || buildFallbackGuide(title, query);
  } catch (error: any) {
    console.error('Gemini Guide Client Error:', error);
    return buildFallbackGuide(title, query);
  }
}

export function getStoredGeminiApiKey(): string {
  return (
    localStorage.getItem('user_gemini_api_key') ||
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (import.meta as any).env?.GEMINI_API_KEY ||
    ''
  );
}

export function setStoredGeminiApiKey(key: string): void {
  const trimmed = key.trim();
  if (trimmed) {
    localStorage.setItem('user_gemini_api_key', trimmed);
  } else {
    localStorage.removeItem('user_gemini_api_key');
  }
}

async function scanReceiptClientSide(base64Image: string, mimeType: string, customApiKey?: string): Promise<ScannedReceipt | null> {
  const apiKey = customApiKey || getStoredGeminiApiKey();
  if (!apiKey) {
    return null;
  }

  const { GoogleGenAI, Type } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `你是一個精通日文、韓文與中文的多國語言收據與發票專家。請從這張旅遊發票或收據圖檔（不論是韓國韓文發票收據、日本發票收據、還是其他各國發票）中精確提取相關資訊。

任務目標：
1. **店名 (store)**: 辨識收據最上方的店家名稱（韓文或日文原名，例如：CU, GS25, Olive Young, 樂天瑪特, 餐廳店名等）。
2. **日期 (date)**: 格式必須為 YYYY-MM-DD。若無年份則推斷為 2026 或 2025。
3. **總金額 (amount)**: 找出最後實際支付的總金額（韓國「합계 / 받을금액 / 승인금액 / 결제금액」、日本「合計 / 税込合計」）。
4. **小計/稅額 (preTaxAmount)**: 找出收據上的小計或未稅/過稅金額（「공급가액 / 부가세 / 小計」）。
5. **明細 (items)**: 
   - 提取所有消費品項。
   - name: 原始韓文/日文品項名稱。
   - translatedName: 精確且生動的繁體中文翻譯（讓旅客一眼秒懂買了什麼，例如：香蕉牛奶、黑豬肉套餐、黑咖啡等）。
   - price: 該項目的金額（數值）。`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType || 'image/jpeg',
          },
        },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: '日期 (YYYY-MM-DD)' },
          store: { type: Type.STRING, description: '店家名稱' },
          amount: { type: Type.NUMBER, description: '總金額 (合計)' },
          preTaxAmount: { type: Type.NUMBER, description: '已稅金額 (小計)' },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: '日文或韓文原名' },
                translatedName: { type: Type.STRING, description: '繁體中文翻譯' },
                price: { type: Type.NUMBER, description: '金額' },
              },
              required: ['name', 'translatedName', 'price'],
            },
          },
        },
        required: ['date', 'store', 'amount', 'items'],
      },
    },
  });

  const rawText = response.text || '{}';
  const cleanJson = rawText.replace(/```json\n?|\n?```/g, '').trim();
  const data = JSON.parse(cleanJson);

  return {
    date: data.date || new Date().toISOString().split('T')[0],
    store: data.store || '韓國/日本店家',
    amount: Number(data.amount) || 0,
    preTaxAmount: data.preTaxAmount ? Number(data.preTaxAmount) : undefined,
    items: (data.items || []).map((item: any) => ({
      name: item.name || '項目',
      translatedName: item.translatedName || '未翻譯',
      price: Number(item.price) || 0,
    })),
  };
}

export async function scanReceipt(base64Image: string, mimeType: string): Promise<ScannedReceipt | null> {
  console.log('🚀 Starting Travel Receipt AI Scan...');

  try {
    const response = await fetch('/api/gemini/scan-receipt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Image, mimeType }),
    });

    if (response.status === 429) {
      throw new Error('QUOTA_EXCEEDED');
    }

    if (response.ok) {
      const data = await response.json();
      return {
        date: data.date || new Date().toISOString().split('T')[0],
        store: data.store || '未知店家',
        amount: Number(data.amount) || 0,
        preTaxAmount: data.preTaxAmount ? Number(data.preTaxAmount) : undefined,
        items: (data.items || []).map((item: any) => ({
          name: item.name || '項目',
          translatedName: item.translatedName || '未翻譯',
          price: Number(item.price) || 0,
        })),
      };
    }

    // If server returned 405 (e.g. GitHub Pages static hosting) or 404
    if (response.status === 405 || response.status === 404) {
      console.warn(`Server endpoint returned ${response.status} (likely static GitHub Pages host). Attempting client-side scan...`);
      const clientResult = await scanReceiptClientSide(base64Image, mimeType).catch((err) => {
        console.error("Client side scan failed:", err);
        return null;
      });
      if (clientResult) {
        return clientResult;
      }
      if (!getStoredGeminiApiKey()) {
        throw new Error('NO_API_KEY_NEEDS_KEY');
      }
      throw new Error('STATIC_HOST_NO_SERVER');
    }

    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error || `Server error: ${response.status}`);
  } catch (error: any) {
    if (error.message === 'NO_API_KEY_NEEDS_KEY' || error.message === 'STATIC_HOST_NO_SERVER') {
      throw error;
    }

    // Try client-side scan fallback on network / fetch error
    try {
      const clientResult = await scanReceiptClientSide(base64Image, mimeType);
      if (clientResult) return clientResult;
    } catch {
      // ignore fallback error
    }

    if (!getStoredGeminiApiKey()) {
      throw new Error('NO_API_KEY_NEEDS_KEY');
    }

    console.error('❌ Receipt Scan Error:', error);
    if (error.message === 'QUOTA_EXCEEDED') {
      throw error;
    }
    const message = error.message || String(error);
    if (message.includes('429') || message.includes('quota')) {
      throw new Error('QUOTA_EXCEEDED');
    }
    throw error;
  }
}
