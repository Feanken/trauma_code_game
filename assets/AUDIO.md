# Catatan teknis audio T23

Dipilih pada 29 Oktober 2026. Kelima MP3 disimpan lokal; tidak ada layanan musik atau unduhan pihak ketiga ketika aplikasi dimainkan. Ini interpretasi medis sinematis yang disetujui pengguna, bukan rekaman OST The Trauma Code.

| Berkas | Sumber dan pengolahan | Durasi decoded | Ukuran |
| --- | --- | --- | --- |
| `audio/bgm.mp3` | “The Complex” — Kevin MacLeod, segmen 15–71 detik, crossfade satu detik menjadi loop, normalisasi -20 LUFS, stereo 112 kbps | 55 s | 770.969 byte |
| `audio/start.mp3` | Kenney Interface Sounds, `confirmation_001.ogg`, trim, fade dan penyesuaian gain, mono 96 kbps | 250 ms | 3.805 byte |
| `audio/select.mp3` | Kenney Interface Sounds, `click_001.ogg`, trim/fade/gain, mono 96 kbps | 97,1 ms | 1.924 byte |
| `audio/back.mp3` | Kenney Interface Sounds, `back_001.ogg`, trim/fade/gain, mono 96 kbps | 61,0 ms | 1.611 byte |
| `audio/reveal.mp3` | “Heroic Age” — Kevin MacLeod, segmen sekitar detik 10, trim/fade/gain, mono 96 kbps | 1,4 s | 18.010 byte |

Empat efek berjumlah **25.350 byte**; seluruh audio **796.319 byte**, di bawah anggaran desain. Semua berhasil didecode dengan FFmpeg dan decoder Chrome; puncak hasil decode di bawah 1,0. FFmpeg hanya alat konversi sementara, bukan dependency aplikasi. Durasi decoded mengabaikan padding encoder MP3.

Identitas sumber dan atribusi disimpan di dokumen proyek ini, tanpa halaman kredit tambahan pada UI:

- “The Complex” dan “Heroic Age” by Kevin MacLeod (incompetech.com). Musik digunakan melalui opsi Creative Commons dengan kredit pembuat. [Halaman The Complex](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1300025), [halaman Heroic Age](https://incompetech.com/wordpress/2011/08/new-music-tuesday/), [lisensi dan kredit Incompetech](https://incompetech.com/music/royalty-free/licenses/). Kedua rekaman dipotong dan diolah seperti tabel.
- [Interface Sounds — Kenney](https://kenney.nl/assets/interface-sounds), CC0. Tiga efek dipotong, diatur levelnya, dan dikonversi ke MP3.

Pengguna mendengarkan pratinjau empat efek serta musik lengkap dan menyatakan **“Sudah didengarkan dan sesuai”**, termasuk pertanyaan tentang suasana, kejutan, dan kenyamanan sambungan loop. Agen memverifikasi berkas/decoder; penilaian pendengaran berasal dari pengguna. Hash, peak dan durasi: [laporan T23](../docs/t23-audio-assets.json). Pratinjau: `docs/t23-audio-preview.mp3`.
