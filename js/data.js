(function () {
  'use strict';

  const app = window.TraumaQuiz = window.TraumaQuiz || {};

  // Isi dan pemetaan mengikuti design.md bagian 3.3, 4, 5.4, dan 6.
  app.data = {
    questions: [
      {
        id: 'Q01',
        context: 'Mulai bergerak',
        prompt: 'Kelompokmu mendapat tugas baru. Kamu biasanya mulai dari mana?',
        options: [
          {
            id: 'A',
            label: 'Mengajak semua mulai dengan satu langkah jelas.',
            characterId: 'B',
            points: 2,
            reason: 'Kamu membantu tim menemukan langkah pertama.'
          },
          {
            id: 'B',
            label: 'Menggali hal yang belum kupahami dulu.',
            characterId: 'Y',
            points: 2,
            reason: 'Kamu ingin memahami hal baru sebelum melangkah.'
          }
        ]
      },
      {
        id: 'Q02',
        context: 'Menjaga tim',
        prompt: 'Proyek mulai berantakan. Apa yang kamu lakukan lebih dulu?',
        options: [
          {
            id: 'A',
            label: 'Memastikan teman-teman masih sanggup lanjut.',
            characterId: 'C',
            points: 2,
            reason: 'Kamu memperhatikan kapasitas orang di dalam tim.'
          },
          {
            id: 'B',
            label: 'Mengambil alih pembagian tugas sementara.',
            characterId: 'B',
            points: 2,
            reason: 'Kamu bersedia mengambil tanggung jawab saat keadaan kacau.'
          }
        ]
      },
      {
        id: 'Q03',
        context: 'Keputusan',
        prompt: 'Ada masalah mendadak saat acara. Kamu lebih nyaman…',
        options: [
          {
            id: 'A',
            label: 'Memilih langkah pertama dan segera bergerak.',
            characterId: 'B',
            points: 2,
            reason: 'Kamu berani menggerakkan tindakan saat situasi berubah.'
          },
          {
            id: 'B',
            label: 'Memeriksa detail penting sebelum bertindak.',
            characterId: 'P',
            points: 2,
            reason: 'Kamu menjaga ketelitian ketika tekanan meningkat.'
          }
        ]
      },
      {
        id: 'Q04',
        context: 'Kesempatan',
        prompt: 'Kamu diajak membuat acara kecil. Apa pendekatanmu?',
        options: [
          {
            id: 'A',
            label: 'Menyiapkan tujuan dan rencana cadangan.',
            characterId: 'H',
            points: 2,
            reason: 'Kamu menyiapkan arah dan kemungkinan alternatif.'
          },
          {
            id: 'B',
            label: 'Mengajak tim mencoba ide awal sekarang.',
            characterId: 'B',
            points: 2,
            reason: 'Kamu memberi energi untuk mencoba langkah awal.'
          }
        ]
      },
      {
        id: 'Q05',
        context: 'Belajar bersama',
        prompt: 'Teman kesulitan memakai alat yang juga baru buatmu. Kamu…',
        options: [
          {
            id: 'A',
            label: 'Mencari tutorial lalu mencoba bersama.',
            characterId: 'Y',
            points: 2,
            reason: 'Kamu terbuka belajar sambil membantu teman.'
          },
          {
            id: 'B',
            label: 'Menanyakan bagian yang membuatnya kewalahan.',
            characterId: 'C',
            points: 2,
            reason: 'Kamu mencari tahu apa yang sedang dirasakan teman.'
          }
        ]
      },
      {
        id: 'Q06',
        context: 'Umpan balik',
        prompt: 'Hasil tugasmu perlu diperbaiki. Kamu memilih…',
        options: [
          {
            id: 'A',
            label: 'Memeriksa bagian yang kurang tepat satu per satu.',
            characterId: 'P',
            points: 2,
            reason: 'Kamu memperbaiki hasil dengan pemeriksaan yang teliti.'
          },
          {
            id: 'B',
            label: 'Minta contoh agar bisa mencoba cara baru.',
            characterId: 'Y',
            points: 2,
            reason: 'Kamu memakai masukan untuk mencoba cara baru.'
          }
        ]
      },
      {
        id: 'Q07',
        context: 'Tantangan baru',
        prompt: 'Ada kesempatan ikut proyek baru. Apa yang paling kamu cari?',
        options: [
          {
            id: 'A',
            label: 'Pengalaman untuk mempelajari kemampuan baru.',
            characterId: 'Y',
            points: 2,
            reason: 'Kamu menghargai kesempatan mengembangkan kemampuan.'
          },
          {
            id: 'B',
            label: 'Peluang yang mendukung tujuan jangka panjang.',
            characterId: 'H',
            points: 2,
            reason: 'Kamu menghubungkan pilihan dengan tujuan jangka panjang.'
          }
        ]
      },
      {
        id: 'Q08',
        context: 'Tenggat',
        prompt: 'Tenggat mendekat dan temanmu mulai panik. Kamu…',
        options: [
          {
            id: 'A',
            label: 'Menemaninya menata pekerjaan yang terasa berat.',
            characterId: 'C',
            points: 2,
            reason: 'Kamu membantu orang menghadapi tekanan bersama.'
          },
          {
            id: 'B',
            label: 'Membantu mengecek bagian yang paling rawan salah.',
            characterId: 'P',
            points: 2,
            reason: 'Kamu menjaga kualitas pada bagian yang berisiko salah.'
          }
        ]
      },
      {
        id: 'Q09',
        context: 'Beda pendapat',
        prompt: 'Dua teman mengusulkan arah berbeda untuk proyek. Kamu…',
        options: [
          {
            id: 'A',
            label: 'Membandingkan dampak kedua ide ke tujuan tim.',
            characterId: 'H',
            points: 2,
            reason: 'Kamu menilai pilihan berdasarkan dampaknya pada tujuan tim.'
          },
          {
            id: 'B',
            label: 'Menggali kebutuhan agar keduanya merasa didengar.',
            characterId: 'C',
            points: 2,
            reason: 'Kamu berusaha memberi ruang bagi kebutuhan setiap orang.'
          }
        ]
      },
      {
        id: 'Q10',
        context: 'Evaluasi',
        prompt: 'Setelah acara selesai, apa yang paling ingin kamu evaluasi?',
        options: [
          {
            id: 'A',
            label: 'Detail pelaksanaan yang bisa dibuat lebih rapi.',
            characterId: 'P',
            points: 2,
            reason: 'Kamu tertarik merapikan detail pelaksanaan.'
          },
          {
            id: 'B',
            label: 'Strategi agar acara berikutnya berdampak lebih besar.',
            characterId: 'H',
            points: 2,
            reason: 'Kamu mencari strategi agar usaha berikutnya lebih berdampak.'
          }
        ]
      }
    ],
    characters: [
      {
        id: 'B',
        image: { src: 'assets/images/baek-kang-hyuk.jpg' },
        name: 'Baek Kang-hyuk',
        title: 'The Fearless Leader',
        summary: 'Berani bergerak, siap memimpin.',
        description: 'Saat keadaan belum jelas, kamu cenderung membantu tim menentukan langkah pertama. Kamu nyaman mengambil tanggung jawab dan memberi dorongan agar pekerjaan berjalan.',
        strengths: [
          'Keberanian',
          'inisiatif',
          'ketegasan'
        ],
        message: 'Tim butuh keberanianmu. Sisakan juga ruang untuk mendengar.',
        theme: {
          accent: '#FFC078',
          motif: 'Garis tegas dan chevron arah.'
        }
      },
      {
        id: 'Y',
        image: { src: 'assets/images/yang-jae-won.jpg' },
        name: 'Yang Jae-won',
        title: 'The Thoughtful Learner',
        summary: 'Selalu tumbuh lewat pengalaman.',
        description: 'Kamu melihat tantangan sebagai kesempatan belajar. Bertanya, mencoba, dan menerima masukan membantumu berkembang sambil tetap berkontribusi dalam tim.',
        strengths: [
          'Rasa ingin tahu',
          'keterbukaan',
          'ketekunan'
        ],
        message: 'Tidak harus tahu semuanya hari ini. Langkah belajarmu tetap berarti.',
        theme: {
          accent: '#91C9FF',
          motif: 'Grid catatan dan langkah bertingkat.'
        }
      },
      {
        id: 'C',
        image: { src: 'assets/images/cheon-jang-mi.jpg' },
        name: 'Cheon Jang-mi',
        title: 'The Heart of the Team',
        summary: 'Membuat tim merasa didengar.',
        description: 'Kamu peka terhadap orang di sekitarmu. Saat pekerjaan menekan, kamu membantu menjaga hubungan dan memastikan anggota tim tidak menghadapi kesulitan sendirian.',
        strengths: [
          'Empati',
          'dukungan',
          'komunikasi'
        ],
        message: 'Kamu menjaga tim tetap terhubung. Kebutuhanmu juga pantas didengar.',
        theme: {
          accent: '#FFB3C6',
          motif: 'Simpul tim dan garis melengkung.'
        }
      },
      {
        id: 'P',
        image: { src: 'assets/images/park-gyeong-won.jpg' },
        name: 'Park Gyeong-won',
        title: 'The Calm Specialist',
        summary: 'Tenang menjaga setiap detail.',
        description: 'Kamu cenderung membawa ketenangan lewat perhatian pada detail. Memeriksa hal penting dan memperbaiki kesalahan membantumu menjaga kualitas ketika situasi mulai sibuk.',
        strengths: [
          'Ketelitian',
          'ketenangan',
          'konsistensi'
        ],
        message: 'Ketenanganmu memberi pegangan. Bagikan juga apa yang kamu temukan.',
        theme: {
          accent: '#7BE0CC',
          motif: 'Gelombang stabil dan lingkaran presisi.'
        }
      },
      {
        id: 'H',
        image: { src: 'assets/images/han-yu-rim.jpg' },
        name: 'Han Yu-rim',
        title: 'The Strategic Thinker',
        summary: 'Melihat arah sebelum melangkah.',
        description: 'Kamu tertarik memahami tujuan dan konsekuensi pilihan. Menimbang alternatif serta memikirkan langkah berikutnya membantumu mengarahkan usaha tim dengan lebih terencana.',
        strengths: [
          'Perencanaan',
          'pertimbangan',
          'pandangan jauh'
        ],
        message: 'Rencanamu memberi arah. Beri ruang untuk penyesuaian di perjalanan.',
        theme: {
          accent: '#C9B8FF',
          motif: 'Jalur bercabang dan diagram rencana.'
        }
      }
    ],
    tieBreakOrder: [
      'B',
      'Y',
      'C',
      'P',
      'H'
    ]
  };
})();
