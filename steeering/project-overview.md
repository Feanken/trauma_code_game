# Project Overview — Panduan Agen AI

Proyek: **Which Trauma Code Character Are You?**  
Tanggal dibuat: 28 Oktober 2026  
Metode: **SDD — Specification-Driven Development**  
Fungsi: konteks produk dan pedoman kerja umum bagi agen AI yang membantu proyek ini.

## 1. Tujuan panduan

Gunakan dokumen ini untuk memahami produk, batasan, dan hubungan antara spesifikasi, tugas, implementasi, serta verifikasi. Detail kebutuhan tetap berada pada dokumen SDD agar tidak ada dua sumber aturan yang berbeda.

Dokumen ini adalah steering proyek, bukan skill, daftar tugas implementasi, atau bukti bahwa website sudah dibuat. Nama folder sengaja mengikuti permintaan pengguna: `steeering/`. Jangan menggantinya menjadi nama lain tanpa kebutuhan yang diminta pengguna.

## 2. Gambaran produk

Bangun website kuis kepribadian yang terinspirasi **The Trauma Code: Heroes on Call**. Pengguna menjawab tepat **10 pertanyaan**, masing-masing dengan **dua pilihan**, untuk mendapatkan satu dari lima karakter dan kartu digital **Trauma Team ID Card**.

Proyek ini bersifat pribadi, nonkomersial, dan fan-made. Tujuannya adalah hiburan serta belajar pengembangan web. Hasil tidak boleh dipresentasikan sebagai diagnosis atau penilaian psikologis ilmiah; identitas visual tidak boleh menyiratkan afiliasi resmi.

Alur utama: **pembuka → kuis → hasil dan kartu ID → ulangi kuis**. Pengguna dapat kembali untuk mengganti jawaban. Semua perhitungan berlangsung di browser, dan jawaban terbaru menjadi dasar hasil.

## 3. Pengguna dan pengalaman yang dituju

Fokus awal adalah Gen Z Indonesia usia 18–27 tahun, terutama mahasiswa dan pekerja awal karier yang menyukai K-drama. Teman yang belum mengenal drama juga harus dapat mengikuti kuis tanpa pengetahuan medis atau pengetahuan cerita.

Kebutuhan yang dituju: hiburan singkat, pertanyaan yang dekat dengan kehidupan sehari-hari, dan hasil yang terasa relevan serta menarik dibandingkan dengan teman. Kesesuaian pasar merupakan hipotesis yang perlu diuji, bukan fakta yang sudah terbukti.

Pertanyaan, penjelasan hasil, dokumentasi, dan komunikasi memakai bahasa Indonesia sederhana. Judul proyek, nama serta gelar karakter, dan label tertentu mengikuti spesifikasi. Hindari slang yang dipaksakan atau istilah teknis tanpa penjelasan ketika berkomunikasi dengan pengguna yang sedang belajar.

## 4. Sumber acuan

| Dokumen | Fungsi | Cara memakai |
| --- | --- | --- |
| [requirement.md](../spec-analysisc/requirement.md) | Kebutuhan produk, batasan, asumsi, dan kriteria penerimaan. | Tentukan apa yang harus dipenuhi melalui ID FR/NFR. Versi aktif adalah revisi 5, termasuk FR-11/FR-12 untuk audio. |
| [design.md](../spec-analysisc/design.md) | Alur, visual, isi kuis, aturan skor, arsitektur, serta metode verifikasi. | Tentukan bagaimana kebutuhan diwujudkan. Bagian 11 memuat keputusan terbaru tentang gambar dari internet. |
| [Task.md](../spec-analysisc/Task.md) | Urutan 22 tugas, dependensi, dan kriteria selesai. | Pilih pekerjaan yang sesuai permintaan dan periksa dependensinya. Gunakan kapitalisasi nama file ini. |
| [requirement-analysis.md](../spec-analysisc/requirement-analysis.md) | Catatan analisis Gen Z sebelum revisi berikutnya. | Gunakan sebagai konteks historis; jangan menganggap rekomendasi atau kekurangan lama masih menjadi keputusan aktif. |
| `steeering/project-overview.md` | Ringkasan konteks dan cara kerja agen. | Gunakan sebagai pengantar, lalu baca bagian spesifikasi yang relevan. |

Instruksi terbaru pengguna menentukan perubahan yang diinginkan dalam batas instruksi yang berlaku. Untuk dokumen proyek, requirement menentukan kebutuhan, design menjabarkan solusi, dan Task menjabarkan pelaksanaannya. Steering tidak menambahkan fitur atau menggantikan kriteria penerimaan.

Jika ada ketidaksesuaian, identifikasi bagian yang bertentangan. Bila maksudnya sudah jelas dari arahan pengguna, selaraskan dokumen yang terdampak sebelum menerapkan perubahan. Bila keputusan produk belum jelas dan berpengaruh pada pekerjaan, minta klarifikasi singkat sambil meneruskan pekerjaan independen yang tetap valid. Jangan mengubah kebutuhan diam-diam hanya agar pemeriksaan lulus.

## 5. Ruang lingkup produk

### MVP yang dituju

- Pembuka yang menjelaskan kuis dan menyediakan Start Quiz.
- Sepuluh pertanyaan dengan A di kiri, B di kanan, progres n/10, perpindahan otomatis, serta Back untuk mengoreksi jawaban.
- Hasil deterministik untuk salah satu dari lima karakter; semua karakter dapat diperoleh.
- Nama, gelar, deskripsi, kekuatan, pesan, dan alasan kecocokan berdasarkan jawaban terbaru.
- Kartu ID bertema karakter dengan foto dari internet, yang nyaman dilihat dan ditangkap layar pada ponsel.
- Tombol ulang yang membersihkan jawaban, skor turunan, progres, hasil, dan tema lama.
- Responsivitas, aksesibilitas, reduced motion, privasi, dan kecepatan sesuai requirement.

### Setelah MVP atau di luar lingkup

Unduh kartu, integrasi berbagi, dan tautan hasil berada setelah MVP. Tilt/sorotan pada pratinjau kartu pembuka dan kartu hasil serta parallax dua lapisan dekorasi latar wajib pada kondisi mouse yang mendukung, sesuai desain 3.6. Pada touch, keyboard, dan reduced motion, gunakan tampilan netral dengan fungsi lengkap. Login, akun, leaderboard, backend, database, AI dalam aplikasi, monetisasi, dan riwayat pengguna tidak termasuk lingkup saat ini.

Jangan menambahkan fitur atau dependensi hanya karena umum dipakai pada proyek lain. Jika pengguna meminta perluasan lingkup, perbarui dokumen SDD yang terkait dan lanjutkan sesuai otorisasi tersebut.

## 6. Arah visual dan aset

Pengalaman yang diminta adalah mini-game bertema drama medis dengan **kedalaman visual dan interaksi yang terasa**, melalui lapisan, bayangan, highlight, gradasi, efek tekan, transisi pertanyaan, dan pengungkapan kartu hasil. Hierarki teks serta keterbacaan tetap jelas pada ponsel.

Bedakan kedalaman visual dari interaksi: kedalaman membuat permukaan terasa berlapis, sedangkan interaksi memberi respons terhadap tindakan pengguna. Implementasi harus memenuhi keduanya, termasuk respons keyboard dan sentuhan. Efek hover, tilt, atau animasi tidak boleh menjadi satu-satunya jalan mengakses informasi.

Gambar karakter boleh dicari dari internet; **tidak ada kewajiban membuat semua aset orisinal**. Keputusan ini menggantikan batasan aset pada brief awal. Ikuti NFR-08 dan desain bagian 11 untuk pemilihan, pencatatan sumber/izin, atribusi, penyimpanan lokal, optimasi, crop, serta fallback gambar. Pencarian dan unduhan pada tahap pengembangan berbeda dari ketergantungan jaringan aplikasi: kuis yang dijalankan tidak memakai hotlink atau API eksternal.

Lima hasil yang harus dipertahankan:

| Karakter | Gelar |
| --- | --- |
| Baek Kang-hyuk | The Fearless Leader |
| Yang Jae-won | The Thoughtful Learner |
| Cheon Jang-mi | The Heart of the Team |
| Park Gyeong-won | The Calm Specialist |
| Han Yu-rim | The Strategic Thinker |

## 7. Batasan teknis

Gunakan **HTML5, CSS3, dan Vanilla JavaScript ES6+**. Website sepenuhnya statis dan dapat disajikan melalui server file seperti Nginx tanpa proses build aplikasi.

Tidak memakai React, Next.js, Vue, framework JavaScript lain, TypeScript, Node.js, dependensi npm, backend, database, API AI, autentikasi, atau pelacakan pengguna. Penggunaan agen AI untuk membantu pengembangan tidak berarti produk perlu integrasi AI.

Struktur aplikasi mengikuti desain: `index.html`, `css/style.css`, `js/data.js`, `js/quiz.js`, `js/ui.js`, `js/script.js`, aset lokal, dan pemeriksa browser tanpa dependensi. Pisahkan data, logika skor, render UI, dan pengelolaan sesi. Hindari kerumitan yang tidak membantu pemula memahami proyek.

Semua jalur aplikasi seperti `assets/`, `js/`, `checks/`, dan `docs/` dalam spesifikasi mengacu pada root proyek, bukan folder steering atau spesifikasi. Hubungan folder saat panduan dibuat:

```text
Trauma_Code_Quiz_Game/
├── spec-analysisc/
│   ├── requirement.md
│   ├── requirement-analysis.md
│   ├── design.md
│   └── Task.md
└── steeering/
    └── project-overview.md
```

## 8. Cara kerja agen dengan SDD

1. **Pahami permintaan aktif.** Tentukan apakah pengguna meminta analisis, perubahan spesifikasi, steering, tugas, atau implementasi. Kerjakan tahap yang diminta; membuat dokumen tidak otomatis memulai aplikasi.
2. **Periksa kondisi nyata.** Baca panduan proyek yang berlaku, dokumen aktif, file terkait, dan status tugas. Jangan menimpa perubahan pengguna atau mengasumsikan status dari percakapan lama.
3. **Telusuri kebutuhan.** Hubungkan pekerjaan dengan FR/NFR, bagian desain, serta ID Txx yang sesuai. Untuk pekerjaan dokumentasi steering, cukup pastikan konsistensi dengan dokumen tersebut; tidak perlu membuat tugas fitur baru.
4. **Selaraskan perubahan.** Jika permintaan mengubah produk, perbarui requirement → design → Task sesuai dampaknya. Perubahan rutin yang tetap sesuai spesifikasi tidak memerlukan revisi keseluruhan dokumen.
5. **Implementasikan secara bertahap ketika diminta.** Ikuti dependensi dan buat perubahan yang dapat ditinjau. Setelah implementasi diotorisasi, lanjutkan pekerjaan yang tercakup tanpa meminta konfirmasi ulang untuk setiap tugas.
6. **Verifikasi sesuai dampak.** Gunakan kriteria penerimaan dan pemeriksaan yang relevan. Perubahan skor mewajibkan enumerasi ulang seluruh 1.024 kombinasi; perubahan visual diperiksa pada ukuran layar dan mode input terkait. Perubahan dokumentasi diperiksa konsistensi serta jalurnya.
7. **Catat hasil sebenarnya.** Centang Task hanya setelah kriteria selesai terpenuhi. Saat implementasi berlangsung, simpan bukti pada `docs/verification.md` sesuai format Task, termasuk pemeriksaan yang belum bisa dilakukan.
8. **Laporkan dengan jelas.** Jelaskan perubahan, alasan pentingnya, verifikasi yang dilakukan, dan pekerjaan atau keterbatasan yang tersisa. Jangan menyatakan perencanaan sebagai implementasi atau kesiapan rilis sebagai deployment.

## 9. Standar penyelesaian

Gunakan kriteria selesai masing-masing tugas dan penerimaan MVP pada requirement sebagai dasar penilaian. Detail target distribusi skor, kecepatan, ukuran transfer, viewport, serta uji pengguna tetap merujuk pada spesifikasi aktif; jangan mengganti target dengan angka baru dalam steering.

Pemeriksaan matematis saat menyusun desain bukan bukti bahwa kode produksi telah lulus. Emulasi ponsel bukan pengujian perangkat nyata. Minat berbagi dari sampel kecil bukan bukti produk akan viral. Nyatakan perbedaan ini ketika mencatat hasil.

Jika perangkat, peserta uji, atau sumber aset belum tersedia, catat pemeriksaan terkait sebagai belum dilakukan, pertahankan checkbox tugasnya, dan lanjutkan pekerjaan yang tidak bergantung pada hambatan itu. MVP belum dinyatakan memenuhi seluruh kebutuhan selama pemeriksaan wajib belum selesai. Jangan mengarang bukti, hasil riset, atau angka pengukuran.

## 10. Status saat dokumen dibuat

Dokumen requirement, analisis, design, dan Task sudah tersedia. Task memuat 22 pekerjaan yang seluruhnya masih belum dikerjakan saat panduan ini dibuat. Belum ada kode website, foto yang diunduh, uji pengguna, pengukuran kinerja, atau deployment.

Permintaan saat ini hanya membuat `steeering/project-overview.md`. Dokumen steering lain dan implementasi aplikasi belum dimulai. Pada pekerjaan berikutnya, periksa ulang filesystem dan Task untuk memperoleh status terbaru; bagian ini adalah snapshot historis, bukan pengganti pelacakan progres.


## Audio — pembaruan revisi 5

Musik latar dan efek menjadi bagian MVP yang wajib tersedia tetapi boleh dimatikan pengguna. Arah suasana: medis sinematis, tegang dan heroik seperti referensi The Trauma Code. Agen memilih sumber; tidak wajib membuat musik orisinal atau memakai satu OST tertentu. Acuan keputusan ada pada requirement FR-11/FR-12/NFR-15 dan design bagian 12; implementasi pada T23–T25.

Halaman baru diam. Preferensi awal musik 12% dan efek 25% baru dibunyikan setelah Start Quiz atau aktivasi musik eksplisit, dengan keterangan yang terlihat sebelum mulai. Tidak ada audio yang mengendalikan skor/progres. Kuis harus tetap lengkap ketika audio mati atau gagal. Hasil pengujian sebelum audio tidak otomatis menjadi bukti versi dengan audio.
