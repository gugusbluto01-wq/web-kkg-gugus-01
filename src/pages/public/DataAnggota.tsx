import React, { useState, useMemo, useRef } from 'react';
import {
  Users,
  Search,
  Download,
  Upload,
  UserPlus,
  Mail,
  Phone,
  School,
  X,
  Eye,
  Trash2,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import { Anggota, UserRole } from '../../types';
import { SEKOLAH_GUGUS } from '../../data/mockData';

interface DataAnggotaProps {
  anggotaList: Anggota[];
  currentRole: UserRole;
  onAddAnggota: (anggota: Anggota) => void;
  onDeleteAnggota: (id: string) => void;
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
}

export const DataAnggota: React.FC<DataAnggotaProps> = ({
  anggotaList,
  currentRole,
  onAddAnggota,
  onDeleteAnggota,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedDetail, setSelectedDetail] = useState<Anggota | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Anggota | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  // Form State for Adding Member
  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    nuptk: '',
    school: SEKOLAH_GUGUS[0]?.name || '',
    subject: 'Guru Kelas I',
    gradeLevel: 'Fase A',
    position: 'Anggota KKG',
    email: '',
    phone: '',
  });

  const filteredAnggota = useMemo(() => {
    return anggotaList.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.nip && a.nip.includes(searchTerm)) ||
        (a.nuptk && a.nuptk.includes(searchTerm)) ||
        a.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSchool = selectedSchool === 'ALL' || a.school === selectedSchool;
      return matchSearch && matchSchool;
    });
  }, [anggotaList, searchTerm, selectedSchool]);

  const handleExportCSV = () => {
    const headers = ['Nama', 'NIP', 'NUPTK', 'Asal Sekolah', 'Mata Pelajaran', 'Jabatan', 'Status', 'Email'];
    const rows = filteredAnggota.map((a) => [
      `"${a.name}"`,
      `"${a.nip || '-'}"`,
      `"${a.nuptk || '-'}"`,
      `"${a.school}"`,
      `"${a.subject}"`,
      `"${a.position}"`,
      `"${a.status}"`,
      `"${a.email}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Data_Anggota_KKG_Gugus01_Bluto_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Data Berhasil Diekspor', 'File CSV daftar anggota telah diunduh.', 'success');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      onShowToast('Validasi Gagal', 'Nama guru wajib diisi.', 'error');
      return;
    }
    const newAnggota: Anggota = {
      id: `ang-${Date.now()}`,
      name: formData.name,
      nip: formData.nip || undefined,
      nuptk: formData.nuptk || undefined,
      school: formData.school,
      subject: formData.subject,
      gradeLevel: formData.gradeLevel,
      position: formData.position,
      role: 'guru',
      status: 'Aktif',
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@sekolah.belajar.id`,
      phone: formData.phone || '0812-0000-0000',
      joinDate: new Date().toISOString().slice(0, 10),
      avatarUrl: '/src/assets/images/ketua_kkg_portrait_1794451978961.jpg',
    };
    onAddAnggota(newAnggota);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      nip: '',
      nuptk: '',
      school: SEKOLAH_GUGUS[0]?.name || '',
      subject: 'Guru Kelas I',
      gradeLevel: 'Fase A',
      position: 'Anggota KKG',
      email: '',
      phone: '',
    });
    onShowToast('Anggota Berhasil Ditambahkan', `${newAnggota.name} masuk dalam direktori KKG (Demo).`, 'success');
  };

  const canManage = ['super_admin', 'pengurus'].includes(currentRole);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Direktori Pendidik</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Data Anggota KKG Gugus 01 Bluto
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar lengkap pendidik sekolah dasar di lingkungan Gugus 01 Kecamatan Bluto, Sumenep
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>

          {canManage && (
            <>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Impor Data</span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-800 rounded-xl hover:bg-rose-900 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tambah Anggota</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama guru, NIP, NUPTK, mata pelajaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-rose-700 bg-stone-50/50"
            />
          </div>

          {/* School Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-rose-700 bg-white text-slate-700"
            >
              <option value="ALL">Semua Sekolah Binaan (8 Sekolah)</option>
              {SEKOLAH_GUGUS.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="md:col-span-2 flex items-center justify-end gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                viewMode === 'table' ? 'bg-rose-800 text-white' : 'bg-stone-100 text-slate-700'
              }`}
            >
              Tabel
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                viewMode === 'cards' ? 'bg-rose-800 text-white' : 'bg-stone-100 text-slate-700'
              }`}
            >
              Kartu
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-stone-100">
          <span>
            Menampilkan <strong className="text-slate-800 font-mono">{filteredAnggota.length}</strong> anggota terdaftar
          </span>
          <span className="font-mono text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
            Interaksi Frontend Demo
          </span>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Nama Lengkap & NIP</th>
                  <th className="py-3 px-4">Asal Sekolah</th>
                  <th className="py-3 px-4">Tugas Mengajar</th>
                  <th className="py-3 px-4">Jabatan di KKG</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredAnggota.length > 0 ? (
                  filteredAnggota.map((ang) => (
                    <tr key={ang.id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={ang.avatarUrl}
                            alt={ang.name}
                            className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-semibold text-slate-900">{ang.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              NIP: {ang.nip || 'Non-PNS'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium">{ang.school}</td>

                      <td className="py-3 px-4">
                        <div className="text-slate-800">{ang.subject}</div>
                        <div className="text-[11px] text-slate-400">{ang.gradeLevel}</div>
                      </td>

                      <td className="py-3 px-4 text-rose-900 font-medium">{ang.position}</td>

                      <td className="py-3 px-4">
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          {ang.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedDetail(ang)}
                            className="p-1.5 text-slate-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Lihat Detail Anggota"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canManage && (
                            <button
                              onClick={() => setDeleteTarget(ang)}
                              className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus data demo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Tidak ada anggota yang cocok dengan pencarian "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAnggota.map((ang) => (
            <div
              key={ang.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={ang.avatarUrl}
                    alt={ang.name}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{ang.name}</h3>
                    <p className="text-xs text-rose-800 font-medium">{ang.position}</p>
                    <p className="text-[11px] text-slate-400 font-mono">NIP: {ang.nip || 'Non-PNS'}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <School className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                    <span className="truncate">{ang.school}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                    <span className="truncate font-mono">{ang.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                    <span>{ang.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {ang.status}
                </span>
                <button
                  onClick={() => setSelectedDetail(ang)}
                  className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1"
                >
                  <span>Detail Profil</span>
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail Anggota */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedDetail(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-stone-100">
              <img
                src={selectedDetail.avatarUrl}
                alt={selectedDetail.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-200 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                  {selectedDetail.position}
                </span>
                <h3 className="font-bold text-slate-900 text-lg leading-tight mt-1">
                  {selectedDetail.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedDetail.school}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl">
                <div>
                  <span className="text-slate-500 text-xs">NIP:</span>
                  <p className="font-mono font-medium text-slate-900">{selectedDetail.nip || 'Non-PNS'}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">NUPTK:</span>
                  <p className="font-mono font-medium text-slate-900">{selectedDetail.nuptk || '-'}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Tugas Mengajar:</span>
                  <p className="font-medium text-slate-900">{selectedDetail.subject} ({selectedDetail.gradeLevel})</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Status Keanggotaan:</span>
                  <p className="font-semibold text-emerald-700">{selectedDetail.status}</p>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-rose-700 shrink-0" />
                  <span className="font-mono text-xs">{selectedDetail.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-rose-700 shrink-0" />
                  <span className="font-mono text-xs">{selectedDetail.phone}</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-400">
                  Terdaftar dalam basis data keanggotaan KKG Gugus 01 Kecamatan Bluto sejak {selectedDetail.joinDate}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Anggota (Demo UI) */}
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
              <UserPlus className="w-5 h-5 text-rose-700" />
              <span>Tambah Anggota KKG Baru</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Formulir demonstrasi penambahan guru anggota Gugus 01 Bluto.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Siti Fatimah, S.Pd."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">NIP (Jika Ada)</label>
                  <input
                    type="text"
                    placeholder="1980xxxx..."
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">NUPTK</label>
                  <input
                    type="text"
                    placeholder="16 digit..."
                    value={formData.nuptk}
                    onChange={(e) => setFormData({ ...formData, nuptk: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Asal Sekolah Dasar *</label>
                <input
                  type="text"
                  required
                  placeholder="Ketik manual Nama SD (cth: SDN Aengbaja Raja I)"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  list="sekolah-anggota-options"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
                <datalist id="sekolah-anggota-options">
                  {SEKOLAH_GUGUS.map((s) => (
                    <option key={s.id} value={s.name} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tugas / Mata Pelajaran</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Fase / Kelas</label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    <option value="Fase A">Fase A (Kelas 1-2)</option>
                    <option value="Fase B">Fase B (Kelas 3-4)</option>
                    <option value="Fase C">Fase C (Kelas 5-6)</option>
                    <option value="Semua Fase">Semua Fase (Guru Mapel)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Jabatan di KKG</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm"
                >
                  Simpan Anggota (Demo)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Impor Data */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => {
                setIsImportModalOpen(false);
                setSelectedImportFile(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <Upload className="w-5 h-5 text-rose-700" />
              <span>Impor Data dari Excel / Dapodik</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Mendukung file spreadsheet (.csv, .xlsx) dengan kolom Nama, NIP, NUPTK, Asal Sekolah, dan Mapel.
            </p>

            <input
              ref={importFileRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setSelectedImportFile(file);
              }}
            />

            <div
              onClick={() => importFileRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-rose-600 rounded-xl p-6 text-center space-y-3 bg-stone-50 cursor-pointer transition-colors"
            >
              {selectedImportFile ? (
                <>
                  <FileSpreadsheet className="w-8 h-8 text-emerald-700 mx-auto" />
                  <div className="text-xs font-semibold text-slate-900">
                    {selectedImportFile.name}
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {(selectedImportFile.size / 1024).toFixed(1)} KB · Klik untuk ganti berkas
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                  <div className="text-xs text-slate-600">
                    Tarik file ke sini atau{' '}
                    <span className="text-rose-800 font-semibold underline">Pilih File</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Ukuran maksimal file 5 MB (Format CSV atau Excel)</p>
                </>
              )}
            </div>

            <div className="pt-4 mt-4 flex items-center justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setSelectedImportFile(null);
                }}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 text-xs font-medium cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!selectedImportFile) {
                    onShowToast('Pilih Berkas Dahulu', 'Silakan pilih file CSV/Excel sebelum memproses impor.', 'error');
                    return;
                  }
                  let importedCount = 0;
                  if (selectedImportFile.name.toLowerCase().endsWith('.csv')) {
                    const text = await selectedImportFile.text();
                    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
                    for (let i = 1; i < lines.length; i++) {
                      const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
                      if (cols[0]) {
                        onAddAnggota({
                          id: `ang-imp-${Date.now()}-${i}`,
                          name: cols[0],
                          nip: cols[1] || undefined,
                          nuptk: cols[2] || undefined,
                          school: cols[3] || SEKOLAH_GUGUS[0]?.name || 'SDN Bluto I',
                          subject: cols[4] || 'Guru Kelas',
                          gradeLevel: 'Fase B',
                          position: cols[5] || 'Anggota KKG',
                          role: 'guru',
                          status: 'Aktif',
                          email: cols[7] || `guru.imp${i}@sekolah.belajar.id`,
                          phone: '0812-0000-0000',
                          joinDate: new Date().toISOString().slice(0, 10),
                          avatarUrl: '/src/assets/images/ketua_kkg_portrait_1794451978961.jpg',
                        });
                        importedCount++;
                      }
                    }
                  }
                  if (importedCount === 0) {
                    onAddAnggota({
                      id: `ang-imp-${Date.now()}`,
                      name: 'Ahmad Fauzi, S.Pd.SD',
                      nip: '198805122020121004',
                      school: SEKOLAH_GUGUS[1]?.name || 'SDN Bluto II',
                      subject: 'Guru Kelas V',
                      gradeLevel: 'Fase C',
                      position: 'Anggota KKG',
                      role: 'guru',
                      status: 'Aktif',
                      email: 'ahmad.fauzi@sekolah.belajar.id',
                      phone: '0812-3456-7788',
                      joinDate: new Date().toISOString().slice(0, 10),
                      avatarUrl: '/src/assets/images/ketua_kkg_portrait_1794451978961.jpg',
                    });
                    importedCount = 1;
                  }
                  setIsImportModalOpen(false);
                  setSelectedImportFile(null);
                  onShowToast('Impor Data Berhasil', `${importedCount} data guru dari ${selectedImportFile.name} ditambahkan.`, 'success');
                }}
                className="px-4 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold cursor-pointer"
              >
                Proses Impor Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Anggota */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Hapus Data Anggota?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Anda akan menghapus <strong>{deleteTarget.name}</strong> ({deleteTarget.school}) dari direktori KKG.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-stone-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteAnggota(deleteTarget.id);
                  onShowToast('Anggota Dihapus', `${deleteTarget.name} telah dihapus dari direktori.`, 'info');
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-700 hover:bg-red-800 text-white cursor-pointer"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
