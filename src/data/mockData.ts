import {
  UserProfile,
  VideoLesson,
  Concept3D,
  QuizQuestion,
  Assignment,
  Submission,
  NotificationItem,
  LeaderboardEntry,
  ForumThread,
  ChatMessage,
  NetworkDevice,
  NetworkCable
} from '../types';

export const CURRENT_STUDENT: UserProfile = {
  id: 'usr_student_01',
  name: 'Ahmad Rizky Pratama',
  role: 'siswa',
  grade: '11',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  xp: 1420,
  level: 5,
  streakDays: 7,
  badges: ['Master Subnetting', 'Code Explorer', 'Quiz Champion', 'Fast Responder']
};

export const TEACHER_PROFILE: UserProfile = {
  id: 'usr_teacher_sitty',
  name: 'Ibu Siti Salamanah, S.Kom., Gr.',
  role: 'guru',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  xp: 9999,
  level: 50,
  streakDays: 120,
  badges: ['Master Educator', 'TIK Pioneer', 'Curriculum Expert']
};

export const CONCEPTS_3D: Concept3D[] = [
  {
    id: 'c3d_binary',
    title: 'Arsitektur Gerbang Logika & Register Bilangan Biner',
    subtitle: 'Materi Kelas 7 · Berpikir Komputasional & Sistem Bilangan (BK-SK)',
    grade: '7',
    image: '/src/assets/images/tik_computer_hardware_3d_1791939792442.jpg',
    description: 'Eksplorasi representasi data digital dalam komputer: saklar bit biner 0 dan 1, gerbang logika dasar (AND, OR, NOT), register penyimpanan 8-bit (Byte), serta konversi ke Oktal dan Heksadesimal.',
    hotspots: [
      {
        id: 'hs_bit_reg',
        label: 'Register Data 8-Bit (Byte)',
        x: 48,
        y: 40,
        details: 'Unit memori tercepat yang menyimpan 8 buah nilai biner (bit). Setiap bit memiliki bobot nilai tempat kelipatan pangkat 2 (128, 64, 32, 16, 8, 4, 2, 1).'
      },
      {
        id: 'hs_logic_gate',
        label: 'Gerbang Logika Transistor (Logic Gates)',
        x: 64,
        y: 35,
        details: 'Sirkuit semikonduktor mikro yang mengeksekusi operasi Boolean dasar seperti AND, OR, NOT, dan XOR untuk melakukan kalkulasi biner.'
      },
      {
        id: 'hs_nibble_hex',
        label: 'Pengelompokan 4-Bit (Nibble Heksadesimal)',
        x: 34,
        y: 60,
        details: 'Setiap 4 digit biner dikelompokkan menjadi 1 digit Heksadesimal (0-F) untuk menyederhanakan pembacaan kode mesin dan alamat memori.'
      },
      {
        id: 'hs_data_bus',
        label: 'Jalur Bus Data Biner Paralel',
        x: 52,
        y: 72,
        details: 'Jalur kabel konduktif mikro yang menghantarkan sinyal tegangan tinggi (Logika 1) dan tegangan rendah (Logika 0) secara serempak.'
      }
    ]
  },
  {
    id: 'c3d_stack',
    title: 'Struktur Data Stack (LIFO) & Call Stack Memori',
    subtitle: 'Materi Kelas 8 · Algoritma & Struktur Data (AD)',
    grade: '8',
    image: '/src/assets/images/tik_hero_concept_1791939790274.jpg',
    description: 'Struktur data linear bertumpuk dengan prinsip LIFO (Last In First Out). Digunakan secara luas dalam fungsi rekursif, tombol Undo/Redo, pemanggilan fungsi sistem (Call Stack), dan evaluasi operasi ekspresi matematika Postfix.',
    hotspots: [
      {
        id: 'hs_stack_top',
        label: 'Pointer Elemen TOP Stack',
        x: 50,
        y: 28,
        details: 'Penunjuk indeks yang selalu mengarah ke elemen paling atas di dalam tumpukan. Semua operasi push (tambah) dan pop (ambil) hanya terjadi pada pointer TOP ini.'
      },
      {
        id: 'hs_stack_buffer',
        label: 'Buffer Tumpukan Data LIFO',
        x: 50,
        y: 50,
        details: 'Koleksi elemen yang disimpan secara berurutan. Elemen yang terakhir dimasukkan (Last In) akan menjadi elemen pertama yang dikeluarkan (First Out).'
      },
      {
        id: 'hs_stack_sp',
        label: 'Register Stack Pointer (SP) CPU',
        x: 32,
        y: 65,
        details: 'Register khusus pada prosesor yang menyimpan alamat memori puncak stack saat ini selama pemanggilan sub-rutin fungsi program.'
      },
      {
        id: 'hs_stack_overflow',
        label: 'Batas Kapasitas & Stack Overflow',
        x: 66,
        y: 65,
        details: 'Batas maksimal penyimpanan stack. Jika operasi push dipaksakan saat stack penuh, akan terjadi galat kritis Stack Overflow.'
      }
    ]
  },
  {
    id: 'c3d_hardware',
    title: 'Arsitektur Motherboard & Komponen Sistem Komputer',
    subtitle: 'Materi Kelas 10 · Sistem Komputer (SK)',
    grade: '10',
    image: '/src/assets/images/tik_computer_hardware_3d_1791939792442.jpg',
    description: 'Eksplorasi komponen fisik utama dalam arsitektur komputer modern: prosesor LGA socket, dual-channel DDR5 RAM, PCIe 5.0 bus lane, dan NVMe SSD berkecepatan tinggi.',
    hotspots: [
      {
        id: 'hs1',
        label: 'Socket CPU (LGA 1700)',
        x: 55,
        y: 34,
        details: 'Dudukan prosesor sentral tempat chip CPU dipasang. Mengatur jutaan konektor pin ke motherboard untuk komunikasi berkecepatan miliaran siklus per detik (Clock Speed).'
      },
      {
        id: 'hs2',
        label: 'DDR5 RAM Slots (4x)',
        x: 74,
        y: 45,
        details: 'Slot memori utama volatile (DDR5) berkecepatan hingga 6400 MT/s. Menyimpan data sementara yang sedang dieksekusi prosesor secara aktif.'
      },
      {
        id: 'hs3',
        label: 'PCIe 5.0 x16 Slot (GPU)',
        x: 27,
        y: 57,
        details: 'Jalur ekspansi grafis ultra-cepat dengan bandwidth hingga 128 GB/s untuk Dedicated GPU atau accelerator kartu AI.'
      },
      {
        id: 'hs4',
        label: 'M.2 NVMe Slot & Chipset',
        x: 48,
        y: 72,
        details: 'Penyimpanan non-volatile SSD berkecepatan transfer 7000+ MB/s melalui direct PCIe lane ke prosesor tanpa hambatan kabel SATA.'
      }
    ]
  },
  {
    id: 'c3d_network',
    title: 'Infrastruktur Jaringan Komputer & Topologi Enterprise',
    subtitle: 'Materi Kelas 11 · Jaringan Komputer & Internet (JKI)',
    grade: '11',
    image: '/src/assets/images/tik_network_topology_3d_1791939790211.jpg',
    description: 'Visualisasi topologi bintang hierarkis: Server Rack 42U, Core Switch, Firewall Hardware, Router Gateway, dan Workstation Client yang saling terhubung.',
    hotspots: [
      {
        id: 'hs_rack',
        label: 'Server Rack 42U Data Center',
        x: 32,
        y: 28,
        details: 'Pusat server lokal (Web server, Active Directory, Database) yang melayani permintaan data internal dan eksternal secara terpusat.'
      },
      {
        id: 'hs_router',
        label: 'Enterprise Gateway Router',
        x: 41,
        y: 43,
        details: 'Perangkat Layer 3 OSI yang memetakan routing paket data antara jaringan LAN lokal sekolah dengan Internet/WAN menggunakan tabel routing.'
      },
      {
        id: 'hs_firewall',
        label: 'Next-Gen Firewall (NGFW)',
        x: 52,
        y: 35,
        details: 'Penyaring lalu lintas keamanan data untuk mencegah serangan DDoS, malware, serta pemindaian port yang tidak sah.'
      },
      {
        id: 'hs_switch',
        label: 'Core & Access Switch',
        x: 54,
        y: 53,
        details: 'Perangkat Layer 2 OSI yang mendistribusikan frame data berdasarkan MAC Address ke puluhan komputer workstation di laboratorium TIK.'
      }
    ]
  },
  {
    id: 'c3d_cloud_sec',
    title: 'Cloud Computing, Enkripsi & Keamanan Data Siber',
    subtitle: 'Materi Kelas 12 · Keamanan Siber & Cloud (KSC)',
    grade: '12',
    image: '/src/assets/images/tik_cybersecurity_cloud_3d_1791939790517.jpg',
    description: 'Konsep enkripsi ujung-ke-ujung (End-to-End Encryption), perlindungan cloud database, dan arsitektur zero-trust dalam era transformasi digital.',
    hotspots: [
      {
        id: 'hs_cloud',
        label: 'Infrastruktur Cloud Hybrid',
        x: 54,
        y: 25,
        details: 'Penyimpanan terdistribusi yang dapat diakses di mana saja melalui protokol HTTPS/TLS dengan elastisitas komputasi tinggi.'
      },
      {
        id: 'hs_crypto',
        label: 'Cryptographic Lock & Shield',
        x: 53,
        y: 62,
        details: 'Algoritma kriptografi modern (AES-256 dan RSA-4096) yang mengubah data plaintext menjadi ciphertext yang tidak dapat didekripsi pihak ketiga.'
      },
      {
        id: 'hs_nodes',
        label: 'Interconnected Node Cluster',
        x: 30,
        y: 48,
        details: 'Kluster server yang menjalankan replikasi data real-time sehingga jika salah satu server down, sistem tetap berjalan tanpa henti (High Availability).'
      }
    ]
  }
];

export const VIDEO_LESSONS: VideoLesson[] = [
  // Kelas 7
  {
    id: 'vid_07_01',
    title: 'Konsep Sistem Bilangan Digital: Biner, Oktal, Desimal & Heksadesimal',
    duration: '16:30',
    grade: '7',
    topic: 'Sistem Bilangan & Representasi Data (SK)',
    instructor: 'Ibu Siti Salamanah, S.Kom.',
    description: 'Panduan lengkap memahami bagaimana komputer memproses logika 0 dan 1, nilai tempat kelipatan basis 2, 8, 10, dan 16, serta konversi langsung dengan metode modulo.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/LpuPe81bc2w',
    thumbnail: '/src/assets/images/tik_computer_hardware_3d_1791939792442.jpg',
    keyPoints: [
      'Alasan komputer memakai biner (transistor On = 1, Off = 0).',
      'Bobot nilai tempat pangkat 2 (128, 64, 32, 16, 8, 4, 2, 1).',
      'Metode sisa pembagian berulang (modulo) dari desimal ke biner/oktal/hex.',
      'Pengelompokan 3-bit untuk oktal dan 4-bit (nibble) untuk heksadesimal.'
    ]
  },
  {
    id: 'vid_07_02',
    title: 'Latihan Cepat Konversi Bilangan Biner ke Heksadesimal & ASCII',
    duration: '12:10',
    grade: '7',
    topic: 'Representasi Karakter Digital (SK)',
    instructor: 'Ibu Siti Salamanah, S.Kom.',
    description: 'Bagaimana teks, huruf, dan simbol diubah menjadi kode ASCII 7-bit dan representasi heksadesimal warna web.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/xwgFtw9U07w',
    thumbnail: '/src/assets/images/tik_hero_concept_1791939790274.jpg',
    keyPoints: [
      'Tabel konversi heksadesimal 0-9 dan A-F (10-15).',
      'Format kode warna RGB heksadesimal (#00FFFF, #FF00FF).',
      'Standar kode ASCII huruf kapital A (65 desimal / 01000001 biner).',
      'Trik cepat membaca biner tanpa kalkulator.'
    ]
  },

  // Kelas 8
  {
    id: 'vid_08_01',
    title: 'Struktur Data Stack (Tumpukan) & Prinsip LIFO',
    duration: '19:40',
    grade: '8',
    topic: 'Algoritma & Struktur Data (AD)',
    instructor: 'Ibu Siti Salamanah, S.Kom.',
    description: 'Mengenal konsep dasar struktur data Stack, operasi Push (memasukkan), Pop (mengambil), Peek/Top (mengintip), isEmpty, dan penanganan Stack Overflow.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/bxRVz8zklWM',
    thumbnail: '/src/assets/images/tik_hero_concept_1791939790274.jpg',
    keyPoints: [
      'Prinsip LIFO (Last In First Out) vs FIFO pada Antrean (Queue).',
      'Mekanisme pointer TOP dan perubahan ukuran (size) stack.',
      'Analogi tumpukan buku, fitur Ctrl+Z (Undo), dan riwayat browser.',
      'Kondisi batas: isEmpty (stack kosong) dan isFull (overflow).'
    ]
  },
  {
    id: 'vid_08_02',
    title: 'Penerapan Stack pada Operasi Hitung Notasi Postfix (RPN)',
    duration: '21:15',
    grade: '8',
    topic: 'Algoritma Perhitungan Matematika (AD)',
    instructor: 'Ibu Siti Salamanah, S.Kom.',
    description: 'Cara kerja kalkulator komputer mengevaluasi ekspresi matematika tanpa tanda kurung menggunakan Notasi Polandia Terbalik (Reverse Polish Notation) dengan bantuan Stack.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/7ha78yWRDlE',
    thumbnail: '/src/assets/images/tik_computer_hardware_3d_1791939792442.jpg',
    keyPoints: [
      'Perbedaan notasi Infix (A + B) vs Postfix (A B +).',
      'Algoritma evaluasi Postfix: angka di-push, operator men-pop 2 nilai.',
      'Menghindari kebingungan tanda kurung dalam kompilasi kode.',
      'Latihan menghitung ekspresi matematika postfix langkah demi langkah.'
    ]
  },

  // Kelas 10
  {
    id: 'vid_10_01',
    title: 'Pengantar Berpikir Komputasional & 4 Pilar Utama',
    duration: '14:20',
    grade: '10',
    topic: 'Berpikir Komputasional (BK)',
    instructor: 'Ibu Siti Salamanah, S.Kom.',
    description: 'Memahami Dekomposisi, Pengenalan Pola, Abstraksi, dan Perancangan Algoritma dalam menyelesaikan masalah sehari-hari dengan logika komputasi.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/mUXo-S8gk5E',
    thumbnail: '/src/assets/images/tik_hero_concept_1791939790274.jpg',
    keyPoints: [
      'Dekomposisi: Memecah masalah kompleks menjadi sub-masalah kecil.',
      'Pengenalan Pola: Menemukan kemiripan atau keteraturan pola data.',
      'Abstraksi: Fokus pada informasi penting dan mengabaikan detail minor.',
      'Perancangan Algoritma: Langkah terurut logis yang terdefinisi.'
    ]
  },
  {
    id: 'vid_10_02',
    title: 'Arsitektur Komputer & Siklus Fetch-Decode-Execute',
    duration: '18:45',
    grade: '10',
    topic: 'Sistem Komputer (SK)',
    instructor: 'Ibu Siti Salamanah, S.Kom.',
    description: 'Bagaimana CPU berinteraksi dengan memori RAM dan Register untuk menjalankan instruksi biner per milidetik.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/cNN_tTXABUA',
    thumbnail: '/src/assets/images/tik_computer_hardware_3d_1791939792442.jpg',
    keyPoints: [
      'Siklus Von Neumann: Memory, CPU (ALU + Control Unit), I/O.',
      'Perbedaan RAM (volatile) vs ROM/SSD (non-volatile).',
      'Hierarchy Memori: L1/L2 Cache vs RAM vs Storage.',
      'Bus Data, Address Bus, dan Control Bus.'
    ]
  },

  // Kelas 11
  {
    id: 'vid_11_01',
    title: 'Mastering Model OSI 7 Layer & Protokol TCP/IP',
    duration: '22:15',
    grade: '11',
    topic: 'Jaringan Komputer & Internet (JKI)',
    instructor: 'Ibu Siti Salamanah, S.Kom.',
    description: 'Kupas tuntas perjalanan paket data dari Application layer hingga bit sinyal fisik. Dilengkapi simulasi encapsulation dan decapsulation paket.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/nFYvyE3H8aU',
    thumbnail: '/src/assets/images/tik_network_topology_3d_1791939790211.jpg',
    keyPoints: [
      '7 Layer OSI: Application, Presentation, Session, Transport, Network, Data Link, Physical.',
      'Header IP vs Frame MAC Address.',
      'Perbedaan TCP (Reliable/Handshake) vs UDP (Fast/Streaming).',
      'Cara kerja protokol ARP (Address Resolution Protocol).'
    ]
  },
  {
    id: 'vid_11_02',
    title: 'Praktik Konfigurasi IPv4 & Teknik Subnetting VLSM',
    duration: '26:30',
    grade: '11',
    topic: 'Jaringan Komputer & Internet (JKI)',
    instructor: 'Ibu Siti Salamanah, S.Kom.',
    description: 'Panduan lengkap menghitung Network ID, Broadcast ID, Host Valid, dan Prefix Mask CIDR (/24, /26, /28) untuk laboratorium sekolah.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/s_Ntt6eTn94',
    thumbnail: '/src/assets/images/tik_network_topology_3d_1791939790211.jpg',
    keyPoints: [
      'Struktur 32-bit IPv4 dalam 4 oktet desimal.',
      'Rumus perhitungan jumlah host: 2^(32-prefix) - 2.',
      'Mengapa IP Host tidak boleh sama dengan Network atau Broadcast IP.',
      'Uji koneksi ping dan pemecahan masalah IP conflict.'
    ]
  },

  // Kelas 12
  {
    id: 'vid_12_01',
    title: 'Konsep Cloud Computing & Virtualisasi Modern',
    duration: '20:10',
    grade: '12',
    topic: 'Teknologi Informasi Lanjut (TIL)',
    instructor: 'Ibu Siti Salamanah, S.Kom.',
    description: 'Mengenal model layanan IaaS, PaaS, SaaS, container Docker, serta arsitektur cloud terdistribusi untuk skala global.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/M988_fsOSWo',
    thumbnail: '/src/assets/images/tik_cybersecurity_cloud_3d_1791939790517.jpg',
    keyPoints: [
      'Perbedaan IaaS (Compute Engine), PaaS (App Engine), SaaS (Google Workspace).',
      'Virtual Machine (Hypervisor) vs Lightweight Container.',
      'Keamanan data di cloud: Shared Responsibility Model.',
      'Skalabilitas otomatis dan load balancer.'
    ]
  },
  {
    id: 'vid_12_02',
    title: 'Kriptografi & Prinsip Keamanan Siber (CIA Triad)',
    duration: '24:05',
    grade: '12',
    topic: 'Keamanan Siber & Etika (KSE)',
    instructor: 'Ibu Siti Salamanah, S.Kom.',
    description: 'Bedah pilar Confidentiality, Integrity, Availability serta bagaimana SSL/TLS melindungi transaksi digital sehari-hari.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/2aHkqB2-46k',
    thumbnail: '/src/assets/images/tik_cybersecurity_cloud_3d_1791939790517.jpg',
    keyPoints: [
      'Pilar CIA Triad dalam keamanan sistem informasi.',
      'Enkripsi Simetris (AES) vs Asimetris (Public/Private Key).',
      'Hashing (SHA-256) untuk verifikasi integritas data file.',
      'Sertifikat digital SSL/TLS dan protokol HTTPS.'
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Kelas 7
  {
    id: 'q_07_1',
    grade: '7',
    topic: 'Konversi Biner ke Desimal',
    question: 'Bilangan biner 1011(2) jika dikonversikan ke dalam bilangan desimal (basis 10) bernilai...',
    options: ['9', '11', '13', '15'],
    correctIndex: 1,
    explanation: 'Perhitungan bobot bit: (1 × 2^3) + (0 × 2^2) + (1 × 2^1) + (1 × 2^0) = 8 + 0 + 2 + 1 = 11.',
    points: 25
  },
  {
    id: 'q_07_2',
    grade: '7',
    topic: 'Konversi Biner ke Heksadesimal',
    question: 'Berapakah nilai heksadesimal (basis 16) dari bilangan biner 1111 0000(2)?',
    options: ['F0', 'FF', '0F', 'E0'],
    correctIndex: 0,
    explanation: 'Pengelompokan 4-bit (nibble): 1111(2) bernilai 15 desimal yang disimbolkan "F", dan 0000(2) bernilai "0". Maka hasilnya adalah F0(16).',
    points: 25
  },
  {
    id: 'q_07_3',
    grade: '7',
    topic: 'Sistem Bilangan Oktal',
    question: 'Sistem bilangan Oktal menggunakan basis 8 dengan simbol angka...',
    options: ['0 sampai 7', '0 sampai 8', '1 sampai 8', '0 sampai 9 dan A-F'],
    correctIndex: 0,
    explanation: 'Sistem bilangan oktal berbasis 8, sehingga hanya memiliki 8 digit unik yaitu: 0, 1, 2, 3, 4, 5, 6, dan 7.',
    points: 25
  },
  {
    id: 'q_07_4',
    grade: '7',
    topic: 'Metode Pembagian Modulo',
    question: 'Jika bilangan desimal 25 dikonversikan ke biner dengan metode pembagian berulang dibagi 2, berapakah hasil pembacaan sisa dari bawah ke atas?',
    options: ['11001', '10011', '11010', '10101'],
    correctIndex: 0,
    explanation: '25/2=12 sisa 1; 12/2=6 sisa 0; 6/2=3 sisa 0; 3/2=1 sisa 1; 1/2=0 sisa 1. Dibaca dari bawah ke atas: 11001(2).',
    points: 25
  },

  // Kelas 8
  {
    id: 'q_08_1',
    grade: '8',
    topic: 'Definisi Struktur Data Stack',
    question: 'Struktur data Stack bekerja berdasarkan prinsip LIFO. Kepanjangan dari LIFO adalah...',
    options: ['Last In First Out', 'Low Input Fast Output', 'Last In Final Order', 'Linear Indexed File Output'],
    correctIndex: 0,
    explanation: 'LIFO (Last In First Out) berarti elemen yang paling terakhir dimasukkan ke dalam tumpukan adalah elemen yang pertama kali akan diambil atau dikeluarkan.',
    points: 25
  },
  {
    id: 'q_08_2',
    grade: '8',
    topic: 'Operasi Dasar Stack',
    question: 'Operasi untuk menyisipkan elemen baru ke puncak tumpukan (TOP) dan operasi untuk mengambil elemen teratas berturut-turut dinamakan...',
    options: ['Push dan Pop', 'Enqueue dan Dequeue', 'Insert dan Delete', 'Peek dan Clear'],
    correctIndex: 0,
    explanation: 'Push bertugas memasukkan elemen baru ke TOP stack, sedangkan Pop bertugas menghapus sekaligus mengembalikan elemen yang berada di posisi TOP.',
    points: 25
  },
  {
    id: 'q_08_3',
    grade: '8',
    topic: 'Analisis Alur Stack & TOP Pointer',
    question: 'Sebuah stack kosong dikenakan operasi: push(10), push(20), push(30), lalu pop(). Berapakah nilai yang terambil dan nilai TOP saat ini?',
    options: ['Terambil 30, TOP bernilai 20', 'Terambil 10, TOP bernilai 20', 'Terambil 30, TOP bernilai 10', 'Terambil 20, TOP bernilai 30'],
    correctIndex: 0,
    explanation: 'Elemen 30 adalah yang terakhir masuk. Ketika pop() dipanggil, 30 dikeluarkan. Elemen tepat di bawahnya yaitu 20 kini menjadi TOP stack.',
    points: 25
  },
  {
    id: 'q_08_4',
    grade: '8',
    topic: 'Penerapan Stack pada Notasi Postfix',
    question: 'Evaluasi hasil perhitungan ekspresi aritmatika Postfix: "4 5 + 3 *". Berapakah hasil akhirnya?',
    options: ['27', '19', '17', '35'],
    correctIndex: 0,
    explanation: 'Langkah: Push 4, push 5. Temu "+", pop 5 dan 4, hitung 4 + 5 = 9, push 9. Push 3. Temu "*", pop 3 dan 9, hitung 9 * 3 = 27. Hasil akhir = 27.',
    points: 25
  },

  // Kelas 10
  {
    id: 'q_10_1',
    grade: '10',
    topic: 'Sistem Komputer',
    question: 'Komponen perangkat keras yang bertindak sebagai "otak" komputer dan bertanggung jawab mengeksekusi instruksi aritmatika dan logika adalah...',
    options: ['Random Access Memory (RAM)', 'Central Processing Unit (CPU)', 'Solid State Drive (SSD)', 'Motherboard Chipset'],
    correctIndex: 1,
    explanation: 'CPU (Central Processing Unit) berisi ALU (Arithmetic Logic Unit) dan Control Unit yang bertugas memproses dan mengeksekusi instruksi program secara langsung.',
    points: 25
  },
  {
    id: 'q_10_2',
    grade: '10',
    topic: 'Berpikir Komputasional',
    question: 'Kemampuan untuk menyaring informasi yang relevan dan mengabaikan detail-detail yang tidak penting dalam pemecahan masalah disebut...',
    options: ['Dekomposisi', 'Pengenalan Pola', 'Abstraksi', 'Algoritma'],
    correctIndex: 2,
    explanation: 'Abstraksi adalah pilar berpikir komputasional yang fokus pada prinsip inti esensial dan mengeliminasi detail yang tidak relevan dengan tujuan pemecahan masalah.',
    points: 25
  },
  {
    id: 'q_10_3',
    grade: '10',
    topic: 'Jaringan Dasar',
    question: 'Topologi jaringan di mana semua komputer terhubung ke satu perangkat pusat berupa Switch atau Hub dinamakan topologi...',
    options: ['Topologi Bus', 'Topologi Star (Bintang)', 'Topologi Ring (Cincin)', 'Topologi Mesh'],
    correctIndex: 1,
    explanation: 'Topologi Star menghubungkan semua node client secara terpusat ke Switch. Jika satu kabel PC putus, komputer lain tetap dapat berkomunikasi dengan lancar.',
    points: 25
  },
  {
    id: 'q_10_4',
    grade: '10',
    topic: 'Sistem Komputer',
    question: 'Mengapa RAM disebut sebagai memori volatile?',
    options: [
      'Karena kecepatannya lebih lambat daripada hard disk',
      'Karena data di dalamnya akan hilang ketika sumber daya listrik padam',
      'Karena tidak dapat dibaca oleh sistem operasi',
      'Karena hanya dapat menyimpan file teks'
    ],
    correctIndex: 1,
    explanation: 'Volatile berarti memori membutuhkan aliran daya listrik terus-menerus untuk menjaga data. Begitu komputer dimatikan, isi memori RAM langsung terhapus.',
    points: 25
  },

  // Kelas 11
  {
    id: 'q_11_1',
    grade: '11',
    topic: 'Jaringan Komputer & Subnetting',
    question: 'Sebuah jaringan laboratorium TIK memiliki subnet mask 255.255.255.192 (/26). Berapakah jumlah host IP valid yang dapat digunakan oleh komputer siswa?',
    options: ['64 host', '62 host', '30 host', '126 host'],
    correctIndex: 1,
    explanation: 'Pada prefix /26, sisa bit host adalah 32 - 26 = 6 bit. Jumlah kombinasi adalah 2^6 = 64. Dikurangi 2 untuk Network ID dan Broadcast ID, maka host yang valid adalah 62 host.',
    points: 25
  },
  {
    id: 'q_11_2',
    grade: '11',
    topic: 'Model OSI & Protokol',
    question: 'Perangkat jaringan yang bekerja pada Layer 3 (Network Layer) dalam model OSI dan bertugas menentukan rute terbaik (routing) antar jaringan berbeda adalah...',
    options: ['Repeater', 'Switch Layer 2', 'Router', 'Hub'],
    correctIndex: 2,
    explanation: 'Router beroperasi di Layer 3 (Network) dengan membaca alamat logika IP untuk meneruskan paket data ke subnet/jaringan lain melalui proses routing.',
    points: 25
  },
  {
    id: 'q_11_3',
    grade: '11',
    topic: 'Pemrograman Python',
    question: 'Di bahasa pemrograman Python, struktur data yang bersifat ordered dan immutable (tidak dapat diubah setelah dibuat) adalah...',
    options: ['List []', 'Dictionary {}', 'Tuple ()', 'Set {}'],
    correctIndex: 2,
    explanation: 'Tuple didefinisikan menggunakan tanda kurung () dan bersifat immutable, artinya elemen di dalamnya tidak dapat ditambah, dihapus, atau diubah setelah instansiasi.',
    points: 25
  },
  {
    id: 'q_11_4',
    grade: '11',
    topic: 'Keamanan Siber',
    question: 'Protokol pengamanan komunikasi web yang menggunakan enkripsi TLS/SSL melalui port 443 adalah...',
    options: ['HTTP', 'HTTPS', 'FTP', 'Telnet'],
    correctIndex: 1,
    explanation: 'HTTPS (Hypertext Transfer Protocol Secure) mengenkripsi seluruh pertukaran data antara browser siswa dan web server menggunakan enkripsi TLS pada default port 443.',
    points: 25
  },

  // Kelas 12
  {
    id: 'q_12_1',
    grade: '12',
    topic: 'Cloud Computing',
    question: 'Model layanan cloud computing yang menyediakan lingkungan siap pakai bagi developer untuk men-deploy aplikasi tanpa memikirkan OS atau server fisik disebut...',
    options: ['Infrastructure as a Service (IaaS)', 'Platform as a Service (PaaS)', 'Software as a Service (SaaS)', 'On-Premise Bare Metal'],
    correctIndex: 1,
    explanation: 'PaaS (Platform as a Service) menyediakan runtime environment, basis data, dan server terkelola sehingga pengembang cukup mengunggah kode aplikasi saja.',
    points: 25
  },
  {
    id: 'q_12_2',
    grade: '12',
    topic: 'Database Relasional',
    question: 'Perintah SQL yang digunakan untuk mengambil data dari tabel dengan menyaring baris berdasarkan kriteria tertentu adalah gabungan klausul...',
    options: ['INSERT INTO ... VALUES', 'SELECT ... FROM ... WHERE', 'UPDATE ... SET ... IN', 'DROP TABLE ... CASCADE'],
    correctIndex: 1,
    explanation: 'SELECT menentukan kolom yang diambil, FROM menentukan nama tabel sumber, dan WHERE menyaring data sesuai kondisi spesifik yang diminta.',
    points: 25
  },
  {
    id: 'q_12_3',
    grade: '12',
    topic: 'Kriptografi',
    question: 'Pada sistem kriptografi kunci asimetris (Public-Key Cryptography), kunci yang digunakan untuk mendekripsi pesan rahasia yang telah dienkripsi dengan kunci publik adalah...',
    options: ['Kunci Publik pengirim', 'Kunci Privat penerima', 'Shared Secret Key', 'Kunci Hash MD5'],
    correctIndex: 1,
    explanation: 'Pesan yang dienkripsi menggunakan Public Key penerima hanya dapat didekripsi menggunakan Private Key penerima yang disimpan secara rahasia.',
    points: 25
  },
  {
    id: 'q_12_4',
    grade: '12',
    topic: 'Etika & Regulasi Siber',
    question: 'Peraturan perundangan di Indonesia yang mengatur tentang informasi, transaksi elektronik, serta sanksi pidana kejahatan siber (cybercrime) adalah...',
    options: ['UU Hak Cipta No. 28', 'UU ITE (Informasi dan Transaksi Elektronik)', 'UU Ketenagakerjaan', 'UU Telekomunikasi'],
    correctIndex: 1,
    explanation: 'UU ITE (Undang-Undang Informasi dan Transaksi Elektronik) adalah payung hukum di Indonesia yang mengatur aspek hukum digital dan penegakan kejahatan siber.',
    points: 25
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_07_01',
    grade: '7',
    title: 'Praktikum Konversi Sistem Bilangan Biner, Oktal & Heksadesimal',
    topic: 'Sistem Bilangan & Bit Register (SK)',
    deadline: '2026-10-24 23:59',
    totalPoints: 100,
    instructions: '1. Gunakan Simulator Konverter Biner belajarBarengSitty untuk menguji saklar bit biner.\n2. Lakukan konversi bilangan desimal tanggal lahir Anda ke Biner, Oktal, dan Heksadesimal menggunakan metode sisa pembagian (modulo).\n3. Tuliskan langkah pembagian bertingkat beserta pembacaan sisa dari bawah ke atas dan lampirkan hasil ringkasan.',
    rubric: [
      { criteria: 'Kebenaran hasil konversi ke 3 basis', maxScore: 40 },
      { criteria: 'Kelengkapan alur langkah pembagian modulo', maxScore: 35 },
      { criteria: 'Kerapian dokumentasi tugas', maxScore: 25 }
    ]
  },
  {
    id: 'asg_08_01',
    grade: '8',
    title: 'Eksplorasi Simulasi Operasi Stack & Evaluasi Notasi Postfix',
    topic: 'Struktur Data Stack & LIFO (AD)',
    deadline: '2026-10-26 23:59',
    totalPoints: 100,
    instructions: '1. Buka Simulator Stack belajarBarengSitty dan lakukan operasi bertahap: Push 4 elemen angka, lakukan Pop 2 kali, dan catat kondisi TOP serta status isEmpty().\n2. Uji evaluasi ekspresi aritmatika Postfix: "12 4 / 3 + 2 *" pada simulator perhitungan stack.\n3. Catat isi stack pada setiap token operator dan jelaskan mengapa prinsip LIFO sangat penting dalam komputasi.',
    rubric: [
      { criteria: 'Simulasi operasi Push/Pop & status TOP', maxScore: 35 },
      { criteria: 'Alur evaluasi ekspresi Postfix tepat', maxScore: 45 },
      { criteria: 'Kesimpulan prinsip LIFO dan kerapian laporan', maxScore: 20 }
    ]
  },
  {
    id: 'asg_10_01',
    grade: '10',
    title: 'Praktikum Analisis Spesifikasi Komputer & Perakitan Hardware',
    topic: 'Sistem Komputer (SK)',
    deadline: '2026-10-25 23:59',
    totalPoints: 100,
    instructions: '1. Amati spesifikasi komputer laboratorium atau perangkat laptop Anda.\n2. Tuliskan jenis CPU, soket, kapasitas RAM (DDR4/DDR5), dan media penyimpanan (SSD NVMe vs HDD).\n3. Jelaskan fungsi dari setiap port I/O pada motherboard dalam format laporan PDF ringkas atau tautan dokumen.',
    rubric: [
      { criteria: 'Kelengkapan identifikasi komponen', maxScore: 40 },
      { criteria: 'Ketepatan penjelasan alur bus data', maxScore: 35 },
      { criteria: 'Kerapian format & tata bahasa', maxScore: 25 }
    ]
  },
  {
    id: 'asg_11_01',
    grade: '11',
    title: 'Simulasi Lab: Perancangan Topologi Star & Uji Ping Subnetting',
    topic: 'Jaringan Komputer & Internet (JKI)',
    deadline: '2026-10-20 23:59',
    totalPoints: 100,
    instructions: 'Gunakan Simulator Jaringan Komputer interaktif belajarBarengSitty:\n1. Bangun topologi star minimal 3 PC + 1 Switch + 1 Web Server.\n2. Atur alamat IP segmen 192.168.10.0/24 untuk semua node.\n3. Lakukan pengujian ping ICMP dari PC-1 ke Server hingga status berhasil (Echo Reply).\n4. Lampirkan tangkapan layar/hasil konfigurasi dan log ping terminal.',
    rubric: [
      { criteria: 'Topologi terhubung dengan benar', maxScore: 30 },
      { criteria: 'Konfigurasi IP & Netmask tepat', maxScore: 40 },
      { criteria: 'Hasil ICMP Ping Sukses & Dokumentasi', maxScore: 30 }
    ]
  },
  {
    id: 'asg_12_01',
    grade: '12',
    title: 'Desain Arsitektur Cloud & Skema Keamanan Database',
    topic: 'Cloud Computing & Keamanan Siber',
    deadline: '2026-10-28 23:59',
    totalPoints: 100,
    instructions: 'Rancanglah diagram arsitektur aplikasi berbasis cloud untuk sistem portal sekolah SMA:\n1. Tentukan pemisahan Web Server, Application Server, dan Database Server.\n2. Berikan mekanisme keamanan firewall, enkripsi data in-transit (HTTPS/TLS) dan data at-rest (AES).\n3. Kumpulkan diagram dan deskripsi analisis.',
    rubric: [
      { criteria: 'Kelayakan desain arsitektur cloud', maxScore: 40 },
      { criteria: 'Strategi keamanan & enkripsi data', maxScore: 40 },
      { criteria: 'Analisis potensi ancaman & mitigasi', maxScore: 20 }
    ]
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub_001',
    assignmentId: 'asg_11_01',
    studentId: 'usr_student_02',
    studentName: 'Bunga Citra Lestari',
    studentGrade: '11',
    submittedAt: '2026-10-13 14:15',
    fileOrUrl: 'https://drive.google.com/file/d/bunga-lab-jaringan-topologi.pdf',
    notes: 'Saya telah menyelesaikan konfigurasi Topologi Star dengan IP 192.168.10.10 sampai 192.168.10.12. Uji ping 0% loss.',
    status: 'graded',
    score: 95,
    feedback: 'Kerja sangat bagus Bunga! Penataan kabel rapi dan penjelasan subnetting sangat runtut.',
    gradedAt: '2026-10-13 15:30'
  },
  {
    id: 'sub_002',
    assignmentId: 'asg_11_01',
    studentId: 'usr_student_03',
    studentName: 'Dimas Anggara',
    studentGrade: '11',
    submittedAt: '2026-10-13 16:42',
    fileOrUrl: 'https://github.com/dimas-dev/tik-sma-lab-topology',
    notes: 'Hasil lab jaringan kelas 11. Sudah mencoba ping antar 3 PC dan server web.',
    status: 'pending'
  },
  {
    id: 'sub_003',
    assignmentId: 'asg_10_01',
    studentId: 'usr_student_04',
    studentName: 'Nadia Salsabila',
    studentGrade: '10',
    submittedAt: '2026-10-13 17:05',
    fileOrUrl: 'https://drive.google.com/file/d/nadia-hardware-spec-kelas10.pdf',
    notes: 'Laporan perakitan komputer kelas 10. Mengamati motherboard ASUS Pro Z790.',
    status: 'pending'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    title: 'Pengumpulan Tugas Baru Masuk',
    message: 'Nadia Salsabila (Kelas 10) baru saja mengumpulkan tugas "Praktikum Analisis Spesifikasi Komputer".',
    timestamp: '17:05 WIB',
    type: 'submission',
    read: false,
    meta: {
      assignmentId: 'asg_10_01',
      studentName: 'Nadia Salsabila'
    }
  },
  {
    id: 'notif_02',
    title: 'Pengumpulan Tugas Baru Masuk',
    message: 'Dimas Anggara (Kelas 11) baru saja mengumpulkan tugas "Simulasi Lab: Perancangan Topologi Star".',
    timestamp: '16:42 WIB',
    type: 'submission',
    read: false,
    meta: {
      assignmentId: 'asg_11_01',
      studentName: 'Dimas Anggara'
    }
  },
  {
    id: 'notif_03',
    title: 'Nilai Tugas Telah Diterbitkan',
    message: 'Ibu Siti Salamanah telah menilai tugas "Simulasi Lab: Perancangan Topologi Star" milik Bunga Citra Lestari (Skor: 95/100).',
    timestamp: '15:30 WIB',
    type: 'grade',
    read: true,
    meta: {
      assignmentId: 'asg_11_01',
      score: 95
    }
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    id: 'usr_lead_01',
    name: 'Siti Sarah Fadillah',
    grade: '12',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    xp: 2850,
    streakDays: 14,
    quizzesCompleted: 12,
    tasksCompleted: 8,
    badgeCount: 6
  },
  {
    rank: 2,
    id: 'usr_lead_02',
    name: 'Fajar Nugraha',
    grade: '11',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    xp: 2420,
    streakDays: 11,
    quizzesCompleted: 10,
    tasksCompleted: 7,
    badgeCount: 5
  },
  {
    rank: 3,
    id: 'usr_student_01',
    name: 'Ahmad Rizky Pratama',
    grade: '11',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    xp: 2150,
    streakDays: 7,
    quizzesCompleted: 9,
    tasksCompleted: 6,
    badgeCount: 4
  },
  {
    rank: 4,
    id: 'usr_lead_04',
    name: 'Bunga Citra Lestari',
    grade: '11',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    xp: 1980,
    streakDays: 6,
    quizzesCompleted: 8,
    tasksCompleted: 6,
    badgeCount: 4
  },
  {
    rank: 5,
    id: 'usr_lead_05',
    name: 'Kevin Jonathan',
    grade: '10',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    xp: 1750,
    streakDays: 8,
    quizzesCompleted: 7,
    tasksCompleted: 5,
    badgeCount: 3
  },
  {
    rank: 6,
    id: 'usr_lead_06',
    name: 'Nadia Salsabila',
    grade: '10',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    xp: 1620,
    streakDays: 5,
    quizzesCompleted: 6,
    tasksCompleted: 4,
    badgeCount: 3
  },
  {
    rank: 7,
    id: 'usr_lead_07',
    name: 'Rian Saputra',
    grade: '12',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    xp: 1540,
    streakDays: 4,
    quizzesCompleted: 6,
    tasksCompleted: 5,
    badgeCount: 3
  },
  {
    rank: 8,
    id: 'usr_lead_08',
    name: 'Alif Danendra',
    grade: '8',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    xp: 1480,
    streakDays: 9,
    quizzesCompleted: 8,
    tasksCompleted: 5,
    badgeCount: 4
  },
  {
    rank: 9,
    id: 'usr_lead_09',
    name: 'Kirana Putri Dewi',
    grade: '7',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    xp: 1390,
    streakDays: 12,
    quizzesCompleted: 7,
    tasksCompleted: 4,
    badgeCount: 4
  }
];

export const INITIAL_FORUM_THREADS: ForumThread[] = [
  {
    id: 'thread_01',
    title: 'Bagaimana cara menentukan Network ID dan Broadcast ID pada subnet mask /27?',
    grade: '11',
    topic: 'Jaringan Komputer',
    authorName: 'Dimas Anggara',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    authorRole: 'siswa',
    timestamp: '2 jam yang lalu',
    content: 'Saya masih sedikit bingung saat menghitung subnetting dengan prefix /27. Nilai kelipatannya berapa ya teman-teman, dan bagaimana cara cepat membagi blok subnetnya?',
    tags: ['Subnetting', 'IPv4', 'CIDR'],
    upvotes: 14,
    solved: true,
    replies: [
      {
        id: 'rep_01',
        authorName: 'Ibu Siti Salamanah, S.Kom., Gr.',
        authorRole: 'guru',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        timestamp: '1 jam yang lalu',
        content: 'Halo Dimas! Untuk /27, ada 3 bit subnet yang dipinjam di oktet terakhir. Nilai subnet mask-nya adalah 255.255.255.224. Rumus kelipatan blok: 256 - 224 = 32. Jadi blok subnetnya: 0, 32, 64, 96, dst. Untuk blok pertama (0): Network ID = .0, Range Host = .1 s/d .30, dan Broadcast ID = .31.',
        isTeacherAnswer: true
      },
      {
        id: 'rep_02',
        authorName: 'Bunga Citra Lestari',
        authorRole: 'siswa',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        timestamp: '45 menit yang lalu',
        content: 'Bisa juga dicoba langsung di Simulator Jaringan di tab atas Dimas! Sangat membantu visualisasinya saat kita isi IP dan jalankan ping.'
      }
    ]
  },
  {
    id: 'thread_02',
    title: 'Perbedaan utama antara SSD M.2 NVMe dengan SSD SATA biasa untuk performa komputasi?',
    grade: '10',
    topic: 'Sistem Komputer',
    authorName: 'Kevin Jonathan',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    authorRole: 'siswa',
    timestamp: '5 jam yang lalu',
    content: 'Apakah perbedaannya hanya di bentuk fisiknya atau ada pengaruh signifikan pada kecepatan transfer data (read/write speed) dan latensi bus?',
    tags: ['Hardware', 'SSD NVMe', 'Motherboard'],
    upvotes: 9,
    replies: [
      {
        id: 'rep_03',
        authorName: 'Ahmad Rizky Pratama',
        authorRole: 'siswa',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        timestamp: '4 jam yang lalu',
        content: 'Perbedaannya sangat signifikan Kevin! SSD SATA dibatasi oleh interface SATA III maksimal ~550 MB/s. Sedangkan M.2 NVMe memanfaatkan jalur PCIe x4 langsung ke CPU, kecepatannya bisa tembus 3500 s/d 7000+ MB/s di PCIe 4.0/5.0.'
      }
    ]
  },
  {
    id: 'thread_03',
    title: 'Tips memahami enkripsi kunci Asimetris (RSA) vs Simetris (AES) untuk ujian',
    grade: '12',
    topic: 'Keamanan Siber',
    authorName: 'Siti Sarah Fadillah',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    authorRole: 'siswa',
    timestamp: 'Kemarin',
    content: 'Untuk teman-teman kelas 12, analogi mudahnya: Simetris itu seperti 1 gembok dengan kunci duplikat yang sama. Sedangkan Asimetris itu seperti kotak pos: siapa saja bisa memasukkan surat lewat lubang (kunci publik), tapi hanya pemilik kotak yang punya kunci untuk membukanya (kunci privat).',
    tags: ['Kriptografi', 'Keamanan Data', 'Ujian Sekolah'],
    upvotes: 21,
    replies: []
  }
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'ch_umum': [
    {
      id: 'msg_01',
      channelId: 'ch_umum',
      authorName: 'Ibu Siti Salamanah',
      role: 'guru',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      timestamp: '08:30 WIB',
      text: 'Selamat pagi anak-anak! Jangan lupa untuk mencoba Simulator Jaringan Komputer interaktif untuk materi subnetting dan routing hari ini ya.'
    },
    {
      id: 'msg_02',
      channelId: 'ch_umum',
      authorName: 'Ahmad Rizky',
      role: 'siswa',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      timestamp: '08:35 WIB',
      text: 'Siap Bu Siti! Sudah mencoba simulasi kirim paket ping dari PC-1 ke Server, visualisasi alur paketnya sangat jelas!'
    },
    {
      id: 'msg_03',
      channelId: 'ch_umum',
      authorName: 'Bunga Citra',
      role: 'siswa',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      timestamp: '08:42 WIB',
      text: 'Halo teman-teman, siapa yang mau kolaborasi bareng untuk tugas lab jaringan topologi star?'
    }
  ],
  'ch_kelompok_jaringan': [
    {
      id: 'msg_kj_01',
      channelId: 'ch_kelompok_jaringan',
      authorName: 'Dimas Anggara',
      role: 'siswa',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      timestamp: '10:15 WIB',
      text: 'Teman-teman kelompok 1, kita tentukan pembagian IP untuk 3 PC ya. Saya sarankan pakai format ini:',
      codeSnippet: 'PC-1: 192.168.10.10 / 255.255.255.0\nPC-2: 192.168.10.11 / 255.255.255.0\nServer: 192.168.10.254 / 255.255.255.0'
    },
    {
      id: 'msg_kj_02',
      channelId: 'ch_kelompok_jaringan',
      authorName: 'Ahmad Rizky',
      role: 'siswa',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      timestamp: '10:20 WIB',
      text: 'Setuju Dimas! Saya buatkan laporan diagramnya dan tes ICMP Echo Request lewat simulator.'
    }
  ],
  'ch_koding': [
    {
      id: 'msg_kd_01',
      channelId: 'ch_koding',
      authorName: 'Fajar Nugraha',
      role: 'siswa',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      timestamp: 'Kemarin',
      text: 'Ada yang punya tips membuat fungsi rekursif sederhana di Python untuk menghitung faktorial?',
      codeSnippet: 'def faktorial(n):\n    if n <= 1:\n        return 1\n    return n * faktorial(n - 1)\n\nprint(faktorial(5)) # Output: 120'
    }
  ]
};

// Preset Topologies for Interactive Network Simulator
export const LAB_PRESETS = [
  {
    id: 'preset_star',
    name: 'Lab 1: Topologi Bintang (Star) dengan Switch',
    grade: '11',
    description: '3 Komputer Siswa terhubung ke sebuah Switch sentral dan 1 Web Server dalam subnet yang sama (192.168.1.0/24).',
    devices: [
      { id: 'dev_sw1', type: 'switch', name: 'Switch-Core', x: 380, y: 190, ip: '192.168.1.2', subnetMask: '255.255.255.0', gateway: '192.168.1.1', mac: '00:1A:2B:3C:4D:01', status: 'online' },
      { id: 'dev_pc1', type: 'pc', name: 'PC-01 (Lab TIK)', x: 120, y: 80, ip: '192.168.1.10', subnetMask: '255.255.255.0', gateway: '192.168.1.1', mac: '00:1A:2B:3C:4D:10', status: 'online' },
      { id: 'dev_pc2', type: 'pc', name: 'PC-02 (Lab TIK)', x: 120, y: 280, ip: '192.168.1.11', subnetMask: '255.255.255.0', gateway: '192.168.1.1', mac: '00:1A:2B:3C:4D:11', status: 'online' },
      { id: 'dev_srv', type: 'server', name: 'Web Server Sekolah', x: 640, y: 100, ip: '192.168.1.100', subnetMask: '255.255.255.0', gateway: '192.168.1.1', mac: '00:1A:2B:3C:4D:99', status: 'online' },
      { id: 'dev_laptop', type: 'laptop', name: 'Laptop Guru (Sitty)', x: 640, y: 280, ip: '192.168.1.20', subnetMask: '255.255.255.0', gateway: '192.168.1.1', mac: '00:1A:2B:3C:4D:20', status: 'online' }
    ] as NetworkDevice[],
    cables: [
      { id: 'cab_1', fromId: 'dev_pc1', toId: 'dev_sw1', status: 'connected' },
      { id: 'cab_2', fromId: 'dev_pc2', toId: 'dev_sw1', status: 'connected' },
      { id: 'cab_3', fromId: 'dev_srv', toId: 'dev_sw1', status: 'connected' },
      { id: 'cab_4', fromId: 'dev_laptop', toId: 'dev_sw1', status: 'connected' }
    ] as NetworkCable[]
  },
  {
    id: 'preset_routing',
    name: 'Lab 2: Routing 2 Subnet Berbeda dengan Router',
    grade: '11',
    description: 'Dua subnet berbeda (Subnet A: 192.168.1.0/24 dan Subnet B: 192.168.2.0/24) dihubungkan melalui sebuah Router Gateway.',
    devices: [
      { id: 'dev_rt1', type: 'router', name: 'Router-Gateway', x: 380, y: 190, ip: '192.168.1.1', subnetMask: '255.255.255.0', gateway: '0.0.0.0', mac: '00:1A:2B:AA:00:01', status: 'online' },
      { id: 'dev_pc_a', type: 'pc', name: 'PC Subnet-A', x: 140, y: 190, ip: '192.168.1.10', subnetMask: '255.255.255.0', gateway: '192.168.1.1', mac: '00:1A:2B:AA:00:10', status: 'online' },
      { id: 'dev_pc_b', type: 'pc', name: 'PC Subnet-B', x: 640, y: 190, ip: '192.168.2.10', subnetMask: '255.255.255.0', gateway: '192.168.2.1', mac: '00:1A:2B:BB:00:10', status: 'online' }
    ] as NetworkDevice[],
    cables: [
      { id: 'cab_r1', fromId: 'dev_pc_a', toId: 'dev_rt1', status: 'connected' },
      { id: 'cab_r2', fromId: 'dev_pc_b', toId: 'dev_rt1', status: 'connected' }
    ] as NetworkCable[]
  },
  {
    id: 'preset_p2p',
    name: 'Lab 3: Jaringan Peer-to-Peer Sederhana',
    grade: '10',
    description: '2 Komputer PC terhubung langsung dengan kabel Ethernet cross-over tanpa switch perantara.',
    devices: [
      { id: 'dev_p2p_1', type: 'pc', name: 'PC Siswa A', x: 220, y: 190, ip: '192.168.1.1', subnetMask: '255.255.255.0', gateway: '192.168.1.1', mac: '00:1A:11:11:11:11', status: 'online' },
      { id: 'dev_p2p_2', type: 'laptop', name: 'Laptop Siswa B', x: 560, y: 190, ip: '192.168.1.2', subnetMask: '255.255.255.0', gateway: '192.168.1.1', mac: '00:1A:22:22:22:22', status: 'online' }
    ] as NetworkDevice[],
    cables: [
      { id: 'cab_p2p', fromId: 'dev_p2p_1', toId: 'dev_p2p_2', status: 'connected' }
    ] as NetworkCable[]
  }
];
