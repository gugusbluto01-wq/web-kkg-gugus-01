import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import {
  Anggota,
  Aspirasi,
  BeritaPengumuman,
  DokumenAdministrasi,
  ForumTopic,
  GaleriItem,
  Kegiatan,
  PerangkatAjar,
  TransaksiKeuangan,
  UserProfile,
  UserRole,
} from './types';

// Layout
import { Navbar } from './components/layout/Navbar';
import { GlobalSearchBar } from './components/layout/GlobalSearchBar';
import { Footer } from './components/layout/Footer';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ToastContainer, ToastMessage } from './components/common/NotificationToast';
import { triggerDocumentDownload } from './utils/downloadHelper';

// Public Pages
import { Home } from './pages/public/Home';
import { ProfilKKG } from './pages/public/ProfilKKG';
import { DataAnggota } from './pages/public/DataAnggota';
import { ForumGuru } from './pages/public/ForumGuru';
import { BankPerangkatAjar } from './pages/public/BankPerangkatAjar';
import { ProgramKegiatan } from './pages/public/ProgramKegiatan';
import { BeritaPengumumanPage } from './pages/public/BeritaPengumuman';
import { AdministrasiKKG } from './pages/public/AdministrasiKKG';
import { LaporanKeuanganPage } from './pages/public/LaporanKeuangan';
import { AspirasiSaran } from './pages/public/AspirasiSaran';
import { GaleriKegiatan } from './pages/public/GaleriKegiatan';
import { Kontak } from './pages/public/Kontak';

// Auth
import { LoginPage } from './pages/auth/LoginPage';

// Dashboards
import { SuperAdminDashboard } from './pages/dashboard/SuperAdminDashboard';
import { PengurusDashboard } from './pages/dashboard/PengurusDashboard';
import { BendaharaDashboard } from './pages/dashboard/BendaharaDashboard';
import { GuruDashboard } from './pages/dashboard/GuruDashboard';

// Lucide
import { FileText, Download, X, ExternalLink, Copy, Check } from 'lucide-react';

export default function App() {
  // Navigation & Session State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [dashboardTab, setDashboardTab] = useState<string>('overview');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('super_admin');
  const [currentUser, setCurrentUser] = useState<UserProfile>(StorageService.getCurrentUser());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Data State synced via StorageService
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [perangkatList, setPerangkatList] = useState<PerangkatAjar[]>([]);
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>([]);
  const [beritaList, setBeritaList] = useState<BeritaPengumuman[]>([]);
  const [administrasiList, setAdministrasiList] = useState<DokumenAdministrasi[]>([]);
  const [transaksiList, setTransaksiList] = useState<TransaksiKeuangan[]>([]);
  const [aspirasiList, setAspirasiList] = useState<Aspirasi[]>([]);
  const [galeriList, setGaleriList] = useState<GaleriItem[]>([]);

  // Modals & Deep Links
  const [selectedArticle, setSelectedArticle] = useState<BeritaPengumuman | null>(null);
  const [selectedForumTopic, setSelectedForumTopic] = useState<ForumTopic | null>(null);
  const [previewDoc, setPreviewDoc] = useState<PerangkatAjar | null>(null);
  const [copiedDocLink, setCopiedDocLink] = useState<boolean>(false);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, subtitle?: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `t-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, subtitle, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshAllData = () => {
    setAnggotaList(StorageService.getAnggota());
    setKegiatanList(StorageService.getKegiatan());
    setPerangkatList(StorageService.getPerangkat());
    setForumTopics(StorageService.getForumTopics());
    setBeritaList(StorageService.getBerita());
    setAdministrasiList(StorageService.getAdministrasi());
    setTransaksiList(StorageService.getTransaksi());
    setAspirasiList(StorageService.getAspirasi());
    setGaleriList(StorageService.getGaleri());
    setCurrentUser(StorageService.getCurrentUser());
  };

  // Load state on mount
  useEffect(() => {
    const role = StorageService.getCurrentRole();
    setCurrentRole(role);
    setCurrentUser(StorageService.getCurrentUser());
    refreshAllData();

    const params = new URLSearchParams(window.location.search);
    const sharedPerangkatId = params.get('perangkat');
    if (sharedPerangkatId) {
      const matched = StorageService.getPerangkat().find((d) => d.id === sharedPerangkatId);
      if (matched) {
        setCurrentPage('perangkat');
        setPreviewDoc(matched);
      }
    }
  }, []);

  useEffect(() => {
    setCopiedDocLink(false);
  }, [previewDoc]);

  const handleCopyDocLink = async (doc: PerangkatAjar) => {
    const linkToCopy =
      doc.driveUrl ||
      `${window.location.origin}${window.location.pathname}?perangkat=${encodeURIComponent(doc.id)}`;

    let copied = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(linkToCopy);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      const textarea = document.createElement('textarea');
      textarea.value = linkToCopy;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        copied = document.execCommand('copy');
      } catch {
        copied = false;
      }
      document.body.removeChild(textarea);
    }

    if (copied) {
      setCopiedDocLink(true);
      showToast(
        'Tautan Disalin',
        doc.driveUrl
          ? `Tautan Google Drive "${doc.title}" siap dibagikan ke guru lain.`
          : `Tautan perangkat ajar "${doc.title}" siap dibagikan ke guru lain.`,
        'success'
      );
      setTimeout(() => setCopiedDocLink(false), 2500);
    } else {
      showToast('Gagal Menyalin', 'Silakan salin tautan secara manual dari peramban.', 'error');
    }
  };

  // Handle Role Switching
  const handleRoleChange = (newRole: UserRole) => {
    StorageService.setCurrentRole(newRole);
    setCurrentRole(newRole);
    const user = StorageService.getCurrentUser();
    setCurrentUser(user);
    setDashboardTab('overview');
    showToast('Peran Diperbarui', `Beralih ke simulasi hak akses ${newRole.replace('_', ' ')}.`, 'info');
  };

  // Handle Login
  const handleLoginSuccess = (role: UserRole) => {
    handleRoleChange(role);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    setCurrentPage('dashboard');
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast('Telah Keluar', 'Anda dapat login kembali dengan peran lain kapan saja.', 'info');
    setCurrentPage('home');
  };

  // Mutators
  const handleAddAnggota = (item: Anggota) => {
    StorageService.addAnggota(item);
    refreshAllData();
  };

  const handleDeleteAnggota = (id: string) => {
    StorageService.deleteAnggota(id);
    refreshAllData();
  };

  const handleAddPerangkat = (doc: PerangkatAjar) => {
    StorageService.addPerangkat(doc);
    refreshAllData();
  };

  const handleAddForumTopic = (topic: ForumTopic) => {
    StorageService.addForumTopic(topic);
    refreshAllData();
  };

  const handleAddForumComment = (topicId: string, commentText: string) => {
    StorageService.addComment(topicId, commentText, currentUser);
    refreshAllData();
  };

  const handleAddKegiatan = (kegiatan: Kegiatan) => {
    StorageService.addKegiatan(kegiatan);
    refreshAllData();
  };

  const handleAddBerita = (item: BeritaPengumuman) => {
    StorageService.addBerita(item);
    refreshAllData();
  };

  const handleAddAdministrasi = (doc: DokumenAdministrasi) => {
    StorageService.addAdministrasi(doc);
    refreshAllData();
  };

  const handleAddTransaksi = (trx: TransaksiKeuangan) => {
    StorageService.addTransaksi(trx);
    refreshAllData();
  };

  const handleAddAspirasi = (item: Aspirasi) => {
    StorageService.addAspirasi(item);
    refreshAllData();
  };

  const handleUpdateAspirasiStatus = (id: string, status: Aspirasi['status'], notes?: string) => {
    StorageService.updateAspirasiStatus(id, status, notes);
    refreshAllData();
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    StorageService.setCurrentUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  // Render Dashboard Views
  const renderDashboardContent = () => {
    switch (currentRole) {
      case 'super_admin':
        return (
          <SuperAdminDashboard
            currentUser={currentUser}
            anggotaList={anggotaList}
            kegiatanList={kegiatanList}
            perangkatList={perangkatList}
            transaksiList={transaksiList}
            beritaList={beritaList}
            administrasiList={administrasiList}
            aspirasiList={aspirasiList}
            forumTopics={forumTopics}
            galeriList={galeriList}
            activeTab={dashboardTab}
            onNavigatePublic={setCurrentPage}
            onShowToast={showToast}
            onDataRefresh={refreshAllData}
          />
        );
      case 'pengurus':
        return (
          <PengurusDashboard
            currentUser={currentUser}
            kegiatanList={kegiatanList}
            perangkatList={perangkatList}
            beritaList={beritaList}
            administrasiList={administrasiList}
            aspirasiList={aspirasiList}
            activeTab={dashboardTab}
            onTabChange={setDashboardTab}
            onNavigatePublic={setCurrentPage}
            onShowToast={showToast}
            onDataRefresh={refreshAllData}
          />
        );
      case 'bendahara':
        return (
          <BendaharaDashboard
            currentUser={currentUser}
            transaksiList={transaksiList}
            activeTab={dashboardTab}
            onTabChange={setDashboardTab}
            onAddTransaksi={handleAddTransaksi}
            onNavigatePublic={setCurrentPage}
            onShowToast={showToast}
          />
        );
      case 'guru':
      default:
        return (
          <GuruDashboard
            currentUser={currentUser}
            kegiatanList={kegiatanList}
            perangkatList={perangkatList}
            forumTopics={forumTopics}
            aspirasiList={aspirasiList}
            activeTab={dashboardTab}
            onTabChange={setDashboardTab}
            onNavigatePublic={setCurrentPage}
            onUpdateUser={handleUpdateUser}
            onAddAspirasi={handleAddAspirasi}
            onPreviewPerangkat={setPreviewDoc}
            onShowToast={showToast}
          />
        );
    }
  };

  // Render Public Pages
  const renderPublicPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            onNavigate={setCurrentPage}
            kegiatanList={kegiatanList}
            perangkatList={perangkatList}
            beritaList={beritaList}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onPreviewPerangkat={setPreviewDoc}
            onOpenBerita={(item) => {
              setSelectedArticle(item);
              setCurrentPage('berita');
            }}
          />
        );
      case 'profil':
        return <ProfilKKG />;
      case 'anggota':
        return (
          <DataAnggota
            anggotaList={anggotaList}
            currentRole={currentRole}
            onAddAnggota={handleAddAnggota}
            onDeleteAnggota={handleDeleteAnggota}
            onShowToast={showToast}
          />
        );
      case 'forum':
        return (
          <ForumGuru
            topics={forumTopics}
            currentUser={currentUser}
            onAddTopic={handleAddForumTopic}
            onAddComment={handleAddForumComment}
            onShowToast={showToast}
            selectedTopic={selectedForumTopic}
            onSelectTopic={setSelectedForumTopic}
          />
        );
      case 'perangkat':
        return (
          <BankPerangkatAjar
            perangkatList={perangkatList}
            currentUser={currentUser}
            onAddPerangkat={handleAddPerangkat}
            onShowToast={showToast}
            onPreviewPerangkat={setPreviewDoc}
          />
        );
      case 'kegiatan':
        return (
          <ProgramKegiatan
            kegiatanList={kegiatanList}
            currentUser={currentUser}
            currentRole={currentRole}
            onAddKegiatan={handleAddKegiatan}
            onShowToast={showToast}
          />
        );
      case 'berita':
        return (
          <BeritaPengumumanPage
            beritaList={beritaList}
            currentUser={currentUser}
            currentRole={currentRole}
            onAddBerita={handleAddBerita}
            onShowToast={showToast}
            selectedArticle={selectedArticle}
            onSelectArticle={setSelectedArticle}
          />
        );
      case 'administrasi':
        return (
          <AdministrasiKKG
            dokumenList={administrasiList}
            currentUser={currentUser}
            currentRole={currentRole}
            onAddDokumen={handleAddAdministrasi}
            onShowToast={showToast}
          />
        );
      case 'keuangan':
        return (
          <LaporanKeuanganPage
            transaksiList={transaksiList}
            currentUser={currentUser}
            currentRole={currentRole}
            onAddTransaksi={handleAddTransaksi}
            onShowToast={showToast}
          />
        );
      case 'aspirasi':
        return (
          <AspirasiSaran
            aspirasiList={aspirasiList}
            currentUser={currentUser}
            currentRole={currentRole}
            onAddAspirasi={handleAddAspirasi}
            onUpdateStatus={handleUpdateAspirasiStatus}
            onShowToast={showToast}
          />
        );
      case 'galeri':
        return <GaleriKegiatan galeriList={galeriList} onShowToast={showToast} />;
      case 'kontak':
        return <Kontak onShowToast={showToast} />;
      case 'login':
        return (
          <LoginPage
            onSuccessLogin={handleLoginSuccess}
            onShowToast={showToast}
          />
        );
      default:
        return (
          <Home
            onNavigate={setCurrentPage}
            kegiatanList={kegiatanList}
            perangkatList={perangkatList}
            beritaList={beritaList}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onPreviewPerangkat={setPreviewDoc}
            onOpenBerita={(item) => {
              setSelectedArticle(item);
              setCurrentPage('berita');
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50 text-slate-800">
      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Main Flow: If inside Dashboard view */}
      {currentPage === 'dashboard' ? (
        <DashboardLayout
          currentRole={currentRole}
          currentUser={currentUser}
          onRoleChange={handleRoleChange}
          onNavigatePublic={setCurrentPage}
          onLogout={handleLogout}
          activeTab={dashboardTab}
          onTabChange={setDashboardTab}
        >
          {renderDashboardContent()}
        </DashboardLayout>
      ) : (
        /* Public Portal Flow */
        <>
          <Navbar
            currentPage={currentPage}
            onNavigate={(page) => {
              if (page !== 'forum') setSelectedForumTopic(null);
              if (page !== 'berita') setSelectedArticle(null);
              setCurrentPage(page);
            }}
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
            isLoggedIn={isLoggedIn}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onLogout={handleLogout}
          />

          <GlobalSearchBar
            perangkatList={perangkatList}
            beritaList={beritaList}
            forumTopics={forumTopics}
            onSelectPerangkat={(doc) => {
              setCurrentPage('perangkat');
              setPreviewDoc(doc);
            }}
            onSelectBerita={(item) => {
              setSelectedArticle(item);
              setCurrentPage('berita');
            }}
            onSelectForumTopic={(topic) => {
              setSelectedForumTopic(topic);
              setCurrentPage('forum');
            }}
            onNavigate={(page) => {
              if (page !== 'forum') setSelectedForumTopic(null);
              if (page !== 'berita') setSelectedArticle(null);
              setCurrentPage(page);
            }}
          />

          <main className="flex-1">{renderPublicPage()}</main>

          <Footer
            onNavigate={(page) => {
              if (page !== 'forum') setSelectedForumTopic(null);
              if (page !== 'berita') setSelectedArticle(null);
              setCurrentPage(page);
            }}
          />
        </>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <LoginPage
            onSuccessLogin={handleLoginSuccess}
            onClose={() => setIsLoginModalOpen(false)}
            onShowToast={showToast}
          />
        </div>
      )}

      {/* Perangkat Ajar Preview & Download Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 space-y-4">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                  {previewDoc.category}
                </span>
                <h3 className="font-bold text-slate-900 text-base leading-snug mt-1">
                  {previewDoc.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {previewDoc.subject} · {previewDoc.gradeLevel}
                </p>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Pengunggah:</span>
                <strong className="text-slate-900">{previewDoc.uploaderName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Sekolah Asal:</span>
                <span className="text-slate-800">{previewDoc.uploaderSchool}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal Unggah:</span>
                <span className="text-slate-700">{previewDoc.uploadedAt}</span>
              </div>
              <div className="flex justify-between">
                <span>Format & Ukuran:</span>
                <span className="font-mono text-slate-800 font-medium">{previewDoc.fileFormat} ({previewDoc.fileSize})</span>
              </div>
              {previewDoc.driveUrl && (
                <div className="flex justify-between items-center pt-1 border-t border-stone-100">
                  <span className="text-slate-600 font-medium">Tautan Google Drive:</span>
                  <a
                    href={previewDoc.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 text-xs truncate max-w-[200px]"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">Buka Tautan Drive</span>
                  </a>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-stone-50/50 p-3 rounded-xl border border-stone-100">
              {previewDoc.description}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono">
                {previewDoc.downloadCount} kali diunduh
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyDocLink(previewDoc)}
                  className={`px-3.5 py-2 border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
                    copiedDocLink
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white hover:bg-stone-50 border-stone-300 text-slate-700'
                  }`}
                >
                  {copiedDocLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-rose-700" />
                      <span>Salin Tautan</span>
                    </>
                  )}
                </button>
                {previewDoc.driveUrl && (
                  <a
                    href={previewDoc.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Buka di Google Drive</span>
                  </a>
                )}
                <button
                  onClick={() => {
                    StorageService.updatePerangkat({
                      ...previewDoc,
                      downloadCount: (previewDoc.downloadCount || 0) + 1,
                    });
                    refreshAllData();
                    triggerDocumentDownload(
                      `${previewDoc.title}.${previewDoc.fileFormat.toLowerCase()}.txt`,
                      previewDoc.title,
                      {
                        Kategori: previewDoc.category,
                        'Mata Pelajaran': previewDoc.subject,
                        'Fase / Kelas': previewDoc.gradeLevel,
                        Pengunggah: `${previewDoc.uploaderName} (${previewDoc.uploaderSchool})`,
                        'Format & Ukuran': `${previewDoc.fileFormat} (${previewDoc.fileSize})`,
                        'Link Drive': previewDoc.driveUrl,
                        Deskripsi: previewDoc.description,
                      }
                    );
                    showToast('Mengunduh Perangkat Ajar', `${previewDoc.title} (${previewDoc.fileFormat}) berhasil diunduh.`, 'success');
                    setPreviewDoc(null);
                  }}
                  className="px-5 py-2.5 bg-rose-800 hover:bg-rose-900 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
