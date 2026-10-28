# Catatan Verifikasi

Status terkini: **T01–T04 selesai; T05–T22 belum dikerjakan**. Setiap bagian di bawah mencatat keadaan pada akhir tugas terkait.

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

## T03 — Skor, pemecah seri, dan alasan hasil

Tanggal: 28 Oktober 2026 (Asia/Jakarta).

Kebutuhan: FR-06, FR-07, NFR-02, NFR-10.

Dependensi: T02 selesai; repository bersih saat pekerjaan dimulai.

Status: **kriteria selesai T03 terpenuhi**. T04–T22 belum dikerjakan.

### Perubahan

- `js/quiz.js`: menambahkan validator jawaban serta fungsi murni `calculateResult(data, answers)`, dengan helper internal untuk skor dan pemecah seri. Input divalidasi sebelum dihitung; hasil baru berisi `characterId`, `scores`, dan dua `reasons`. Data/jawaban tidak dimutasi. Input tidak valid ditolak dengan `TypeError`.
- `checks/result-unit-check.html` dan `checks/result-unit-check.js`: pemeriksaan terpilih yang memakai fungsi produksi, terpisah dari halaman produk. Tidak berisi enumerasi penuh atau fungsi skor pengganti.
- `spec-analysisc/design.md`: mendokumentasikan kontrak API pada bagian 5.5. Bobot, pemetaan, dan aturan seri tetap sama.
- `spec-analysisc/Task.md`: mencentang T03 setelah pemeriksaan lulus.
- `docs/t03-result-check.json`: bukti hasil aktual, fixture, regresi, lingkungan, dan hash file yang diuji.

### Lingkungan dan prosedur

Windows 11 build 26300, Chrome 156.0.8078.73 headless, dan server file Python sementara pada `http://127.0.0.1:62130/`. Pengujian localhost dijalankan dengan izin lingkungan; tidak memasang dependensi aplikasi. Server dihentikan setelah pemeriksaan.

Pemeriksa T03 dijalankan melalui browser, kemudian pemeriksa data T02 dijalankan ulang karena `quiz.js` digunakan bersama. Halaman utama juga diperiksa untuk memastikan penanda inisialisasi fondasi masih hadir.

### Hasil aktual

| Pemeriksaan | Hasil |
| --- | --- |
| Lima contoh jawaban pada desain | Lulus: masing-masing menghasilkan B, Y, C, P, atau H yang diharapkan, dengan dua alasan benar dan total skor 20. |
| Seri dua kandidat | Lulus: pembanding memilih pemenang, termasuk H mengalahkan C meskipun C lebih awal pada urutan fallback. |
| Seri siklus tiga kandidat | Lulus: kelompok seri awal tetap dipakai, lalu urutan tetap menentukan B setelah pembanding masih seri. |
| Seri lima kandidat pada semua A | Lulus: kelima skor 4 dan hasil B. |
| Determinisme | Lulus: panggilan ulang pada fixture yang sama menghasilkan objek bernilai sama, termasuk urutan alasan. |
| Koreksi Q10 dan koreksi balik | Lulus: skor dihitung dari jawaban terbaru; hasil lama tidak berubah dan tidak ada akumulasi skor klik. |
| Kemurnian input/output | Lulus pada input dibekukan rekursif; mengubah objek hasil pertama tidak memengaruhi panggilan berikutnya. |
| Input kosong/tidak dikenal | Lulus: validator menolak 13 variasi tipe, panjang, slot, serta opsi tidak valid; perhitungan tidak menghasilkan karakter. |
| Data dengan bobot rusak | Lulus: ditolak sebelum perhitungan hasil. |
| Total pemeriksaan T03 | **28 dari 28 kasus lulus**. |
| Regresi validator T02 | **45 dari 45 kasus tetap lulus**. |
| Halaman produk | Penanda `data-foundation-ready="true"` tetap hadir setelah script termuat. |

Pada percobaan awal, dua fixture pengujian mengharapkan alasan Han dari Q04 dan Q10. Pemeriksaan memperlihatkan Q09 juga mendukung Han dan muncul lebih dahulu daripada Q10. Acuan uji dikoreksi menjadi Q04 dan Q09 sesuai desain bagian 5.4; kode produksi tidak diubah untuk menyesuaikan acuan yang salah. Hasil akhir di atas berasal dari pengujian ulang yang lulus.

Bukti mesin: [t03-result-check.json](t03-result-check.json). Untuk mengulang kasus terpilih, jalankan server statis dari root proyek lalu buka `http://127.0.0.1:8000/checks/result-unit-check.html`; laporan seharusnya menunjukkan `passed: true` dan `total: 28`.

Contoh pemakaian API pada console halaman yang sudah dimuat:

```javascript
TraumaQuiz.quiz.validateAnswers('AAAAAAAAAA'.split(''));
TraumaQuiz.quiz.calculateResult(TraumaQuiz.data, 'AAAAAAAAAA'.split(''));
```

Hasil perhitungan contoh adalah `characterId: 'B'`, lima skor 4, dan dua alasan pendukung dari Q01 serta Q03.

### Batas dan serah terima

Pengujian ini memakai kasus terpilih, belum mengonfirmasi distribusi produksi pada seluruh 1.024 kombinasi. Enumerasi penuh serta `checks/scoring-check.html`/`checks/scoring-check.js` tetap merupakan T04. Angka distribusi pada desain belum dinyatakan sebagai hasil pengujian produksi oleh T03.

UI utama tetap berupa fondasi dengan pesan kuis belum tersedia; fungsi skor belum terhubung ke interaksi pengguna. Tidak ada perubahan aset, efek mouse, atau hosting publik. Pekerjaan berhenti setelah T03 sesuai permintaan.

## T04 — Pemeriksa skor lengkap tanpa dependensi

Tanggal: 28 Oktober 2026 (Asia/Jakarta).

Kebutuhan: FR-06, FR-07. Dependensi T03 sudah selesai. Perubahan lokal T03 yang belum di-commit dipertahankan.

Status: **seluruh kriteria T04 terpenuhi**. T05–T22 belum dikerjakan.

### File dan cara menjalankan

- `checks/scoring-check.html`: petunjuk menjalankan, status LULUS/GAGAL, tabel distribusi aktual/acuan, serta laporan JSON yang terbaca di browser.
- `checks/scoring-check.js`: memanggil validator dan `calculateResult` produksi. Tidak membawa algoritma skor pengganti atau dependensi tambahan, dan tidak dimuat oleh `index.html`.
- `docs/t04-scoring-check.json`: hasil browser, metadata lingkungan, resource HTTP, dan hash SHA-256 data, logika produksi, serta kedua file pemeriksa.
- `spec-analysisc/Task.md` dan `spec-analysisc/design.md`: memperbarui status serta bukti pemeriksaan lengkap. Bobot, pemetaan, dan logika produksi tidak diubah.

Dari root proyek, jalankan:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Buka `http://127.0.0.1:8000/checks/scoring-check.html`. Pemeriksaan otomatis berjalan saat halaman dimuat; refresh untuk mengulang. Target tampilannya adalah **LULUS: 1024/1024 kombinasi; seri primer 424**, dengan `passed: true` pada laporan. Hentikan server menggunakan Ctrl+C.

### Lingkungan dan hasil aktual

Windows 11 build 26300, Chrome 156.0.8078.73 headless, server Python statis sementara pada `http://127.0.0.1:51026/` (port aktual tersedia pada berkas bukti). Server localhost dijalankan dengan izin lingkungan dan dihentikan setelah pengujian. Alamat pengujian bukan preview yang masih aktif.

| Karakter | Hasil aktual/acuan | Persentase |
| --- | --- | --- |
| B — Baek Kang-hyuk | 240 / 240 | 23,44% |
| Y — Yang Jae-won | 204 / 204 | 19,92% |
| C — Cheon Jang-mi | 196 / 196 | 19,14% |
| P — Park Gyeong-won | 192 / 192 | 18,75% |
| H — Han Yu-rim | 192 / 192 | 18,75% |
| Total | **1.024 / 1.024** | **100%** |

Semua karakter terjangkau dan berada pada rentang 15–25%. Seri pada skor utama berjumlah **424**, persis sesuai desain. Seluruh **14 kelompok pemeriksaan lulus**:

- Validasi struktur produksi sebelum enumerasi.
- Seluruh kombinasi menghasilkan satu ID yang valid, lima skor bilangan bulat genap 0–8 dengan total 20, serta pemenang yang termasuk kandidat skor tertinggi.
- Pemanggilan ulang pada setiap kombinasi menghasilkan nilai hasil dan alasan yang sama.
- Dua alasan untuk setiap kombinasi berasal dari pilihan pendukung paling awal dan mengikuti urutan pertanyaan.
- Input enumerasi dibekukan, termasuk data secara rekursif, untuk menangkap mutasi input.
- Lima contoh hasil, pembanding seri dua kandidat, fallback siklus tiga kandidat, dan semua A dengan lima skor 4 lalu hasil B.
- Koreksi Q10 dan koreksi balik tanpa akumulasi skor atau perubahan hasil lama.
- Penolakan jawaban kosong, tidak lengkap, slot kosong, dan opsi tidak dikenal.

Keempat resource pemeriksa/data/logika mengembalikan HTTP 200. Pemeriksaan sumber `index.html` memastikan pemeriksa skor tidak dimuat pada halaman produk. Tidak ada kegagalan yang memerlukan perubahan kode produksi pada T04.

Bukti lengkap: [t04-scoring-check.json](t04-scoring-check.json).

### Batas dan serah terima

Persentase memperlakukan seluruh kombinasi biner berbobot sama; ini bukan prediksi distribusi jawaban manusia atau bukti psikologi ilmiah. Pengujian dilakukan pada Chrome desktop headless, bukan bukti kompatibilitas seluruh browser atau ponsel nyata. Tidak ada UI kuis lengkap, aset, atau efek pointer yang dibuat pada tugas ini. Pekerjaan berhenti setelah T04.
