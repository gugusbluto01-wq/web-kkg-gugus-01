import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Newspaper,
  FolderLock,
  Wallet,
  Send,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Home,
  Shield,
  UserCheck,
  Menu,
  X,
  FileCheck,
  CheckCircle2,
  School,
  Award,
  MessageSquare,
  Image as ImageIcon,
  Activity,
  Sliders,
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';

interface DashboardLayoutProps {
  currentRole: UserRole;
  currentUser: UserProfile;
  onRoleChange: (role: UserRole) => void;
  onNavigatePublic: (page: string) => void;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentRole,
  currentUser,
  onRoleChange,
  onNavigatePublic,
  onLogout,
  activeTab,
  onTabChange,
  children,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roleInfo: Record<UserRole, { title: string; color: string; badge: string }> = {
    super_admin: { title: 'Super Admin', color: 'text-rose-900', badge: 'bg-rose-900 text-rose-100' },
    pengurus: { title: 'Pengurus KKG', color: 'text-rose-800', badge: 'bg-rose-800 text-rose-100' },
    bendahara: { title: 'Bendahara KKG', color: 'text-amber-800', badge: 'bg-amber-800 text-amber-100' },
    guru: { title: 'Guru / Anggota', color: 'text-stone-800', badge: 'bg-stone-800 text-stone-100' },
  };

  // Role-specific sidebar menu items
  const getMenuItems = () => {
    switch (currentRole) {
      case 'super_admin':
        return [
          { id: 'overview', label: '1. Dashboard Utama', icon: LayoutDashboard },
          { id: 'users', label: '2. Manajemen Pengguna', icon: Users },
          { id: 'roles', label: '3. Manajemen Role & Hak Akses', icon: Shield },
          { id: 'anggota_mgmt', label: '4. Data Anggota', icon: UserCheck },
          { id: 'sekolah_mgmt', label: '5. Data Sekolah', icon: School },
          { id: 'struktur_mgmt', label: '6. Struktur Pengurus', icon: Award },
          { id: 'berita_mgmt', label: '7. Berita & Pengumuman', icon: Newspaper },
          { id: 'forum_mgmt', label: '8. Forum Guru', icon: MessageSquare },
          { id: 'perangkat_mgmt', label: '9. Bank Perangkat Ajar', icon: BookOpen },
          { id: 'kegiatan_mgmt', label: '10. Program & Kegiatan', icon: Calendar },
          { id: 'administrasi_mgmt', label: '11. Administrasi KKG', icon: FolderLock },
          { id: 'keuangan_mgmt', label: '12. Laporan Keuangan', icon: Wallet },
          { id: 'aspirasi_mgmt', label: '13. Aspirasi & Saran', icon: Send },
          { id: 'galeri_mgmt', label: '14. Galeri Dokumentasi', icon: ImageIcon },
          { id: 'presensi_mgmt', label: '15. Presensi Kehadiran', icon: FileCheck },
          { id: 'website_settings', label: '16. Pengaturan Website', icon: Settings },
          { id: 'audit_logs', label: '17. Log Aktivitas (Audit)', icon: Activity },
          { id: 'system_settings', label: '18. Pengaturan Sistem', icon: Sliders },
        ];
      case 'pengurus':
        return [
          { id: 'overview', label: 'Dashboard Pengurus', icon: LayoutDashboard },
          { id: 'kegiatan_mgmt', label: 'Agenda & Presensi KKG', icon: Calendar },
          { id: 'perangkat_mgmt', label: 'Verifikasi Modul Ajar', icon: BookOpen },
          { id: 'berita_mgmt', label: 'Kabar & Surat Edaran', icon: Newspaper },
          { id: 'administrasi_mgmt', label: 'Tata Persuratan & SK', icon: FolderLock },
          { id: 'aspirasi_mgmt', label: 'Kotak Masukan Guru', icon: Send },
        ];
      case 'bendahara':
        return [
          { id: 'overview', label: 'Dashboard Kas KKG', icon: LayoutDashboard },
          { id: 'transaksi_in', label: 'Penerimaan Kas (Iuran)', icon: Wallet },
          { id: 'transaksi_out', label: 'Pengeluaran Kegiatan', icon: Wallet },
          { id: 'rekap_bulanan', label: 'Rekapitulasi & Cetak', icon: FileCheck },
          { id: 'bukti_kuitansi', label: 'Arsip Kuitansi Digital', icon: FolderLock },
        ];
      case 'guru':
      default:
        return [
          { id: 'overview', label: 'Ruang Guru Saya', icon: LayoutDashboard },
          { id: 'jadwal_saya', label: 'Jadwal & Presensi Saya', icon: Calendar },
          { id: 'perangkat_saya', label: 'Perangkat Ajar Saya', icon: BookOpen },
          { id: 'forum_saya', label: 'Aktivitas Forum', icon: Users },
          { id: 'aspirasi_saya', label: 'Aspirasi & Usulan Saya', icon: Send },
          { id: 'profil_saya', label: 'Biodata Pendidik', icon: UserCheck },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-stone-100/60 flex flex-col lg:flex-row text-slate-800">
      {/* SIDEBAR DESKTOP */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-stone-200 transition-all duration-300 z-30 shrink-0 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header Brand */}
        <div className="h-16 border-b border-stone-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-700 to-rose-950 text-amber-200 font-serif font-bold text-base flex items-center justify-center shrink-0">
              K1
            </div>
            {!isSidebarCollapsed && (
              <div className="truncate">
                <div className="font-bold text-sm text-slate-900 leading-tight">KKG GUGUS 01</div>
                <div className="text-[11px] text-slate-400">Dashboard Internal</div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            title={isSidebarCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Identity In Sidebar */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-b border-stone-100 bg-stone-50/60">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="overflow-hidden">
                <div className="font-bold text-xs text-slate-900 truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{currentUser.school}</div>
                <span className={`inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-semibold ${roleInfo[currentRole].badge}`}>
                  {roleInfo[currentRole].title}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-800 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-stone-100 hover:text-slate-900'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-stone-200 space-y-1">
          <button
            onClick={() => onNavigatePublic('home')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-stone-100 hover:text-slate-900 transition-colors"
            title="Kembali ke Portal Publik"
          >
            <Home className="w-4 h-4 text-rose-700 shrink-0" />
            {!isSidebarCollapsed && <span>Ke Portal Publik</span>}
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-800 hover:bg-rose-50 transition-colors"
            title="Keluar dari Akun"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>Keluar Akun</span>}
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Dashboard */}
        <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
          {/* Mobile Menu & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-stone-100 rounded-lg"
              aria-label="Menu dashboard mobile"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <button
                onClick={() => onNavigatePublic('home')}
                className="text-slate-400 hover:text-slate-600"
              >
                Portal KKG
              </button>
              <span className="text-stone-300">/</span>
              <span className="font-semibold text-slate-800">
                Dashboard {roleInfo[currentRole].title}
              </span>
              <span className="text-stone-300 hidden sm:inline">/</span>
              <span className="text-rose-800 font-medium hidden sm:inline capitalize">
                {activeTab.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Right Top Header Actions */}
          <div className="flex items-center gap-3">
            {/* Role Switcher in Dashboard */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-slate-400">Ganti Hak Akses:</span>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-stone-50 border border-stone-200 text-slate-800 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:border-rose-700 cursor-pointer"
              >
                <option value="super_admin">Super Admin</option>
                <option value="pengurus">Pengurus KKG</option>
                <option value="bendahara">Bendahara</option>
                <option value="guru">Guru SD</option>
              </select>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-stone-100 rounded-xl transition-colors relative cursor-pointer"
                title="Pemberitahuan Sistem"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-rose-700 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-stone-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-1 text-xs">
                  <div className="font-bold text-slate-900 pb-2 mb-2 border-b border-stone-100">
                    Notifikasi Sistem KKG
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-rose-50/60 rounded-lg text-slate-700">
                      <strong className="block text-rose-900">Pertemuan Rutin 20 Nov</strong>
                      Diseminasi Asesmen Diagnostik di SDN Bluto I.
                    </div>
                    <div className="p-2 bg-stone-50 rounded-lg text-slate-700">
                      <strong className="block text-slate-900">Modul Baru Diunggah</strong>
                      Modul IPAS Pesisir Fase B oleh Nurul Hidayati.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Public Portal Link */}
            <button
              onClick={() => onNavigatePublic('home')}
              className="px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors hidden md:flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Portal Publik</span>
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Drawer */}
        {isMobileDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full p-4 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-800 text-amber-200 font-serif font-bold text-sm flex items-center justify-center">
                      K1
                    </div>
                    <span className="font-bold text-sm text-slate-900">Dashboard KKG</span>
                  </div>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-slate-900">{currentUser.name}</div>
                  <div className="text-slate-500">{currentUser.school}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold ${roleInfo[currentRole].badge}`}>
                    {roleInfo[currentRole].title}
                  </span>
                </div>

                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onTabChange(item.id);
                          setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive ? 'bg-rose-800 text-white' : 'text-slate-700 hover:bg-stone-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 space-y-2">
                <button
                  onClick={() => {
                    onNavigatePublic('home');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 text-xs font-medium text-slate-700 hover:bg-stone-100 rounded-lg"
                >
                  Ke Portal Publik
                </button>
                <button
                  onClick={onLogout}
                  className="w-full text-left py-2 px-3 text-xs font-semibold text-rose-800 hover:bg-rose-50 rounded-lg"
                >
                  Keluar Akun
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileDrawerOpen(false)}></div>
          </div>
        )}

        {/* Child Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
