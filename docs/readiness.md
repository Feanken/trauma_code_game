# Tinjauan kesiapan MVP — draf T22

Tanggal: 29 Oktober 2026. **Keputusan: belum siap dinyatakan selesai menurut SDD revisi 5. T22 tidak dicentang.** Aplikasi yang tersedia sudah memainkan kuis tanpa audio; musik/efek baru menjadi rancangan T23–T25. T20 dan T21 belum selesai. Tidak ada deployment atau pernyataan kesiapan publik pada tinjauan ini.

## Gate yang masih terbuka

1. T23–T24: aset musik/efek dan kode pengendalinya belum ada.
2. T17: Firefox desktop, Chrome Android nyata, dan Safari iPhone nyata belum lengkap. Setelah audio ditambahkan, uji harus memakai versi tersebut.
3. T25: pendengaran audio, kontrol, lifecycle, kegagalan, dan regresi belum dapat dijalankan.
4. T19: tidak ada baris peserta yang diterima untuk menghitung target. Pengguna menyatakan hasil sudah tersedia; angka dan versi masih ditunggu.
5. T20: penutupan temuan final menunggu gate di atas.
6. T21: README tersedia untuk versi saat ini dan jalur relatif sudah diuji; perilaku audio aktual belum bisa didokumentasikan atau diverifikasi.

Urutan efektif sesuai Task: **T23 → T24 → T17 → T25 → T19 → T20 → T22**. T21 dapat dilengkapi setelah T24. Penyusunan draf T19–T22 tidak berarti dependensi tersebut dilewati.

## Matriks kebutuhan dan bukti

“Terbukti sebelum audio” berarti bukti aktual tersedia untuk versi aplikasi tanpa audio. Penambahan kontrol/pemutar wajib menjalani regresi T25; status ini tidak menyatakan seluruh revisi 5 lulus.

| Kebutuhan | Status penilaian | Bukti / keterbatasan |
| --- | --- | --- |
| FR-01 — Pembuka | Terbukti sebelum audio | T08/T15, [uji root/subdirektori](t21-static-host-check.json). |
| FR-02 — Sepuluh pertanyaan | Implementasi terbukti; validasi calon pengguna tertunda | T02/T15; kebingungan bahasa memerlukan T19. |
| FR-03 — Pilih dan maju | Terbukti sebelum audio | [T15](t15-integration-check.json): lock, double-click, Enter ditahan. |
| FR-04 — Progres | Terbukti sebelum audio | T14/T15: nomor, bilah, nilai aksesibel dan Back. |
| FR-05 — Kembali dan koreksi | Terbukti sebelum audio | T15: Q07 → Q05, ganti satu jawaban, pertahankan yang lain. |
| FR-06 — Skor | Terbukti | T04/T15: 1.024 kombinasi, distribusi dan 424 seri primer cocok. |
| FR-07 — Hasil dan alasan | Implementasi terbukti; relevansi pengguna tertunda | T11/T15: lima hasil dan dua alasan benar; penilaian relevansi T19 belum ada. |
| FR-08 — Kartu ID | Terbukti sebelum audio | T11/T16: foto lokal, fallback dan screenshot empat viewport. |
| FR-09 — Ulang | Terbukti sebelum audio | T12/T15: sesi dan tema lama bersih. Audio belum ada. |
| FR-10 — Informasi fan-made | Tersedia | Pembuka/hasil memuat status nonkomersial/nonafiliasi dan makna hiburan. |
| FR-11 — Musik dan efek | Belum diimplementasikan | T23–T25 belum dikerjakan. |
| FR-12 — Kontrol audio | Belum diimplementasikan | Tidak ada pengendali, tombol kanal, atau volume audio. |
| NFR-01 — Teknologi statis | Terbukti untuk kode saat ini | HTML/CSS/vanilla JS; alat `.cjs` hanya pengembangan. |
| NFR-02 — Eksekusi lokal | Terbukti sebelum audio | Skor/state di browser, tanpa API runtime pada alur uji. |
| NFR-03 — Hosting statis | Terbukti pada server lokal | Root/subdirektori lulus; contoh Nginx belum dijalankan pada host Nginx. |
| NFR-04 — Responsif | Terbukti sebelum audio | [344 pemeriksaan T16](t16-visual-check.json), empat lebar dan zoom asli 200%. |
| NFR-05 — Aksesibilitas | Terbukti pada cakupan T14 sebelum audio | 100 pemeriksaan struktural, 16 keyboard/zoom, dan laporan pengguna Narrator + Chrome; versi pembaca layar tidak diberikan. Kontrol audio perlu uji baru. |
| NFR-06 — Reduced motion | Terbukti sebelum audio | T13/T15/T16; musik/efek bukan bagian bukti tersebut. |
| NFR-07 — Kedalaman dan pointer | Terbukti sebelum audio | T16: pusat/sudut, batas tilt/parallax dan cleanup. |
| NFR-08 — Aset visual | Terbukti untuk aset yang digunakan | Lima JPEG lokal sesuai keputusan penggunaan pribadi; tidak bergantung hotlink. |
| NFR-09 — Privasi | Terbukti pada alur yang diperiksa | Uji root/subdirektori: seluruh request GET lokal tanpa query jawaban; tidak ada form identitas/telemetry pada aplikasi. |
| NFR-10 — Struktur kode | Tersedia untuk kode saat ini | Pembagian file dan panduan dijelaskan pada README/steering; audio masih rencana. |
| NFR-11 — Browser/perangkat | Belum lengkap | [T17](t17-device-matrix.md): Firefox dan dua ponsel nyata belum diuji. |
| NFR-12 — Input lintas perangkat | Sebagian | Mouse/keyboard dan touch emulasi diperiksa; bukti ponsel nyata belum ada. |
| NFR-13 — Kinerja | Lulus sebelum audio pada konfigurasi terukur | [T18](t18-performance-check.json): median 457,8 ms, transfer 65,7 KiB, server gzip lokal; ulangi sesudah audio. |
| NFR-14 — Uji formatif | Belum ada data yang dapat dinilai | Template tidak berisi peserta; pernyataan ketersediaan hasil belum memuat angka/versi. |
| NFR-15 — Audio ringan/tangguh | Belum dapat dinilai | Audio belum diimplementasikan; batas transfer awal saja bukan bukti audio lulus. |

## Paket yang tersedia dan yang belum diserahkan

Tersedia: kode kuis tanpa audio, lima gambar lokal, spesifikasi revisi 5 dan steering, bukti T01–T18 sesuai batasnya, README draf, paket uji peserta, daftar temuan, dan laporan host lokal. [verification.md](verification.md) menyimpan riwayat lengkap. [Manifest audit T19–T22](t19-t22-audit.json) mengikat tinjauan ini pada hash file yang diperiksa.

Belum tersedia: audio final dan bukti T25, matriks perangkat lengkap, hasil numerik peserta, penutupan temuan final, serta persetujuan kesiapan T22. Tidak ada klaim bahwa paket siap rilis karena dokumen sudah ditulis. Fitur setelah MVP tetap unduh kartu, berbagi, dan tautan hasil; ketiganya tidak ditambahkan pada pekerjaan ini.
