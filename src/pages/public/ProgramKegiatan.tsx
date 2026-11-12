import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Users,
  CheckCircle2,
  PlusCircle,
  FileText,
  Image as ImageIcon,
  ChevronRight,
  X,
} from 'lucide-react';
import { Kegiatan, UserProfile, UserRole } from '../../types';
import { SEKOLAH_GUGUS } from '../../data/mockData';

interface ProgramKegiatanProps {
  kegiatanList: Kegiatan[];
  currentUser: UserProfile;
  currentRole: UserRole;
  onAddKegiatan: (kegiatan: Kegiatan) => void;
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
}

export const ProgramKegiatan: React.FC<ProgramKegiatanProps> = ({
  kegiatanList,
  currentUser,
  currentRole,
  onAddKegiatan,
  onShowToast,
}) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedKegiatan, setSelectedKegiatan] = useState<Kegiatan | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [enrolledIds, setEnrolledIds] = useState<string[]>(['keg-01']);

  // Add Kegiatan Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Kegiatan['type']>('KKG Rutin');
  const [date, setDate] = useState('2026-12-05');
  const [time, setTime] = useState('08.30 - 12.00 WIB');
  const [location, setLocation] = useState(SEKOLAH_GUGUS[0]?.name || 'Aula SDN Bluto I');
  const [personInCharge, setPersonInCharge] = useState(currentUser.name);
  const [quota, setQuota] = useState(40);
  const [description, setDescription] = useState('');

  const types: Kegiatan['type'][] = [
    'KKG Rutin',
    'Workshop',
    'Pelatihan',
    'Seminar',
    'Pendampingan',
    'Kegiatan Kolaborasi',
  ];

  const filteredKegiatan = kegiatanList.filter((k) => {
    return selectedType === 'ALL' || k.type === selectedType;
  });

  const handleEnroll = (kegId: string) => {
    if (enrolledIds.includes(kegId)) {
      setEnrolledIds(enrolledIds.filter((id) => id !== kegId));
      onShowToast('Pendaftaran Dibatalkan', 'Presensi/registrasi dibatalkan.', 'info');
    } else {
      setEnrolledIds([...enrolledIds, kegId]);
      onShowToast('Presensi / Pendaftaran Berhasil', `Anda terdaftar atas nama ${currentUser.name} (${currentUser.school}).`, 'success');
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('Validasi Gagal', 'Nama kegiatan wajib diisi.', 'error');
      return;
    }
    const newKeg: Kegiatan = {
      id: `keg-${Date.now()}`,
      title,
      type,
      date,
      time,
      location,
      locationDetail: `${location}, Kec. Bluto`,
      personInCharge,
      status: 'Akan Datang',
      quota: Number(quota),
      enrolledCount: 1,
      description: description || 'Kegiatan resmi Kelompok Kerja Guru Gugus 01 Kecamatan Bluto.',
      materials: 'Materi dan LKPD disiapkan oleh penanggung jawab.',
      documentationImages: [],
    };
    onAddKegiatan(newKeg);
    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
    onShowToast('Kegiatan Baru Ditambahkan', `${newKeg.title} berhasil dijadwalkan (Demo).`, 'success');
  };

  const canManage = ['super_admin', 'pengurus'].includes(currentRole);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider">
            <CalendarIcon className="w-4 h-4" />
            <span>Kalender Akademik & Agenda</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Program & Kegiatan KKG Gugus 01
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Jadwal pertemuan rutin, workshop, pelatihan, dan kegiatan kolaboratif antar-sekolah di Kecamatan Bluto
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-rose-800 hover:bg-rose-900 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Jadwal Kegiatan</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedType('ALL')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-medium transition-colors ${
            selectedType === 'ALL'
              ? 'bg-rose-800 text-white'
              : 'bg-white border border-stone-200 text-slate-700 hover:bg-stone-50'
          }`}
        >
          Semua Kegiatan ({kegiatanList.length})
        </button>
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-medium transition-colors ${
              selectedType === t
                ? 'bg-rose-800 text-white'
                : 'bg-white border border-stone-200 text-slate-700 hover:bg-stone-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List of Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredKegiatan.map((keg) => {
          const isEnrolled = enrolledIds.includes(keg.id);

          return (
            <div
              key={keg.id}
              className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-rose-800 bg-rose-50 px-3 py-1 rounded-md">
                    {keg.type}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                      keg.status === 'Akan Datang'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-stone-100 text-slate-600'
                    }`}
                  >
                    {keg.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {keg.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {keg.description}
                </p>

                <div className="space-y-2 text-xs text-slate-600 p-3 bg-stone-50 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <CalendarIcon className="w-4 h-4 text-rose-700 shrink-0" />
                    <span className="font-medium text-slate-800">{keg.date}</span>
                    <span className="text-slate-400">·</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{keg.time}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-rose-700 shrink-0" />
                    <span className="truncate">{keg.location}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>PJ: {keg.personInCharge}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-3 text-xs">
                <div className="text-slate-500 font-mono">
                  Peserta: <strong className="text-slate-900">{keg.enrolledCount}</strong> / {keg.quota} guru
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedKegiatan(keg)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 text-slate-700 hover:bg-stone-50 font-medium cursor-pointer"
                  >
                    Detail
                  </button>

                  <button
                    onClick={() => handleEnroll(keg.id)}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      isEnrolled
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-rose-800 text-white hover:bg-rose-900'
                    }`}
                  >
                    {isEnrolled ? 'Terdaftar (Batal)' : 'Daftar / Presensi'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Detail Kegiatan */}
      {selectedKegiatan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedKegiatan(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded">
              {selectedKegiatan.type}
            </span>

            <h3 className="text-xl font-bold text-slate-900 mt-2 mb-3 leading-snug">
              {selectedKegiatan.title}
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 mb-4">
              <p className="leading-relaxed">{selectedKegiatan.description}</p>

              <div className="p-3 bg-stone-50 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-rose-700 shrink-0" />
                  <span>{selectedKegiatan.date} ({selectedKegiatan.time})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-700 shrink-0" />
                  <span>{selectedKegiatan.locationDetail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-rose-700 shrink-0" />
                  <span>Penanggung Jawab: {selectedKegiatan.personInCharge}</span>
                </div>
              </div>

              {selectedKegiatan.materials && (
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60">
                  <div className="font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-700" />
                    <span>Perangkat & Materi Kegiatan:</span>
                  </div>
                  <p className="text-xs text-amber-800">{selectedKegiatan.materials}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Kuota Terisi: {selectedKegiatan.enrolledCount} / {selectedKegiatan.quota}
              </span>
              <button
                onClick={() => {
                  handleEnroll(selectedKegiatan.id);
                  setSelectedKegiatan(null);
                }}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white rounded-xl text-xs font-semibold"
              >
                {enrolledIds.includes(selectedKegiatan.id) ? 'Batalkan Presensi' : 'Konfirmasi Presensi Kehadiran'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Kegiatan */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-rose-700" />
              <span>Jadwalkan Kegiatan KKG Baru</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Tambahkan agenda rapat, workshop, atau seminar ke dalam kalender resmi Gugus 01.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Kegiatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bimbingan Teknis Pembuatan Modul P5 Tematik Pesisir"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Jenis Kegiatan</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    {types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Waktu</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tempat / Sekolah Tuan Rumah</label>
                  <input
                    type="text"
                    placeholder="Ketik manual Nama SD / Lokasi (cth: SDN Kapedi I)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    list="sekolah-kegiatan-options"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                  <datalist id="sekolah-kegiatan-options">
                    {SEKOLAH_GUGUS.map((s) => (
                      <option key={s.id} value={s.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Penanggung Jawab</label>
                  <input
                    type="text"
                    value={personInCharge}
                    onChange={(e) => setPersonInCharge(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Kuota Peserta Guru</label>
                  <input
                    type="number"
                    value={quota}
                    onChange={(e) => setQuota(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Deskripsi Singkat / Agenda</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tujuan pertemuan, kelengkapan yang harus dibawa peserta..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Simpan Jadwal (Demo)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
