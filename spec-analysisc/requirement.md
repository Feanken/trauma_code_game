# Requirement — Which Trauma Code Character Are You?

Status: Revisi 5 — musik latar dan efek suara sebagai fitur MVP yang dapat dimatikan
Tanggal: 29 Oktober 2026
Sumber: Brief proyek “Which Trauma Code Character Are You?” yang dilampirkan pengguna.

## 1. Tujuan dokumen

Dokumen ini merupakan tahap pertama SDD (*Specification-Driven Development*): kebutuhan → desain → tugas implementasi. Dokumen ini menjelaskan perilaku yang dibutuhkan dan cara memeriksa pemenuhannya.

Urutan dokumen yang digunakan:

1. `requirement.md`: kebutuhan, batasan, dan kriteria penerimaan.
2. `design.md`: rancangan antarmuka, alur aplikasi, struktur file, data, dan perhitungan skor berdasarkan kebutuhan yang disepakati.
3. `Task.md`: pekerjaan implementasi dan verifikasi yang merujuk pada ID kebutuhan.

Pada revisi ini, `requirement.md` diperbarui dan `design.md` dibuat sesuai arahan pengguna. `Task.md` telah disusun sebagai rencana implementasi. Implementasi dasar telah tersedia; audio revisi 5 telah diimplementasikan pada T23–T24; verifikasi perangkat dan pembaca layar baru pada T25 belum lengkap. Permintaan `docs/PLAN.md` dalam brief awal disesuaikan dengan arahan terbaru pengguna untuk memakai tiga dokumen SDD tersebut. `requirement-analysis.md` merupakan catatan analisis versi sebelumnya, bukan spesifikasi aktif.

## 2. Gambaran produk

Website kuis kepribadian yang terinspirasi drama Korea **The Trauma Code: Heroes on Call**. Pengguna menjawab 10 pertanyaan untuk mendapatkan satu karakter yang sesuai dengan pola jawabannya, lalu menerima kartu digital **Trauma Team ID Card**.

Proyek ini bersifat pribadi, nonkomersial, dan dibuat penggemar untuk hiburan serta belajar pengembangan web. Hasil kuis tidak boleh dinyatakan sebagai penilaian psikologis ilmiah atau diagnosis.

Sebagai fokus produk sementara, target utama adalah Gen Z Indonesia usia 18–27 tahun, terutama mahasiswa dan pekerja awal karier yang menyukai K-drama. Target sekunder adalah teman mereka yang tertarik kuis kepribadian walaupun belum mengenal drama. Rentang usia ini adalah pilihan segmen, bukan definisi seluruh Gen Z. Kecocokan pasar masih perlu diuji.

Kebutuhan pengguna yang dituju: hiburan singkat dengan hasil yang terasa relevan, menarik dilihat, dan mudah dibandingkan dengan teman. Pengetahuan medis atau pengetahuan tentang drama tidak menjadi syarat untuk menjawab pertanyaan.

Keberhasilan MVP (*Minimum Viable Product*, versi awal dengan fitur utama) berarti pengguna dapat menyelesaikan alur mulai → menjawab → melihat hasil → mengulang, dengan hasil yang konsisten dan tampilan yang nyaman digunakan.

## 3. Ruang lingkup

### 3.1 Fitur MVP

- Layar pembuka dengan judul, pengantar, dan tombol **Start Quiz**.
- Tepat 10 pertanyaan kepribadian, masing-masing dengan dua pilihan.
- Pilihan A di kiri dan pilihan B di kanan.
- Perpindahan otomatis setelah memilih jawaban, indikator progres, dan tombol kembali.
- Penghitungan skor lokal yang menghasilkan satu dari lima karakter.
- Hasil dengan deskripsi, kekuatan, pesan personal, dan tema visual sesuai karakter.
- Trauma Team ID Card yang dapat dilihat pada layar hasil.
- Tombol untuk mengulang kuis.
- Tampilan responsif, interaksi yang mudah diakses, dan penjelasan status proyek penggemar.
- Tampilan berdimensi melalui lapisan visual, pencahayaan, serta umpan balik sentuhan atau klik; detailnya ditetapkan di `design.md`.
- Kartu hasil yang mudah ditangkap layar pada ponsel, tanpa mewajibkan fitur unduh.
- Tilt dan sorotan kartu ID serta parallax dekorasi latar mengikuti mouse sesuai NFR-07; efek ini termasuk MVP pada kondisi input yang mendukung.

- Musik latar instrumental dan empat efek suara kontekstual, dengan kontrol musik/efek serta volume terpisah (FR-11–FR-12). Fitur wajib tersedia; pengguna bebas mematikannya.

### 3.2 Fitur setelah MVP

- Mengunduh kartu hasil sebagai gambar.
- Membagikan hasil melalui fitur berbagi atau tautan hasil.

Kartu yang tampil di layar termasuk MVP. Kemampuan mengunduh atau membagikannya belum menjadi syarat kelulusan MVP dan perlu spesifikasi tambahan sebelum dikerjakan.

### 3.3 Di luar ruang lingkup

- Login, akun, profil tersimpan, dan riwayat hasil pengguna.
- Backend, database, leaderboard, atau penyimpanan jawaban di server.
- Integrasi AI atau API eksternal untuk menghasilkan pertanyaan maupun hasil.
- Tes psikologi ilmiah, penilaian kesehatan, atau rekomendasi medis.
- Pembayaran dan monetisasi.

## 4. Perjalanan pengguna

| Tahap | Tindakan pengguna | Respons yang diharapkan |
| --- | --- | --- |
| Pembuka | Membuka website | Judul, pengantar, dan tombol mulai tersedia. |
| Mulai | Menekan Start Quiz | Pertanyaan pertama muncul dengan progres 1/10. |
| Menjawab | Memilih A atau B | Satu jawaban tersimpan dan pertanyaan berikutnya muncul. |
| Mengoreksi | Menekan Back | Pertanyaan sebelumnya dan jawaban yang telah dipilih ditampilkan. |
| Selesai | Menjawab pertanyaan ke-10 | Satu hasil karakter dan kartu ID ditampilkan. |
| Mengulang | Menekan tombol ulang | Jawaban dan skor lama dibersihkan; kuis dimulai dari pertanyaan pertama. |

Istilah “layar” menyatakan bagian pengalaman pengguna. Kebutuhan ini tidak mengharuskan setiap layar mempunyai halaman HTML atau URL terpisah.

## 5. Kebutuhan fungsional

Setiap kebutuhan memiliki ID agar dapat dirujuk kembali dalam `design.md`, `Task.md`, dan pemeriksaan hasil implementasi. Kriteria penerimaan menjelaskan kondisi yang harus dapat dibuktikan.

### FR-01 — Layar pembuka

Website harus menampilkan judul **“Which Trauma Code Character Are You?”**, pengantar singkat yang menyenangkan, dan tombol **Start Quiz** yang mudah ditemukan.

**Kriteria penerimaan:**

- Ketika website dibuka dalam sesi baru, layar pembuka tampil sebelum pertanyaan.
- Ketika Start Quiz diaktifkan, pertanyaan pertama tampil dengan progres 1/10.
- Memulai sesi baru tidak membawa jawaban atau skor dari percobaan sebelumnya.

### FR-02 — Isi pertanyaan

Kuis harus berisi tepat 10 pertanyaan. Setiap pertanyaan memiliki tepat dua pilihan yang berbeda dan mudah dipahami.

**Kriteria penerimaan:**

- Data kuis memuat 10 pertanyaan dan setiap pertanyaan memiliki pilihan A serta B.
- Pertanyaan mencakup kepemimpinan, empati, pemikiran logis, ambisi, kerja sama, dan pengambilan keputusan.
- Pertanyaan memakai situasi yang relevan dengan kehidupan sehari-hari dan dapat dijawab tanpa pengetahuan medis.
- Situasi mencakup pertemanan, kerja kelompok, tenggat, konflik, dan keputusan sehari-hari; kalimat singkat dalam bahasa Indonesia yang santai tanpa memaksakan slang.
- Kedua pilihan menggambarkan kecenderungan kepribadian; tidak dipresentasikan sebagai jawaban benar atau salah.

### FR-03 — Memilih jawaban dan berpindah pertanyaan

Sistem harus menampilkan satu pertanyaan pada satu waktu, dengan pilihan A di kiri dan pilihan B di kanan. Setelah satu pilihan diaktifkan, sistem menyimpan jawaban dan melanjutkan otomatis.

**Kriteria penerimaan:**

- Untuk pertanyaan 1–9, memilih satu jawaban membawa pengguna tepat satu pertanyaan ke depan tanpa tombol Next.
- Satu pertanyaan hanya memiliki satu jawaban aktif.
- Klik atau ketukan berulang selama transisi tidak melewati pertanyaan atau menggandakan jawaban.
- Ketika pertanyaan ke-10 dijawab, sistem menampilkan hasil setelah seluruh 10 pertanyaan terjawab.
- Selama transisi, pilihan untuk pertanyaan yang belum siap tidak dapat terpicu secara tidak sengaja.

### FR-04 — Indikator progres

Sistem harus menunjukkan nomor pertanyaan yang sedang ditampilkan dan jumlah total pertanyaan.

**Kriteria penerimaan:**

- Pertanyaan pertama menampilkan 1/10 dan pertanyaan terakhir menampilkan 10/10.
- Progres mengikuti pertanyaan aktif saat pengguna maju maupun kembali.
- Progres memiliki informasi teks yang dapat dibaca; pengguna tidak perlu menafsirkan warna saja.

### FR-05 — Kembali dan mengubah jawaban

Pengguna harus dapat membuka pertanyaan sebelumnya melalui tombol **Back** dan mengganti jawaban tanpa menambah jumlah jawaban atau menghitung pilihan lama dua kali.

**Kriteria penerimaan:**

- Pada pertanyaan 2–10, Back membuka tepat satu pertanyaan sebelumnya.
- Pada pertanyaan pertama, Back disembunyikan atau dinonaktifkan.
- Saat pertanyaan dikunjungi kembali, pilihan sebelumnya terlihat sebagai pilihan aktif.
- Mengaktifkan pilihan yang sama maupun pilihan berbeda melanjutkan ke pertanyaan berikutnya.
- Jawaban pada pertanyaan lain tetap tersimpan sampai diganti atau sesi diulang.
- Hasil akhir hanya memakai jawaban terbaru untuk masing-masing pertanyaan.

### FR-06 — Skor dan penentuan karakter

Setiap pilihan jawaban harus memberi kontribusi skor kepada satu atau lebih karakter melalui aturan yang telah ditentukan. Sistem harus menghitung satu hasil berdasarkan seluruh jawaban terbaru, tanpa proses acak.

**Kriteria penerimaan:**

- Pertanyaan dan kontribusi skor setiap pilihan tersedia dalam data JavaScript lokal.
- Semua pilihan mempunyai aturan skor yang eksplisit, dan setiap pertanyaan dapat memengaruhi perhitungan.
- Sepuluh jawaban yang sama selalu menghasilkan karakter yang sama.
- Jika skor tertinggi seri, aturan pemecah seri yang tetap menghasilkan tepat satu karakter.
- Kelima karakter dapat menjadi hasil akhir melalui setidaknya satu kombinasi jawaban yang valid untuk masing-masing karakter.
- Distribusi hasil dari seluruh 1.024 kombinasi jawaban ditinjau untuk mendeteksi dominasi karakter yang tidak disengaja. Penilaian mempertimbangkan kontribusi skor dan dampak pemecah seri.
- Hasil tinjauan keseimbangan dicatat saat verifikasi; target persentase dan aturan pemecah seri ditetapkan dalam `design.md` sebelum implementasi.

Kesempatan yang wajar tidak harus berarti distribusi tepat 20% untuk setiap karakter. Namun, karakter tidak boleh hanya menjadi pilihan formal yang praktis tidak mungkin diperoleh karena pembobotan atau pemecah seri. Rumus, bobot, dan ukuran keseimbangan merupakan keputusan desain yang masih perlu ditetapkan.

### FR-07 — Hasil kepribadian

Setelah seluruh pertanyaan dijawab, sistem harus menampilkan satu dari lima hasil berikut sesuai penamaan dalam brief:

| Karakter | Gelar kepribadian |
| --- | --- |
| Baek Kang-hyuk | The Fearless Leader |
| Yang Jae-won | The Thoughtful Learner |
| Cheon Jang-mi | The Heart of the Team |
| Park Gyeong-won | The Calm Specialist |
| Han Yu-rim | The Strategic Thinker |

**Kriteria penerimaan:**

- Setiap hasil memuat nama karakter, gelar, deskripsi singkat, kekuatan kepribadian, dan pesan yang menyenangkan sesuai karakter tersebut.
- Hasil memuat sedikitnya satu alasan kecocokan berdasarkan jawaban terbaru, memakai aturan lokal yang dapat dijelaskan. Persentase kecocokan psikologis tidak ditampilkan.
- Setiap karakter memiliki tema visual yang dapat dibedakan dan tetap terbaca.
- Identitas karakter dijelaskan melalui teks, bukan hanya warna atau gambar.
- Isi hasil berasal dari data lokal yang telah ditulis, tanpa panggilan AI atau API.
- Hasil tidak tampil ketika masih ada pertanyaan yang belum dijawab.

### FR-08 — Trauma Team ID Card

Layar hasil harus memberikan kartu digital bergaya identitas staf rumah sakit sebagai hadiah visual.

**Kriteria penerimaan:**

- Kartu menampilkan label **Trauma Team ID Card**, nama karakter, dan gelar kepribadian yang sesuai dengan hasil.
- Tema kartu konsisten dengan tema karakter yang diperoleh.
- Kartu dapat dilihat utuh di ponsel maupun desktop tanpa teks terpotong.
- Nama karakter, gelar, dan ringkasan hasil dapat ditangkap dalam satu tangkapan layar tanpa menyunting gambar pada viewport 320 × 568 CSS px dan 375 × 667 CSS px setelah pengguna menggulir ke kartu. Deskripsi panjang ditempatkan di luar kartu.
- Pengguna tidak harus memasukkan nama, foto, atau data pribadi untuk memperoleh kartu.
- Tampilan kartu di layar berfungsi tanpa fitur unduh atau berbagi.

### FR-09 — Mengulang kuis

Layar hasil harus menyediakan tombol untuk mengulang kuis.

**Kriteria penerimaan:**

- Ketika tombol ulang diaktifkan, semua jawaban, skor, progres, dan hasil dari percobaan sebelumnya dibersihkan.
- Pertanyaan pertama tampil kembali dengan progres 1/10 dan tanpa pilihan aktif.
- Percobaan baru dapat menghasilkan karakter berbeda jika jawabannya berbeda.
- Pengguna dapat menyelesaikan dan mengulang kuis beberapa kali tanpa memuat ulang halaman.

### FR-10 — Informasi proyek dan batas makna hasil

Website harus menjelaskan bahwa proyek dibuat penggemar, bersifat nonkomersial, tidak berafiliasi secara resmi dengan pemegang hak, dan ditujukan untuk hiburan.

**Kriteria penerimaan:**

- Keterangan proyek penggemar dapat ditemukan pada layar pembuka dan hasil.
- Layar hasil menyatakan bahwa kuis bukan penilaian psikologis ilmiah atau diagnosis.
- Teks antarmuka dan kartu tidak menyatakan hasil sebagai identitas staf medis resmi.

### FR-11 — Musik latar dan efek suara

Audio menambah suasana drama medis Korea yang tegang, bersemangat, dan heroik seperti referensi *The Trauma Code*. Pilihan lagu diserahkan kepada agen; tidak wajib memakai satu judul atau OST tertentu. Musik/efek boleh diambil dari internet dan disimpan lokal. OST The Trauma Code atau drama Korea lain dapat menjadi kandidat bila ada berkas yang dapat dipakai pada proyek; pemilihan final harus didengarkan, bukan disimpulkan dari judul saja. Tidak perlu menambahkan halaman kredit pada alur kuis.

**Kriteria penerimaan:**

- Satu musik instrumental tanpa vokal mengalun selama kuis dan hasil; empat efek singkat untuk mulai/ulang, jawaban diterima, Back diterima, dan hasil muncul. Musik tidak menutupi keterbacaan atau pengumuman pembaca layar; tidak memakai alarm keras atau detak monitor terus-menerus.
- Halaman baru diam. Musik/efek baru dapat mulai setelah tindakan pengguna yang dijelaskan di FR-12. Tidak ada `autoplay` saat membuka atau me-refresh halaman.
- Efek hanya dipicu oleh aksi yang diterima controller. Klik ganda yang diabaikan, hover, fokus, dan tombol nonaktif tidak menghasilkan efek tambahan. Hasil hanya berbunyi sekali untuk hasil yang benar-benar dirender.
- Musik mengulang dengan sambungan yang tidak mengagetkan, satu pemutar saja; ulang kuis mempertahankan preferensi dan musik yang sedang berjalan tanpa menumpuk pemutar baru.
- Semua audio berasal dari host sendiri. Kegagalan unduhan, decode, atau izin playback browser tidak menunda navigasi, skor, hasil, dan pengulangan.

### FR-12 — Kontrol dan siklus hidup audio

**Kriteria penerimaan:**

- Kontrol musik dan efek terpisah tersedia pada pembuka, kuis, dan hasil, masing-masing dengan tombol Aktif/Mati dan volume 0–100%. Nilai awal yang dirancang rendah; rincian di desain 12.
- Sebelum Start Quiz, ada keterangan singkat bahwa audio dimulai setelah menekan Start Quiz dan bisa dimatikan. Pengguna dapat mematikan kedua kanal sebelum mulai. Mengaktifkan musik secara eksplisit juga merupakan tindakan yang boleh memulai audio pada pembuka.
- Menonaktifkan kanal segera menghentikan suaranya. Mematikan musik tidak mematikan efek, dan sebaliknya. Volume nol tidak dibatalkan oleh jawaban, hasil, atau ulang.
- Pengaturan berlaku selama halaman terbuka dan bertahan ketika kuis diulang. Refresh kembali ke pengaturan awal dan tetap diam sampai tindakan berikutnya; tidak menggunakan browser storage.
- Saat tab tersembunyi atau jendela kehilangan fokus, hentikan efek tertunda dan jeda musik. Saat kembali, musik tetap dijeda sampai pengguna mengaktifkannya melalui kontrol musik. Reset/callback lama tidak boleh menghidupkan suara kembali.
- Kontrol native dapat digunakan dengan Tab/Enter/Space dan tombol panah untuk volume, dengan nama serta status yang jelas. Semua informasi tetap tersedia saat audio dimatikan. Reduced motion mengatur gerakan, bukan menyalakan atau mematikan audio secara diam-diam.

## 6. Kebutuhan nonfungsional

| ID | Kebutuhan | Kriteria penerimaan |
| --- | --- | --- |
| NFR-01 | Teknologi sederhana dan statis | Hanya HTML5, CSS3, dan Vanilla JavaScript ES6+. Tidak ada framework JavaScript, TypeScript, backend, database, Node.js, dependensi npm, autentikasi, atau integrasi AI. |
| NFR-02 | Eksekusi lokal di browser | Pertanyaan, jawaban, skor, hasil, dan perpindahan layar diproses di browser. Alur kuis tidak memerlukan permintaan API eksternal. |
| NFR-03 | Hosting statis | Seluruh alur MVP berjalan melalui server file statis seperti Nginx tanpa proses build atau runtime aplikasi server. |
| NFR-04 | Responsif | Pada lebar viewport 320 px, 375 px, 768 px, dan 1280 px, tidak ada gulir horizontal halaman atau konten utama yang terpotong. Pilihan A tetap di kiri dan B di kanan, teks dapat membungkus, dan keduanya mudah ditekan. |
| NFR-05 | Aksesibilitas dasar | Semua kontrol dapat digunakan dengan keyboard, memiliki nama yang jelas dan fokus terlihat. Perpindahan pertanyaan dan hasil dapat diketahui pengguna pembaca layar. Target sentuh utama minimal 44 × 44 CSS px. Teks biasa memiliki rasio kontras minimal 4,5:1. |
| NFR-06 | Gerakan dan kenyamanan | Perpindahan pertanyaan, interaksi pilihan, dan pengungkapan hasil memakai animasi halus tanpa penantian hasil buatan. Preferensi `prefers-reduced-motion` dihormati dengan mengurangi atau meniadakan animasi yang tidak esensial. Konten dan fungsi tetap tersedia ketika animasi dimatikan. |
| NFR-07 | Kedalaman visual | Pembuka, pilihan jawaban, dan kartu hasil memiliki hierarki lapisan, pencahayaan atau gradasi, bayangan, dan batas permukaan yang konsisten. Kontrol menunjukkan keadaan biasa, fokus, ditekan, terpilih, dan nonaktif yang dapat dibedakan. Tema drama medis tetap terbaca dan nyaman. Pada input mouse yang mendukung hover/fine pointer dan tanpa reduced motion, pratinjau kartu ID di pembuka serta kartu hasil wajib miring dan memiliki sorotan mengikuti posisi pointer; dua lapisan dekorasi latar bergerak halus mengikuti arah mouse. Pertanyaan, pilihan jawaban, dan tombol tetap stabil. Efek kembali netral saat pointer keluar, layar berganti, atau jendela kehilangan fokus. Pada sentuhan, mode keyboard, atau reduced motion, gunakan tampilan statis dengan fungsi lengkap. Rincian dan batas gerakan ditetapkan dalam desain. |
| NFR-08 | Aset visual | Gambar karakter dan aset pendukung dapat diambil dari internet; tidak wajib dibuat orisinal. Gunakan lima gambar karakter dari internet untuk proyek pribadi ini; tidak diperlukan pencatatan izin, lisensi, sumber, atau kredit pada aplikasi. Foto karakter dapat digunakan pada hasil dan kartu ID. Simpan salinan aset yang diizinkan secara lokal agar kuis tidak bergantung pada host gambar pihak ketiga. |
| NFR-09 | Privasi | MVP tidak meminta data pribadi, mengirim jawaban keluar browser, atau memakai pelacakan pengguna. |
| NFR-10 | Kemudahan dipelajari | Kode mudah dibaca dan dibagi menurut tanggung jawab, dengan penamaan konsisten. Aturan skor dan bagian yang tidak langsung jelas diberi penjelasan singkat. Struktur rinci ditetapkan dalam desain tanpa menambah alat yang tidak diperlukan. |
| NFR-11 | Kompatibilitas dasar | Alur utama diverifikasi di Chromium dan Firefox desktop serta Chrome Android dan Safari iPhone pada perangkat nyata. Browser dalam aplikasi sosial diperiksa bila dipakai peserta uji. Browser, versi, perangkat, dan pengujian yang belum tersedia dicatat; emulasi tidak dinyatakan sebagai uji perangkat nyata. |
| NFR-12 | Interaksi lintas perangkat | Respons visual tersedia untuk klik, sentuhan, dan keyboard. Informasi atau tombol penting tidak hanya muncul saat hover. Efek kedalaman tidak menggeser tata letak atau memperkecil area tekan saat dipakai. |
| NFR-13 | Kecepatan | Target internal: median layar pembuka siap dipakai maksimal 3 detik dari lima pemuatan tanpa cache, pada profil uji yang ditetapkan dalam desain. Total transfer awal terkompresi maksimal 300 KiB. Perangkat, jaringan, hasil ukur, dan keterbatasan dicatat. |
| NFR-14 | Validasi pengalaman | Sebelum peluncuran, lakukan uji formatif dengan 5–8 calon pengguna: sedikitnya 80% menyelesaikan tanpa bantuan, median waktu maksimal 2 menit, dan median relevansi hasil minimal 4/5. Pertanyaan yang berulang kali membingungkan diperbaiki. Catat pembilang/penyebut dan alasan penilaian. Minat berbagi dicatat tanpa mengklaim keterwakilan pasar atau validitas psikologis. |
| NFR-15 | Audio ringan dan tangguh | Tidak mengunduh audio sebelum tindakan pengguna. Batas awal transfer 300 KiB dan median siap pakai 3 detik tetap berlaku. Aset audio tambahan maksimal 1,2 MiB (BGM maksimal 1 MiB, seluruh efek maksimal 200 KiB). Alur kuis tidak menunggu kesiapan audio; playback yang ditolak ditangani tanpa unhandled rejection, tumpukan suara, atau loop retry. |

## 7. Asumsi untuk ditinjau

Poin berikut belum dinyatakan secara tegas dalam brief. Poin ini menjadi dasar sementara untuk tahap desain dan dapat disesuaikan saat peninjauan.

| ID | Asumsi sementara | Dampak |
| --- | --- | --- |
| A-01 | Dokumen, pertanyaan, dan penjelasan hasil memakai bahasa Indonesia sederhana sebagai keputusan awal untuk segmen Indonesia. Judul proyek, nama, gelar karakter, Start Quiz, Back, dan Trauma Team ID Card mengikuti brief. | Belum ada pilihan bahasa atau terjemahan ganda; bahasa perlu divalidasi dengan pengguna. |
| A-02 | Jawaban hanya disimpan selama sesi halaman berjalan. Memuat ulang atau menutup halaman menghapus progres; kunjungan berikutnya dimulai dari pembuka. | Pemulihan sesi dan penyimpanan browser belum dibutuhkan. |
| A-03 | Urutan 10 pertanyaan dan posisi pilihan tetap pada setiap percobaan. | Memudahkan pengguna belajar, mengoreksi jawaban, dan memeriksa konsistensi hasil. |
| A-04 | Back mengacu pada tombol di dalam kuis. | Sinkronisasi dengan tombol Back/Forward browser tidak termasuk MVP. |
| A-05 | Pesan personal disesuaikan dengan karakter hasil, tanpa meminta identitas pengguna. | Seluruh teks hasil dapat disiapkan di data lokal. |

## 8. Kasus tepi yang wajib ditangani

| Kondisi | Perilaku yang diharapkan | Rujukan |
| --- | --- | --- |
| Tombol Back pada pertanyaan pertama | Tidak dapat berpindah ke indeks sebelum pertanyaan pertama. | FR-05 |
| Ketukan cepat atau aktivasi tombol berulang | Hanya satu jawaban diterima untuk pertanyaan yang sedang aktif; tidak ada pertanyaan terlewati. | FR-03 |
| Jawaban diubah setelah kembali beberapa langkah | Hanya pilihan terbaru yang dihitung; jawaban pertanyaan lain tetap tersimpan. | FR-05, FR-06 |
| Dua atau lebih karakter memiliki skor tertinggi yang sama | Satu karakter dipilih dengan aturan seri yang telah ditetapkan. | FR-06 |
| Belum ada 10 jawaban lengkap | Hasil belum ditampilkan. | FR-07 |
| Kuis diulang setelah hasil tampil | Tidak ada jawaban, skor, atau tema hasil lama yang terbawa. | FR-09 |
| Teks pertanyaan panjang pada layar sempit | Teks membungkus dan kontrol tetap terbaca serta dapat diaktifkan. | NFR-04, NFR-05 |
| Pengguna memilih pengurangan gerakan | Pengalaman tetap lengkap dengan animasi dikurangi atau ditiadakan. | NFR-06 |
| Halaman dimuat ulang di tengah kuis | Kembali ke pembuka dengan sesi kosong, sesuai asumsi sementara. | A-02 |

## 9. Kriteria penerimaan MVP secara keseluruhan

MVP dinyatakan memenuhi spesifikasi apabila:

1. Alur pembuka → 10 pertanyaan → hasil dan kartu ID → ulang berjalan lengkap.
2. Semua kebutuhan FR-01 sampai FR-12 dan NFR-01 sampai NFR-15 terpenuhi.
3. Lima karakter dapat diperoleh melalui kombinasi jawaban yang valid, dengan bukti peninjauan distribusi hasil dan aturan seri.
4. Mengubah jawaban, ketukan cepat, hasil seri, dan mengulang kuis tidak merusak progres atau perhitungan.
5. Kuis dapat diselesaikan dengan keyboard dan nyaman pada ukuran layar verifikasi.
6. Website dapat dijalankan melalui hosting statis tanpa instalasi dependensi aplikasi atau konfigurasi backend.
7. Hasil verifikasi dicatat, termasuk browser yang diuji dan keterbatasan yang masih diketahui.

## 10. Keputusan untuk tahap berikutnya

`design.md` menjabarkan kebutuhan revisi ini menjadi:

- Isi final 10 pertanyaan, dua pilihan per pertanyaan, serta kelima deskripsi hasil.
- Bobot skor, aturan pemecah seri, dan target keseimbangan yang dapat diperiksa.
- Rancangan layar, tema lima karakter, kartu ID, dan perilaku fokus saat berpindah layar.
- Struktur file, bentuk data lokal, serta pengelolaan progres dan jawaban.
- Cara memeriksa kebutuhan fungsional, responsivitas, aksesibilitas, dan distribusi hasil tanpa dependensi aplikasi tambahan.

`Task.md` kemudian memecah rancangan menjadi pekerjaan kecil dengan rujukan ID kebutuhan dan langkah verifikasinya. Dokumen desain pada tahap ini adalah rancangan, bukan tampilan yang sudah diimplementasikan atau diuji pada pengguna. Daftar tugas tersedia di `Task.md`; pengerjaan kode aplikasi menunggu arahan berikutnya.

## 11. Catatan revisi 2

- Memperjelas kebutuhan visual interaktif dan berdimensi sesuai arahan pengguna.
- Mengadopsi fokus Gen Z Indonesia, bahasa Indonesia, alasan hasil, dan kartu yang mudah ditangkap layar sebagai dasar desain awal; kecocokan pengguna belum terbukti.
- Menambahkan pemeriksaan kecepatan, penggunaan ponsel nyata, dan validasi pengalaman. Unduh serta berbagi tetap setelah MVP.
- Memperjelas redaksi NFR-08 agar konsisten dengan brief awal tentang aset orisinal.

## 12. Catatan revisi 3

Sesuai arahan terbaru pengguna, kewajiban membuat semua aset orisinal dan larangan menyeluruh gambar drama pada brief awal diganti dengan penggunaan gambar dari internet, termasuk foto karakter. Pemilihan aset tetap mencatat sumber, izin penggunaan, dan atribusi yang diperlukan. Pengadaan gambar dilakukan saat implementasi; revisi dokumen ini belum mengunduh aset.

## 13. Catatan revisi 4

Efek mengikuti mouse menjadi kebutuhan MVP bersyarat perangkat, menggantikan status tilt opsional. Cakupan: pratinjau kartu ID pembuka, kartu ID hasil, sorotan pada kedua kartu, dan dua lapisan dekorasi latar. Pertanyaan serta kontrol tetap stabil. Tampilan statis wajib untuk sentuhan, mode keyboard, dan reduced motion. Perubahan ini menyelaraskan desain, T13/T16/T17, dan steering; implementasi belum dimulai.


## 14. Catatan revisi 5 — 29 Oktober 2026

Pengguna meminta musik dan efek dengan suasana The Trauma Code serta memberi kebebasan memilih sumber, termasuk mempertimbangkan OST drama Korea. FR-11, FR-12, dan NFR-15 menambahkan audio sebagai fitur MVP yang dapat dimatikan tanpa mengubah isi pertanyaan, hasil, atau skor. Kebijakan halaman baru tetap diam dipertahankan; Start Quiz atau kontrol musik merupakan tindakan pemicu yang dijelaskan kepada pengguna. Rincian implementasi berada di desain 12 dan tugas baru T23–T25. Revisi ini menyiapkan dokumen, belum memasang atau mengklaim audio sudah terdengar.
