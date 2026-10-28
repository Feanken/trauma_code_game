# UI & Accessibility — Panduan Agen AI

Proyek: **Which Trauma Code Character Are You?**  
Tanggal dibuat: 28 Oktober 2026  
Fungsi: pedoman tampilan, interaksi, dan aksesibilitas saat agen mengimplementasikan atau meninjau antarmuka.

## 1. Kedudukan dan acuan

Gunakan [project-overview.md](project-overview.md) untuk konteks, [feature-behavior.md](feature-behavior.md) untuk perilaku fitur, [requirement.md](../spec-analysisc/requirement.md) untuk kriteria penerimaan, [design.md](../spec-analysisc/design.md) untuk keputusan visual dan teknis, serta [Task.md](../spec-analysisc/Task.md) untuk pekerjaan dan dependensinya.

Panduan ini menjabarkan terutama NFR-04, NFR-05, NFR-06, NFR-07, NFR-08, NFR-11, NFR-12, dan NFR-13. Panduan tidak mengganti kebutuhan produk atau mengubah navigasi. Detail token, tema, ukuran, dan durasi berasal dari desain bagian 2–3, 8–9, dan 11.

Jika perubahan UI memerlukan perubahan perilaku atau kriteria produk, selaraskan dokumen SDD yang terdampak. Jangan mengubah jumlah pilihan, menambah Next, menghapus Back, atau mengubah tata letak A/B hanya untuk memudahkan CSS.

## 2. Arah visual yang harus dipertahankan

Pengalaman harus terasa seperti **mini-game drama medis dengan permukaan berlapis dan respons interaktif**. Kedalaman visual dibentuk dengan gradasi, pencahayaan, highlight, batas permukaan, dan bayangan. Interaksi ditunjukkan melalui respons fokus, sentuhan, tekan, pilihan, serta perpindahan konten.

| Lapisan | Aturan penggunaan |
| --- | --- |
| Latar | Navy gelap dengan cahaya lembut; tidak bersaing dengan teks atau foto karakter. |
| Dekorasi medis | Grid atau garis monitor yang samar; tidak menerima klik/fokus dan tidak menjadi informasi wajib. |
| Panel utama | Permukaan lebih terang dengan batas dan bayangan yang memberi pemisahan dari latar. |
| Kartu/tombol | Bentuk yang mudah dikenali sebagai kontrol, dengan kedalaman dan keadaan interaksi yang jelas. |
| Status aktif | Gabungkan warna, batas, tanda, dan teks untuk menyampaikan pilihan atau fokus. |

Pertahankan kedalaman meski animasi dimatikan: bayangan, batas, dan pencahayaan statis tetap bekerja. Tilt, efek kaca, atau blur bukan satu-satunya cara menghasilkan kedalaman. Tidak perlu mesin 3D, video latar, animasi terus-menerus, atau izin sensor.

Gunakan token dan lima tema karakter di desain, bukan warna acak per komponen. Mengulang kuis harus membersihkan tema hasil lama sesuai feature behavior.

## 3. Tata letak dan responsivitas

### Struktur tiap layar

- **Pembuka:** judul, pengantar, informasi kuis, dan Start Quiz menjadi prioritas. Desktop memakai teks di kiri dan pratinjau kartu di kanan. Ponsel menempatkan teks serta tombol sebelum ilustrasi.
- **Kuis:** urutan baca adalah identitas ringkas, progres, konteks, pertanyaan, A, B, lalu Back. Hanya satu pertanyaan aktif ditampilkan.
- **Hasil:** kartu mendahului uraian pada ponsel; desktop menempatkan kartu di kiri dan uraian di kanan. Deskripsi, kekuatan, alasan, pesan, Ulangi kuis, dan keterangan hiburan tetap dapat dibaca tanpa modal.

### Aturan ukuran dan aliran konten

Pertahankan **A di kiri dan B di kanan** pada lebar target 320, 375, 768, dan 1280 CSS px. Urutan DOM serta urutan fokus harus sejalan dengan urutan visual, bukan dibalik memakai CSS. Kedua kartu dalam satu baris mengikuti tinggi konten terpanjang.

Ikuti lebar konten, padding, jarak, sudut, dan breakpoint desain bagian 3.4. Gunakan ukuran fleksibel, pembungkusan teks, serta tinggi yang dapat bertambah. Hindari penguncian tinggi halaman, konten penting berposisi absolut, atau pemotongan nama karakter.

Gulir vertikal diperbolehkan. Jangan menyembunyikan overflow halaman untuk menutupi masalah layout. Bilah browser ponsel dan viewport pendek tidak boleh membuat kontrol penting tidak terjangkau.

Pada lebar sempit, ringkas bahasa tanpa mengubah makna pilihan. Jangan mengecilkan huruf pilihan agar dua kolom muat, memotongnya dengan ellipsis, atau menyembunyikan sebagian jawaban. Jika susunan yang disyaratkan tidak dapat memenuhi keterbacaan, catat konflik dan selaraskan spesifikasi sebelum menggantinya dengan susunan lain.

## 4. Tipografi, bahasa, dan kontras

Gunakan font sistem sesuai desain; tidak memuat font eksternal. Teks isi dasar 16 px, jarak baris sekitar 1,5, dan judul responsif mengikuti hierarki yang jelas. Pengaturan browser untuk zoom dan pembesaran teks harus tetap berfungsi.

Bahasa dokumen halaman adalah bahasa Indonesia. Pertahankan label dan istilah Inggris yang ditentukan spesifikasi, tetapi instruksi harus mudah dipahami pengguna Indonesia. Nama tombol harus menjelaskan aksi sebenarnya.

Teks biasa harus memiliki kontras minimal **4,5:1** terhadap latar aktualnya. Ukur setelah gradasi, transparansi, overlay, foto, dan tema diterapkan; nilai token saja bukan bukti lulus. Gunakan panel cukup pekat untuk teks yang berada di atas latar kompleks. Jangan meletakkan teks penting langsung di bagian foto yang berubah-ubah kontrasnya.

Periksa kelima tema karakter, termasuk teks sekunder, ringkasan kartu, dan pesan status. Dekorasi boleh samar, tetapi informasi yang dibutuhkan untuk menggunakan kuis tidak boleh diperlakukan sebagai dekorasi.

Warna tidak boleh menjadi satu-satunya pembeda pilihan, progres, fokus, atau identitas karakter. Hindari mengandalkan pasangan merah/hijau sebagai satu-satunya penanda status.

## 5. Kontrol dan keadaan interaksi

Gunakan tombol HTML native untuk Start Quiz, A/B, Back, dan Ulangi kuis. Kartu jawaban yang dapat ditekan adalah satu kontrol utuh; jangan menaruh tombol lain di dalamnya atau menampilkan seluruh kartu seolah interaktif padahal hanya teks kecil yang bisa ditekan.

Target tekan utama minimal **44 × 44 CSS px**. Bayangan, skala, dan efek tekan tidak boleh mengecilkan hit area atau membuat layout bergeser. Beri jarak yang cukup antarpilihan agar sentuhan tidak mudah salah sasaran.

| Keadaan | Tampilan dan semantik yang diperlukan |
| --- | --- |
| Biasa | Label terbaca, batas permukaan terlihat, dan fungsi kontrol mudah dikenali. |
| Hover | Highlight dan pergeseran kecil hanya pada perangkat yang mendukung hover. Tidak mengubah jawaban atau menampilkan informasi wajib yang tersembunyi sebelumnya. |
| Fokus keyboard | Outline jelas dengan offset; tetap terlihat di atas bayangan dan tidak terpotong panel. Fokus tidak otomatis memilih jawaban. |
| Ditekan | Respons tekan singkat tanpa mengubah posisi hit area. |
| Terpilih | Tepi aktif, centang, dan teks “Dipilih”; status pilihan tersimpan sesuai desain melalui `aria-pressed`. |
| Nonaktif/sementara terkunci | Kontrol tidak menerima aksi; status visual berbeda dari pilihan tersimpan dan tidak disampaikan lewat opacity saja. |

Back disembunyikan pada Q01 sesuai desain. Selama perpindahan, pilihan dan Back tidak menerima aksi baru. Detail penguncian dan reset mengikuti feature behavior; CSS semata tidak boleh dianggap cukup untuk mencegah event berulang.

Pengguna sentuh dan keyboard harus memperoleh informasi yang sama dengan pengguna mouse. Jangan menambahkan petunjuk penting hanya melalui tooltip hover.

## 6. Keyboard dan pengelolaan fokus

Seluruh alur harus dapat diselesaikan melalui Tab, Shift+Tab, Enter, dan Space pada kontrol native. Jangan memakai urutan Tab positif untuk memperbaiki DOM yang tidak teratur atau menangkap tombol panah/scroll tanpa kebutuhan produk.

| Peristiwa | Tujuan fokus |
| --- | --- |
| Halaman baru | Biarkan urutan fokus browser normal; jangan mencuri fokus otomatis ke tombol atau dekorasi. |
| Start Quiz | Heading pertanyaan pertama. |
| Jawaban diterima dan pertanyaan berganti | Heading pertanyaan baru, mencakup konteks nomor pertanyaan. |
| Back | Heading pertanyaan sebelumnya; pilihan tersimpan dapat ditemukan melalui navigasi normal. |
| Hasil tampil | Heading hasil. |
| Ulangi kuis | Heading pertanyaan pertama pada sesi bersih. |
| Permintaan hasil dengan jawaban belum valid | Heading pertanyaan pertama yang perlu dijawab, sesuai pemulihan alur pada desain. |

Heading tujuan fokus dapat memakai `tabindex="-1"` agar dapat difokuskan programatis tanpa menambah langkah Tab permanen. Render dan tampilkan target sebelum memindahkan fokus; jangan membiarkan fokus berada pada elemen yang baru disembunyikan atau dihapus.

Layar nonaktif memakai `hidden` sesuai desain. CSS tidak boleh membatalkan penyembunyian tersebut dan membuat kontrol layar lain tetap muncul. Tidak ada dekorasi atau gambar statis yang masuk urutan Tab.

Jangan menutupi elemen yang mendapat fokus dengan overlay, panel mengambang, atau animasi reveal. Perpindahan ke heading harus membuat konteks pertanyaan/hasil dapat ditemukan tanpa gulir horizontal.

## 7. Semantik dan pembaca layar

Gunakan struktur halaman dan heading yang menjelaskan pembuka, pertanyaan aktif, dan hasil. Nama aksesibel kontrol harus mencakup teks yang terlihat; label “A” atau “B” saja tidak cukup. Hindari mengganti nama pilihan dengan `aria-label` yang berbeda dari teksnya.

Sediakan petunjuk singkat sebelum pengguna menjawab bahwa memilih jawaban akan langsung membuka pertanyaan berikutnya dan Back dapat dipakai untuk mengubah jawaban. Petunjuk ini menjelaskan perilaku yang sudah ada, bukan menambah langkah konfirmasi.

Kelompok pilihan harus terhubung secara semantik dengan pertanyaan aktif. Pertahankan tombol native dan status `aria-pressed` sesuai desain, tanpa menambahkan penanganan keyboard ganda yang membuat satu aksi maju dua kali. Nama pilihan tetap stabil; status terpilih diberikan sebagai status pendamping.

Progres memiliki nama, rentang 1–10, serta nilai pertanyaan aktif, disertai teks n/10 yang terlihat. Setelah Back, nilai aksesibel dan visual harus sama-sama mundur. Jangan memberi makna bahwa bilah adalah nilai skor atau jumlah jawaban benar.

Ketika heading pertanyaan atau hasil menerima fokus, konteks yang dibutuhkan harus diumumkan. Jangan sekaligus memasukkan seluruh layar ke live region dan mengumumkan teks yang sama melalui beberapa jalur. Periksa perilaku aktual pembaca layar, bukan hanya keberadaan atribut ARIA.

Informasi teks penting harus berupa teks DOM, bukan teks yang hanya ditanam pada gambar atau dihasilkan lewat pseudo-element. Dekorasi monitor, cahaya, grid, dan ikon yang redundan memakai semantik dekoratif serta tidak menerima fokus.

## 8. Foto karakter dan kartu ID

Foto karakter boleh berasal dari internet dan disimpan lokal sesuai NFR-08 serta desain bagian 11. Catat sumber/izin/atribusi dalam `assets/SOURCES.md` pada implementasi. Tidak ada kewajiban menggantinya dengan ilustrasi orisinal.

Gunakan dimensi yang ditetapkan, area rasio 4:3, dan crop per foto agar wajah tidak terpotong. Pemuatan atau kegagalan foto tidak boleh menggeser tombol, merusak fokus, atau menghalangi hasil. Gunakan fallback inisial pada bidang tema bila gambar gagal.

Alt text mengikuti fungsi foto: sebut karakter jika foto menambah informasi; gunakan alt kosong bila foto hanya mengulang nama yang sudah menjadi label bersebelahan. Jangan memakai nama file sebagai alt atau memaparkan URL sumber sebagai pengganti deskripsi. Fallback dekoratif tidak perlu mengulang nama karakter yang sudah tersedia dalam teks.

Kartu maksimal sekitar 360 px lebar; pada viewport 320 px, lebar sekitar 288 px dan tinggi dasar maksimal 400 px mengikuti desain. Ringkasan pendek berada di kartu, sedangkan deskripsi panjang di luar kartu.

Verifikasi tangkapan layar pada viewport **320 × 568** dan **375 × 667 CSS px** setelah pengguna menggulir ke kartu, pada zoom normal. Pada zoom 200% atau pembesaran teks, tinggi kartu boleh bertambah. Jangan memotong teks, mengunci tinggi, atau mengecilkan font demi mempertahankan bentuk tangkapan layar.

Keterangan fan-made, hiburan, dan kredit yang diwajibkan tetap dapat ditemukan. Kartu merupakan hadiah visual, bukan formulir data pengguna atau identitas staf resmi. Tidak ada tombol unduh atau berbagi yang belum menjadi fitur MVP.

## 9. Gerakan dan kenyamanan

Ikuti batas desain bagian 3.5: hover sekitar 160 ms, respons tekan 80–100 ms, total perpindahan pertanyaan maksimal 320 ms, progres sekitar 180 ms, dan reveal hasil maksimal 450 ms. Jangan menambah jeda buatan untuk memberi kesan sedang menghitung kepribadian.

Animasi memakai perpindahan kecil dan tetap mempertahankan keterbacaan. Tidak ada suara otomatis, kedipan, confetti terus-menerus, atau video latar. Tilt dan sorotan kartu ID pembuka/hasil serta parallax dua lapisan latar wajib untuk mouse yang memenuhi kondisi desain 3.6. Batasnya ±3° per sumbu pada kartu serta ±6/±12 px pada dekorasi. Sorotan mengikuti posisi pointer lokal. Pertanyaan, pilihan jawaban, dan tombol tetap stabil. Gunakan wrapper kartu yang tidak bergerak, smoothing sekitar 120 ms, dan reset maksimal 180 ms saat keluar. Reset juga pada pergantian layar, ulang, blur, dan dokumen tersembunyi; callback lama dibatalkan. Pada touch, mode keyboard, atau reduced motion, efek langsung netral dan pencahayaan statis tetap ada. Jangan meminta sensor atau mengganti efek ini dengan gerakan ponsel.

Dengan `prefers-reduced-motion`, nonaktifkan tilt, pergeseran, serta animasi dekoratif yang tidak esensial. Pergantian konten dapat langsung dilakukan; tanda terpilih, fokus, progres teks, dan kedalaman statis tetap tersedia. Mengurangi gerakan tidak boleh menghapus feedback atau perlindungan klik/keyboard berulang.

Tidak ada fungsi yang menunggu `animationend` sebagai satu-satunya pemicu penyelesaian. Animasi yang terhenti, tidak dijalankan, atau berbeda perilaku antarbrowser tidak boleh membuat UI terkunci.

## 10. Kegagalan dan informasi pengguna

Jika JavaScript tidak tersedia, pesan `noscript` harus menjelaskan bahwa kuis memerlukannya. Bila data tidak valid saat inisialisasi, tampilkan pesan yang mudah dipahami dan jangan menawarkan Start Quiz seolah aplikasi siap. Detail debugging hanya untuk console pengembang.

Jika jawaban belum lengkap ketika hasil diminta, jangan menampilkan hasil asal atau pesan diagnosis; kembalikan konteks ke pertanyaan yang perlu dijawab sesuai feature behavior. Jika foto gagal, hasil tetap terbaca dan Ulangi kuis tetap dapat dipakai.

Pesan status dan kegagalan harus dapat dibaca sebagai teks, bukan hanya ikon atau warna. Jangan menambahkan modal error, permintaan akun, atau proses unggah data sebagai solusi untuk masalah lokal.

## 11. Pemeriksaan dan bukti

Gunakan tabel berikut saat mengerjakan tugas implementasi terkait. Ini rencana pemeriksaan, bukan pernyataan bahwa UI sudah lulus.

| Area | Bukti yang dibutuhkan | Kebutuhan / tugas |
| --- | --- | --- |
| Kedalaman visual | Tinjauan pembuka, kuis, dan kelima tema hasil; lapisan, highlight, batas, dan status tetap terlihat. | NFR-07; T07, T13, T16 |
| Responsif | Tiga layar pada lebar 320, 375, 768, 1280 px; A/B sejajar, teks utuh, tanpa overflow horizontal. | NFR-04; T16 |
| Kontrol | Target minimal 44 × 44 CSS px; semua keadaan terlihat; hit area tidak bergeser saat ditekan. | NFR-05, NFR-12; T07, T14, T16 |
| Keyboard/fokus | Alur mulai → jawab → Back → hasil → ulang; heading tujuan dan urutan Tab sesuai konteks. | NFR-05; T14, T15 |
| Pembaca layar | Nama tombol, pertanyaan, pilihan tersimpan, progres, dan hasil terbaca tanpa pengumuman ganda. | NFR-05; T14 |
| Kontras | Catatan pengukuran teks terhadap latar aktual pada kelima tema, termasuk teks di sekitar foto. | NFR-05; T14 |
| Pembesaran | Zoom 200% dan teks panjang tidak memotong isi atau menghilangkan kontrol. | NFR-05; T14, T16 |
| Mengikuti mouse | Uji pusat/sudut pada kedua kartu, sorotan, batas parallax, hit area stabil, keluar/blur/pergantian layar, cleanup, serta pergantian input pada perangkat hibrida bila tersedia. | NFR-07, NFR-12; T13, T16, T17 |
| Gerakan dikurangi | Perpindahan lengkap tetap bekerja tanpa tilt/animasi dekoratif; satu aksi tidak melewati pertanyaan. | NFR-06, NFR-12; T13, T15 |
| Kartu dan gambar | Tangkapan layar pada dua viewport target; crop wajah, alt sesuai fungsi, dan fallback foto berfungsi. | FR-08, NFR-08; T06, T11, T16 |
| Perangkat dan input | Chromium/Firefox desktop, Chrome Android dan Safari iPhone nyata; browser sosial bila dipakai peserta. | NFR-11, NFR-12; T17 |
| Kinerja visual | Tidak memuat kelima foto pada pembuka; ukuran aset dan waktu siap pakai diperiksa dengan profil desain. | NFR-13; T06, T18 |

Catat browser/versi, perangkat, OS, viewport, mode input, pasangan pembaca layar/browser bila dipakai, langkah pemeriksaan, hasil aktual, dan keterbatasan pada `docs/verification.md` saat implementasi berlangsung. Pemeriksa otomatis atau screenshot saja tidak menggantikan uji keyboard dan pembaca layar. Emulasi tidak dinyatakan sebagai pengujian ponsel nyata.

Jika alat, perangkat, atau pemeriksaan wajib belum tersedia, nyatakan belum diuji dan pertahankan status tugasnya. Jangan menyatakan kepatuhan terhadap standar aksesibilitas menyeluruh hanya karena checklist internal proyek sudah dijalankan.

## 12. Batas tahap dan pemeliharaan

Dokumen ini tidak membuat komponen UI, mengunduh foto, menjalankan uji aksesibilitas, atau menandai Task selesai. Saat dibuat, pekerjaan hanya menambahkan `steeering/ui-accessibility.md`.

Pertahankan konsistensi dengan requirement, desain, dan feature behavior saat ada perubahan. Panduan konvensi kode belum dibuat pada tahap ini; jangan menganggap placeholder dokumen tersebut sebagai aturan yang sudah tersedia.
