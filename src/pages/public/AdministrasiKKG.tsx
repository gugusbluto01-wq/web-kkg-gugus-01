import React, { useState, useMemo } from 'react';
import {
  FolderLock,
  Search,
  Download,
  FileText,
  PlusCircle,
  X,
  Calendar,
  Eye,
} from 'lucide-react';
import { DokumenAdministrasi, UserProfile, UserRole } from '../../types';
import { triggerDocumentDownload } from '../../utils/downloadHelper';

interface AdministrasiProps {
  dokumenList: DokumenAdministrasi[];
  currentUser: UserProfile;
  currentRole: UserRole;
  onAddDokumen: (doc: DokumenAdministrasi) => void;
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdministrasiKKG: React.FC<AdministrasiProps> = ({
  dokumenList,
  currentUser,
  currentRole,
  onAddDokumen,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DokumenAdministrasi | null>(null);

  // Form State
  const [letterNumber, setLetterNumber] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DokumenAdministrasi['category']>('Surat Masuk');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [senderOrRecipient, setSenderOrRecipient] = useState('');
  const [fileFormat, setFileFormat] = useState<'PDF' | 'DOCX' | 'XLSX'>('PDF');
  const [fileSize, setFileSize] = useState('350 KB');

  const categories: DokumenAdministrasi['category'][] = [
    'Surat Masuk',
    'Surat Keluar',
    'SK Kepengurusan',
    'Daftar Hadir',
    'Notulen Rapat',
    'Program Kerja',
    'Laporan Kegiatan',
    'Arsip Organisasi',
  ];

  const filteredDocs = useMemo(() => {
    return dokumenList.filter((doc) => {
      const matchCat = selectedCategory === 'ALL' || doc.category === selectedCategory;
      const matchSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.letterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.senderOrRecipient.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [dokumenList, selectedCategory, searchTerm]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('Validasi Gagal', 'Nama dokumen wajib diisi.', 'error');
      return;
    }
    const newDoc: DokumenAdministrasi = {
      id: `adm-${Date.now()}`,
      letterNumber: letterNumber || `ADM/${Date.now().toString().slice(-4)}/KKG-BLT`,
      title,
      category,
      date,
      senderOrRecipient: senderOrRecipient || 'Sekretariat KKG Gugus 01 Bluto',
      fileFormat,
      fileSize: fileSize || '500 KB',
      status: 'Resmi',
      signedBy: currentUser.name,
    };
    onAddDokumen(newDoc);
    setIsAddModalOpen(false);
    setTitle('');
    setLetterNumber('');
    setSenderOrRecipient('');
    onShowToast('Dokumen Diarsipkan', `${newDoc.title} telah tersimpan di Administrasi Digital (Demo).`, 'success');
  };

  const handleDownload = (doc: DokumenAdministrasi) => {
    triggerDocumentDownload(
      `${doc.letterNumber}_${doc.title}.txt`,
      doc.title,
      {
        'Nomor Berkas': doc.letterNumber,
        Kategori: doc.category,
        Tanggal: doc.date,
        'Instansi Terkait': doc.senderOrRecipient,
        Format: `${doc.fileFormat} (${doc.fileSize})`,
        Status: doc.status,
        Penandatangan: doc.signedBy,
      }
    );
    onShowToast('Berkas Arsip Diunduh', `${doc.letterNumber} (${doc.fileFormat}) berhasil diunduh.`, 'success');
  };

  const canManage = ['super_admin', 'pengurus'].includes(currentRole);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider">
            <FolderLock className="w-4 h-4" />
            <span>Tata Kelola Organisasi</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Pusat Administrasi & Tata Persuratan KKG
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Arsip digital surat masuk, surat keluar, SK kepengurusan, notulen musyawarah, dan daftar hadir gugus
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-rose-800 hover:bg-rose-900 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Arsipkan Dokumen Baru</span>
          </button>
        )}
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor surat, perihal, instansi pengirim/tujuan, atau judul..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-rose-700 bg-stone-50/50"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-rose-800 text-white'
                : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900'
            }`}
          >
            Semua Arsip ({dokumenList.length})
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedCategory === c
                  ? 'bg-rose-800 text-white'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Administration Documents */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Nomor & Tanggal Berkas</th>
                <th className="py-3 px-4">Perihal / Judul Dokumen</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Pengirim / Penerima</th>
                <th className="py-3 px-4">Status & Format</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-slate-900 text-xs">
                        {doc.letterNumber}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-rose-700" />
                        <span>{doc.date}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{doc.title}</div>
                      {doc.signedBy && (
                        <div className="text-[11px] text-slate-400">
                          Penandatangan: {doc.signedBy}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[10px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                        {doc.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {doc.senderOrRecipient}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-semibold text-slate-700 bg-stone-100 px-1.5 py-0.5 rounded">
                          {doc.fileFormat}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{doc.fileSize}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 text-slate-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Pratinjau Detail Dokumen"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="px-2.5 py-1 text-xs font-medium text-rose-800 hover:bg-rose-50 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                          title="Unduh Salinan Dokumen"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ditemukan arsip surat dengan kriteria pencarian "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Arsip Baru */}
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
              <span>Arsipkan Dokumen Administrasi Baru</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Formulir pencatatan surat masuk, surat keluar, SK, dan notulen KKG Gugus 01 Bluto.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nomor Surat / Berkas *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 008/KKG.G01/BLT/XI/2026"
                    value={letterNumber}
                    onChange={(e) => setLetterNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Kategori Dokumen</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Perihal / Judul Dokumen *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Undangan Koordinasi Penyusunan RAPB KKG Tahun 2027"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tanggal Surat / Terbit</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Instansi Pengirim / Penerima</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kepala SDN Se-Gugus 01"
                    value={senderOrRecipient}
                    onChange={(e) => setSenderOrRecipient(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Format Berkas</label>
                  <select
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    <option value="PDF">PDF (.pdf)</option>
                    <option value="DOCX">Word (.docx)</option>
                    <option value="XLSX">Excel (.xlsx)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Ukuran File</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
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
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Simpan ke Arsip (Demo)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Pratinjau Dokumen Administrasi */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative space-y-4 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                  {previewDoc.category}
                </span>
                <h3 className="font-bold text-slate-900 text-base leading-snug mt-1">
                  {previewDoc.title}
                </h3>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  No: {previewDoc.letterNumber}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal Surat:</span>
                <span className="font-medium">{previewDoc.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Instansi Terkait:</span>
                <span className="font-medium text-right">{previewDoc.senderOrRecipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Format & Ukuran:</span>
                <span className="font-mono font-medium">{previewDoc.fileFormat} ({previewDoc.fileSize})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Berkas:</span>
                <span className="font-semibold text-emerald-700">{previewDoc.status}</span>
              </div>
              {previewDoc.signedBy && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Penandatangan:</span>
                  <span className="font-medium">{previewDoc.signedBy}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-stone-100 cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-800 hover:bg-rose-900 text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Salinan Arsip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
