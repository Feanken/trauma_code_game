# Daftar temuan dan tindak lanjut T20

Tanggal: 29 Oktober 2026. Status: **T20 belum selesai** karena T17, T19, dan T25 belum selesai. Kinerja versi audio sudah lulus pemeriksaan T25. Daftar ini membedakan pekerjaan yang masih terbuka dari perbaikan lama yang sudah dibuktikan.

| ID | Temuan / kebutuhan | Status aktual | Penuntasan dan bukti |
| --- | --- | --- | --- |
| F01 | FR-11/FR-12 dan NFR-15: musik, efek, kontrol dan lifecycle | Implementasi T23–T24 selesai; verifikasi T25 sebagian | Lima MP3 dan `js/audio.js` tersedia; 44 skenario otomatis lulus. Pengguna menyetujui pendengaran aset dan melaporkan bunyi/mute/resume lulus. Narrator + Chrome kontrol baru dilaporkan lulus oleh pengguna. Firefox dan perangkat nyata masih terbuka. |
| F02 | NFR-11: Firefox desktop dan ponsel nyata belum lengkap | Terbuka; T17 | Selesaikan setelah T24; isi perangkat, versi, input dan hasil aktual pada [matriks perangkat](t17-device-matrix.md). |
| F03 | NFR-14: hasil 5–8 peserta belum dapat dihitung | Terbuka; T19 | Pengguna menyatakan hasil tersedia, tetapi belum memberikan angka atau versi. Gunakan [paket uji](usability-study.md); pilot sebelum audio harus dibedakan dari uji versi final. |
| F04 | README sebelumnya hanya judul | Draf perbaikan tersedia, T21 belum selesai | Panduan lokal/hosting/skor/bukti ditulis dan versi saat ini lulus [uji root/subdirektori](t21-static-host-check.json). README sudah diselaraskan dengan audio dan 19 pemeriksaan host versi audio lulus. Penutupan checkbox T21 di luar lingkup permintaan saat ini. |
| F05 | Klik kedua double-click dapat menjawab pertanyaan berikutnya | Ditutup pada T15 | Guard `event.detail > 1`; kasus gagal sebelum perbaikan dan lulus sesudahnya. [80 pemeriksaan integrasi](t15-integration-check.json). Tidak ada perubahan skor. |
| F06 | Layout dapat menimpa `hidden`, sehingga layar nonaktif terlihat | Ditutup pada T16 | Aturan `#app [hidden]` dan pemeriksaan computed display; [laporan visual](t16-visual-check.json). |
| F07 | Kartu pada lebar 320 px melebihi target tinggi 400 px | Ditutup pada T16 | Padding/jarak dipadatkan tanpa mengecilkan font; tinggi akhir 369–393 px dan screenshot utuh. [Laporan visual](t16-visual-check.json). |

Tidak ada temuan perilaku baru pada pemeriksaan root/subdirektori saat menyiapkan T21. Pemeriksaan tersebut memakai aplikasi sebelum audio dan tidak menutup F01–F03. Tidak perlu menjalankan ulang seluruh pengujian skor hanya karena README atau daftar temuan berubah; pemeriksa skor tetap dijalankan pada kedua lokasi untuk memverifikasi jalur relatifnya.

T20 baru dapat dicentang sesudah semua dependensinya selesai, temuan yang menggagalkan MVP ditutup, dan regresi pada versi yang diperbaiki lulus. Dokumen ini tidak mengubah gate audio, perangkat, atau peserta agar tugas terlihat selesai.


**T22–T25:** pengaturan gain mute dan invalidasi playback loading saat reset diperiksa dan diperbaiki selama implementasi. Regresi audio, alur, visual, keyboard/zoom, kontras, hosting dan kinerja lulus. Bukti serta batas manusia/perangkat ada pada `verification.md` dan `t25-manual-check.md`. F02/F03 tetap terbuka; T20 dan T22 belum selesai.
