import React from 'react';
import {
  Award,
  CheckCircle2,
  Compass,
  FileCheck,
  GraduationCap,
  Layers,
  MapPin,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react';
import { STRUKTUR_ORGANISASI } from '../../data/mockData';

export const ProfilKKG: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="border-b border-stone-200 pb-8 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Profil Organisasi Profesi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Profil KKG Gugus 01 Kecamatan Bluto
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Mengenal lebih dekat Kelompok Kerja Guru (KKG) Gugus 01 Kecamatan Bluto, Kabupaten Sumenep sebagai wadah pembinaan profesionalisme pendidik sekolah dasar.
        </p>
      </div>

      {/* Identitas Organisasi Box */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-rose-700" />
          <span>Identitas & Legalitas Organisasi</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="space-y-1 p-3.5 bg-stone-50 rounded-xl">
            <span className="text-slate-500 text-xs">Nama Organisasi</span>
            <p className="font-semibold text-slate-900">KKG Gugus 01 Kecamatan Bluto</p>
          </div>

          <div className="space-y-1 p-3.5 bg-stone-50 rounded-xl">
            <span className="text-slate-500 text-xs">Wilayah Kerja</span>
            <p className="font-semibold text-slate-900">Kecamatan Bluto, Kabupaten Sumenep, Jawa Timur</p>
          </div>

          <div className="space-y-1 p-3.5 bg-stone-50 rounded-xl">
            <span className="text-slate-500 text-xs">Dasar Hukum & SK</span>
            <p className="font-semibold text-slate-900 font-mono">SK Korwil Bidik Kec. Bluto No. 421/04/2025</p>
          </div>

          <div className="space-y-1 p-3.5 bg-stone-50 rounded-xl">
            <span className="text-slate-500 text-xs">Alamat Sekretariat</span>
            <p className="font-semibold text-slate-900">Kompleks SDN Bluto I, Jl. Raya Sumenep-Pamekasan Km. 10</p>
          </div>

          <div className="space-y-1 p-3.5 bg-stone-50 rounded-xl">
            <span className="text-slate-500 text-xs">Jumlah Sekolah Binaan</span>
            <p className="font-semibold text-slate-900">8 Sekolah Dasar Negeri</p>
          </div>

          <div className="space-y-1 p-3.5 bg-stone-50 rounded-xl">
            <span className="text-slate-500 text-xs">Email Korespondensi</span>
            <p className="font-semibold text-rose-800 font-mono">gugusbluto01@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Sejarah KKG */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Compass className="w-5 h-5 text-rose-700" />
          <span>Sejarah Singkat Pembentukan</span>
        </h2>
        <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
          <p>
            Kelompok Kerja Guru (KKG) Gugus 01 Kecamatan Bluto didirikan sebagai respon atas kebutuhan wadah koordinasi dan peningkatan mutu pembelajaran di antara guru-guru sekolah dasar di wilayah timur dan pesisir Kecamatan Bluto. Sejak awal pembentukannya, gugus ini menaungi sekolah-sekolah di sekitar poros jalan raya Sumenep-Pamekasan dan kawasan pesisir Desa Lobuk serta Desa Aengbaja Raja.
          </p>
          <p>
            Dengan semangat gotong royong khas Madura (<em>abantal omba' asapo' angen</em> dan tekad kebersamaan <em>tanean lanjhang</em>), para pendidik sepakat menjadikan KKG bukan sekadar seremonial bulanan, melainkan laboratorium pedagogik tempat guru-guru saling mengasah keilmuan, membedah regulasi kurikulum terbaru, serta mencari solusi atas tantangan literasi numerasi di kelas.
          </p>
          <p>
            Memasuki era Kurikulum Merdeka dan digitalisasi pendidikan, KKG Gugus 01 Bluto bertransformasi dengan menghadirkan Portal Digital ini guna menjamin transparansi, kemudahan akses modul ajar, dan efisiensi komunikasi antar-pendidik.
          </p>
        </div>
      </div>

      {/* Visi, Misi & Tujuan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Visi Organisasi</h2>
          <blockquote className="p-4 bg-rose-50/60 rounded-xl text-rose-950 font-medium text-sm sm:text-base italic leading-relaxed border border-rose-200/50">
            "Terwujudnya Komunitas Pendidik KKG Gugus 01 Bluto yang Profesional, Kolaboratif, Berkarakter Luhur, dan Adaptif terhadap Teknologi demi Terciptanya Generasi Berprestasi."
          </blockquote>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Misi Organisasi</h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Memfasilitasi peningkatan kompetensi pedagogik, profesional, kepribadian, dan sosial guru sekolah dasar.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Mengembangkan bank perangkat ajar Kurikulum Merdeka yang kontekstual dengan kearifan lokal Sumenep.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Mendorong budaya berbagi praktik baik (<em>best practice</em>) dan pemanfaatan media digital dalam proses belajar mengajar.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Mewujudkan tata kelola organisasi gugus yang akuntabel, transparan, dan partisipatif.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Struktur Organisasi KKG */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-700" />
            <span>Struktur Kepengurusan KKG Periode 2025-2027</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Berdasarkan Surat Keputusan Pengawas Pembina dan Korwil Bidik Kecamatan Bluto
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {STRUKTUR_ORGANISASI.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                item.level === 1
                  ? 'bg-amber-50/50 border-amber-200'
                  : item.level === 2
                  ? 'bg-rose-50/50 border-rose-200'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wide">
                {item.position}
              </span>
              <h3 className="font-bold text-slate-900 text-sm mt-1">{item.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{item.instance}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tugas, Fungsi, & Program Kerja */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-rose-700" />
            <span>Tugas dan Fungsi Pokok</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="p-3 bg-stone-50 rounded-xl">
              <strong className="text-slate-900 block mb-1">1. Wahana Peningkatan Kompetensi</strong>
              Menyelenggarakan workshop, pelatihan berkala, dan bedah modul kurikulum demi menunjang sertifikasi dan e-Kinerja PMM.
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <strong className="text-slate-900 block mb-1">2. Forum Pemecahan Masalah Pembelajaran</strong>
              Tempat berdiskusi mencari jalan keluar atas kendala literasi, numerasi, dan pengelolaan karakter peserta didik di kelas.
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <strong className="text-slate-900 block mb-1">3. Pusat Diseminasi Informasi Resmi</strong>
              Menjembatani kebijakan Dinas Pendidikan Kabupaten Sumenep dan Balai Guru Penggerak kepada guru di tingkat sekolah.
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-rose-700" />
            <span>Program Kerja Unggulan 2026/2027</span>
          </h2>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <span><strong>Pertemuan Rutin Bulanan:</strong> Diskusi tematik bergilir antar-sekolah anggota setiap hari Jumat pekan ke-3.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <span><strong>Bedah Modul Ajar Kontekstual Bluto:</strong> Produksi perangkat ajar tematik pesisir, perikanan, dan kerajinan lokal.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <span><strong>Klinik PMM & e-Kinerja:</strong> Pendampingan teknis pengelolaan sasaran kinerja pegawai bagi guru ASN dan PPPK.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <span><strong>Pameran Karya Inovasi Siswa & Guru:</strong> Gelar karya P5 tahunan bersama 8 sekolah dasar se-Gugus 01 Bluto.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
