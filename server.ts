import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '25mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/animate-video', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({
          error:
            'Kunci API Gemini (GEMINI_API_KEY) belum dikonfigurasi pada server. Silakan atur kunci API berbayar di panel Settings > Secrets.',
        });
      }

      const { imageBase64, mimeType, prompt, aspectRatio } = req.body as {
        imageBase64?: string;
        mimeType?: string;
        prompt?: string;
        aspectRatio?: string;
      };

      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return res.status(400).json({ error: 'Data foto (base64) wajib disertakan.' });
      }

      const validMimeType =
        mimeType && mimeType.startsWith('image/') ? mimeType : 'image/jpeg';
      const validAspectRatio: '16:9' | '9:16' =
        aspectRatio === '9:16' ? '9:16' : '16:9';
      const motionPrompt =
        prompt && prompt.trim()
          ? prompt.trim()
          : 'Animasi sinematik halus dengan gerakan kamera perlahan mendekati subjek, pencahayaan hangat dan alami.';

      const ai = new GoogleGenAI({ apiKey });

      const interaction = await ai.interactions.create(
        {
          model: 'gemini-omni-1.2-flash',
          input: [
            {
              type: 'image',
              mime_type: validMimeType,
              data: imageBase64,
            },
            {
              type: 'text',
              text: motionPrompt,
            },
          ],
          background: false,
          store: false,
          stream: false,
          response_format: {
            type: 'video',
            aspect_ratio: validAspectRatio,
          },
        },
        { timeout: 300000 }
      );

      const videoPart = interaction.output_video;
      if (!videoPart || (!videoPart.data && !videoPart.uri)) {
        return res.status(502).json({
          error: 'Model tidak mengembalikan keluaran video. Silakan coba lagi dengan foto atau deskripsi gerakan lain.',
        });
      }

      return res.json({
        videoBase64: videoPart.data || null,
        videoUri: videoPart.uri || null,
        mimeType: videoPart.mime_type || 'video/mp4',
        aspectRatio: validAspectRatio,
      });
    } catch (err: unknown) {
      const errorObj = err as { status?: number; message?: string };
      const status = typeof errorObj?.status === 'number' ? errorObj.status : 500;
      const rawMessage =
        errorObj?.message || 'Terjadi kesalahan saat memproses animasi video.';

      let friendlyMessage = rawMessage;
      if (status === 403 || rawMessage.includes('PERMISSION_DENIED') || rawMessage.includes('API_KEY_INVALID')) {
        friendlyMessage =
          'Akses API ditolak atau kunci API tidak valid. Pastikan GEMINI_API_KEY yang digunakan aktif dan berasal dari akun berbayar pada panel Settings > Secrets.';
      } else if (status === 429 || rawMessage.includes('RESOURCE_EXHAUSTED')) {
        friendlyMessage =
          'Kuota habis atau model gemini-omni-1.2-flash memerlukan kunci API berbayar. Silakan periksa billing / Secrets pada pengaturan AI Studio.';
      }

      return res.status(status >= 400 && status < 600 ? status : 500).json({
        error: friendlyMessage,
        details: rawMessage,
      });
    }
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan pada http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Gagal menjalankan server:', err);
  process.exit(1);
});
