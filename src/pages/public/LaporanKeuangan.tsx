import React, { useState, useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  FileSpreadsheet,
  Printer,
  PlusCircle,
  Receipt,
  Search,
  Filter,
  X,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { TransaksiKeuangan, UserProfile, UserRole } from '../../types';

interface KeuanganProps {
  transaksiList: TransaksiKeuangan[];
  currentUser: UserProfile;
  currentRole: UserRole;
  onAddTransaksi: (trx: TransaksiKeuangan) => void;
  onShowToast: (message: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
}

export const LaporanKeuanganPage: React.FC<KeuanganProps> = ({
  transaksiList,
  currentUser,
  currentRole,
  onAddTransaksi,
  onShowToast,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'Pemasukan' | 'Pengeluaran'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<TransaksiKeuangan | null>(null);

  // Form State
  const [trxType, setTrxType] = useState<'Pemasukan' | 'Pengeluaran'>('Pemasukan');
  const [category, setCategory] = useState<TransaksiKeuangan['category']>('Iuran Rutin Anggota');
  const [amount, setAmount] = useState<number>(500000);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [proofNumber, setProofNumber] = useState('');

  // Financial Calculations
  const { totalPemasukan, totalPengeluaran, saldoKas } = useMemo(() => {
    let masuk = 0;
    let keluar = 0;
    transaksiList.forEach((t) => {
      if (t.type === 'Pemasukan') masuk += t.amount;
      else keluar += t.amount;
    });
    return {
      totalPemasukan: masuk,
      totalPengeluaran: keluar,
      saldoKas: masuk - keluar,
    };
  }, [transaksiList]);

  const filteredTransaksi = useMemo(() => {
    return transaksiList.filter((t) => {
      const matchType = filterType === 'ALL' || t.type === filterType;
      const matchSearch =
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchSearch;
    });
  }, [transaksiList, filterType, searchTerm]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['No Transaksi', 'Tipe', 'Kategori', 'Nominal', 'Tanggal', 'Keterangan', 'No Bukti', 'Pencatat'];
    const rows = filteredTransaksi.map((t) => [
      `"${t.transactionNumber}"`,
      `"${t.type}"`,
      `"${t.category}"`,
      t.amount,
      `"${t.date}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.proofNumber}"`,
      `"${t.recordedBy}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Keuangan_KKG_Gugus01_Bluto_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Laporan Keuangan Diekspor', 'File spreadsheet CSV kas telah diunduh.', 'success');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      onShowToast('Validasi Gagal', 'Nominal transaksi harus lebih dari 0.', 'error');
      return;
    }
    const newTrx: TransaksiKeuangan = {
      id: `trx-${Date.now()}`,
      transactionNumber: `KAS-${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${Math.floor(100 + Math.random() * 900)}`,
      type: trxType,
      category,
      amount: Number(amount),
      date,
      description: description || `Transaksi ${trxType.toLowerCase()} kas KKG Gugus 01 (DEMO)`,
      proofNumber: proofNumber || `BKK-${Math.floor(10 + Math.random() * 90)}/26`,
      recordedBy: currentUser.name,
    };
    onAddTransaksi(newTrx);
    setIsAddModalOpen(false);
    setDescription('');
    setProofNumber('');
    onShowToast('Transaksi Berhasil Dicatat', `${formatRupiah(newTrx.amount)} telah dibukukan (Demo).`, 'success');
  };

  const canManageFinances = ['super_admin', 'bendahara'].includes(currentRole);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider">
            <Wallet className="w-4 h-4" />
            <span>Akuntabilitas & Transparansi</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Laporan Keuangan KKG Gugus 01 Bluto
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pencatatan kas pemasukan iuran, bantuan operasional, dan pengeluaran kegiatan berkala
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Rekap</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>

          {canManageFinances && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-800 rounded-xl hover:bg-rose-900 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Input Transaksi Kas</span>
            </button>
          )}
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Pemasukan */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total Penerimaan Kas</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-800 font-mono tabular-nums">
            {formatRupiah(totalPemasukan)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Akumulasi iuran & bantuan gugus (DEMO)</p>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total Pengeluaran Kas</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-rose-800 font-mono tabular-nums">
            {formatRupiah(totalPengeluaran)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Konsumsi, narasumber, fotokopi (DEMO)</p>
        </div>

        {/* Saldo Kas Aktif */}
        <div className="bg-stone-900 text-white border border-stone-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-stone-300 mb-2">
            <span className="text-amber-300 font-medium">Saldo Kas Aktif KKG</span>
            <span className="p-1.5 rounded-lg bg-stone-800 text-amber-300">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {formatRupiah(saldoKas)}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Posisi buku kas per hari ini (DEMO)</p>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5 no-print">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold">Catatan Transparansi Keuangan (DEMO):</strong>
          Semua anggota dapat memeriksa rekapitulasi penggunaan dana operasional KKG. Pengelolaan tambah/edit data transaksi dibatasi khusus untuk <strong>Bendahara</strong> dan <strong>Super Admin</strong>.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 no-print">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nomor bukti, uraian transaksi, atau pos pengeluaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-rose-700 bg-stone-50/50"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-1.5 justify-end">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                filterType === 'ALL' ? 'bg-rose-800 text-white' : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
              }`}
            >
              Semua Arus Kas
            </button>
            <button
              onClick={() => setFilterType('Pemasukan')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                filterType === 'Pemasukan' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
              }`}
            >
              Penerimaan
            </button>
            <button
              onClick={() => setFilterType('Pengeluaran')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                filterType === 'Pengeluaran' ? 'bg-rose-800 text-white' : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
              }`}
            >
              Pengeluaran
            </button>
          </div>
        </div>
      </div>

      {/* Table of Ledger Transactions */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">No. Transaksi & Tgl</th>
                <th className="py-3 px-4">Kategori Pos Anggaran</th>
                <th className="py-3 px-4">Uraian / Keterangan</th>
                <th className="py-3 px-4">No. Bukti / Kuitansi</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                <th className="py-3 px-4 text-center no-print">Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono">
              {filteredTransaksi.length > 0 ? (
                filteredTransaksi.map((trx) => (
                  <tr key={trx.id} className="hover:bg-rose-50/20 transition-colors font-sans">
                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-slate-900 text-xs">
                        {trx.transactionNumber}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-rose-700" />
                        <span>{trx.date}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                        {trx.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-800">
                      <p className="leading-snug text-xs sm:text-sm">{trx.description}</p>
                      <span className="text-[10px] text-slate-400">Pencatat: {trx.recordedBy}</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-slate-600">
                      {trx.proofNumber}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                      <span className={trx.type === 'Pemasukan' ? 'text-emerald-700' : 'text-rose-700'}>
                        {trx.type === 'Pemasukan' ? '+' : '-'} {formatRupiah(trx.amount)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center no-print">
                      <button
                        onClick={() => setSelectedReceipt(trx)}
                        className="p-1.5 text-slate-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Tampilkan Kuitansi Digital"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                    Tidak ada catatan transaksi dengan kata kunci "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Digital Receipt */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 space-y-4">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-3 border-b border-stone-200">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-rose-800">
                Tanda Bukti Kuitansi Kas KKG
              </span>
              <h3 className="font-bold text-slate-900 text-lg">KKG GUGUS 01 KECAMATAN BLUTO</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">No. Bukti: {selectedReceipt.proofNumber}</p>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-slate-500">Nomor Registrasi:</span>
                <span className="font-mono font-medium text-slate-800">{selectedReceipt.transactionNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-slate-500">Tanggal Transaksi:</span>
                <span className="font-medium text-slate-800">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-slate-500">Tipe / Kategori:</span>
                <span className="font-semibold text-rose-800">{selectedReceipt.type} ({selectedReceipt.category})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-slate-500">Untuk Keperluan:</span>
                <span className="text-slate-800 max-w-[220px] text-right">{selectedReceipt.description}</span>
              </div>
              <div className="flex justify-between py-2 bg-stone-50 rounded-xl px-3 font-mono font-bold text-base">
                <span>Jumlah Nominal:</span>
                <span className={selectedReceipt.type === 'Pemasukan' ? 'text-emerald-700' : 'text-rose-700'}>
                  {formatRupiah(selectedReceipt.amount)}
                </span>
              </div>
            </div>

            <div className="pt-2 text-center text-xs text-slate-400">
              Dibukukan oleh: <strong>{selectedReceipt.recordedBy}</strong>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white rounded-xl text-xs font-semibold"
              >
                Tutup Kuitansi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Input Transaksi (Bendahara / Super Admin) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-rose-700" />
              <span>Input Transaksi Keuangan Baru</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pembukuan kas masuk atau keluar operasional KKG Gugus 01 Kecamatan Bluto.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Jenis Transaksi *</label>
                  <select
                    value={trxType}
                    onChange={(e) => setTrxType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  >
                    <option value="Pemasukan">Pemasukan (Kas Masuk)</option>
                    <option value="Pengeluaran">Pengeluaran (Kas Keluar)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Pos Kategori Anggaran</label>
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
                  <option value="Peralatan Administrasi">Peralatan Administrasi</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nominal (Rupiah) *</label>
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
                  <label className="block font-medium text-slate-700 mb-1">Nomor Kuitansi / Bukti</label>
                  <input
                    type="text"
                    placeholder="Contoh: BKK-052/26"
                    value={proofNumber}
                    onChange={(e) => setProofNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Uraian / Keterangan Pembukuan *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Pembayaran konsumsi kue dan makan siang untuk 40 guru dalam pertemuan KKG di SDN Bluto I"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-rose-700 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-stone-100 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold shadow-sm cursor-pointer"
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
