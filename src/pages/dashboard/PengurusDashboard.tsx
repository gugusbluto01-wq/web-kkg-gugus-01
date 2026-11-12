import React from 'react';
import {
  Calendar,
  BookOpen,
  Newspaper,
  FolderLock,
  Send,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import {
  Aspirasi,
  BeritaPengumuman,
  DokumenAdministrasi,
  Kegiatan,
  PerangkatAjar,
  UserProfile,
} from '../../types';

interface PengurusProps {
  currentUser: UserProfile;
  kegiatanList: Kegiatan[];
  perangkatList: PerangkatAjar[];
  beritaList: BeritaPengumuman[];
  administrasiList: DokumenAdministrasi[];
  aspirasiList: Aspirasi[];
  onNavigatePublic: (page: string) => void;
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
}

export const PengurusDashboard: React.FC<PengurusProps> = ({
  currentUser,
  kegiatanList,
  perangkatList,
  beritaList,
  administrasiList,
  aspirasiList,
  onNavigatePublic,
  onShowToast,
}) => {
  const pendingAspirasi = aspirasiList.filter((a) => a.status === 'Diterima');
  const upcomingKegiatan = kegiatanList.filter((k) => k.status === 'Akan Datang');

  return (
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
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Agenda Akan Datang</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {upcomingKegiatan.length} Acara
          </div>
          <p className="text-[11px] text-rose-800 mt-1">Presensi digital aktif</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Koleksi Perangkat Ajar</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {perangkatList.length} Modul
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">Semua terverifikasi</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Arsip Surat & Notulen</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {administrasiList.length} Berkas
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Tata persuratan resmi</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Aspirasi Belum Ditinjau</div>
          <div className="text-2xl font-extrabold text-amber-800 font-mono">
            {pendingAspirasi.length} Masukan
          </div>
          <p className="text-[11px] text-amber-700 mt-1">Perlu tindak lanjut</p>
        </div>
      </div>

      {/* Main Grid: Agenda KKG & Aspirasi Guru */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agenda Kegiatan Terdekat */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Agenda Kegiatan Terdekat</h2>
              <p className="text-xs text-slate-500">Jadwal pertemuan dan kesiapan sekolah tuan rumah</p>
            </div>
            <button
              onClick={() => onNavigatePublic('kegiatan')}
              className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1"
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

        {/* Aspirasi & Masukan Menunggu Telaah */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Kotak Aspirasi Guru</h2>
              <p className="text-xs text-slate-500">Usulan anggota yang menunggu pembahasan</p>
            </div>
            <button
              onClick={() => onNavigatePublic('aspirasi')}
              className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1"
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
  );
};
