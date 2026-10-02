import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Chat Endpoint for COWAY Product Consultation
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, productContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const lastMessage = messages[messages.length - 1]?.content || '';

    // Prepare system instructions grounded in Coway Authorized Dealer & Product knowledge
    const systemInstruction = `คุณเป็นผู้เชี่ยวชาญผลิตภัณฑ์และที่ปรึกษาด้านสุขภาพน้ำดื่มและอากาศบริสุทธิ์ของร้านตัวแทนจำหน่าย COWAY อย่างเป็นทางการในประเทศไทย (COWAY Partner)
บุคลิก: สุภาพ เป็นกันเอง จริงใจ เป็นมืออาชีพ พร้อมช่วยเหลือลูกค้าในการเลือกรุ่นที่ตอบโจทย์ชีวิตประจำวันและงบประมาณมากที่สุด
จุดเด่นของบริการ COWAY ที่ต้องอธิบายเมื่อเหมาะสม:
1. "Coway Subscription" (ระบบสมาชิกรายเดือน): มีบริการดูแลทำความสะอาด "Cody Heart Service" ทุก 2 เดือน และเปลี่ยนไส้กรองแท้ฟรีทุก 4 เดือนตลอดสัญญา ไม่มีค่าใช้จ่ายจุกจิก
2. ระบบกรองน้ำ RO (Reverse Osmosis) มาตรฐาน NSF สากล กรองละเอียดระดับ 0.0001 ไมครอน กรองคลอรีน โลหะหนัก แบคทีเรีย ไวรัส สะอาดบริสุทธิ์
3. รุ่นยอดนิยมสำหรับเครื่องกรองน้ำ:
   - Villaem II (CHP-18AR): ถังใหญ่ 11.3 ลิตร เหมาะสำหรับครอบครัว 4-8 คน ปรับน้ำได้ 4 อุณหภูมิ (ร้อน, เย็น, ปกติ, อุ่น)
   - Neo Plus (CHP-264L): รุ่นยอดฮิต สเปกคุ้มค่า ถัง 5.8 ลิตร ร้อน-เย็น-ปกติ ใช้งานง่าย เหมาะกับบ้านและคอนโด
   - Cinnamon (P-6320L): เครื่องกรองน้ำอุณหภูมิห้อง ขนาดมินิมอล กะทัดรัด ดีไซน์โมเดิร์น
   - My Ice (CHPI-7520L): ทำน้ำแข็งสะอาดบริสุทธิ์ พร้อมน้ำร้อน-เย็น-ปกติ ฟังก์ชันล้ำสมัย
   - Prime (CHP-6721L): ฟังก์ชันสัมผัสทันสมัย ระบบประหยัดพลังงาน
4. เครื่องฟอกอากาศ:
   - Storm (AP-1516D): ระบบหมุนเวียนลม 3 ทิศทาง พัดลมทรงพลัง เหมาะกับห้องขนาด 50 ตร.ม.
   - Noble (AP-2021A): เครื่องฟอกอากาศดีไซน์พรีเมียม กรองอากาศ 360 องศา ไส้กรอง 4D Double HEPA
5. การสั่งซื้อและติดตั้ง: ติดตั้งฟรีทั่วประเทศไทยโดยช่างผู้เชี่ยวชาญ พร้อมรับสิทธิ์ผ่อน/สมัครแพ็กเกจรายเดือนสะดวกผ่านบัตรเครดิตหรือหักบัญชีธนาคาร

หากลูกค้าถามข้อมูลสเปก ราคา หรือต้องการติดต่อเจ้าหน้าที่:
- อธิบายสเปกและแนะนำรุ่นที่เหมาะสมอย่างชัดเจน
- หากลูกค้าสนใจสั่งซื้อ แนะนำให้กดปุ่ม "แอด LINE" หรือ "โทรปรึกษาเจ้าหน้าที่" เพื่อรับโปรโมชั่นพิเศษประจำเดือน
- ตอบเป็นภาษาไทยที่สุภาพ ใช้สรรพนามว่า "ผม" หรือ "ทีมงาน COWAY Care"`;

    if (ai) {
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // Add context if viewing a specific product
      if (productContext) {
        contents.unshift({
          role: 'user',
          parts: [{
            text: `[บริบทสินค้าที่ลูกค้ากำลังดูอยู่: ชื่อสินค้า: ${productContext.name}, ราคา/เดือน: ${productContext.monthly_price || 'สอบถาม'} บาท, ราคาซื้อขาด: ${productContext.price || 'สอบถาม'} บาท, หมวดหมู่: ${productContext.category || 'COWAY'}, จุดเด่น: ${productContext.highlights?.join(', ') || ''}]`
          }],
        });
      }

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        if (response.text) {
          return res.json({ reply: response.text });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, using graceful knowledge fallback:', geminiError?.message);
      }
    }

    // Smart grounded fallback when Gemini is unavailable or rate-limited
    const lower = lastMessage.toLowerCase();
    let reply = 'สวัสดีครับ! ผู้เชี่ยวชาญ COWAY Partner ยินดีให้บริการครับ ไม่ทราบว่าสนใจเครื่องกรองน้ำ เครื่องฟอกอากาศ หรือสอบถามข้อมูลบริการ Cody Heart Service ด้านใดเป็นพิเศษไหมครับ?';

    if (lower.includes('ราคา') || lower.includes('ผ่อน') || lower.includes('โปรโมชั่น')) {
      reply = 'เครื่องกรองน้ำ COWAY เริ่มต้นผ่อนแบบสบายกระเป๋าเพียง 590 - 790 บาท/เดือน ฟรีค่าติดตั้ง 2,000.- พร้อมบริการ Cody ล้างถังฟรีทุก 2 เดือน และเปลี่ยนไส้กรองแท้ฟรีทุก 4 เดือนตลอดสัญญาเลยครับ! แนะนำกดปุ่ม "แอด LINE" หรือกรอกฟอร์มเพื่อรับโปรโมชั่นพิเศษประจำเดือนได้เลยครับ';
    } else if (lower.includes('รุ่น') || lower.includes('แนะนำ') || lower.includes('คอนโด') || lower.includes('2 คน') || lower.includes('คน')) {
      reply = 'สำหรับคอนโดหรือครอบครัว 1-3 คน ขอแนะนำรุ่นยอดนิยม "Neo Plus (CHP-264L)" หรือ "Cinnamon (P-6320L)" ดีไซน์มินิมอล ประหยัดพื้นที่จัดวางมากครับ ส่วนหากต้องการรุ่นที่มีทำน้ำแข็งสะอาดในตัว ขอแนะนำ "My Ice (CHPI-7520L)" หรือหากสมาชิก 4-6 คนขึ้นไป รุ่น "Villaem II (CHP-18AR)" ถังใหญ่ 11.3 ลิตร น้ำ 4 อุณหภูมิ คุ้มค่าที่สุดครับ!';
    } else if (lower.includes('ติดตั้ง') || lower.includes('cody') || lower.includes('บริการ') || lower.includes('ไส้กรอง')) {
      reply = 'จุดเด่นของ Coway Subscription คือบริการ "Heart Service" โดยทีมช่างและ Cody ผู้เชี่ยวชาญ เข้าตรวจเช็คและทำความสะอาดฆ่าเชื้อถังน้ำทุก 2 เดือน และเปลี่ยนไส้กรองแท้ให้ฟรีทุก 4 เดือนตลอดสัญญา โดยไม่มีค่าบริการหรือค่าอะไหล่แอบแฝงใดๆ เลยครับ';
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    return res.json({
      reply: 'ยินดีต้อนรับสู่ COWAY Partner ครับ! สนใจเลือกรุ่นเครื่องกรองน้ำหรือสอบถามโปรโมชั่น สามารถโทรสอบถามสายด่วน หรือกดปุ่มแอด LINE เพื่อรับสิทธิ์โปรโมชั่นล่าสุดได้ทันทีครับ',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'coway-ecommerce', timestamp: new Date().toISOString() });
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
