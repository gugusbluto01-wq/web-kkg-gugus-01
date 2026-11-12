import React, { useState } from 'react';
import {
  Newspaper,
  Search,
  Calendar,
  User,
  PlusCircle,
  X,
  Share2,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { BeritaPengumuman, UserProfile, UserRole } from '../../types';
import { SEMINAR_IMAGE, WORKSHOP_IMAGE } from '../../data/mockData';

interface BeritaProps {
  beritaList: BeritaPengumuman[];
  currentUser: UserProfile;
  currentRole: UserRole;
  onAddBerita: (item: BeritaPengumuman) => void;
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
  selectedArticle: BeritaPengumuman | null;
  onSelectArticle: (item: BeritaPengumuman | null) => void;
}

export const BeritaPengumumanPage: React.FC<BeritaProps> = ({
  beritaList,
  currentUser,
  currentRole,
  onAddBerita,
  onShowToast,
  selectedArticle,
  onSelectArticle,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'Berita' | 'Pengumuman'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Berita' | 'Pengumuman'>('Pengumuman');
  const [category, setCategory] = useState<BeritaPengumuman['category']>('Organisasi');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');

  const filteredItems = beritaList.filter((item) => {
    const matchType = filterType === 'ALL' || item.type === filterType;
    const matchSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      onShowToast('Validasi Gagal', 'Judul dan isi artikel wajib diisi.', 'error');
      return;
    }
    const newItem: BeritaPengumuman = {
      id: `bp-${Date.now()}`,
      title,
      type,
      category,
      publishedAt: new Date().toISOString().slice(0, 10),
      author: currentUser.name,
      summary: summary || content.slice(0, 120) + '...',
      content,
      coverImage: type === 'Pengumuman' ? SEMINAR_IMAGE : WORKSHOP_IMAGE,
      isImportant: type === 'Pengumuman',
    };
    onAddBerita(newItem);
    setIsAddModalOpen(false);
    setTitle('');
    setSummary('');
    setContent('');
    onShowToast('Artikel Berhasil Diterbitkan', `${newItem.title} telah tayang (Demo).`, 'success');
  };

  const canManage = ['super_admin', 'pengurus'].includes(currentRole);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider">
            <Newspaper className="w-4 h-4" />
            <span>Pusat Publikasi & Edaran</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Berita & Pengumuman KKG Gugus 01
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Kabar kegiatan, edaran dinas, dan pengumuman resmi seputar pendidikan dasar di Kecamatan Bluto
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-rose-800 hover:bg-rose-900 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Berita / Edaran</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul berita, kata kunci edaran, nomor surat, atau penulis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-rose-700 bg-stone-50/50"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-1.5 justify-end">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                filterType === 'ALL' ? 'bg-rose-800 text-white' : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
              }`}
            >
              Semua ({beritaList.length})
            </button>
            <button
              onClick={() => setFilterType('Pengumuman')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                filterType === 'Pengumuman' ? 'bg-rose-800 text-white' : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
              }`}
            >
              Pengumuman
            </button>
            <button
              onClick={() => setFilterType('Berita')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                filterType === 'Berita' ? 'bg-rose-800 text-white' : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
              }`}
            >
              Kabar Berita
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            onClick={() => onSelectArticle(item)}
            className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="aspect-[16/9] w-full bg-stone-100 relative overflow-hidden">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded shadow-sm ${
                      item.type === 'Pengumuman' ? 'bg-amber-600 text-white' : 'bg-rose-800 text-white'
                    }`}
                  >
                    {item.type}
                  </span>
                  <span className="text-[10px] font-medium bg-black/60 text-white px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-rose-700" />
                  <span>{item.publishedAt}</span>
                  <span>·</span>
                  <User className="w-3.5 h-3.5 text-rose-700" />
                  <span className="truncate max-w-[140px]">{item.author}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-rose-800 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 mt-2 flex items-center justify-between text-xs font-semibold text-rose-800">
              <span className="group-hover:translate-x-0.5 transition-transform">Baca Selengkapnya</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </article>
        ))}
      </div>

      {/* Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => onSelectArticle(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-semibold px-2.5 py-0.5 rounded text-white ${
                  selectedArticle.type === 'Pengumuman' ? 'bg-amber-600' : 'bg-rose-800'
                }`}>
                  {selectedArticle.type}
                </span>
                <span className="text-slate-500">{selectedArticle.category}</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500 font-mono">{selectedArticle.publishedAt}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {selectedArticle.title}
              </h2>

              <p className="text-xs text-slate-500">
                Oleh Redaksi / Penulis: <strong>{selectedArticle.author}</strong>
              </p>
            </div>

            <div className="rounded-xl overflow-hidden aspect-[16/9] w-full bg-stone-100">
              <img
                src={selectedArticle.coverImage}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
              {selectedArticle.content}
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
              <span>Sekretariat KKG Gugus 01 Kecamatan Bluto</span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  onShowToast('Tautan Disalin', 'Tautan artikel berhasil disalin ke clipboard.', 'info');
                }}
                className="flex items-center gap-1.5 text-rose-800 hover:text-rose-950 font-medium"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Buat Berita */}
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
              <span>Publikasikan Berita / Pengumuman Baru</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Siaran informasi untuk seluruh guru dan kepala sekolah di Gugus 01 Bluto.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Judul Artikel / Edaran *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jadwal Pendampingan Penyusunan Rapor Siswa Semester Ganjil"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tipe Publikasi</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    <option value="Pengumuman">Pengumuman Resmi</option>
                    <option value="Berita">Kabar Berita KKG</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    <option value="Organisasi">Organisasi</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Kebijakan">Kebijakan</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Agenda">Agenda</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Ringkasan Singkat (Lead Paragraph)</label>
                <input
                  type="text"
                  placeholder="1-2 kalimat ringkasan yang muncul di kartu depan..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Isi Lengkap Artikel / Edaran *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tuliskan isi pengumuman atau narasi berita lengkap di sini..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
                  Terbitkan (Demo)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
