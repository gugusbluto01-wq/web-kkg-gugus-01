export type UserRole = 'super_admin' | 'pengurus' | 'bendahara' | 'guru';

export interface UserProfile {
  id: string;
  name: string;
  nip?: string;
  nuptk?: string;
  role: UserRole;
  roleTitle: string;
  school: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

export interface Anggota {
  id: string;
  name: string;
  nip?: string;
  nuptk?: string;
  school: string;
  subject: string;
  gradeLevel: string;
  position: string;
  role: UserRole;
  status: 'Aktif' | 'Cuti' | 'Mutasi';
  email: string;
  phone: string;
  joinDate: string;
  avatarUrl: string;
}

export type PerangkatCategory =
  | 'Modul Ajar'
  | 'RPP'
  | 'ATP'
  | 'CP & TP'
  | 'LKPD'
  | 'Bahan Ajar'
  | 'Media Pembelajaran'
  | 'Asesmen'
  | 'Soal Evaluasi'
  | 'Perangkat Administrasi';

export interface PerangkatAjar {
  id: string;
  title: string;
  category: PerangkatCategory;
  gradeLevel: 'Fase A (Kelas 1-2)' | 'Fase B (Kelas 3-4)' | 'Fase C (Kelas 5-6)' | 'Semua Fase';
  subject: string;
  description: string;
  fileFormat: 'PDF' | 'DOCX' | 'PPTX' | 'XLSX';
  fileSize: string;
  downloadCount: number;
  uploaderName: string;
  uploaderSchool: string;
  uploadedAt: string;
  isVerified: boolean;
  driveUrl?: string;
}

export interface ForumComment {
  id: string;
  authorName: string;
  authorRole: string;
  authorSchool: string;
  authorAvatar: string;
  createdAt: string;
  content: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  category: 'Pembelajaran' | 'Kurikulum' | 'Asesmen' | 'Teknologi Pendidikan' | 'Administrasi Sekolah' | 'Berbagi Praktik Baik';
  content: string;
  authorName: string;
  authorSchool: string;
  authorAvatar: string;
  createdAt: string;
  commentCount: number;
  viewCount: number;
  likesCount: number;
  tags: string[];
  comments: ForumComment[];
  isLocked?: boolean;
  isPinned?: boolean;
}

export interface Kegiatan {
  id: string;
  title: string;
  type: 'KKG Rutin' | 'Workshop' | 'Pelatihan' | 'Seminar' | 'Pendampingan' | 'Kegiatan Kolaborasi';
  date: string;
  time: string;
  location: string;
  locationDetail: string;
  personInCharge: string;
  status: 'Akan Datang' | 'Sedang Berlangsung' | 'Selesai';
  quota: number;
  enrolledCount: number;
  description: string;
  materials?: string;
  documentationImages?: string[];
}

export interface BeritaPengumuman {
  id: string;
  title: string;
  type: 'Berita' | 'Pengumuman';
  category: 'Akademik' | 'Organisasi' | 'Kebijakan' | 'Prestasi' | 'Agenda';
  publishedAt: string;
  author: string;
  summary: string;
  content: string;
  coverImage: string;
  isImportant?: boolean;
}

export interface DokumenAdministrasi {
  id: string;
  letterNumber: string;
  title: string;
  category:
    | 'Surat Masuk'
    | 'Surat Keluar'
    | 'SK Kepengurusan'
    | 'Daftar Hadir'
    | 'Notulen Rapat'
    | 'Program Kerja'
    | 'Laporan Kegiatan'
    | 'Arsip Organisasi';
  date: string;
  senderOrRecipient: string;
  fileFormat: 'PDF' | 'DOCX' | 'XLSX';
  fileSize: string;
  status: 'Resmi' | 'Draft' | 'Diarsipkan';
  signedBy?: string;
}

export interface TransaksiKeuangan {
  id: string;
  transactionNumber: string;
  type: 'Pemasukan' | 'Pengeluaran';
  category:
    | 'Iuran Rutin Anggota'
    | 'Bantuan Operasional Gugus'
    | 'Konsumsi & Logistik Pertemuan'
    | 'Honorarium Narasumber'
    | 'Penggandaan Modul & Materi'
    | 'Sewa Tempat & Perlengkapan'
    | 'Peralatan Administrasi'
    | 'Lain-lain';
  amount: number;
  date: string;
  description: string;
  proofNumber: string;
  proofUrl?: string;
  recordedBy: string;
}

export interface Aspirasi {
  id: string;
  title: string;
  category: 'Organisasi' | 'Kegiatan' | 'Pembelajaran' | 'Administrasi' | 'Keuangan' | 'Lainnya';
  content: string;
  senderName: string;
  isAnonymous: boolean;
  school: string;
  submittedAt: string;
  status: 'Diterima' | 'Ditinjau Pengurus' | 'Ditindaklanjuti';
  responseNotes?: string;
}

export interface GaleriItem {
  id: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  description: string;
  photographer?: string;
  isFeatured?: boolean;
}

export interface SekolahItem {
  id: string;
  name: string;
  npsn: string;
  address: string;
  headmaster: string;
  totalTeachers?: number;
  phone?: string;
}

export interface StrukturItem {
  id: string;
  position: string;
  name: string;
  instance: string;
  level: number;
  nip?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  actorName: string;
  actorRole: UserRole;
  timestamp: string;
  details: string;
  status: 'Sukses' | 'Peringatan' | 'Dibatalkan';
}

export interface PresensiRecord {
  id: string;
  kegiatanId: string;
  kegiatanTitle: string;
  memberName: string;
  school: string;
  nip?: string;
  checkInTime: string;
  status: 'Hadir' | 'Izin' | 'Sakit';
  notes?: string;
}

export interface WebsiteConfig {
  orgName: string;
  acronym: string;
  slogan: string;
  logoText: string;
  historyText: string;
  visionText: string;
  missionItems: string[];
  welcomeTitle: string;
  welcomeText: string;
  welcomeAuthor: string;
  welcomeRole: string;
  contactAddress: string;
  contactEmail: string;
  contactPhone: string;
  academicYear: string;
  themeColor: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Aktif' | 'Nonaktif';
  lastLogin: string;
  school: string;
  phone?: string;
}
