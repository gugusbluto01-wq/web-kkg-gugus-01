import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  PlusCircle,
  Search,
  Filter,
  Heart,
  Eye,
  Send,
  X,
  User,
  Share2,
  ChevronLeft,
} from 'lucide-react';
import { ForumTopic, UserProfile } from '../../types';

interface ForumGuruProps {
  topics: ForumTopic[];
  currentUser: UserProfile;
  onAddTopic: (topic: ForumTopic) => void;
  onAddComment: (topicId: string, content: string) => void;
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
}

export const ForumGuru: React.FC<ForumGuruProps> = ({
  topics,
  currentUser,
  onAddTopic,
  onAddComment,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTopic, setActiveTopic] = useState<ForumTopic | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [isNewTopicModalOpen, setIsNewTopicModalOpen] = useState(false);

  // New Topic Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ForumTopic['category']>('Pembelajaran');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Kurikulum Merdeka, Bluto');

  const categories = [
    'Semua Topik',
    'Pembelajaran',
    'Kurikulum',
    'Asesmen',
    'Teknologi Pendidikan',
    'Administrasi Sekolah',
    'Berbagi Praktik Baik',
  ];

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchCat = selectedCategory === 'ALL' || selectedCategory === 'Semua Topik' || t.category === selectedCategory;
      const matchSearch =
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.authorName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [topics, selectedCategory, searchTerm]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeTopic) return;
    onAddComment(activeTopic.id, commentInput);
    setCommentInput('');
    onShowToast('Tanggapan Terkirim', 'Komentar Anda telah dimuat dalam thread diskusi.', 'success');
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      onShowToast('Validasi Gagal', 'Judul dan isi topik wajib diisi.', 'error');
      return;
    }
    const topic: ForumTopic = {
      id: `ft-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      content: newContent,
      authorName: currentUser.name,
      authorSchool: currentUser.school,
      authorAvatar: currentUser.avatarUrl,
      createdAt: new Date().toISOString().slice(0, 10),
      commentCount: 0,
      viewCount: 1,
      likesCount: 0,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      comments: [],
    };
    onAddTopic(topic);
    setIsNewTopicModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setActiveTopic(topic);
    onShowToast('Topik Baru Diterbitkan', 'Diskusi Anda telah berhasil dipublikasikan di Forum Guru.', 'success');
  };

  // If viewing a single topic detail
  if (activeTopic) {
    const currentActive = topics.find((t) => t.id === activeTopic.id) || activeTopic;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <button
          onClick={() => setActiveTopic(null)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-800 hover:text-rose-950 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Forum Guru</span>
        </button>

        <article className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-3 pb-6 border-b border-stone-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-rose-800">{currentActive.category}</span>
              <span>·</span>
              <span>Diposting pada {currentActive.createdAt}</span>
              <span>·</span>
              <span>{currentActive.viewCount} kali dilihat</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {currentActive.title}
            </h1>

            <div className="flex items-center gap-3 pt-2">
              <img
                src={currentActive.authorAvatar}
                alt={currentActive.authorName}
                className="w-10 h-10 rounded-full object-cover border border-stone-200"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">{currentActive.authorName}</div>
                <div className="text-xs text-slate-500">{currentActive.authorSchool}</div>
              </div>
            </div>
          </div>

          <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
            {currentActive.content}
          </div>

          {currentActive.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-stone-100 text-xs">
              <span className="text-slate-400">Tagar:</span>
              {currentActive.tags.map((t, idx) => (
                <span key={idx} className="bg-stone-100 text-slate-700 px-2.5 py-0.5 rounded font-medium">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Komentar Section */}
        <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-rose-700" />
            <span>Tanggapan & Diskusi ({currentActive.comments.length})</span>
          </h2>

          {/* Form Tambah Komentar */}
          <form onSubmit={handlePostComment} className="space-y-3 pb-6 border-b border-stone-100">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Menjawab sebagai:</span>
              <strong className="text-slate-800">{currentUser.name}</strong>
              <span>({currentUser.school})</span>
            </div>
            <textarea
              rows={3}
              placeholder="Tuliskan gagasan, tanggapan, atau pengalaman pembelajaran Anda di sini..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              required
              className="w-full p-3 text-xs sm:text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-rose-700 bg-stone-50/50"
            ></textarea>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Tanggapan</span>
              </button>
            </div>
          </form>

          {/* List Komentar */}
          <div className="space-y-4">
            {currentActive.comments.length > 0 ? (
              currentActive.comments.map((c) => (
                <div key={c.id} className="p-4 bg-stone-50 rounded-xl space-y-2 border border-stone-100">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={c.authorAvatar}
                        alt={c.authorName}
                        className="w-6 h-6 rounded-full object-cover border border-stone-200"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-bold text-slate-900">{c.authorName}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{c.authorSchool}</span>
                    </div>
                    <span className="text-stone-400 font-mono text-[11px]">{c.createdAt}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-8">
                    {c.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs text-slate-400">
                Belum ada tanggapan. Jadilah yang pertama memberikan masukan!
              </p>
            )}
          </div>
        </section>
      </div>
    );
  }

  // Forum Index List
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Kolaborasi & Diskusi</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Forum Komunikasi Guru Gugus 01
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Ruang bertukar gagasan, telaah kurikulum, dan berbagi praktik baik bagi guru se-Kecamatan Bluto
          </p>
        </div>

        <button
          onClick={() => setIsNewTopicModalOpen(true)}
          className="px-4 py-2.5 bg-rose-800 hover:bg-rose-900 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Topik Diskusi</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari topik diskusi, pertanyaan, atau nama pembuat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-rose-700 bg-stone-50/50"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'Semua Topik' ? 'ALL' : cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                (selectedCategory === 'ALL' && cat === 'Semua Topik') || selectedCategory === cat
                  ? 'bg-rose-800 text-white'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Topic List */}
      <div className="space-y-4">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <article
              key={topic.id}
              onClick={() => setActiveTopic(topic)}
              className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-rose-800">{topic.category}</span>
                <span className="font-mono text-[11px]">{topic.createdAt}</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-rose-800 transition-colors leading-snug">
                {topic.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {topic.content}
              </p>

              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <img
                    src={topic.authorAvatar}
                    alt={topic.authorName}
                    className="w-5 h-5 rounded-full object-cover border border-stone-200"
                    referrerPolicy="no-referrer"
                  />
                  <span className="font-medium text-slate-800">{topic.authorName}</span>
                  <span>({topic.authorSchool})</span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1 text-slate-600">
                    <MessageSquare className="w-3.5 h-3.5 text-rose-700" />
                    <span>{topic.commentCount} tanggapan</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{topic.viewCount} view</span>
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">Tidak Ada Topik</h3>
            <p className="text-xs text-slate-500">Belum ada diskusi dalam kategori ini. Mulai diskusi pertama sekarang!</p>
          </div>
        )}
      </div>

      {/* Modal Buat Topik Baru */}
      {isNewTopicModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsNewTopicModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-rose-700" />
              <span>Buat Topik Diskusi Baru</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Mulai perbincangan pedagogik bersama rekan-rekan guru Gugus 01 Kecamatan Bluto.
            </p>

            <form onSubmit={handleCreateTopic} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Kategori Diskusi *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ForumTopic['category'])}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                >
                  <option value="Pembelajaran">Pembelajaran</option>
                  <option value="Kurikulum">Kurikulum</option>
                  <option value="Asesmen">Asesmen</option>
                  <option value="Teknologi Pendidikan">Teknologi Pendidikan</option>
                  <option value="Administrasi Sekolah">Administrasi Sekolah</option>
                  <option value="Berbagi Praktik Baik">Berbagi Praktik Baik</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Judul Diskusi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Penerapan Asesmen Formatif Ramah Anak di Kelas 2"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Isi Diskusi / Pertanyaan *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Jelaskan latar belakang permasalahan, konteks di kelas, atau ide yang ingin didiskusikan..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Tagar (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  placeholder="Contoh: Kurikulum Merdeka, Diferensiasi, Kelas 2"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewTopicModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Publikasikan Topik (Demo)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
