# Daftar temuan dan tindak lanjut T20

Tanggal: 29 Oktober 2026. Status: **T20 belum selesai** karena T17, T19, dan T25 belum selesai. T18 memiliki bukti lulus untuk versi sebelum audio. Daftar ini membedakan pekerjaan yang masih terbuka dari perbaikan lama yang sudah dibuktikan.

| ID | Temuan / kebutuhan | Status aktual | Penuntasan dan bukti |
| --- | --- | --- | --- |
| F01 | FR-11/FR-12 dan NFR-15: musik, efek, kontrol dan lifecycle belum tersedia | Terbuka; fitur revisi 5 | T23 memilih berkas, T24 implementasi, T25 uji pendengaran/regresi. Belum ada `js/audio.js` atau aset audio. |
| F02 | NFR-11: Firefox desktop dan ponsel nyata belum lengkap | Terbuka; T17 | Selesaikan setelah T24; isi perangkat, versi, input dan hasil aktual pada [matriks perangkat](t17-device-matrix.md). |
| F03 | NFR-14: hasil 5–8 peserta belum dapat dihitung | Terbuka; T19 | Pengguna menyatakan hasil tersedia, tetapi belum memberikan angka atau versi. Gunakan [paket uji](usability-study.md); pilot sebelum audio harus dibedakan dari uji versi final. |
| F04 | README sebelumnya hanya judul | Draf perbaikan tersedia, T21 belum selesai | Panduan lokal/hosting/skor/bukti ditulis dan versi saat ini lulus [uji root/subdirektori](t21-static-host-check.json). Tambahkan perilaku audio aktual dan ulangi verifikasi sesudah T24. |
| F05 | Klik kedua double-click dapat menjawab pertanyaan berikutnya | Ditutup pada T15 | Guard `event.detail > 1`; kasus gagal sebelum perbaikan dan lulus sesudahnya. [80 pemeriksaan integrasi](t15-integration-check.json). Tidak ada perubahan skor. |
| F06 | Layout dapat menimpa `hidden`, sehingga layar nonaktif terlihat | Ditutup pada T16 | Aturan `#app [hidden]` dan pemeriksaan computed display; [laporan visual](t16-visual-check.json). |
| F07 | Kartu pada lebar 320 px melebihi target tinggi 400 px | Ditutup pada T16 | Padding/jarak dipadatkan tanpa mengecilkan font; tinggi akhir 369–393 px dan screenshot utuh. [Laporan visual](t16-visual-check.json). |

Tidak ada temuan perilaku baru pada pemeriksaan root/subdirektori saat menyiapkan T21. Pemeriksaan tersebut memakai aplikasi sebelum audio dan tidak menutup F01–F03. Tidak perlu menjalankan ulang seluruh pengujian skor hanya karena README atau daftar temuan berubah; pemeriksa skor tetap dijalankan pada kedua lokasi untuk memverifikasi jalur relatifnya.

T20 baru dapat dicentang sesudah semua dependensinya selesai, temuan yang menggagalkan MVP ditutup, dan regresi pada versi yang diperbaiki lulus. Dokumen ini tidak mengubah gate audio, perangkat, atau peserta agar tugas terlihat selesai.
