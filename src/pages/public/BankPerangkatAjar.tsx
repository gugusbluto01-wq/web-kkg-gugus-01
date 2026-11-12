import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Upload,
  FileText,
  CheckCircle2,
  X,
  FileCheck,
  Eye,
  Calendar,
  User,
  ExternalLink,
} from 'lucide-react';
import { PerangkatAjar, PerangkatCategory, UserProfile } from '../../types';

interface BankPerangkatProps {
  perangkatList: PerangkatAjar[];
  currentUser: UserProfile;
  onAddPerangkat: (doc: PerangkatAjar) => void;
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
  onPreviewPerangkat: (doc: PerangkatAjar) => void;
}

export const BankPerangkatAjar: React.FC<BankPerangkatProps> = ({
  perangkatList,
  currentUser,
  onAddPerangkat,
  onShowToast,
  onPreviewPerangkat,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<PerangkatCategory>('Modul Ajar');
  const [formGrade, setFormGrade] = useState<PerangkatAjar['gradeLevel']>('Fase B (Kelas 3-4)');
  const [formSubject, setFormSubject] = useState('Ilmu Pengetahuan Alam & Sosial');
  const [formDesc, setFormDesc] = useState('');
  const [formFormat, setFormFormat] = useState<'PDF' | 'DOCX' | 'PPTX' | 'XLSX'>('PDF');
  const [formDriveUrl, setFormDriveUrl] = useState('');

  const categories: PerangkatCategory[] = [
    'Modul Ajar',
    'RPP',
    'ATP',
    'CP & TP',
    'LKPD',
    'Bahan Ajar',
    'Media Pembelajaran',
    'Asesmen',
    'Soal Evaluasi',
    'Perangkat Administrasi',
  ];

  const filteredDocs = useMemo(() => {
    return perangkatList.filter((doc) => {
      const matchCat = selectedCategory === 'ALL' || doc.category === selectedCategory;
      const matchGrade = selectedGrade === 'ALL' || doc.gradeLevel.includes(selectedGrade);
      const matchSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.uploaderName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchGrade && matchSearch;
    });
  }, [perangkatList, selectedCategory, selectedGrade, searchTerm]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      onShowToast('Validasi Gagal', 'Judul dokumen perangkat ajar wajib diisi.', 'error');
      return;
    }
    const newDoc: PerangkatAjar = {
      id: `dok-${Date.now()}`,
      title: formTitle,
      category: formCategory,
      gradeLevel: formGrade,
      subject: formSubject,
      description: formDesc || 'Perangkat ajar pelengkap Kurikulum Merdeka diunggah oleh anggota KKG.',
      fileFormat: formFormat,
      fileSize: formDriveUrl ? 'Google Drive' : '2.4 MB',
      downloadCount: 1,
      uploaderName: currentUser.name,
      uploaderSchool: currentUser.school,
      uploadedAt: new Date().toISOString().slice(0, 10),
      isVerified: true,
      driveUrl: formDriveUrl.trim() || undefined,
    };
    onAddPerangkat(newDoc);
    setIsUploadModalOpen(false);
    setFormTitle('');
    setFormDesc('');
    setFormDriveUrl('');
    onShowToast('Dokumen Berhasil Diunggah', `${newDoc.title} telah tersimpan di Bank Perangkat (Demo).`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Perpustakaan Digital KKG</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Bank Perangkat Ajar Kurikulum Merdeka
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Koleksi repositori modul ajar, ATP, LKPD, rubrik asesmen, dan media digital guru SD Bluto
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 bg-rose-800 hover:bg-rose-900 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Unggah Perangkat Ajar</span>
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul perangkat ajar, mata pelajaran, materi, atau nama guru..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-rose-700 bg-stone-50/50"
            />
          </div>

          {/* Grade Level Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-rose-700 bg-white text-slate-700"
            >
              <option value="ALL">Semua Jenjang Fase & Kelas</option>
              <option value="Fase A">Fase A (Kelas 1 - 2)</option>
              <option value="Fase B">Fase B (Kelas 3 - 4)</option>
              <option value="Fase C">Fase C (Kelas 5 - 6)</option>
            </select>
          </div>
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
            Semua Dokumen ({perangkatList.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-rose-800 text-white'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-rose-800 text-xs bg-rose-50 px-2.5 py-0.5 rounded">
                      {doc.category}
                    </span>
                    {doc.driveUrl && (
                      <span className="font-medium text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <ExternalLink className="w-2.5 h-2.5 text-emerald-600" />
                        Drive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-slate-600 bg-stone-100 px-2 py-0.5 rounded font-semibold">
                      {doc.fileFormat}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">{doc.fileSize}</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {doc.description}
                </p>

                <div className="p-2.5 bg-stone-50 rounded-xl space-y-1 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Mata Pelajaran:</span>
                    <strong className="text-slate-800 truncate max-w-[160px]">{doc.subject}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fase / Kelas:</span>
                    <span className="text-slate-700">{doc.gradeLevel}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500">
                    Oleh: <strong className="text-slate-800">{doc.uploaderName}</strong>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                    {doc.uploaderSchool} · {doc.uploadedAt}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {doc.driveUrl && (
                    <a
                      href={doc.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                      title="Buka langsung di Google Drive"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Drive</span>
                    </a>
                  )}
                  <button
                    onClick={() => onPreviewPerangkat(doc)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-800 hover:bg-rose-900 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white border border-stone-200 rounded-2xl p-10 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">Tidak Ada Dokumen yang Cocok</h3>
            <p className="text-xs text-slate-500">
              Coba sesuaikan kata kunci pencarian atau kategori yang dipilih.
            </p>
          </div>
        )}
      </div>

      {/* Modal Unggah Dokumen Baru */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <Upload className="w-5 h-5 text-rose-700" />
              <span>Unggah Perangkat Pembelajaran Baru</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Bagikan modul atau perangkat ajar Anda kepada seluruh pendidik se-Gugus 01 Bluto.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Judul Dokumen Perangkat *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modul Ajar Matematika Fase A: Pengukuran Panjang Menggunakan Jengkal"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Kategori Perangkat</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as PerangkatCategory)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Jenjang Fase</label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value as PerangkatAjar['gradeLevel'])}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    <option value="Fase A (Kelas 1-2)">Fase A (Kelas 1-2)</option>
                    <option value="Fase B (Kelas 3-4)">Fase B (Kelas 3-4)</option>
                    <option value="Fase C (Kelas 5-6)">Fase C (Kelas 5-6)</option>
                    <option value="Semua Fase">Semua Fase</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Format Berkas</label>
                  <select
                    value={formFormat}
                    onChange={(e) => setFormFormat(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    <option value="PDF">PDF Document (.pdf)</option>
                    <option value="DOCX">Microsoft Word (.docx)</option>
                    <option value="PPTX">PowerPoint Slides (.pptx)</option>
                    <option value="XLSX">Spreadsheet (.xlsx)</option>
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
                    placeholder="https://drive.google.com/file/d/... atau https://drive.google.com/drive/folders/..."
                    value={formDriveUrl}
                    onChange={(e) => setFormDriveUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono text-xs"
                  />
                  <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Masukkan link berkas atau folder Google Drive Anda (pastikan akses disetel: &ldquo;Siapa saja yang memiliki link dapat melihat&rdquo;).
                </p>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Deskripsi Singkat / Petunjuk</label>
                <textarea
                  rows={3}
                  placeholder="Keterangan materi, asesmen, atau catatan khusus saat penggunaan di kelas..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                ></textarea>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-slate-500">
                Dokumen akan dipublikasikan atas nama <strong>{currentUser.name}</strong> ({currentUser.school}).
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Unggah Sekarang (Demo)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
