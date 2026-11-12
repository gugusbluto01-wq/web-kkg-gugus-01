import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Printer,
  FileSpreadsheet,
  Receipt,
  ArrowRight,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { TransaksiKeuangan, UserProfile } from '../../types';

interface BendaharaProps {
  currentUser: UserProfile;
  transaksiList: TransaksiKeuangan[];
  onAddTransaksi: (trx: TransaksiKeuangan) => void;
  onNavigatePublic: (page: string) => void;
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
}

export const BendaharaDashboard: React.FC<BendaharaProps> = ({
  currentUser,
  transaksiList,
  onAddTransaksi,
  onNavigatePublic,
  onShowToast,
}) => {
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [trxType, setTrxType] = useState<'Pemasukan' | 'Pengeluaran'>('Pemasukan');
  const [category, setCategory] = useState<TransaksiKeuangan['category']>('Iuran Rutin Anggota');
  const [amount, setAmount] = useState<number>(600000);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [proofNumber, setProofNumber] = useState('');

  const totalMasuk = transaksiList
    .filter((t) => t.type === 'Pemasukan')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalKeluar = transaksiList
    .filter((t) => t.type === 'Pengeluaran')
    .reduce((acc, t) => acc + t.amount, 0);

  const saldo = totalMasuk - totalKeluar;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      onShowToast('Nominal Tidak Valid', 'Masukkan nominal lebih dari 0.', 'error');
      return;
    }
    const newTrx: TransaksiKeuangan = {
      id: `trx-${Date.now()}`,
      transactionNumber: `KAS-2026/11/${Math.floor(100 + Math.random() * 900)}`,
      type: trxType,
      category,
      amount: Number(amount),
      date,
      description: description || `Pencatatan kas oleh Bendahara ${currentUser.name}`,
      proofNumber: proofNumber || `BKK-${Math.floor(10 + Math.random() * 90)}/26`,
      recordedBy: currentUser.name,
    };
    onAddTransaksi(newTrx);
    setIsInputModalOpen(false);
    setDescription('');
    onShowToast('Transaksi Dibukukan', `${formatRupiah(newTrx.amount)} berhasil dicatat (Demo).`, 'success');
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
            Tata Kelola Perbendaharaan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Bendahara KKG Gugus 01
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Kelola buku kas operasional, penerimaan iuran dari 8 sekolah dasar anggota, dan pencatatan pertanggungjawaban kegiatan secara transparan.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Penerimaan Kas Total</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-800 font-mono">
            {formatRupiah(totalMasuk)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Iuran & dana bantuan gugus (DEMO)</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Pengeluaran Operasional</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-800 font-mono">
            {formatRupiah(totalKeluar)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Konsumsi, narasumber, ATK (DEMO)</p>
        </div>

        <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-stone-300 mb-2">
            <span className="text-amber-300 font-semibold">Saldo Kas Saat Ini</span>
            <Wallet className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {formatRupiah(saldo)}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Saldo riil di rekening gugus (DEMO)</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
        <div className="text-xs text-slate-600">
          <strong>Aksi Perbendaharaan:</strong> Catat transaksi baru atau cetak rekapitulasi buku kas.
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigatePublic('keuangan')}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Ekspor Lengkap</span>
          </button>

          <button
            onClick={() => setIsInputModalOpen(true)}
            className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Catat Transaksi Kas Baru</span>
          </button>
        </div>
      </div>

      {/* Recent Ledger Table */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h2 className="text-base font-bold text-slate-900">Buku Kas Terbaru KKG</h2>
          <span className="text-xs text-slate-400 font-mono">5 Transaksi Terakhir</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-slate-600 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Tanggal & No. Trx</th>
                <th className="py-2.5 px-3">Pos Kategori</th>
                <th className="py-2.5 px-3">Keterangan</th>
                <th className="py-2.5 px-3">No. Bukti</th>
                <th className="py-2.5 px-3 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono">
              {transaksiList.slice(0, 5).map((t) => (
                <tr key={t.id} className="hover:bg-stone-50 font-sans">
                  <td className="py-2.5 px-3 font-mono">
                    <span className="font-semibold text-slate-900">{t.transactionNumber}</span>
                    <span className="text-slate-400 block text-[10px]">{t.date}</span>
                  </td>
                  <td className="py-2.5 px-3 text-rose-900 font-medium">{t.category}</td>
                  <td className="py-2.5 px-3 text-slate-700">{t.description}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{t.proofNumber}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">
                    <span className={t.type === 'Pemasukan' ? 'text-emerald-700' : 'text-rose-700'}>
                      {t.type === 'Pemasukan' ? '+' : '-'} {formatRupiah(t.amount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Input Modal */}
      {isInputModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-rose-700" />
              <span>Input Buku Kas Bendahara</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pencatatan kas resmi KKG Gugus 01 Kecamatan Bluto.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Jenis Transaksi</label>
                  <select
                    value={trxType}
                    onChange={(e) => setTrxType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    <option value="Pemasukan">Pemasukan</option>
                    <option value="Pengeluaran">Pengeluaran</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Pos Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                >
                  <option value="Iuran Rutin Anggota">Iuran Rutin Anggota</option>
                  <option value="Bantuan Operasional Gugus">Bantuan Operasional Gugus</option>
                  <option value="Konsumsi & Logistik Pertemuan">Konsumsi & Logistik Pertemuan</option>
                  <option value="Honorarium Narasumber">Honorarium Narasumber</option>
                  <option value="Penggandaan Modul & Materi">Penggandaan Modul & Materi</option>
                  <option value="Sewa Tempat & Perlengkapan">Sewa Tempat & Perlengkapan</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">No. Bukti / Kuitansi</label>
                  <input
                    type="text"
                    placeholder="BKK-090/26"
                    value={proofNumber}
                    onChange={(e) => setProofNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Uraian Transaksi</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Keterangan pengeluaran atau penerimaan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsInputModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm"
                >
                  Simpan Transaksi (Demo)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
