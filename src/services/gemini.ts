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
  return '';
}

export function setStoredGeminiApiKey(_key: string): void {
  // no-op
}

export async function scanReceipt(base64Image: string, mimeType: string): Promise<ScannedReceipt | null> {
  console.log('🚀 Starting Travel Receipt AI Scan via server endpoint...');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    let response: Response;
    try {
      response = await fetch('/api/gemini/scan-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({ base64Image, mimeType }),
      });
    } catch (fetchErr: any) {
      if (fetchErr.name === 'AbortError') {
        throw new Error('辨識請求處理時間較長，請檢查網路連線或重新嘗試');
      }
      throw fetchErr;
    } finally {
      clearTimeout(timeoutId);
    }

    if (response.status === 429) {
      throw new Error('辨識請求較頻繁，請稍後重試。');
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

    const contentType = response.headers.get('content-type') || '';
    let errJson: any = {};
    if (contentType.includes('application/json')) {
      errJson = await response.json().catch(() => ({}));
    }

    if (response.status === 504 || errJson.error === 'SERVER_GEMINI_TIMEOUT') {
      throw new Error('辨識連線逾時，請再試一次。');
    }

    throw new Error(errJson.error || `辨識失敗（HTTP ${response.status}）`);
  } catch (error: any) {
    console.error('❌ Receipt Scan Error:', error);
    throw error;
  }
}
