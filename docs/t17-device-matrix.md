# Matriks browser dan perangkat T17

Tanggal: 29 Oktober 2026. Status: **belum selesai; T17 tidak dicentang**.

| Target wajib | Lingkungan / input | Hasil |
| --- | --- | --- |
| Chromium desktop | Chrome 156.0.8078.73 headless, Windows 11 build 26300; keyboard CDP, mouse CDP | Lulus integrasi, koreksi, lima hasil, ulang, gambar/fallback, fokus, reduced motion, dan pointer. Bukti T14–T16. |
| Pembaca layar pendukung T14 | Narrator + Chrome; versi tidak diberikan | Pengguna melaporkan lulus pada 29 Oktober 2026. Ini laporan pengguna, bukan keluaran suara yang direkam agen. |
| Firefox desktop | Executable tidak ditemukan di Program Files, LocalAppData, App Paths registry yang diperiksa | Belum diuji. |
| Chrome Android nyata | Pengguna menyatakan belum memiliki hasil uji perangkat nyata | Belum diuji. |
| Safari iPhone nyata | Pengguna menyatakan belum memiliki hasil uji perangkat nyata | Belum diuji. |
| Browser dalam aplikasi sosial | Belum ada peserta/browser yang ditetapkan | Belum diuji; lakukan bila digunakan peserta. |
| Perangkat hibrida nyata | Belum tersedia hasil uji touch/mouse pada perangkat nyata | Belum diuji. Simulasi perubahan input pada desktop tersedia pada bukti T16. |

Untuk menutup T17, catat model perangkat, OS/browser dan versinya, lalu jalankan mulai → beberapa jawaban → Back dua langkah → ubah jawaban → hasil → ulang. Pastikan foto, fokus, pilihan tersimpan, dan tombol tetap bekerja; tidak ada pertanyaan terlewati pada ketukan cepat. Pada mouse, periksa kartu/latar dan reset saat keluar/blur. Pada sentuhan, kartu/latar harus netral. Laporkan setiap masalah dan ulangi setelah perbaikannya. Emulasi viewport serta sentuhan CDP tidak menggantikan dua ponsel nyata tersebut.


**Versi audio T24, 29 Oktober 2026:** Chrome desktop telah menjalani regresi otomatis T25 (audio, keyboard/zoom, visual, integrasi, kinerja, root/subdirektori). Laporan pendengaran aplikasi pengguna tidak menyertakan browser/versi. Pengguna kemudian melaporkan Narrator + Chrome untuk kontrol baru lulus; versi tidak diberikan. Ketiga target browser/perangkat yang belum tersedia di atas tetap belum diuji. Lihat [pemeriksaan T25](t25-manual-check.md).
