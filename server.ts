import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Gemini client server-side
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to clean JSON strings
function cleanJsonString(str: string): string {
  return str.replace(/```json\n?|\n?```/g, '').trim();
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', hasKey: !!process.env.GEMINI_API_KEY });
});

// Endpoint: Stream destination guide
app.post('/api/gemini/guide-stream', async (req, res) => {
  const { title, query } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  let ai: GoogleGenAI;
  try {
    ai = getGeminiClient();
  } catch (err: any) {
    console.error('Server Gemini Init Error:', err);
    res.status(500).json({ error: err.message || 'API key not configured' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const prompt = `你是一位專業的旅遊導覽專家，熟悉亞洲熱門旅遊勝地（特別是日本大阪/京都以及韓國濟州島）的所有景點、特色美食與在地文化。
請詳細介紹「${title}」，參考關鍵字：${query || ''}。

回覆要求：
1. 使用繁體中文。
2. 格式簡潔，適合手機閱讀。
3. 包含：景點故事/背景歷史、必看/必吃推薦重點、實用入園/排隊/交通與用餐小技巧。
4. 每段落開頭使用相關 emoji。
5. 語氣親切活潑實用。`;

  try {
    const stream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Server Guide Stream Error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message || 'Guide generation error' })}\n\n`);
    res.end();
  }
});

// Endpoint: Non-streaming destination guide
app.post('/api/gemini/guide', async (req, res) => {
  const { title, query } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  let ai: GoogleGenAI;
  try {
    ai = getGeminiClient();
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'API key not configured' });
    return;
  }

  const prompt = `你是一位專業的旅遊導覽專家，熟悉亞洲熱門旅遊勝地（特別是日本大阪/京都以及韓國濟州島）的所有景點、特色美食與在地文化。
請詳細介紹「${title}」，參考關鍵字：${query || ''}。

回覆要求：
1. 使用繁體中文。
2. 格式簡潔，適合手機閱讀。
3. 包含：景點故事/背景歷史、必看/必吃推薦重點、實用入園/排隊/交通與用餐小技巧。
4. 每段落開頭使用相關 emoji。
5. 語氣親切活潑實用。`;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });
    res.json({ text: result.text || '暫時無法取得導覽資訊，請稍後再試。' });
  } catch (error: any) {
    console.error('Server Guide Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate guide' });
  }
});

// Endpoint: Multimodal receipt scanning
app.post('/api/gemini/scan-receipt', async (req, res) => {
  const { base64Image, mimeType } = req.body;

  if (!base64Image) {
    res.status(400).json({ error: 'base64Image is required' });
    return;
  }

  let ai: GoogleGenAI;
  try {
    ai = getGeminiClient();
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'API key not configured' });
    return;
  }

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
   - price: 該項目的金額（數值）。

注意事項：
- 支援韓元 (KRW) 與日圓 (JPY) 發票與收據格式。
- 優先讀取印刷體文字，忽略手寫塗鴉。
- 移除數字中的逗號與幣別符號。
- 嚴格遵守 JSON 格式回傳。`;

  try {
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
    const cleanedText = cleanJsonString(rawText);
    const data = JSON.parse(cleanedText);

    res.json({
      date: data.date || new Date().toISOString().split('T')[0],
      store: data.store || '未知店家',
      amount: Number(data.amount) || 0,
      preTaxAmount: data.preTaxAmount ? Number(data.preTaxAmount) : undefined,
      items: (data.items || []).map((item: any) => ({
        name: item.name || '項目',
        translatedName: item.translatedName || '未翻譯',
        price: Number(item.price) || 0,
      })),
    });
  } catch (error: any) {
    console.error('Server Receipt Scan Error:', error);
    const message = error.message || String(error);
    if (message.includes('429') || message.includes('quota')) {
      res.status(429).json({ error: 'QUOTA_EXCEEDED' });
      return;
    }
    res.status(500).json({ error: message || 'Scan failed' });
  }
});

// Start server with Vite middleware in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
