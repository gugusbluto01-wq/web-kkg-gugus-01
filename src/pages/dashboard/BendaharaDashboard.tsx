import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Printer,
  FileSpreadsheet,
  Receipt,
  X,
  Download,
} from 'lucide-react';
import { TransaksiKeuangan, UserProfile } from '../../types';
import { triggerDocumentDownload } from '../../utils/downloadHelper';

interface BendaharaProps {
  currentUser: UserProfile;
  transaksiList: TransaksiKeuangan[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onAddTransaksi: (trx: TransaksiKeuangan) => void;
  onNavigatePublic: (page: string) => void;
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
}

export const BendaharaDashboard: React.FC<BendaharaProps> = ({
  currentUser,
  transaksiList,
  activeTab = 'overview',
  onTabChange,
  onAddTransaksi,
  onNavigatePublic,
  onShowToast,
}) => {
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<TransaksiKeuangan | null>(null);
  const [trxType, setTrxType] = useState<'Pemasukan' | 'Pengeluaran'>('Pemasukan');
  const [category, setCategory] = useState<TransaksiKeuangan['category']>('Iuran Rutin Anggota');
  const [amount, setAmount] = useState<number>(600000);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [proofNumber, setProofNumber] = useState('');

  const masukList = transaksiList.filter((t) => t.type === 'Pemasukan');
  const keluarList = transaksiList.filter((t) => t.type === 'Pengeluaran');

  const totalMasuk = masukList.reduce((acc, t) => acc + t.amount, 0);
  const totalKeluar = keluarList.reduce((acc, t) => acc + t.amount, 0);
  const saldo = totalMasuk - totalKeluar;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const openModalWithType = (type: 'Pemasukan' | 'Pengeluaran') => {
    setTrxType(type);
    setCategory(type === 'Pemasukan' ? 'Iuran Rutin Anggota' : 'Konsumsi & Logistik Pertemuan');
    setIsInputModalOpen(true);
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
    setProofNumber('');
    onShowToast('Transaksi Dibukukan', `${formatRupiah(newTrx.amount)} berhasil dicatat.`, 'success');
  };

  const handleExportCSV = () => {
    const headers = ['No Transaksi', 'Tanggal', 'Jenis', 'Kategori', 'Uraian', 'No Bukti', 'Nominal'];
    const rows = transaksiList.map((t) => [
      `"${t.transactionNumber}"`,
      `"${t.date}"`,
      `"${t.type}"`,
      `"${t.category}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.proofNumber}"`,
      t.amount,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const a = document.createElement('a');
    a.href = encodeURI(csvContent);
    a.download = `Rekap_Kas_KKG_Bluto01_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onShowToast('Rekap Diekspor', 'File CSV buku kas berhasil diunduh.', 'success');
  };

  // Monthly grouping for rekap_bulanan
  const monthlySummary = transaksiList.reduce<Record<string, { masuk: number; keluar: number; count: number }>>(
    (acc, t) => {
      const monthKey = t.date.slice(0, 7);
      if (!acc[monthKey]) acc[monthKey] = { masuk: 0, keluar: 0, count: 0 };
      if (t.type === 'Pemasukan') acc[monthKey].masuk += t.amount;
      else acc[monthKey].keluar += t.amount;
      acc[monthKey].count += 1;
      return acc;
    },
    {}
  );

  const renderTransactionsTable = (items: TransaksiKeuangan[], emptyText: string) => (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-slate-600 font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Tanggal & No. Trx</th>
              <th className="py-2.5 px-3">Pos Kategori</th>
              <th className="py-2.5 px-3">Keterangan</th>
              <th className="py-2.5 px-3">No. Bukti</th>
              <th className="py-2.5 px-3 text-right">Nominal</th>
              <th className="py-2.5 px-3 text-center">Kuitansi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.length > 0 ? (
              items.map((t) => (
                <tr key={t.id} className="hover:bg-stone-50">
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
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => setSelectedReceipt(t)}
                      className="px-2 py-1 text-[11px] font-medium text-rose-800 hover:bg-rose-50 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Lihat</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {activeTab === 'overview' && (
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
            <button
              type="button"
              onClick={() => onTabChange?.('transaksi_in')}
              className="bg-white border border-stone-200 hover:border-emerald-300 rounded-2xl p-5 shadow-sm text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Penerimaan Kas Total</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-800 font-mono">
                {formatRupiah(totalMasuk)}
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">Lihat rincian pemasukan →</p>
            </button>

            <button
              type="button"
              onClick={() => onTabChange?.('transaksi_out')}
              className="bg-white border border-stone-200 hover:border-rose-300 rounded-2xl p-5 shadow-sm text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Pengeluaran Operasional</span>
                <TrendingDown className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-extrabold text-rose-800 font-mono">
                {formatRupiah(totalKeluar)}
              </div>
              <p className="text-[11px] text-rose-700 mt-1">Lihat rincian pengeluaran →</p>
            </button>

            <button
              type="button"
              onClick={() => onTabChange?.('rekap_bulanan')}
              className="bg-stone-900 text-white rounded-2xl p-5 shadow-md text-left hover:bg-stone-950 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-stone-300 mb-2">
                <span className="text-amber-300 font-semibold">Saldo Kas Saat Ini</span>
                <Wallet className="w-4 h-4 text-amber-300" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">
                {formatRupiah(saldo)}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Buka rekapitulasi & cetak →</p>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-600">
              <strong>Aksi Perbendaharaan:</strong> Catat transaksi baru atau cetak rekapitulasi buku kas.
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onNavigatePublic('keuangan')}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Laporan Publik</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Ekspor CSV</span>
              </button>

              <button
                onClick={() => openModalWithType('Pemasukan')}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Catat Transaksi Kas Baru</span>
              </button>
            </div>
          </div>

          {renderTransactionsTable(transaksiList.slice(0, 6), 'Belum ada transaksi kas tercatat.')}
        </div>
      )}

      {activeTab === 'transaksi_in' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-700" />
                <span>Penerimaan Kas & Iuran Anggota</span>
              </h1>
              <p className="text-xs text-slate-500">Total penerimaan tercatat: <strong className="font-mono text-emerald-800">{formatRupiah(totalMasuk)}</strong></p>
            </div>
            <button
              onClick={() => openModalWithType('Pemasukan')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Catat Penerimaan Kas</span>
            </button>
          </div>
          {renderTransactionsTable(masukList, 'Belum ada transaksi pemasukan.')}
        </div>
      )}

      {activeTab === 'transaksi_out' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingDown className="w-6 h-6 text-rose-700" />
                <span>Pengeluaran Operasional Kegiatan</span>
              </h1>
              <p className="text-xs text-slate-500">Total pengeluaran tercatat: <strong className="font-mono text-rose-800">{formatRupiah(totalKeluar)}</strong></p>
            </div>
            <button
              onClick={() => openModalWithType('Pengeluaran')}
              className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Catat Pengeluaran Kas</span>
            </button>
          </div>
          {renderTransactionsTable(keluarList, 'Belum ada transaksi pengeluaran.')}
        </div>
      )}

      {activeTab === 'rekap_bulanan' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-rose-800" />
                <span>Rekapitulasi Bulanan & Cetak Laporan</span>
              </h1>
              <p className="text-xs text-slate-500">Ringkasan arus kas per periode bulan untuk laporan pertanggungjawaban.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor CSV</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Laporan</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-slate-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Periode Bulan</th>
                  <th className="py-3 px-4 text-center">Jumlah Transaksi</th>
                  <th className="py-3 px-4 text-right">Pemasukan</th>
                  <th className="py-3 px-4 text-right">Pengeluaran</th>
                  <th className="py-3 px-4 text-right">Surplus / Defisit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {Object.entries(monthlySummary).map(([month, data]) => (
                  <tr key={month} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{month}</td>
                    <td className="py-3 px-4 text-center">{data.count} trx</td>
                    <td className="py-3 px-4 text-right text-emerald-700">{formatRupiah(data.masuk)}</td>
                    <td className="py-3 px-4 text-right text-rose-700">{formatRupiah(data.keluar)}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">{formatRupiah(data.masuk - data.keluar)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bukti_kuitansi' && (
        <div className="space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-6 h-6 text-rose-800" />
              <span>Arsip Bukti & Kuitansi Digital</span>
            </h1>
            <p className="text-xs text-slate-500">Klik kuitansi transaksi untuk melihat atau mengunduh salinan bukti pembukuan resmi.</p>
          </div>
          {renderTransactionsTable(transaksiList, 'Belum ada arsip kuitansi.')}
        </div>
      )}

      {/* Input Modal */}
      {isInputModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setIsInputModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              aria-label="Tutup modal transaksi"
            >
              <X className="w-5 h-5" />
            </button>

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
                    onChange={(e) => setTrxType(e.target.value as 'Pemasukan' | 'Pengeluaran')}
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
                  onChange={(e) => setCategory(e.target.value as TransaksiKeuangan['category'])}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                >
                  <option value="Iuran Rutin Anggota">Iuran Rutin Anggota</option>
                  <option value="Bantuan Operasional Gugus">Bantuan Operasional Gugus</option>
                  <option value="Konsumsi & Logistik Pertemuan">Konsumsi & Logistik Pertemuan</option>
                  <option value="Honorarium Narasumber">Honorarium Narasumber</option>
                  <option value="Penggandaan Modul & Materi">Penggandaan Modul & Materi</option>
                  <option value="Sewa Tempat & Perlengkapan">Sewa Tempat & Perlengkapan</option>
                  <option value="Peralatan Administrasi">Peralatan Administrasi</option>
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
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Kuitansi Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative space-y-4">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="border-b border-stone-200 pb-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-800">Kuitansi Digital KKG Gugus 01 Bluto</span>
              <h3 className="font-bold text-slate-900 text-lg mt-0.5">{selectedReceipt.proofNumber}</h3>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">No. Transaksi:</span>
                <span className="font-mono font-semibold">{selectedReceipt.transactionNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal:</span>
                <span>{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jenis & Kategori:</span>
                <span className="font-medium">{selectedReceipt.type} · {selectedReceipt.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nominal:</span>
                <span className="font-mono font-bold text-slate-900">{formatRupiah(selectedReceipt.amount)}</span>
              </div>
              <div className="pt-2 border-t border-stone-200">
                <span className="text-slate-500 block mb-1">Uraian:</span>
                <p className="text-slate-800">{selectedReceipt.description}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  triggerDocumentDownload(`Kuitansi_${selectedReceipt.proofNumber}.txt`, `Kuitansi ${selectedReceipt.proofNumber}`, {
                    'No Transaksi': selectedReceipt.transactionNumber,
                    Tanggal: selectedReceipt.date,
                    Jenis: selectedReceipt.type,
                    Kategori: selectedReceipt.category,
                    Nominal: formatRupiah(selectedReceipt.amount),
                    Uraian: selectedReceipt.description,
                    Bendahara: selectedReceipt.recordedBy,
                  });
                  onShowToast('Kuitansi Diunduh', selectedReceipt.proofNumber, 'success');
                }}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Kuitansi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
