export function triggerDocumentDownload(
  filename: string,
  title: string,
  details: Record<string, string | number | undefined>
): void {
  const lines = [
    '====================================================================',
    'PORTAL DIGITAL KKG GUGUS 01 KECAMATAN BLUTO - KABUPATEN SUMENEP',
    '====================================================================',
    '',
    `Judul Dokumen : ${title}`,
    `Waktu Unduh   : ${new Date().toLocaleString('id-ID')}`,
    '',
    ...Object.entries(details)
      .filter(([, val]) => val !== undefined && val !== '')
      .map(([key, val]) => `${key.padEnd(18, ' ')}: ${val}`),
    '',
    '--------------------------------------------------------------------',
    'Catatan: Berkas ringkasan arsip ini dihasilkan dari Portal Digital',
    'KKG Gugus 01 Kecamatan Bluto (gugusbluto01@gmail.com).',
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
