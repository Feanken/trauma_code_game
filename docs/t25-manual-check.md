# Pemeriksaan manusia versi audio — T25

Tanggal: 29 Oktober 2026. **T25 belum selesai.** Bukti pendengaran aset T23 dan bukti perilaku bunyi di aplikasi berasal dari laporan pengguna, bukan rekaman atau penilaian suara oleh agen.

| Bagian | Status dan sumber |
| --- | --- |
| Suasana musik/empat efek, tidak mengagetkan, kenyamanan loop | Pengguna: “Sudah didengarkan dan sesuai”, setelah pratinjau dan musik lengkap diberikan. T23 lulus. |
| Bunyi aksi, mute dan resume di aplikasi | Pengguna menjawab “Sudah lulus; saya sertakan rincian” atas skenario efek jawab/Back/hasil/ulang sekali pada aksi tepat, mute langsung senyap, resume musik eksplisit setelah kembali dari tab lain. Rincian browser/versi belum disertakan; dicatat sebagai laporan lulus pengguna dengan batas tersebut. |
| Narrator + Chrome untuk kontrol audio baru | Pengguna melaporkan lulus pada 29 Oktober 2026 untuk tombol Musik/Efek, status aktif/mati, nama dan nilai kedua volume. Versi OS/browser tidak diberikan. Ini laporan baru, terpisah dari T14. |
| Firefox desktop | Belum diuji; executable tidak tersedia pada penelusuran T17 sebelumnya. |
| Chrome Android nyata | Belum diuji; pengguna sebelumnya menyatakan belum ada hasil ponsel nyata. |
| Safari iPhone nyata | Belum diuji; volume Web Audio dan unlock harus diperiksa khusus di sini. |

Untuk pembaca layar: Tab melalui Musik → volume musik → Efek → volume efek; uji Enter/Space pada tombol dan panah pada slider. Pastikan nama, aktif/mati, nilai, serta status dijeda terbaca. Lanjutkan Start → jawab → Back → hasil → ulang dan pastikan heading tetap diumumkan jelas tanpa pengumuman ganda.

Untuk setiap browser/perangkat wajib: catat model, OS dan versi browser, lalu mulai → jawab → Back dua kali → koreksi → hasil → ulang. Dengarkan empat efek, periksa volume kanal secara terpisah termasuk nol, mute, pindah tab/blur, kembali tanpa auto-resume, dan lanjutkan dengan tombol musik. Pada ponsel pastikan kontrol volume benar-benar mengubah keras suara dan kartu tetap netral ketika disentuh. Jika efek Start pertama terlewat karena buffer belum siap, itu sesuai desain; efek tidak boleh muncul terlambat.

Emulasi viewport, state `playing`, dan instrumentasi node Chrome bukan pengganti uji pendengaran/perangkat tersebut. Bukti otomatis: [audio](t25-audio-check.json), [keyboard/zoom](t25-keyboard-zoom-check.json), [aksesibilitas/kontras](t25-accessibility-check.json), [visual](t25-visual-check.json), [integrasi](t25-integration-check.json), [kinerja](t25-performance-check.json), [host](t25-static-host-check.json).
