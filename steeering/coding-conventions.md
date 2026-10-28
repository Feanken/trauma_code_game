# Coding Conventions — Panduan Agen AI

Proyek: **Which Trauma Code Character Are You?**  
Tanggal dibuat: 28 Oktober 2026  
Fungsi: aturan penulisan dan pengorganisasian kode untuk implementasi berbasis SDD.

## 1. Acuan dan batas panduan

Baca [project-overview.md](project-overview.md), [feature-behavior.md](feature-behavior.md), dan [ui-accessibility.md](ui-accessibility.md) sebelum mengubah bagian aplikasi yang terkait. Kebutuhan produk mengacu pada [requirement.md](../spec-analysisc/requirement.md), solusi pada [design.md](../spec-analysisc/design.md), dan urutan pekerjaan pada [Task.md](../spec-analysisc/Task.md).

Panduan ini menetapkan cara menulis kode yang konsisten dan mudah dipelajari. Perilaku aplikasi, formula skor, nilai token visual, serta batas animasi tetap mengikuti spesifikasi aktif. Jangan memperkenalkan aturan produk baru melalui keputusan penulisan kode.

Gunakan HTML5, CSS3, dan Vanilla JavaScript ES6+ sesuai NFR-01. Tidak menambahkan framework, TypeScript, Node.js, npm, bundler, library animasi, backend, database, atau integrasi AI. Jangan memasang formatter/linter sebagai dependensi hanya untuk menegakkan gaya dokumen ini.

## 2. Format dan penamaan

| Bagian | Konvensi |
| --- | --- |
| Berkas teks | UTF-8, newline konsisten, newline di akhir file, tanpa spasi akhir yang tidak diperlukan. |
| Indentasi | Dua spasi untuk HTML, CSS, dan JavaScript; hindari campuran tab/spasi. |
| JavaScript | Semicolon, string dengan single quote kecuali template literal atau kebutuhan escaping, serta pembanding ketat `===`/`!==`. |
| Variabel/fungsi | `camelCase`, nama bahasa Inggris yang menjelaskan isi/aksi: `currentIndex`, `renderQuestion`, `calculateResult`. |
| Boolean | Awalan seperti `is`, `has`, atau `can`: `isTransitioning`, `hasCompleteAnswers`. |
| Konstanta konfigurasi | `UPPER_SNAKE_CASE` untuk nilai konfigurasi tetap seperti `TIE_BREAK_ORDER`; gunakan `const` juga untuk binding biasa yang tidak diubah. |
| CSS/HTML | Class, ID, dan custom property memakai `kebab-case`: `answer-card`, `question-title`, `--surface-color`. |
| Data/kode domain | ID Q01–Q10, A/B, dan B/Y/C/P/H mengikuti desain. Jangan menerjemahkan atau mengganti ID berdasarkan teks UI. |
| Nama file | Ikuti struktur desain; aset tambahan memakai nama deskriptif `kebab-case`. Pertahankan `Task.md`, `spec-analysisc/`, dan `steeering/` sesuai nama yang ada. |

Gunakan nama yang jelas daripada singkatan seperti `tmp`, `obj`, atau `val` untuk data penting. Komentar dan penjelasan dokumentasi memakai bahasa Indonesia sederhana. Salin teks produk dari sumber data yang disepakati, bukan membuat variasi kalimat di setiap renderer.

Hindari pemformatan ulang file yang tidak terkait pekerjaan. Saat mengedit kode yang sudah ada, pertahankan perubahan pengguna dan selaraskan gaya hanya pada bagian yang relevan.

## 3. Tanggung jawab file

Semua jalur berikut mengacu pada root proyek.

| File | Tanggung jawab | Batas |
| --- | --- | --- |
| `index.html` | Struktur semantik, tiga layar, kontrol native, metadata, dan `noscript`. | Tidak menyimpan pemetaan skor atau handler JavaScript inline. |
| `css/style.css` | Token, tema, layout, keadaan kontrol, kedalaman, animasi, dan reduced motion. | Tidak menjadi sumber jawaban atau hasil karakter. |
| `js/data.js` | Pertanyaan, opsi, poin, alasan, karakter, tema, dan referensi aset yang dipakai UI. | Tidak mengubah DOM atau menyimpan state percobaan pengguna. |
| `js/quiz.js` | Validasi data/jawaban, penghitungan skor, pemecah seri, dan pemilihan alasan. | Fungsi murni; tidak mengakses DOM, timer, gambar, atau state global sesi. |
| `js/ui.js` | Render konten, progres, status kontrol, fokus, gambar/fallback, dan efek visual pointer. | Tidak menentukan karakter pemenang atau mengubah jawaban. |
| `js/script.js` | Inisialisasi, state sesi, event aksi, transisi, reset, serta koordinasi logika dan UI. | Tidak menggandakan data kuis atau formula skor. |
| `checks/scoring-check.*` | Pemeriksa browser yang memanggil fungsi logika produksi. | Tidak dimuat halaman produk dan tidak membawa implementasi skor tersendiri. |

Muat script klasik menggunakan `defer` dalam urutan data → quiz → ui → script. Gunakan satu namespace global `TraumaQuiz`. Bungkus detail internal setiap file dengan fungsi tertutup/IIFE dan strict mode agar nama lokal tidak bocor ke global. Jangan membuat banyak objek global atau menambahkan sistem modul/build baru.

Ekspos hanya data/fungsi yang benar-benar diperlukan antarfile. Simpan pengelolaan efek pointer di bagian UI dengan fungsi setup/reset/cleanup yang jelas; struktur saat ini tidak memerlukan file atau library animasi baru.

## 4. Fungsi, data, dan validasi

Gunakan `const` secara default, `let` bila binding memang berubah, dan hindari `var`. Pilih fungsi kecil dengan satu tanggung jawab serta argumen yang jelas. Utamakan alur yang mudah dibaca daripada ekspresi singkat yang menyembunyikan keputusan.

Fungsi skor menerima data/jawaban sebagai input dan mengembalikan hasil baru. Jangan memutasi data pertanyaan, karakter, urutan seri, atau input jawaban. Hindari mengurutkan array sumber secara langsung bila urutannya masih diperlukan. Array jawaban sesi memang dapat diperbarui oleh controller sesuai feature behavior.

Validasi struktur data saat inisialisasi dan validasi jawaban sebelum perhitungan. Pastikan indeks, ID opsi, serta ID karakter sah sebelum digunakan. Jangan mengubah input rusak menjadi pilihan A/B secara otomatis atau memilih karakter default untuk menyembunyikan masalah.

Jangan menduplikasi bobot, urutan seri, batas gerakan, atau durasi sebagai angka tersebar. Kelompokkan konfigurasi logika di bagian logika/data yang sesuai, konfigurasi efek di bagian UI, serta token visual di CSS. Nilainya tetap mengikuti desain. Konfigurasi visual tidak menjadi sumber aturan skor.

Komentar menjelaskan alasan yang tidak langsung terlihat, misalnya mengapa kelompok seri awal hanya dihitung sekali atau mengapa versi sesi diperiksa pada callback. Jangan menambahkan komentar yang hanya mengulangi baris kode.

## 5. State, event, dan transisi

Controller menjadi pemilik state sesi sesuai desain bagian 7.2. Pertahankan satu sumber jawaban dan hitung ulang skor dari pilihan terbaru. Render ulang UI, Back, pemuatan gambar, dan gerakan pointer tidak boleh menambah poin.

Pasang listener aksi sekali pada elemen stabil atau melalui delegasi yang terkontrol. Jangan menambah listener setiap kali pertanyaan dirender. Gunakan `addEventListener`, tanpa atribut `onclick` pada HTML. Untuk elemen kontrol, gunakan tombol native dengan `type="button"` bila tidak melakukan submit.

Aktivasi pilihan memakai satu jalur konfirmasi yang konsisten. Jangan mengikat `click`, `touchend`, `pointerup`, dan `keydown` sebagai aksi pemilihan terpisah yang dapat menghitung satu input berkali-kali. Pengamanan Enter ditahan atau klik berulang tidak boleh mematikan perilaku keyboard native yang diperlukan.

Kunci transisi sebelum mengubah jawaban; tangkap indeks serta versi sesi saat aksi diterima. Callback hanya boleh menyelesaikan perpindahan sekali, dan harus diabaikan bila sesinya sudah berubah. Simpan referensi timer/frame yang perlu dibatalkan. Jangan mengandalkan `animationend` sebagai satu-satunya cara membuka kunci.

Reset dan pergantian layar harus membersihkan callback serta efek yang relevan. Status visual sementara seperti posisi pointer dan frame tertunda boleh disimpan privat di UI, tetapi bukan sebagai tambahan jawaban atau skor. Tidak memakai cookie, `localStorage`, atau `sessionStorage` untuk memperpanjang sesi.

## 6. HTML, render DOM, dan aksesibilitas

Gunakan HTML semantik, hierarki heading, bahasa halaman Indonesia, tombol native, serta struktur tiga layar sesuai desain. Pertahankan urutan DOM yang sesuai urutan baca dan visual, termasuk A sebelum B. Detail aksesibilitas mengikuti panduan UI, bukan atribut ARIA yang dibuat tanpa tujuan.

Gunakan `textContent` dan pembuatan elemen DOM untuk isi data. Jangan menyisipkan teks pertanyaan, jawaban, atau hasil melalui HTML mentah. Referensi gambar dan class tema harus berasal dari data lokal yang tervalidasi; jangan membentuk class/URL dari input bebas pengguna.

Gunakan atribut `hidden` untuk layar nonaktif dan pastikan CSS tidak membatalkannya. Sinkronkan tanda pilihan dengan `aria-pressed`, serta progres visual dengan nama/nilai aksesibelnya. Render elemen tujuan sebelum memindahkan fokus ke heading pertanyaan atau hasil.

Hindari mengganti seluruh halaman ketika cukup memperbarui konten layar aktif. Simpan referensi DOM yang stabil dan jangan meninggalkan fokus pada node yang dihapus. Jangan menambahkan live region berlapis yang mengumumkan pertanyaan yang sama berkali-kali.

## 7. CSS dan penggabungan efek visual

Susun CSS menurut urutan yang mudah ditemukan: token dasar → elemen dasar → layout → komponen → keadaan → tema → animasi/responsivitas/reduced motion. Gunakan selector class yang sederhana dan hindari ketergantungan pada urutan anak DOM untuk aturan penting.

Bedakan class tampilan, atribut state, dan penanda aksi. Contohnya, class `answer-card` mengatur bentuk, sedangkan status pilihan berasal dari atribut aksesibel yang diperbarui controller/UI. Jangan menjadikan warna yang sedang tampil sebagai penentu jawaban aktif.

Gunakan custom property untuk warna, jarak, bayangan, durasi, dan parameter gerakan. Tema mengubah token pada lingkup hasil yang tepat. Hindari menulis ulang style panjang lewat JavaScript atau memakai `!important` untuk menutupi konflik state/layout.

Gunakan wrapper kartu yang stabil dan permukaan visual di dalamnya untuk tilt. Pisahkan lapisan reveal, tilt, dan dekorasi bila beberapa efek memakai `transform`, supaya satu efek tidak menimpa efek lain. Tombol dan hit area tetap di luar permukaan yang ikut miring.

JavaScript boleh memperbarui custom property numerik untuk sudut, posisi sorotan, dan offset parallax. CSS tetap mengatur bentuk serta presentasinya. Pertahankan fokus terlihat, target tekan, pembungkusan teks, dan reduced motion sesuai UI steering.

## 8. Implementasi efek mengikuti mouse

Tilt, sorotan kartu, dan dua lapisan parallax adalah **kebutuhan MVP bersyarat perangkat**, sesuai desain bagian 3.6. Jangan menandainya opsional. Terapkan pada pratinjau kartu pembuka dan kartu hasil; teks pertanyaan, progres, pilihan, serta tombol tidak ikut bergerak.

Periksa kemampuan hover/fine pointer, jenis event mouse, preferensi reduced motion, dan mode input. Event sentuhan serta mode keyboard menetralkan efek; perangkat hibrida harus dapat berpindah mode. Tidak meminta izin sensor atau memakai kemiringan ponsel.

Normalisasi koordinat terhadap wrapper kartu yang tidak bergerak untuk tilt/sorotan, dan terhadap viewport untuk latar. Jepit nilai ke rentang yang ditetapkan desain. Hindari menghitung koordinat dari permukaan yang sedang ditransform karena dapat menimbulkan gerakan tidak stabil.

Gunakan paling banyak satu frame pembaruan pointer yang tertunda untuk menggabungkan event terbaru. Baca ukuran yang diperlukan sebelum menulis style, dan perbarui pengukuran bila viewport/layout berubah. Jangan membuat loop frame terus-menerus saat pointer diam atau layar tidak aktif.

Ikuti batas sudut, amplitudo latar, smoothing, dan reset dari desain. Cleanup harus membatalkan frame tertunda, menetralkan custom property, serta menonaktifkan callback lama pada keluar area terkait, keluar viewport, pergantian layar/sesi, blur, dan dokumen tersembunyi. Perubahan reduced motion atau input ke touch/keyboard menetralkan efek segera.

Handler pointer hanya mengelola presentasi. Ia tidak boleh menulis array jawaban, menghitung hasil, memindahkan fokus, atau memblokir klik. Gunakan dekorasi yang tidak menerima pointer/fokus dan tetap sediakan pencahayaan statis ketika efek tidak aktif.

## 9. Gambar, kinerja, dan kegagalan

Gunakan aset internet yang sudah dipilih sesuai NFR-08 dan simpan lokal dalam `assets/images/`. Catatan sumber, izin, crop/kompresi, serta atribusi berada pada `assets/SOURCES.md`. Pakai path relatif; jangan menambahkan hotlink, font eksternal, analytics, atau fetch API sebagai ketergantungan runtime.

Tetapkan dimensi gambar, optimalkan format/ukuran, gunakan crop dan alt sesuai fungsi, serta muat foto hasil saat dibutuhkan. Kegagalan gambar menampilkan fallback tanpa mengubah hasil atau membuat rantai error pemuatan berulang. Callback gambar lama harus dicegah memperbarui sesi baru.

Kegagalan validasi data ditangani saat inisialisasi dengan pesan pengguna yang jelas dan detail pengembang di console. Jangan menelan semua error dengan catch kosong, memunculkan alert teknis pada setiap interaksi, atau melanjutkan memakai hasil palsu.

Hapus log debugging sementara sebelum menyatakan tugas selesai. Jangan mencatat atau mengirim jawaban pengguna untuk telemetry. Ukur kinerja menggunakan profil dan target pada desain bagian 9.1 saat tugas terkait dikerjakan; jangan mengganti target berdasarkan hasil yang kebetulan tercapai.

## 10. Perubahan kode dan bukti penyelesaian

Kerjakan berdasarkan ID tugas serta dependensinya. Batasi perubahan pada kebutuhan yang sedang ditangani. Jika solusi memerlukan perubahan spesifikasi, selaraskan dokumen terkait dan jelaskan dampaknya; jangan mengganti framework atau memperluas fitur secara diam-diam.

Untuk skor, pemeriksa browser pada T04 harus memakai fungsi produksi yang sama. Perubahan pemetaan/bobot/pemecah seri wajib mengulang enumerasi seluruh 1.024 kombinasi dan memperbarui acuan desain bila aturan memang berubah. Jangan membuat fungsi skor kedua khusus untuk membuat pemeriksaan lulus.

Perubahan state/event, efek pointer, atau aksesibilitas mengikuti skenario feature behavior, UI steering, dan kriteria Task yang terpengaruh. Hindari pengujian tambahan yang hanya menyalin isi implementasi. Catat hasil aktual, lingkungan, dan pemeriksaan yang belum dilakukan di `docs/verification.md` pada tahap implementasi.

Centang tugas setelah kriteria selesai dan bukti yang diperlukan terpenuhi. Pengujian yang belum tersedia tetap dicatat belum dilakukan. Laporan perubahan menjelaskan file/perilaku yang berubah, alasan, pemeriksaan, dan keterbatasan yang nyata.

## 11. Cakupan saat dokumen dibuat

Pekerjaan ini hanya menambahkan `steeering/coding-conventions.md`. Contoh nama file, fungsi, dan atribut dalam panduan merupakan arahan implementasi; kode aplikasi, pemeriksa skor, serta pengujian UI belum dibuat atau dijalankan pada langkah ini.

Empat steering yang tersedia adalah project overview, feature behavior, UI/accessibility, dan coding conventions. Pada pekerjaan berikutnya, baca file dan status Task terbaru sebelum menyatakan progres implementasi.
