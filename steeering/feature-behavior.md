# Feature Behavior — Panduan Agen AI

Proyek: **Which Trauma Code Character Are You?**  
Tanggal dibuat: 28 Oktober 2026  
Fungsi: pedoman perilaku fitur saat agen merancang, mengimplementasikan, meninjau, atau memperbaiki aplikasi dengan SDD.

## 1. Kedudukan dokumen

Baca [project-overview.md](project-overview.md) untuk konteks proyek, [requirement.md](../spec-analysisc/requirement.md) untuk kebutuhan dan kriteria penerimaan, [design.md](../spec-analysisc/design.md) untuk keputusan solusi, serta [Task.md](../spec-analysisc/Task.md) untuk pekerjaan dan dependensinya.

Dokumen ini merangkum kontrak perilaku dari spesifikasi aktif, bukan menambah fitur atau mengganti aturan produk. Bila pengguna meminta perubahan perilaku, selaraskan requirement, design, Task, dan steering yang terdampak. Jangan mengubah aturan skor atau navigasi diam-diam untuk mempermudah implementasi.

Rincian warna, ukuran, tata letak, dan teknik penulisan kode tetap mengacu pada desain serta panduan terkait ketika tersedia. Pembuatan steering ini tidak menjalankan tugas implementasi atau menandai tugas selesai.

## 2. Aturan yang selalu dijaga

- Kuis mempunyai tepat 10 pertanyaan dalam urutan tetap, masing-masing dengan dua pilihan A/B. Tidak ada pengacakan pertanyaan, pilihan, atau hasil.
- Tampilkan satu pertanyaan aktif pada satu waktu. Pilihan A berada di kiri dan B di kanan, termasuk pada ponsel sesuai desain aktif.
- Setiap pertanyaan hanya menyimpan satu pilihan terbaru. Mengganti pilihan menimpa jawaban untuk pertanyaan itu, tanpa menambah slot jawaban.
- Memilih jawaban adalah aksi konfirmasi yang langsung melanjutkan; tidak ada tombol Next. Hover atau menerima fokus tidak memilih jawaban.
- Progres menunjukkan **nomor pertanyaan aktif**, bukan jumlah jawaban yang tersimpan. Jika kembali ke pertanyaan ketiga setelah menjawab lebih jauh, progres tetap 3/10.
- Hasil hanya tersedia setelah sepuluh jawaban valid. Jawaban identik selalu menghasilkan karakter dan alasan yang sama.
- Sesi hanya berada dalam memori halaman. Tidak ada akun, cookie, browser storage, pengiriman jawaban, atau pemulihan progres setelah reload.
- Efek visual mendukung interaksi. Menonaktifkan gerakan atau gagalnya foto tidak mengubah jawaban, skor, atau hasil.

## 3. Layar dan perubahan state

Tiga layar produk tetap `landing`, `quiz`, dan `result`. Status perpindahan adalah kondisi sementara pada state, bukan layar tambahan yang meminta pengguna menunggu proses analisis.

| Kondisi awal | Aksi/kondisi | Respons | Kondisi akhir |
| --- | --- | --- | --- |
| Halaman baru, data valid | Inisialisasi selesai | Tampilkan pembuka dan Start Quiz. | `landing`, sesi kosong. |
| `landing` | Start Quiz | Bersihkan sesi dan tampilkan Q01. | `quiz`, indeks 0, progres 1/10. |
| `quiz`, tidak terkunci | Pilih A/B pada Q01–Q09 | Simpan pilihan, beri umpan balik, maju tepat satu pertanyaan. | `quiz`, indeks berikutnya. |
| `quiz`, indeks di atas 0, tidak terkunci | Back | Pertahankan seluruh jawaban, mundur tepat satu pertanyaan. | `quiz`, indeks sebelumnya. |
| `quiz`, pertanyaan pertama | Back | Tidak tersedia; handler defensif tidak mengubah state. | Tidak berubah. |
| `quiz`, sedang berpindah | Pilihan/Back berulang | Abaikan aktivasi tambahan dari perpindahan yang sama. | Tidak ada mutasi tambahan. |
| `quiz`, Q10 dijawab | Sepuluh jawaban valid | Hitung hasil dari seluruh jawaban terbaru. | `result`, satu karakter dan dua alasan. |
| Permintaan hasil | Masih ada jawaban kosong/tidak valid | Jangan menampilkan hasil; arahkan ke pertanyaan pertama yang belum mempunyai jawaban valid. | `quiz`, sesi yang masih dapat dilanjutkan. |
| `result` | Ulangi kuis | Batalkan efek sesi lama dan bersihkan seluruh sesi. | `quiz`, indeks 0, progres 1/10. |
| Layar mana pun | Reload penuh | Inisialisasi dari awal, tanpa memulihkan sesi. | `landing`, sesi kosong jika data valid. |

Di luar layar dan prasyarat yang sesuai, handler tidak boleh mengubah state sesi. Perubahan ukuran layar, scroll, hover, atau pemuatan foto juga tidak boleh mengubah jawaban.

Field state mengikuti desain bagian 7.2: `screen`, `currentIndex`, `answers`, `isTransitioning`, `result`, dan `sessionVersion`. Jangan membuat skor akumulatif per klik sebagai sumber hasil yang terpisah dari array jawaban.

## 4. Pembuka dan mulai — FR-01, FR-10

Tampilkan judul proyek, pengantar, informasi 10 pertanyaan/tanpa login, tombol Start Quiz, serta keterangan fan-made nonkomersial dan tidak berafiliasi resmi. Estimasi waktu hanya boleh ditambahkan jika didukung pengukuran aktual.

Start Quiz yang diterima harus memulai satu sesi bersih: sepuluh jawaban kosong, indeks 0, hasil kosong, dan tidak ada tema karakter lama. Aktivasi berulang dari aksi mulai yang sama tidak membuat beberapa proses perpindahan.

Setelah Q01 tampil, pindahkan fokus ke judul pertanyaan. Jangan membuat pengguna menutup modal, memasukkan identitas, atau menunggu foto sebelum mulai menjawab.

## 5. Menjawab dan progres — FR-02, FR-03, FR-04

Ketika menerima aksi jawaban, pastikan layar kuis aktif, data valid, opsi A/B sesuai pertanyaan aktif, dan sesi tidak terkunci. Ambil identitas sesi serta indeks pertanyaan saat aksi diterima; callback tidak boleh menebak pertanyaan berdasarkan DOM yang mungkin sudah berganti.

Urutan perilaku yang harus dipertahankan:

1. Kunci aksi perpindahan sebelum mengubah jawaban.
2. Simpan pilihan ke slot pertanyaan aktif dan kosongkan hasil turunan yang mungkin sudah tidak berlaku.
3. Tampilkan umpan balik pilihan melalui tanda/teks terpilih dan respons tekan.
4. Maju satu pertanyaan, atau masuk ke hasil bila Q10 dijawab dan semua jawaban valid.
5. Render konten, progres, serta pilihan tersimpan; pindahkan fokus ke heading yang baru.
6. Buka kembali interaksi setelah perpindahan selesai. Penyelesaian perpindahan hanya boleh diterapkan sekali.

Indikator teks menampilkan 1/10 sampai 10/10, dengan bilah progres dan informasi aksesibel yang konsisten. Jangan menyebut pilihan benar/salah, memberi hukuman, atau menambah penghitung waktu karena itu tidak termasuk desain kuis kepribadian ini.

Transisi pertanyaan mengikuti batas desain bagian 3.5. Tidak ada tombol Next atau layar “AI sedang menganalisis”. Fungsi kuis tidak bergantung pada `animationend` saja; kegagalan event animasi tidak boleh membuat kontrol terkunci selamanya.

## 6. Back dan koreksi jawaban — FR-05

Back tersedia pada pertanyaan 2–10 saat sesi siap menerima aksi. Back di pertanyaan pertama disembunyikan sesuai desain; tidak ada perpindahan ke indeks negatif atau ke pembuka melalui tombol tersebut.

Kembali tidak menghapus jawaban pada pertanyaan aktif maupun pertanyaan lain. Pertanyaan yang pernah dijawab menampilkan pilihan tersimpannya dengan tepi aktif, centang, teks “Dipilih”, dan status aksesibel.

Mengaktifkan pilihan yang sama tetap melanjutkan satu pertanyaan. Memilih opsi berbeda menggantikan pilihan lama, lalu melanjutkan satu pertanyaan. Jawaban di pertanyaan berikutnya tetap tersimpan sehingga pengguna dapat meninjau ulang tanpa harus membangun sesi dari awal.

Contoh: pengguna telah menjawab Q01–Q06 dan berada di Q07. Dua kali Back membawanya ke Q05 dengan progres 5/10. Mengganti Q05 hanya mengubah jawaban Q05; pilihan Q06 tetap tersedia saat Q06 tampil kembali.

Jika seluruh jawaban sebelumnya sudah lengkap saat pengguna berada lebih awal dalam kuis, jangan otomatis melompati pertanyaan yang tersisa. Perpindahan normal tetap satu langkah; penghitungan hasil berlangsung ketika Q10 diaktifkan kembali.

Back di dalam kuis berbeda dari tombol Back/Forward browser. Sinkronisasi riwayat browser atau URL pertanyaan tidak menjadi fitur MVP. Layar hasil menyediakan Ulangi kuis; jangan menambahkan alur edit hasil atau Back dari hasil tanpa perubahan spesifikasi.

## 7. Perhitungan dan alasan hasil — FR-06, FR-07

Gunakan pemetaan pertanyaan dan data lokal yang ditetapkan dalam desain bagian 4–5. Nama karakter, gelar, dan isi hasil berasal dari data yang sama dengan yang ditampilkan, bukan hasil panggilan API atau AI.

Kontrak perhitungan yang harus diikuti:

1. Validasi tepat sepuluh jawaban A/B dan seluruh pemetaan data.
2. Hitung ulang dari nol: setiap pilihan memberi 2 poin kepada karakter yang dipetakan dan 0 kepada karakter lain. Jumlah seluruh skor untuk jawaban lengkap adalah 20.
3. Ambil karakter dengan skor utama tertinggi. Bila hanya satu, itulah hasilnya.
4. Jika seri, ambil **kelompok seri awal**. Hitung poin pembanding dari pertanyaan yang kedua kandidat opsinya berada di kelompok itu; karakter yang dipilih mendapat satu poin pembanding.
5. Pilih kandidat dengan poin pembanding tertinggi. Tahap pembanding dilakukan sekali, tanpa menyempitkan kelompok lalu mengulang penghitungan secara rekursif.
6. Jika masih seri, ambil kandidat tersisa pertama menurut urutan tetap B → Y → C → P → H.
7. Ambil dua alasan dari dua jawaban paling awal menurut urutan pertanyaan yang memberi poin kepada karakter pemenang.

Kode B/Y/C/P/H mengikuti pemetaan di desain. Jangan mengganti urutan seri dengan urutan elemen DOM, pengurutan nama, waktu klik, atau angka acak. Jawaban yang sama harus memberi dua alasan yang sama, bukan kalimat yang dipilih acak.

Alasan hanya boleh menyatakan kecenderungan dari pilihan yang benar-benar diambil. Tidak boleh mengambil alasan dari opsi yang tidak dipilih atau menampilkan persentase kecocokan psikologis.

Lima hasil harus tetap dapat diperoleh. Distribusi pembanding, contoh jawaban tiap karakter, dan jumlah seri yang harus dicocokkan tersedia pada desain bagian 5.3. Perubahan pemetaan, bobot, atau pemecah seri mewajibkan revisi dokumen terkait dan enumerasi ulang seluruh 1.024 kombinasi; target desain bukan bukti distribusi jawaban manusia.

## 8. Hasil, kartu ID, dan gambar — FR-07, FR-08, FR-10

Setelah seluruh jawaban valid, tampilkan tepat satu karakter dengan tema, nama, gelar, foto, ringkasan kartu, deskripsi, tiga kekuatan, dua alasan kecocokan, pesan, dan Ulangi kuis. Keterangan bahwa kuis untuk hiburan dan bukan penilaian psikologis ilmiah atau diagnosis tetap dapat ditemukan.

Kartu memuat label Trauma Team ID Card, identitas karakter, ringkasan singkat, kode dekoratif, dan badge fan-made. Nama serta gelar tetap berbentuk teks; warna atau foto tidak menjadi satu-satunya penanda karakter. Tidak ada permintaan nama/foto pengguna.

Foto berasal dari aset internet yang telah dipilih dan disimpan lokal sesuai NFR-08 serta desain bagian 11. Muat foto hasil yang diperlukan, tanpa mengharuskan seluruh foto karakter selesai dimuat pada pembuka. Jika foto gagal, gunakan inisial pada bidang tema sambil mempertahankan informasi karakter dan seluruh kontrol.

Callback pemuatan gambar dari hasil lama tidak boleh mengubah foto, tema, atau state sesi yang sudah diulang. Kartu dan hasil tidak menunggu jaringan pihak ketiga; data hasil tetap lokal.

Kartu dirancang agar dapat ditangkap layar setelah pengguna menggulir ke kartu pada viewport target. Tidak perlu membuat proses ekspor otomatis. Jangan menambahkan tombol unduh, berbagi, atau tautan hasil yang belum masuk MVP.

## 9. Ulangi kuis dan batas sesi — FR-09; A-02

Ulangi kuis memulai Q01 langsung, bukan kembali ke pembuka. Bersihkan seluruh jawaban, progres, hasil, tanda pilihan, tema, dan skor turunan. Tidak ada konfirmasi tambahan dalam alur yang disepakati.

Batalkan callback perpindahan lama dan naikkan versi sesi. Callback yang masih tiba harus diabaikan bila versi sesinya tidak cocok. Reset harus menghasilkan state yang setara dengan sesi baru yang baru saja melewati Start Quiz.

Pengguna dapat mengulang beberapa kali tanpa reload. Refresh penuh dari mana pun memulai lagi dari pembuka dan menghilangkan progres; jangan menambahkan `localStorage`, `sessionStorage`, atau pemulihan otomatis sebagai perubahan tersembunyi.

## 10. Aksi berulang, gerakan, dan kegagalan

| Kondisi | Perilaku yang wajib dipertahankan | Acuan |
| --- | --- | --- |
| Ketukan cepat, double-click, atau tombol keyboard ditahan | Satu aktivasi diterima untuk perpindahan yang sama; jangan meneruskan event lama ke pertanyaan baru. | FR-03, NFR-12 |
| Back saat perpindahan | Tidak memutasi indeks atau jawaban; kontrol dinonaktifkan selama perpindahan. | FR-05, desain 7.3 |
| Reduced motion | Hilangkan gerakan nonesensial sambil menjaga tanda pilihan, navigasi, fokus, dan perlindungan aktivasi berulang. Tidak perlu menambahkan jeda hasil. | NFR-06, desain 3.5 |
| Animasi tidak mengirim event selesai | Gunakan penyelesaian terkontrol yang hanya diterapkan sekali; kuis tidak boleh macet atau maju dua kali. | Desain 7.3 |
| Callback dari sesi lama | Abaikan; tidak boleh menimpa layar, foto, pilihan, atau tema sesi baru. | FR-09, desain 7.2–7.3 |
| Ada jawaban kosong/tidak dikenal ketika hasil diminta | Jangan hitung hasil seolah valid; arahkan ke pertanyaan pertama yang perlu dijawab. | FR-07, desain 7.3 |
| Data kuis gagal validasi pada awal halaman | Tampilkan pesan ringkas bahwa kuis belum dapat dimulai dan jangan menyediakan aksi mulai yang menyesatkan. Tidak memilih karakter pengganti secara diam-diam. | Desain 7.1 dan 8 |
| JavaScript tidak tersedia | Tampilkan pesan `noscript`; jangan menyiratkan kuis siap dijalankan. | Desain 8 |
| Foto gagal dimuat | Tampilkan fallback; hasil dan tombol tetap berfungsi. | Desain 11 |

Gunakan satu perilaku konfirmasi untuk klik, tap, Enter, dan Space pada tombol native. Jangan menambahkan beberapa jalur event yang membuat satu sentuhan atau satu tombol dihitung dua kali. Detail implementasi tetap mengikuti panduan kode ketika tersedia.

Fokus setelah perpindahan menuju heading pertanyaan atau hasil yang sesuai. Layar nonaktif tidak ikut dalam urutan keyboard. Aturan ini mempertahankan kesinambungan alur; detail tampilan fokus, kontras, dan ukuran kontrol mengikuti desain bagian 8 dan panduan UI/aksesibilitas ketika dibuat.

### Interaksi mengikuti mouse — NFR-07, NFR-12

Pratinjau kartu ID pembuka dan kartu hasil wajib miring serta memiliki sorotan mengikuti mouse, sementara dua lapisan dekorasi latar bergerak halus sesuai desain 3.6. Ini bagian MVP pada event mouse yang memenuhi syarat hover/fine pointer tanpa reduced motion. Pertanyaan, jawaban, progres, dan tombol tetap stabil; pointer bergerak tidak boleh memilih jawaban, mengubah skor, atau memindahkan fokus.

Saat keluar area terkait, kembali ke posisi netral. Pergantian layar, ulang sesi, keluar viewport, blur, dan dokumen tersembunyi membersihkan efek serta callback lama. Pergantian ke touch/keyboard atau aktivasi reduced motion segera menetralkan efek. Callback efek dari sesi lama tidak boleh menghidupkan gerakan kembali. Pada input tanpa dukungan, gunakan kartu/latar statis dengan informasi dan aksi lengkap.

## 11. Contoh pemeriksaan perilaku

Gunakan skenario berikut sebagai panduan verifikasi pada tugas terkait, bukan pernyataan bahwa aplikasi sudah diuji.

| Skenario | Hasil yang harus dibuktikan | Tugas terkait |
| --- | --- | --- |
| Buka halaman dan mulai kuis | Pembuka tampil lebih dulu; Start Quiz membawa ke Q01, 1/10, tanpa pilihan aktif. | T08, T15 |
| Jawab Q01 satu kali | Tepat Q02 yang muncul dengan progres 2/10. | T09, T10, T15 |
| Double-click atau tahan Enter pada pilihan | Tidak melewati pertanyaan atau menggandakan jawaban, termasuk saat reduced motion aktif. | T10, T13, T15 |
| Kembali dari Q07 ke Q05 dan ganti jawaban | Progres menjadi 5/10; hanya Q05 berubah, jawaban Q06 tetap tersimpan. | T10, T15 |
| Pilih jawaban lama setelah Back | Tetap maju satu pertanyaan tanpa menggandakan skor. | T10, T15 |
| Minta hasil dengan satu slot kosong | Hasil tidak ditampilkan; pertanyaan kosong pertama dapat dijawab. | T03, T10, T15 |
| Jawab semua A sampai selesai | Semua karakter berskor 4; hasil B sesuai aturan seri, dengan alasan dari jawaban yang mendukung B. | T03, T04, T15 |
| Enumerasi 1.024 kombinasi melalui fungsi produksi | Jumlah setiap hasil sesuai desain 5.3; seluruh hasil valid dan deterministik; alasan sesuai pilihan. | T04 |
| Hasil tampil tetapi foto gagal | Nama, gelar, fallback, uraian, dan Ulangi kuis tetap tersedia. | T06, T11, T15 |
| Ulangi lalu selesaikan dengan jawaban lain | Tidak membawa tema/jawaban lama; hasil sesuai sesi baru. Callback lama tidak mengganggu. | T12, T15 |
| Reload pada pertanyaan atau hasil | Kembali ke pembuka dengan sesi kosong. | T10, T15 |
| Gerakkan mouse pada kartu dan latar | Tilt, sorotan, serta parallax mengikuti desain 3.6; hit area dan jawaban tetap stabil, lalu efek reset/cleanup pada kondisi yang ditentukan. | T13, T16, T17 |
| Ganti ke touch/keyboard atau aktifkan reduced motion | Efek langsung netral tanpa kehilangan fokus, informasi, atau fungsi kuis. | T13, T14, T17 |
| Gunakan keyboard dari awal sampai ulang | Fokus mengikuti konteks dan semua aksi berfungsi tanpa hover atau sentuhan. | T14, T15 |

Untuk perubahan skor, pakai pemeriksa browser yang menggunakan fungsi produksi sebagaimana T04; jangan membuat fungsi skor khusus pengujian yang berbeda dari aplikasi. Untuk perubahan alur dan event, periksa skenario normal serta kasus tepi yang terpengaruh. Catat bukti aktual dalam `docs/verification.md` sesuai Task saat implementasi berlangsung.

## 12. Pemeliharaan steering

Jika permintaan baru mengubah perilaku, perbarui spesifikasi yang menjadi acuannya beserta bagian steering ini. Jangan menjadikan steering sebagai tempat menyembunyikan keputusan produk yang belum tercermin pada requirement atau desain.

Saat dokumen ini dibuat, kode aplikasi dan pemeriksaan perilaku di atas belum dijalankan. Lingkup pekerjaan ini hanya pembuatan `steeering/feature-behavior.md`; panduan UI/aksesibilitas dan konvensi kode belum dibuat. Pada pekerjaan berikutnya, baca status Task dan filesystem terbaru sebelum melaporkan progres.
