# Catatan Verifikasi

Status terkini: **T01–T02 selesai; T03–T22 belum dikerjakan**. Setiap bagian di bawah mencatat keadaan pada akhir tugas terkait.

## T01 — Fondasi website statis

Tanggal: 28 Oktober 2026 (Asia/Jakarta).  
Kebutuhan: NFR-01, NFR-02, NFR-03, NFR-10.  
Versi: fondasi awal T01; belum ada data kuis atau fitur interaktif.  
Status: **kriteria selesai T01 terpenuhi**; tugas lain belum dikerjakan.

### Perubahan

- `index.html`: metadata, bahasa Indonesia, tiga section semantik, pesan tahap pengembangan, serta `noscript`. Section kuis/hasil masih tersembunyi dan belum berisi fitur.
- `css/style.css`: gaya dasar yang terbaca, font sistem, dan batas lebar konten; sistem visual lengkap dikerjakan pada T07.
- `js/data.js`, `js/quiz.js`, `js/ui.js`: tempat pengembangan masing-masing tanggung jawab di namespace `TraumaQuiz`, memakai IIFE dan strict mode.
- `js/script.js`: memeriksa ketersediaan tiga bagian namespace dan memberi atribut internal `data-foundation-ready="true"` setelah fondasi termuat. Ini bukan tanda kuis siap dimainkan.
- `assets/images/` dan `checks/`: direktori disiapkan dengan `.gitkeep`; belum ada gambar atau pemeriksa skor T04.

### Lingkungan dan langkah

Windows 11 (build 26300), Python 3.13.2 sebagai server file sementara, dan Google Chrome 156.0.8078.73 headless. Tidak ada Node.js, npm, proses build, atau dependensi aplikasi yang dipasang.

Server sementara dibatasi ke localhost, pada `http://127.0.0.1:52271/`. Pemeriksaan mengambil halaman dan setiap aset, membaca urutan script dari HTML, lalu memuat halaman melalui Chrome headless dengan profil sementara. Server sudah dihentikan setelah pemeriksaan. Port tersebut merupakan catatan pengujian, bukan alamat preview yang masih aktif.

Untuk menjalankan fondasi secara manual dari root proyek:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Buka `http://127.0.0.1:8000/`; hentikan server dengan Ctrl+C. Python hanya alat penyaji file untuk pengembangan, bukan backend atau dependensi runtime website. File yang sama dapat disajikan server statis lain.

### Hasil aktual

| Pemeriksaan | Harapan | Hasil |
| --- | --- | --- |
| Halaman HTTP | `index.html` tersedia. | Lulus: HTTP 200, MIME `text/html`. |
| Stylesheet | CSS tersedia melalui path relatif. | Lulus: HTTP 200, MIME `text/css`. |
| Empat script | Seluruh file tersedia dan ber-MIME JavaScript. | Lulus: masing-masing HTTP 200, MIME `application/javascript`. |
| Urutan/defer | data → quiz → ui → script, semuanya `defer`. | Lulus melalui pemeriksaan tag HTML. |
| Inisialisasi browser | Chrome mengeksekusi script terakhir setelah namespace lengkap. | Lulus: DOM 1.447 byte, atribut `data-foundation-ready="true"` hadir, exit code 0. Log HTTP mencatat pemuatan CSS dan keempat script oleh browser. |
| Tanpa build/dependensi | Website cukup disajikan sebagai file statis. | Lulus: pengujian langsung terhadap file sumber tanpa build atau instalasi paket. |
| Path aplikasi | CSS/script tidak memakai path absolut atau host eksternal. | Lulus: semua referensi CSS/script relatif terhadap halaman. Favicon kosong memakai data URI lokal. |
| Pesan tanpa JavaScript | Pesan `noscript` disediakan di HTML. | Lulus pemeriksaan markup; tampilan saat JavaScript mati belum terkonfirmasi di browser. |

Bukti mesin: [t01-smoke.json](t01-smoke.json). Berkas itu menyimpan hasil HTTP, dua percobaan Chrome, serta permintaan yang diterima server.

### Batas pemeriksaan

Percobaan pertama pada lingkungan terbatas gagal mengakses socket localhost (`WinError 10013`). Pemeriksaan dijalankan ulang dengan izin lingkungan dan berhasil mengakses HTTP lokal. Edge headless mengembalikan exit code 0 tanpa DOM atau request browser sehingga tidak dipakai sebagai bukti keberhasilan.

Chrome dengan JavaScript aktif menghasilkan DOM dan penanda inisialisasi yang benar. Percobaan terpisah dengan JavaScript dimatikan mengembalikan output kosong sehingga hasilnya belum dapat disimpulkan, bukan dianggap lulus. Penyediaan markup `noscript` sudah diperiksa. Pengujian visual, pembaca layar, ponsel nyata, skor, dan perilaku kuis berada pada tugas berikutnya; tidak dinyatakan lulus oleh catatan ini.

### Serah terima

T01 selesai berdasarkan kriteria struktur dan pemuatan HTTP. T02–T22 tetap belum dikerjakan. Halaman saat ini menampilkan informasi bahwa kuis belum tersedia, tanpa tombol mulai yang belum berfungsi. Pekerjaan berhenti pada T01 sesuai permintaan pengguna.

## T02 — Data pertanyaan, karakter, dan validasi struktur

Tanggal: 28 Oktober 2026 (Asia/Jakarta).  
Kebutuhan: FR-02, bagian data FR-06/FR-07, NFR-10; A-01, A-03, A-05.  
Dependensi: T01 selesai dan fondasi termuat melalui HTTP.  
Status: **seluruh kriteria selesai T02 terpenuhi**. Fungsi skor T03 belum diimplementasikan.

### Perubahan

| File | Hasil |
| --- | --- |
| `js/data.js` | Q01–Q10, dua opsi A/B masing-masing, poin 2, 20 kalimat alasan, lima profil karakter lengkap, tema warna/motif, dan urutan seri B/Y/C/P/H sesuai desain. |
| `js/quiz.js` | Fungsi murni `validateData(data)` memeriksa jumlah, urutan/keunikan ID, teks, pemetaan, bobot, pasangan karakter, keseimbangan sisi, tema, kekuatan, dan urutan seri. Mengembalikan `isValid` serta `errors` tanpa mutasi input. |
| `js/ui.js` | Pesan kegagalan inisialisasi melalui teks DOM dan `role="alert"`, tanpa menampilkan hasil asal. |
| `js/script.js` | Memanggil validator sebelum menyatakan fondasi siap; kegagalan menampilkan pesan, mencatat detail di console, dan menghentikan inisialisasi. |
| `checks/data-check.html`, `checks/data-check.js` | Pemeriksa struktur data yang memakai validator produksi, dengan data valid, input dibekukan, dan variasi data rusak. Tidak dimuat halaman produk. |
| `spec-analysisc/design.md` | Mendokumentasikan bentuk objek data, tema, API validator, serta status implementasi T02. Isi pertanyaan, pemetaan, dan aturan skor tidak berubah. |
| `spec-analysisc/Task.md` | T02 dicentang setelah verifikasi; T03–T22 tetap belum dikerjakan. |

### Lingkungan dan prosedur

Windows 11 build 26300, Chrome 156.0.8078.73 headless, dan server file Python sementara pada `http://127.0.0.1:57528/`. Pemeriksaan localhost dijalankan dengan izin lingkungan, tanpa memasang dependensi. Server telah dihentikan; alamat itu merupakan catatan pengujian.

1. Ambil halaman, empat script, dan dua file pemeriksa melalui HTTP; semuanya harus tersedia.
2. Buka `checks/data-check.html` melalui Chrome dan baca laporan JSON yang dihasilkan validator produksi.
3. Bandingkan data yang benar-benar dieksekusi browser dengan tabel desain: seluruh pertanyaan, pilihan/pemetaan, alasan, profil, kekuatan, pesan, warna, dan motif.
4. Buka halaman produk dengan data valid; pastikan penanda `data-foundation-ready="true"` hadir tanpa pesan error.
5. Uji startup dengan respons data yang diubah sementara oleh server menjadi `questions = []`. File produksi di disk tidak diubah oleh injeksi tersebut. Pastikan pesan gagal muncul, penanda siap tidak hadir, dan layar kuis/hasil tetap tersembunyi.

### Hasil aktual

| Pemeriksaan | Hasil |
| --- | --- |
| Pemuatan halaman, script produksi, dan pemeriksa | Lulus: tujuh resource HTTP 200. |
| Struktur data valid | Lulus: 10 pertanyaan, 20 pilihan, 5 karakter, 10 pasangan unik, dan tiap karakter 2× di A serta 2× di B. |
| Konten sesuai desain | Lulus: seluruh isi dan pemetaan dibandingkan dengan tabel desain, termasuk warna/motif tema dan 20 alasan. |
| Validator tidak memutasi data | Lulus pada data valid yang dibekukan rekursif dan seluruh input pemeriksaan yang dibandingkan sebelum/sesudah. |
| Penolakan data rusak | Lulus: seluruh kasus yang mencakup jumlah/slot/ID salah, opsi duplikat, pemetaan asing, pasangan/sisi tidak seimbang, poin salah, teks kosong, kekuatan/tema rusak, serta urutan seri salah. |
| Total pemeriksa browser | **45 dari 45 kasus lulus**, tanpa exception validator pada kasus tersebut. |
| Inisialisasi data valid | Lulus: penanda fondasi siap hadir, pesan kegagalan tidak muncul. |
| Inisialisasi data rusak | Lulus: pesan “Kuis belum dapat dimulai karena datanya tidak valid. Silakan coba muat ulang halaman.” tampil, penanda siap tidak hadir, section kuis dan hasil tetap `hidden`. |

Bukti mesin dan hash SHA-256 empat file produksi yang diuji: [t02-data-check.json](t02-data-check.json). Catatan memuat nama setiap kasus dan hasil aktualnya.

Untuk mengulangi pemeriksa struktur: jalankan server statis dari root proyek seperti instruksi T01, lalu buka `http://127.0.0.1:8000/checks/data-check.html`. Tampilan seharusnya menunjukkan `passed: true` dan `total: 45`. Perbandingan terhadap tabel desain dan injeksi startup adalah pemeriksaan tambahan yang dilakukan pada sesi ini, tidak dijalankan otomatis oleh halaman pemeriksa tersebut.

### Batas dan serah terima

T02 hanya mencakup data dan validator struktur berikut penanganan kegagalannya. Belum ada fungsi penghitungan skor, pemecah seri, atau pemilihan alasan hasil; data alasan sudah disiapkan tetapi belum dipilih berdasarkan jawaban. Enumerasi skor 1.024 kombinasi pada fungsi produksi menunggu T03–T04.

Halaman utama tetap berupa fondasi T01 dengan informasi kuis belum tersedia. Foto, render kuis/hasil lengkap, animasi, serta efek pointer belum dibuat. Pengujian visual/pembaca layar, JavaScript mati, ponsel nyata, dan pengguna tidak dinyatakan lulus oleh pemeriksaan T02. Pekerjaan berhenti pada T02 sesuai lingkup permintaan.
