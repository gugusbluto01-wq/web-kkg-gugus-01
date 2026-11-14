import React, { useState, useRef, useEffect } from 'react';
import {
  Film,
  Upload,
  X,
  Sparkles,
  Download,
  AlertTriangle,
  Loader2,
  RectangleHorizontal,
  RectangleVertical,
} from 'lucide-react';

interface AnimateVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialImageUrl?: string | null;
  initialTitle?: string | null;
  onShowToast?: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
}

export const AnimateVideoModal: React.FC<AnimateVideoModalProps> = ({
  isOpen,
  onClose,
  initialImageUrl,
  initialTitle,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [prompt, setPrompt] = useState<string>(
    'Gerakan kamera sinematik perlahan mendekati momen kebersamaan guru, cahaya pagi hangat alami.'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [videoResultUrl, setVideoResultUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg(null);
    setVideoResultUrl(null);

    if (initialImageUrl) {
      setPreviewSrc(initialImageUrl);
      if (initialTitle) {
        setPrompt(
          `Animasikan foto dokumentasi "${initialTitle}" dengan gerakan kamera halus, ekspresi hangat alami, dan pencahayaan lembut.`
        );
      }
      // Convert initial image URL to base64
      fetch(initialImageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
            if (match) {
              setMimeType(match[1]);
              setImageBase64(match[2]);
            }
          };
          reader.readAsDataURL(blob);
        })
        .catch(() => {
          setErrorMsg('Gagal memuat gambar pratinjau. Silakan unggah foto langsung dari perangkat Anda.');
        });
    } else {
      setPreviewSrc(null);
      setImageBase64('');
    }
  }, [isOpen, initialImageUrl, initialTitle]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Harap pilih berkas gambar (JPG, PNG, atau WEBP).');
      return;
    }
    setErrorMsg(null);
    setVideoResultUrl(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        setPreviewSrc(dataUrl);
        setMimeType(match[1]);
        setImageBase64(match[2]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageBase64) {
      setErrorMsg('Silakan unggah foto terlebih dahulu sebelum membuat video.');
      return;
    }
    setIsGenerating(true);
    setErrorMsg(null);
    setVideoResultUrl(null);

    try {
      const response = await fetch('/api/animate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          prompt,
          aspectRatio,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghasilkan video animasi.');
      }

      if (data.videoBase64) {
        const videoMime = data.mimeType || 'video/mp4';
        const dataUri = `data:${videoMime};base64,${data.videoBase64}`;
        setVideoResultUrl(dataUri);
      } else if (data.videoUri) {
        setVideoResultUrl(data.videoUri);
      } else {
        throw new Error('Keluaran video tidak ditemukan dalam respons server.');
      }

      onShowToast?.(
        'Video Animasi Selesai',
        `Video rasio ${aspectRatio} berhasil dibuat.`,
        'success'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat video.';
      setErrorMsg(msg);
      onShowToast?.('Gagal Membuat Video', msg, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadVideo = () => {
    if (!videoResultUrl) return;
    const a = document.createElement('a');
    a.href = videoResultUrl;
    a.download = `Animasi_KKG_Bluto_${aspectRatio.replace(':', 'x')}_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onShowToast?.('Mengunduh Video', 'Berkas video animasi sedang diunduh.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 relative max-h-[92vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          aria-label="Tutup modal animasi video"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider">
            <Film className="w-4 h-4" />
            <span>Studio Dokumentasi Video KKG</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            Animasikan Foto Menjadi Video
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Unggah foto dokumentasi kegiatan sekolah dan ubah menjadi klip video bergerak dalam format lanskap (16:9) atau potret (9:16).
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4 text-xs sm:text-sm">
          {/* Upload Photo Zone */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">
              1. Pilih atau Unggah Foto Sumber *
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {previewSrc ? (
              <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                <img
                  src={previewSrc}
                  alt="Pratinjau foto untuk dianimasikan"
                  className="w-full max-h-60 object-contain mx-auto"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold rounded-lg shadow border border-stone-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-rose-700" />
                  <span>Ganti Foto</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-rose-600 rounded-xl p-8 text-center space-y-2 bg-stone-50/70 hover:bg-rose-50/30 transition-colors cursor-pointer"
              >
                <Upload className="w-8 h-8 text-rose-700 mx-auto" />
                <div className="text-xs sm:text-sm font-medium text-slate-700">
                  Klik di sini untuk memilih foto dari perangkat Anda
                </div>
                <p className="text-[11px] text-slate-400">
                  Mendukung format JPG, PNG, dan WEBP
                </p>
              </div>
            )}
          </div>

          {/* Aspect Ratio Selector */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">
              2. Rasio Aspek Video *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  aspectRatio === '16:9'
                    ? 'border-rose-700 bg-rose-50/80 text-rose-900 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-slate-700'
                }`}
              >
                <RectangleHorizontal className="w-5 h-5 text-rose-700 shrink-0" />
                <div>
                  <div className="font-bold text-xs sm:text-sm">16:9 (Lanskap)</div>
                  <div className="text-[11px] text-slate-500">Presentasi, YouTube & Website</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  aspectRatio === '9:16'
                    ? 'border-rose-700 bg-rose-50/80 text-rose-900 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-slate-700'
                }`}
              >
                <RectangleVertical className="w-5 h-5 text-rose-700 shrink-0" />
                <div>
                  <div className="font-bold text-xs sm:text-sm">9:16 (Potret)</div>
                  <div className="text-[11px] text-slate-500">Reels, Shorts & Status WhatsApp</div>
                </div>
              </button>
            </div>
          </div>

          {/* Prompt Motion Instruction */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">
              3. Arahan Gerakan Animasi
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Deskripsikan gerakan kamera atau suasana animasi yang diinginkan..."
              className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none text-xs sm:text-sm"
            />
          </div>

          {/* Error Feedback */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block font-semibold">Proses Animasi Tidak Dapat Diselesaikan</strong>
                <p className="leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Generated Video Preview */}
          {videoResultUrl && (
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-200">
                <span className="font-semibold text-amber-300">
                  Hasil Video Animasi ({aspectRatio})
                </span>
                <button
                  type="button"
                  onClick={handleDownloadVideo}
                  className="px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Video (.mp4)</span>
                </button>
              </div>
              <video
                src={videoResultUrl}
                controls
                autoPlay
                loop
                playsInline
                className={`w-full rounded-lg bg-black ${
                  aspectRatio === '9:16' ? 'max-h-96 mx-auto' : 'aspect-video'
                }`}
              />
            </div>
          )}

          {/* Submit Footer */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="submit"
              disabled={isGenerating || !imageBase64}
              className="px-5 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-900 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold shadow-sm flex items-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sedang Membuat Video...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Buat Video Animasi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
