import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  X,
  BookOpen,
  Newspaper,
  MessageSquare,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { BeritaPengumuman, ForumTopic, PerangkatAjar } from '../../types';

interface GlobalSearchBarProps {
  perangkatList: PerangkatAjar[];
  beritaList: BeritaPengumuman[];
  forumTopics: ForumTopic[];
  onSelectPerangkat: (doc: PerangkatAjar) => void;
  onSelectBerita: (item: BeritaPengumuman) => void;
  onSelectForumTopic: (topic: ForumTopic) => void;
  onNavigate: (page: string) => void;
}

type SearchFilter = 'ALL' | 'perangkat' | 'berita' | 'forum';

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  perangkatList,
  beritaList,
  forumTopics,
  onSelectPerangkat,
  onSelectBerita,
  onSelectForumTopic,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SearchFilter>('ALL');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!trimmed) {
      return { perangkat: [], berita: [], forum: [] };
    }

    const perangkat =
      filter === 'ALL' || filter === 'perangkat'
        ? perangkatList
            .filter(
              (d) =>
                d.title.toLowerCase().includes(trimmed) ||
                d.subject.toLowerCase().includes(trimmed) ||
                d.category.toLowerCase().includes(trimmed) ||
                d.gradeLevel.toLowerCase().includes(trimmed) ||
                d.uploaderName.toLowerCase().includes(trimmed)
            )
            .slice(0, 5)
        : [];

    const berita =
      filter === 'ALL' || filter === 'berita'
        ? beritaList
            .filter(
              (b) =>
                b.title.toLowerCase().includes(trimmed) ||
                b.summary.toLowerCase().includes(trimmed) ||
                b.category.toLowerCase().includes(trimmed) ||
                b.author.toLowerCase().includes(trimmed)
            )
            .slice(0, 5)
        : [];

    const forum =
      filter === 'ALL' || filter === 'forum'
        ? forumTopics
            .filter(
              (t) =>
                t.title.toLowerCase().includes(trimmed) ||
                t.content.toLowerCase().includes(trimmed) ||
                t.category.toLowerCase().includes(trimmed) ||
                t.authorName.toLowerCase().includes(trimmed) ||
                t.tags.some((tag) => tag.toLowerCase().includes(trimmed))
            )
            .slice(0, 5)
        : [];

    return { perangkat, berita, forum };
  }, [trimmed, filter, perangkatList, beritaList, forumTopics]);

  const totalCount =
    results.perangkat.length + results.berita.length + results.forum.length;

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="bg-stone-50/90 border-b border-stone-200 py-2.5 px-4 sm:px-6 no-print">
      <div ref={containerRef} className="max-w-7xl mx-auto relative">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-rose-700 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              placeholder="Cari cepat perangkat ajar, berita/pengumuman, atau topik forum guru..."
              aria-label="Pencarian global portal KKG"
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-rose-700 focus:ring-2 focus:ring-rose-700/10 text-slate-800 placeholder:text-slate-400 shadow-xs transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Bersihkan pencarian"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
            {(
              [
                { id: 'ALL', label: 'Semua' },
                { id: 'perangkat', label: 'Perangkat Ajar' },
                { id: 'berita', label: 'Berita' },
                { id: 'forum', label: 'Forum Guru' },
              ] as { id: SearchFilter; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setFilter(tab.id);
                  if (query.trim()) setIsOpen(true);
                }}
                className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  filter === tab.id
                    ? 'bg-rose-800 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-slate-600 hover:bg-stone-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Search Dropdown Results */}
        {isOpen && trimmed.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-stone-200 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[70vh] overflow-y-auto divide-y divide-stone-100">
            <div className="px-4 py-2.5 bg-stone-50 flex items-center justify-between text-xs text-slate-500">
              <span>
                Hasil pencarian untuk <strong className="text-slate-800">&ldquo;{query}&rdquo;</strong> ({totalCount} ditemukan)
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-medium cursor-pointer"
              >
                Tutup
              </button>
            </div>

            {totalCount === 0 ? (
              <div className="p-6 text-center space-y-2">
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  Tidak ada perangkat ajar, berita, atau topik forum yang cocok.
                </p>
                <p className="text-xs text-slate-400">
                  Coba kata kunci lain seperti &ldquo;IPAS&rdquo;, &ldquo;Matematika&rdquo;, &ldquo;Rapat&rdquo;, atau &ldquo;Kurikulum&rdquo;.
                </p>
              </div>
            ) : (
              <>
                {results.perangkat.length > 0 && (
                  <div className="p-3 space-y-1.5">
                    <div className="px-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-rose-800">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Bank Perangkat Ajar ({results.perangkat.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('perangkat');
                          setIsOpen(false);
                        }}
                        className="text-rose-700 hover:underline flex items-center gap-1 normal-case font-semibold cursor-pointer"
                      >
                        <span>Lihat Semua</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    {results.perangkat.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => {
                          onSelectPerangkat(doc);
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50/70 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                            {doc.title}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {doc.category} · {doc.subject} · {doc.gradeLevel}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {doc.driveUrl && (
                            <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <ExternalLink className="w-2.5 h-2.5" />
                              Drive
                            </span>
                          )}
                          <span className="text-[10px] font-mono bg-stone-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {doc.fileFormat}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {results.berita.length > 0 && (
                  <div className="p-3 space-y-1.5">
                    <div className="px-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-rose-800">
                      <span className="flex items-center gap-1.5">
                        <Newspaper className="w-3.5 h-3.5" />
                        <span>Berita & Pengumuman ({results.berita.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('berita');
                          setIsOpen(false);
                        }}
                        className="text-rose-700 hover:underline flex items-center gap-1 normal-case font-semibold cursor-pointer"
                      >
                        <span>Lihat Semua</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    {results.berita.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectBerita(item);
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50/70 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {item.type} · {item.category} · {item.publishedAt}
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded shrink-0">
                          Baca
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {results.forum.length > 0 && (
                  <div className="p-3 space-y-1.5">
                    <div className="px-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-rose-800">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Topik Forum Guru ({results.forum.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('forum');
                          setIsOpen(false);
                        }}
                        className="text-rose-700 hover:underline flex items-center gap-1 normal-case font-semibold cursor-pointer"
                      >
                        <span>Lihat Semua</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    {results.forum.map((topic) => (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => {
                          onSelectForumTopic(topic);
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50/70 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                            {topic.title}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {topic.category} · Oleh {topic.authorName} · {topic.commentCount} tanggapan
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded shrink-0">
                          Diskusi
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
