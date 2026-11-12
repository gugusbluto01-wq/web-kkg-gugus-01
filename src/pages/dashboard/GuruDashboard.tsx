import React, { useState } from 'react';
import {
  User,
  Calendar,
  BookOpen,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  ArrowRight,
  School,
  Mail,
  Phone,
  Edit3,
} from 'lucide-react';
import {
  Aspirasi,
  ForumTopic,
  Kegiatan,
  PerangkatAjar,
  UserProfile,
} from '../../types';

interface GuruProps {
  currentUser: UserProfile;
  kegiatanList: Kegiatan[];
  perangkatList: PerangkatAjar[];
  forumTopics: ForumTopic[];
  aspirasiList: Aspirasi[];
  onNavigatePublic: (page: string) => void;
  onUpdateUser: (user: UserProfile) => void;
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
}

export const GuruDashboard: React.FC<GuruProps> = ({
  currentUser,
  kegiatanList,
  perangkatList,
  forumTopics,
  aspirasiList,
  onNavigatePublic,
  onUpdateUser,
  onShowToast,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editSchool, setEditSchool] = useState(currentUser.school);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editEmail, setEditEmail] = useState(currentUser.email);

  // My items
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
    onShowToast('Profil Diperbarui', 'Data identitas pendidik telah disimpan (Demo).', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
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

      {/* Grid Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Pertemuan KKG Diikuti</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {kegiatanList.length} Sesi
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">Presensi Aktif</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Perangkat Ajar Terbagi</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {myDocs.length} Modul
          </div>
          <p className="text-[11px] text-rose-800 mt-1">Kontribusi Anda</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Diskusi Forum</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {forumTopics.length} Topik
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Aktif berdiskusi</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Aspirasi Saya</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {myAspirations.length} Usulan
          </div>
          <p className="text-[11px] text-amber-700 mt-1">Status terpantau</p>
        </div>
      </div>

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Agenda & Modul */}
        <div className="lg:col-span-8 space-y-6">
          {/* Agenda KKG */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-base font-bold text-slate-900">Agenda Pertemuan KKG Terdekat</h2>
              <button
                onClick={() => onNavigatePublic('kegiatan')}
                className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1"
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
                    <span className="text-emerald-700 font-semibold">Tersedia Presensi</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Perangkat Ajar Saya */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-base font-bold text-slate-900">Perangkat Ajar Sekolah Saya</h2>
              <button
                onClick={() => onNavigatePublic('perangkat')}
                className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1"
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
                <p className="text-xs text-slate-400 py-3 text-center">Belum ada modul yang diunggah.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Profil Biodata Pendidik */}
        <div className="lg:col-span-4 space-y-6">
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
        </div>
      </div>
    </div>
  );
};
