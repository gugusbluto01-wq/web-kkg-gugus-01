import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Calendar,
  Eye,
  Filter,
  X,
  Camera,
  Maximize2,
} from 'lucide-react';
import { GaleriItem } from '../../types';
import { INITIAL_GALERI } from '../../data/mockData';

export const GaleriKegiatan: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activePhoto, setActivePhoto] = useState<GaleriItem | null>(null);

  const categories = ['Semua Kategori', 'Workshop', 'Pertemuan Rutin', 'Kolaborasi', 'Praktik Baik'];

  const filteredItems = INITIAL_GALERI.filter((item) => {
    return selectedCategory === 'ALL' || selectedCategory === 'Semua Kategori' || item.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider">
          <ImageIcon className="w-4 h-4" />
          <span>Dokumentasi Visual</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Galeri Kegiatan KKG Gugus 01 Bluto
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Dokumentasi jejak langkah, kolaborasi pedagogik, serta momen kebersamaan guru-guru sekolah dasar di Kecamatan Bluto.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c === 'Semua Kategori' ? 'ALL' : c)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-medium transition-colors cursor-pointer ${
              (selectedCategory === 'ALL' && c === 'Semua Kategori') || selectedCategory === c
                ? 'bg-rose-800 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-slate-700 hover:bg-stone-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePhoto(item)}
            className="group bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[4/3] w-full bg-stone-100 overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="p-2.5 bg-white/90 text-slate-900 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                    <Maximize2 className="w-5 h-5 text-rose-800" />
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-semibold bg-rose-800/90 text-white px-2 py-0.5 rounded shadow">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-rose-700" />
                  <span>{item.date}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-rose-800 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {item.photographer && (
              <div className="px-5 pb-4 pt-0 text-[11px] text-slate-400 flex items-center gap-1.5">
                <Camera className="w-3 h-3 text-slate-400" />
                <span>Foto: {item.photographer}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 z-10 text-white bg-black/60 hover:bg-black p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] w-full bg-black">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 space-y-2 bg-white">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                  {activePhoto.category}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500">{activePhoto.date}</span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {activePhoto.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activePhoto.description}
              </p>

              {activePhoto.photographer && (
                <div className="pt-2 text-xs text-slate-400">
                  Dokumentasi resmi oleh: <strong>{activePhoto.photographer}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
