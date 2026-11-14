import React, { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  BookOpen,
  MessageSquare,
  Send,
  CheckCircle2,
  ArrowRight,
  Edit3,
  Download,
  ExternalLink,
  Eye,
} from 'lucide-react';
import {
  Aspirasi,
  ForumTopic,
  Kegiatan,
  PerangkatAjar,
  UserProfile,
} from '../../types';
import { StorageService } from '../../services/storageService';
import { triggerDocumentDownload } from '../../utils/downloadHelper';

interface GuruProps {
  currentUser: UserProfile;
  kegiatanList: Kegiatan[];
  perangkatList: PerangkatAjar[];
  forumTopics: ForumTopic[];
  aspirasiList: Aspirasi[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onNavigatePublic: (page: string) => void;
  onUpdateUser: (user: UserProfile) => void;
  onAddAspirasi?: (item: Aspirasi) => void;
  onPreviewPerangkat?: (doc: PerangkatAjar) => void;
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
}

export const GuruDashboard: React.FC<GuruProps> = ({
  currentUser,
  kegiatanList,
  perangkatList,
  forumTopics,
  aspirasiList,
  activeTab = 'overview',
  onTabChange,
  onNavigatePublic,
  onUpdateUser,
  onAddAspirasi,
  onPreviewPerangkat,
  onShowToast,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editSchool, setEditSchool] = useState(currentUser.school);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editEmail, setEditEmail] = useState(currentUser.email);
  const [checkedInIds, setCheckedInIds] = useState<Record<string, boolean>>({});

  // Quick Aspirasi state
  const [aspTitle, setAspTitle] = useState('');
  const [aspCategory, setAspCategory] = useState<Aspirasi['category']>('Pembelajaran');
  const [aspContent, setAspContent] = useState('');

  useEffect(() => {
    setEditName(currentUser.name);
    setEditSchool(currentUser.school);
    setEditPhone(currentUser.phone);
    setEditEmail(currentUser.email);
  }, [currentUser]);

  const myDocs = perangkatList.filter(
    (d) => d.uploaderName === currentUser.name || d.uploaderSchool === currentUser.school
  );
  const myAspirations = aspirasiList.filter(
    (a) => a.senderName.includes(currentUser.name) || a.school === currentUser.school
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name: editName,
      school: editSchool,
      phone: editPhone,
      email: editEmail,
    };
    onUpdateUser(updated);
    setIsEditingProfile(false);
    onShowToast('Profil Diperbarui', 'Data identitas pendidik telah disimpan.', 'success');
  };

  const handleCheckInKegiatan = (keg: Kegiatan) => {
    if (checkedInIds[keg.id]) return;
    setCheckedInIds((prev) => ({ ...prev, [keg.id]: true }));
    StorageService.addPresensi({
      id: `pres-${Date.now()}`,
      kegiatanId: keg.id,
      kegiatanTitle: keg.title,
      memberName: currentUser.name,
      school: currentUser.school,
      nip: currentUser.nip,
      checkInTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      status: 'Hadir',
    });
    onShowToast('Presensi Tercatat', `Kehadiran Anda pada "${keg.title}" berhasil disimpan.`, 'success');
  };

  const handleSubmitAspirasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aspTitle.trim() || !aspContent.trim()) return;
    const item: Aspirasi = {
      id: `asp-${Date.now()}`,
      title: aspTitle,
      category: aspCategory,
      content: aspContent,
      senderName: currentUser.name,
      isAnonymous: false,
      school: currentUser.school,
      submittedAt: new Date().toISOString().slice(0, 10),
      status: 'Diterima',
    };
    if (onAddAspirasi) {
      onAddAspirasi(item);
    } else {
      StorageService.addAspirasi(item);
    }
    setAspTitle('');
    setAspContent('');
    onShowToast('Aspirasi Terkirim', 'Usulan Anda telah masuk ke kotak saran pengurus KKG.', 'success');
  };

  const renderProfileCard = () => (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-rose-700" />
          <span>Biodata Pendidik</span>
        </h2>
        <button
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditingProfile ? 'Batal' : 'Edit'}</span>
        </button>
      </div>

      {!isEditingProfile ? (
        <div className="space-y-3 text-xs text-slate-600">
          <div className="text-center pb-2">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover mx-auto mb-2 border-2 border-rose-200"
              referrerPolicy="no-referrer"
            />
            <h3 className="font-bold text-slate-900 text-sm">{currentUser.name}</h3>
            <p className="text-rose-800 font-medium">{currentUser.roleTitle}</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl space-y-2">
            <div>
              <span className="text-slate-400 block text-[10px]">NIP / NUPTK:</span>
              <span className="font-mono text-slate-800">{currentUser.nip || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Pangkalan Sekolah:</span>
              <span className="font-medium text-slate-800">{currentUser.school}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Email Aktif:</span>
              <span className="font-mono text-slate-800">{currentUser.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Nomor WhatsApp:</span>
              <span className="font-mono text-slate-800">{currentUser.phone}</span>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Pangkalan Sekolah</label>
            <input
              type="text"
              required
              value={editSchool}
              onChange={(e) => setEditSchool(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Nomor WhatsApp</label>
            <input
              type="text"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2 bg-rose-800 hover:bg-rose-900 text-white rounded-xl font-semibold cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                Ruang Belajar & Kolaborasi Guru
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Selamat Datang, {currentUser.name}
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {currentUser.roleTitle} · {currentUser.school}. Pantau jadwal pertemuan KKG, unduh modul kurikulum merdeka, dan sampaikan aspirasi Anda.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => onTabChange?.('jadwal_saya')}
              className="bg-white border border-stone-200 hover:border-rose-300 rounded-2xl p-4 shadow-sm text-left cursor-pointer"
            >
              <div className="text-xs text-slate-500 mb-1">Pertemuan KKG</div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {kegiatanList.length} Sesi
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">Isi presensi digital →</p>
            </button>

            <button
              type="button"
              onClick={() => onTabChange?.('perangkat_saya')}
              className="bg-white border border-stone-200 hover:border-rose-300 rounded-2xl p-4 shadow-sm text-left cursor-pointer"
            >
              <div className="text-xs text-slate-500 mb-1">Perangkat Ajar Terbagi</div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {myDocs.length} Modul
              </div>
              <p className="text-[11px] text-rose-800 mt-1">Lihat koleksi modul →</p>
            </button>

            <button
              type="button"
              onClick={() => onTabChange?.('forum_saya')}
              className="bg-white border border-stone-200 hover:border-rose-300 rounded-2xl p-4 shadow-sm text-left cursor-pointer"
            >
              <div className="text-xs text-slate-500 mb-1">Diskusi Forum</div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {forumTopics.length} Topik
              </div>
              <p className="text-[11px] text-slate-600 mt-1">Ikuti diskusi guru →</p>
            </button>

            <button
              type="button"
              onClick={() => onTabChange?.('aspirasi_saya')}
              className="bg-white border border-stone-200 hover:border-rose-300 rounded-2xl p-4 shadow-sm text-left cursor-pointer"
            >
              <div className="text-xs text-slate-500 mb-1">Aspirasi Saya</div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {myAspirations.length} Usulan
              </div>
              <p className="text-[11px] text-amber-700 mt-1">Kirim usulan baru →</p>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h2 className="text-base font-bold text-slate-900">Agenda Pertemuan KKG Terdekat</h2>
                  <button
                    onClick={() => (onTabChange ? onTabChange('jadwal_saya') : onNavigatePublic('kegiatan'))}
                    className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lihat Jadwal Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {kegiatanList.slice(0, 2).map((keg) => (
                    <div key={keg.id} className="p-4 bg-stone-50 rounded-xl space-y-2 border border-stone-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-rose-800">{keg.type}</span>
                        <span className="font-mono text-slate-500">{keg.date} ({keg.time})</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{keg.title}</h3>
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                        <span>Tempat: {keg.location}</span>
                        <button
                          onClick={() => handleCheckInKegiatan(keg)}
                          className={`font-semibold cursor-pointer ${
                            checkedInIds[keg.id] ? 'text-emerald-700' : 'text-rose-800 hover:underline'
                          }`}
                        >
                          {checkedInIds[keg.id] ? '✓ Sudah Presensi' : 'Catat Presensi'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h2 className="text-base font-bold text-slate-900">Perangkat Ajar Sekolah Saya</h2>
                  <button
                    onClick={() => onNavigatePublic('perangkat')}
                    className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Buka Bank Perangkat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {myDocs.length > 0 ? (
                    myDocs.map((doc) => (
                      <div key={doc.id} className="p-3 bg-stone-50 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{doc.title}</div>
                          <div className="text-slate-400 font-mono text-[11px]">{doc.category} · {doc.gradeLevel}</div>
                        </div>
                        <span className="font-mono text-[10px] text-stone-600 bg-stone-200/80 px-2 py-0.5 rounded">
                          {doc.downloadCount}x Unduh
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-3 text-center">Belum ada modul dari sekolah Anda.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">{renderProfileCard()}</div>
          </div>
        </div>
      )}

      {activeTab === 'jadwal_saya' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-rose-800" />
                <span>Jadwal & Presensi Saya</span>
              </h1>
              <p className="text-xs text-slate-500">Catat kehadiran Anda secara daring pada kegiatan KKG Gugus 01.</p>
            </div>
            <button
              onClick={() => onNavigatePublic('kegiatan')}
              className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Lihat Halaman Program Publik
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kegiatanList.map((keg) => {
              const isCheckedIn = !!checkedInIds[keg.id];
              return (
                <div key={keg.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">{keg.type}</span>
                      <span className="font-mono text-slate-500">{keg.date}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{keg.title}</h3>
                    <p className="text-xs text-slate-600">{keg.description}</p>
                    <div className="text-xs text-slate-500">Lokasi: <strong>{keg.location}</strong> · {keg.time}</div>
                  </div>
                  <button
                    onClick={() => handleCheckInKegiatan(keg)}
                    disabled={isCheckedIn}
                    className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      isCheckedIn
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                        : 'bg-rose-800 hover:bg-rose-900 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isCheckedIn ? 'Kehadiran Tercatat' : 'Hadir & Catat Presensi'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'perangkat_saya' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-rose-800" />
                <span>Perangkat Ajar & Modul Kurikulum Merdeka</span>
              </h1>
              <p className="text-xs text-slate-500">Akses dan unduh perangkat ajar resmi KKG atau unggah perangkat baru.</p>
            </div>
            <button
              onClick={() => onNavigatePublic('perangkat')}
              className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Unggah di Bank Perangkat
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {perangkatList.map((doc) => (
              <div key={doc.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">{doc.category}</span>
                    <span className="font-mono text-slate-500">{doc.fileFormat} ({doc.fileSize})</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{doc.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{doc.subject} · {doc.gradeLevel}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                  <span className="text-slate-400">Oleh: {doc.uploaderName}</span>
                  <div className="flex items-center gap-1.5">
                    {doc.driveUrl && (
                      <a
                        href={doc.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-medium flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Drive</span>
                      </a>
                    )}
                    {onPreviewPerangkat && (
                      <button
                        onClick={() => onPreviewPerangkat(doc)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-lg font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Detail</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        triggerDocumentDownload(`${doc.title}.${doc.fileFormat.toLowerCase()}.txt`, doc.title, {
                          Kategori: doc.category,
                          'Mata Pelajaran': doc.subject,
                          Fase: doc.gradeLevel,
                          'Link Drive': doc.driveUrl,
                        });
                        onShowToast('Perangkat Diunduh', doc.title, 'success');
                      }}
                      className="px-2.5 py-1 bg-rose-800 hover:bg-rose-900 text-white rounded-lg font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Unduh</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'forum_saya' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-rose-800" />
                <span>Aktivitas Forum Guru</span>
              </h1>
              <p className="text-xs text-slate-500">Topik diskusi terkini bersama guru-guru SD Kecamatan Bluto.</p>
            </div>
            <button
              onClick={() => onNavigatePublic('forum')}
              className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Buka Forum Guru Lengkap
            </button>
          </div>

          <div className="space-y-3">
            {forumTopics.map((topic) => (
              <div key={topic.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-rose-800">{topic.category}</span>
                  <h3 className="font-bold text-slate-900 text-sm">{topic.title}</h3>
                  <p className="text-xs text-slate-500">
                    Oleh {topic.authorName} · {topic.commentCount} tanggapan · {topic.createdAt}
                  </p>
                </div>
                <button
                  onClick={() => onNavigatePublic('forum')}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-rose-50 hover:text-rose-800 text-slate-700 text-xs font-semibold rounded-xl shrink-0 cursor-pointer"
                >
                  Baca & Tanggapi
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'aspirasi_saya' && (
        <div className="space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-6 h-6 text-rose-800" />
              <span>Aspirasi & Usulan Saya</span>
            </h1>
            <p className="text-xs text-slate-500">Kirimkan usulan tema pelatihan atau masukan kegiatan KKG secara langsung.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form onSubmit={handleSubmitAspirasi} className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-3 text-xs sm:text-sm h-fit">
              <h2 className="font-bold text-slate-900 text-base">Kirim Usulan Baru</h2>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Kategori</label>
                <select value={aspCategory} onChange={(e) => setAspCategory(e.target.value as Aspirasi['category'])} className="w-full px-3 py-2 border border-stone-300 rounded-xl">
                  <option value="Pembelajaran">Pembelajaran</option>
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Organisasi">Organisasi</option>
                  <option value="Administrasi">Administrasi</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Judul Usulan *</label>
                <input type="text" required value={aspTitle} onChange={(e) => setAspTitle(e.target.value)} placeholder="Contoh: Pelatihan Pemanfaatan Quizizz" className="w-full px-3 py-2 border border-stone-300 rounded-xl" />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Isi Aspirasi *</label>
                <textarea rows={4} required value={aspContent} onChange={(e) => setAspContent(e.target.value)} placeholder="Sampaikan saran Anda..." className="w-full px-3 py-2 border border-stone-300 rounded-xl" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-rose-800 hover:bg-rose-900 text-white font-semibold rounded-xl cursor-pointer">
                Kirim Aspirasi
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {myAspirations.length > 0 ? (
                myAspirations.map((asp) => (
                  <div key={asp.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-rose-800">{asp.category}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold text-[10px]">
                        {asp.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{asp.title}</h3>
                    <p className="text-xs text-slate-600">{asp.content}</p>
                    {asp.responseNotes && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                        <strong>Tanggapan Pengurus:</strong> {asp.responseNotes}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center text-xs text-slate-400">
                  Belum ada aspirasi yang Anda kirimkan.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profil_saya' && (
        <div className="max-w-xl">
          {renderProfileCard()}
        </div>
      )}
    </div>
  );
};
