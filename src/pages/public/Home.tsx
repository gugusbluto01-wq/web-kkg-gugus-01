import React, { useState } from 'react';
import {
  Users,
  School,
  Calendar,
  FileText,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Sparkles,
  Download,
  Clock,
  MapPin,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import {
  HERO_IMAGE,
  KETUA_PORTRAIT,
  SEKOLAH_GUGUS,
} from '../../data/mockData';
import {
  BeritaPengumuman,
  DokumenAdministrasi,
  Kegiatan,
  PerangkatAjar,
} from '../../types';

interface HomeProps {
  onNavigate: (page: string) => void;
  kegiatanList: Kegiatan[];
  perangkatList: PerangkatAjar[];
  beritaList: BeritaPengumuman[];
  onOpenLogin: () => void;
  onPreviewPerangkat: (doc: PerangkatAjar) => void;
  onOpenBerita: (item: BeritaPengumuman) => void;
}

export const Home: React.FC<HomeProps> = ({
  onNavigate,
  kegiatanList,
  perangkatList,
  beritaList,
  onOpenLogin,
  onPreviewPerangkat,
  onOpenBerita,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('November 2026');

  const upcomingKegiatan = kegiatanList.slice(0, 3);
  const latestBerita = beritaList.slice(0, 3);
  const featuredDocs = perangkatList.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-100/90 via-stone-50 to-white pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-rose-800 uppercase">
                <span className="w-2 h-2 rounded-full bg-rose-700"></span>
                <span>Pusat Informasi & Kolaborasi Guru SD Bluto</span>
                <span className="text-stone-300">|</span>
                <span className="text-stone-500 font-mono">Gugus 01 Sumenep</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
                PORTAL DIGITAL KKG GUGUS 01 <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-800 via-rose-700 to-amber-700">
                  KECAMATAN BLUTO
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                <span className="font-semibold text-rose-900 italic">
                  "Bersatu, Berbagi, Berinovasi untuk Pendidikan Berkualitas."
                </span>{' '}
                Wadah resmi pengembangan kompetensi, administrasi digital, dan pertukaran perangkat ajar Kurikulum Merdeka bagi seluruh pendidik sekolah dasar se-Gugus 01 Kecamatan Bluto, Kabupaten Sumenep.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('perangkat')}
                  className="px-6 py-3.5 bg-rose-800 hover:bg-rose-900 text-white font-semibold text-sm rounded-xl shadow-md shadow-rose-900/10 hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Jelajahi Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onOpenLogin}
                  className="px-6 py-3.5 bg-white hover:bg-stone-100 text-slate-800 font-semibold text-sm rounded-xl border border-stone-300 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Masuk Anggota</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium font-mono">
                    Demo
                  </span>
                </button>
              </div>

              {/* Sub-text trust indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-stone-200/80">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>8 Sekolah Dasar Anggota</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kurikulum Merdeka 2026/2027</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kecamatan Bluto, Sumenep</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-2xl bg-white group">
                <div className="aspect-[4/3] w-full relative">
                  <img
                    src={HERO_IMAGE}
                    alt="Pendidik KKG Gugus 01 Kecamatan Bluto sedang berkolaborasi"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-mono text-amber-300 mb-1">DOKUMENTASI KKG</p>
                    <p className="text-sm font-semibold leading-snug">
                      Kolaborasi Peningkatan Kompetensi & Modul Ajar Kreatif Guru SD Bluto
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTIK KKG SECTION (Labeled DEMO DATA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Statistik KKG Gugus 01 Bluto</h2>
              <p className="text-xs text-slate-500">Cakupan pendidik, lembaga binaan, program, dan koleksi ajar</p>
            </div>
            <span className="text-[11px] font-mono font-medium px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
              DATA CONTOH / DEMO
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-4 bg-stone-50/70 rounded-xl border border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">48</div>
                  <div className="text-xs font-medium text-slate-600">Guru Anggota Aktif</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50/70 rounded-xl border border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">8</div>
                  <div className="text-xs font-medium text-slate-600">SD Inti & Imbas</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50/70 rounded-xl border border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">16</div>
                  <div className="text-xs font-medium text-slate-600">Kegiatan Terjadwal</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50/70 rounded-xl border border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">184+</div>
                  <div className="text-xs font-medium text-slate-600">Dokumen Perangkat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAMBUTAN KETUA KKG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-4 border-rose-100 shadow-md mb-4 bg-stone-100">
                <img
                  src={KETUA_PORTRAIT}
                  alt="Drs. H. Ahmad Fauzi, M.Pd. - Ketua KKG Gugus 01 Bluto"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Drs. H. Ahmad Fauzi, M.Pd.</h3>
              <p className="text-xs text-rose-800 font-medium">Ketua KKG Gugus 01 Kecamatan Bluto</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">NIP. 19720512 199603 1 004 (Placeholder)</p>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="inline-block text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-3 py-1 rounded-md">
                Sambutan Ketua KKG
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Meneguhkan Komitmen Guru Kreatif dan Berdaya di Tanah Songennep
              </h2>
              <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  <em>Assalamu’alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera,</em>
                </p>
                <p>
                  Puji syukur ke hadirat Allah SWT, berkat rahmat dan karunia-Nya Portal Digital KKG Gugus 01 Kecamatan Bluto ini hadir sebagai ikhtiar bersama dalam menyongsong transformasi pendidikan abad ke-21. Di tengah dinamika implementasi Kurikulum Merdeka, guru dituntut tidak hanya sebagai pengajar, melainkan sebagai fasilitator yang adaptif, reflektif, dan inspiratif bagi peserta didik.
                </p>
                <p>
                  Melalui portal ini, kami ingin memastikan bahwa jarak antar-sekolah dari pesisir Lobuk hingga pedalaman Aengbaja tidak lagi menjadi sekat. Kita dapat saling bertukar modul ajar terbaik, mendiskusikan problematika kelas, menyalurkan aspirasi, hingga mengelola administrasi secara terbuka dan akuntabel.
                </p>
                <p className="font-medium text-slate-800">
                  Mari kita perkuat silaturahmi intelektual demi kemajuan generasi tunas bangsa di Kecamatan Bluto.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('profil')}
                  className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1 group"
                >
                  <span>Baca Profil & Program Kerja KKG Selengkapnya</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFORMASI TERBARU (PENGUMUMAN & BERITA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="text-xs font-semibold text-rose-800 uppercase tracking-wide">Informasi Terkini</div>
            <h2 className="text-2xl font-bold text-slate-900">Berita & Pengumuman Resmi</h2>
          </div>
          <button
            onClick={() => onNavigate('berita')}
            className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Lihat Semua Berita & Edaran</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestBerita.map((item) => (
            <article
              key={item.id}
              onClick={() => onOpenBerita(item)}
              className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer group"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-stone-100 relative">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm ${
                    item.type === 'Pengumuman' ? 'bg-amber-500 text-white' : 'bg-rose-800 text-white'
                  }`}>
                    {item.type}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{item.publishedAt}</span>
                    <span>·</span>
                    <span>{item.author}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-rose-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-2 text-xs font-semibold text-rose-800 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* KALENDER & KEGIATAN KKG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-100">
            <div>
              <div className="text-xs font-semibold text-rose-800 uppercase tracking-wide">Agenda Organisasi</div>
              <h2 className="text-2xl font-bold text-slate-900">Program & Kalender Kegiatan KKG</h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Periode:</span>
              <span className="text-xs font-semibold font-mono bg-stone-100 px-3 py-1 rounded-lg text-slate-800">
                {selectedMonth}
              </span>
              <button
                onClick={() => onNavigate('kegiatan')}
                className="text-xs font-semibold text-rose-800 hover:text-rose-950 px-3 py-1 rounded-lg hover:bg-rose-50"
              >
                Lihat Semua Jadwal →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingKegiatan.map((keg) => (
              <div
                key={keg.id}
                className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-rose-800 bg-rose-100/70 px-2.5 py-0.5 rounded">
                      {keg.type}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      keg.status === 'Akan Datang'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}>
                      {keg.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {keg.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                      <span>{keg.date} ({keg.time})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                      <span className="truncate">{keg.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {keg.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Peserta: <strong className="text-slate-800 font-mono">{keg.enrolledCount}</strong>/{keg.quota}
                  </span>
                  <button
                    onClick={() => onNavigate('kegiatan')}
                    className="font-semibold text-rose-800 hover:text-rose-950"
                  >
                    Detail Agenda →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANK PERANGKAT AJAR TERBARU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="text-xs font-semibold text-rose-800 uppercase tracking-wide">Perpustakaan Digital</div>
            <h2 className="text-2xl font-bold text-slate-900">Perangkat Ajar Kurikulum Merdeka Terbaru</h2>
            <p className="text-xs text-slate-500">Modul ajar, ATP, CP, dan LKPD yang diunggah oleh sesama rekan guru Gugus 01</p>
          </div>
          <button
            onClick={() => onNavigate('perangkat')}
            className="text-xs font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Buka Bank Perangkat Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-800 text-[11px]">{doc.category}</span>
                  <span className="font-mono text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                    {doc.fileFormat}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                  {doc.title}
                </h3>

                <p className="text-[11px] text-slate-500">
                  {doc.subject} · {doc.gradeLevel}
                </p>

                <p className="text-[11px] text-slate-400">
                  Oleh: {doc.uploaderName} ({doc.uploaderSchool})
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  {doc.downloadCount}x diunduh
                </span>
                <button
                  onClick={() => onPreviewPerangkat(doc)}
                  className="px-2.5 py-1 text-xs font-medium text-rose-800 hover:bg-rose-50 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Unduh</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEKOLAH ANGGOTA GUGUS 01 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Wilayah Binaan Gugus 01 Kecamatan Bluto
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-white">
              8 Sekolah Dasar Negeri Anggota Gugus
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2">
              Jaringan kemitraan pendidikan dasar di wilayah pesisir dan daratan Kecamatan Bluto, Kabupaten Sumenep.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SEKOLAH_GUGUS.map((sch) => (
              <div
                key={sch.id}
                className="p-4 rounded-xl bg-stone-800/80 border border-stone-700 hover:border-rose-400/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <School className="w-4 h-4 text-rose-400" />
                    <h3 className="font-bold text-white text-sm">{sch.name}</h3>
                  </div>
                  <p className="text-xs text-stone-300">{sch.address}</p>
                  <p className="text-[11px] text-stone-400 mt-1">Kepsek: {sch.headmaster}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-700/60 text-[10px] font-mono text-amber-300">
                  NPSN: {sch.npsn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
