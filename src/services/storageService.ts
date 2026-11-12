import {
  Anggota,
  Aspirasi,
  AuditLog,
  BeritaPengumuman,
  DokumenAdministrasi,
  ForumTopic,
  GaleriItem,
  Kegiatan,
  PerangkatAjar,
  PresensiRecord,
  SekolahItem,
  StrukturItem,
  TransaksiKeuangan,
  UserAccount,
  UserProfile,
  UserRole,
  WebsiteConfig,
} from '../types';
import {
  DEFAULT_USERS,
  INITIAL_ADMINISTRASI,
  INITIAL_ANGGOTA,
  INITIAL_ASPIRASI,
  INITIAL_AUDIT_LOGS,
  INITIAL_BERITA,
  INITIAL_FORUM_TOPICS,
  INITIAL_GALERI,
  INITIAL_KEGIATAN,
  INITIAL_PERANGKAT,
  INITIAL_PRESENSI,
  INITIAL_TRANSAKSI,
  INITIAL_USER_ACCOUNTS,
  INITIAL_WEBSITE_CONFIG,
  SEKOLAH_GUGUS,
  STRUKTUR_ORGANISASI,
} from '../data/mockData';

const STORAGE_KEYS = {
  CURRENT_ROLE: 'kkg_current_role',
  CURRENT_USER: 'kkg_current_user',
  ANGGOTA: 'kkg_anggota_list',
  PERANGKAT: 'kkg_perangkat_list',
  FORUM: 'kkg_forum_list',
  KEGIATAN: 'kkg_kegiatan_list',
  BERITA: 'kkg_berita_list',
  ADMINISTRASI: 'kkg_administrasi_list',
  TRANSAKSI: 'kkg_transaksi_list',
  ASPIRASI: 'kkg_aspirasi_list',
  GALERI: 'kkg_galeri_list',
  SEKOLAH: 'kkg_sekolah_list',
  STRUKTUR: 'kkg_struktur_list',
  AUDIT_LOGS: 'kkg_audit_logs',
  PRESENSI: 'kkg_presensi_list',
  CONFIG: 'kkg_website_config',
  USER_ACCOUNTS: 'kkg_user_accounts',
};

function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save to localStorage key "${key}":`, err);
  }
}

export const StorageService = {
  getCurrentRole(): UserRole {
    const role = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) as UserRole;
    return role && ['super_admin', 'pengurus', 'bendahara', 'guru'].includes(role) ? role : 'guru';
  },

  setCurrentRole(role: UserRole): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
    this.setCurrentUser(DEFAULT_USERS[role]);
    this.addAuditLog('GANTI_ROLE_SIMULASI', 'Sistem', `Beralih ke peran simulasi ${role}`);
  },

  getCurrentUser(): UserProfile {
    const role = this.getCurrentRole();
    const stored = getStorageItem<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (stored && stored.role === role) return stored;
    return DEFAULT_USERS[role] || DEFAULT_USERS.guru;
  },

  setCurrentUser(user: UserProfile): void {
    setStorageItem(STORAGE_KEYS.CURRENT_USER, user);
  },

  // Website Config
  getConfig(): WebsiteConfig {
    return getStorageItem<WebsiteConfig>(STORAGE_KEYS.CONFIG, INITIAL_WEBSITE_CONFIG);
  },
  updateConfig(newConfig: WebsiteConfig): void {
    setStorageItem(STORAGE_KEYS.CONFIG, newConfig);
    this.addAuditLog('UPDATE_PENGATURAN_WEBSITE', 'Pengaturan Website', 'Memperbarui identitas dan tampilan portal');
  },

  // User Accounts
  getUserAccounts(): UserAccount[] {
    return getStorageItem<UserAccount[]>(STORAGE_KEYS.USER_ACCOUNTS, INITIAL_USER_ACCOUNTS);
  },
  addUserAccount(acc: UserAccount): void {
    const list = this.getUserAccounts();
    setStorageItem(STORAGE_KEYS.USER_ACCOUNTS, [acc, ...list]);
    this.addAuditLog('TAMBAH_USER', 'Manajemen Pengguna', `Menambahkan akun baru: ${acc.email} (${acc.role})`);
  },
  updateUserAccount(acc: UserAccount): void {
    const list = this.getUserAccounts().map((u) => (u.id === acc.id ? acc : u));
    setStorageItem(STORAGE_KEYS.USER_ACCOUNTS, list);
    this.addAuditLog('UPDATE_USER', 'Manajemen Pengguna', `Memperbarui akun pengguna: ${acc.email}`);
  },
  deleteUserAccount(id: string): void {
    const list = this.getUserAccounts().filter((u) => u.id !== id);
    setStorageItem(STORAGE_KEYS.USER_ACCOUNTS, list);
    this.addAuditLog('HAPUS_USER', 'Manajemen Pengguna', `Menghapus akun ID: ${id}`);
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return getStorageItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },
  addAuditLog(action: string, module: string, details: string, status: 'Sukses' | 'Peringatan' | 'Dibatalkan' = 'Sukses'): void {
    const curUser = this.getCurrentUser();
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      action,
      module,
      actorName: curUser.name,
      actorRole: curUser.role,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' WIB',
      details,
      status,
    };
    setStorageItem(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs.slice(0, 49)]);
  },

  // Sekolah
  getSekolah(): SekolahItem[] {
    return getStorageItem<SekolahItem[]>(STORAGE_KEYS.SEKOLAH, SEKOLAH_GUGUS);
  },
  addSekolah(sch: SekolahItem): void {
    const list = this.getSekolah();
    setStorageItem(STORAGE_KEYS.SEKOLAH, [...list, sch]);
    this.addAuditLog('TAMBAH_SEKOLAH', 'Data Sekolah', `Menambahkan sekolah anggota: ${sch.name}`);
  },
  updateSekolah(sch: SekolahItem): void {
    const list = this.getSekolah().map((s) => (s.id === sch.id ? sch : s));
    setStorageItem(STORAGE_KEYS.SEKOLAH, list);
    this.addAuditLog('UPDATE_SEKOLAH', 'Data Sekolah', `Memperbarui profil sekolah: ${sch.name}`);
  },
  deleteSekolah(id: string): void {
    const list = this.getSekolah().filter((s) => s.id !== id);
    setStorageItem(STORAGE_KEYS.SEKOLAH, list);
    this.addAuditLog('HAPUS_SEKOLAH', 'Data Sekolah', `Menghapus sekolah ID: ${id}`);
  },

  // Struktur Organisasi
  getStruktur(): StrukturItem[] {
    return getStorageItem<StrukturItem[]>(STORAGE_KEYS.STRUKTUR, STRUKTUR_ORGANISASI);
  },
  addStruktur(item: StrukturItem): void {
    const list = this.getStruktur();
    setStorageItem(STORAGE_KEYS.STRUKTUR, [...list, item]);
    this.addAuditLog('TAMBAH_PENGURUS', 'Struktur Pengurus', `Menambahkan pengurus: ${item.name} (${item.position})`);
  },
  updateStruktur(item: StrukturItem): void {
    const list = this.getStruktur().map((s) => (s.id === item.id ? item : s));
    setStorageItem(STORAGE_KEYS.STRUKTUR, list);
    this.addAuditLog('UPDATE_PENGURUS', 'Struktur Pengurus', `Memperbarui jabatan: ${item.position} (${item.name})`);
  },
  deleteStruktur(id: string): void {
    const list = this.getStruktur().filter((s) => s.id !== id);
    setStorageItem(STORAGE_KEYS.STRUKTUR, list);
    this.addAuditLog('HAPUS_PENGURUS', 'Struktur Pengurus', `Menghapus pengurus ID: ${id}`);
  },

  // Presensi Records
  getPresensi(): PresensiRecord[] {
    return getStorageItem<PresensiRecord[]>(STORAGE_KEYS.PRESENSI, INITIAL_PRESENSI);
  },
  addPresensi(rec: PresensiRecord): void {
    const list = this.getPresensi();
    setStorageItem(STORAGE_KEYS.PRESENSI, [rec, ...list]);
    this.addAuditLog('CATAT_PRESENSI', 'Presensi', `Pencatatan kehadiran ${rec.memberName} pada ${rec.kegiatanTitle}`);
  },
  updatePresensiStatus(id: string, status: 'Hadir' | 'Izin' | 'Sakit', notes?: string): void {
    const list = this.getPresensi().map((p) => (p.id === id ? { ...p, status, notes: notes || p.notes } : p));
    setStorageItem(STORAGE_KEYS.PRESENSI, list);
  },

  // Anggota
  getAnggota(): Anggota[] {
    return getStorageItem<Anggota[]>(STORAGE_KEYS.ANGGOTA, INITIAL_ANGGOTA);
  },
  addAnggota(anggota: Anggota): void {
    const list = this.getAnggota();
    setStorageItem(STORAGE_KEYS.ANGGOTA, [anggota, ...list]);
    this.addAuditLog('TAMBAH_ANGGOTA', 'Data Anggota', `Menambahkan anggota: ${anggota.name}`);
  },
  updateAnggota(anggota: Anggota): void {
    const list = this.getAnggota().map((a) => (a.id === anggota.id ? anggota : a));
    setStorageItem(STORAGE_KEYS.ANGGOTA, list);
    this.addAuditLog('UPDATE_ANGGOTA', 'Data Anggota', `Memperbarui data anggota: ${anggota.name}`);
  },
  deleteAnggota(id: string): void {
    const list = this.getAnggota().filter((a) => a.id !== id);
    setStorageItem(STORAGE_KEYS.ANGGOTA, list);
    this.addAuditLog('HAPUS_ANGGOTA', 'Data Anggota', `Menghapus anggota ID: ${id}`, 'Peringatan');
  },

  // Perangkat Ajar
  getPerangkat(): PerangkatAjar[] {
    return getStorageItem<PerangkatAjar[]>(STORAGE_KEYS.PERANGKAT, INITIAL_PERANGKAT);
  },
  addPerangkat(doc: PerangkatAjar): void {
    const list = this.getPerangkat();
    setStorageItem(STORAGE_KEYS.PERANGKAT, [doc, ...list]);
    this.addAuditLog('UNGGAH_PERANGKAT', 'Bank Perangkat Ajar', `Mengunggah dokumen: ${doc.title}`);
  },
  updatePerangkat(doc: PerangkatAjar): void {
    const list = this.getPerangkat().map((p) => (p.id === doc.id ? doc : p));
    setStorageItem(STORAGE_KEYS.PERANGKAT, list);
    this.addAuditLog('UPDATE_PERANGKAT', 'Bank Perangkat Ajar', `Memperbarui dokumen: ${doc.title}`);
  },
  deletePerangkat(id: string): void {
    const list = this.getPerangkat().filter((p) => p.id !== id);
    setStorageItem(STORAGE_KEYS.PERANGKAT, list);
    this.addAuditLog('HAPUS_PERANGKAT', 'Bank Perangkat Ajar', `Menghapus dokumen ID: ${id}`);
  },

  // Forum
  getForumTopics(): ForumTopic[] {
    return getStorageItem<ForumTopic[]>(STORAGE_KEYS.FORUM, INITIAL_FORUM_TOPICS);
  },
  addForumTopic(topic: ForumTopic): void {
    const list = this.getForumTopics();
    setStorageItem(STORAGE_KEYS.FORUM, [topic, ...list]);
    this.addAuditLog('BUAT_TOPIK_FORUM', 'Forum Guru', `Menerbitkan topik: ${topic.title}`);
  },
  updateForumTopic(topic: ForumTopic): void {
    const list = this.getForumTopics().map((t) => (t.id === topic.id ? topic : t));
    setStorageItem(STORAGE_KEYS.FORUM, list);
    this.addAuditLog('UPDATE_FORUM', 'Forum Guru', `Memperbarui topik diskusi: ${topic.title}`);
  },
  deleteForumTopic(id: string): void {
    const list = this.getForumTopics().filter((t) => t.id !== id);
    setStorageItem(STORAGE_KEYS.FORUM, list);
    this.addAuditLog('MODERASI_FORUM', 'Forum Guru', `Menghapus topik diskusi ID: ${id}`);
  },
  addComment(topicId: string, commentText: string, author: UserProfile): void {
    const list = this.getForumTopics();
    const updated = list.map((t) => {
      if (t.id === topicId) {
        const newComment = {
          id: `c-${Date.now()}`,
          authorName: author.name,
          authorRole: author.roleTitle,
          authorSchool: author.school,
          authorAvatar: author.avatarUrl,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          content: commentText,
        };
        return {
          ...t,
          commentCount: t.commentCount + 1,
          comments: [...t.comments, newComment],
        };
      }
      return t;
    });
    setStorageItem(STORAGE_KEYS.FORUM, updated);
  },

  // Kegiatan
  getKegiatan(): Kegiatan[] {
    return getStorageItem<Kegiatan[]>(STORAGE_KEYS.KEGIATAN, INITIAL_KEGIATAN);
  },
  addKegiatan(kegiatan: Kegiatan): void {
    const list = this.getKegiatan();
    setStorageItem(STORAGE_KEYS.KEGIATAN, [kegiatan, ...list]);
    this.addAuditLog('TAMBAH_KEGIATAN', 'Program & Kegiatan', `Menjadwalkan kegiatan: ${kegiatan.title}`);
  },
  updateKegiatan(kegiatan: Kegiatan): void {
    const list = this.getKegiatan().map((k) => (k.id === kegiatan.id ? kegiatan : k));
    setStorageItem(STORAGE_KEYS.KEGIATAN, list);
    this.addAuditLog('UPDATE_KEGIATAN', 'Program & Kegiatan', `Memperbarui kegiatan: ${kegiatan.title}`);
  },
  deleteKegiatan(id: string): void {
    const list = this.getKegiatan().filter((k) => k.id !== id);
    setStorageItem(STORAGE_KEYS.KEGIATAN, list);
    this.addAuditLog('HAPUS_KEGIATAN', 'Program & Kegiatan', `Menghapus kegiatan ID: ${id}`);
  },

  // Berita & Pengumuman
  getBerita(): BeritaPengumuman[] {
    return getStorageItem<BeritaPengumuman[]>(STORAGE_KEYS.BERITA, INITIAL_BERITA);
  },
  addBerita(item: BeritaPengumuman): void {
    const list = this.getBerita();
    setStorageItem(STORAGE_KEYS.BERITA, [item, ...list]);
    this.addAuditLog('PUBLIKASI_BERITA', 'Berita & Pengumuman', `Menerbitkan artikel: ${item.title}`);
  },
  updateBerita(item: BeritaPengumuman): void {
    const list = this.getBerita().map((b) => (b.id === item.id ? item : b));
    setStorageItem(STORAGE_KEYS.BERITA, list);
    this.addAuditLog('UPDATE_BERITA', 'Berita & Pengumuman', `Memperbarui artikel: ${item.title}`);
  },
  deleteBerita(id: string): void {
    const list = this.getBerita().filter((b) => b.id !== id);
    setStorageItem(STORAGE_KEYS.BERITA, list);
    this.addAuditLog('HAPUS_BERITA', 'Berita & Pengumuman', `Menghapus artikel ID: ${id}`);
  },

  // Administrasi
  getAdministrasi(): DokumenAdministrasi[] {
    return getStorageItem<DokumenAdministrasi[]>(STORAGE_KEYS.ADMINISTRASI, INITIAL_ADMINISTRASI);
  },
  addAdministrasi(doc: DokumenAdministrasi): void {
    const list = this.getAdministrasi();
    setStorageItem(STORAGE_KEYS.ADMINISTRASI, [doc, ...list]);
    this.addAuditLog('ARSIP_DOKUMEN', 'Administrasi KKG', `Mengarsipkan surat/berkas: ${doc.letterNumber}`);
  },
  updateAdministrasi(doc: DokumenAdministrasi): void {
    const list = this.getAdministrasi().map((a) => (a.id === doc.id ? doc : a));
    setStorageItem(STORAGE_KEYS.ADMINISTRASI, list);
    this.addAuditLog('UPDATE_ARSIP', 'Administrasi KKG', `Memperbarui berkas: ${doc.letterNumber}`);
  },
  deleteAdministrasi(id: string): void {
    const list = this.getAdministrasi().filter((a) => a.id !== id);
    setStorageItem(STORAGE_KEYS.ADMINISTRASI, list);
    this.addAuditLog('HAPUS_ARSIP', 'Administrasi KKG', `Menghapus berkas administrasi ID: ${id}`);
  },

  // Keuangan
  getTransaksi(): TransaksiKeuangan[] {
    return getStorageItem<TransaksiKeuangan[]>(STORAGE_KEYS.TRANSAKSI, INITIAL_TRANSAKSI);
  },
  addTransaksi(trx: TransaksiKeuangan): void {
    const list = this.getTransaksi();
    setStorageItem(STORAGE_KEYS.TRANSAKSI, [trx, ...list]);
    this.addAuditLog('CATAT_TRANSAKSI', 'Laporan Keuangan', `Mencatat ${trx.type}: Rp ${trx.amount.toLocaleString('id-ID')} (${trx.category})`);
  },
  updateTransaksi(trx: TransaksiKeuangan): void {
    const list = this.getTransaksi().map((t) => (t.id === trx.id ? trx : t));
    setStorageItem(STORAGE_KEYS.TRANSAKSI, list);
    this.addAuditLog('UPDATE_TRANSAKSI', 'Laporan Keuangan', `Memperbarui transaksi: ${trx.transactionNumber}`);
  },
  deleteTransaksi(id: string, reason?: string): void {
    const list = this.getTransaksi().filter((t) => t.id !== id);
    setStorageItem(STORAGE_KEYS.TRANSAKSI, list);
    this.addAuditLog('PEMBATALAN_TRANSAKSI', 'Laporan Keuangan', `Membatalkan/menghapus transaksi ID: ${id}. Alasan: ${reason || 'Koreksi pembukuan'}`, 'Peringatan');
  },

  // Aspirasi
  getAspirasi(): Aspirasi[] {
    return getStorageItem<Aspirasi[]>(STORAGE_KEYS.ASPIRASI, INITIAL_ASPIRASI);
  },
  addAspirasi(item: Aspirasi): void {
    const list = this.getAspirasi();
    setStorageItem(STORAGE_KEYS.ASPIRASI, [item, ...list]);
    this.addAuditLog('KIRIM_ASPIRASI', 'Aspirasi & Saran', `Aspirasi baru: ${item.title}`);
  },
  updateAspirasiStatus(id: string, status: Aspirasi['status'], notes?: string): void {
    const list = this.getAspirasi().map((a) => (a.id === id ? { ...a, status, responseNotes: notes || a.responseNotes } : a));
    setStorageItem(STORAGE_KEYS.ASPIRASI, list);
    this.addAuditLog('TINDAK_LANJUT_ASPIRASI', 'Aspirasi & Saran', `Ubah status aspirasi ID ${id} menjadi ${status}`);
  },
  deleteAspirasi(id: string): void {
    const list = this.getAspirasi().filter((a) => a.id !== id);
    setStorageItem(STORAGE_KEYS.ASPIRASI, list);
    this.addAuditLog('HAPUS_ASPIRASI', 'Aspirasi & Saran', `Menghapus aspirasi ID: ${id}`);
  },

  // Galeri
  getGaleri(): GaleriItem[] {
    return getStorageItem<GaleriItem[]>(STORAGE_KEYS.GALERI, INITIAL_GALERI);
  },
  addGaleri(item: GaleriItem): void {
    const list = this.getGaleri();
    setStorageItem(STORAGE_KEYS.GALERI, [item, ...list]);
    this.addAuditLog('UNGGAH_GALERI', 'Galeri', `Unggah dokumentasi foto: ${item.title}`);
  },
  updateGaleri(item: GaleriItem): void {
    const list = this.getGaleri().map((g) => (g.id === item.id ? item : g));
    setStorageItem(STORAGE_KEYS.GALERI, list);
    this.addAuditLog('UPDATE_GALERI', 'Galeri', `Memperbarui foto: ${item.title}`);
  },
  deleteGaleri(id: string): void {
    const list = this.getGaleri().filter((g) => g.id !== id);
    setStorageItem(STORAGE_KEYS.GALERI, list);
    this.addAuditLog('HAPUS_GALERI', 'Galeri', `Menghapus dokumentasi galeri ID: ${id}`);
  },

  // Reset to initial demo data
  resetAll(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    this.addAuditLog('RESET_SISTEM', 'Pengaturan Sistem', 'Mereset seluruh data lokal demonstrasi ke konfigurasi awal', 'Peringatan');
  },
};
