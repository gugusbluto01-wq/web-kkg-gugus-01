import React from 'react';
import { Mail, MapPin, Phone, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800 text-sm">
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-700 to-rose-900 text-amber-200 font-serif font-bold text-lg flex items-center justify-center border border-rose-500/30">
                K1
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">KKG GUGUS 01 BLUTO</h3>
                <p className="text-xs text-rose-300">Kecamatan Bluto · Kabupaten Sumenep</p>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              "Bersatu, Berbagi, Berinovasi untuk Pendidikan Berkualitas." Wadah resmi kolaborasi dan peningkatan kompetensi guru sekolah dasar di Gugus 01 Kecamatan Bluto, Sumenep, Jawa Timur.
            </p>
            <div className="text-xs text-amber-400/90 font-mono">
              Status Portal: DEMO INTERAKTIF (Ready for Supabase)
            </div>
          </div>

          {/* Col 2: Navigation Links 1 */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 text-rose-300">
              Menu Utama & Akademik
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Beranda Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profil')} className="hover:text-white transition-colors">
                  Profil & Sejarah KKG
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('anggota')} className="hover:text-white transition-colors">
                  Direktori Data Anggota
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('perangkat')} className="hover:text-white transition-colors">
                  Bank Perangkat Ajar (Modul/RPP)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('forum')} className="hover:text-white transition-colors">
                  Forum Diskusi Guru
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kegiatan')} className="hover:text-white transition-colors">
                  Kalender & Program Kegiatan
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation Links 2 */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 text-rose-300">
              Administrasi & Komunikasi
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('berita')} className="hover:text-white transition-colors">
                  Berita & Pengumuman
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('administrasi')} className="hover:text-white transition-colors">
                  Administrasi & Arsip Digital
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('keuangan')} className="hover:text-white transition-colors">
                  Laporan Keuangan Transparan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('aspirasi')} className="hover:text-white transition-colors">
                  Aspirasi & Kotak Saran
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('galeri')} className="hover:text-white transition-colors">
                  Galeri Dokumentasi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kontak')} className="hover:text-white transition-colors">
                  Kontak & Lokasi Gugus
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 text-rose-300">
              Sekretariat KKG
            </h4>
            <div className="flex items-start gap-3 text-xs text-stone-400">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                Sekretariat KKG Gugus 01 (Kompleks SDN Bluto I), Jl. Raya Sumenep-Pamekasan Km. 10, Kecamatan Bluto, Kabupaten Sumenep, Jawa Timur 69466
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <Mail className="w-4 h-4 text-rose-400 shrink-0" />
              <a href="mailto:gugusbluto01@gmail.com" className="hover:text-white transition-colors font-mono">
                gugusbluto01@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <Phone className="w-4 h-4 text-rose-400 shrink-0" />
              <span>0812-3456-7890 (Layanan Sekretariat KKG)</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 KKG Gugus 01 Kecamatan Bluto Kabupaten Sumenep. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Kurikulum Merdeka</span>
            <span>·</span>
            <span>Kecamatan Bluto</span>
            <span>·</span>
            <span className="text-rose-400 font-medium">Kabupaten Sumenep</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
