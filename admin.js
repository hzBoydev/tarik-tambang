/* ============================================================
   TARIK TAMBANG QUIZ – admin.js
   Dedicated Host Admin Controller & Firebase Realtime Database
   ============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyD7TRTTFh2fgPQtWlqLeV0EfMG4AtajbkM",
  authDomain: "tarik-tambang-23c80.firebaseapp.com",
  databaseURL: "https://tarik-tambang-23c80-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tarik-tambang-23c80",
  storageBucket: "tarik-tambang-23c80.firebasestorage.app",
  messagingSenderId: "364526068319",
  appId: "1:364526068319:web:fdcd538a1724855203b1ea",
  measurementId: "G-1H4YBJH9NM"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let hostMasterPassword = "HOST123";
const LABELS = ['A', 'B', 'C', 'D'];const DEFAULT_QUESTIONS = [
  {
    "q": "Pancasila bagi bangsa Indonesia berkedudukan sebagai ....",
    "choices": [
      "dasar negara dan pandangan hidup bangsa",
      "peraturan pemerintah",
      "hukum daerah",
      "semboyan negara"
    ],
    "answer": 0
  },
  {
    "q": "Sikap yang sesuai dengan sila pertama Pancasila di lingkungan sekolah adalah ....",
    "choices": [
      "memaksakan agama kepada teman",
      "menghormati teman yang sedang menjalankan ibadah",
      "memilih teman berdasarkan agama",
      "melarang teman menjalankan ibadah"
    ],
    "answer": 1
  },
  {
    "q": "Ketika terjadi perbedaan pendapat dalam kelompok, sikap yang sesuai dengan nilai Pancasila adalah ....",
    "choices": [
      "memaksakan pendapat sendiri",
      "meninggalkan kelompok",
      "bermusyawarah untuk mencapai mufakat",
      "menyerahkan keputusan kepada satu orang"
    ],
    "answer": 2
  },
  {
    "q": "Semboyan Bhinneka Tunggal Ika memiliki arti ....",
    "choices": [
      "bersatu kita teguh",
      "berbeda-beda tetapi tetap satu",
      "satu bangsa satu budaya",
      "bersama membangun negara"
    ],
    "answer": 1
  },
  {
    "q": "Indonesia memiliki banyak suku, agama, bahasa, dan budaya. Sikap yang tepat terhadap keberagaman tersebut adalah ....",
    "choices": [
      "menganggap budaya sendiri paling unggul",
      "menghindari orang yang berbeda suku",
      "menghargai dan menghormati perbedaan",
      "memaksakan budaya sendiri kepada orang lain"
    ],
    "answer": 2
  },
  {
    "q": "Contoh perilaku yang dapat memperkuat persatuan di sekolah adalah ....",
    "choices": [
      "membentuk kelompok berdasarkan suku",
      "memilih teman berdasarkan status sosial",
      "bekerja sama dalam kegiatan gotong royong",
      "mengejek budaya daerah lain"
    ],
    "answer": 2
  },
  {
    "q": "Negara Indonesia berbentuk ....",
    "choices": [
      "kerajaan",
      "republik",
      "federasi",
      "monarki"
    ],
    "answer": 1
  },
  {
    "q": "Salah satu bentuk bela negara yang dapat dilakukan oleh pelajar adalah ....",
    "choices": [
      "mengikuti tawuran",
      "menaati tata tertib dan belajar dengan sungguh-sungguh",
      "menyebarkan berita bohong",
      "merusak fasilitas umum"
    ],
    "answer": 1
  },
  {
    "q": "Menjaga keutuhan Negara Kesatuan Republik Indonesia merupakan tanggung jawab ....",
    "choices": [
      "TNI saja",
      "pemerintah saja",
      "aparat keamanan saja",
      "seluruh warga negara"
    ],
    "answer": 3
  },
  {
    "q": "Perilaku yang menunjukkan rasa cinta tanah air adalah ....",
    "choices": [
      "merusak fasilitas umum",
      "menghargai budaya dan produk dalam negeri",
      "merendahkan budaya daerah sendiri",
      "tidak peduli terhadap lingkungan"
    ],
    "answer": 1
  },
  {
    "q": "UUD Negara Republik Indonesia Tahun 1945 memiliki kedudukan sebagai ....",
    "choices": [
      "hukum dasar negara",
      "peraturan sekolah",
      "hukum adat",
      "peraturan daerah"
    ],
    "answer": 0
  },
  {
    "q": "Contoh kewajiban seorang pelajar sebagai bagian dari warga negara adalah ....",
    "choices": [
      "mendapatkan pendidikan",
      "mendapatkan perlindungan",
      "menaati peraturan yang berlaku",
      "memperoleh penghargaan"
    ],
    "answer": 2
  },
  {
    "q": "Seorang siswa menemukan informasi yang belum jelas kebenarannya di media sosial. Sikap yang tepat adalah ....",
    "choices": [
      "langsung menyebarkannya",
      "menambahkan komentar provokatif",
      "memeriksa kebenarannya terlebih dahulu",
      "mengirimkannya ke semua grup"
    ],
    "answer": 2
  },
  {
    "q": "Berita palsu yang sengaja dibuat dan disebarkan untuk menyesatkan masyarakat disebut ....",
    "choices": [
      "fakta",
      "opini",
      "hoaks",
      "aspirasi"
    ],
    "answer": 2
  },
  {
    "q": "Gotong royong merupakan salah satu sikap yang penting dalam kehidupan berbangsa karena ....",
    "choices": [
      "menumbuhkan kerja sama dan persatuan",
      "membuat seseorang menjadi lebih berkuasa",
      "menghilangkan keberagaman",
      "mengutamakan kepentingan pribadi"
    ],
    "answer": 0
  },
  {
    "q": "Jika ada teman yang berbeda suku atau budaya diejek oleh teman lainnya, tindakan yang paling tepat adalah ....",
    "choices": [
      "ikut mengejek",
      "membiarkannya",
      "menegur dan mengajak menghargai perbedaan",
      "membalas dengan mengejek suku pelaku"
    ],
    "answer": 2
  },
  {
    "q": "Dalam kehidupan demokratis, perbedaan pendapat sebaiknya diselesaikan melalui ....",
    "choices": [
      "kekerasan",
      "musyawarah",
      "ancaman",
      "pemaksaan"
    ],
    "answer": 1
  },
  {
    "q": "Salah satu bentuk penggunaan kemerdekaan berpendapat yang bertanggung jawab adalah ....",
    "choices": [
      "menyampaikan pendapat dengan sopan dan berdasarkan fakta",
      "menghina orang yang berbeda pendapat",
      "menyebarkan fitnah",
      "memaksakan pendapat kepada orang lain"
    ],
    "answer": 0
  },
  {
    "q": "Wawasan Nusantara mengajarkan bahwa wilayah Indonesia harus dipandang sebagai ....",
    "choices": [
      "wilayah yang terpisah-pisah",
      "satu kesatuan wilayah dan bangsa",
      "kumpulan daerah yang berdiri sendiri",
      "wilayah yang hanya terdiri dari pulau-pulau besar"
    ],
    "answer": 1
  },
  {
    "q": "Perhatikan tindakan berikut:\n1. Menghormati perbedaan agama.\n2. Melaksanakan gotong royong.\n3. Menyebarkan ujaran kebencian.\n4. Menjaga fasilitas umum.\nPerilaku yang mencerminkan wawasan kebangsaan ditunjukkan oleh nomor ....",
    "choices": [
      "1, 2, dan 4",
      "1, 3, dan 4",
      "2 dan 3",
      "3 dan 4"
    ],
    "answer": 0
  },
  {
    "q": "Tokoh yang dikenal sebagai pemimpin Perang Diponegoro adalah ...",
    "choices": [
      "Pangeran Diponegoro",
      "Sultan Hasanuddin",
      "Pattimura",
      "Tuanku Imam Bonjol"
    ],
    "answer": 0
  },
  {
    "q": "Pahlawan yang memimpin perlawanan rakyat Surabaya dan terkenal dengan pidato membakar semangat pada 10 November 1945 adalah ...",
    "choices": [
      "Jenderal Sudirman",
      "Bung Tomo",
      "Mohammad Hatta",
      "Ki Hajar Dewantara"
    ],
    "answer": 1
  },
  {
    "q": "Jenderal Sudirman dikenal dalam perjuangan mempertahankan kemerdekaan melalui strategi ...",
    "choices": [
      "Politik etis",
      "Perang gerilya",
      "Perang laut",
      "Diplomasi dagang"
    ],
    "answer": 1
  },
  {
    "q": "Kapitan Pattimura merupakan pahlawan yang berasal dari daerah ...",
    "choices": [
      "Aceh",
      "Maluku",
      "Bali",
      "Kalimantan Timur"
    ],
    "answer": 1
  },
  {
    "q": "Sultan Hasanuddin mendapat julukan dari Belanda sebagai ...",
    "choices": [
      "Ayam Jantan dari Timur",
      "Macan dari Selatan",
      "Elang dari Barat",
      "Harimau Sumatra"
    ],
    "answer": 0
  },
  {
    "q": "Pahlawan wanita dari Aceh yang berjuang melawan penjajahan Belanda adalah ...",
    "choices": [
      "R.A. Kartini",
      "Dewi Sartika",
      "Cut Nyak Dien",
      "Martha Christina Tiahahu"
    ],
    "answer": 2
  },
  {
    "q": "R.A. Kartini dikenal sebagai pelopor ...",
    "choices": [
      "Pendidikan dan kemajuan perempuan",
      "Perjuangan angkatan laut",
      "Pembangunan jalan raya",
      "Pertanian modern"
    ],
    "answer": 0
  },
  {
    "q": "Dewi Sartika mendirikan sekolah bagi kaum perempuan yang dikenal dengan nama ...",
    "choices": [
      "Taman Siswa",
      "Sekolah Isteri",
      "Sekolah Rakyat",
      "Perguruan Nasional"
    ],
    "answer": 1
  },
  {
    "q": "Pahlawan wanita muda dari Maluku yang turut melawan Belanda adalah ...",
    "choices": [
      "Martha Christina Tiahahu",
      "Maria Walanda Maramis",
      "Nyi Ageng Serang",
      "Opu Daeng Risaju"
    ],
    "answer": 0
  },
  {
    "q": "Tokoh wanita yang menjahit Bendera Pusaka Merah Putih menjelang Proklamasi Kemerdekaan adalah ...",
    "choices": [
      "R.A. Kartini",
      "Fatmawati",
      "Cut Meutia",
      "Dewi Sartika"
    ],
    "answer": 1
  },
  {
    "q": "Presiden pertama Republik Indonesia adalah ...",
    "choices": [
      "Mohammad Hatta",
      "Soekarno",
      "Sutan Sjahrir",
      "Soeharto"
    ],
    "answer": 1
  },
  {
    "q": "Soekarno dan Mohammad Hatta membacakan teks Proklamasi Kemerdekaan pada tanggal ...",
    "choices": [
      "1 Juni 1945",
      "17 Agustus 1945",
      "18 Agustus 1945",
      "10 November 1945"
    ],
    "answer": 1
  },
  {
    "q": "Tokoh yang mengibarkan Bendera Pusaka Merah Putih pada saat Proklamasi Kemerdekaan 17 Agustus 1945 adalah ...",
    "choices": [
      "Soekarno dan Mohammad Hatta",
      "Latief Hendraningrat dan Suhud",
      "Bung Tomo dan Jenderal Sudirman",
      "Ahmad Soebardjo dan Sutan Sjahrir"
    ],
    "answer": 1
  },
  {
    "q": "Gambar pahlawan pada uang kertas Rp100.000 Tahun Emisi 2022 adalah ...",
    "choices": [
      "Soekarno dan Mohammad Hatta",
      "Jenderal Sudirman dan Bung Tomo",
      "Ki Hajar Dewantara dan R.A. Kartini",
      "Pattimura dan Sultan Hasanuddin"
    ],
    "answer": 0
  },
  {
    "q": "Pahlawan Ir. H. Djuanda Kartawidjaja terdapat pada uang kertas pecahan ...",
    "choices": [
      "Rp20.000",
      "Rp50.000",
      "Rp10.000",
      "Rp5.000"
    ],
    "answer": 1
  },
  {
    "q": "Gambar pahlawan pada uang kertas Rp20.000 Tahun Emisi 2022 adalah ...",
    "choices": [
      "Frans Kaisiepo",
      "Dr. G.S.S.J. Ratulangi",
      "Oto Iskandar di Nata",
      "Mohammad Hoesni Thamrin"
    ],
    "answer": 2
  },
  {
    "q": "Frans Kaisiepo terdapat pada uang kertas Rupiah pecahan ...",
    "choices": [
      "Rp10.000",
      "Rp5.000",
      "Rp2.000",
      "Rp1.000"
    ],
    "answer": 0
  },
  {
    "q": "K.H. Idham Chalid terdapat pada uang kertas Rupiah pecahan ...",
    "choices": [
      "Rp50.000",
      "Rp20.000",
      "Rp10.000",
      "Rp5.000"
    ],
    "answer": 3
  },
  {
    "q": "Mohammad Hoesni Thamrin terdapat pada uang kertas Rupiah pecahan ...",
    "choices": [
      "Rp1.000",
      "Rp2.000",
      "Rp5.000",
      "Rp10.000"
    ],
    "answer": 1
  },
  {
    "q": "Pahlawan wanita Tjut Meutia terdapat pada uang kertas Rupiah pecahan ...",
    "choices": [
      "Rp1.000",
      "Rp2.000",
      "Rp20.000",
      "Rp50.000"
    ],
    "answer": 0
  },
  {
    "q": "Ibu kota Provinsi Kalimantan Timur adalah ...",
    "choices": [
      "Balikpapan",
      "Samarinda",
      "Bontang",
      "Tenggarong"
    ],
    "answer": 1
  },
  {
    "q": "Jumlah kabupaten dan kota di Provinsi Kalimantan Timur adalah ...",
    "choices": [
      "7 kabupaten dan 3 kota",
      "6 kabupaten dan 4 kota",
      "8 kabupaten dan 2 kota",
      "9 kabupaten dan 1 kota"
    ],
    "answer": 0
  },
  {
    "q": "Kabupaten yang beribu kota di Tanjung Redeb adalah ...",
    "choices": [
      "Kabupaten Paser",
      "Kabupaten Berau",
      "Kabupaten Kutai Barat",
      "Kabupaten Penajam Paser Utara"
    ],
    "answer": 1
  },
  {
    "q": "Ibu kota Kabupaten Kutai Kartanegara adalah ...",
    "choices": [
      "Sangatta",
      "Sendawar",
      "Tenggarong",
      "Tanah Grogot"
    ],
    "answer": 2
  },
  {
    "q": "Sangatta merupakan ibu kota Kabupaten ...",
    "choices": [
      "Kutai Timur",
      "Kutai Barat",
      "Berau",
      "Paser"
    ],
    "answer": 0
  },
  {
    "q": "Kabupaten termuda di Kalimantan Timur yang beribu kota di Ujoh Bilang adalah ...",
    "choices": [
      "Mahakam Ulu",
      "Kutai Kartanegara",
      "Penajam Paser Utara",
      "Berau"
    ],
    "answer": 0
  },
  {
    "q": "Kota di Kalimantan Timur yang terkenal sebagai Kota Minyak adalah ...",
    "choices": [
      "Samarinda",
      "Bontang",
      "Balikpapan",
      "Tenggarong"
    ],
    "answer": 2
  },
  {
    "q": "Kabupaten Penajam Paser Utara beribu kota di ...",
    "choices": [
      "Penajam",
      "Tanah Grogot",
      "Sendawar",
      "Sangatta"
    ],
    "answer": 0
  },
  {
    "q": "Kepulauan Derawan, yang terkenal dengan wisata baharinya, berada di Kabupaten ...",
    "choices": [
      "Berau",
      "Paser",
      "Kutai Barat",
      "Mahakam Ulu"
    ],
    "answer": 0
  },
  {
    "q": "Danau Labuan Cermin berada di kawasan Biduk-Biduk, Kabupaten ...",
    "choices": [
      "Kutai Timur",
      "Berau",
      "Kutai Kartanegara",
      "Paser"
    ],
    "answer": 1
  },
  {
    "q": "Museum Mulawarman yang merupakan bekas keraton Kesultanan Kutai terletak di ...",
    "choices": [
      "Tenggarong",
      "Bontang",
      "Samarinda",
      "Balikpapan"
    ],
    "answer": 0
  },
  {
    "q": "Wisata susur Sungai Mahakam paling erat dikaitkan dengan Kota ...",
    "choices": [
      "Bontang",
      "Balikpapan",
      "Samarinda",
      "Penajam"
    ],
    "answer": 2
  },
  {
    "q": "Pulau Kakaban di Kabupaten Berau terkenal karena memiliki ...",
    "choices": [
      "Danau ubur-ubur",
      "Kawah gunung api",
      "Perkebunan teh",
      "Air terjun bertingkat"
    ],
    "answer": 0
  },
  {
    "q": "Desa Budaya Pampang, tempat wisata budaya masyarakat Dayak, berada di Kota ...",
    "choices": [
      "Samarinda",
      "Balikpapan",
      "Bontang",
      "Tenggarong"
    ],
    "answer": 0
  },
  {
    "q": "Salah satu sektor yang memberikan kontribusi sangat besar terhadap perekonomian Kalimantan Timur adalah ...",
    "choices": [
      "Pertambangan dan penggalian",
      "Industri tekstil",
      "Perkebunan teh",
      "Perikanan air dingin"
    ],
    "answer": 0
  },
  {
    "q": "Komoditas tambang yang sangat menonjol di Kalimantan Timur adalah ...",
    "choices": [
      "Timah",
      "Batubara",
      "Bauksit",
      "Emas putih"
    ],
    "answer": 1
  },
  {
    "q": "Selain pertambangan, komoditas perkebunan yang banyak dikembangkan di Kalimantan Timur adalah ...",
    "choices": [
      "Kelapa sawit",
      "Teh",
      "Apel",
      "Stroberi"
    ],
    "answer": 0
  },
  {
    "q": "Makanan ringan khas Samarinda yang dibuat dari ikan dan tepung lalu digoreng adalah ...",
    "choices": [
      "Amplang",
      "Gudeg",
      "Pempek",
      "Bika ambon"
    ],
    "answer": 0
  },
  {
    "q": "Ayam cincane khas Samarinda memiliki ciri utama berupa ...",
    "choices": [
      "Bumbu merah yang gurih",
      "Kuah santan putih",
      "Saus keju",
      "Balutan gula cair"
    ],
    "answer": 0
  },
  {
    "q": "Makanan khas Samarinda berupa kue berlapis dari tepung beras, santan, dan pisang disebut ...",
    "choices": [
      "Bubur peca",
      "Amparan tatak",
      "Lemper",
      "Serabi"
    ],
    "answer": 1
  },
  {
    "q": "Kerajaan tertua yang berada di wilayah Provinsi Kalimantan Timur adalah ...",
    "choices": [
      "Kerajaan Majapahit",
      "Kerajaan Sriwijaya",
      "Kerajaan Kutai Martadipura",
      "Kerajaan Demak"
    ],
    "answer": 2
  },
  {
    "q": "Kelompok yang seluruhnya merupakan nama jembatan di Kota Samarinda adalah ...",
    "choices": [
      "Jembatan Mahakam, Jembatan Mahakam II dan Jembatan Arif Rahman Hakim",
      "Jembatan Ampera, Jembatan Suramadu, dan Jembatan Mahakam",
      "Jembatan Barito, Jembatan Kahayan, dan Jembatan Merah",
      "Jembatan Kapuas, Jembatan Tayan, dan Jembatan Mahakam Ulu"
    ],
    "answer": 0
  },
  {
    "q": "Semboyan Bhinneka Tunggal Ika memiliki makna, walaupun beragam?",
    "choices": [
      "Suku bangsa, agama, ras dan antar golongan tetapi tetap satu kesatuan",
      "Pemikiran tetapi tetap untuk kemajuan Indonesia",
      "Indonesia negara majemuk, tetapi mampu hidup rukun",
      "Peraturan tetapi tetap menjunjung hukum nasional"
    ],
    "answer": 0
  },
  {
    "q": "Dengan adanya Ideologi Pancasila dimaksudkan untuk mendidik masyarakat agar ...",
    "choices": [
      "Dapat mengemukakan pendapat sesuai dengan suara hati",
      "Tidak ada pemaksaan terhadap suatu peraturan",
      "Dapat meningkatkan kesejahteraan masyarakat",
      "Bertingkah laku sesuai dengan norma yang berlaku"
    ],
    "answer": 3
  },
  {
    "q": "Tugas utama BPUPKI adalah ....",
    "choices": [
      "Menyelidiki dan mempersiapkan hal-hal terkait kemerdekaan",
      "Membentuk tentara nasional",
      "Merancang Undang-Undang Hukum Pidana",
      "Melatih rakyat untuk perang"
    ],
    "answer": 0
  },
  {
    "q": "Ketua BPUPKI adalah ....",
    "choices": [
      "Mohammad Hatta",
      "Soepomo",
      "Dr. Radjiman Wedyodiningrat",
      "Ahmad Subardjo"
    ],
    "answer": 2
  },
  {
    "q": "Panitia Sembilan berhasil merumuskan ....",
    "choices": [
      "Proklamasi Kemerdekaan",
      "Piagam Jakarta",
      "Undang-Undang Perang",
      "Tata Tertib Sidang"
    ],
    "answer": 1
  },
  {
    "q": "Pancasila ditetapkan sebagai dasar negara pada tanggal ....",
    "choices": [
      "1 Juni 1945",
      "17 Agustus 1945",
      "18 Agustus 1945",
      "19 Agustus 1945"
    ],
    "answer": 2
  },
  {
    "q": "Sistematika atau susunan UUD 1945 saat disahkan adalah ....",
    "choices": [
      "Pembukaan dan Batang Tubuh",
      "Pembukaan, Batang Tubuh, dan Penjelasan",
      "Pembukaan, Pasal-pasal, dan Lampiran",
      "Mukadimah dan Pasal-pasal"
    ],
    "answer": 1
  },
  {
    "q": "Pasal UUD 1945 yang menegaskan bahwa bentuk negara Indonesia tidak dapat diubah adalah pasal ....",
    "choices": [
      "1 ayat 1",
      "7",
      "37",
      "18"
    ],
    "answer": 2
  },
  {
    "q": "Pembukaan UUD 1945 tidak dapat diubah karena ....",
    "choices": [
      "Sudah ditetapkan MPR",
      "Mengandung dasar dan tujuan negara",
      "Sesuai Piagam Jakarta",
      "Berisi sila-sila Pancasila"
    ],
    "answer": 1
  },
  {
    "q": "Pancasila sebagai dasar negara pertama kali dicetuskan oleh ....",
    "choices": [
      "Dr. Radjiman Wedyodiningrat",
      "Ir. Soekarno",
      "Mohammad Yamin",
      "Soepomo"
    ],
    "answer": 1
  },
  {
    "q": "Nilai sila pertama Pancasila adalah ....",
    "choices": [
      "Keadilan sosial",
      "Persatuan Indonesia",
      "Ketuhanan Yang Maha Esa",
      "Kerakyatan yang dipimpin oleh hikmat kebijaksanaan"
    ],
    "answer": 2
  },
  {
    "q": "Makna persatuan dan kesatuan dapat ditunjukkan melalui ....",
    "choices": [
      "Munculnya konflik di masyarakat",
      "Kerja sama dan sikap saling melengkapi",
      "Perpecahan antarwarga masyarakat",
      "Sikap intoleransi"
    ],
    "answer": 1
  },
  {
    "q": "Berikut yang bukan manfaat persatuan dan kesatuan adalah ....",
    "choices": [
      "Munculnya konflik",
      "Memperkuat jati diri bangsa",
      "Kerukunan dan silaturahmi terjaga",
      "Masyarakat merasa aman dan nyaman"
    ],
    "answer": 0
  },
  {
    "q": "Contoh perilaku mempertahankan persatuan di sekolah adalah ....",
    "choices": [
      "Tidak mematuhi aturan sekolah",
      "Kerja sama tanpa memandang suku dan agama",
      "Bangga terhadap diri sendiri",
      "Mementingkan kelompok tertentu"
    ],
    "answer": 1
  },
  {
    "q": "Nilai persatuan dalam kehidupan bangsa tercermin dalam ....",
    "choices": [
      "Menghormati hak orang lain",
      "Melakukan korupsi",
      "Membeda-bedakan suku dan agama",
      "Sikap individualisme"
    ],
    "answer": 0
  },
  {
    "q": "Semangat persatuan ditunjukkan dalam Sumpah Pemuda pada tanggal ....",
    "choices": [
      "28 Oktober 1928",
      "17 Agustus 1945",
      "18 Agustus 1945",
      "29 Mei 1945"
    ],
    "answer": 0
  },
  {
    "q": "Lambang negara yang mencerminkan persatuan adalah ....",
    "choices": [
      "Burung Garuda",
      "Bendera Merah Putih",
      "Pancasila",
      "Lagu Kebangsaan"
    ],
    "answer": 0
  },
  {
    "q": "Peran tokoh bangsa dalam persatuan tercermin melalui ....",
    "choices": [
      "Pertikaian antar kelompok",
      "Perundingan dan diplomasi",
      "Sikap diskriminatif",
      "Konflik horizontal"
    ],
    "answer": 1
  },
  {
    "q": "Konflik sosial dapat dihindari jika masyarakat mengedepankan nilai ....",
    "choices": [
      "Kekuasaan",
      "Kesetaraan",
      "Individualisme",
      "Otoriterisme"
    ],
    "answer": 1
  },
  {
    "q": "Gambar seluruh atau sebagian permukaan bumi pada bidang datar dengan skala tertentu disebut ....",
    "choices": [
      "globe",
      "peta",
      "atlas",
      "denah"
    ],
    "answer": 1
  },
  {
    "q": "Komponen peta yang menjelaskan arti simbol-simbol pada peta disebut ....",
    "choices": [
      "legenda",
      "skala",
      "judul",
      "garis astronomis"
    ],
    "answer": 0
  },
  {
    "q": "Arah yang biasanya ditunjukkan pada bagian atas peta adalah ....",
    "choices": [
      "selatan",
      "barat",
      "timur",
      "utara"
    ],
    "answer": 3
  },
  {
    "q": "Perbandingan jarak pada peta dengan jarak sebenarnya disebut ....",
    "choices": [
      "orientasi",
      "indeks",
      "skala",
      "inset"
    ],
    "answer": 2
  },
  {
    "q": "Garis khayal mendatar yang digunakan untuk menentukan posisi suatu wilayah di utara atau selatan khatulistiwa disebut ....",
    "choices": [
      "garis lintang",
      "garis bujur",
      "garis tepi",
      "garis kontur"
    ],
    "answer": 0
  },
  {
    "q": "Kalimantan Timur terletak di bagian .... Pulau Kalimantan.",
    "choices": [
      "barat",
      "timur",
      "selatan",
      "tengah"
    ],
    "answer": 1
  },
  {
    "q": "Pulau Kalimantan berbatasan langsung di daratan dengan negara ....",
    "choices": [
      "Malaysia",
      "Thailand",
      "Filipina",
      "Singapura"
    ],
    "answer": 0
  },
  {
    "q": "Sungai besar yang mengalir melalui wilayah Kalimantan Timur dan Kota Samarinda adalah Sungai ....",
    "choices": [
      "Kapuas",
      "Barito",
      "Mahakam",
      "Musi"
    ],
    "answer": 2
  },
  {
    "q": "Ibu kota Provinsi Kalimantan Selatan adalah ....",
    "choices": [
      "Banjarbaru",
      "Pontianak",
      "Palangka Raya",
      "Tanjung Selor"
    ],
    "answer": 0
  },
  {
    "q": "Ibu kota Provinsi Kalimantan Barat adalah ....",
    "choices": [
      "Samarinda",
      "Pontianak",
      "Banjarmasin",
      "Tarakan"
    ],
    "answer": 1
  },
  {
    "q": "Tari Saman berasal dari Provinsi ....",
    "choices": [
      "Aceh",
      "Bali",
      "Jawa Barat",
      "Papua"
    ],
    "answer": 0
  },
  {
    "q": "Tari Kecak merupakan tarian tradisional yang berasal dari ....",
    "choices": [
      "Sumatera Barat",
      "Kalimantan Timur",
      "Bali",
      "Sulawesi Selatan"
    ],
    "answer": 2
  },
  {
    "q": "Tari Piring berasal dari daerah ....",
    "choices": [
      "Jawa Tengah",
      "Sumatera Barat",
      "Maluku",
      "Nusa Tenggara Timur"
    ],
    "answer": 1
  },
  {
    "q": "Tari Hudoq yang dikenal menggunakan topeng merupakan budaya masyarakat Dayak di wilayah ....",
    "choices": [
      "Kalimantan Timur",
      "Jawa Timur",
      "Sulawesi Utara",
      "Lampung"
    ],
    "answer": 0
  },
  {
    "q": "Tokoh yang membacakan teks Proklamasi Kemerdekaan Indonesia pada 17 Agustus 1945 adalah ....",
    "choices": [
      "Mohammad Hatta",
      "Soekarno",
      "Jenderal Sudirman",
      "Ki Hajar Dewantara"
    ],
    "answer": 1
  },
  {
    "q": "Tokoh yang mendampingi Soekarno saat Proklamasi Kemerdekaan dan kemudian menjadi Wakil Presiden pertama Indonesia adalah ....",
    "choices": [
      "Mohammad Hatta",
      "Ahmad Yani",
      "Sutan Sjahrir",
      "Bung Tomo"
    ],
    "answer": 0
  },
  {
    "q": "Pahlawan perempuan dari Aceh yang gigih melawan penjajahan Belanda adalah ....",
    "choices": [
      "R.A. Kartini",
      "Martha Christina Tiahahu",
      "Cut Nyak Dien",
      "Dewi Sartika"
    ],
    "answer": 2
  },
  {
    "q": "Tokoh yang terkenal membangkitkan semangat rakyat Surabaya dalam pertempuran 10 November 1945 adalah ....",
    "choices": [
      "Pattimura",
      "Bung Tomo",
      "Tuanku Imam Bonjol",
      "Pangeran Diponegoro"
    ],
    "answer": 1
  },
  {
    "q": "Sikap yang tepat untuk menghargai jasa para pahlawan adalah ....",
    "choices": [
      "mengabaikan upacara bendera",
      "merusak fasilitas umum",
      "belajar sungguh-sungguh dan menjaga persatuan",
      "mementingkan kelompok sendiri"
    ],
    "answer": 2
  },
  {
    "q": "Tari Gantar merupakan tarian tradisional masyarakat Dayak yang berkembang di daerah ....",
    "choices": [
      "Kalimantan Timur",
      "Sumatera Utara",
      "Jawa Barat",
      "Bali"
    ],
    "answer": 0
  },
  {
    "q": "Tari Kancet Ledo dari Kalimantan Timur dikenal juga dengan nama Tari ....",
    "choices": [
      "Piring",
      "Gong",
      "Serimpi",
      "Kipas"
    ],
    "answer": 1
  },
  {
    "q": "Tari Hudoq biasanya menggunakan perlengkapan utama berupa ....",
    "choices": [
      "payung",
      "piring",
      "topeng",
      "kipas"
    ],
    "answer": 2
  },
  {
    "q": "Lagu daerah 'Indung-Indung' berasal dari ....",
    "choices": [
      "Kalimantan Timur",
      "Maluku",
      "Jawa Tengah",
      "Sulawesi Utara"
    ],
    "answer": 0
  },
  {
    "q": "Lagu daerah 'Buah Bolok' dikenal sebagai lagu dari daerah ....",
    "choices": [
      "Kutai, Kalimantan Timur",
      "Minangkabau, Sumatera Barat",
      "Betawi, DKI Jakarta",
      "Banyuwangi, Jawa Timur"
    ],
    "answer": 0
  },
  {
    "q": "Lagu 'Ampar-Ampar Pisang' berasal dari Provinsi ....",
    "choices": [
      "Kalimantan Barat",
      "Kalimantan Selatan",
      "Kalimantan Timur",
      "Kalimantan Utara"
    ],
    "answer": 1
  },
  {
    "q": "Lagu daerah 'Apuse' berasal dari ....",
    "choices": [
      "Papua",
      "Aceh",
      "Bali",
      "Lampung"
    ],
    "answer": 0
  },
  {
    "q": "Lagu 'Yamko Rambe Yamko' dikenal sebagai lagu daerah dari ....",
    "choices": [
      "Riau",
      "Papua",
      "Banten",
      "Bengkulu"
    ],
    "answer": 1
  },
  {
    "q": "Jenderal Sudirman dikenal sebagai Panglima Besar yang memimpin perjuangan dengan strategi ....",
    "choices": [
      "diplomasi dagang",
      "perang gerilya",
      "politik etis",
      "tanam paksa"
    ],
    "answer": 1
  },
  {
    "q": "Walaupun sedang sakit, Jenderal Sudirman tetap berjuang dengan cara ....",
    "choices": [
      "memimpin gerilya melawan Belanda",
      "meninggalkan Indonesia",
      "bekerja untuk pemerintah kolonial",
      "menghentikan seluruh perlawanan"
    ],
    "answer": 0
  },
  {
    "q": "Bung Tomo dikenang karena membangkitkan semangat rakyat dalam pertempuran di Kota ....",
    "choices": [
      "Bandung",
      "Surabaya",
      "Medan",
      "Semarang"
    ],
    "answer": 1
  },
  {
    "q": "Pertempuran Surabaya yang diperingati sebagai Hari Pahlawan terjadi pada tanggal ....",
    "choices": [
      "1 Juni",
      "17 Agustus",
      "10 November",
      "28 Oktober"
    ],
    "answer": 2
  },
  {
    "q": "Tokoh yang dikenal sebagai Bapak Pendidikan Nasional adalah ....",
    "choices": [
      "Ki Hajar Dewantara",
      "Mohammad Yamin",
      "Jenderal Sudirman",
      "Bung Tomo"
    ],
    "answer": 0
  },
  {
    "q": "Semboyan pendidikan 'Tut Wuri Handayani' dikemukakan oleh ....",
    "choices": [
      "R.A. Kartini",
      "Ki Hajar Dewantara",
      "Dewi Sartika",
      "Cut Nyak Dien"
    ],
    "answer": 1
  },
  {
    "q": "Pahlawan perempuan yang mendirikan Sekolah Istri untuk pendidikan kaum perempuan adalah ....",
    "choices": [
      "Dewi Sartika",
      "Cut Meutia",
      "Martha Christina Tiahahu",
      "Maria Walanda Maramis"
    ],
    "answer": 0
  },
  {
    "q": "Proklamasi Kemerdekaan Republik Indonesia dibacakan pada tanggal ....",
    "choices": [
      "20 Mei 1908",
      "28 Oktober 1928",
      "17 Agustus 1945",
      "10 November 1945"
    ],
    "answer": 2
  },
  {
    "q": "Teks Proklamasi Kemerdekaan Indonesia dibacakan di ....",
    "choices": [
      "Jalan Pegangsaan Timur Nomor 56, Jakarta",
      "Istana Bogor",
      "Gedung Sate, Bandung",
      "Tugu Pahlawan, Surabaya"
    ],
    "answer": 0
  },
  {
    "q": "Tokoh yang mengetik naskah Proklamasi Kemerdekaan Indonesia adalah ....",
    "choices": [
      "Sayuti Melik",
      "Sukarni",
      "Wikana",
      "B.M. Diah"
    ],
    "answer": 0
  },
  {
    "q": "Tokoh yang turut merumuskan naskah Proklamasi bersama Soekarno dan Mohammad Hatta adalah ....",
    "choices": [
      "Ahmad Soebardjo",
      "Bung Tomo",
      "Jenderal Sudirman",
      "Ki Hajar Dewantara"
    ],
    "answer": 0
  },
  {
    "q": "Peristiwa Rengasdengklok bertujuan mendesak Soekarno dan Mohammad Hatta agar segera ....",
    "choices": [
      "membentuk organisasi dagang",
      "memproklamasikan kemerdekaan Indonesia",
      "menyerahkan kekuasaan kepada Jepang",
      "meninggalkan Jakarta selamanya"
    ],
    "answer": 1
  }
];

let dynamicQuestionBank = [...DEFAULT_QUESTIONS];
let customTeamNames = { A: "Tim A", B: "Tim B" };
let isHostAuthenticated = false;

/* ═══════════════════════════════════════════════════════════
   🔐 HOST AUTHENTICATION GATE
   ═══════════════════════════════════════════════════════════ */
function toggleGatePassVisibility() {
  const input = document.getElementById('admin-gate-pass');
  if (input) input.type = input.type === 'password' ? 'text' : 'password';
}

function unlockAdminDashboard() {
  isHostAuthenticated = true;
  document.getElementById('admin-auth-barrier').classList.remove('active');
  document.getElementById('admin-main-content').style.display = 'block';
  
  // Load initial data
  renderAdminQuestions();
  loadAdminHistory();
  setupHistoryRealtimeListener();
  
  document.getElementById('admin-team-a-name').value = customTeamNames.A || "Tim A";
  document.getElementById('admin-team-b-name').value = customTeamNames.B || "Tim B";
  document.getElementById('admin-host-pass-new').value = hostMasterPassword;
}

function submitAdminGatePass() {
  const input = document.getElementById('admin-gate-pass');
  const err = document.getElementById('admin-gate-error');
  const val = (input ? input.value : '').trim().toUpperCase();

  if (val === hostMasterPassword.trim().toUpperCase()) {
    try { sessionStorage.setItem('host_authenticated', 'true'); } catch (e) {}
    if (window.Sound) Sound.play('start');
    unlockAdminDashboard();
  } else {
    if (window.Sound) Sound.play('wrong');
    if (err) err.textContent = '❌ Password Host salah! Coba lagi.';
    if (input) input.focus();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const barrier = document.getElementById('admin-auth-barrier');
    if (barrier && barrier.classList.contains('active')) {
      submitAdminGatePass();
    }
  }
});

/* ═══════════════════════════════════════════════════════════
   🗂️ TABS MANAGEMENT
   ═══════════════════════════════════════════════════════════ */
function switchAdminTab(tabName) {
  if (window.Sound) Sound.play('click');
  document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.admin-tab-panel').forEach(p => p.classList.remove('active'));

  const btn = document.getElementById(`tab-btn-${tabName}`);
  const panel = document.getElementById(`tab-content-${tabName}`);
  if (btn) btn.classList.add('active');
  if (panel) panel.classList.add('active');

  if (tabName === 'history') {
    loadAdminHistory();
  }
}

/* ═══════════════════════════════════════════════════════════
   📚 QUESTION CRUD OPERATIONS
   ═══════════════════════════════════════════════════════════ */
function renderAdminQuestions(filter = '') {
  const listEl = document.getElementById('admin-questions-list');
  const countEl = document.getElementById('admin-q-count');
  if (!listEl) return;

  if (countEl) countEl.textContent = dynamicQuestionBank.length;

  const query = filter.toLowerCase().trim();
  listEl.innerHTML = '';

  let shownCount = 0;
  dynamicQuestionBank.forEach((item, idx) => {
    if (query && !item.q.toLowerCase().includes(query)) return;
    shownCount++;

    const usedCount = Number(item.usedCount) || 0;
    const badgeClass = usedCount >= 2 ? 'usage-2' : (usedCount === 1 ? 'usage-1' : 'usage-0');
    const badgeText = usedCount >= 2 ? '🔴 Kuota 2/2x (Penuh)' : (usedCount === 1 ? '🟡 Muncul 1/2x' : '🟢 Belum Muncul (0/2x)');

    const card = document.createElement('div');
    card.className = 'admin-q-card';
    card.innerHTML = `
      <div class="admin-q-header">
        <div>
          <div style="display:flex; align-items:center; flex-wrap:wrap; gap:6px;">
            <span class="admin-q-number">Soal #${idx + 1}</span>
            <span class="admin-q-usage-badge ${badgeClass}">${badgeText}</span>
          </div>
          <h3 class="admin-q-title">${item.q}</h3>
        </div>
        <div class="admin-q-actions">
          <button class="btn-q-action btn-q-edit" onclick="openEditQuestionModal(${idx})">✏️ Edit</button>
          <button class="btn-q-action btn-q-delete" onclick="deleteQuestion(${idx})">🗑️ Hapus</button>
        </div>
      </div>
      <div class="admin-q-choices">
        ${item.choices.map((c, cIdx) => `
          <div class="admin-q-choice-item ${cIdx === item.answer ? 'is-correct' : ''}">
            <span class="choice-badge">${LABELS[cIdx]}</span>
            <span>${c} ${cIdx === item.answer ? '✓ (Kunci Benar)' : ''}</span>
          </div>
        `).join('')}
      </div>
    `;
    listEl.appendChild(card);
  });

  if (shownCount === 0) {
    listEl.innerHTML = `<div class="empty-state">Tidak ada soal yang cocok dengan "${filter}".</div>`;
  }
}

function filterAdminQuestions() {
  const searchInput = document.getElementById('admin-q-search');
  renderAdminQuestions(searchInput ? searchInput.value : '');
}

function openAddQuestionModal() {
  if (window.Sound) Sound.play('click');
  document.getElementById('qmodal-edit-index').value = '-1';
  document.getElementById('qmodal-title').textContent = 'Tambah Soal Baru';
  document.getElementById('qmodal-icon').textContent = '➕';
  document.getElementById('qmodal-question').value = '';
  document.getElementById('qmodal-choice-0').value = '';
  document.getElementById('qmodal-choice-1').value = '';
  document.getElementById('qmodal-choice-2').value = '';
  document.getElementById('qmodal-choice-3').value = '';
  document.getElementById('qmodal-radio-0').checked = true;
  document.getElementById('qmodal-error').textContent = '';

  document.getElementById('modal-question').classList.add('active');
}

function openEditQuestionModal(index) {
  if (window.Sound) Sound.play('click');
  const item = dynamicQuestionBank[index];
  if (!item) return;

  document.getElementById('qmodal-edit-index').value = index;
  document.getElementById('qmodal-title').textContent = `Edit Soal #${index + 1}`;
  document.getElementById('qmodal-icon').textContent = '✏️';
  document.getElementById('qmodal-question').value = item.q;
  document.getElementById('qmodal-choice-0').value = item.choices[0] || '';
  document.getElementById('qmodal-choice-1').value = item.choices[1] || '';
  document.getElementById('qmodal-choice-2').value = item.choices[2] || '';
  document.getElementById('qmodal-choice-3').value = item.choices[3] || '';
  
  const radio = document.getElementById(`qmodal-radio-${item.answer}`);
  if (radio) radio.checked = true;
  
  document.getElementById('qmodal-error').textContent = '';
  document.getElementById('modal-question').classList.add('active');
}

function closeQuestionModal() {
  document.getElementById('modal-question').classList.remove('active');
}

async function saveQuestionModal() {
  const editIdx = parseInt(document.getElementById('qmodal-edit-index').value);
  const qText = document.getElementById('qmodal-question').value.trim();
  const c0 = document.getElementById('qmodal-choice-0').value.trim();
  const c1 = document.getElementById('qmodal-choice-1').value.trim();
  const c2 = document.getElementById('qmodal-choice-2').value.trim();
  const c3 = document.getElementById('qmodal-choice-3').value.trim();
  const errEl = document.getElementById('qmodal-error');

  if (!qText || !c0 || !c1 || !c2 || !c3) {
    errEl.textContent = '⚠️ Harap isi pertanyaan dan semua 4 pilihan jawaban!';
    if (window.Sound) Sound.play('wrong');
    return;
  }

  const selectedRadio = document.querySelector('input[name="qmodal-correct"]:checked');
  const answerIdx = selectedRadio ? parseInt(selectedRadio.value) : 0;

  const existingUsed = (editIdx >= 0 && editIdx < dynamicQuestionBank.length)
    ? (dynamicQuestionBank[editIdx].usedCount || 0)
    : 0;

  const newQuestionObj = {
    q: qText,
    choices: [c0, c1, c2, c3],
    answer: answerIdx,
    usedCount: existingUsed
  };

  if (editIdx >= 0 && editIdx < dynamicQuestionBank.length) {
    dynamicQuestionBank[editIdx] = newQuestionObj;
  } else {
    dynamicQuestionBank.push(newQuestionObj);
  }

  try {
    await db.ref('admin/questions').set(dynamicQuestionBank);
    if (window.Sound) Sound.play('correct');
    closeQuestionModal();
    renderAdminQuestions();
  } catch (err) {
    errEl.textContent = '❌ Gagal menyimpan ke Firebase: ' + err.message;
  }
}

async function deleteQuestion(index) {
  if (dynamicQuestionBank.length <= 3) {
    alert('⚠️ Game membutuhkan minimal 3 soal!');
    return;
  }
  if (confirm(`Apakah Anda yakin ingin menghapus Soal #${index + 1}?`)) {
    dynamicQuestionBank.splice(index, 1);
    try {
      await db.ref('admin/questions').set(dynamicQuestionBank);
      if (window.Sound) Sound.play('correct');
      renderAdminQuestions();
    } catch (err) {
      alert('❌ Gagal menghapus: ' + err.message);
    }
  }
}

async function resetAllQuestionUsage() {
  if (!confirm('Apakah Anda yakin ingin me-reset kuota kemunculan semua soal menjadi 0/2x?')) return;
  if (window.Sound) Sound.play('click');

  dynamicQuestionBank.forEach(q => {
    q.usedCount = 0;
  });

  try {
    await db.ref('admin/questions').set(dynamicQuestionBank);
    if (window.Sound) Sound.play('correct');
    renderAdminQuestions();
    alert('✅ Kuota kemunculan semua soal berhasil direset ke 0/2x!');
  } catch (err) {
    alert('❌ Gagal mereset kuota: ' + err.message);
  }
}

async function resetQuestionsToDefault() {
  if (confirm('Apakah Anda yakin ingin me-reset semua soal ke 120 Soal Standar Wawasan Kebangsaan & Sejarah?')) {
    dynamicQuestionBank = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)).map(q => ({
      ...q,
      usedCount: 0
    }));
    try {
      await db.ref('admin/questions').set(dynamicQuestionBank);
      if (window.Sound) Sound.play('victory');
      renderAdminQuestions();
      alert('✅ Bank soal berhasil di-reset ke 120 soal default!');
    } catch (err) {
      alert('❌ Gagal reset: ' + err.message);
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   🏷️ TEAM & PASSWORD SETTINGS
   ═══════════════════════════════════════════════════════════ */
async function saveAdminSettings() {
  const nameA = document.getElementById('admin-team-a-name').value.trim() || "Tim A";
  const nameB = document.getElementById('admin-team-b-name').value.trim() || "Tim B";
  const newPassInput = document.getElementById('admin-host-pass-new');
  const newPass = newPassInput ? newPassInput.value.trim() : "";
  const statusEl = document.getElementById('team-save-status');

  customTeamNames = { A: nameA, B: nameB };
  if (newPass) {
    hostMasterPassword = newPass;
  }

  try {
    await Promise.all([
      db.ref('admin/settings/teamNames').set(customTeamNames),
      newPass ? db.ref('admin/settings/hostPassword').set(newPass) : Promise.resolve()
    ]);
    if (window.Sound) Sound.play('correct');
    statusEl.textContent = '✅ Semua pengaturan berhasil disimpan!';
    setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
  } catch (err) {
    statusEl.textContent = '❌ Gagal menyimpan: ' + err.message;
  }
}

/* ═══════════════════════════════════════════════════════════
   📜 MATCH HISTORY LOGS
   ═══════════════════════════════════════════════════════════ */
let historyListenerAttached = false;

function setupHistoryRealtimeListener() {
  if (historyListenerAttached) return;
  historyListenerAttached = true;

  try {
    db.ref('history').limitToLast(50).on('value', (snap) => {
      const countEl = document.getElementById('admin-hist-count');
      if (!snap.exists()) {
        if (countEl) countEl.textContent = '0';
        const listEl = document.getElementById('admin-history-list');
        if (listEl) listEl.innerHTML = '<div class="empty-state">Belum ada riwayat pertandingan tercatat.<br><span style="font-size:0.9rem; color:var(--color-muted); margin-top:8px; display:block;">Riwayat otomatis tersimpan saat satu game/match selesai dimainkan sampai akhir atau tercapai skor kemenangan.</span></div>';
        return;
      }
      const rawData = snap.val();
      renderHistoryItems(rawData);
    }, (err) => {
      console.warn('History listener error:', err);
    });
  } catch (err) {
    console.warn('Failed to attach history listener:', err);
  }
}

function renderHistoryItems(rawData) {
  const listEl = document.getElementById('admin-history-list');
  const countEl = document.getElementById('admin-hist-count');
  if (!rawData) {
    if (countEl) countEl.textContent = '0';
    if (listEl) listEl.innerHTML = '<div class="empty-state">Belum ada riwayat pertandingan tercatat.</div>';
    return;
  }

  const items = Object.keys(rawData).map(key => ({ id: key, ...rawData[key] })).reverse();
  if (countEl) countEl.textContent = items.length;
  if (!listEl) return;

  listEl.innerHTML = '';
  items.forEach(h => {
    const dateStr = h.timestamp ? new Date(h.timestamp).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }) : '-';

    const winnerBadge = h.winner === 'A'
      ? `<span class="hist-winner-badge hist-win-a">🏆 ${(h.teamA || 'Tim A').toUpperCase()} MENANG</span>`
      : h.winner === 'B'
        ? `<span class="hist-winner-badge hist-win-b">🏆 ${(h.teamB || 'Tim B').toUpperCase()} MENANG</span>`
        : `<span class="hist-winner-badge hist-win-draw">🤝 PERTANDINGAN SERI</span>`;

    let reasonText = '';
    if (h.winReason === 'knockout') {
      reasonText = '🚩 Tarikan Garis Kemenangan';
    } else if (h.winReason === 'speed_tiebreaker') {
      reasonText = '⚡ Unggul Kecepatan Waktu';
    } else if (h.winner === 'draw') {
      reasonText = '⚖️ Skor & Waktu Seimbang';
    } else {
      reasonText = '🎯 Keunggulan Poin Akhir';
    }

    const card = document.createElement('div');
    card.className = 'hist-card';
    card.innerHTML = `
      <div class="hist-info">
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="hist-room-code">Room: ${h.roomCode || '------'}</span>
          <span style="font-size:0.8rem; background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:4px; color:#facc15;">${reasonText}</span>
        </div>
        <span class="hist-time">📅 ${dateStr}</span>
        ${(h.avgSpeedA || h.avgSpeedB) ? `<span style="font-size:0.82rem; color:var(--color-muted);">⚡ Rata-rata Kecepatan: <b>${h.teamA || 'A'}:</b> ${h.avgSpeedA || '-'}s vs <b>${h.teamB || 'B'}:</b> ${h.avgSpeedB || '-'}s</span>` : ''}
      </div>
      <div class="hist-vs-box">
        <span class="hist-score hist-score-a">${h.scoreA ?? 0}</span>
        <span style="font-size:1.1rem; color:rgba(255,255,255,0.4);">vs</span>
        <span class="hist-score hist-score-b">${h.scoreB ?? 0}</span>
      </div>
      <div style="text-align:right;">
        ${winnerBadge}
      </div>
    `;
    listEl.appendChild(card);
  });
}

async function loadAdminHistory() {
  const listEl = document.getElementById('admin-history-list');
  const countEl = document.getElementById('admin-hist-count');
  if (!listEl) return;

  try {
    const snap = await db.ref('history').limitToLast(50).get();
    if (!snap.exists()) {
      listEl.innerHTML = '<div class="empty-state">Belum ada riwayat pertandingan tercatat.<br><span style="font-size:0.9rem; color:var(--color-muted); margin-top:8px; display:block;">Riwayat otomatis tersimpan saat satu game/match selesai dimainkan sampai akhir atau tercapai skor kemenangan.</span></div>';
      if (countEl) countEl.textContent = '0';
      return;
    }
    renderHistoryItems(snap.val());
  } catch (err) {
    const isPermissionError = (err.message || '').toLowerCase().includes('permission') || (err.message || '').toLowerCase().includes('denied');
    if (isPermissionError) {
      listEl.innerHTML = `
        <div class="empty-state" style="text-align:left; background:rgba(239,68,68,0.1); border:2px solid var(--danger-color); padding:20px; border-radius:12px;">
          <div style="font-size:1.15rem; font-weight:800; color:#ff4d6d; margin-bottom:8px;">
            ⚠️ Firebase Rules Perlu Diupdate (Permission Denied)
          </div>
          <p style="color:#e2e8f0; font-size:0.95rem; margin-bottom:12px; line-height:1.5;">
            Firebase Database Anda saat ini belum mengizinkan akses ke folder <code>history</code>. Silakan buka <b>Firebase Console ➔ Realtime Database ➔ Rules</b> dan ubah aturannya menjadi:
          </p>
          <pre style="background:#0f0204; border:1px solid rgba(255,255,255,0.2); padding:12px; border-radius:8px; color:#38bdf8; font-family:monospace; font-size:0.9rem; overflow-x:auto;">{
  "rules": {
    ".read": true,
    ".write": true
  }
}</pre>
          <p style="font-size:0.85rem; color:var(--color-muted); margin-top:10px;">
            Atau jika ingin rules per-folder: pastikan folder <code>rooms</code>, <code>admin</code>, dan <code>history</code> semuanya diberi <code>".read": true, ".write": true</code>, lalu klik <b>Publish</b>.
          </p>
        </div>
      `;
    } else {
      listEl.innerHTML = `<div class="empty-state">❌ Gagal memuat riwayat: ${err.message}</div>`;
    }
  }
}

async function clearMatchHistory() {
  if (confirm('Hapus seluruh riwayat pertandingan? Tindakan ini permanen.')) {
    try {
      await db.ref('history').remove();
      if (window.Sound) Sound.play('correct');
      loadAdminHistory();
    } catch (err) {
      alert('❌ Gagal menghapus riwayat: ' + err.message);
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   🌐 SYNC INITIAL QUESTIONS & SETTINGS FROM FIREBASE
   ═══════════════════════════════════════════════════════════ */
async function initAdminSync() {
  try {
    // Realtime Sync Questions & Quotas
    db.ref('admin/questions').on('value', (qSnap) => {
      if (qSnap.exists()) {
        const data = qSnap.val();
        if (Array.isArray(data)) {
          dynamicQuestionBank = data.filter(Boolean);
        } else if (typeof data === 'object') {
          dynamicQuestionBank = Object.values(data);
        }
      } else {
        db.ref('admin/questions').set(DEFAULT_QUESTIONS);
      }
      if (isHostAuthenticated) {
        const searchInput = document.getElementById('admin-q-search');
        renderAdminQuestions(searchInput ? searchInput.value : '');
      }
    });

    // Realtime Sync Team Names
    db.ref('admin/settings/teamNames').on('value', (teamSnap) => {
      if (teamSnap.exists()) {
        customTeamNames = teamSnap.val();
        if (isHostAuthenticated) {
          const aInput = document.getElementById('admin-team-a-name');
          const bInput = document.getElementById('admin-team-b-name');
          if (aInput && document.activeElement !== aInput) aInput.value = customTeamNames.A || "Tim A";
          if (bInput && document.activeElement !== bInput) bInput.value = customTeamNames.B || "Tim B";
        }
      }
    });

    // Realtime Sync Host Password
    db.ref('admin/settings/hostPassword').on('value', (passSnap) => {
      if (passSnap.exists()) {
        hostMasterPassword = passSnap.val();
      }
    });
  } catch (e) {
    console.warn('Firebase init sync warning (using defaults):', e);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  await initAdminSync();
  try {
    const isAuth = sessionStorage.getItem('host_authenticated') === 'true';
    if (isAuth) {
      unlockAdminDashboard();
      return;
    }
  } catch (e) {}

  const passInput = document.getElementById('admin-gate-pass');
  if (passInput) passInput.focus();
});
