import { Task, TeamMember, MeetingNote, FollowUpItem } from './types';

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'J. Doe',
    initials: 'JD',
    role: 'IoT',
    load: 'Optimal',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP_aTwz6_oPpfU3_f3I-lmfT4_fVsxnlyWpQTXqPUKKnjxJAZmF09Bm7G15JmR9G5vw_0V7MEdZW72oXgAeByI_DyoKIylpofvqJxF-dbA1q55hB1BZAqHMyKLivWwZT8KsBTw6qoVmz81sWSy_fEM3bRM0chvPFy-4J6nd2jLrHwvnRDjShHA-UKy9p3x2IRfogEs98m_3k83EFeCNQbTTBbk2lukgd1XQaqCggNYvPD-n5WHjK4HFdVWt78UFZo3bPGrHXThnK2h'
  },
  {
    id: '2',
    name: 'S. Smith',
    initials: 'SS',
    role: 'IoT',
    load: 'Optimal',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfu1Sd8mIg38e8fUMAUFQyfcJl90JgcwDUyCnJi3fRvG0Zcfk9tqpxWl4fiDUTxHsJrMzlxzueEbOj1HjINsNLcM3C1JLcH-W1n9UbegB1XJOsWcg2R_zzHOCHUcnG9YGvykvIvcmOWwlLqBxcYemVwFAk9BHLq6F1t4XgcOCuP6bwViaFO6yGK7aNB8pbrbCQqYUiz2ggd5gnUp3yClsFK2mr7z35J6w7Aqt1a94KuyQJd0uYoYdS7N4tRxEHFjj4yMze0zZ8jP-9'
  },
  {
    id: '3',
    name: 'M. Klein',
    initials: 'MK',
    role: 'IoT',
    load: 'Beban Tinggi',
    avatarUrl: '' // Memakai inisial
  },
  {
    id: '4',
    name: 'A. Chen',
    initials: 'AC',
    role: 'Keamanan',
    load: 'Optimal',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqAGcyto3l1-iwWJNFH2VGsVAXWshLjs6JWRld-zmxZXvFFrGzJZ-buu5CbUAI034XKgqcbWJSrMd5Wu30O1e9MSPMkJbjeImjH7lem_yUIWCUw-_xrbGwnVkhiQk9WnqjZDR3IIfS7ATZAs-AWEZcbAPpDoXsb5-V8hlF620LTmCP1xDku4wDLWiw7WXuISnJkndwCwwz91QGkgiXRqyC_R-OOjCtoNrXqnbCGe78DXUEaoBsFCflBYGSoE5DcNfaHnkSpOe2cxd5'
  },
  {
    id: '5',
    name: 'Alex - IoT',
    initials: 'AL',
    role: 'IoT',
    load: 'Beban Tinggi'
  },
  {
    id: '6',
    name: 'Budi - Mobile',
    initials: 'BM',
    role: 'Mobile',
    load: 'Tersedia'
  },
  {
    id: '7',
    name: 'Citra - Mobile',
    initials: 'CM',
    role: 'Mobile',
    load: 'Tersedia'
  }
];

export const initialTasks: Task[] = [
  // --- IoT Workspace Tasks (Progress Tracker) ---
  {
    id: 'iot-1',
    title: 'Kalibrasi Sensor Tahap 1',
    description: 'Kalibrasi awal sensor suhu dan kelembapan untuk penyebaran di Zona A.',
    status: 'Belum Mulai',
    priority: 'Sedang',
    category: 'Perangkat Keras',
    assignedTo: teamMembers[0], // J. Doe
    attachmentsCount: 2,
    workspace: 'IoT'
  },
  {
    id: 'iot-2',
    title: 'Perbarui Protokol OTA',
    description: 'Optimalkan paket transmisi pembaruan firmware Over-The-Air dan aturan fallback kesalahan.',
    status: 'Belum Mulai',
    priority: 'Tinggi',
    category: 'Firmware',
    assignedTo: teamMembers[1], // S. Smith
    workspace: 'IoT'
  },
  {
    id: 'iot-3',
    title: 'Uji Konektivitas Gateway',
    description: 'Otomatiskan verifikasi protokol pengalihan cadangan Wi-Fi dan Seluler multi-node.',
    status: 'Sedang Berjalan',
    priority: 'Sedang',
    category: 'Jaringan',
    assignedTo: teamMembers[2], // M. Klein
    progress: 65,
    workspace: 'IoT'
  },
  {
    id: 'iot-4',
    title: 'Peninjauan Uji Penetrasi',
    description: 'Meninjau laporan akhir dari audit keamanan pihak ketiga pada node edge baru.',
    status: 'Pemeriksaan Akhir',
    priority: 'Tinggi',
    category: 'Keamanan',
    assignedTo: teamMembers[3], // A. Chen
    progress: 95,
    commentsCount: 4,
    workspace: 'IoT'
  },

  // --- Mobile Workspace Tasks (To Do List) ---
  {
    id: 'mob-1',
    title: 'Audit Peralatan Lapangan',
    description: 'Lakukan audit triwulanan terhadap semua sensor di Sektor 4G. Pastikan firmware diperbarui ke versi 2.4.',
    status: 'Belum Mulai',
    priority: 'Tinggi',
    category: 'Umum',
    assignedTo: teamMembers[4], // Alex - IoT
    timeString: 'Hari Ini, 14:00',
    location: 'Sektor 4G',
    workspace: 'Mobile'
  },
  {
    id: 'mob-2',
    title: 'Tinjau Log Sinkronisasi Seluler',
    description: 'Periksa log untuk kesalahan sinkronisasi offline yang dilaporkan oleh tim lapangan Alpha kemarin.',
    status: 'Belum Mulai',
    priority: 'Sedang',
    category: 'Umum',
    assignedTo: teamMembers[5], // Budi - Mobile
    overdueText: 'Terlambat 1 hari',
    workspace: 'Mobile'
  },
  {
    id: 'mob-3',
    title: 'Luncurkan Pembaruan Aplikasi Seluler',
    description: 'Kirim v1.2 ke lingkungan staging untuk pengujian QA.',
    status: 'Selesai',
    priority: 'Rendah',
    category: 'Umum',
    assignedTo: teamMembers[6], // Citra - Mobile
    timeString: 'Selesai Kemarin',
    workspace: 'Mobile'
  }
];

export const initialMeetingNotes: MeetingNote[] = [
  {
    id: 'note-1',
    title: 'Penyelarasan Eksekutif: Peta Jalan Q3 & Alokasi Sumber Daya',
    description: 'Membahas tujuan utama untuk kuartal mendatang. Sumber daya teknik akan dialihkan secara signifikan ke integrasi Departemen IoT yang baru. Pemasaran meminta anggaran tambahan untuk kampanye penawaran, menunggu persetujuan keuangan Selasa depan. Tindakan ditugaskan kepada Sarah untuk menyusun rincian awal alokasi sumber daya sebelum akhir hari...',
    dateString: 'Hari Ini, 10:00',
    tag: 'Perencanaan Q3',
    participants: [teamMembers[0], teamMembers[1], teamMembers[3]],
    attachmentsCount: 2,
    workspace: 'IoT'
  },
  {
    id: 'note-2',
    title: 'Tinjauan Sistem Desain',
    description: 'Meninjau komponen Neumorphic baru. Menyetujui pembaruan border-radius dan tema visual yang disatukan. Membahas transisi terang/gelap serta konsistensi bayangan di seluruh dasbor.',
    dateString: '9 Okt, 14:30',
    tag: 'Sinkronisasi',
    participants: [teamMembers[3], teamMembers[1]],
    workspace: 'IoT'
  },
  {
    id: 'note-3',
    title: 'Kickoff Acme Corp',
    description: 'Tahap pengumpulan persyaratan awal selesai. Area fokus utama adalah pelacakan inventaris dan pemicu status otomatis di dalam modul ERP Nexus.',
    dateString: '8 Okt, 11:00',
    tag: 'Klien',
    participants: [teamMembers[0], teamMembers[2]],
    workspace: 'IoT'
  },
  {
    id: 'note-4',
    title: 'Evaluasi Mingguan: David',
    description: 'Membahas kemajuan pada peningkatan performa model database. Terhambat oleh batasan API lama. Menyiapkan sesi kolaborasi dengan tim Infrastruktur untuk melewati ambang batas limit pemanggilan.',
    dateString: '7 Okt, 16:00',
    tag: '1-on-1',
    participants: [teamMembers[1]],
    workspace: 'IoT'
  }
];

export const initialFollowUps: FollowUpItem[] = [
  {
    id: 'fu-1',
    text: 'Selesaikan rincian alokasi sumber daya',
    dueString: 'Tenggat: Hari Ini',
    completed: false
  },
  {
    id: 'fu-2',
    text: 'Setujui anggaran pemasaran',
    dueString: 'Tenggat: 12 Okt',
    completed: false
  }
];
