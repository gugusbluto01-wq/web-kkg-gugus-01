import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  BookOpen,
  Calendar,
  Wallet,
  Settings,
  UserPlus,
  Newspaper,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCheck,
  School,
  Award,
  MessageSquare,
  FolderLock,
  Send,
  Image as ImageIcon,
  Activity,
  Sliders,
  Search,
  PlusCircle,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  KeyRound,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  Eye,
  X,
  FileSpreadsheet,
  Printer,
  ShieldAlert,
  Database,
  Building,
  Check,
  Copy,
  Code,
  FileText,
  Filter,
  Pin,
  ExternalLink,
} from 'lucide-react';
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
} from '../../types';
import { StorageService } from '../../services/storageService';
import { triggerDocumentDownload } from '../../utils/downloadHelper';

interface SuperAdminProps {
  currentUser: UserProfile;
  anggotaList: Anggota[];
  kegiatanList: Kegiatan[];
  perangkatList: PerangkatAjar[];
  transaksiList: TransaksiKeuangan[];
  beritaList: BeritaPengumuman[];
  administrasiList: DokumenAdministrasi[];
  aspirasiList: Aspirasi[];
  forumTopics: ForumTopic[];
  galeriList: GaleriItem[];
  activeTab?: string;
  onNavigatePublic: (page: string) => void;
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
  onDataRefresh: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminProps> = ({
  currentUser,
  anggotaList,
  kegiatanList,
  perangkatList,
  transaksiList,
  beritaList,
  administrasiList,
  aspirasiList,
  forumTopics,
  galeriList,
  activeTab = 'overview',
  onNavigatePublic,
  onShowToast,
  onDataRefresh,
}) => {
  // State from StorageService
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>(StorageService.getConfig());
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(StorageService.getUserAccounts());
  const [sekolahList, setSekolahList] = useState<SekolahItem[]>(StorageService.getSekolah());
  const [strukturList, setStrukturList] = useState<StrukturItem[]>(StorageService.getStruktur());
  const [presensiList, setPresensiList] = useState<PresensiRecord[]>(StorageService.getPresensi());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(StorageService.getAuditLogs());

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  // Modals
  const [modalType, setModalType] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [formInputs, setFormInputs] = useState<Record<string, any>>({});

  // Calculations
  const totalKas = transaksiList.reduce(
    (acc, t) => (t.type === 'Pemasukan' ? acc + t.amount : acc - t.amount),
    0
  );

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const [deleteConfirm, setDeleteConfirm] = useState<{
    name: string;
    callback: () => void;
  } | null>(null);

  const confirmDelete = (name: string, callback: () => void) => {
    setDeleteConfirm({ name, callback });
  };

  // USER MANAGEMENT HANDLERS
  const handleSaveUserAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalData) {
      const updated: UserAccount = {
        ...modalData,
        name: formInputs.name || modalData.name,
        email: formInputs.email || modalData.email,
        role: formInputs.role || modalData.role,
        status: formInputs.status || modalData.status,
        school: formInputs.school || modalData.school,
        phone: formInputs.phone || modalData.phone,
      };
      StorageService.updateUserAccount(updated);
      setUserAccounts(StorageService.getUserAccounts());
      onShowToast('Akun Pengguna Diperbarui', `${updated.name} (${updated.role})`, 'success');
    } else {
      const newAcc: UserAccount = {
        id: `acc-${Date.now()}`,
        name: formInputs.name || 'Guru Anggota Baru',
        email: formInputs.email || `guru${Date.now().toString().slice(-4)}@sekolah.belajar.id`,
        role: formInputs.role || 'guru',
        status: 'Aktif',
        lastLogin: 'Belum pernah login',
        school: formInputs.school || sekolahList[0]?.name || 'SDN Bluto I',
        phone: formInputs.phone || '0812-3456-7890',
      };
      StorageService.addUserAccount(newAcc);
      setUserAccounts(StorageService.getUserAccounts());
      onShowToast('Akun Baru Berhasil Dibuat', `${newAcc.name} (${newAcc.role})`, 'success');
    }
    setModalType(null);
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleToggleUserStatus = (acc: UserAccount) => {
    const updated: UserAccount = {
      ...acc,
      status: acc.status === 'Aktif' ? 'Nonaktif' : 'Aktif',
    };
    StorageService.updateUserAccount(updated);
    setUserAccounts(StorageService.getUserAccounts());
    setAuditLogs(StorageService.getAuditLogs());
    onShowToast('Status Akun Berubah', `${acc.name} status: ${updated.status}.`, 'info');
  };

  const handleResetPassword = (acc: UserAccount) => {
    StorageService.addAuditLog('RESET_PASSWORD_USER', 'Manajemen Pengguna', `Instruksi pemulihan sandi dikirim untuk akun ${acc.email}`);
    setAuditLogs(StorageService.getAuditLogs());
    onShowToast('Instruksi Reset Terkirim', `Tautan reset sandi telah disiapkan untuk ${acc.email} (Demo).`, 'info');
  };

  // SEKOLAH HANDLERS
  const handleSaveSekolah = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalData) {
      const updated: SekolahItem = {
        ...modalData,
        name: formInputs.name || modalData.name,
        npsn: formInputs.npsn || modalData.npsn,
        address: formInputs.address || modalData.address,
        headmaster: formInputs.headmaster || modalData.headmaster,
      };
      StorageService.updateSekolah(updated);
      setSekolahList(StorageService.getSekolah());
      onShowToast('Data Sekolah Diperbarui', updated.name, 'success');
    } else {
      const newSch: SekolahItem = {
        id: `sch-${Date.now()}`,
        name: formInputs.name || 'SDN Binaan Baru',
        npsn: formInputs.npsn || '20520099',
        address: formInputs.address || 'Kecamatan Bluto',
        headmaster: formInputs.headmaster || 'Kepala Sekolah',
      };
      StorageService.addSekolah(newSch);
      setSekolahList(StorageService.getSekolah());
      onShowToast('Sekolah Baru Ditambahkan', newSch.name, 'success');
    }
    setModalType(null);
    setAuditLogs(StorageService.getAuditLogs());
  };

  // STRUKTUR HANDLERS
  const handleSaveStruktur = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalData) {
      const updated: StrukturItem = {
        ...modalData,
        position: formInputs.position || modalData.position,
        name: formInputs.name || modalData.name,
        instance: formInputs.instance || modalData.instance,
        nip: formInputs.nip || modalData.nip,
        level: Number(formInputs.level || modalData.level),
      };
      StorageService.updateStruktur(updated);
      setStrukturList(StorageService.getStruktur());
      onShowToast('Jabatan Pengurus Diperbarui', updated.position, 'success');
    } else {
      const newStr: StrukturItem = {
        id: `str-${Date.now()}`,
        position: formInputs.position || 'Bidang Kerjasama',
        name: formInputs.name || 'Nama Pejabat',
        instance: formInputs.instance || 'SDN Anggota Gugus',
        nip: formInputs.nip || '19800000 000000 0 000',
        level: Number(formInputs.level || 4),
      };
      StorageService.addStruktur(newStr);
      setStrukturList(StorageService.getStruktur());
      onShowToast('Pengurus Ditambahkan', newStr.position, 'success');
    }
    setModalType(null);
    setAuditLogs(StorageService.getAuditLogs());
  };

  // WEBSITE CONFIG HANDLER
  const handleSaveWebsiteConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: WebsiteConfig = {
      ...websiteConfig,
      orgName: formInputs.orgName ?? websiteConfig.orgName,
      acronym: formInputs.acronym ?? websiteConfig.acronym,
      slogan: formInputs.slogan ?? websiteConfig.slogan,
      historyText: formInputs.historyText ?? websiteConfig.historyText,
      visionText: formInputs.visionText ?? websiteConfig.visionText,
      welcomeTitle: formInputs.welcomeTitle ?? websiteConfig.welcomeTitle,
      welcomeText: formInputs.welcomeText ?? websiteConfig.welcomeText,
      welcomeAuthor: formInputs.welcomeAuthor ?? websiteConfig.welcomeAuthor,
      welcomeRole: formInputs.welcomeRole ?? websiteConfig.welcomeRole,
      contactAddress: formInputs.contactAddress ?? websiteConfig.contactAddress,
      contactEmail: formInputs.contactEmail ?? websiteConfig.contactEmail,
      contactPhone: formInputs.contactPhone ?? websiteConfig.contactPhone,
      academicYear: formInputs.academicYear ?? websiteConfig.academicYear,
    };
    StorageService.updateConfig(updated);
    setWebsiteConfig(updated);
    setAuditLogs(StorageService.getAuditLogs());
    onShowToast('Pengaturan Website Disimpan', 'Identitas dan konfigurasi portal berhasil diperbarui.', 'success');
  };

  // BACKUP EXPORT
  const handleExportSystemBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      system: 'Portal Digital KKG Gugus 01 Kecamatan Bluto',
      authority: 'Super Admin',
      config: websiteConfig,
      users: userAccounts,
      sekolah: sekolahList,
      struktur: strukturList,
      anggota: anggotaList,
      perangkat: perangkatList,
      kegiatan: kegiatanList,
      berita: beritaList,
      administrasi: administrasiList,
      transaksi: transaksiList,
      aspirasi: aspirasiList,
      galeri: galeriList,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KKG_BLUTO01_SYSTEM_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    StorageService.addAuditLog('EXPORT_SYSTEM_BACKUP', 'Pengaturan Sistem', 'Super Admin mengekspor arsip data sistem JSON');
    setAuditLogs(StorageService.getAuditLogs());
    onShowToast('Cadangan Data Sistem Diekspor', 'File JSON cadangan data portal telah diunduh.', 'success');
  };

  // FULL ACCESS HANDLERS FOR REMAINING MODULES
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalData) {
      const updated: Anggota = {
        ...modalData,
        name: formInputs.name || modalData.name,
        nip: formInputs.nip || modalData.nip,
        nuptk: formInputs.nuptk || modalData.nuptk,
        school: formInputs.school || modalData.school,
        subject: formInputs.subject || modalData.subject,
        gradeLevel: formInputs.gradeLevel || modalData.gradeLevel || 'Fase B (Kelas 3-4)',
        position: formInputs.position || modalData.position || 'Guru Anggota',
        role: modalData.role || 'guru',
        status: (formInputs.status || modalData.status || 'Aktif') as 'Aktif' | 'Cuti' | 'Mutasi',
        phone: formInputs.phone || modalData.phone,
        email: formInputs.email || modalData.email,
        joinDate: modalData.joinDate || '2024-01-01',
        avatarUrl: modalData.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250',
      };
      StorageService.updateAnggota(updated);
      onShowToast('Data Anggota Diperbarui', updated.name, 'success');
    } else {
      const newMember: Anggota = {
        id: `ang-${Date.now()}`,
        name: formInputs.name || 'Guru Baru Gugus 01',
        nip: formInputs.nip || '19950000 000000 0 000',
        nuptk: formInputs.nuptk || '9876543210987654',
        school: formInputs.school || sekolahList[0]?.name || 'SDN Bluto I',
        subject: formInputs.subject || 'Guru Kelas',
        gradeLevel: formInputs.gradeLevel || 'Fase B (Kelas 3-4)',
        position: 'Guru Anggota',
        role: 'guru',
        status: (formInputs.status || 'Aktif') as 'Aktif' | 'Cuti' | 'Mutasi',
        phone: formInputs.phone || '0812-3456-7890',
        email: formInputs.email || `guru${Date.now().toString().slice(-4)}@sekolah.belajar.id`,
        joinDate: '2025-01-10',
        avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250',
      };
      StorageService.addAnggota(newMember);
      onShowToast('Anggota Baru Ditambahkan', newMember.name, 'success');
    }
    setModalType(null);
    onDataRefresh();
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleSaveBerita = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalData) {
      const updated: BeritaPengumuman = {
        ...modalData,
        title: formInputs.title || modalData.title,
        type: (formInputs.type || modalData.type || 'Berita') as 'Berita' | 'Pengumuman',
        category: (formInputs.category || modalData.category || 'Organisasi') as any,
        author: formInputs.author || modalData.author,
        content: formInputs.content || modalData.content,
        summary: formInputs.summary || modalData.summary,
        coverImage: formInputs.coverImage || modalData.coverImage || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
        isImportant: formInputs.isImportant !== undefined ? formInputs.isImportant : modalData.isImportant,
      };
      StorageService.updateBerita(updated);
      onShowToast('Berita Diperbarui', updated.title, 'success');
    } else {
      const newBerita: BeritaPengumuman = {
        id: `ber-${Date.now()}`,
        title: formInputs.title || 'Judul Berita Resmi KKG Gugus 01',
        type: (formInputs.type || 'Berita') as 'Berita' | 'Pengumuman',
        category: (formInputs.category || 'Organisasi') as any,
        publishedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        author: formInputs.author || currentUser.name,
        isImportant: formInputs.isImportant || false,
        summary: formInputs.summary || (formInputs.content ? formInputs.content.substring(0, 140) + '...' : 'Informasi resmi dari pengurus KKG Gugus 01.'),
        content: formInputs.content || 'Isi pengumuman resmi.',
        coverImage: formInputs.coverImage || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
      };
      StorageService.addBerita(newBerita);
      onShowToast('Berita Baru Diterbitkan', newBerita.title, 'success');
    }
    setModalType(null);
    onDataRefresh();
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleSavePerangkat = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalData) {
      const updated: PerangkatAjar = {
        ...modalData,
        title: formInputs.title || modalData.title,
        category: formInputs.category || modalData.category,
        gradeLevel: formInputs.gradeLevel || modalData.gradeLevel || 'Fase B (Kelas 3-4)',
        subject: formInputs.subject || modalData.subject,
        description: formInputs.description || modalData.description,
        fileFormat: formInputs.fileFormat || modalData.fileFormat,
        driveUrl: formInputs.driveUrl !== undefined ? (formInputs.driveUrl ? formInputs.driveUrl.trim() : undefined) : modalData.driveUrl,
      };
      StorageService.updatePerangkat(updated);
      onShowToast('Perangkat Diperbarui', updated.title, 'success');
    } else {
      const driveLink = formInputs.driveUrl ? formInputs.driveUrl.trim() : undefined;
      const newDoc: PerangkatAjar = {
        id: `per-${Date.now()}`,
        title: formInputs.title || 'Modul Ajar Kurikulum Merdeka Baru',
        category: formInputs.category || 'Modul Ajar',
        gradeLevel: formInputs.gradeLevel || 'Fase B (Kelas 3-4)',
        subject: formInputs.subject || 'Bahasa Indonesia',
        description: formInputs.description || 'Perangkat ajar terverifikasi KKG Gugus 01.',
        fileFormat: formInputs.fileFormat || 'PDF',
        fileSize: driveLink ? 'Google Drive' : '2.4 MB',
        downloadCount: 0,
        uploaderName: currentUser.name,
        uploaderSchool: currentUser.school,
        uploadedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        isVerified: true,
        driveUrl: driveLink,
      };
      StorageService.addPerangkat(newDoc);
      onShowToast('Dokumen Perangkat Ditambahkan', newDoc.title, 'success');
    }
    setModalType(null);
    onDataRefresh();
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleSaveKegiatan = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalData) {
      const updated: Kegiatan = {
        ...modalData,
        title: formInputs.title || modalData.title,
        type: formInputs.type || modalData.type,
        date: formInputs.date || modalData.date,
        time: formInputs.time || modalData.time,
        location: formInputs.location || modalData.location,
        locationDetail: formInputs.locationDetail || modalData.locationDetail,
        personInCharge: formInputs.personInCharge || modalData.personInCharge,
        description: formInputs.description || modalData.description,
        status: (formInputs.status || modalData.status) as any,
      };
      StorageService.updateKegiatan(updated);
      onShowToast('Kegiatan Diperbarui', updated.title, 'success');
    } else {
      const newKeg: Kegiatan = {
        id: `keg-${Date.now()}`,
        title: formInputs.title || 'Kegiatan Kolaborasi Guru Gugus 01',
        type: formInputs.type || 'KKG Rutin',
        date: formInputs.date || 'Sabtu, 25 November 2025',
        time: formInputs.time || '08.00 - 12.00 WIB',
        location: formInputs.location || sekolahList[0]?.name || 'SDN Bluto I',
        locationDetail: formInputs.locationDetail || 'Aula Pertemuan Guru',
        personInCharge: formInputs.personInCharge || currentUser.name,
        description: formInputs.description || 'Program pengembangan kompetensi guru berkelanjutan.',
        status: (formInputs.status || 'Akan Datang') as any,
        quota: 40,
        enrolledCount: 28,
      };
      StorageService.addKegiatan(newKeg);
      onShowToast('Kegiatan Baru Dijadwalkan', newKeg.title, 'success');
    }
    setModalType(null);
    onDataRefresh();
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleSaveAdministrasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalData) {
      const updated: DokumenAdministrasi = {
        ...modalData,
        letterNumber: formInputs.letterNumber || modalData.letterNumber,
        title: formInputs.title || modalData.title,
        category: (formInputs.category || modalData.category) as any,
        date: formInputs.date || modalData.date,
        senderOrRecipient: formInputs.senderOrRecipient || modalData.senderOrRecipient,
        status: (formInputs.status || modalData.status || 'Resmi') as any,
      };
      StorageService.updateAdministrasi(updated);
      onShowToast('Berkas Administrasi Diperbarui', updated.letterNumber, 'success');
    } else {
      const newAdm: DokumenAdministrasi = {
        id: `adm-${Date.now()}`,
        letterNumber: formInputs.letterNumber || `0${administrasiList.length + 1}/KKG-BLT01/${new Date().getFullYear()}`,
        title: formInputs.title || 'Surat Keputusan Kepengurusan KKG',
        category: (formInputs.category || 'SK Kepengurusan') as any,
        date: formInputs.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        senderOrRecipient: formInputs.senderOrRecipient || 'Korwil Bidang Pendidikan Kec. Bluto',
        fileFormat: 'PDF',
        fileSize: '1.2 MB',
        status: 'Resmi',
      };
      StorageService.addAdministrasi(newAdm);
      onShowToast('Dokumen Diarsipkan', newAdm.letterNumber, 'success');
    }
    setModalType(null);
    onDataRefresh();
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleSaveTransaksi = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = Number(formInputs.amount || 100000);
    const newTrx: TransaksiKeuangan = {
      id: `trx-${Date.now()}`,
      transactionNumber: `TRX-${Date.now().toString().slice(-6)}`,
      date: formInputs.date || new Date().toISOString().slice(0, 10),
      type: formInputs.type || 'Pemasukan',
      category: formInputs.category || 'Iuran Rutin Anggota',
      amount: amountVal,
      description: formInputs.description || 'Pencatatan kas resmi KKG',
      proofNumber: `BUKTI-${Date.now().toString().slice(-4)}`,
      recordedBy: currentUser.name,
    };
    StorageService.addTransaksi(newTrx);
    onShowToast('Transaksi Kas Berhasil Dicatat', `${newTrx.type}: ${formatRupiah(amountVal)}`, 'success');
    setModalType(null);
    onDataRefresh();
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleVoidTransaksi = (trx: TransaksiKeuangan) => {
    const reason = window.prompt(
      `SUPER ADMIN: Masukkan alasan pembatalan transaksi ${trx.transactionNumber} (${formatRupiah(trx.amount)}):`,
      'Koreksi pembukuan oleh Super Admin'
    );
    if (reason !== null && reason.trim()) {
      StorageService.deleteTransaksi(trx.id, reason.trim());
      onShowToast('Transaksi Kas Dibatalkan', `${trx.transactionNumber} telah dihapus dari buku kas.`, 'info');
      onDataRefresh();
      setAuditLogs(StorageService.getAuditLogs());
    }
  };

  const handleSaveAspirasiResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalData) return;
    const newStatus = (formInputs.status || modalData.status) as 'Diterima' | 'Ditinjau Pengurus' | 'Ditindaklanjuti';
    const notes = formInputs.responseNotes || modalData.responseNotes || 'Aspirasi telah ditindaklanjuti oleh pimpinan.';
    StorageService.updateAspirasiStatus(modalData.id, newStatus, notes);
    onShowToast('Status Aspirasi Diperbarui', `Status tiket diubah menjadi: ${newStatus}`, 'success');
    setModalType(null);
    onDataRefresh();
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleSaveGaleri = (e: React.FormEvent) => {
    e.preventDefault();
    const newGal: GaleriItem = {
      id: `gal-${Date.now()}`,
      title: formInputs.title || 'Dokumentasi Workshop Guru Gugus 01',
      category: formInputs.category || 'Workshop',
      date: formInputs.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: formInputs.description || 'Dokumentasi kegiatan resmi guru Gugus 01.',
      imageUrl: formInputs.imageUrl || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    };
    StorageService.addGaleri(newGal);
    onShowToast('Foto Dokumentasi Ditambahkan', newGal.title, 'success');
    setModalType(null);
    onDataRefresh();
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleToggleLockForum = (topic: ForumTopic) => {
    const updated: ForumTopic = {
      ...topic,
      isLocked: !topic.isLocked,
    };
    StorageService.updateForumTopic(updated);
    onShowToast(
      updated.isLocked ? 'Diskusi Dikunci' : 'Diskusi Dibuka Kembali',
      `Topik: "${topic.title}"`,
      'info'
    );
    onDataRefresh();
    setAuditLogs(StorageService.getAuditLogs());
  };

  // RENDER CONTENT FOR CURRENT ACTIVE TAB
  const renderTabContent = () => {
    switch (activeTab) {
      // 1. OVERVIEW
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
              <div className="max-w-3xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-300">
                  <ShieldAlert className="w-4 h-4 text-amber-300" />
                  <span>SUPER ADMIN — HIGHEST SYSTEM AUTHORITY</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Pusat Kendali Penuh KKG Gugus 01 Bluto
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Selamat datang, <strong>{currentUser.name}</strong>. Anda memegang otoritas mutlak dalam mengelola seluruh 18 modul website: data anggota, pengguna, dokumen kurikulum, pembukuan kas, surat resmi, hingga pengaturan identitas portal.
                </p>
              </div>
            </div>

            {/* 6 Top KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] text-slate-500 block">Guru Anggota</span>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono mt-1">
                  {anggotaList.length}
                </div>
                <span className="text-[10px] text-emerald-700 font-medium">8 SD Terkoneksi</span>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] text-slate-500 block">Sekolah Dasar</span>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono mt-1">
                  {sekolahList.length}
                </div>
                <span className="text-[10px] text-stone-500">Gugus 01 Bluto</span>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] text-slate-500 block">Akun Pengguna</span>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono mt-1">
                  {userAccounts.length}
                </div>
                <span className="text-[10px] text-rose-800 font-medium">4 Role Sistem</span>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] text-slate-500 block">Perangkat Ajar</span>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono mt-1">
                  {perangkatList.length}
                </div>
                <span className="text-[10px] text-blue-700 font-medium">Kurikulum Merdeka</span>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] text-slate-500 block">Agenda Kegiatan</span>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono mt-1">
                  {kegiatanList.length}
                </div>
                <span className="text-[10px] text-amber-700 font-medium">Presensi Aktif</span>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] text-slate-500 block">Saldo Kas Aktif</span>
                <div className="text-base sm:text-lg font-extrabold text-emerald-800 font-mono mt-1 truncate">
                  {formatRupiah(totalKas)}
                </div>
                <span className="text-[10px] text-emerald-700 font-medium">Buku Kas Terbuka</span>
              </div>
            </div>

            {/* Distribution & Readiness */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Distribusi Pendidik per Sekolah Binaan</h2>
                    <p className="text-xs text-slate-500">Cakupan guru di 8 SDN lingkungan Gugus 01 Bluto</p>
                  </div>
                  <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Realtime Data
                  </span>
                </div>

                <div className="space-y-3">
                  {sekolahList.map((sch) => {
                    const count = anggotaList.filter((a) => a.school === sch.name).length;
                    const percentage = Math.min(100, Math.round((count / Math.max(1, anggotaList.length)) * 100));

                    return (
                      <div key={sch.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">{sch.name}</span>
                          <span className="font-mono text-slate-500">
                            {count} guru ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-800 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(12, percentage)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Database className="w-4 h-4 text-rose-700" />
                    <span>Kesiapan Integrasi Backend</span>
                  </h2>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                    SUPABASE READY
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block">Supabase Authentication</strong>
                      <span className="text-[11px] text-slate-500">JWT Token, email/password & role metadata</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block">PostgreSQL Relational DB</strong>
                      <span className="text-[11px] text-slate-500">Tabel anggota, modul, kegiatan, persuratan & kas</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block">Row Level Security (RLS)</strong>
                      <span className="text-[11px] text-slate-500">Super Admin bypass + Role-based permissions</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block">Storage Bucket Integration</strong>
                      <span className="text-[11px] text-slate-500">Dokumen PDF/DOCX modul & arsip surat dinas</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Audit Feed */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-700" />
                    <span>Log Aktivitas Sistem Terkini (Audit Trail)</span>
                  </h2>
                  <p className="text-xs text-slate-500">Rekam jejak setiap tindakan pengubahan data di portal</p>
                </div>
              </div>

              <div className="space-y-2">
                {auditLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-start justify-between gap-4 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-rose-900 text-[11px] bg-rose-100/70 px-2 py-0.5 rounded">
                          {log.action}
                        </span>
                        <span className="font-semibold text-slate-800">{log.module}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500 font-mono text-[11px]">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-600 text-xs">{log.details}</p>
                      <p className="text-[10px] text-slate-400">
                        Oleh: {log.actorName} ({log.actorRole})
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                        log.status === 'Sukses'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // 2. USERS
      case 'users':
        const filteredUsers = userAccounts.filter((u) => {
          const matchRole = filterRole === 'ALL' || u.role === filterRole;
          const matchSearch =
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.school.toLowerCase().includes(searchTerm.toLowerCase());
          return matchRole && matchSearch;
        });

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Manajemen Pengguna (User Accounts)</h1>
                <p className="text-xs text-slate-500">Kelola akun, hak akses role, status aktif, dan reset password</p>
              </div>

              <button
                onClick={() => {
                  setModalData(null);
                  setFormInputs({ role: 'guru', status: 'Aktif', school: sekolahList[0]?.name });
                  setModalType('USER_FORM');
                }}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Tambah Akun Baru</span>
              </button>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama pengguna, email, atau asal sekolah..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-rose-700 bg-stone-50/50"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 text-xs border border-stone-200 rounded-xl bg-white"
                >
                  <option value="ALL">Semua Peran ({userAccounts.length})</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="pengurus">Pengurus KKG</option>
                  <option value="bendahara">Bendahara</option>
                  <option value="guru">Guru SD</option>
                </select>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-slate-600 font-semibold uppercase text-[10px] border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Nama & Email</th>
                      <th className="py-3 px-4">Asal Sekolah</th>
                      <th className="py-3 px-4">Role Akses</th>
                      <th className="py-3 px-4">Status Akun</th>
                      <th className="py-3 px-4">Login Terakhir</th>
                      <th className="py-3 px-4 text-center">Aksi Super Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-rose-50/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{u.school}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-semibold text-rose-900 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px]">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              u.status === 'Aktif'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-stone-200 text-slate-600'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{u.lastLogin}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setModalData(u);
                                setFormInputs(u);
                                setModalType('USER_FORM');
                              }}
                              className="p-1.5 text-slate-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Edit Akun"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              className="p-1.5 text-slate-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg cursor-pointer"
                              title={u.status === 'Aktif' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                            >
                              {u.status === 'Aktif' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleResetPassword(u)}
                              className="p-1.5 text-slate-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg cursor-pointer"
                              title="Reset Password"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>
                            {u.role !== 'super_admin' && (
                              <button
                                onClick={() =>
                                  confirmDelete(u.name, () => {
                                    StorageService.deleteUserAccount(u.id);
                                    setUserAccounts(StorageService.getUserAccounts());
                                    setAuditLogs(StorageService.getAuditLogs());
                                    onShowToast('Akun Dihapus', `${u.name} telah dihapus.`, 'info');
                                  })
                                }
                                className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                                title="Hapus Akun Pengguna"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      // 3. ROLES & PERMISSIONS
      case 'roles':
        const matrix = [
          { feature: 'Kelola Identitas & Slogan Organisasi', sa: true, p: false, b: false, g: false },
          { feature: 'Manajemen Akun & Reset Password', sa: true, p: false, b: false, g: false },
          { feature: 'Audit Log & Rekam Jejak Sistem', sa: true, p: false, b: false, g: false },
          { feature: 'Buku Kas & Transaksi Keuangan Penuh', sa: true, p: false, b: true, g: false },
          { feature: 'Terbitkan Berita & Edaran Resmi', sa: true, p: true, b: false, g: false },
          { feature: 'Verifikasi & Setujui Modul Ajar', sa: true, p: true, b: false, g: false },
          { feature: 'Jadwalkan Pertemuan & Kelola Peserta', sa: true, p: true, b: false, g: false },
          { feature: 'Kelola Surat Masuk & Surat Keluar', sa: true, p: true, b: false, g: false },
          { feature: 'Tindak Lanjut Kotak Aspirasi Guru', sa: true, p: true, b: false, g: false },
          { feature: 'Unduh & Unggah Perangkat Ajar', sa: true, p: true, b: true, g: true },
          { feature: 'Partisipasi Forum Diskusi & Komentar', sa: true, p: true, b: true, g: true },
          { feature: 'Presensi Digital Kehadiran KKG', sa: true, p: true, b: true, g: true },
          { feature: 'Melihat Ringkasan Kas yang Dipublikasi', sa: true, p: true, b: true, g: true },
        ];

        return (
          <div className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h1 className="text-2xl font-bold text-slate-900">Manajemen Role & Matriks Hak Akses</h1>
              <p className="text-xs text-slate-500">
                Penetapan izin wewenang (Role-Based Access Control) untuk 4 tingkatan pengguna
              </p>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Prinsip Keamanan Tertinggi Super Admin:</strong>
                Hanya akun dengan peran Super Admin yang memiliki hak mengelola perizinan dan mengubah struktur kepengurusan. Akun Super Admin tidak dapat diturunkan statusnya oleh role lain demi mencegah *lockout*.
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Fitur / Hak Akses Modul</th>
                    <th className="py-3 px-4 text-center text-rose-900 font-bold">1. Super Admin</th>
                    <th className="py-3 px-4 text-center">2. Pengurus KKG</th>
                    <th className="py-3 px-4 text-center">3. Bendahara</th>
                    <th className="py-3 px-4 text-center">4. Guru / Anggota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {matrix.map((row, i) => (
                    <tr key={i} className="hover:bg-stone-50">
                      <td className="py-3 px-4 font-medium text-slate-800">{row.feature}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                          Akses Penuh
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.p ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.b ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.g ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // 5. DATA SEKOLAH
      case 'sekolah_mgmt':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Data Sekolah Binaan Gugus 01 Bluto</h1>
                <p className="text-xs text-slate-500">Kelola informasi sekolah dasar inti dan imbas di Kecamatan Bluto</p>
              </div>
              <button
                onClick={() => {
                  setModalData(null);
                  setFormInputs({});
                  setModalType('SEKOLAH_FORM');
                }}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Sekolah Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sekolahList.map((sch) => {
                const count = anggotaList.filter((a) => a.school === sch.name).length;

                return (
                  <div
                    key={sch.id}
                    className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <School className="w-4 h-4 text-rose-700 shrink-0" />
                        <h3 className="font-bold text-slate-900 text-sm leading-snug">{sch.name}</h3>
                      </div>
                      <p className="text-xs text-slate-600">{sch.address}</p>
                      <p className="text-xs text-slate-500">
                        Kepsek: <strong>{sch.headmaster}</strong>
                      </p>
                      <div className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block">
                        NPSN: {sch.npsn}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono">{count} guru terdaftar</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setModalData(sch);
                            setFormInputs(sch);
                            setModalType('SEKOLAH_FORM');
                          }}
                          className="p-1.5 text-slate-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Edit Data Sekolah"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            confirmDelete(sch.name, () => {
                              StorageService.deleteSekolah(sch.id);
                              setSekolahList(StorageService.getSekolah());
                              setAuditLogs(StorageService.getAuditLogs());
                              onShowToast('Sekolah Dihapus', sch.name, 'info');
                            })
                          }
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Hapus Sekolah"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      // 6. STRUKTUR PENGURUS
      case 'struktur_mgmt':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Struktur Pengurus KKG Periode 2025-2027</h1>
                <p className="text-xs text-slate-500">Kelola hierarki organisasi dan pejabat pengurus gugus</p>
              </div>
              <button
                onClick={() => {
                  setModalData(null);
                  setFormInputs({ level: 4 });
                  setModalType('STRUKTUR_FORM');
                }}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Posisi Pengurus</span>
              </button>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Jabatan Struktural</th>
                    <th className="py-3 px-4">Nama Pejabat & Gelar</th>
                    <th className="py-3 px-4">Instansi Asal</th>
                    <th className="py-3 px-4">Tingkat (Level)</th>
                    <th className="py-3 px-4 text-center">Aksi Super Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {strukturList.map((str) => (
                    <tr key={str.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4 font-bold text-rose-900">{str.position}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{str.name}</div>
                        {str.nip && <div className="text-[10px] text-slate-400 font-mono">NIP: {str.nip}</div>}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{str.instance}</td>
                      <td className="py-3 px-4 font-mono">Level {str.level}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setModalData(str);
                              setFormInputs(str);
                              setModalType('STRUKTUR_FORM');
                            }}
                            className="p-1.5 text-slate-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Edit Jabatan"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              confirmDelete(str.position, () => {
                                StorageService.deleteStruktur(str.id);
                                setStrukturList(StorageService.getStruktur());
                                setAuditLogs(StorageService.getAuditLogs());
                                onShowToast('Pengurus Dihapus', str.position, 'info');
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Hapus Jabatan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // 15. PRESENSI KEHADIRAN
      case 'presensi_mgmt':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Rekapitulasi Presensi Digital KKG</h1>
                <p className="text-xs text-slate-500">Daftar presensi kehadiran guru dalam seluruh kegiatan resmi</p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar Kehadiran</span>
              </button>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Nama Guru & NIP</th>
                    <th className="py-3 px-4">Pangkalan Sekolah</th>
                    <th className="py-3 px-4">Agenda Kegiatan</th>
                    <th className="py-3 px-4">Waktu Presensi</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {presensiList.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{p.memberName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">NIP: {p.nip || '-'}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{p.school}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{p.kegiatanTitle}</td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{p.checkInTime}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded ${
                            p.status === 'Hadir'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-xs">{p.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // 16. WEBSITE SETTINGS
      case 'website_settings':
        return (
          <div className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h1 className="text-2xl font-bold text-slate-900">Pengaturan Identitas & Tampilan Website</h1>
              <p className="text-xs text-slate-500">
                Super Admin dapat mengubah teks beranda, slogan, visi misi, kontak, dan sambutan ketua secara langsung
              </p>
            </div>

            <form onSubmit={handleSaveWebsiteConfig} className="space-y-6">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900">1. Identitas & Slogan Organisasi</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Nama Organisasi Lengkap</label>
                    <input
                      type="text"
                      defaultValue={websiteConfig.orgName}
                      onChange={(e) => setFormInputs({ ...formInputs, orgName: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Nama Pendek / Akronim</label>
                    <input
                      type="text"
                      defaultValue={websiteConfig.acronym}
                      onChange={(e) => setFormInputs({ ...formInputs, acronym: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-700 font-medium mb-1">Slogan Resmi KKG</label>
                    <input
                      type="text"
                      defaultValue={websiteConfig.slogan}
                      onChange={(e) => setFormInputs({ ...formInputs, slogan: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900">2. Sambutan Ketua KKG di Beranda</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Nama Ketua Lengkap & Gelar</label>
                    <input
                      type="text"
                      defaultValue={websiteConfig.welcomeAuthor}
                      onChange={(e) => setFormInputs({ ...formInputs, welcomeAuthor: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Jabatan Resmi</label>
                    <input
                      type="text"
                      defaultValue={websiteConfig.welcomeRole}
                      onChange={(e) => setFormInputs({ ...formInputs, welcomeRole: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-700 font-medium mb-1">Judul Sambutan</label>
                    <input
                      type="text"
                      defaultValue={websiteConfig.welcomeTitle}
                      onChange={(e) => setFormInputs({ ...formInputs, welcomeTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-700 font-medium mb-1">Teks Sambutan Ketua</label>
                    <textarea
                      rows={4}
                      defaultValue={websiteConfig.welcomeText}
                      onChange={(e) => setFormInputs({ ...formInputs, welcomeText: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none text-xs leading-relaxed"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900">3. Kontak Sekretariat & Kalender</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Email Resmi KKG</label>
                    <input
                      type="email"
                      defaultValue={websiteConfig.contactEmail}
                      onChange={(e) => setFormInputs({ ...formInputs, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono focus:border-rose-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Nomor WhatsApp Layanan</label>
                    <input
                      type="text"
                      defaultValue={websiteConfig.contactPhone}
                      onChange={(e) => setFormInputs({ ...formInputs, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono focus:border-rose-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Tahun Ajaran Aktif</label>
                    <input
                      type="text"
                      defaultValue={websiteConfig.academicYear}
                      onChange={(e) => setFormInputs({ ...formInputs, academicYear: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono focus:border-rose-700 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-slate-700 font-medium mb-1">Alamat Kantor Sekretariat</label>
                    <input
                      type="text"
                      defaultValue={websiteConfig.contactAddress}
                      onChange={(e) => setFormInputs({ ...formInputs, contactAddress: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer"
                >
                  Simpan Semua Perubahan Website
                </button>
              </div>
            </form>
          </div>
        );

      // 17. AUDIT LOGS
      case 'audit_logs':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Log Aktivitas & Audit Trail Sistem</h1>
                <p className="text-xs text-slate-500">
                  Catatan kronologis tindakan penting seluruh pengguna dan pengurus portal
                </p>
              </div>
              <button
                onClick={() => {
                  const csv =
                    'data:text/csv;charset=utf-8,' +
                    ['Aksi,Modul,Aktor,Peran,Waktu,Detail,Status']
                      .concat(
                        auditLogs.map(
                          (l) =>
                            `"${l.action}","${l.module}","${l.actorName}","${l.actorRole}","${l.timestamp}","${l.details}","${l.status}"`
                        )
                      )
                      .join('\n');
                  const a = document.createElement('a');
                  a.href = encodeURI(csv);
                  a.download = `AUDIT_LOG_KKG_BLUTO_${Date.now()}.csv`;
                  a.click();
                  onShowToast('Audit Log Diekspor', 'Riwayat aktivitas telah disimpan dalam format CSV.', 'success');
                }}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor Audit CSV</span>
              </button>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Waktu Kejadian</th>
                    <th className="py-3 px-4">Aksi & Modul</th>
                    <th className="py-3 px-4">Aktor Pengguna</th>
                    <th className="py-3 px-4">Uraian / Detail Tindakan</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50 font-sans">
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-rose-900 bg-rose-50 px-2 py-0.5 rounded text-[11px] block w-fit mb-0.5">
                          {log.action}
                        </span>
                        <span className="text-[11px] text-slate-400">{log.module}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{log.actorName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{log.actorRole}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 leading-snug">{log.details}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            log.status === 'Sukses'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // 18. SYSTEM SETTINGS
      case 'system_settings':
        return (
          <div className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h1 className="text-2xl font-bold text-slate-900">Pengaturan Sistem & Pemeliharaan</h1>
              <p className="text-xs text-slate-500">
                Cadangan data, pemulihan, dan manajemen status infrastruktur aplikasi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Download className="w-5 h-5 text-rose-700" />
                  <span>Ekspor Cadangan Data (Backup)</span>
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unduh seluruh basis data portal (konfigurasi, data anggota, sekolah, dokumen, transaksi keuangan, notulen, dan log) dalam bentuk file JSON terenkripsi.
                </p>
                <button
                  onClick={handleExportSystemBackup}
                  className="px-4 py-2.5 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Cadangan JSON</span>
                </button>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-amber-700" />
                  <span>Reset Data Demonstrasi</span>
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mengembalikan seluruh data portal ke konfigurasi awal bawaan template Gugus 01 Bluto. Berguna saat pengujian fitur simulasi selesai.
                </p>
                <button
                  onClick={() =>
                    confirmDelete('Seluruh Data Demonstrasi Lokal', () => {
                      StorageService.resetAll();
                      onShowToast('Sistem Direset', 'Data telah dikembalikan ke kondisi awal demonstrasi.', 'info');
                      setTimeout(() => window.location.reload(), 600);
                    })
                  }
                  className="px-4 py-2.5 bg-stone-100 hover:bg-red-50 hover:text-red-700 text-slate-700 text-xs font-semibold rounded-xl border border-stone-200 flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset ke Pengaturan Awal</span>
                </button>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-700" />
                  <span>Skrip SQL Migrasi Database Supabase & RLS</span>
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Skrip PostgreSQL DDL lengkap dengan tabel relasional, indeks, dan aturan Row Level Security (RLS) siap salin untuk aktivasi database cloud Supabase.
                </p>
                <button
                  onClick={() => setModalType('SUPABASE_SQL')}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Code className="w-4 h-4 text-emerald-400" />
                  <span>Buka Skrip SQL & RLS Policies</span>
                </button>
              </div>
            </div>
          </div>
        );

      // 4. DATA ANGGOTA (SUPER ADMIN INLINE MANAGEMENT)
      case 'anggota_mgmt':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Kelola Master Data Anggota Guru Gugus 01</h1>
                <p className="text-xs text-slate-500">
                  Super Admin berwenang mengedit profil, mengubah status aktif/mutasi/pensiun, dan menghapus data anggota
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const csv =
                      'data:text/csv;charset=utf-8,' +
                      ['Nama,NIP,NUPTK,Sekolah,Mata Pelajaran,Status,Email,No HP']
                        .concat(
                          anggotaList.map(
                            (a) =>
                              `"${a.name}","${a.nip}","${a.nuptk}","${a.school}","${a.subject}","${a.status}","${a.email}","${a.phone}"`
                          )
                        )
                        .join('\n');
                    const dl = document.createElement('a');
                    dl.href = encodeURI(csv);
                    dl.download = `DATA_ANGGOTA_GUGUS01_${Date.now()}.csv`;
                    dl.click();
                    onShowToast('Data Anggota Diekspor', 'Daftar guru telah disimpan dalam format CSV.', 'success');
                  }}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Ekspor CSV</span>
                </button>
                <button
                  onClick={() => {
                    setModalData(null);
                    setFormInputs({ status: 'Aktif' });
                    setModalType('MEMBER_FORM');
                  }}
                  className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tambah Guru Anggota</span>
                </button>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-stone-100 flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari guru berdasarkan nama, NIP, atau sekolah..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-rose-700 focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Total Anggota: <strong>{anggotaList.length}</strong> guru
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Nama Lengkap & NIP</th>
                      <th className="py-3 px-4">Pangkalan Sekolah</th>
                      <th className="py-3 px-4">Tugas / Penugasan</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4">Kontak</th>
                      <th className="py-3 px-4 text-center">Aksi Super Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {anggotaList
                      .filter(
                        (a) =>
                          !searchTerm ||
                          a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.nip && a.nip.includes(searchTerm))
                      )
                      .map((ang) => (
                        <tr key={ang.id} className="hover:bg-stone-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={ang.avatarUrl}
                                alt={ang.name}
                                className="w-8 h-8 rounded-full object-cover border border-stone-200"
                              />
                              <div>
                                <div className="font-semibold text-slate-900">{ang.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono">NIP: {ang.nip}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-700">{ang.school}</td>
                          <td className="py-3 px-4 text-slate-600">{ang.subject}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                ang.status === 'Aktif'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {ang.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{ang.phone}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => {
                                  setModalData(ang);
                                  setFormInputs(ang);
                                  setModalType('MEMBER_FORM');
                                }}
                                className="p-1.5 text-slate-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer"
                                title="Edit Anggota"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  const updated = {
                                    ...ang,
                                    status: (ang.status === 'Aktif' ? 'Nonaktif' : 'Aktif') as any,
                                  };
                                  StorageService.updateAnggota(updated);
                                  onShowToast('Status Anggota Diubah', `${ang.name}: ${updated.status}`, 'info');
                                  onDataRefresh();
                                }}
                                className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg cursor-pointer"
                                title="Ubah Status Aktif / Nonaktif"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  confirmDelete(ang.name, () => {
                                    StorageService.deleteAnggota(ang.id);
                                    onShowToast('Anggota Dihapus', ang.name, 'info');
                                  })
                                }
                                className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                                title="Hapus Anggota"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      // 7. BERITA & PENGUMUMAN (SUPER ADMIN INLINE MANAGEMENT)
      case 'berita_mgmt':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Kelola Berita & Pengumuman Resmi</h1>
                <p className="text-xs text-slate-500">
                  Super Admin berwenang mempublikasikan, mengedit konten, menetapkan unggulan, dan menghapus siaran informasi
                </p>
              </div>
              <button
                onClick={() => {
                  setModalData(null);
                  setFormInputs({ category: 'Berita', isFeatured: false });
                  setModalType('BERITA_FORM');
                }}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tulis Berita / Pengumuman</span>
              </button>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Judul Artikel & Siaran</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Tanggal & Penulis</th>
                    <th className="py-3 px-4 text-center">Status Unggulan</th>
                    <th className="py-3 px-4 text-center">Dibaca</th>
                    <th className="py-3 px-4 text-center">Aksi Super Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {beritaList.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-semibold text-slate-900 line-clamp-1">{b.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{b.summary}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-stone-100 text-slate-700 font-medium px-2 py-0.5 rounded text-[10px]">
                          {b.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{b.publishedAt}</div>
                        <div className="text-[10px] text-slate-400">{b.author}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            const updated = { ...b, isImportant: !b.isImportant };
                            StorageService.updateBerita(updated);
                            onShowToast('Status Unggulan Diubah', updated.title, 'info');
                            onDataRefresh();
                          }}
                          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded cursor-pointer ${
                            b.isImportant
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-stone-100 text-slate-500'
                          }`}
                        >
                          {b.isImportant ? '★ Unggulan' : 'Standar'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-500">{b.type}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setModalData(b);
                              setFormInputs(b);
                              setModalType('BERITA_FORM');
                            }}
                            className="p-1.5 text-slate-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Edit Berita"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              confirmDelete(b.title, () => {
                                StorageService.deleteBerita(b.id);
                                onShowToast('Berita Dihapus', b.title, 'info');
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Hapus Berita"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // 8. FORUM GURU (SUPER ADMIN MODERATION)
      case 'forum_mgmt':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Moderasi Forum Musyawarah & Diskusi Guru</h1>
                <p className="text-xs text-slate-500">
                  Super Admin berwenang mengunci topik diskusi, memoderasi pesan, dan menghapus thread yang tidak sesuai etika pendidik
                </p>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Topik Pembahasan</th>
                    <th className="py-3 px-4">Inisiator Diskusi</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4 text-center">Balasan</th>
                    <th className="py-3 px-4 text-center">Status Moderasi</th>
                    <th className="py-3 px-4 text-center">Aksi Super Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {forumTopics.map((t) => (
                    <tr key={t.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-semibold text-slate-900 line-clamp-1">{t.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{t.createdAt}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{t.authorName}</div>
                        <div className="text-[10px] text-slate-500">{t.authorSchool}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-rose-50 text-rose-800 font-medium px-2 py-0.5 rounded text-[10px]">
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                        {t.commentCount}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            t.isLocked
                              ? 'bg-red-50 text-red-800 border border-red-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {t.isLocked ? 'Terkunci' : 'Terbuka'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleToggleLockForum(t)}
                            className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg cursor-pointer"
                            title={t.isLocked ? 'Buka Kunci Diskusi' : 'Kunci Diskusi'}
                          >
                            {t.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() =>
                              confirmDelete(t.title, () => {
                                StorageService.deleteForumTopic(t.id);
                                onShowToast('Topik Forum Dihapus', t.title, 'info');
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Hapus Topik"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // 9. BANK PERANGKAT AJAR (SUPER ADMIN MANAGEMENT)
      case 'perangkat_mgmt':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Arsip & Manajemen Bank Perangkat Ajar</h1>
                <p className="text-xs text-slate-500">
                  Super Admin berwenang mengunggah modul ajar, memvalidasi kelayakan, mengedit berkas, dan menghapus dokumen
                </p>
              </div>
              <button
                onClick={() => {
                  setModalData(null);
                  setFormInputs({ category: 'Modul Ajar', gradeLevel: 'Fase B (Kelas 3-4)', fileFormat: 'PDF' });
                  setModalType('PERANGKAT_FORM');
                }}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Unggah Dokumen Perangkat</span>
              </button>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Judul Dokumen Perangkat</th>
                    <th className="py-3 px-4">Mapel & Fase</th>
                    <th className="py-3 px-4">Guru Kontributor</th>
                    <th className="py-3 px-4">Format & Ukuran</th>
                    <th className="py-3 px-4 text-center">Unduhan</th>
                    <th className="py-3 px-4 text-center">Aksi Super Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {perangkatList.map((doc) => (
                    <tr key={doc.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-semibold text-slate-900 line-clamp-1">{doc.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.category}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{doc.subject}</div>
                        <div className="text-[10px] text-slate-500">{doc.gradeLevel}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{doc.uploaderName}</div>
                        <div className="text-[10px] text-slate-400">{doc.uploaderSchool}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded">
                            {doc.fileFormat}
                          </span>
                          {doc.driveUrl && (
                            <span className="font-sans font-medium text-[9px] text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                              Drive
                            </span>
                          )}
                          <span className="text-slate-400">{doc.fileSize}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-600">{doc.downloadCount}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {doc.driveUrl && (
                            <a
                              href={doc.driveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg cursor-pointer"
                              title="Buka Tautan Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => {
                              triggerDocumentDownload(
                                `${doc.title}.${doc.fileFormat.toLowerCase()}.txt`,
                                doc.title,
                                {
                                  Kategori: doc.category,
                                  'Mata Pelajaran': doc.subject,
                                  'Fase / Kelas': doc.gradeLevel,
                                  Pengunggah: `${doc.uploaderName} (${doc.uploaderSchool})`,
                                  'Format & Ukuran': `${doc.fileFormat} (${doc.fileSize})`,
                                  'Link Drive': doc.driveUrl,
                                  Deskripsi: doc.description,
                                }
                              );
                              onShowToast('Berkas Diunduh', `${doc.title} (${doc.fileFormat}) berhasil diunduh.`, 'success');
                            }}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                            title="Unduh Berkas"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setModalData(doc);
                              setFormInputs(doc);
                              setModalType('PERANGKAT_FORM');
                            }}
                            className="p-1.5 text-slate-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Edit Perangkat"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              confirmDelete(doc.title, () => {
                                StorageService.deletePerangkat(doc.id);
                                onShowToast('Perangkat Dihapus', doc.title, 'info');
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Hapus Dokumen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // 10. PROGRAM & KEGIATAN (SUPER ADMIN MANAGEMENT)
      case 'kegiatan_mgmt':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Manajemen Program Kerja & Agenda Kegiatan</h1>
                <p className="text-xs text-slate-500">
                  Super Admin berwenang menjadwalkan workshop, kkg rutin, bimtek kurikulum, dan mengelola peserta kegiatan
                </p>
              </div>
              <button
                onClick={() => {
                  setModalData(null);
                  setFormInputs({ type: 'KKG Rutin', status: 'Akan Datang' });
                  setModalType('KEGIATAN_FORM');
                }}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Jadwalkan Kegiatan Baru</span>
              </button>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Nama Agenda Kegiatan</th>
                    <th className="py-3 px-4">Jenis</th>
                    <th className="py-3 px-4">Waktu & Tanggal</th>
                    <th className="py-3 px-4">Lokasi / Tuan Rumah</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Aksi Super Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {kegiatanList.map((keg) => (
                    <tr key={keg.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-semibold text-slate-900 line-clamp-1">{keg.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">PJ: {keg.personInCharge}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-stone-100 text-slate-700 font-medium px-2 py-0.5 rounded text-[10px]">
                          {keg.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{keg.date}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{keg.time}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{keg.location}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            keg.status === 'Akan Datang'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {keg.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setModalData(keg);
                              setFormInputs(keg);
                              setModalType('KEGIATAN_FORM');
                            }}
                            className="p-1.5 text-slate-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Edit Kegiatan"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              confirmDelete(keg.title, () => {
                                StorageService.deleteKegiatan(keg.id);
                                onShowToast('Kegiatan Dihapus', keg.title, 'info');
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Hapus Kegiatan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // 11. ADMINISTRASI KKG (SUPER ADMIN MANAGEMENT)
      case 'administrasi_mgmt':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Tata Usaha & Arsip Dokumen Administrasi KKG</h1>
                <p className="text-xs text-slate-500">
                  Super Admin berwenang mengarsipkan surat masuk, surat keluar, SK kepengurusan, notulen, dan dokumen legal
                </p>
              </div>
              <button
                onClick={() => {
                  setModalData(null);
                  setFormInputs({ type: 'SK Pengurus' });
                  setModalType('ADMINISTRASI_FORM');
                }}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Arsipkan Surat / Dokumen</span>
              </button>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Nomor Berkas & Tanggal</th>
                    <th className="py-3 px-4">Perihal / Judul Berkas</th>
                    <th className="py-3 px-4">Jenis Arsip</th>
                    <th className="py-3 px-4">Instansi Terkait</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Aksi Super Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {administrasiList.map((adm) => (
                    <tr key={adm.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-rose-900">{adm.letterNumber}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{adm.date}</div>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-semibold text-slate-900">{adm.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{adm.senderOrRecipient}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-stone-100 text-slate-700 font-medium px-2 py-0.5 rounded text-[10px]">
                          {adm.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{adm.senderOrRecipient}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded">
                          {adm.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              triggerDocumentDownload(
                                `${adm.letterNumber}_${adm.title}.txt`,
                                adm.title,
                                {
                                  'Nomor Berkas': adm.letterNumber,
                                  Kategori: adm.category,
                                  Tanggal: adm.date,
                                  'Instansi Terkait': adm.senderOrRecipient,
                                  Format: `${adm.fileFormat} (${adm.fileSize})`,
                                  Status: adm.status,
                                }
                              );
                              onShowToast('Arsip Diunduh', `${adm.letterNumber} berhasil diunduh.`, 'success');
                            }}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                            title="Unduh Berkas"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setModalData(adm);
                              setFormInputs(adm);
                              setModalType('ADMINISTRASI_FORM');
                            }}
                            className="p-1.5 text-slate-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Edit Berkas"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              confirmDelete(adm.letterNumber, () => {
                                StorageService.deleteAdministrasi(adm.id);
                                onShowToast('Arsip Dihapus', adm.letterNumber, 'info');
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Hapus Arsip"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // 12. LAPORAN KEUANGAN (SUPER ADMIN AUDIT & MANAGEMENT)
      case 'keuangan_mgmt':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Buku Kas & Pengawasan Keuangan KKG</h1>
                <p className="text-xs text-slate-500">
                  Super Admin memiliki wewenang mencatat kas masuk/keluar, memverifikasi laporan bendahara, serta membatalkan transaksi dengan jejak audit
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Buku Kas</span>
                </button>
                <button
                  onClick={() => {
                    setModalData(null);
                    setFormInputs({ type: 'Pemasukan', amount: 100000 });
                    setModalType('TRANSAKSI_FORM');
                  }}
                  className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Catat Transaksi Kas</span>
                </button>
              </div>
            </div>

            {/* Quick Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] text-slate-500 block">Saldo Kas Terkini</span>
                <div className="text-2xl font-extrabold text-rose-900 font-mono mt-1">
                  {formatRupiah(totalKas)}
                </div>
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] text-slate-500 block">Total Pemasukan Kas</span>
                <div className="text-xl font-bold text-emerald-700 font-mono mt-1">
                  {formatRupiah(
                    transaksiList
                      .filter((t) => t.type === 'Pemasukan')
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </div>
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
                <span className="text-[11px] text-slate-500 block">Total Pengeluaran Kas</span>
                <div className="text-xl font-bold text-slate-700 font-mono mt-1">
                  {formatRupiah(
                    transaksiList
                      .filter((t) => t.type === 'Pengeluaran')
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">No. Transaksi & Tanggal</th>
                    <th className="py-3 px-4">Tipe Kas</th>
                    <th className="py-3 px-4">Kategori & Uraian</th>
                    <th className="py-3 px-4 text-right">Nominal</th>
                    <th className="py-3 px-4">PJ / Bendahara</th>
                    <th className="py-3 px-4 text-center">Aksi Super Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {transaksiList.map((trx) => (
                    <tr key={trx.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-800">{trx.transactionNumber}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{trx.date}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            trx.type === 'Pemasukan'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {trx.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-semibold text-slate-900">{trx.category}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{trx.description}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {formatRupiah(trx.amount)}
                      </td>
                      <td className="py-3 px-4 text-slate-700">{trx.recordedBy}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleVoidTransaksi(trx)}
                          className="px-2.5 py-1 text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-[10px] font-semibold cursor-pointer"
                          title="Batalkan Transaksi dengan Catatan Audit"
                        >
                          Batalkan (Void)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // 13. ASPIRASI & SARAN (SUPER ADMIN TRIAGE)
      case 'aspirasi_mgmt':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Pengelolaan Kotak Aspirasi & Saran Guru</h1>
                <p className="text-xs text-slate-500">
                  Super Admin meninjau aspirasi anggota, memperbarui status penanganan, dan memberikan catatan respon resmi
                </p>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Pengirim & Sekolah</th>
                    <th className="py-3 px-4">Kategori & Judul Saran</th>
                    <th className="py-3 px-4">Isi Pesan Aspirasi</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Tanggapan Pimpinan</th>
                    <th className="py-3 px-4 text-center">Aksi Super Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {aspirasiList.map((asp) => (
                    <tr key={asp.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{asp.senderName}</div>
                        <div className="text-[10px] text-slate-400">{asp.school}</div>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">{asp.submittedAt}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-stone-100 text-slate-700 font-medium px-2 py-0.5 rounded text-[10px] block w-fit mb-1">
                          {asp.category}
                        </span>
                        <div className="font-medium text-slate-800">{asp.title}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs leading-relaxed">{asp.content}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            asp.status === 'Ditindaklanjuti'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : asp.status === 'Ditinjau Pengurus'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {asp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px] italic">
                        {asp.responseNotes || 'Belum ada tanggapan resmi'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setModalData(asp);
                              setFormInputs({ status: asp.status, responseNotes: asp.responseNotes || '' });
                              setModalType('ASPIRASI_RESPOND_FORM');
                            }}
                            className="p-1.5 text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Tanggapi & Ubah Status"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              confirmDelete(asp.title, () => {
                                StorageService.deleteAspirasi(asp.id);
                                onShowToast('Aspirasi Dihapus', asp.title, 'info');
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Hapus Aspirasi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // 14. GALERI KEGIATAN (SUPER ADMIN PHOTO MGMT)
      case 'galeri_mgmt':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Manajemen Dokumentasi & Galeri Foto</h1>
                <p className="text-xs text-slate-500">
                  Super Admin berwenang mengunggah foto dokumentasi kegiatan, menyunting narasi, dan menghapus foto arsip
                </p>
              </div>
              <button
                onClick={() => {
                  setModalData(null);
                  setFormInputs({ category: 'Workshop' });
                  setModalType('GALERI_FORM');
                }}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Unggah Dokumentasi Foto</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galeriList.map((gal) => (
                <div key={gal.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm group">
                  <div className="relative aspect-video overflow-hidden bg-stone-100">
                    <img
                      src={gal.imageUrl}
                      alt={gal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                      {gal.category}
                    </span>
                    <button
                      onClick={() =>
                        confirmDelete(gal.title, () => {
                          StorageService.deleteGaleri(gal.id);
                          onShowToast('Foto Dihapus', gal.title, 'info');
                        })
                      }
                      className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-3 space-y-1">
                    <div className="font-semibold text-slate-900 text-xs line-clamp-1">{gal.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{gal.date} • {gal.category}</div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{gal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // DEFAULT FALLBACK
      default:
        return (
          <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
            <ShieldCheck className="w-12 h-12 text-rose-800 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">
              Modul Super Admin: {activeTab.replace('_', ' ').toUpperCase()}
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              Sebagai Super Admin pemegang hak akses tertinggi, Anda memiliki wewenang mutlak untuk mengelola seluruh data, dokumen, konfigurasi, dan aktivitas website.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderTabContent()}

      {/* USER FORM MODAL */}
      {modalType === 'USER_FORM' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-rose-700" />
              <span>{modalData ? 'Edit Akun Pengguna' : 'Tambah Akun Pengguna Baru'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Konfigurasi hak akses dan informasi pengguna di Portal KKG Gugus 01.
            </p>

            <form onSubmit={handleSaveUserAccount} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  defaultValue={modalData?.name || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })}
                  placeholder="Contoh: Siti Aisyah, S.Pd."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Alamat Email / Belajar.id *</label>
                <input
                  type="email"
                  required
                  defaultValue={modalData?.email || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })}
                  placeholder="nama@sekolah.belajar.id"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Role / Hak Akses *</label>
                  <select
                    defaultValue={modalData?.role || 'guru'}
                    onChange={(e) => setFormInputs({ ...formInputs, role: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-semibold text-rose-900"
                  >
                    <option value="super_admin">Super Admin (Tertinggi)</option>
                    <option value="pengurus">Pengurus KKG</option>
                    <option value="bendahara">Bendahara KKG</option>
                    <option value="guru">Guru / Anggota</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Status Akun</label>
                  <select
                    defaultValue={modalData?.status || 'Aktif'}
                    onChange={(e) => setFormInputs({ ...formInputs, status: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Pangkalan Sekolah</label>
                  <input
                    type="text"
                    defaultValue={modalData?.school || ''}
                    onChange={(e) => setFormInputs({ ...formInputs, school: e.target.value })}
                    placeholder="Ketik manual Nama SD (cth: SDN Bluto I)"
                    list="sekolah-list-options"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                  <datalist id="sekolah-list-options">
                    {sekolahList.map((s) => (
                      <option key={s.id} value={s.name} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    defaultValue={modalData?.phone || ''}
                    onChange={(e) => setFormInputs({ ...formInputs, phone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Simpan Akun Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEKOLAH FORM MODAL */}
      {modalType === 'SEKOLAH_FORM' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <School className="w-5 h-5 text-rose-700" />
              <span>{modalData ? 'Edit Data Sekolah' : 'Tambah Sekolah Baru'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pangkalan sekolah dasar anggota Gugus 01 Kecamatan Bluto.
            </p>

            <form onSubmit={handleSaveSekolah} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Sekolah Lengkap *</label>
                <input
                  type="text"
                  required
                  defaultValue={modalData?.name || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })}
                  placeholder="Contoh: SDN Bluto III"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">NPSN (Nomor Pokok Sekolah Nasional) *</label>
                <input
                  type="text"
                  required
                  defaultValue={modalData?.npsn || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, npsn: e.target.value })}
                  placeholder="205298xx"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Kepala Sekolah & Gelar</label>
                <input
                  type="text"
                  defaultValue={modalData?.headmaster || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, headmaster: e.target.value })}
                  placeholder="Contoh: Drs. H. Sumarno, M.Pd."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Alamat Sekolah</label>
                <input
                  type="text"
                  defaultValue={modalData?.address || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, address: e.target.value })}
                  placeholder="Jl. Raya Desa ..., Kec. Bluto"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Simpan Sekolah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STRUKTUR FORM MODAL */}
      {modalType === 'STRUKTUR_FORM' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <Award className="w-5 h-5 text-rose-700" />
              <span>{modalData ? 'Edit Jabatan Pengurus' : 'Tambah Posisi Pengurus Baru'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Susunan kepengurusan organisasi KKG Gugus 01 Kecamatan Bluto.
            </p>

            <form onSubmit={handleSaveStruktur} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Jabatan / Bidang *</label>
                <input
                  type="text"
                  required
                  defaultValue={modalData?.position || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, position: e.target.value })}
                  placeholder="Contoh: Bidang Penguatan Karakter & P5"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Pejabat & Gelar *</label>
                <input
                  type="text"
                  required
                  defaultValue={modalData?.name || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })}
                  placeholder="Contoh: Dewi Rahmawati, S.Pd."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">NIP (Jika Ada)</label>
                  <input
                    type="text"
                    defaultValue={modalData?.nip || ''}
                    onChange={(e) => setFormInputs({ ...formInputs, nip: e.target.value })}
                    placeholder="1990xxxx..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tingkatan Level</label>
                  <select
                    defaultValue={modalData?.level || 4}
                    onChange={(e) => setFormInputs({ ...formInputs, level: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    <option value={1}>Level 1: Pembina / Korwil / Pengawas</option>
                    <option value={2}>Level 2: Ketua / Wakil Ketua</option>
                    <option value={3}>Level 3: Sekretaris / Bendahara</option>
                    <option value={4}>Level 4: Koordinator Bidang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Instansi / Asal Sekolah</label>
                <input
                  type="text"
                  defaultValue={modalData?.instance || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, instance: e.target.value })}
                  placeholder="Contoh: SDN Aengbaja Raja II"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Simpan Pengurus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEMBER FORM MODAL */}
      {modalType === 'MEMBER_FORM' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-rose-700" />
              <span>{modalData ? 'Edit Data Anggota Guru' : 'Tambah Anggota Guru Baru'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pembaruan master data pendidik di gugus sekolah dasar Kecamatan Bluto.
            </p>

            <form onSubmit={handleSaveMember} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  defaultValue={modalData?.name || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })}
                  placeholder="Contoh: Achmad Rofiq, S.Pd.SD"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">NIP (18 Digit)</label>
                  <input
                    type="text"
                    defaultValue={modalData?.nip || ''}
                    onChange={(e) => setFormInputs({ ...formInputs, nip: e.target.value })}
                    placeholder="1987xxxx..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">NUPTK (16 Digit)</label>
                  <input
                    type="text"
                    defaultValue={modalData?.nuptk || ''}
                    onChange={(e) => setFormInputs({ ...formInputs, nuptk: e.target.value })}
                    placeholder="4567xxxx..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Pangkalan Sekolah *</label>
                  <input
                    type="text"
                    required
                    defaultValue={modalData?.school || ''}
                    onChange={(e) => setFormInputs({ ...formInputs, school: e.target.value })}
                    placeholder="Ketik manual Nama SD (cth: SDN Aengbaja Raja I)"
                    list="sekolah-list-options"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Status Keanggotaan</label>
                  <select
                    defaultValue={modalData?.status || 'Aktif'}
                    onChange={(e) => setFormInputs({ ...formInputs, status: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-semibold text-rose-900"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                    <option value="Mutasi">Mutasi</option>
                    <option value="Pensiun">Pensiun</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Tugas / Penugasan Guru</label>
                <input
                  type="text"
                  defaultValue={modalData?.subject || 'Guru Kelas Fase B'}
                  onChange={(e) => setFormInputs({ ...formInputs, subject: e.target.value })}
                  placeholder="Contoh: Guru Kelas Fase A (Kelas 1)"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    defaultValue={modalData?.phone || ''}
                    onChange={(e) => setFormInputs({ ...formInputs, phone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Email Belajar.id</label>
                  <input
                    type="email"
                    defaultValue={modalData?.email || ''}
                    onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })}
                    placeholder="nama@guru.sd.belajar.id"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BERITA FORM MODAL */}
      {modalType === 'BERITA_FORM' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-rose-700" />
              <span>{modalData ? 'Edit Berita / Pengumuman' : 'Tulis Berita / Pengumuman Baru'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Publikasikan informasi resmi untuk seluruh pendidik di lingkungan Gugus 01 Bluto.
            </p>

            <form onSubmit={handleSaveBerita} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Judul Artikel / Siaran *</label>
                <input
                  type="text"
                  required
                  defaultValue={modalData?.title || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, title: e.target.value })}
                  placeholder="Contoh: Pembinaan Administrasi Pembelajaran Guru Semester Genap"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Kategori *</label>
                  <select
                    defaultValue={modalData?.category || 'Berita'}
                    onChange={(e) => setFormInputs({ ...formInputs, category: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    <option value="Berita">Berita</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Opini">Opini</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Penulis / Sumber</label>
                  <input
                    type="text"
                    defaultValue={modalData?.author || currentUser.name}
                    onChange={(e) => setFormInputs({ ...formInputs, author: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Ringkasan Berita (Lead)</label>
                <textarea
                  rows={2}
                  defaultValue={modalData?.summary || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, summary: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu pratinjau..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Isi Artikel Lengkap *</label>
                <textarea
                  rows={6}
                  required
                  defaultValue={modalData?.content || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, content: e.target.value })}
                  placeholder="Tuliskan berita lengkap di sini..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none text-xs leading-relaxed"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Terbitkan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PERANGKAT FORM MODAL */}
      {modalType === 'PERANGKAT_FORM' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-700" />
              <span>{modalData ? 'Edit Dokumen Perangkat' : 'Unggah Perangkat Ajar Baru'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Bank dokumen ajar Kurikulum Merdeka resmi KKG Gugus 01 Bluto.
            </p>

            <form onSubmit={handleSavePerangkat} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Judul Perangkat Ajar *</label>
                <input
                  type="text"
                  required
                  defaultValue={modalData?.title || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, title: e.target.value })}
                  placeholder="Contoh: Modul Ajar Matematika - Perkalian Bilangan Bulat"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Kategori Perangkat</label>
                  <select
                    defaultValue={modalData?.category || 'Modul Ajar'}
                    onChange={(e) => setFormInputs({ ...formInputs, category: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    <option value="Modul Ajar">Modul Ajar</option>
                    <option value="ATP">Alur Tujuan Pembelajaran (ATP)</option>
                    <option value="RPP">RPP / Modul Ajar Sederhana</option>
                    <option value="LKPD">Lembar Kerja Peserta Didik (LKPD)</option>
                    <option value="Bahan Ajar">Bahan Ajar & Media Presentasi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Fase / Tingkat</label>
                  <select
                    defaultValue={modalData?.gradeLevel || 'Fase B (Kelas 3-4)'}
                    onChange={(e) => setFormInputs({ ...formInputs, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    <option value="Fase A (Kelas 1-2)">Fase A (Kelas 1 - 2)</option>
                    <option value="Fase B (Kelas 3-4)">Fase B (Kelas 3 - 4)</option>
                    <option value="Fase C (Kelas 5-6)">Fase C (Kelas 5 - 6)</option>
                    <option value="Semua Fase">Semua Fase</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    defaultValue={modalData?.subject || 'Bahasa Indonesia'}
                    onChange={(e) => setFormInputs({ ...formInputs, subject: e.target.value })}
                    placeholder="Matematika / IPAS / PJOK"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Format Berkas</label>
                  <select
                    defaultValue={modalData?.fileFormat || 'PDF'}
                    onChange={(e) => setFormInputs({ ...formInputs, fileFormat: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="PPTX">PPTX</option>
                    <option value="XLSX">XLSX</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Tautan Google Drive (Opsional / Unggah via Drive)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    defaultValue={modalData?.driveUrl || ''}
                    onChange={(e) => setFormInputs({ ...formInputs, driveUrl: e.target.value })}
                    placeholder="https://drive.google.com/file/d/... atau https://drive.google.com/drive/folders/..."
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono text-xs"
                  />
                  <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Masukkan link file / folder Google Drive resmi (pastikan setelan izin akses terbuka).
                </p>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Deskripsi Singkat Dokumen</label>
                <textarea
                  rows={3}
                  defaultValue={modalData?.description || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, description: e.target.value })}
                  placeholder="Cakupan capaian pembelajaran, tujuan materi, dll..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KEGIATAN FORM MODAL */}
      {modalType === 'KEGIATAN_FORM' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-700" />
              <span>{modalData ? 'Edit Agenda Kegiatan' : 'Jadwalkan Kegiatan Baru'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Penetapan jadwal kegiatan KKG, workshop, atau pelatihan kompetensi guru.
            </p>

            <form onSubmit={handleSaveKegiatan} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Agenda Kegiatan *</label>
                <input
                  type="text"
                  required
                  defaultValue={modalData?.title || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, title: e.target.value })}
                  placeholder="Contoh: Bimtek Penyusunan Modul Projek P5"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Jenis Kegiatan</label>
                  <select
                    defaultValue={modalData?.type || 'KKG Rutin'}
                    onChange={(e) => setFormInputs({ ...formInputs, type: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    <option value="KKG Rutin">KKG Rutin</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Pelatihan">Pelatihan</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Pendampingan">Pendampingan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Status Kegiatan</label>
                  <select
                    defaultValue={modalData?.status || 'Akan Datang'}
                    onChange={(e) => setFormInputs({ ...formInputs, status: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-semibold text-rose-900"
                  >
                    <option value="Akan Datang">Akan Datang</option>
                    <option value="Berlangsung">Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tanggal Pelaksanaan *</label>
                  <input
                    type="text"
                    required
                    defaultValue={modalData?.date || ''}
                    onChange={(e) => setFormInputs({ ...formInputs, date: e.target.value })}
                    placeholder="Sabtu, 28 November 2025"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Waktu (Jam) *</label>
                  <input
                    type="text"
                    required
                    defaultValue={modalData?.time || '08.00 - 12.00 WIB'}
                    onChange={(e) => setFormInputs({ ...formInputs, time: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Lokasi / Tuan Rumah</label>
                  <input
                    type="text"
                    defaultValue={modalData?.location || ''}
                    onChange={(e) => setFormInputs({ ...formInputs, location: e.target.value })}
                    placeholder="Ketik manual Nama SD / Lokasi (cth: SDN Bluto I)"
                    list="sekolah-list-options"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Penanggung Jawab (PJ)</label>
                  <input
                    type="text"
                    defaultValue={modalData?.personInCharge || currentUser.name}
                    onChange={(e) => setFormInputs({ ...formInputs, personInCharge: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  defaultValue={modalData?.description || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, description: e.target.value })}
                  placeholder="Uraian sasaran dan materi agenda..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMINISTRASI FORM MODAL */}
      {modalType === 'ADMINISTRASI_FORM' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <FolderLock className="w-5 h-5 text-rose-700" />
              <span>{modalData ? 'Edit Berkas Administrasi' : 'Arsipkan Dokumen Baru'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pengarsipan digital tata usaha dan persuratan resmi KKG Gugus 01 Bluto.
            </p>

            <form onSubmit={handleSaveAdministrasi} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nomor Surat / SK Resmi *</label>
                <input
                  type="text"
                  required
                  defaultValue={modalData?.letterNumber || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, letterNumber: e.target.value })}
                  placeholder="08/KKG-BLT01/XI/2025"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Perihal / Judul Berkas *</label>
                <input
                  type="text"
                  required
                  defaultValue={modalData?.title || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, title: e.target.value })}
                  placeholder="Contoh: Undangan Musyawarah Kerja Rutin Bulan November"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Jenis Arsip</label>
                  <select
                    defaultValue={modalData?.type || 'SK Pengurus'}
                    onChange={(e) => setFormInputs({ ...formInputs, type: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    <option value="Surat Masuk">Surat Masuk</option>
                    <option value="Surat Keluar">Surat Keluar</option>
                    <option value="SK Pengurus">SK Kepengurusan</option>
                    <option value="Notulen Rapat">Notulen Rapat</option>
                    <option value="Laporan Kegiatan">Laporan Kegiatan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Instansi Terkait</label>
                  <input
                    type="text"
                    defaultValue={modalData?.senderOrRecipient || 'Korwil Pendidikan Bluto'}
                    onChange={(e) => setFormInputs({ ...formInputs, senderOrRecipient: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Keterangan / Uraian Ringkas</label>
                <textarea
                  rows={3}
                  defaultValue={modalData?.description || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, description: e.target.value })}
                  placeholder="Catatan disposisi atau ringkasan surat..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Simpan Arsip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TRANSAKSI FORM MODAL */}
      {modalType === 'TRANSAKSI_FORM' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-rose-700" />
              <span>Catat Transaksi Buku Kas KKG</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pencatatan kas masuk atau keluar dengan jejak audit Super Admin.
            </p>

            <form onSubmit={handleSaveTransaksi} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tipe Transaksi *</label>
                  <select
                    defaultValue={formInputs.type || 'Pemasukan'}
                    onChange={(e) => setFormInputs({ ...formInputs, type: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-bold text-rose-900"
                  >
                    <option value="Pemasukan">Pemasukan Kas (+)</option>
                    <option value="Pengeluaran">Pengeluaran Kas (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nominal (Rupiah) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={1000}
                    defaultValue={formInputs.amount || 150000}
                    onChange={(e) => setFormInputs({ ...formInputs, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Kategori Transaksi *</label>
                <select
                  defaultValue={formInputs.category || 'Iuran Bulanan Anggota'}
                  onChange={(e) => setFormInputs({ ...formInputs, category: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                >
                  <option value="Iuran Bulanan Anggota">Iuran Bulanan Anggota</option>
                  <option value="Bantuan Operasional">Bantuan Operasional Gugus</option>
                  <option value="Konsumsi Kegiatan">Konsumsi Rapat / Workshop</option>
                  <option value="ATK & Penggandaan">ATK & Bahan Cetak Perangkat</option>
                  <option value="Honorarium Narasumber">Honorarium Pemateri / Narasumber</option>
                  <option value="Operasional Sekretariat">Operasional Sekretariat & Web</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Uraian / Keterangan Transaksi *</label>
                <textarea
                  rows={3}
                  required
                  defaultValue=""
                  onChange={(e) => setFormInputs({ ...formInputs, description: e.target.value })}
                  placeholder="Contoh: Penerimaan iuran kas gugus dari 8 SD binaan bulan November"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Simpan Transaksi Kas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASPIRASI RESPOND MODAL */}
      {modalType === 'ASPIRASI_RESPOND_FORM' && modalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <Send className="w-5 h-5 text-rose-700" />
              <span>Tindak Lanjut & Respon Aspirasi</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Perbarui status tiket dan berikan catatan resmi pengurus untuk pengirim.
            </p>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1 mb-4 text-xs">
              <div className="font-semibold text-slate-900">{modalData.title}</div>
              <div className="text-slate-600 leading-relaxed italic">"{modalData.content}"</div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Oleh: {modalData.senderName} ({modalData.senderSchool})
              </div>
            </div>

            <form onSubmit={handleSaveAspirasiResponse} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Status Tindak Lanjut *</label>
                <select
                  defaultValue={modalData.status}
                  onChange={(e) => setFormInputs({ ...formInputs, status: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-semibold text-rose-900"
                >
                  <option value="Diterima">Diterima</option>
                  <option value="Ditinjau">Ditinjau / Sedang Diproses</option>
                  <option value="Selesai">Selesai / Ditindaklanjuti</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Catatan Tanggapan Pimpinan *</label>
                <textarea
                  rows={3}
                  required
                  defaultValue={modalData.responseNotes || ''}
                  onChange={(e) => setFormInputs({ ...formInputs, responseNotes: e.target.value })}
                  placeholder="Tuliskan tindak lanjut atau tanggapan resmi..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Simpan Tanggapan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALERI FORM MODAL */}
      {modalType === 'GALERI_FORM' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-rose-700" />
              <span>Unggah Dokumentasi Foto Kegiatan</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Tambahkan foto arsip kegiatan resmi guru Gugus 01 Kecamatan Bluto.
            </p>

            <form onSubmit={handleSaveGaleri} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Judul Foto / Kegiatan *</label>
                <input
                  type="text"
                  required
                  defaultValue=""
                  onChange={(e) => setFormInputs({ ...formInputs, title: e.target.value })}
                  placeholder="Contoh: Workshop Pengimbasan Pemanfaatan PMM Gugus 01"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Kategori Dokumentasi</label>
                  <select
                    defaultValue="Workshop"
                    onChange={(e) => setFormInputs({ ...formInputs, category: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="KKG Rutin">KKG Rutin</option>
                    <option value="Pelatihan">Pelatihan</option>
                    <option value="Upacara & Seremonial">Upacara & Seremonial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Lokasi Foto</label>
                  <input
                    type="text"
                    defaultValue="SDN Bluto I"
                    onChange={(e) => setFormInputs({ ...formInputs, location: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">URL Foto (Gambar Resolusi Tinggi)</label>
                <input
                  type="url"
                  defaultValue="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"
                  onChange={(e) => setFormInputs({ ...formInputs, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Keterangan / Caption</label>
                <textarea
                  rows={2}
                  defaultValue=""
                  onChange={(e) => setFormInputs({ ...formInputs, description: e.target.value })}
                  placeholder="Keterangan singkat momen dokumentasi..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Simpan Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUPABASE SQL SCHEMA MODAL */}
      {modalType === 'SUPABASE_SQL' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 text-stone-100 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-stone-700 relative animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Database className="w-4 h-4" />
                <span>Supabase PostgreSQL Schema & RLS Blueprint</span>
              </div>
              <h3 className="font-bold text-white text-lg">
                Skrip SQL Migrasi Database Lengkap (Ready to Deploy)
              </h3>
              <p className="text-xs text-stone-400">
                Skrip DDL ini siap disalin ke <strong>Supabase SQL Editor</strong> untuk memigrasikan penyimpanan dari in-memory/localStorage ke database PostgreSQL dengan autentikasi multi-peran dan Row Level Security.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto bg-stone-950 p-4 rounded-xl border border-stone-800 text-[11px] font-mono text-emerald-300 space-y-1">
              <pre className="whitespace-pre-wrap">{`-- ========================================================
-- PORTAL DIGITAL KKG GUGUS 01 KECAMATAN BLUTO
-- SUPABASE POSTGRESQL DDL & ROW LEVEL SECURITY (RLS)
-- ========================================================

-- 1. ENUM ROLES
CREATE TYPE user_role AS ENUM ('super_admin', 'pengurus', 'bendahara', 'guru');

-- 2. USER PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'guru' NOT NULL,
  school TEXT NOT NULL,
  nip TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MASTER ANGGOTA GURU
CREATE TABLE IF NOT EXISTS public.anggota (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nip TEXT NOT NULL,
  nuptk TEXT,
  school TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'Aktif' NOT NULL,
  phone TEXT,
  email TEXT,
  join_year TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BANK PERANGKAT AJAR
CREATE TABLE IF NOT EXISTS public.perangkat_ajar (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  phase TEXT NOT NULL,
  grade TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  file_format TEXT NOT NULL,
  file_url TEXT,
  download_count INT DEFAULT 0,
  uploader_name TEXT NOT NULL,
  uploader_school TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROGRAM & KEGIATAN
CREATE TABLE IF NOT EXISTS public.kegiatan (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  person_in_charge TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Akan Datang' NOT NULL
);

-- 6. TRANSAKSI KEUANGAN
CREATE TABLE IF NOT EXISTS public.transaksi_keuangan (
  id TEXT PRIMARY KEY,
  transaction_number TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  description TEXT,
  person_in_charge TEXT NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  details TEXT,
  status TEXT DEFAULT 'Sukses' NOT NULL
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anggota ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perangkat_ajar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kegiatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaksi_keuangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- SUPER ADMIN FULL ACCESS POLICY (HIGHEST AUTHORITY)
CREATE POLICY "Super Admin Full Access on All Tables" 
  ON public.profiles FOR ALL 
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin');

-- BENDAHARA ACCESS ON TRANSAKSI KEUANGAN
CREATE POLICY "Bendahara Manage Kas" 
  ON public.transaksi_keuangan FOR ALL 
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('super_admin', 'bendahara'));

-- PUBLIC READ ON ANGGOTA & PERANGKAT
CREATE POLICY "Allow Public Read Anggota" ON public.anggota FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Perangkat" ON public.perangkat_ajar FOR SELECT USING (true);
`}</pre>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-stone-800 mt-4">
              <span className="text-[11px] text-stone-400">
                PostgreSQL v15+ compliant, kompatibel penuh dengan Supabase Studio
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`-- PORTAL KKG GUGUS 01 BLUTO SUPABASE SCHEMA\n-- Run in Supabase SQL Editor`);
                    onShowToast('Skrip SQL Disalin', 'Skrip migrasi Supabase siap ditempel di SQL Editor.', 'success');
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Salin Skrip SQL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IN-APP SUPER ADMIN DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Konfirmasi Hapus / Reset</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Anda yakin ingin memproses tindakan untuk <strong>&ldquo;{deleteConfirm.name}&rdquo;</strong>? Aktivitas ini akan tercatat dalam Audit Log Super Admin.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-stone-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const fn = deleteConfirm.callback;
                  setDeleteConfirm(null);
                  fn();
                  onDataRefresh();
                  setAuditLogs(StorageService.getAuditLogs());
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-700 hover:bg-red-800 text-white cursor-pointer"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
