import React, { useState } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogIn,
  GraduationCap,
  Users,
  MessageSquare,
  BookOpen,
  Calendar,
  Newspaper,
  FolderLock,
  Wallet,
  Send,
  Image,
  Phone,
  Home,
  UserCheck,
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentRole,
  onRoleChange,
  isLoggedIn,
  onOpenLogin,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownAkademik, setDropdownAkademik] = useState(false);
  const [dropdownOrganisasi, setDropdownOrganisasi] = useState(false);

  const roleLabels: Record<UserRole, { label: string; badge: string }> = {
    super_admin: { label: 'Super Admin', badge: 'bg-rose-900 text-rose-100' },
    pengurus: { label: 'Pengurus KKG', badge: 'bg-rose-800 text-rose-100' },
    bendahara: { label: 'Bendahara', badge: 'bg-amber-800 text-amber-100' },
    guru: { label: 'Guru / Anggota', badge: 'bg-stone-800 text-stone-100' },
  };

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setDropdownAkademik(false);
    setDropdownOrganisasi(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Demo Bar for Testing Role & Official Information */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-rose-300">KKG Gugus 01 Bluto</span>
            <span className="text-stone-500">·</span>
            <span className="text-stone-300 hidden sm:inline">Kabupaten Sumenep, Jawa Timur</span>
            <span className="text-stone-500 hidden sm:inline">·</span>
            <span className="text-amber-300 font-mono text-[11px]">T.A. 2026/2027</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-stone-400">Simulasi Peran:</span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-stone-800 text-amber-200 border border-stone-700 rounded px-2 py-0.5 text-[11px] focus:outline-none focus:border-rose-400 cursor-pointer"
              title="Ganti peran pengguna untuk menguji hak akses"
            >
              <option value="super_admin">Super Admin (Semua Akses)</option>
              <option value="pengurus">Pengurus KKG (Sekretariat)</option>
              <option value="bendahara">Bendahara (Keuangan)</option>
              <option value="guru">Guru SD / Anggota KKG</option>
            </select>

            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${roleLabels[currentRole].badge}`}>
              {roleLabels[currentRole].label}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Brand Zone */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-rose-700 via-rose-800 to-rose-950 text-white flex items-center justify-center font-bold text-lg md:text-xl shadow-md shadow-rose-900/10 border border-rose-600/30 shrink-0 group-hover:scale-105 transition-transform">
              <span className="tracking-tighter font-serif text-amber-200">K1</span>
            </div>
            <div>
              <div className="text-base md:text-lg font-bold text-slate-900 leading-tight tracking-tight group-hover:text-rose-800 transition-colors">
                KKG GUGUS 01 BLUTO
              </div>
              <div className="text-[11px] md:text-xs text-slate-500 font-medium tracking-wide">
                Kecamatan Bluto · Kabupaten Sumenep
              </div>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-700">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'home' ? 'text-rose-800 font-semibold bg-rose-50/70' : 'hover:text-slate-900 hover:bg-stone-100/70'
              }`}
            >
              Beranda
            </button>

            <button
              onClick={() => handleNavClick('profil')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'profil' ? 'text-rose-800 font-semibold bg-rose-50/70' : 'hover:text-slate-900 hover:bg-stone-100/70'
              }`}
            >
              Profil KKG
            </button>

            <button
              onClick={() => handleNavClick('anggota')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'anggota' ? 'text-rose-800 font-semibold bg-rose-50/70' : 'hover:text-slate-900 hover:bg-stone-100/70'
              }`}
            >
              Data Anggota
            </button>

            {/* Dropdown Akademik & Pembelajaran */}
            <div className="relative" onMouseLeave={() => setDropdownAkademik(false)}>
              <button
                onClick={() => setDropdownAkademik(!dropdownAkademik)}
                onMouseEnter={() => setDropdownAkademik(true)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  ['perangkat', 'forum', 'kegiatan'].includes(currentPage)
                    ? 'text-rose-800 font-semibold bg-rose-50/70'
                    : 'hover:text-slate-900 hover:bg-stone-100/70'
                }`}
              >
                <span>Akademik</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {dropdownAkademik && (
                <div
                  onMouseEnter={() => setDropdownAkademik(true)}
                  className="absolute left-0 top-full mt-1 w-60 bg-white border border-stone-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <button
                    onClick={() => handleNavClick('perangkat')}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-900 flex items-center gap-2.5"
                  >
                    <BookOpen className="w-4 h-4 text-rose-700 shrink-0" />
                    <div>
                      <div className="font-medium">Bank Perangkat Ajar</div>
                      <div className="text-xs text-slate-400">Modul, RPP, LKPD, Asesmen</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleNavClick('forum')}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-900 flex items-center gap-2.5"
                  >
                    <MessageSquare className="w-4 h-4 text-rose-700 shrink-0" />
                    <div>
                      <div className="font-medium">Forum Guru</div>
                      <div className="text-xs text-slate-400">Diskusi & Berbagi Praktik Baik</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleNavClick('kegiatan')}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-900 flex items-center gap-2.5"
                  >
                    <Calendar className="w-4 h-4 text-rose-700 shrink-0" />
                    <div>
                      <div className="font-medium">Program & Kegiatan</div>
                      <div className="text-xs text-slate-400">Workshop & Kalender KKG</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Dropdown Organisasi & Layanan */}
            <div className="relative" onMouseLeave={() => setDropdownOrganisasi(false)}>
              <button
                onClick={() => setDropdownOrganisasi(!dropdownOrganisasi)}
                onMouseEnter={() => setDropdownOrganisasi(true)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  ['berita', 'administrasi', 'keuangan', 'aspirasi', 'galeri', 'kontak'].includes(currentPage)
                    ? 'text-rose-800 font-semibold bg-rose-50/70'
                    : 'hover:text-slate-900 hover:bg-stone-100/70'
                }`}
              >
                <span>Organisasi</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {dropdownOrganisasi && (
                <div
                  onMouseEnter={() => setDropdownOrganisasi(true)}
                  className="absolute left-0 top-full mt-1 w-64 bg-white border border-stone-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <button
                    onClick={() => handleNavClick('berita')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-900 flex items-center gap-2.5"
                  >
                    <Newspaper className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>Berita & Pengumuman</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('administrasi')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-900 flex items-center gap-2.5"
                  >
                    <FolderLock className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>Administrasi Digital</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('keuangan')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-900 flex items-center gap-2.5"
                  >
                    <Wallet className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>Laporan Keuangan</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('aspirasi')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-900 flex items-center gap-2.5"
                  >
                    <Send className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>Aspirasi & Saran</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('galeri')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-900 flex items-center gap-2.5"
                  >
                    <Image className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>Galeri Kegiatan</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('kontak')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-900 flex items-center gap-2.5"
                  >
                    <Phone className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>Kontak & Sekretariat</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Action Zone: Login / Dashboard Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    currentPage === 'dashboard'
                      ? 'bg-rose-900 text-white shadow-sm'
                      : 'bg-rose-800 text-white hover:bg-rose-900 shadow-sm'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                <button
                  onClick={onLogout}
                  className="px-2.5 py-2 text-xs text-slate-600 hover:text-rose-800 hover:bg-stone-100 rounded-lg font-medium transition-colors"
                  title="Keluar dari akun demo"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-rose-800 rounded-xl hover:bg-rose-900 transition-colors shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Anggota</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-stone-100 transition-colors"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 text-xs mb-4 p-3 bg-stone-50 rounded-xl">
            <span className="text-slate-500 col-span-2 font-medium">Beralih Peran Demonstrasi:</span>
            {(['super_admin', 'pengurus', 'bendahara', 'guru'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => onRoleChange(r)}
                className={`py-1.5 px-2 rounded font-medium text-left transition-colors ${
                  currentRole === r ? 'bg-rose-800 text-white' : 'bg-white border border-stone-200 text-slate-700'
                }`}
              >
                {r === 'super_admin' ? 'Super Admin' : r === 'pengurus' ? 'Pengurus' : r === 'bendahara' ? 'Bendahara' : 'Guru SD'}
              </button>
            ))}
          </div>

          <div className="space-y-1 text-sm font-medium text-slate-700">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 ${
                currentPage === 'home' ? 'bg-rose-50 text-rose-800 font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <Home className="w-4 h-4 text-rose-700" />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => handleNavClick('profil')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 ${
                currentPage === 'profil' ? 'bg-rose-50 text-rose-800 font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-rose-700" />
              <span>Profil KKG</span>
            </button>

            <button
              onClick={() => handleNavClick('anggota')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 ${
                currentPage === 'anggota' ? 'bg-rose-50 text-rose-800 font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <Users className="w-4 h-4 text-rose-700" />
              <span>Data Anggota (Direktori)</span>
            </button>

            <button
              onClick={() => handleNavClick('perangkat')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 ${
                currentPage === 'perangkat' ? 'bg-rose-50 text-rose-800 font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-rose-700" />
              <span>Bank Perangkat Ajar</span>
            </button>

            <button
              onClick={() => handleNavClick('forum')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 ${
                currentPage === 'forum' ? 'bg-rose-50 text-rose-800 font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-rose-700" />
              <span>Forum Guru</span>
            </button>

            <button
              onClick={() => handleNavClick('kegiatan')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 ${
                currentPage === 'kegiatan' ? 'bg-rose-50 text-rose-800 font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <Calendar className="w-4 h-4 text-rose-700" />
              <span>Program & Kegiatan</span>
            </button>

            <button
              onClick={() => handleNavClick('berita')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 ${
                currentPage === 'berita' ? 'bg-rose-50 text-rose-800 font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <Newspaper className="w-4 h-4 text-rose-700" />
              <span>Berita & Pengumuman</span>
            </button>

            <button
              onClick={() => handleNavClick('administrasi')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 ${
                currentPage === 'administrasi' ? 'bg-rose-50 text-rose-800 font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <FolderLock className="w-4 h-4 text-rose-700" />
              <span>Administrasi KKG</span>
            </button>

            <button
              onClick={() => handleNavClick('keuangan')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 ${
                currentPage === 'keuangan' ? 'bg-rose-50 text-rose-800 font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <Wallet className="w-4 h-4 text-rose-700" />
              <span>Laporan Keuangan</span>
            </button>

            <button
              onClick={() => handleNavClick('aspirasi')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 ${
                currentPage === 'aspirasi' ? 'bg-rose-50 text-rose-800 font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <Send className="w-4 h-4 text-rose-700" />
              <span>Aspirasi & Saran</span>
            </button>

            <button
              onClick={() => handleNavClick('galeri')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 ${
                currentPage === 'galeri' ? 'bg-rose-50 text-rose-800 font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <Image className="w-4 h-4 text-rose-700" />
              <span>Galeri Kegiatan</span>
            </button>

            <button
              onClick={() => handleNavClick('kontak')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 ${
                currentPage === 'kontak' ? 'bg-rose-50 text-rose-800 font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <Phone className="w-4 h-4 text-rose-700" />
              <span>Kontak & Sekretariat</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
