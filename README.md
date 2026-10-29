# Which Trauma Code Character Are You?

Kuis kepribadian fan-made untuk hiburan dan belajar pengembangan web. Jawab sepuluh pertanyaan A/B untuk memperoleh satu dari lima karakter *The Trauma Code* dan Trauma Team ID Card. Hasil bukan diagnosis atau penilaian psikologis ilmiah; proyek ini nonkomersial dan tidak berafiliasi resmi.

**Status 29 Oktober 2026: aplikasi sebelum audio sudah berjalan; MVP revisi 5 belum siap dinyatakan selesai.** Musik/efek T23–T25 belum diimplementasikan. Firefox desktop, dua ponsel nyata, dan uji calon pengguna juga belum lengkap. README ini adalah draf T21 untuk versi yang benar-benar tersedia; T21 belum dicentang karena T24 belum selesai.

## Menjalankan lokal

Buka terminal di root repository, tempat `index.html` berada. Jika Python 3 sudah tersedia, jalankan:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Pada Windows yang memakai Python Launcher, gunakan `py -m http.server 8000 --bind 127.0.0.1` bila perintah `python` tidak tersedia. Buka [aplikasi lokal](http://127.0.0.1:8000/) di browser. Hentikan server dengan Ctrl+C. Jika port 8000 sedang dipakai, ganti angka port pada perintah dan alamat browser.

Tidak ada langkah npm, Node.js, build, database, akun, atau API untuk menjalankan aplikasi. Python hanya menyediakan server file lokal; server HTTP statis lain juga dapat dipakai. Pengoperasian yang diuji memakai HTTP, bukan membuka HTML dengan `file://`. Perintah server lokal mengikuti [dokumentasi Python](https://docs.python.org/3/library/http.server.html); untuk hosting tetap, gunakan server statis seperti contoh Nginx di bawah.

## Memakai kuis

Tekan **Start Quiz**, lalu pilih A atau B. Pilihan langsung membuka pertanyaan berikutnya. **Back** tersedia mulai pertanyaan kedua dan mempertahankan jawaban lain ketika satu jawaban diganti. Setelah Q10, hasil menampilkan karakter, tiga kekuatan, serta dua alasan dari jawaban yang dipilih. **Ulangi kuis** kembali ke Q01 dengan sesi kosong. Refresh kembali ke pembuka; jawaban tidak disimpan di browser storage atau dikirim ke server.

Versi saat ini diam dan belum memiliki kontrol audio. Revisi 5 merencanakan musik instrumental, empat efek, mute serta volume terpisah, dan pemuatan setelah tindakan pengguna. Perilaku itu belum boleh dianggap tersedia hanya karena tercantum dalam spesifikasi.

## Struktur berkas

| Jalur | Isi |
| --- | --- |
| `index.html` | Tiga layar, kontrol native, metadata, dan pesan ketika JavaScript mati. |
| `css/style.css` | Layout responsif, tema, fokus, gerakan, reduced motion. |
| `js/data.js` | Pertanyaan, karakter, pemetaan poin, alasan, dan gambar lokal. |
| `js/quiz.js` | Validasi, skor murni, seri, serta alasan hasil. |
| `js/ui.js` | Render, fokus, gambar/fallback, efek pointer dan cleanup. |
| `js/script.js` | State sesi dan event, penguncian, maju/Back, serta ulang. |
| `assets/images/` | Lima JPEG karakter yang dipakai serta alternatif riset yang belum dipakai. |
| `checks/` | Pemeriksa browser dan alat pengembangan; tidak dimuat oleh aplikasi. |
| `spec-analysisc/` | Requirement revisi 5, design, Task, dan analisis historis. |
| `steeering/` | Panduan agen untuk perilaku, UI/aksesibilitas, dan konvensi kode. |
| `docs/` | Bukti aktual, screenshot, uji pengguna, daftar temuan, dan kesiapan. |

`js/audio.js` serta `assets/audio/` masih rencana T23–T24 dan belum tersedia. Script aplikasi yang ada dimuat dengan `defer` dalam urutan data → quiz → ui → script.

## Aturan skor

Setiap pilihan memberi 2 poin kepada satu karakter; sepuluh jawaban lengkap berjumlah 20 poin. Hasil selalu dihitung ulang dari jawaban terbaru. Kandidat dengan skor tertinggi menang. Jika seri, jawaban pada pertanyaan yang kedua pilihannya sama-sama berada dalam kelompok seri awal menjadi pembanding sekali. Jika masih seri, urutan tetap **B → Y → C → P → H** digunakan. Dua alasan diambil dari dua jawaban pendukung pemenang yang paling awal.

Pemetaan dan contoh lengkap ada pada [design](spec-analysisc/design.md). Distribusi 1.024 kombinasi adalah B=240, Y=204, C=196, P=192, H=192, dengan 424 seri primer. Angka tersebut menguji struktur skor, bukan distribusi perilaku manusia.

## Pemeriksa dan bukti

Saat server lokal berjalan, buka [pemeriksa skor](http://127.0.0.1:8000/checks/scoring-check.html). Laporan yang diharapkan adalah LULUS untuk 1.024 kombinasi dan 424 seri. Pemeriksa lain adalah `checks/data-check.html`, `checks/result-unit-check.html`, dan `checks/accessibility-check.html`.

Alat `.cjs` memakai Node dan Chrome yang tersedia di lingkungan pengembangan; keduanya bukan kebutuhan pengguna website. Salah satu contohnya `node checks/static-host-check.cjs` untuk memeriksa alur pada root dan subdirektori. Tidak ada paket npm yang perlu dipasang. Alat ini memiliki path Chrome Windows bawaan; pengujian pada lingkungan lain perlu menyesuaikan executable.

Bukti sebelumnya: [verification](docs/verification.md), [manifest T14–T18](docs/t14-t18-verification.json), dan [matriks perangkat](docs/t17-device-matrix.md). Hasil server pada tugas ini: [root/subdirektori](docs/t21-static-host-check.json). Batas versi audio dan pengujian yang tersisa ada pada [kesiapan MVP](docs/readiness.md). Screenshot dan pemeriksaan otomatis tidak menggantikan uji peserta atau ponsel nyata.

## Menempatkan pada host statis

Untuk versi saat ini, salin `index.html`, `css/`, `js/`, dan lima JPEG yang dirujuk `js/data.js` ke direktori web sambil mempertahankan struktur. Tidak ada proses build. `checks/` dapat ikut ditempatkan jika ingin membuka pemeriksa skor dari host; file `.cjs` tidak dijalankan oleh host statis. `docs/` dan spesifikasi tidak diperlukan aplikasi saat dimainkan.

Semua jalur aplikasi relatif. Untuk hosting pada `/trauma-quiz/`, tempatkan struktur yang sama di folder tersebut dan buka `/trauma-quiz/` dengan slash terakhir atau `/trauma-quiz/index.html`. Tidak ada routing SPA atau kebutuhan mengembalikan `index.html` ketika gambar/JS tidak ditemukan. Berkas yang benar-benar hilang seharusnya menghasilkan 404 agar fallback gambar bekerja.

Contoh **server block Nginx** untuk root, dengan asumsi konfigurasi `http` yang ada sudah memuat `mime.types`:

```nginx
server {
    listen 8080;
    server_name localhost;
    root /srv/www/trauma-quiz;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/css text/javascript application/javascript application/json;
}
```

Untuk varian subdirektori, gunakan `root /srv/www;`, letakkan aplikasi di `/srv/www/trauma-quiz/`, dan ganti blok `location` di atas dengan:

```nginx
location = /trauma-quiz {
    return 301 /trauma-quiz/;
}
location /trauma-quiz/ {
    try_files $uri $uri/ =404;
}
```

Sesuaikan port dan lokasi folder dengan host. Periksa konfigurasi dengan `nginx -t` sebelum menerapkannya. Contoh ini merujuk [panduan konten statis Nginx](https://nginx.org/en/docs/beginners_guide.html#serving_static_content) dan [modul gzip](https://nginx.org/en/docs/http/ngx_http_gzip_module.html); Nginx dan konfigurasi hosting publik belum dijalankan pada pekerjaan ini.

Di Network browser, pastikan HTML/CSS/JS dan foto berhasil dimuat dari host sendiri. Untuk server terkompresi, periksa `Content-Encoding: gzip` pada teks; JPEG tidak perlu dikompresi ulang. T18 mencatat median 457,8 ms dan transfer awal maksimum 65,7 KiB pada profil uji serta server gzip lokal tertentu. Perintah Python sederhana tidak mengaktifkan gzip, sehingga hasilnya tidak boleh disamakan dengan angka tersebut. Setelah audio dipasang, T25 harus mengulang kinerja dan verifikasi host.

## Aset dan status rilis

Lima foto berasal dari internet dan disimpan lokal sesuai keputusan penggunaan pribadi pengguna. [SOURCES.md](assets/SOURCES.md) memuat riwayat penelusuran; beberapa status lama di sana mendahului keputusan aset final. Browser aplikasi memakai file lokal, bukan hotlink dari daftar riset.

Kandidat musik baru tercantum pada design 12; belum ada audio yang diunduh atau diputar. Kesiapan rilis masih menunggu T23–T25, pemeriksaan T17, hasil peserta T19, serta penutupan temuan dan serah terima T20–T22. Tidak ada deployment yang dilakukan oleh penulisan README ini.
