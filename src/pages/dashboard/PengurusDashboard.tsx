import React, { useState } from 'react';
import {
  Calendar,
  BookOpen,
  Newspaper,
  FolderLock,
  Send,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  Download,
  ExternalLink,
  X,
  Star,
  MessageSquare,
} from 'lucide-react';
import {
  Aspirasi,
  BeritaPengumuman,
  DokumenAdministrasi,
  Kegiatan,
  PerangkatAjar,
  UserProfile,
} from '../../types';
import { StorageService } from '../../services/storageService';
import { triggerDocumentDownload } from '../../utils/downloadHelper';

interface PengurusProps {
  currentUser: UserProfile;
  kegiatanList: Kegiatan[];
  perangkatList: PerangkatAjar[];
  beritaList: BeritaPengumuman[];
  administrasiList: DokumenAdministrasi[];
  aspirasiList: Aspirasi[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onNavigatePublic: (page: string) => void;
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
  onDataRefresh?: () => void;
}

export const PengurusDashboard: React.FC<PengurusProps> = ({
  currentUser,
  kegiatanList,
  perangkatList,
  beritaList,
  administrasiList,
  aspirasiList,
  activeTab = 'overview',
  onTabChange,
  onNavigatePublic,
  onShowToast,
  onDataRefresh,
}) => {
  const [isKegiatanModalOpen, setIsKegiatanModalOpen] = useState(false);
  const [isBeritaModalOpen, setIsBeritaModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [responseTarget, setResponseTarget] = useState<Aspirasi | null>(null);
  const [responseNoteInput, setResponseNoteInput] = useState('');

  // Kegiatan form
  const [kegTitle, setKegTitle] = useState('');
  const [kegType, setKegType] = useState<Kegiatan['type']>('KKG Rutin');
  const [kegDate, setKegDate] = useState(new Date().toISOString().slice(0, 10));
  const [kegTime, setKegTime] = useState('08.30 - 12.00 WIB');
  const [kegLocation, setKegLocation] = useState('SDN Bluto I');
  const [kegDesc, setKegDesc] = useState('');

  // Berita form
  const [berTitle, setBerTitle] = useState('');
  const [berType, setBerType] = useState<'Berita' | 'Pengumuman'>('Pengumuman');
  const [berCategory, setBerCategory] = useState<BeritaPengumuman['category']>('Organisasi');
  const [berContent, setBerContent] = useState('');

  // Administrasi form
  const [admNumber, setAdmNumber] = useState('');
  const [admTitle, setAdmTitle] = useState('');
  const [admCategory, setAdmCategory] = useState<DokumenAdministrasi['category']>('Surat Keluar');
  const [admRecipient, setAdmRecipient] = useState('Kepala SDN Se-Gugus 01 Bluto');

  const pendingAspirasi = aspirasiList.filter((a) => a.status === 'Diterima');
  const upcomingKegiatan = kegiatanList.filter((k) => k.status === 'Akan Datang');

  const handleAddKegiatanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kegTitle.trim()) return;
    const item: Kegiatan = {
      id: `keg-${Date.now()}`,
      title: kegTitle,
      type: kegType,
      date: kegDate,
      time: kegTime,
      location: kegLocation,
      locationDetail: `Aula ${kegLocation}, Kecamatan Bluto`,
      personInCharge: currentUser.name,
      status: 'Akan Datang',
      quota: 50,
      enrolledCount: 1,
      description: kegDesc || 'Agenda koordinasi dan peningkatan kompetensi guru Gugus 01 Bluto.',
    };
    StorageService.addKegiatan(item);
    onDataRefresh?.();
    setIsKegiatanModalOpen(false);
    setKegTitle('');
    setKegDesc('');
    onShowToast('Agenda Dijadwalkan', `${item.title} berhasil ditambahkan.`, 'success');
  };

  const handleAddBeritaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!berTitle.trim() || !berContent.trim()) return;
    const item: BeritaPengumuman = {
      id: `ber-${Date.now()}`,
      title: berTitle,
      type: berType,
      category: berCategory,
      publishedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      author: currentUser.name,
      summary: berContent.slice(0, 140) + (berContent.length > 140 ? '...' : ''),
      content: berContent,
      coverImage: '/src/assets/images/berita_workshop_2026_1794452010539.jpg',
      isImportant: berType === 'Pengumuman',
    };
    StorageService.addBerita(item);
    onDataRefresh?.();
    setIsBeritaModalOpen(false);
    setBerTitle('');
    setBerContent('');
    onShowToast('Informasi Diterbitkan', `${item.title} telah dipublikasikan ke portal.`, 'success');
  };

  const handleAddAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admTitle.trim()) return;
    const doc: DokumenAdministrasi = {
      id: `adm-${Date.now()}`,
      letterNumber: admNumber || `00${administrasiList.length + 1}/KKG-G01/BLT/${new Date().getFullYear()}`,
      title: admTitle,
      category: admCategory,
      date: new Date().toISOString().slice(0, 10),
      senderOrRecipient: admRecipient,
      fileFormat: 'PDF',
      fileSize: '420 KB',
      status: 'Resmi',
      signedBy: currentUser.name,
    };
    StorageService.addAdministrasi(doc);
    onDataRefresh?.();
    setIsAdminModalOpen(false);
    setAdmNumber('');
    setAdmTitle('');
    onShowToast('Surat Diarsipkan', `${doc.letterNumber} berhasil tersimpan.`, 'success');
  };

  const handleSaveAspirasiResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseTarget) return;
    StorageService.updateAspirasiStatus(
      responseTarget.id,
      'Ditindaklanjuti',
      responseNoteInput || 'Telah dibahas dan ditindaklanjuti dalam rapat pengurus KKG Gugus 01.'
    );
    onDataRefresh?.();
    setResponseTarget(null);
    setResponseNoteInput('');
    onShowToast('Tanggapan Disimpan', 'Status aspirasi diperbarui menjadi Ditindaklanjuti.', 'success');
  };

  return (
    <div className="space-y-6">
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Banner */}
          <div className="bg-gradient-to-r from-rose-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                Sekretariat & Manajemen KKG
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Dashboard Pengurus KKG Gugus 01
              </h1>
              <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
                Selamat bekerja, {currentUser.name}. Fokuskan agenda kerja pekan ini pada persiapan pertemuan rutin KKG dan verifikasi modul ajar guru se-Kecamatan Bluto.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => onTabChange?.('kegiatan_mgmt')}
              className="bg-white border border-stone-200 hover:border-rose-300 rounded-2xl p-4 shadow-sm text-left transition-colors cursor-pointer"
            >
              <div className="text-xs text-slate-500 mb-1">Agenda Akan Datang</div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {upcomingKegiatan.length} Acara
              </div>
              <p className="text-[11px] text-rose-800 mt-1">Kelola jadwal kegiatan →</p>
            </button>

            <button
              type="button"
              onClick={() => onTabChange?.('perangkat_mgmt')}
              className="bg-white border border-stone-200 hover:border-rose-300 rounded-2xl p-4 shadow-sm text-left transition-colors cursor-pointer"
            >
              <div className="text-xs text-slate-500 mb-1">Koleksi Perangkat Ajar</div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {perangkatList.length} Modul
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">Verifikasi modul ajar →</p>
            </button>

            <button
              type="button"
              onClick={() => onTabChange?.('administrasi_mgmt')}
              className="bg-white border border-stone-200 hover:border-rose-300 rounded-2xl p-4 shadow-sm text-left transition-colors cursor-pointer"
            >
              <div className="text-xs text-slate-500 mb-1">Arsip Surat & Notulen</div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {administrasiList.length} Berkas
              </div>
              <p className="text-[11px] text-slate-600 mt-1">Buka tata persuratan →</p>
            </button>

            <button
              type="button"
              onClick={() => onTabChange?.('aspirasi_mgmt')}
              className="bg-white border border-stone-200 hover:border-rose-300 rounded-2xl p-4 shadow-sm text-left transition-colors cursor-pointer"
            >
              <div className="text-xs text-slate-500 mb-1">Aspirasi Belum Ditinjau</div>
              <div className="text-2xl font-extrabold text-amber-800 font-mono">
                {pendingAspirasi.length} Masukan
              </div>
              <p className="text-[11px] text-amber-700 mt-1">Tindak lanjuti aspirasi →</p>
            </button>
          </div>

          {/* Main Grid: Agenda KKG & Aspirasi Guru */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Agenda Kegiatan Terdekat</h2>
                  <p className="text-xs text-slate-500">Jadwal pertemuan dan kesiapan sekolah tuan rumah</p>
                </div>
                <button
                  onClick={() => (onTabChange ? onTabChange('kegiatan_mgmt') : onNavigatePublic('kegiatan'))}
                  className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>Kelola Agenda</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {kegiatanList.slice(0, 3).map((keg) => (
                  <div key={keg.id} className="p-4 bg-stone-50 rounded-xl space-y-2 border border-stone-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-rose-800">{keg.type}</span>
                      <span className="font-mono text-[11px] text-slate-500">{keg.date}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{keg.title}</h3>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>Lokasi: {keg.location}</span>
                      <span>Peserta: {keg.enrolledCount} / {keg.quota}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Kotak Aspirasi Guru</h2>
                  <p className="text-xs text-slate-500">Usulan anggota yang menunggu pembahasan</p>
                </div>
                <button
                  onClick={() => (onTabChange ? onTabChange('aspirasi_mgmt') : onNavigatePublic('aspirasi'))}
                  className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Semua</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {aspirasiList.slice(0, 3).map((asp) => (
                  <div key={asp.id} className="p-3 bg-stone-50 rounded-xl space-y-1 border border-stone-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 truncate max-w-[200px]">{asp.title}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                        {asp.status}
                      </span>
                    </div>
                    <p className="text-slate-500 line-clamp-2">{asp.content}</p>
                    <div className="text-[10px] text-slate-400 pt-1">
                      Oleh: {asp.senderName} ({asp.school})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'kegiatan_mgmt' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-rose-800" />
                <span>Agenda & Presensi Kegiatan KKG</span>
              </h1>
              <p className="text-xs text-slate-500">Jadwalkan pertemuan rutin, workshop, dan pantau kesiapan tuan rumah.</p>
            </div>
            <button
              onClick={() => setIsKegiatanModalOpen(true)}
              className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Jadwalkan Kegiatan Baru</span>
            </button>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Agenda Kegiatan</th>
                    <th className="py-3 px-4">Jenis</th>
                    <th className="py-3 px-4">Tanggal & Jam</th>
                    <th className="py-3 px-4">Tuan Rumah</th>
                    <th className="py-3 px-4 text-center">Peserta</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {kegiatanList.map((keg) => (
                    <tr key={keg.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{keg.title}</div>
                        <div className="text-[11px] text-slate-500">PJ: {keg.personInCharge}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded font-medium text-[10px]">
                          {keg.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div>{keg.date}</div>
                        <div className="text-[10px] text-slate-400">{keg.time}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{keg.location}</td>
                      <td className="py-3 px-4 text-center font-mono">{keg.enrolledCount}/{keg.quota}</td>
                      <td className="py-3 px-4 text-center">
                        <select
                          value={keg.status}
                          onChange={(e) => {
                            StorageService.updateKegiatan({ ...keg, status: e.target.value as Kegiatan['status'] });
                            onDataRefresh?.();
                            onShowToast('Status Agenda Diperbarui', `${keg.title}: ${e.target.value}`, 'info');
                          }}
                          className="px-2 py-1 border border-stone-200 rounded-lg text-[11px] font-medium bg-white cursor-pointer"
                        >
                          <option value="Akan Datang">Akan Datang</option>
                          <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                          <option value="Selesai">Selesai</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'perangkat_mgmt' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-rose-800" />
                <span>Verifikasi Modul & Perangkat Ajar</span>
              </h1>
              <p className="text-xs text-slate-500">Tinjau kelayakan perangkat ajar kiriman guru sebelum ditampilkan terverifikasi di portal.</p>
            </div>
            <button
              onClick={() => onNavigatePublic('perangkat')}
              className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-rose-700" />
              <span>Buka Bank Perangkat Publik</span>
            </button>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Judul Modul / Perangkat</th>
                    <th className="py-3 px-4">Mapel & Fase</th>
                    <th className="py-3 px-4">Pengunggah</th>
                    <th className="py-3 px-4 text-center">Status Verifikasi</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {perangkatList.map((doc) => (
                    <tr key={doc.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{doc.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{doc.category} · {doc.fileFormat} ({doc.fileSize})</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{doc.subject}</div>
                        <div className="text-[10px] text-slate-500">{doc.gradeLevel}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800">{doc.uploaderName}</div>
                        <div className="text-[10px] text-slate-400">{doc.uploaderSchool}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            StorageService.updatePerangkat({ ...doc, isVerified: !doc.isVerified });
                            onDataRefresh?.();
                            onShowToast(
                              doc.isVerified ? 'Verifikasi Dibatalkan' : 'Modul Terverifikasi',
                              doc.title,
                              'info'
                            );
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer ${
                            doc.isVerified
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {doc.isVerified ? '✓ Terverifikasi' : 'Menunggu Kurasi'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {doc.driveUrl && (
                            <a
                              href={doc.driveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                              title="Buka Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => {
                              triggerDocumentDownload(`${doc.title}.${doc.fileFormat.toLowerCase()}.txt`, doc.title, {
                                Kategori: doc.category,
                                'Mata Pelajaran': doc.subject,
                                Fase: doc.gradeLevel,
                                Pengunggah: doc.uploaderName,
                                'Link Drive': doc.driveUrl,
                              });
                              onShowToast('Berkas Diunduh', doc.title, 'success');
                            }}
                            className="p-1.5 text-slate-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Unduh Ringkasan"
                          >
                            <Download className="w-3.5 h-3.5" />
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
      )}

      {activeTab === 'berita_mgmt' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Newspaper className="w-6 h-6 text-rose-800" />
                <span>Kabar & Surat Edaran KKG</span>
              </h1>
              <p className="text-xs text-slate-500">Publikasikan informasi penting dan pengumuman resmi untuk seluruh sekolah anggota.</p>
            </div>
            <button
              onClick={() => setIsBeritaModalOpen(true)}
              className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Terbitkan Pengumuman Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beritaList.map((item) => (
              <div key={item.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                      {item.type} · {item.category}
                    </span>
                    <button
                      onClick={() => {
                        StorageService.updateBerita({ ...item, isImportant: !item.isImportant });
                        onDataRefresh?.();
                        onShowToast('Status Sorotan Diperbarui', item.title, 'info');
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer ${
                        item.isImportant ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-slate-500'
                      }`}
                    >
                      <Star className="w-3 h-3" />
                      <span>{item.isImportant ? 'Penting' : 'Biasa'}</span>
                    </button>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{item.summary}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-stone-100">
                  <span>{item.publishedAt}</span>
                  <span>Oleh: {item.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'administrasi_mgmt' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <FolderLock className="w-6 h-6 text-rose-800" />
                <span>Tata Persuratan, SK & Notulen</span>
              </h1>
              <p className="text-xs text-slate-500">Catat surat masuk/keluar, notulen rapat pengurus, dan arsip keputusan gugus.</p>
            </div>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Arsipkan Surat Baru</span>
            </button>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Nomor & Tanggal</th>
                    <th className="py-3 px-4">Perihal Dokumen</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Instansi Terkait</th>
                    <th className="py-3 px-4 text-center">Unduh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {administrasiList.map((adm) => (
                    <tr key={adm.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-rose-900">{adm.letterNumber}</div>
                        <div className="text-[10px] text-slate-400">{adm.date}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{adm.title}</td>
                      <td className="py-3 px-4">
                        <span className="bg-stone-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                          {adm.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{adm.senderOrRecipient}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            triggerDocumentDownload(`${adm.letterNumber}_${adm.title}.txt`, adm.title, {
                              'Nomor Surat': adm.letterNumber,
                              Kategori: adm.category,
                              Tanggal: adm.date,
                              'Pengirim / Penerima': adm.senderOrRecipient,
                            });
                            onShowToast('Berkas Diunduh', adm.letterNumber, 'success');
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-rose-800 hover:bg-rose-50 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'aspirasi_mgmt' && (
        <div className="space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-6 h-6 text-rose-800" />
              <span>Kotak Masukan & Aspirasi Guru</span>
            </h1>
            <p className="text-xs text-slate-500">Perbarui status tindak lanjut dan berikan catatan tanggapan resmi pengurus KKG.</p>
          </div>

          <div className="space-y-4">
            {aspirasiList.map((asp) => (
              <div key={asp.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">{asp.category}</span>
                      <span className="text-slate-400 font-mono">{asp.submittedAt}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mt-1">{asp.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={asp.status}
                      onChange={(e) => {
                        StorageService.updateAspirasiStatus(asp.id, e.target.value as Aspirasi['status']);
                        onDataRefresh?.();
                        onShowToast('Status Aspirasi Diperbarui', `${asp.title}: ${e.target.value}`, 'info');
                      }}
                      className="px-2.5 py-1.5 border border-stone-200 rounded-xl text-xs font-semibold bg-stone-50 cursor-pointer"
                    >
                      <option value="Diterima">Diterima</option>
                      <option value="Ditinjau Pengurus">Ditinjau Pengurus</option>
                      <option value="Ditindaklanjuti">Ditindaklanjuti</option>
                    </select>
                    <button
                      onClick={() => {
                        setResponseTarget(asp);
                        setResponseNoteInput(asp.responseNotes || '');
                      }}
                      className="px-3 py-1.5 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Beri Tanggapan</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{asp.content}</p>

                {asp.responseNotes && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                    <strong className="inline-flex items-center gap-1 mr-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      Tanggapan Pengurus:
                    </strong>
                    {asp.responseNotes}
                  </div>
                )}

                <div className="text-[11px] text-slate-400">
                  Pengirim: <strong className="text-slate-700">{asp.senderName}</strong> · {asp.school}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Tambah Kegiatan */}
      {isKegiatanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative">
            <button onClick={() => setIsKegiatanModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-slate-900 text-lg mb-4">Jadwalkan Agenda KKG Baru</h3>
            <form onSubmit={handleAddKegiatanSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Kegiatan *</label>
                <input type="text" required value={kegTitle} onChange={(e) => setKegTitle(e.target.value)} placeholder="Workshop Kurikulum Merdeka..." className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Jenis</label>
                  <select value={kegType} onChange={(e) => setKegType(e.target.value as Kegiatan['type'])} className="w-full px-3 py-2 border border-stone-300 rounded-xl">
                    <option value="KKG Rutin">KKG Rutin</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Pelatihan">Pelatihan</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tanggal</label>
                  <input type="date" value={kegDate} onChange={(e) => setKegDate(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Waktu</label>
                  <input type="text" value={kegTime} onChange={(e) => setKegTime(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-xl" />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Lokasi / SD Tuan Rumah</label>
                  <input type="text" value={kegLocation} onChange={(e) => setKegLocation(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Deskripsi</label>
                <textarea rows={3} value={kegDesc} onChange={(e) => setKegDesc(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-xl" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button type="button" onClick={() => setIsKegiatanModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 cursor-pointer">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold cursor-pointer">Simpan Agenda</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Terbitkan Berita */}
      {isBeritaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative">
            <button onClick={() => setIsBeritaModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-slate-900 text-lg mb-4">Terbitkan Berita / Pengumuman</h3>
            <form onSubmit={handleAddBeritaSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Judul Informasi *</label>
                <input type="text" required value={berTitle} onChange={(e) => setBerTitle(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Jenis</label>
                  <select value={berType} onChange={(e) => setBerType(e.target.value as 'Berita' | 'Pengumuman')} className="w-full px-3 py-2 border border-stone-300 rounded-xl">
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Berita">Berita</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Kategori</label>
                  <select value={berCategory} onChange={(e) => setBerCategory(e.target.value as BeritaPengumuman['category'])} className="w-full px-3 py-2 border border-stone-300 rounded-xl">
                    <option value="Organisasi">Organisasi</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Agenda">Agenda</option>
                    <option value="Kebijakan">Kebijakan</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Isi Pengumuman / Berita *</label>
                <textarea rows={4} required value={berContent} onChange={(e) => setBerContent(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-xl" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button type="button" onClick={() => setIsBeritaModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 cursor-pointer">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold cursor-pointer">Publikasikan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Arsip Administrasi */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative">
            <button onClick={() => setIsAdminModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-slate-900 text-lg mb-4">Arsipkan Surat / Dokumen KKG</h3>
            <form onSubmit={handleAddAdminSubmit} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nomor Surat</label>
                  <input type="text" value={admNumber} onChange={(e) => setAdmNumber(e.target.value)} placeholder="009/KKG-G01/2026" className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono" />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Kategori</label>
                  <select value={admCategory} onChange={(e) => setAdmCategory(e.target.value as DokumenAdministrasi['category'])} className="w-full px-3 py-2 border border-stone-300 rounded-xl">
                    <option value="Surat Keluar">Surat Keluar</option>
                    <option value="Surat Masuk">Surat Masuk</option>
                    <option value="Notulen Rapat">Notulen Rapat</option>
                    <option value="SK Kepengurusan">SK Kepengurusan</option>
                    <option value="Daftar Hadir">Daftar Hadir</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Perihal / Judul Surat *</label>
                <input type="text" required value={admTitle} onChange={(e) => setAdmTitle(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-xl" />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Instansi Pengirim / Penerima</label>
                <input type="text" value={admRecipient} onChange={(e) => setAdmRecipient(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-xl" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button type="button" onClick={() => setIsAdminModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 cursor-pointer">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold cursor-pointer">Simpan Arsip</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tanggapan Aspirasi */}
      {responseTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative">
            <button onClick={() => setResponseTarget(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-slate-900 text-base mb-1">Tanggapi Aspirasi Anggota</h3>
            <p className="text-xs text-slate-500 mb-4">{responseTarget.title}</p>
            <form onSubmit={handleSaveAspirasiResponse} className="space-y-3 text-xs sm:text-sm">
              <textarea
                rows={4}
                required
                value={responseNoteInput}
                onChange={(e) => setResponseNoteInput(e.target.value)}
                placeholder="Tuliskan catatan tindak lanjut resmi dari pengurus KKG..."
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button type="button" onClick={() => setResponseTarget(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 cursor-pointer">Batal</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold cursor-pointer">Simpan Tanggapan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
