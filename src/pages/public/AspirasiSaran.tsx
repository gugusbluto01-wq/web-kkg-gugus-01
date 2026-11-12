import React, { useState } from 'react';
import {
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  Shield,
  School,
  X,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Aspirasi, UserProfile, UserRole } from '../../types';
import { SEKOLAH_GUGUS } from '../../data/mockData';

interface AspirasiProps {
  aspirasiList: Aspirasi[];
  currentUser: UserProfile;
  currentRole: UserRole;
  onAddAspirasi: (item: Aspirasi) => void;
  onUpdateStatus: (id: string, status: Aspirasi['status'], notes?: string) => void;
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
}

export const AspirasiSaran: React.FC<AspirasiProps> = ({
  aspirasiList,
  currentUser,
  currentRole,
  onAddAspirasi,
  onUpdateStatus,
  onShowToast,
}) => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [senderName, setSenderName] = useState(currentUser.name);
  const [school, setSchool] = useState(currentUser.school);
  const [category, setCategory] = useState<Aspirasi['category']>('Pembelajaran');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  const categories: Aspirasi['category'][] = [
    'Organisasi',
    'Kegiatan',
    'Pembelajaran',
    'Administrasi',
    'Keuangan',
    'Lainnya',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      onShowToast('Validasi Gagal', 'Judul dan isi aspirasi wajib diisi.', 'error');
      return;
    }
    const newAspirasi: Aspirasi = {
      id: `asp-${Date.now()}`,
      title,
      category,
      content,
      senderName: isAnonymous ? 'Anonim (Guru Anggota)' : senderName,
      isAnonymous,
      school,
      submittedAt: new Date().toISOString().slice(0, 10),
      status: 'Diterima',
      responseNotes: 'Aspirasi telah masuk dalam antrean telaah pengurus KKG Gugus 01.',
    };
    onAddAspirasi(newAspirasi);
    setTitle('');
    setContent('');
    setActiveTab('list');
    onShowToast('Aspirasi Terkirim', 'Terima kasih atas kontribusi dan saran konstruktif Anda.', 'success');
  };

  const filteredList = aspirasiList.filter((item) => {
    return selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;
  });

  const canManage = ['super_admin', 'pengurus'].includes(currentRole);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider">
            <Send className="w-4 h-4" />
            <span>Kanal Aspirasi & Suara Guru</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Aspirasi, Saran & Masukan Pendidik
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Wadah penyampaian usulan peningkatan mutu pembelajaran, sarana, dan tata kelola KKG Gugus 01 Bluto
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'form' ? 'bg-rose-800 text-white shadow-sm' : 'bg-white border border-stone-200 text-slate-700'
            }`}
          >
            Kirim Aspirasi
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'list' ? 'bg-rose-800 text-white shadow-sm' : 'bg-white border border-stone-200 text-slate-700'
            }`}
          >
            Daftar Aspirasi & Tindak Lanjut ({aspirasiList.length})
          </button>
        </div>
      </div>

      {activeTab === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-8 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-700" />
              <span>Formulir Pengiriman Usulan & Saran</span>
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Pengurus KKG Gugus 01 secara berkala meninjau seluruh masukan demi perbaikan program bersama.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Kirim Sebagai Anonim</span>
                  <span className="text-[11px] text-slate-500">Nama Anda akan disamarkan demi menjaga kerahasiaan.</span>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-rose-700 rounded focus:ring-rose-500 cursor-pointer"
                />
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Asal Sekolah</label>
                    <input
                      type="text"
                      placeholder="Ketik manual Nama SD (cth: SDN Lobuk I)"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      list="sekolah-aspirasi-options"
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                    />
                    <datalist id="sekolah-aspirasi-options">
                      {SEKOLAH_GUGUS.map((s) => (
                        <option key={s.id} value={s.name} />
                      ))}
                    </datalist>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 mb-1">Kategori Masukan *</label>
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

              <div>
                <label className="block font-medium text-slate-700 mb-1">Judul Pokok Aspirasi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengadaan Bimbingan Teknis Canva Ajar untuk Guru Kelas Rendah"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Uraian Aspirasi / Saran Konkret *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Jelaskan secara runtut latar belakang, kendala yang dihadapi di sekolah, serta solusi yang diusulkan..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-800 hover:bg-rose-900 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Aspirasi Sekarang</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Info Guide */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-xs text-slate-600 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-700" />
                <span>Etika & Prinsip Aspirasi</span>
              </h3>
              <p>
                1. <strong>Objektif & Membangun:</strong> Disampaikan dengan bahasa yang santun demi peningkatan mutu pendidikan dan kebersamaan gugus.
              </p>
              <p>
                2. <strong>Bebas SARA & Privasi:</strong> Hindari ujaran kebencian atau mendiskreditkan sesama pendidik secara personal.
              </p>
              <p>
                3. <strong>Tindak Lanjut Musyawarah:</strong> Aspirasi yang masuk akan dibahas pada agenda Rapat Pengurus KKG di setiap pekan ke-3.
              </p>
            </div>

            <div className="bg-rose-50/70 border border-rose-200/60 rounded-2xl p-5 text-xs text-rose-900 space-y-2">
              <h4 className="font-bold text-sm">Alur Penanganan Masukan</h4>
              <div className="space-y-1.5 text-[11px] leading-relaxed">
                <div>• <strong>Diterima:</strong> Masuk dalam sistem administrasi sekretariat.</div>
                <div>• <strong>Ditinjau Pengurus:</strong> Dibahas dalam musyawarah kerja.</div>
                <div>• <strong>Ditindaklanjuti:</strong> Diwujudkan dalam program kerja atau rekomendasi sekolah.</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* List of Aspirations */
        <div className="space-y-6">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
                selectedCategoryFilter === 'ALL' ? 'bg-rose-800 text-white' : 'bg-stone-100 text-slate-700'
              }`}
            >
              Semua Kategori
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategoryFilter(c)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
                  selectedCategoryFilter === c ? 'bg-rose-800 text-white' : 'bg-stone-100 text-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredList.map((asp) => (
              <div
                key={asp.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded">
                      {asp.category}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 font-mono">{asp.submittedAt}</span>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded ${
                      asp.status === 'Ditindaklanjuti'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : asp.status === 'Ditinjau Pengurus'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-stone-100 text-slate-700'
                    }`}
                  >
                    Status: {asp.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {asp.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {asp.content}
                </p>

                <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-stone-100">
                  <span>
                    Pengirim: <strong className="text-slate-800">{asp.senderName}</strong> ({asp.school})
                  </span>

                  {canManage && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">Ubah Status (Demo):</span>
                      <select
                        value={asp.status}
                        onChange={(e) => {
                          onUpdateStatus(asp.id, e.target.value as any);
                          onShowToast('Status Aspirasi Diperbarui', `Status diubah menjadi ${e.target.value}.`, 'success');
                        }}
                        className="text-[11px] font-medium bg-stone-50 border border-stone-200 rounded px-2 py-0.5"
                      >
                        <option value="Diterima">Diterima</option>
                        <option value="Ditinjau Pengurus">Ditinjau Pengurus</option>
                        <option value="Ditindaklanjuti">Ditindaklanjuti</option>
                      </select>
                    </div>
                  )}
                </div>

                {asp.responseNotes && (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-slate-600 mt-2">
                    <strong className="text-rose-900 block mb-0.5">Tanggapan / Catatan Pengurus:</strong>
                    <span>{asp.responseNotes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
