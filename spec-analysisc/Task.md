# Task — Which Trauma Code Character Are You?

Status: Implementasi bertahap; T01–T04 dan T07 selesai; T05–T06 selesai sesuai keputusan terbaru pengguna; T08–T10 selesai; T11–T12 siap diverifikasi ulang setelah T05–T06; T13–T22 belum dikerjakan

Tanggal: 28 Oktober 2026  
Acuan: `requirement.md` revisi 4 dan `design.md`, termasuk bagian 3.6 tentang interaksi mouse dan bagian 11 tentang gambar dari internet.

### Acuan steering untuk agen AI

| Panduan | Dipakai untuk |
| --- | --- |
| [project-overview.md](../steeering/project-overview.md) | Memahami tujuan, lingkup, batasan, dan cara kerja SDD sebelum memilih tugas. |
| [feature-behavior.md](../steeering/feature-behavior.md) | Menerapkan alur, jawaban, progres, Back, skor, hasil, reset, dan kasus tepi pada T02–T04 serta T08–T15. |
| [ui-accessibility.md](../steeering/ui-accessibility.md) | Menerapkan dan memeriksa tampilan berdimensi, interaksi mouse, responsivitas, fokus, serta aksesibilitas pada T06–T18 yang terkait. |
| [coding-conventions.md](../steeering/coding-conventions.md) | Menulis kode secara konsisten, membagi tanggung jawab file, serta mengelola state, event, render, dan cleanup pada seluruh tugas implementasi. |

Baca project overview terlebih dahulu, lalu panduan yang relevan sebelum mengerjakan tugas. Requirement menetapkan kebutuhan, design menetapkan solusi, dan steering memandu penerapannya. Kriteria selesai tetap mengikuti tugas serta kebutuhan yang dirujuk. Jika ditemukan ketidaksesuaian, selaraskan dokumen terkait sesuai arahan pengguna; jangan mengubah kebutuhan atau mencentang tugas hanya berdasarkan isi panduan.

## 1. Tujuan dan cara memakai

Dokumen ini adalah tahap ketiga SDD: requirement → design → task. Setiap tugas menjelaskan pekerjaan, dependensi, rujukan kebutuhan, dan bukti penyelesaiannya. Pembuatan dokumen ini tidak berarti implementasi website sudah dimulai.

Kerjakan tugas setelah dependensinya selesai. Tugas tanpa hubungan dependensi dapat dikerjakan dalam urutan yang paling praktis. Tidak ada kewajiban memakai subagent atau menambah alat pengembangan.

Semua checkbox awalnya kosong. Centang tugas hanya setelah hasil dan verifikasinya terpenuhi. Catat bukti aktual di bagian 5. Jika perangkat, peserta uji, atau aset belum tersedia, biarkan tugas terkait belum selesai dan lanjutkan pekerjaan lain yang tidak bergantung padanya.

Teknologi tetap HTML5, CSS3, dan Vanilla JavaScript ES6+. Tidak ada framework, TypeScript, Node.js, npm, backend, database, AI, autentikasi, atau pelacakan pengguna. Pemeriksa logika dijalankan melalui browser tanpa dependensi aplikasi tambahan.

Unduh kartu, integrasi berbagi, dan tautan hasil bukan syarat MVP. Tilt/sorotan kartu ID dan parallax dekorasi mengikuti mouse wajib pada kondisi yang mendukung sesuai desain 3.6. Semua tugas di bawah wajib untuk MVP kecuali bagian yang secara eksplisit disebut opsional.

## 2. Urutan tahap

| Tahap | Tugas | Hasil yang harus tersedia |
| --- | --- | --- |
| A. Fondasi dan logika | T01–T04 | Struktur sederhana, data kuis, fungsi skor, dan pemeriksa 1.024 kombinasi. |
| B. Aset dan dasar visual | T05–T07 | Lima foto karakter dari internet, catatan sumber, dan sistem visual berdimensi. |
| C. Alur MVP | T08–T12 | Pembuka, kuis, hasil, koreksi jawaban, dan ulang yang terhubung. |
| D. Interaksi dan aksesibilitas | T13–T14 | Animasi, respons lintas perangkat, fokus, dan reduced motion. |
| E. Verifikasi dan perbaikan | T15–T20 | Bukti fungsi, visual, perangkat, kinerja, dan pengalaman pengguna. |
| F. Dokumentasi dan kesiapan rilis | T21–T22 | Petunjuk menjalankan serta laporan kesiapan MVP. |

T05 dapat dimulai setelah T01 tanpa menunggu pemeriksa skor. Sementara pencarian gambar berlangsung, layout dapat dikembangkan dengan bidang placeholder sementara; tugas integrasi gambar belum boleh dinyatakan selesai sampai aset final terpasang.

## 3. Daftar tugas

### Tahap A — Fondasi dan logika

- [x] **T01 — Siapkan struktur website statis.**

**Dependensi:** Tidak ada. **Kebutuhan:** NFR-01, NFR-02, NFR-03, NFR-10. **Desain:** Bagian 7.

Buat `index.html`, `css/style.css`, `js/data.js`, `js/quiz.js`, `js/ui.js`, `js/script.js`, serta direktori aset dan pemeriksa sesuai desain. Muat script klasik dengan `defer` dalam urutan data → quiz → ui → script dan gunakan namespace `TraumaQuiz`. Siapkan pesan `noscript`.

**Selesai jika:** halaman dapat dimuat melalui server HTTP statis tanpa build, dependensi, atau kesalahan pemuatan script. Semua path relatif. Verifikasi ini hanya membuktikan fondasi halaman, belum fungsi kuis.

**Bukti T01:** selesai pada 28 Oktober 2026. HTML, CSS, dan empat script mengembalikan HTTP 200; Chrome headless menjalankan inisialisasi namespace lengkap. Pesan `noscript` tersedia, tetapi tampilan browser dengan JavaScript mati belum terkonfirmasi. Rincian dan keterbatasan: [verification.md](../docs/verification.md), [t01-smoke.json](../docs/t01-smoke.json).

- [x] **T02 — Masukkan data pertanyaan dan kelima karakter.**

**Dependensi:** T01. **Kebutuhan:** FR-02, FR-06, FR-07, NFR-10; A-01, A-03, A-05. **Desain:** Bagian 4–6 dan 7.1.

Isi `data.js` dengan Q01–Q10, masing-masing dua pilihan A/B, poin 2, ID karakter, dan kalimat alasan sesuai tabel desain. Masukkan lima nama, gelar, ringkasan, deskripsi, tiga kekuatan, pesan, tema, dan urutan seri B/Y/C/P/H. Bahasa Indonesia digunakan sesuai keputusan dokumen, dengan label tertentu tetap mengikuti brief.

**Selesai jika:** validator memastikan tepat 10 pertanyaan, dua opsi per pertanyaan, lima karakter, ID unik, teks lengkap, 10 pasangan karakter unik, serta setiap karakter muncul dua kali di A dan dua kali di B. Data gagal validasi menampilkan pesan yang dapat dipahami, tanpa hasil asal.

**Bukti T02:** selesai pada 28 Oktober 2026. Data dan tema cocok dengan tabel desain; 45 kasus validator lulus di Chrome headless, termasuk input rusak dan input yang dibekukan. Uji inisialisasi data tidak valid menampilkan pesan, tanpa penanda siap dan tanpa membuka kuis/hasil. Rincian: [verification.md](../docs/verification.md), [t02-data-check.json](../docs/t02-data-check.json). Pemeriksa struktur tersedia melalui `checks/data-check.html`; skor T03 dan pemeriksa skor T04 belum dibuat.

- [x] **T03 — Implementasikan skor, pemecah seri, dan alasan hasil.**

**Dependensi:** T02. **Kebutuhan:** FR-06, FR-07, NFR-02, NFR-10. **Desain:** Bagian 5 dan 7.

Implementasikan fungsi murni di `quiz.js`: validasi jawaban, hitung ulang skor dari jawaban terbaru, pilih kandidat skor tertinggi, lakukan satu tahap pembanding di antara kandidat seri awal, lalu gunakan urutan tetap bila perlu. Pilih dua alasan paling awal yang benar-benar memberi skor kepada pemenang. Fungsi ini tidak mengakses DOM atau memakai randomness.

**Selesai jika:** jawaban lengkap menghasilkan satu karakter dan dua alasan yang sesuai; input kosong atau tidak dikenal ditolak; jumlah skor selalu 20. Contoh jawaban untuk lima karakter pada desain menghasilkan karakter yang diharapkan.

**Bukti T03:** selesai pada 28 Oktober 2026. Sebanyak 28 kasus fungsi produksi lulus di Chrome headless: kelima contoh karakter, seri dua/tiga/lima kandidat, alasan berurutan, determinisme, koreksi jawaban, input tidak dimutasi, serta penolakan input rusak. Regresi 45 kasus T02 dan inisialisasi halaman juga lulus. Rincian: [verification.md](../docs/verification.md), [t03-result-check.json](../docs/t03-result-check.json). Pemeriksaan terpilih tersedia pada `checks/result-unit-check.html`; enumerasi 1.024 kombinasi dan pemeriksa skor lengkap tetap T04.

- [x] **T04 — Buat pemeriksa skor tanpa dependensi.**

**Dependensi:** T03. **Kebutuhan:** FR-06, FR-07. **Desain:** Bagian 5.3 dan 9.2.

Buat `checks/scoring-check.html` dan `checks/scoring-check.js` yang memanggil fungsi produksi dari `quiz.js`. Enumerasi 1.024 kombinasi, periksa determinisme, seri dua karakter, seri banyak karakter, perubahan jawaban, alasan hasil, dan input tidak lengkap. Pemeriksa tidak dimuat pada halaman produk.

**Selesai jika:** jumlah hasil persis B=240, Y=204, C=196, P=192, H=192; total 1.024 dan seri skor utama 424. Setiap karakter berada pada rentang 15–25%. Semua A menghasilkan lima skor 4 dan hasil B. Ringkasan lulus/gagal serta langkah menjalankan dapat dibaca di browser. Perubahan aturan wajib memperbarui desain dan hasil pembanding terlebih dahulu.

**Bukti T04:** selesai pada 28 Oktober 2026. Pemeriksa `checks/scoring-check.html` memakai fungsi produksi dan lulus 14 kelompok pemeriksaan, termasuk enumerasi 1.024 kombinasi dengan distribusi tepat serta 424 seri primer. Determinisme, dua alasan, validitas skor, koreksi jawaban, dan penolakan input rusak diperiksa. Pemeriksa tidak dimuat halaman produk. Rincian: [verification.md](../docs/verification.md) dan [t04-scoring-check.json](../docs/t04-scoring-check.json).

### Tahap B — Aset dan dasar visual

- [x] **T05 — Cari dan pilih gambar karakter dari internet.**

**Dependensi:** T01. **Kebutuhan:** FR-08, NFR-08. **Desain:** Bagian 11.

Cari satu foto yang sesuai untuk Baek Kang-hyuk, Yang Jae-won, Cheon Jang-mi, Park Gyeong-won, dan Han Yu-rim. Gambar pendukung pembuka bersifat opsional. Lima still dapat diambil langsung dari internet sesuai keputusan terbaru pengguna untuk proyek pribadi. Tidak ada kewajiban membuat ilustrasi orisinal.

**Selesai jika:** lima aset terpilih sesuai karakter, kualitas crop memadai, dan cocok dengan karakter pada still yang ditinjau. Jika sumber belum memadai, lanjutkan pencarian atau tandai aset belum selesai; hasil pencarian saja tidak menjadi bukti izin.

**Progres T05 — 28 Oktober 2026:** lima kandidat still dan URL berkas ditemukan, dengan kredit sumber dicatat dalam [SOURCES.md](../assets/SOURCES.md). Bukti izin penggunaan untuk kartu kuis belum terkonfirmasi; tinjauan visual/crop belum selesai karena pengambilan gambar melalui alat web gagal. Alternatif Commons ditelusuri, belum menghasilkan lima aset final yang memenuhi seluruh kriteria. Catatan ini merupakan kondisi sebelum keputusan terbaru pengguna; T05 kini selesai. Bukti dan batas pemeriksaan: [verification.md](../docs/verification.md), [t05-asset-research.json](../docs/t05-asset-research.json). T06 baru dipersiapkan untuk tiga potret berlisensi dan tetap belum selesai.

- [x] **T06 — Siapkan aset lokal yang ringan dan tahan kegagalan.**

**Dependensi:** T05. **Kebutuhan:** FR-08, NFR-08, NFR-09, NFR-13. **Desain:** Bagian 9.1 dan 11.

Simpan gambar dalam `assets/images/` dengan nama deskriptif. Optimalkan ukuran dan format, catat crop/kompresi di sumber, serta tentukan posisi crop wajah untuk area foto rasio 4:3. Tetapkan dimensi gambar, rencanakan pemuatan foto hasil hanya saat diperlukan, serta fallback inisial jika gambar gagal.

**Selesai jika:** kelima foto dapat dimuat dari host website sendiri, tidak memakai hotlink, dan crop telah ditinjau. Informasi ukuran file tersedia untuk integrasi. Gambar tidak mengharuskan akun, API, atau permintaan pihak ketiga saat kuis dijalankan.

**Status T06 — 28 Oktober 2026:** belum selesai dan tidak dicentang. Dependensi T05 belum terpenuhi: lima foto final beserta izin dan crop belum terverifikasi. Lima still karakter lokal berukuran 720 × 480 telah dipasang dan diverifikasi pada lima hasil; rincian bukti di verification.md. Rincian: [verification.md](../docs/verification.md#t06--aset-lokal).

- [x] **T07 — Bangun sistem visual berlapis dan layout dasar.**

**Dependensi:** T01. **Kebutuhan:** NFR-04, NFR-05, NFR-07, NFR-12. **Desain:** Bagian 3.

Tetapkan token warna, font sistem, jarak, sudut, gradasi, highlight, batas permukaan, dan bayangan. Siapkan panel utama serta kartu/tombol dengan keadaan biasa, fokus, ditekan, terpilih, dan nonaktif. Buat layout pembuka/hasil dua kolom di desktop dan satu kolom di ponsel; pilihan jawaban tetap A kiri, B kanan.

**Selesai jika:** komponen terasa berdimensi pada layar lebar maupun sempit, tanpa efek yang menutupi teks atau mengubah area tekan. Semua aksi penting tersedia tanpa hover. Target tekan minimal 44 × 44 CSS px dan outline fokus jelas.

**Bukti T07 — 28 Oktober 2026:** sistem token, panel, kartu, tombol, lima tema dan layout responsif dibuat. Galeri terpisah `checks/ui-preview.html` memperlihatkan keadaan kontrol. Pemeriksa browser lulus pada 320/375/768/1280 CSS px: tanpa overflow horizontal, A/B sejajar, target minimal 44 px, fokus terlihat, area tekan stabil, dan kontras teks terukur minimal 8,60:1. Tangkapan layar desktop/ponsel ditinjau. Rincian dan batas uji: [verification.md](../docs/verification.md), [t07-ui-check.json](../docs/t07-ui-check.json).

### Tahap C — Alur MVP

- [x] **T08 — Buat layar pembuka dan awal sesi.**

**Dependensi:** T02, T07. **Kebutuhan:** FR-01, FR-10; A-01. **Desain:** Bagian 2.1 dan 7.3.

Tampilkan judul, pengantar, informasi 10 pertanyaan/tanpa login, pratinjau kartu, tombol Start Quiz, dan keterangan fan-made. Hubungkan tombol mulai ke sesi kosong dan pertanyaan pertama. Pakai foto final setelah T06 selesai; sebelum itu bidang gambar boleh sementara.

**Selesai jika:** halaman baru menampilkan pembuka; Start Quiz menampilkan pertanyaan pertama dengan progres 1/10 dan tanpa jawaban lama. Pengguna dapat memahami manfaat kuis sebelum mulai. Estimasi durasi belum diklaim sebelum diukur.

**Bukti T08:** pembuka, pratinjau placeholder, Start Quiz dan sesi kosong Q01 diverifikasi di Chrome; lihat [verification.md](../docs/verification.md#t08t10--alur-pembuka-pertanyaan-dan-navigasi).

- [x] **T09 — Buat renderer pertanyaan, pilihan, dan progres.**

**Dependensi:** T02, T07. **Kebutuhan:** FR-02, FR-03, FR-04, FR-05. **Desain:** Bagian 2.2 dan 7.

Render satu pertanyaan aktif, konteks, dua tombol pilihan, nomor n/10, dan bilah progres dari state. Tampilkan pilihan tersimpan dengan centang, teks “Dipilih”, serta status aksesibel. Back tidak aktif atau tidak terlihat pada pertanyaan pertama. Gunakan teks data sebagai teks DOM, bukan HTML mentah.

**Selesai jika:** semua pertanyaan 1–10 dan pilihan A/B tampil benar; progres mengikuti indeks aktif; teks membungkus tanpa mengecilkan font secara paksa; jawaban sebelumnya terlihat saat dibuka kembali.

**Bukti T09:** 10 teks pertanyaan, progres 1–10, bilah, pilihan lama, dan Back pertama diverifikasi; lihat [t08-t10-flow-check.json](../docs/t08-t10-flow-check.json).

- [x] **T10 — Hubungkan jawaban, Back, dan perlindungan event.**

**Dependensi:** T03, T08, T09. **Kebutuhan:** FR-03, FR-04, FR-05, FR-06, NFR-12; A-02, A-03, A-04. **Desain:** Bagian 7.2–7.3.

Kelola `screen`, `currentIndex`, `answers`, `isTransitioning`, `result`, dan `sessionVersion`. Simpan pilihan terbaru lalu maju otomatis; Back mundur satu indeks tanpa menghapus jawaban lain. Kunci sebelum mutasi dan abaikan ketukan/aktivasi berulang selama perpindahan. Perhitungan hasil hanya boleh terjadi setelah sepuluh jawaban lengkap.

**Selesai jika:** memilih pilihan lama atau penggantinya maju satu pertanyaan, perubahan tidak menggandakan skor, dan double-click/Enter ditahan tidak melewati pertanyaan. Tidak ada penyimpanan browser; refresh kembali ke pembuka. Jika jawaban belum lengkap, permintaan hasil mengarah ke pertanyaan kosong pertama.

**Bukti T10:** 36 pemeriksaan browser lulus termasuk klik ganda, Back, koreksi, hasil setelah Q10, fokus, dan refresh. Skor dihitung melalui fungsi T03; kartu hasil lengkap menunggu T11. Lihat [verification.md](../docs/verification.md#t08t10--alur-pembuka-pertanyaan-dan-navigasi).

- [ ] **T11 — Bangun hasil lima karakter dan Trauma Team ID Card.**

**Dependensi:** T03, T06, T07, T10. **Kebutuhan:** FR-07, FR-08, FR-10, NFR-08. **Desain:** Bagian 2.3, 3.3, 5.4, 6, dan 11.

Hubungkan hasil ke nama, gelar, ringkasan kartu, foto karakter, deskripsi, tiga kekuatan, dua alasan jawaban, dan pesan. Terapkan lima tema beserta motif pendukungnya. Tambahkan kode dekoratif TEAM, label hiburan, keterangan fan-made/nonafiliasi, dan kredit bila disyaratkan aset. Implementasikan fallback inisial saat foto gagal.

**Selesai jika:** kelima hasil dapat ditinjau menggunakan contoh jawaban desain; foto/nama/tema/alasan sesuai; kegagalan gambar tidak menghilangkan hasil atau tombol. Tidak ada permintaan data pribadi, persentase kecocokan psikologis, atau tombol unduh/berbagi yang belum berfungsi.

**Progres T11 — 28 Oktober 2026:** lima hasil, tema, alasan, tiga kekuatan, dan fallback inisial sudah terhubung serta lolos pemeriksa browser. Foto final, crop, dan atribusi belum tersedia karena T05/T06 belum selesai. T11 tetap belum dicentang. [Bukti](../docs/verification.md#t11t12--hasil-karakter-dan-pengulangan).

- [ ] **T12 — Hubungkan pengulangan dan bersihkan sesi lama.**

**Dependensi:** T10, T11. **Kebutuhan:** FR-01, FR-09. **Desain:** Bagian 7.2–7.3.

Tombol Ulangi kuis membersihkan jawaban, progres, hasil, pilihan aktif, dan tema karakter; batalkan callback lama atau abaikan berdasarkan versi sesi. Mulai langsung dari pertanyaan pertama dan fokus ke heading.

**Selesai jika:** beberapa percobaan berturut-turut berjalan tanpa reload; pola jawaban berbeda dapat menghasilkan karakter berbeda; callback dari sesi lama tidak mengubah percobaan baru.

**Progres T12 — 28 Oktober 2026:** tombol Ulangi kuis, pembersihan hasil/tema/jawaban, dan beberapa sesi dengan hasil berbeda lolos pemeriksaan. Dependensi T11 belum selesai, maka T12 tetap belum dicentang. [Bukti](../docs/verification.md#t11t12--hasil-karakter-dan-pengulangan).

### Tahap D — Interaksi dan aksesibilitas

- [ ] **T13 — Tambahkan animasi dan respons visual lintas perangkat.**

**Dependensi:** T07, T10, T11, T12. **Kebutuhan:** FR-03, NFR-06, NFR-07, NFR-12. **Desain:** Bagian 3.5–3.6 dan 7.3.

Terapkan efek tekan, hover hanya pada perangkat yang mendukungnya, transisi pertanyaan maksimal 320 ms, progres sekitar 180 ms, serta reveal hasil maksimal 450 ms. Tidak ada penantian analisis buatan. Reduced motion menghilangkan gerakan nonesensial tanpa merusak penguncian input. Implementasikan tilt dan sorotan yang mengikuti mouse pada pratinjau kartu pembuka dan kartu hasil, serta dua lapisan parallax latar sesuai desain 3.6: tilt ±3° per sumbu, offset ±6/±12 px, smoothing sekitar 120 ms, dan reset maksimal 180 ms. Aktifkan hanya pada event mouse yang memenuhi syarat hover/fine pointer tanpa reduced motion; gunakan tampilan netral untuk touch dan mode keyboard. Gunakan wrapper stabil, pembaruan requestAnimationFrame saat perlu, dan cleanup pada keluar viewport, pergantian layar, reset sesi, blur, serta halaman tersembunyi. Pertanyaan dan kontrol tidak ikut bergerak.

**Selesai jika:** tilt, sorotan, dan kedua lapisan parallax mengikuti arah mouse sesuai batas pada kedua layar kartu dan seluruh tema hasil; semua kondisi reset/cleanup bekerja tanpa callback lama. Perubahan reduced motion dan input touch/keyboard langsung menetralkan efek. Hit area stabil, elemen penting tetap terbaca, dan pointer diam tidak menjalankan loop pembaruan efek terus-menerus. Mouse, sentuhan, dan keyboard mendapat umpan balik; transisi selesai sekali saja meski event animasi tidak terpanggil. Dengan reduced motion, fungsi tetap lengkap dan tidak terjadi lompatan pertanyaan.

- [ ] **T14 — Lengkapi semantik dan aksesibilitas.**

**Dependensi:** T08, T09, T11, T12, T13. **Kebutuhan:** FR-04, NFR-05, NFR-06, NFR-12. **Desain:** Bagian 8.

Atur heading, nama tombol, status pilihan, progres aksesibel, `hidden` pada layar nonaktif, alt foto, serta fokus setelah maju, kembali, dan hasil. Hindari pengumuman pembaca layar yang berganda. Ukur kontras pasangan warna aktual, bukan hanya warna token.

**Selesai jika:** alur lengkap dapat dipakai dengan Tab/Enter/Space, fokus selalu terlihat, teks biasa berkontras minimal 4,5:1, dan zoom 200% tidak menghilangkan isi. Pembaca layar mengumumkan pertanyaan/hasil dengan jelas; dekorasi tidak mengganggu urutan baca.

### Tahap E — Verifikasi dan perbaikan

- [ ] **T15 — Verifikasi integrasi dan kasus tepi.**

**Dependensi:** T04, T12, T13, T14. **Kebutuhan:** FR-01, FR-02, FR-03, FR-04, FR-05, FR-06, FR-07, FR-08, FR-09, FR-10. **Desain:** Bagian 9.2–9.3.

Jalankan alur lengkap, kelima contoh hasil, perubahan jawaban beberapa langkah ke belakang, pilihan lama, klik cepat, Back selama transisi, keyboard ditahan, reset, refresh, reduced motion, gambar gagal, dan data tidak valid. Cocokkan hasil UI dengan fungsi skor dan jalankan kembali pemeriksa T04 setelah perubahan logika.

**Selesai jika:** tidak ada jawaban terlewati, hasil prematur, skor ganda, tema lama, atau alasan yang tidak dipilih. Catat hasil aktual dan perbaiki kegagalan sebelum mengulang pemeriksaan yang terpengaruh.

- [ ] **T16 — Verifikasi responsivitas, kedalaman visual, dan tangkapan layar.**

**Dependensi:** T13, T14, T15. **Kebutuhan:** FR-08, NFR-04, NFR-05, NFR-07, NFR-12. **Desain:** Bagian 2.3, 3, dan 9.3.

Tinjau tiga layar pada lebar 320, 375, 768, dan 1280 px serta kelima kartu karakter. Periksa dua kolom jawaban, nama panjang, tinggi tombol, crop wajah, dan overflow. Periksa pointer di pusat dan empat sudut kartu, batas tilt, posisi sorotan, dua amplitudo latar, keluar kartu/viewport, blur, pergantian layar, reset, serta perubahan reduced motion saat efek aktif. Pastikan pertanyaan dan kontrol tetap stabil. Ambil bukti kartu netral pada viewport 320 × 568 serta 375 × 667 setelah digulir ke kartu. Ulangi pemeriksaan keterbacaan dengan zoom 200%.

**Selesai jika:** tidak ada gulir horizontal atau teks terpotong; kartu utama muat dalam satu tangkapan layar pada zoom normal; pembesaran tetap terbaca meskipun kartu menjadi lebih tinggi. Lapisan, highlight, bayangan, dan status kontrol tetap jelas pada ponsel.

- [ ] **T17 — Verifikasi browser dan perangkat nyata.**

**Dependensi:** T15, T16. **Kebutuhan:** NFR-11, NFR-12. **Desain:** Bagian 9.3.

Periksa Chromium dan Firefox desktop, Chrome pada Android nyata, serta Safari pada iPhone nyata. Periksa browser dalam aplikasi sosial jika digunakan peserta. Catat versi, perangkat, OS, input yang diuji, dan masalah khusus browser. Periksa mouse pada perangkat yang mendukung, sentuhan pada ponsel, mode keyboard, serta pergantian touch/mouse bila tersedia perangkat hibrida; efek tidak boleh tetap aktif setelah kondisi dukungannya berubah.

**Selesai jika:** alur utama, koreksi, hasil, ulang, foto, dan fokus bekerja pada semua target wajib. Perangkat yang belum tersedia ditandai belum diuji; emulasi tidak menggantikannya dan tugas ini tetap belum selesai sampai pemeriksaan wajib terpenuhi.

- [ ] **T18 — Ukur dan optimalkan kinerja.**

**Dependensi:** T06, T13, T15, T16. **Kebutuhan:** NFR-13. **Desain:** Bagian 9.1.

Tambahkan penanda siap pakai setelah heading/tombol terlihat dan handler mulai terpasang. Lakukan lima pemuatan tanpa cache pada profil desain: unduh 1,6 Mbps, unggah 750 Kbps, latensi 150 ms, CPU 4×. Catat perangkat, browser, nilai tiap percobaan, median, transfer awal aktual, dan kompresi server. Optimalkan gambar/CSS/JS bila target belum tercapai.

**Selesai jika:** median siap pakai maksimal 3 detik dan transfer awal terkompresi maksimal 300 KiB. Foto hasil tidak seluruhnya dimuat pada pembuka. Bila server belum mengompresi, laporkan keadaan tersebut dan selesaikan pengukuran pada konfigurasi yang memenuhi syarat sebelum mencentang tugas.

- [ ] **T19 — Lakukan uji formatif kepada calon pengguna.**

**Dependensi:** T15, T16. **Kebutuhan:** FR-02, FR-07, FR-08, NFR-14. **Desain:** Bagian 9.4.

Siapkan skenario singkat dan uji 5–8 orang dari segmen utama, termasuk penggemar dan orang yang belum mengenal drama. Catat penyelesaian tanpa bantuan, durasi, relevansi hasil 1–5 beserta alasannya, pertanyaan yang membingungkan, serta minat membagikan tangkapan layar. Rekrutmen atau menghubungi orang tidak termasuk tindakan otomatis dari tugas ini; gunakan peserta yang tersedia melalui pengguna tanpa pelacakan aplikasi.

**Selesai jika:** minimal 80% selesai tanpa bantuan, median waktu maksimal 2 menit, median relevansi minimal 4/5, dan kebingungan berulang sudah diperbaiki serta ditinjau ulang. Catat jumlah mentah dan keterbatasan sampel. Jika peserta belum tersedia, tandai belum diuji, bukan lulus berdasarkan simulasi.

- [ ] **T20 — Perbaiki temuan dan jalankan regresi terkait.**

**Dependensi:** T17, T18, T19. **Kebutuhan:** Semua FR dan NFR yang terkena perubahan. **Desain:** Bagian 9–10.

Tutup temuan dari pemeriksaan fungsi, perangkat, kinerja, dan pengguna. Perbarui requirement/desain bila keputusan produk berubah. Perubahan pemetaan skor wajib mengulang enumerasi dan memperbarui angka acuan; perubahan bahasa saja diperiksa terhadap makna opsi dan pembungkusan teks.

**Selesai jika:** seluruh masalah yang menggagalkan kriteria MVP sudah diperbaiki dan pemeriksaan yang terpengaruh diulang. Jangan mengulang semua pemeriksaan tanpa alasan; pilih berdasarkan dampak perubahan dan catat hasilnya.

### Tahap F — Dokumentasi dan kesiapan rilis

- [ ] **T21 — Tulis panduan menjalankan dan hosting statis.**

**Dependensi:** T15. **Kebutuhan:** FR-10, NFR-01, NFR-02, NFR-03, NFR-08, NFR-09, NFR-10. **Desain:** Bagian 7, 9, dan 11.

Buat `README.md` berbahasa Indonesia yang menjelaskan tujuan hiburan, struktur file, menjalankan melalui server HTTP statis, membuka pemeriksa skor, sumber gambar, aturan skor, dan lokasi bukti verifikasi. Jelaskan penempatan file pada Nginx/hosting statis, jalur relatif, dan kompresi aset sesuai lingkungan yang dipakai.

**Selesai jika:** petunjuk dapat diikuti tanpa Node.js, npm, build, database, atau akun; halaman bekerja pada root dan subdirektori host statis. Network menunjukkan tidak ada API, font eksternal, hotlink, atau pengiriman jawaban keluar. Panduan tidak mengklaim pemeriksaan yang belum dilakukan.

- [ ] **T22 — Tinjau kesiapan MVP dan lengkapi serah terima.**

**Dependensi:** T20, T21. **Kebutuhan:** FR-01–FR-10, NFR-01–NFR-14. **Desain:** Bagian 10.

Cocokkan hasil implementasi dengan seluruh kebutuhan, lengkapi matriks bukti di bawah, dan pastikan daftar status mencerminkan hasil aktual. Catat keterbatasan yang tersisa dan fitur setelah MVP secara terpisah.

**Selesai jika:** semua tugas wajib dan kriteria penerimaan requirement terpenuhi, bukti dapat ditelusuri, dan tidak ada pemeriksaan wajib yang belum dilakukan. Hasil tugas ini adalah paket siap ditinjau untuk rilis; tidak otomatis memublikasikan atau men-deploy website.

## 4. Pemetaan kebutuhan ke tugas

| Kebutuhan | Tugas utama |
| --- | --- |
| FR-01 | T08, T12, T15 |
| FR-02 | T02, T09, T19 |
| FR-03 | T09, T10, T13, T15 |
| FR-04 | T09, T10, T14 |
| FR-05 | T09, T10, T15 |
| FR-06 | T02, T03, T04, T10, T15 |
| FR-07 | T02, T03, T11, T19 |
| FR-08 | T05, T06, T11, T16, T19 |
| FR-09 | T12, T15 |
| FR-10 | T08, T11, T21 |
| NFR-01 | T01, T21 |
| NFR-02 | T01, T03, T21 |
| NFR-03 | T01, T21 |
| NFR-04 | T07, T16 |
| NFR-05 | T07, T14, T16 |
| NFR-06 | T13, T14 |
| NFR-07 | T07, T13, T16 |
| NFR-08 | T05, T06, T11, T21 |
| NFR-09 | T06, T21 |
| NFR-10 | T01, T02, T03, T21 |
| NFR-11 | T17 |
| NFR-12 | T07, T10, T13, T14, T16, T17 |
| NFR-13 | T06, T18 |
| NFR-14 | T19 |

T20 menangani perbaikan lintas kebutuhan; T22 memeriksa kelengkapan seluruh pemetaan. Asumsi A-01–A-05 ditangani pada data, state, serta pengelolaan sesi di T02, T08, dan T10.

## 5. Pencatatan bukti dan status

Saat implementasi dimulai, buat `docs/verification.md` untuk bukti lintas tugas. Tidak perlu membuatnya pada tahap perencanaan ini. Gunakan catatan singkat dengan field berikut:

| Field | Isi yang dicatat |
| --- | --- |
| Tugas dan kebutuhan | ID Txx serta FR/NFR yang diperiksa. |
| Versi | Commit jika tersedia, atau tanggal dan identitas versi file yang diuji. |
| Lingkungan | Browser, versi, OS, perangkat, viewport, serta profil jaringan bila relevan. |
| Skenario | Langkah atau pola jawaban yang dipakai. |
| Harapan dan hasil | Nilai yang diharapkan, hasil aktual, serta lulus/gagal/belum diuji. |
| Bukti | Tangkapan layar, keluaran pemeriksa, angka pengukuran, atau catatan uji pengguna tanpa identitas pribadi. |
| Tindak lanjut | Masalah, perbaikan, dan pemeriksaan ulang yang diperlukan. |

Status awal seluruh tugas adalah belum dikerjakan. Status terkini: **T01–T04 dan T07 selesai; T05–T06 selesai sesuai keputusan terbaru pengguna; T08–T10 selesai; T11–T12 siap diverifikasi ulang setelah T05–T06; T13–T22 belum dikerjakan**. Logika skor produksi lulus pemeriksaan terpilih T03 dan enumerasi lengkap T04; UI kuis lengkap belum dibuat.

## 6. Batas pekerjaan saat ini

Fondasi T01, data/validator T02, logika skor/alasan T03, dan pemeriksa skor lengkap T04 telah dibuat serta diperiksa. Penelusuran T05 tercatat, tetapi izin dan crop aset final belum terkonfirmasi. Sistem visual dan layout dasar T07 selesai. T06 belum dapat dilaksanakan sampai T05 selesai. T08–T10 selesai. Kode hasil dan pengulangan T11–T12 sudah ditambahkan dan diuji, tetapi kedua tugas masih terbuka karena foto final T05/T06 belum tersedia. Efek pointer T13, uji pengguna, dan deployment belum dikerjakan. Pekerjaan berhenti setelah T12.
