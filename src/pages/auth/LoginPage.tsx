import React, { useState } from 'react';
import {
  LogIn,
  Eye,
  EyeOff,
  Shield,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  X,
  Lock,
} from 'lucide-react';
import { UserRole } from '../../types';

interface LoginPageProps {
  onSuccessLogin: (role: UserRole) => void;
  onClose?: () => void;
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccessLogin,
  onClose,
  onShowToast,
}) => {
  const [email, setEmail] = useState('gugusbluto01@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('super_admin');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const presets: { role: UserRole; title: string; email: string; note: string }[] = [
    {
      role: 'super_admin',
      title: 'Super Admin (Korwil/Pengawas)',
      email: 'gugusbluto01@gmail.com',
      note: 'Akses penuh seluruh modul, role akun & pengaturan sistem',
    },
    {
      role: 'pengurus',
      title: 'Pengurus KKG (Sekretaris)',
      email: 'sekretariat.kkgbluto01@gmail.com',
      note: 'Kelola agenda kegiatan, verifikasi modul, berita & arsip',
    },
    {
      role: 'bendahara',
      title: 'Bendahara KKG',
      email: 'bendahara.kkgbluto01@gmail.com',
      note: 'Kelola kas masuk/keluar, bukti kuitansi & rekap bulanan',
    },
    {
      role: 'guru',
      title: 'Guru / Anggota KKG',
      email: 'nurul.hidayati@sekolah.belajar.id',
      note: 'Akses forum, unduh/unggah modul, presensi & aspirasi',
    },
  ];

  const handleSelectPreset = (preset: typeof presets[0]) => {
    setSelectedRole(preset.role);
    setEmail(preset.email);
    setPassword('kkgbluto2026');
    onShowToast('Preset Peran Dipilih', `Masuk sebagai ${preset.title} (Demo).`, 'info');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      onShowToast('Validasi Gagal', 'Email dan password tidak boleh kosong.', 'error');
      return;
    }
    // Frontend demo session:
    onSuccessLogin(selectedRole);
    onShowToast(
      'Login Berhasil (Demo UI)',
      `Selamat datang di Dashboard KKG Gugus 01 Bluto. Siap integrasi Supabase Auth.`,
      'success'
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-xl w-full p-6 sm:p-10 shadow-2xl relative animate-in fade-in zoom-in-95">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-xl"
            aria-label="Tutup login"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Monogram */}
        <div className="text-center mb-6 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-700 via-rose-800 to-rose-950 text-amber-200 font-serif font-bold text-2xl flex items-center justify-center mx-auto shadow-md border border-rose-500/30">
            K1
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Masuk Portal KKG Gugus 01
          </h1>
          <p className="text-xs text-slate-500">
            Kecamatan Bluto · Kabupaten Sumenep · Jawa Timur
          </p>
        </div>

        {/* Quick Role Tester Buttons (Demo Convenience) */}
        <div className="mb-6 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700">Pilih Akun Demonstrasi (4 Peran):</span>
            <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-medium">
              Demo Preset
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {presets.map((p) => (
              <button
                key={p.role}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`p-2 rounded-xl text-left border transition-all ${
                  selectedRole === p.role
                    ? 'border-rose-700 bg-rose-50/70 text-rose-900 font-semibold shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-100 text-slate-700'
                }`}
              >
                <div className="font-bold truncate">{p.title}</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">{p.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Alamat Email / Akun Belajar.id *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="gugusbluto01@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-rose-700 focus:outline-none font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-medium text-slate-700">Kata Sandi (Password) *</label>
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-[11px] text-rose-800 hover:underline"
              >
                Lupa Password?
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-stone-300 focus:border-rose-700 focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Tampilkan atau sembunyikan password"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-rose-800 hover:bg-rose-900 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Dashboard ({selectedRole.replace('_', ' ')})</span>
            </button>
          </div>
        </form>

        {/* Supabase Readiness Notice */}
        <div className="mt-6 pt-5 border-t border-stone-100 text-[11px] text-slate-400 text-center space-y-1">
          <p className="flex items-center justify-center gap-1.5 text-stone-600 font-medium">
            <Lock className="w-3.5 h-3.5 text-rose-700" />
            <span>Struktur UI dirancang siap dihubungkan ke Supabase Auth</span>
          </p>
          <p>
            Tahap pertama berfokus pada kelengkapan antarmuka (UI/UX) dan hak akses 4 peran pengguna.
          </p>
        </div>

        {/* Modal Lupa Password (Demo) */}
        {isForgotPassword && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Pemulihan Kata Sandi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tautan pengaturan ulang sandi akan dikirimkan ke email terdaftar Anda saat Supabase Auth dihubungkan. Untuk demonstrasi saat ini, Anda dapat langsung mengklik tombol masuk.
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsForgotPassword(false)}
                  className="px-4 py-2 bg-rose-800 text-white text-xs font-semibold rounded-xl"
                >
                  Mengerti
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
