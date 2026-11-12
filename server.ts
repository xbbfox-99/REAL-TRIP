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
function getGeminiClient(customKey?: string): GoogleGenAI {
  const apiKey = (customKey && customKey.trim()) || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
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

const DEFAULT_MODEL = 'gemini-3.8-flash';

async function generateContentWithTimeout(ai: GoogleGenAI, params: any) {
  try {
    return await ai.models.generateContent({ ...params, model: DEFAULT_MODEL });
  } catch (err: any) {
    console.error(`Gemini model ${DEFAULT_MODEL} error:`, err.message || err);
    throw err;
  }
}

async function generateContentStreamWithFallback(ai: GoogleGenAI, params: any) {
  try {
    return await ai.models.generateContentStream({ ...params, model: DEFAULT_MODEL });
  } catch (err: any) {
    console.error(`Gemini stream model ${DEFAULT_MODEL} error:`, err.message || err);
    throw err;
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', hasKey: !!(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY) });
});

// Endpoint: Stream destination guide
app.post('/api/gemini/guide-stream', async (req, res) => {
  const { title, query, apiKey } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  let ai: GoogleGenAI;
  try {
    ai = getGeminiClient(apiKey);
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
    const stream = await generateContentStreamWithFallback(ai, { contents: prompt });

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
  const { title, query, apiKey } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  let ai: GoogleGenAI;
  try {
    ai = getGeminiClient(apiKey);
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
    const result = await generateContentWithTimeout(ai, { contents: prompt });
    res.json({ text: result.text || '暫時無法取得導覽資訊，請稍後再試。' });
  } catch (error: any) {
    console.error('Server Guide Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate guide' });
  }
});

// Endpoint: Multimodal receipt scanning
app.post('/api/gemini/scan-receipt', async (req, res) => {
  const { base64Image, mimeType, apiKey } = req.body;

  if (!base64Image) {
    res.status(400).json({ error: 'base64Image is required' });
    return;
  }

  let ai: GoogleGenAI;
  try {
    ai = getGeminiClient(apiKey);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'API key not configured' });
    return;
  }

  const prompt = `你是一個精通日文、韓文與中文的多國語言收據與發票專家。請從這張旅遊發票或收據圖檔（韓國/日本發票、美妝店、超商、餐廳）精確提取相關資訊：
1. store: 店家品牌與分店名稱（韓文/日文或中文，如：이니스프리 明洞店）。
2. date: 日期格式 YYYY-MM-DD。
3. amount: 最終實付金額（數值，扣除折扣後的最終結算總金額）。
4. preTaxAmount: 課稅/過稅小計金額（數值，若有）。
5. items: 提取品項名稱 (name)、繁體中文翻譯 (translatedName) 與價格 (price)。`;

  try {
    const response = await generateContentWithTimeout(ai, {
      contents: [
        prompt,
        {
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: base64Image,
          },
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            store: { type: Type.STRING, description: '店家名稱' },
            date: { type: Type.STRING, description: '日期 YYYY-MM-DD' },
            amount: { type: Type.NUMBER, description: '最終實付總金額' },
            preTaxAmount: { type: Type.NUMBER, description: '未稅/過稅金額' },
            items: {
              type: Type.ARRAY,
              description: '消費品項列表',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: '原始品項名稱' },
                  translatedName: { type: Type.STRING, description: '繁體中文翻譯' },
                  price: { type: Type.NUMBER, description: '品項金額' },
                },
                required: ['name', 'translatedName', 'price'],
              },
            },
          },
          required: ['store', 'date', 'amount', 'items'],
        },
      },
    });

    const rawText = response.text || '{}';
    let data: any = {};
    try {
      const cleanText = cleanJsonString(rawText);
      data = JSON.parse(cleanText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        try { data = JSON.parse(match[0]); } catch {}
      }
    }

    const parseNum = (val: any) => {
      if (typeof val === 'number') return isNaN(val) ? 0 : val;
      if (typeof val === 'string') {
        const cleaned = val.replace(/,/g, '').replace(/[^0-9.]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
      }
      return 0;
    };

    res.json({
      date: data.date || new Date().toISOString().split('T')[0],
      store: data.store || '日本/韓國在地店家',
      amount: parseNum(data.amount),
      preTaxAmount: data.preTaxAmount ? parseNum(data.preTaxAmount) : undefined,
      items: (data.items || []).map((item: any) => ({
        name: item.name || '項目',
        translatedName: item.translatedName || '未翻譯',
        price: parseNum(item.price),
      })),
    });
  } catch (error: any) {
    console.error('Server Receipt Scan Error:', error);
    const message = error.message || String(error);
    if (message.includes('SERVER_GEMINI_TIMEOUT')) {
      res.status(504).json({ error: 'SERVER_GEMINI_TIMEOUT' });
      return;
    }
    if (message.includes('429') || message.includes('quota') || message.includes('QUOTA')) {
      res.status(429).json({ error: 'QUOTA_EXCEEDED' });
      return;
    }
    if (message.includes('API_KEY') || message.includes('API key') || message.includes('key is not defined')) {
      res.status(500).json({ error: 'NO_API_KEY_NEEDS_KEY' });
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
