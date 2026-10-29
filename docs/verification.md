# Catatan Verifikasi

Status terkini: **T01–T16 dan T18 selesai; T17 belum selesai; T19–T22 dipersiapkan tetapi belum selesai; T23–T25 belum dikerjakan**. Bagian historis di bawah merekam keadaan pada akhir pekerjaan terkait; hasil terbaru ada pada bagian T14–T18 tanggal 29 Oktober 2026.

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

## T05 — Penelusuran sumber gambar

Tanggal: 28 Oktober 2026 (Asia/Jakarta).

Kebutuhan: FR-08, NFR-08; desain bagian 11. Dependensi T01 sudah selesai. Repository bersih saat penelusuran dimulai.

Status: **belum selesai; T05 tidak dicentang**. T06–T22 belum dikerjakan.

### Hasil yang dibuat

- `assets/SOURCES.md`: lima kandidat still, URL berkas, nama file yang direncanakan, kredit sumber, status izin/crop, sumber resmi, dan alternatif yang sudah diperiksa.
- `docs/t05-asset-research.json`: catatan terstruktur setiap kandidat, hasil pengambilan gambar, dan kriteria yang belum terpenuhi.
- `spec-analysisc/Task.md`: mencatat progres dan hambatan T05 tanpa mengubah checkbox menjadi selesai.
- `spec-analysisc/design.md`: memperbarui status penelusuran aset; rancangan serta kriteria aset tetap berlaku.

### Penelusuran dan bukti aktual

Penelusuran memakai sumber publik melalui alat web. Tidak ada area berlogin yang diakses, pesan kepada pihak lain yang dikirim, atau foto yang dipasang pada aplikasi.

| Pemeriksaan | Hasil aktual |
| --- | --- |
| Sumber resmi | [Media Center](https://media.netflix.com/en/only-on-netflix/81677629) dan [Tudum](https://www.netflix.com/tudum/articles/trauma-code-heroes-on-call-release-date-news) ditemukan. Akses penuh Media Center ditawarkan melalui login. |
| Kandidat kelima karakter | Label sumber dipetakan ke lima URL gambar. Rincian tersedia di [SOURCES.md](../assets/SOURCES.md). Ini verifikasi metadata sumber, bukan pengenalan wajah atau peninjauan visual gambar. |
| Kredit | Kredit yang tersedia dicatat; kredit tidak disamakan dengan izin penggunaan ulang. |
| Pengambilan gambar untuk tinjauan | Dua URL ditolak alat web karena ukuran terlalu besar; tiga pengambilan lain gagal. Gambar tidak berhasil ditinjau visual melalui pengambilan tersebut. |
| Kualitas crop 4:3 | Belum dapat dikonfirmasi. Tidak ada klaim wajah, detail, atau ukuran hasil crop sudah sesuai. |
| Izin aset untuk kartu kuis | Belum terkonfirmasi. [Ketentuan Media Center](https://help.netflix.com/en/legal/media-terms-and-conditions) dan [ketentuan penerbit](https://futureplc.com/terms-conditions/) diperiksa; belum ditemukan bukti izin yang mendukung penggunaan/crop lima kandidat untuk proyek ini. |
| Alternatif | Kategori Commons untuk empat pemeran ditemukan; satu halaman berkas potret Yoon memiliki metadata lisensi dan catatan peninjauan yang didokumentasikan. Belum ada lima foto final yang terverifikasi. |
| Pemeriksaan catatan | Manifest memuat tepat lima ID unik B/Y/C/P/H, lima nama file rencana, serta URL sumber gambar. Tidak ada foto produksi yang diunduh atau hotlink ditambahkan. |

### Hambatan dan syarat penuntasan

Kriteria selesai T05 mensyaratkan lima aset sesuai karakter, kualitas crop memadai, serta informasi izin penggunaan yang mendukung proyek. Pada penelusuran ini, izin dan tinjauan crop belum terpenuhi. Karena itu sumber dicatat sebagai kandidat, bukan aset siap pakai.

T05 dapat dituntaskan setelah memperoleh sumber foto final beserta ketentuan penggunaan yang sesuai dan menyelesaikan tinjauan visual/crop. Sumber berizin dari pengguna atau kandidat pengganti dapat menjadi masukan untuk penuntasan, dengan status serta kredit diperbarui pada SOURCES. Ini tidak memerlukan perubahan kode kuis atau pemeriksaan ulang skor.

Pekerjaan berhenti pada lingkup T05 sesuai permintaan. T06 belum dimulai. Tidak ada pengujian aplikasi yang dijalankan karena perubahan tugas ini hanya catatan penelusuran dan status dokumentasi.


## T06 — Aset lokal

Tanggal: 28 Oktober 2026 (Asia/Jakarta). Kebutuhan FR-08, NFR-08, NFR-09, NFR-13.

Status: **belum selesai; tidak dicentang**. Dependensi T05 belum terpenuhi. Pemeriksaan kondisi repository menemukan hanya `.gitkeep` pada `assets/images/`, sedangkan lima gambar dalam `assets/SOURCES.md` masih kandidat dengan izin dan crop belum terkonfirmasi. Bukti keadaan sumber: [t05-asset-research.json](t05-asset-research.json).

Belum tersedia foto final untuk mengukur kompresi, ukuran transfer, posisi crop, atau pemuatan dari host sendiri. Tidak ada klaim optimasi, fallback foto produksi, atau integrasi atribusi telah selesai. T06 dapat dilanjutkan setelah kriteria T05 terpenuhi; kebutuhan dan dependensi tidak diubah untuk melewati hambatan. T07 hanya bergantung pada T01 sehingga tetap dapat diselesaikan memakai bidang gambar sementara.

## T07 — Sistem visual dan layout dasar

Tanggal: 28 Oktober 2026 (Asia/Jakarta). Kebutuhan NFR-04, NFR-05, NFR-07, NFR-12. Dependensi T01 sudah selesai; perubahan lokal catatan T05 dipertahankan.

Status: **seluruh kriteria T07 terpenuhi**.

### Perubahan

- `css/style.css`: token warna, font sistem, jarak, sudut, highlight, gradasi, border dan bayangan. Panel/kartu berlapis, tombol biasa/fokus/ditekan/terpilih/nonaktif, lima tema, layout pembuka/hasil dua kolom mulai 768 px dan satu kolom di bawahnya, serta pilihan A/B tetap dua kolom. Hanya isi tombol bergerak ketika ditekan; reduced motion menonaktifkan gerakan tersebut.
- `index.html`: memasang class shell/panel pada fondasi yang ada; layar kuis/hasil tetap memakai `hidden`.
- `checks/ui-preview.html`: galeri komponen statis terpisah dari halaman produk. Tombol hanya contoh visual; bidang foto masih placeholder.
- `checks/ui-check.html` dan `checks/ui-check.js`: pemeriksa browser tanpa dependensi untuk empat lebar iframe dalam CSS px. Pemeriksa tidak dimuat oleh produk.
- `docs/t07-ui-check.json`: hasil aktual, lingkungan, URL sementara dan hash SHA-256 kelima file yang diuji. `spec-analysisc/Task.md` dan `design.md` diperbarui sesuai progres.

### Pemeriksaan dan bukti aktual

Chrome 156.0.8078.73 headless, Windows 11 build 26300, server HTTP statis sementara Python pada `http://127.0.0.1:62239/`. Server sudah dihentikan.

| Pemeriksaan | Hasil |
| --- | --- |
| Lebar 320, 375, 768, 1280 CSS px | Seluruhnya lulus; ukuran iframe aktual cocok dengan target, tanpa overflow horizontal. |
| Layout pembuka/hasil | Satu kolom pada 320/375; dua kolom pada 768/1280. |
| Pilihan A/B | A kiri, B kanan, sejajar dan sama tinggi pada keempat lebar. |
| Target kontrol | Seluruh tombol minimal 44 × 44 CSS px. |
| Keadaan ditekan | Koordinat dan ukuran wrapper tombol tetap sama. |
| Fokus | Fokus programatis terlihat dengan outline minimal 3 px. |
| Terpilih/nonaktif | Label “Dipilih” terlihat; disabled dibedakan dengan garis putus-putus. |
| Kontras teks terukur | Utama 14,26:1; muted 9,21:1; tombol utama 12,49:1; lima aksen 8,60–9,76:1 terhadap panel. |
| Kedalaman visual | Bayangan panel terdeteksi; tangkapan layar lebar/sempit ditinjau, highlight tidak menutupi teks. |
| Fondasi halaman | Penanda inisialisasi tetap `foundationReady=true`. |

Bukti: [laporan JSON](t07-ui-check.json), [desktop 1280 px](t07-preview-1280.png), [ponsel 375 CSS px](t07-preview-375.png). Gambar ponsel diambil melalui iframe selebar 375 CSS px lalu dipotong pada batas iframe, karena batas minimum jendela Chrome headless dapat membuat tangkapan layar langsung tidak mewakili viewport yang diminta. Pemeriksa menggunakan ukuran iframe aktual, bukan ukuran jendela luar.

Untuk mengulang, jalankan `python -m http.server 8000 --bind 127.0.0.1` dari root, lalu buka `http://127.0.0.1:8000/checks/ui-check.html`. Harapan: laporan `passed: true` untuk empat viewport. Galeri dapat ditinjau pada `/checks/ui-preview.html`; gunakan Tab untuk melihat fokus. Hentikan server dengan Ctrl+C.

### Batas dan serah terima

Ini bukti komponen dan layout, belum pengujian alur kuis, pembaca layar, zoom 200%, kompatibilitas lintas browser atau perangkat nyata. Kontras terukur mencakup pasangan teks yang dilaporkan, bukan audit aksesibilitas menyeluruh. Tangkapan layar hanya merekam bagian atas galeri; pemeriksa mengukur kontrol di seluruh dokumen. Efek mouse tilt/sorotan/parallax tetap T13. Foto produksi dan fallback-nya tetap menunggu T05/T06. Tidak ada framework, dependensi baru, perubahan logika skor, commit, push, atau deployment. Pekerjaan berhenti setelah T07; T08 tidak dimulai.


## T08–T10 — Alur pembuka, pertanyaan, dan navigasi

Tanggal: 28 Oktober 2026. Dependensi T02/T03/T07 selesai. T05/T06 tetap belum selesai; T08 memakai bidang gambar sementara sesuai Task.

**T08 selesai:** pembuka menampilkan judul, pengantar sesuai desain, 10 pertanyaan/tanpa login, Start Quiz, pratinjau kartu sementara, dan keterangan fan-made. Tombol mulai hanya muncul setelah data lolos validasi. Sesi baru dimulai dengan sepuluh jawaban kosong dan fokus pada Q01.

**T09 selesai:** renderer memakai data lokal sebagai `textContent`, menampilkan konteks, prompt, pilihan A/B, nomor dan bilah progres 1–10. Pilihan tersimpan diberi `aria-pressed`, tepi aktif, tanda centang, serta teks “Dipilih”. Back disembunyikan pada Q01. Teks membungkus di kartu dua kolom.

**T10 selesai:** controller memegang `screen`, `currentIndex`, `answers`, `isTransitioning`, `result`, dan `sessionVersion`. Jawaban baru mengganti slot lama, dipilih segera, lalu maju satu langkah setelah 180 ms. Penguncian diterapkan sebelum mutasi; callback memeriksa versi sesi dan indeks. Back mundur satu tanpa menghapus jawaban. Q10 menghitung hasil melalui fungsi T03 hanya bila seluruh jawaban valid; bila ada slot kosong, alur kembali ke slot pertama itu. Aktivasi tombol berulang saat tombol keyboard ditahan dicegah pada keydown berulang. Refresh mengembalikan pembuka karena state hanya di memori.

Perubahan: `index.html`, `css/style.css`, `js/ui.js`, `js/script.js`, `checks/flow-check.html`, `checks/flow-check.js`, `docs/t08-t10-flow-check.json`, dan status pada `spec-analysisc/Task.md` serta `design.md`.

Chrome 156 headless pada Windows 11 melalui server Python statis localhost menjalankan **36 pemeriksaan, seluruhnya lulus**: pembuka siap, mulai Q01, klik ganda tidak melompati pertanyaan, maju satu, Back menampilkan pilihan lama, koreksi Q01 tidak mengubah Q02, progres dan teks Q02–Q10, hasil setelah Q10, fokus hasil, serta refresh ke pembuka. Laporan mentah: [t08-t10-flow-check.json](t08-t10-flow-check.json). Jalankan `python -m http.server 8000 --bind 127.0.0.1` lalu buka `/checks/flow-check.html` untuk mengulang. Server uji sementara telah dihentikan.

Batas: layar hasil saat ini hanya menandai bahwa perhitungan telah selesai; kartu dan isi karakter adalah T11 yang bergantung pada T06. Pemeriksaan ini berbasis Chrome headless dan klik programatis; pengujian keyboard/manual, pembaca layar, perangkat nyata, dan kasus lintas browser tetap mengikuti T14–T17. T08–T10 tidak bergantung pada T06. Pekerjaan berhenti setelah T10.


## T11–T12 — Hasil karakter dan pengulangan

Tanggal: 28 Oktober 2026. Status: **T11 dan T12 belum dicentang**. T11 bergantung pada T06, sedangkan T06 menunggu lima aset final T05. T12 bergantung pada T11. Kode hasil dan pengulangan dikerjakan sampai bagian yang dapat diverifikasi tanpa foto final.

`index.html` sekarang memiliki kartu Trauma Team ID Card, uraian, daftar tiga kekuatan, dua alasan jawaban, pesan karakter, penjelasan hiburan/fan-made, dan tombol Ulangi kuis. `css/style.css` menyediakan lima latar tema serta bidang gambar 4:3. `js/ui.js` merender data dari karakter hasil dan fallback inisial; gambar hanya dimuat bila `character.image.src` tersedia. Saat gagal, inisial dan seluruh konten hasil tetap tersedia. `js/script.js` menghubungkan hasil skor dengan renderer dan memulai ulang sesi dari Q01; `clearResult` membersihkan tema, isi, dan request gambar lama. Tidak ada URL gambar jarak jauh yang ditambahkan.

Pemeriksaan Chrome 156 headless melalui server statis Python: [regresi T08–T10](t11-t12-flow-check.json) **36/36 lulus**, dan [pemeriksaan lima hasil](t11-t12-result-flow-check.json) **109/109 lulus**. Lima pola pada desain 5.3 menghasilkan B/Y/C/P/H yang benar, termasuk nama, gelar, deskripsi, tema, tiga kekuatan, dua alasan yang sama dengan fungsi skor produksi, fallback inisial, dan fokus hasil. Reset berulang dimulai pada Q01 tanpa pilihan/tema/isi hasil lama. Pemeriksa tersedia di `checks/result-flow-check.html` dan `checks/result-flow-check.js`; jalankan melalui `python -m http.server 8000 --bind 127.0.0.1` dari root. Server pengujian sudah dihentikan. `git diff --check` lulus.

**Hambatan:** `assets/images/` masih hanya berisi `.gitkeep`. Tidak ada lima foto final, catatan crop/kompresi, atau atribusi final yang dapat diperiksa. Dengan demikian syarat foto/nama/tema/alasan T11 belum sepenuhnya terpenuhi, dan dependensi T12 tetap terbuka meski perilaku ulang sudah lulus uji. Pemeriksaan ini tidak membuktikan perilaku `img.onerror` untuk foto nyata, uji perangkat, atau pembaca layar. Setelah T05/T06 selesai, tambahkan referensi gambar lokal tervalidasi ke data, verifikasi lima crop dan kegagalan pemuatan, lalu ulangi pemeriksaan sebelum mencentang T11 dan T12. Pekerjaan berhenti setelah lingkup T12; T13 tidak dimulai.


## T05–T06 — Penelusuran lanjutan dan aset lokal parsial

Tanggal: 28 Oktober 2026. Status: **T05 dan T06 belum selesai; kedua checkbox tetap kosong**.

Penelusuran lanjutan menemukan tiga potret pemeran yang lisensi CC BY 3.0-nya telah ditinjau di Wikimedia Commons: Ju Ji-hoon untuk B, Choo Young-woo untuk Y, dan Ha Young untuk C. Korespondensi pemeran dan karakter diperiksa melalui Netflix Tudum. Berkas diunduh dari Wikimedia dan ditinjau visual; wajah terlihat jelas. B/Y menggunakan versi 500 px yang disediakan Wikimedia, sedangkan C memakai original setelah permintaan thumbnail mendapat HTTP 429. Ketiganya belum dipasang pada aplikasi. Ukuran, hash, dan dimensi aktual ada di [t05-t06-asset-progress.json](t05-t06-asset-progress.json); sumber, lisensi, pembuat dan kewajiban kredit di [SOURCES.md](../assets/SOURCES.md).

Potret tersebut bukan adegan karakter dalam drama. Untuk H, dua potret Commons yang ditemukan masih bertanda “license review needed”. Untuk P, belum ditemukan foto berizin yang terverifikasi. Still Netflix yang dulu dicatat tetap belum memiliki bukti izin penggunaan ulang pada kartu kuis. Tinjauan crop 4:3 pada UI, posisi wajah, lima ukuran file final, pemuatan kelima foto melalui host sendiri, dan kredit pada website belum dapat dinyatakan selesai. Foto lokal parsial tidak dipakai sebagai alasan mencentang T05/T06.

Langkah penyelesaian: temukan sumber foto P/H dengan lisensi/izin yang mendukung proyek; putuskan apakah lima potret pemeran diterima sebagai pengganti still karakter; tinjau crop kelimanya; siapkan versi ringan lokal, referensi data, kredit tampilan, dan uji pemuatan/fallback. Tidak ada perubahan pada logika kuis atau status T11/T12. Pekerjaan berhenti pada T06.


## T05–T06 — Keputusan pengguna dan aset final

Pengguna mengubah ketentuan aset: lima still internet boleh dipakai untuk proyek pribadi ini tanpa syarat sumber/kredit pada aplikasi. Lima gambar kandidat lama diunduh, diperkecil menjadi JPEG 720 × 480 kualitas 78, dan ditinjau visual: wajah B/Y/C/P/H terlihat jelas pada rasio 4:3. Ukuran masing-masing 52.205, 44.027, 48.085, 53.994, dan 60.635 byte. Total lima foto 258.946 byte. File lokal berada di `assets/images/`; `js/data.js` merujuk kelimanya. Browser Chrome headless memuat lima foto lokal dalam alur lima hasil: [109/109 pemeriksaan lulus](t05-t06-integration-check.json). Tidak ada hotlink runtime. Fallback inisial tetap ada pada `js/ui.js` bila foto gagal.

Catatan sumber lama di `assets/SOURCES.md` adalah arsip penelusuran, bukan syarat rilis sesuai keputusan pengguna. Foto digunakan hanya pada proyek pribadi sebagaimana dijelaskan pengguna. T05 dan T06 selesai; T11/T12 memerlukan tinjauan status terpisah setelah perubahan aset ini.


## T11–T12 — Verifikasi final

Tanggal: 28 Oktober 2026. T05–T06 kini menyediakan lima still lokal 720 × 480; dependensi T03, T07, T10 juga selesai. Status: **T11 dan T12 selesai**.

Chrome headless pada Windows 11 melalui server statis Python menjalankan [111 pemeriksaan hasil/reset](t11-t12-final-check.json): lima contoh jawaban desain menghasilkan B/Y/C/P/H; tiap hasil memuat nama, gelar, deskripsi, tiga kekuatan, dua alasan yang cocok dengan fungsi skor produksi, tema dan gambar lokal yang sesuai. Gambar gagal dipaksa ke URL lokal tidak ada; inisial serta tombol ulang tetap tersedia. Callback `onload` dari gambar sesi lama diabaikan setelah reset. Lima percobaan dengan hasil berbeda berjalan tanpa reload; ulang membersihkan gambar, nama, tema, pilihan, progres, dan fokus kembali ke heading Q01. [Regresi alur 36 pemeriksaan](t11-t12-flow-check.json) tetap lulus.

Foto asli dan hasil 720 × 480 ditinjau visual pada T05/T06. Pengujian ini memastikan gambar lokal dimuat pada kartu; pemeriksaan perangkat nyata, zoom, dan pembaca layar tetap pada T14–T17. `git diff --check` lulus. T13 tidak dimulai.


## T13–T14 — Gerakan dan aksesibilitas

Tanggal: 28 Oktober 2026. Status: **T13 selesai; T14 belum selesai**.

T13 menambahkan dua lapisan latar dekoratif dengan batas ±6/±12 px, tilt kartu ±3° serta sorotan yang mengikuti posisi mouse pada pembuka dan hasil. Pembaruan pointer digabung dalam satu `requestAnimationFrame` dengan fallback timer satu kali bila frame ditunda; tidak ada loop saat mouse diam. Mode keyboard/touch, reduced motion, blur, pergantian layar, dan ulang mereset properti efek serta callback tertunda. Kontrol dan panel kuis tetap stabil. Pilihan mendapat umpan balik sebelum pergantian singkat 180 ms; hasil mendapat reveal 360 ms yang dinonaktifkan dalam reduced motion. T13 lulus [10 pemeriksaan mode normal](t13-motion-normal.json), [4 mode reduced motion](t13-motion-reduced.json), dan [116 pemeriksaan lima tema hasil/regresi](t13-five-theme-check.json) di Chrome headless Windows 11. Regresi alur T08–T10 dan pemeriksa responsif T07 juga tetap lulus.

T14 menambahkan nama karakter pada heading hasil yang difokuskan melalui teks khusus pembaca layar, mempertahankan alt foto kosong karena nama ada pada kartu, serta memastikan dekorasi `aria-hidden` dan tidak menerima input. [100 pemeriksaan struktural](t14-structural-check.json) lulus pada 320, 375, 768, 1280 CSS px: bahasa, layar tersembunyi, fokus kontrol, target minimal 44 px, label/kelompok pilihan, progres, serta kontras teks lima tema minimal 4,5:1. Teks hasil dan alasan tetap teks DOM.

Kriteria T14 yang **belum dibuktikan**: alur keyboard penuh dengan Tab/Enter/Space pada input browser nyata, zoom browser 200% tanpa kehilangan isi, dan pengumuman pertanyaan/hasil oleh pembaca layar sungguhan. Pemeriksaan DOM dan atribut ARIA tidak menggantikannya. Karena itu T14 tidak dicentang. Pemeriksaan tersebut perlu dilakukan sebelum T14 ditutup; T15 tidak dimulai pada pekerjaan ini.


## T14 — Verifikasi keyboard dan pembesaran lanjutan

Tanggal: 28 Oktober 2026. Pemeriksaan [CDP Chrome](t14-keyboard-zoom-check.json) menggunakan `Input.dispatchKeyEvent` sehingga Tab, Enter, dan Space diproses browser sebagai input keyboard nyata. **15/15 pemeriksaan lulus**: mulai kuis, memilih dengan Space, Back dengan Enter, pilihan lama, sepuluh jawaban hingga hasil, Ulangi kuis, fokus heading, serta nama pertanyaan/hasil pada pohon aksesibilitas Chrome. Pengaturan ukuran efektif 160 CSS px dengan skala perangkat 2 menghasilkan ruang tata letak setara viewport 320 px pada pembesaran 200%; `scrollWidth=145` dan `innerWidth=160`, sehingga tidak terjadi overflow horizontal pada layar Q01 yang diuji. Ini semula simulasi reflow; pemeriksaan zoom browser asli 200% berikutnya dicatat di bawah.

Pengumuman suara/teks oleh Narrator atau NVDA belum dapat ditangkap otomatis di lingkungan ini. Pengguna menyatakan akan melakukan pemeriksaan manual dan melaporkan hasilnya. T14 tetap **belum selesai dan tidak dicentang** sampai pengumuman judul pertanyaan dan hasil dibuktikan, sementara zoom browser asli 200% pada Q01 dan hasil B sudah diperiksa di bawah. Pemeriksa CDP tersedia di `checks/accessibility-cdp-check.cjs`; ia hanya alat pengembangan dan tidak dimuat website.


### Zoom browser asli 200% — pemeriksaan tambahan

Chrome CDP mengirim shortcut Ctrl+Plus lima kali. `devicePixelRatio` meningkat dari 1 menjadi 2, sehingga browser benar-benar berada pada zoom 200%. Setelah viewport disetel ke 320 device px, lebar efektif menjadi 160 CSS px. Layar Q01 dan hasil B semula menunjukkan overflow pada daftar hasil (`scrollWidth=178`); CSS untuk daftar dan tombol hasil pada lebar efektif kecil diperbaiki. Pemeriksaan ulang [15/15 lulus](t14-keyboard-zoom-check.json): layar Q01 dan hasil B masing-masing `scrollWidth=152 <= innerWidth=160`, nama serta tombol ulang tetap ada. Ini membuktikan zoom asli pada skenario yang diuji, bukan seluruh kombinasi perangkat. Pengumuman pembaca layar sungguhan masih menunggu laporan pengguna; T14 tetap terbuka.


## T14–T18 — Verifikasi 29 Oktober 2026

Status: **T14, T15, T16, dan T18 selesai. T17 belum selesai.** Dependensi T14 diselesaikan berdasarkan laporan pengguna tentang uji Narrator + Chrome yang lulus dan regresi otomatis pada versi file saat ini. T15 kemudian lulus; hasilnya bersama T13/T14 memungkinkan T16 dan T18 ditutup. T17 tidak menjadi dependensi T18.

Lingkungan otomatis: Windows 11 build 26300, Intel Core i7-13650HX (20 logical CPU), RAM sekitar 32 GiB, Chrome 156.0.8078.73 headless. Metadata dan hash SHA-256 keenam file produksi ada pada [manifest verifikasi](t14-t18-verification.json). Tidak ada framework, npm, atau dependensi aplikasi baru. Script `.cjs` hanya alat pengembangan yang memakai Node.js bawaan lingkungan; website tetap berupa file statis dan tidak memuat script pemeriksa.

### Temuan dan perubahan

- `css/style.css`: aturan layout sebelumnya menimpa `[hidden]`, sehingga pembuka masih terlihat ketika kuis aktif. `#app [hidden]` kini menjaga layar dan kontrol nonaktif tetap tersembunyi. Pemeriksaan mencakup nilai `getComputedStyle(...).display`, bukan hanya atribut.
- `js/script.js`: menolak klik `detail > 1`, karena klik kedua dari double-click dapat tiba setelah DOM berpindah ke pertanyaan berikutnya. Kasus tersebut gagal sebelum perbaikan dan lulus sesudahnya. Timer yang dibatalkan juga dibersihkan referensinya.
- `css/style.css`: padding/jarak isi kartu ponsel dipadatkan tanpa mengecilkan font. Tinggi kartu pada viewport 320 px turun dari sekitar 409 px menjadi **369–393 px**; seluruh kartu muat dalam screenshot target.
- `js/ui.js` dan CSS: pergantian ke keyboard/touch menetralkan efek tanpa animasi reset; resize serta kartu yang keluar viewport ketika scroll membersihkan efek. Teks penjelasan motif tidak lagi muncul sebagai detail teknis pada halaman hasil.
- `index.html`: pratinjau pembuka memakai satu foto lokal yang sudah tersedia; progres memiliki batas minimum aksesibel 1. Foto hasil lain tetap dimuat hanya saat diperlukan.
- `js/script.js`: menambahkan User Timing `quiz-ready` setelah tombol mulai ditampilkan dan handler terpasang, sebagai batas pengukuran T18.

### T14 — Aksesibilitas

Pengguna melaporkan uji pengumuman pertanyaan/hasil **lulus**, lalu menyebut pasangan **Narrator + Chrome**. Versi tidak diberikan; ini bukti laporan pengguna, bukan klaim bahwa agen mendengar atau merekam suara. [Catatan laporan manual](t14-manual-screen-reader.json).

[100 pemeriksaan struktural](t14-structural-check.json) lulus pada lebar 320, 375, 768, 1280 CSS px. [16 pemeriksaan keyboard/zoom](t14-keyboard-zoom-check.json) memakai input CDP asli: Tab → Enter mulai, Space menjawab, Back, sepuluh jawaban, hasil, lalu Ulangi. Outline keyboard minimal 3 px terlihat; heading pertanyaan/hasil tersedia pada pohon aksesibilitas. Uji fokus programatis pada iframe dipisah dari uji outline keyboard karena heuristik `:focus-visible` browser tidak menjamin outline pada fokus melalui script. Kontras teks nama/gelar terhadap permukaan kartu pekat pada lima tema tetap minimal 4,5:1. Tidak ada teks penting di atas foto yang berubah-ubah latarnya.

Shortcut Ctrl+Plus lima kali mengaktifkan zoom Chrome asli 200%. Pada viewport 320 device px (160 CSS px efektif), Q01 dan hasil B memiliki `scrollWidth=152 <= innerWidth=160`. Pemeriksaan T16 juga mengulang pembuka, kuis, dan kelima hasil pada zoom 200% di keempat viewport. Ini bukti cakupan internal proyek, bukan audit kepatuhan aksesibilitas menyeluruh.

### T15 — Integrasi dan kasus tepi

[80 pemeriksaan integrasi](t15-integration-check.json) lulus: klik ganda yang tiba setelah pergantian, Enter ditahan, Back saat transisi, dua langkah Back Q07 → Q05, penggantian jawaban, pilihan Q06 tetap ada, kelima contoh hasil dan alasan, reset, refresh, reduced motion, gambar gagal, callback foto lama, data tidak valid, serta tidak ada exception JavaScript. Data invalid disediakan sebagai fixture server uji tanpa mengubah file produksi. Setiap jawaban 1–10 diperiksa agar hasil belum muncul sebelum seluruh jawaban lengkap.

Regresi skor memakai fungsi produksi pada `checks/scoring-check.html`: **1.024 kombinasi**, distribusi B=240/Y=204/C=196/P=192/H=192, **424 seri primer**, dan **14 kelompok pemeriksaan lulus**. Logika serta pemetaan skor produksi tidak diubah.

### T16 — Visual, responsif, dan cleanup

[344 pemeriksaan visual](t16-visual-check.json) lulus: pembuka, Q01–Q10 dan lima hasil pada empat lebar; pilihan A/B berdampingan pada zoom normal; target kontrol minimal 44 px; layar nonaktif benar-benar tersembunyi; kartu utuh; serta zoom Chrome asli 200%. Posisi pusat dan empat sudut pada kedua kartu memetakan tilt maksimal ±3°, posisi sorotan sesuai arah pointer, dan parallax maksimal ±6/±12 px. Tombol tidak bergeser ketika kartu bergerak. Perubahan reduced motion saat efek aktif membersihkan properti efek.

[8 pemeriksaan lifecycle](t16-pointer-lifecycle-check.json) lulus: tidak ada loop RAF saat pointer diam, keyboard langsung netral, keluar viewport (event sintetis), resize, tab tersembunyi (tab Chrome kedua), touch melalui CDP, dan scroll sampai kartu keluar viewport. Blur dan pergantian layar/reset juga tercakup pada pemeriksa T13/T15.

**29 screenshot ditinjau visual**: pembuka, Q05, dan kelima kartu pada empat viewport, ditambah contoh zoom 200%. Semua wajah utama tetap utuh dan teks tidak terpotong; gulir vertikal digunakan untuk isi panjang. Screenshot ini emulasi viewport pada desktop.

| Karakter | 320 × 568, netral | 375 × 667, netral |
| --- | --- | --- |
| Baek Kang-hyuk | [kartu B 320](t16-result-B-320.png) | [kartu B 375](t16-result-B-375.png) |
| Yang Jae-won | [kartu Y 320](t16-result-Y-320.png) | [kartu Y 375](t16-result-Y-375.png) |
| Cheon Jang-mi | [kartu C 320](t16-result-C-320.png) | [kartu C 375](t16-result-C-375.png) |
| Park Gyeong-won | [kartu P 320](t16-result-P-320.png) | [kartu P 375](t16-result-P-375.png) |
| Han Yu-rim | [kartu H 320](t16-result-H-320.png) | [kartu H 375](t16-result-H-375.png) |

Contoh layar: [pembuka desktop](t16-landing-1280.png), [kuis 375](t16-quiz-375.png), [hasil desktop](t16-result-B-1280.png), [zoom 200%](t16-result-H-320-zoom200.png). Daftar semua screenshot ada pada laporan JSON.

### T17 — Browser dan perangkat nyata

**Belum selesai, tidak dicentang.** Chrome desktop lulus pemeriksaan yang tersedia. Firefox tidak ditemukan di lokasi executable/registry yang diperiksa. Pengguna menyatakan belum memiliki hasil uji Android dan iPhone nyata. Tidak ada klaim bahwa viewport atau touch CDP menggantikan perangkat nyata. [Matriks dan langkah uji yang tersisa](t17-device-matrix.md). T17 memerlukan Firefox desktop, Chrome Android nyata, serta Safari iPhone nyata sebelum ditutup.

### T18 — Kinerja

[Lima cold load](t18-performance-check.json) dijalankan tanpa cache pada unduh **1,6 Mbps**, unggah **750 Kbps**, latensi **150 ms**, CPU **4×**. HTML/CSS/JS dikirim gzip oleh server statis alat uji; JPEG tidak dikompresi ulang. Tidak ada cache disk yang digunakan. Browser, perangkat/CPU, nilai tiap percobaan, header encoding, transfer jaringan aktual, dan Resource Timing tersimpan pada laporan.

| Percobaan | Siap pakai sejak navigation start |
| --- | --- |
| 1 | 502,7 ms |
| 2 | 457,8 ms |
| 3 | 455,1 ms |
| 4 | 456,2 ms |
| 5 | 502,5 ms |
| Median | **457,8 ms** |

Transfer awal maksimum **67.229 byte / 65,7 KiB**, di bawah 300 KiB. Pembuka memuat satu foto pratinjau B; kelima foto hasil tidak dipreload. Median di bawah 3 detik. T18 lulus untuk konfigurasi localhost terkompresi yang diuji; konfigurasi hosting lain yang mengubah kompresi/latensi perlu pengukuran ulang. Tidak ada deployment pada tugas ini.

### Menjalankan ulang dan batas pekerjaan

Dari root, gunakan `node checks/integration-check.cjs`, `node checks/visual-check.cjs`, `node checks/pointer-lifecycle-check.cjs`, `node checks/accessibility-cdp-check.cjs`, atau `node checks/performance-check.cjs`. Chrome dan server localhost sementara dimulai/dihentikan oleh alat; Node 24 dan Chrome telah tersedia di lingkungan ini, tanpa paket npm. Jalankan performance check sendiri agar tidak bersaing dengan pengujian lain. Untuk pemeriksa HTML, jalankan server statis biasa lalu buka berkas terkait di `checks/`.

`git diff --check` lulus. Pekerjaan berhenti setelah lingkup T18; T19–T22 tidak dimulai. Batas tersisa untuk permintaan ini adalah T17, dengan rincian perangkat yang belum diuji di atas.


## Revisi SDD audio — 29 Oktober 2026

Lingkup pekerjaan ini adalah pembaruan dokumen sesuai arahan pengguna. Requirement revisi 5 menambahkan FR-11 (musik/efek), FR-12 (kontrol dan lifecycle), NFR-15 (pemuatan dan batas audio). Design bagian 12 menjelaskan arah suasana, volume awal, lima identitas aset, gesture, error, pause/resume, dan arsitektur yang direncanakan. Empat steering diselaraskan; Task menambah T23–T25 serta dependensi verifikasi final versi dengan audio.

Referensi musik/efek ditelusuri pada halaman Pixabay dan Kenney yang ditautkan di desain. Kandidat belum didengarkan atau diunduh, sehingga tidak ada klaim telah memakai OST The Trauma Code atau audio telah bekerja. File aplikasi, aset, dan hasil skor tidak diubah oleh revisi dokumen ini. Bukti T14–T18 tetap bukti versi sebelum audio; T25 akan memeriksa ulang area yang terdampak setelah implementasi.

Pemeriksaan dokumen: ID kebutuhan/tugas baru unik, dependensi tidak bersiklus, tautan lokal tersedia, dan `git diff --check` lulus. Tidak ada pengujian runtime audio pada langkah ini karena belum ada kode audio.


## T19–T22 — Persiapan dan audit 29 Oktober 2026

**Status: tidak ada task T19–T22 yang dicentang.** Requirement aktif revisi 5 menambah dependensi audio. Sumber aplikasi tidak diubah pada pekerjaan ini; enam hash produksi cocok dengan manifest T14–T18. Perubahan lokal dokumen dari pekerjaan sebelumnya dipertahankan.

### T19 — Paket uji tersedia, hasil belum dapat dinilai

[usability-study.md](usability-study.md) berisi naskah, skenario, definisi timer/denominator, target, serta cara meninjau kebingungan berulang. [usability-results.csv](usability-results.csv) hanya header, tanpa baris peserta atau hasil buatan. Pengguna menjawab bahwa hasil sudah tersedia, tetapi permintaan lanjutan untuk angka anonim dan versi belum mendapat data. Jumlah rekaman yang dapat diverifikasi tetap 0; tingkat penyelesaian, median durasi, dan median relevansi belum dapat dihitung. Uji final juga menunggu T25; data sebelum audio perlu dicatat sebagai pilot bila nanti dikirim.

### T20 — Daftar temuan disiapkan

[findings.md](findings.md) mencatat gap audio, perangkat nyata, hasil peserta, dan finalisasi README. Bukti perbaikan double-click, hidden, dan tinggi kartu dari T15/T16 ditautkan sebagai temuan yang sudah ditutup; itu tidak menghapus gap baru revisi 5. Tidak ada masalah produksi baru ditemukan pada pemeriksaan host yang dilakukan. T17/T19/T25 belum selesai, sehingga T20 tidak dapat menyatakan semua temuan final selesai.

### T21 — README dan verifikasi versi yang tersedia

README yang sebelumnya hanya judul kini menjelaskan tujuan, fitur yang benar-benar tersedia, menjalankan server Python, file, skor, pemeriksa, penempatan root/subdirektori, contoh Nginx/gzip, aset, bukti, dan batas versi audio. Panduan aplikasi tidak memerlukan Node/npm/build/backend/akun. Alat `.cjs` tetap hanya kebutuhan pengembangan, bukan runtime website.

[17 pemeriksaan host](t21-static-host-check.json) lulus pada `/` dan `/trauma-quiz/`: CSS/JS, alur semua A, foto relatif, hasil B, ulang, serta pemeriksa produksi 1.024 kombinasi. Semua 22 request yang terekam memakai GET ke host sendiri tanpa query jawaban, semua response HTTP 200, tanpa exception JavaScript. Ini uji Chrome headless Windows melalui server statis alat uji dengan mount prefix, bukan klaim Nginx sudah dijalankan.

[Smoke server Python](t21-python-smoke.json) menjalankan `python -m http.server` pada port localhost sementara: 9 resource mengembalikan HTTP 200. Server sederhana tersebut tidak mengirim gzip, sesuai penjelasan README. Server/browser uji dihentikan setelah pemeriksaan. Contoh Nginx ditulis dengan referensi dokumentasi resmi yang ditautkan pada README, tetapi binary/konfigurasi Nginx tidak dieksekusi. T21 tetap belum selesai karena T24 belum tersedia untuk mendokumentasikan dan memverifikasi audio aktual.

### T22 — Audit menunjukkan belum siap

[readiness.md](readiness.md) memetakan semua 12 FR dan 15 NFR, membedakan bukti sebelum audio dari kebutuhan revisi 5 yang belum terpenuhi. [t19-t22-audit.json](t19-t22-audit.json) mencatat hash versi yang ditinjau, dokumen yang dibuat, bukti host, dan dependensi yang belum selesai. Keputusan audit adalah **NOT_READY**; T22 tetap kosong karena T20/T21 dan gate yang mendasarinya belum selesai.

Pemeriksaan akhir mencakup tautan lokal, konsistensi ID/dependensi, jumlah baris CSV yang sebenarnya, kecocokan hash produksi dengan bukti sebelumnya, sintaks dua alat `.cjs` yang terkait, serta `git diff --check`. Tidak menjalankan ulang semua tes logika/visual karena perubahan hanya dokumentasi dan fasilitas mount pada alat uji host; pemeriksa skor tetap dieksekusi untuk verifikasi jalur root/subdirektori.

Pekerjaan berhenti setelah lingkup T22. Tidak melanjutkan T23–T25, merekrut/menghubungi peserta, memublikasikan, atau men-deploy aplikasi. Urutan berikut yang memungkinkan tugas ini ditutup mengikuti Task: T23 → T24 → T17 → T25, kemudian T19/T20/T21/T22 sesuai dependensinya.
