import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Building2,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';

interface KontakProps {
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
}

export const Kontak: React.FC<KontakProps> = ({ onShowToast }) => {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      onShowToast('Validasi Gagal', 'Nama dan pesan wajib diisi.', 'error');
      return;
    }
    setName('');
    setSchool('');
    setEmail('');
    setSubject('');
    setMessage('');
    onShowToast('Pesan Terkirim', 'Terima kasih, sekretariat KKG akan menindaklanjuti pesan Anda (Demo).', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider">
          <Phone className="w-4 h-4" />
          <span>Layanan Informasi & Kontak</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Kontak & Sekretariat KKG Gugus 01 Bluto
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Hubungi pengurus atau kunjungi sekretariat kami untuk koordinasi akademik, persuratan, dan kerja sama pendidikan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-rose-700" />
              <span>Sekretariat Resmi KKG</span>
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
                <MapPin className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">Alamat Kantor:</strong>
                  <span>
                    Kompleks SDN Bluto I (Sekretariat KKG Gugus 01), Jl. Raya Sumenep-Pamekasan Km. 10, Kecamatan Bluto, Kabupaten Sumenep, Jawa Timur 69466
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
                <Mail className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">Surat Elektronik (Email):</strong>
                  <a href="mailto:gugusbluto01@gmail.com" className="font-mono text-rose-800 font-semibold hover:underline">
                    gugusbluto01@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
                <Phone className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">Layanan Informasi / WhatsApp:</strong>
                  <span className="font-mono text-slate-800">0812-3456-7890 (Contoh/Demo)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
                <Clock className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">Waktu Pelayanan Administrasi:</strong>
                  <span>Senin - Kamis: 08.00 - 13.00 WIB</span> <br />
                  <span>Jumat (Jadwal KKG): 08.00 - 11.30 WIB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Note Box */}
          <div className="bg-rose-50/70 border border-rose-200/60 rounded-2xl p-5 text-xs text-rose-900 space-y-2">
            <h3 className="font-bold text-sm">Akses Transportasi</h3>
            <p className="leading-relaxed">
              Sekretariat KKG terletak di sisi jalur utama lintas kabupaten Sumenep - Pamekasan, berdekatan dengan Kantor Korwil Bidang Pendidikan Kecamatan Bluto dan Puskesmas Bluto.
            </p>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-rose-700" />
            <span>Kirim Pesan ke Pengurus KKG</span>
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Gunakan formulir ini untuk mengajukan pertanyaan seputar administrasi, perangkat ajar, atau jadwal pertemuan.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso, S.Pd."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Asal Sekolah / Instansi</label>
                <input
                  type="text"
                  placeholder="Contoh: SDN Aengbaja Raja I"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Alamat Email *</label>
                <input
                  type="email"
                  required
                  placeholder="nama@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Perihal Komunikasi</label>
                <input
                  type="text"
                  placeholder="Contoh: Konfirmasi Dispensasi Tugas Mengajar"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Isi Pesan / Pertanyaan *</label>
              <textarea
                rows={5}
                required
                placeholder="Tuliskan pesan lengkap Anda di sini..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-rose-800 hover:bg-rose-900 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesan Sekarang</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
