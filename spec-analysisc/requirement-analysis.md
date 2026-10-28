# Analisis Requirement untuk Target Gen Z

Tanggal: 28 Oktober 2026  
Dokumen yang dianalisis: `requirement.md`  
Status: Rekomendasi untuk peninjauan; belum mengubah requirement atau memulai desain dan implementasi.

## 1. Kesimpulan

Konsep kuis ini layak diuji kepada Gen Z, khususnya penggemar K-drama. Requirement sudah mendukung alur singkat, akses tanpa akun, pengalaman visual, serta hasil berupa identitas karakter. Namun, dokumen belum cukup spesifik untuk menyatakan bahwa produk sesuai dengan kebutuhan pasar Gen Z.

Celah terbesar ada pada segmentasi pengguna, relevansi pertanyaan, bahasa, kualitas hasil untuk dibagikan, dan ukuran keberhasilan. Kelayakan teknis serta fungsi yang lengkap belum membuktikan minat pengguna atau kecenderungan membagikan hasil.

Penilaian ini merupakan analisis requirement dan hipotesis produk, bukan hasil pengujian pengguna. Tidak ada dasar untuk memberikan persentase kecocokan atau menjanjikan produk akan viral.

## 2. Dasar analisis dan batas bukti

- Jakpat menerbitkan riset **Korean Drama Trends in Indonesia** pada 3 Juni 2025, berdasarkan survei 1.211 responden pada 28–29 April 2025. Riset tersebut membahas kebiasaan, preferensi, dan pengaruh K-drama. Ini memberi konteks lokal yang relevan, tetapi ringkasan publiknya tidak membuktikan permintaan terhadap kuis ini atau minat terkini pada The Trauma Code. [Sumber Jakpat](https://insight.jakpat.net/korean-drama-trends-in-indonesia/).
- **Deloitte Digital Media Trends 2025** melaporkan 56% responden Gen Z merasa konten media sosial lebih relevan daripada konten tradisional seperti TV dan film. Risetnya memakai survei 3.595 konsumen Amerika Serikat pada Oktober 2024. Temuan ini memberi alasan untuk menguji jalur penemuan melalui media sosial; tidak membuktikan perilaku yang sama pada Gen Z Indonesia atau niat berbagi hasil kuis. [Sumber Deloitte](https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html?stream=top).

Rekomendasi bahasa, durasi kuis, format kartu, dan target uji di bawah merupakan usulan produk yang perlu divalidasi. Riset tersebut tidak membuktikan bahwa seluruh Gen Z memiliki selera visual atau perilaku yang seragam.

## 3. Segmen yang disarankan

Sebagai asumsi kerja, fokus awal adalah **Gen Z Indonesia usia 18–27 tahun, mahasiswa dan pekerja awal karier yang menyukai K-drama**, khususnya yang mengenal The Trauma Code. Rentang ini adalah pilihan segmen produk, bukan definisi seluruh Gen Z.

Segmen sekunder adalah teman mereka yang belum menonton drama tetapi tertarik pada kuis kepribadian. Karena itu, pertanyaan dan hasil perlu tetap dapat dipahami tanpa pengetahuan tentang cerita atau karakter.

Kebutuhan utama yang perlu diuji: “Aku ingin hiburan singkat yang hasilnya terasa menggambarkan diriku dan menarik untuk dibandingkan dengan teman.”

## 4. Penilaian requirement saat ini

| Area dan rujukan | Penilaian | Implikasi dan rekomendasi |
| --- | --- | --- |
| Target pengguna, bagian 2 | Terlalu luas | “Penggemar drama dan pengguna umum” belum cukup untuk memilih bahasa, contoh situasi, dan kanal distribusi. Tetapkan segmen utama sebagai asumsi yang akan diuji. |
| Alur singkat, FR-01–FR-04 | Fondasi baik | Sepuluh pertanyaan dengan dua pilihan dan progres jelas memberi batas usaha yang mudah dipahami. Tambahkan estimasi durasi berdasarkan hasil uji, bukan klaim tentang pendeknya perhatian Gen Z. |
| Tanpa akun, NFR-01 dan NFR-09 | Pertahankan | Pengguna dapat mulai tanpa menyerahkan data pribadi. Tidak perlu menambah login, leaderboard, atau backend untuk memvalidasi konsep. |
| Isi pertanyaan, FR-02 | Perlu dipertajam | Gunakan situasi pertemanan, kerja kelompok, tenggat, konflik, dan keputusan sehari-hari. Hindari pilihan yang jelas memperlihatkan karakter atau membuat satu pilihan terasa lebih baik secara moral. |
| Bahasa, A-01 | Belum tervalidasi | Bahasa Inggris merupakan asumsi dokumen. Untuk segmen Indonesia, usulkan bahasa Indonesia yang santai dan mudah dipahami; judul serta nama karakter dapat dipertahankan. Jangan memaksakan slang. |
| Hasil, FR-07 | Menarik tetapi berisiko generik | Deskripsi dan kekuatan sudah tersedia sebagai kebutuhan. Tambahkan alasan kecocokan yang merujuk pada pola jawaban agar hasil lebih bermakna. Jangan menampilkan persentase kecocokan tanpa definisi perhitungan. |
| Kartu dan berbagi, FR-08 serta bagian 3.2 | Celah prioritas produk | Kartu di layar sudah menjadi hadiah visual, tetapi kegunaannya untuk berbagi belum diperiksa. Pada MVP, pastikan kartu terbaca dalam tangkapan layar. Bila penyebaran melalui teman menjadi sasaran utama, pertimbangkan unduh gambar sebagai fitur prioritas berikutnya. |
| Ponsel, NFR-04 dan NFR-11 | Belum cukup sebagai validasi penggunaan nyata | Tampilan responsif dan emulasi belum menguji penggunaan pada ponsel asli. Tambahkan pemeriksaan Android, iPhone/Safari, dan browser dalam aplikasi sosial yang benar-benar dipakai peserta uji. |
| Posisi A/B, FR-03 | Ada risiko di layar sempit | Aturan dua kolom dapat mempersempit teks. Karena posisi kiri/kanan berasal dari brief, pertahankan untuk peninjauan awal dan uji keterbacaannya. Perubahan menjadi susunan vertikal perlu dinyatakan sebagai perubahan requirement. |
| Animasi, NFR-06–NFR-07 | Arah sesuai, ukuran belum jelas | Animasi dapat memperkuat pengalaman mini-game. Hindari jeda buatan atau transisi yang menahan pengguna; visual ramai bukan syarat untuk menjangkau Gen Z. |
| Kecepatan akses | Belum memiliki kebutuhan terukur | Website statis tetap bisa lambat karena ukuran aset. Tambahkan ukuran kinerja dengan perangkat, jaringan, dan cara pengujian yang jelas. |
| Pengukuran keberhasilan, bagian 9 | Masih berfokus pada fungsi | Tambahkan uji pemahaman, penyelesaian, relevansi hasil, dan minat membagikan kartu. Kebutuhan ini dapat diperiksa melalui sesi uji tanpa pelacakan pengguna. |

## 5. Usulan perubahan yang diprioritaskan

**P0 — Sebelum menyusun desain:**

1. Tetapkan segmen utama, kebutuhan pengguna, dan bahasa antarmuka sebagai hipotesis produk.
2. Tambahkan pedoman isi pertanyaan: singkat, relevan dengan segmen, dan dua pilihan sama-sama masuk akal.
3. Tambahkan alasan kecocokan karakter berdasarkan jawaban ke FR-07. Penjelasan tetap dapat dibuat dari aturan lokal tanpa AI.
4. Tambahkan kriteria kartu yang layak ditangkap layar ke FR-08: nama, karakter, gelar, dan inti hasil terbaca dalam satu tangkapan layar pada viewport ponsel yang disepakati.
5. Tambahkan kebutuhan kecepatan dan uji ponsel nyata. Sebagai usulan awal, layar pembuka siap digunakan dalam maksimal 3 detik pada profil perangkat dan jaringan uji yang dicatat. Angka ini target internal, bukan temuan riset Gen Z.
6. Tambahkan validasi isi dan pengalaman kepada calon pengguna sebelum membekukan desain.

**P1 — Sesudah alur utama terbukti bekerja:**

- Unduh kartu sebagai gambar; menjadi kandidat masuk MVP jika distribusi sosial merupakan tujuan utama. Perubahan ini memperluas lingkup brief yang awalnya menempatkan unduh setelah MVP.
- Bagikan atau salin tautan kuis, disertai cara cadangan bila kemampuan browser tidak tersedia. Tidak perlu integrasi akun media sosial.

Kemampuan mengunduh atau membagikan harus diverifikasi terhadap batasan tanpa dependensi npm, API eksternal, dan backend. Tidak ada kebutuhan baru untuk menambahkan layanan tersebut.

## 6. Rencana validasi yang disarankan

Mulai dengan 5–8 calon pengguna dari segmen utama, termasuk penggemar dan orang yang belum mengenal dramanya. Ini uji formatif untuk menemukan masalah awal, bukan sampel yang mewakili seluruh pasar.

| Pertanyaan validasi | Cara memeriksa | Sasaran awal yang diusulkan |
| --- | --- | --- |
| Apakah manfaat dan langkah awal jelas? | Minta peserta membuka pembuka dan menjelaskan apa yang akan diperoleh. | Semua peserta memahami tujuan tanpa penjelasan fasilitator. |
| Apakah kuis mudah diselesaikan? | Amati penggunaan di ponsel dan catat waktu serta hambatan. | Sedikitnya 80% peserta menyelesaikan tanpa bantuan; median durasi maksimal 2 menit. |
| Apakah pertanyaan terasa dekat dan jelas? | Tanyakan bagian yang membingungkan atau tidak relevan setelah selesai. | Setiap pertanyaan yang berulang kali membingungkan direvisi sebelum desain dibekukan. |
| Apakah hasil terasa sesuai? | Minta peserta menilai kesesuaian 1–5 dan menjelaskan alasannya. | Median minimal 4/5 sebagai sasaran awal, disertai alasan; bukan ukuran validitas psikologis. |
| Apakah kartu berguna untuk berbagi? | Minta peserta mencoba menangkap layar dan tanyakan apakah mereka ingin mengirimnya kepada teman. | Kartu terbaca tanpa penyuntingan; catat minat berbagi sebagai temuan, bukan jaminan tindakan nyata. |

Catat jumlah peserta sebenarnya bersama angka hasil. Pengujian berbagi, performa, dan penggunaan ponsel baru dapat dilaksanakan setelah tersedia prototipe atau implementasi yang sesuai; saat ini belum dilakukan.

## 7. Catatan konsistensi dokumen

NFR-08 pada file saat ditinjau berbunyi “Menyalin gambar, poster, logo Netflix, atau karya terlindungi lainnya”, berbeda dari brief awal yang melarang penyalinan aset tersebut. Maksud requirement perlu diperjelas sebelum desain. Analisis ini tidak mengubah redaksi file tersebut.

## 8. Rekomendasi keputusan

Lanjutkan konsep sebagai kuis untuk segmen Gen Z penggemar K-drama, dengan revisi kebutuhan P0 terlebih dahulu. Prioritaskan bahasa dan isi yang relevan, hasil yang dapat dijelaskan, kartu yang mudah dibagikan secara visual, serta penggunaan ponsel yang cepat dan nyaman.

Kecocokan dengan Gen Z masih merupakan hipotesis yang perlu diuji. Requirement asli dipertahankan selama tahap analisis ini; `design.md`, `task.md`, dan kode aplikasi belum dibuat.
