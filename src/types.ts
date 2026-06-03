export type Priority = 'Tinggi' | 'Sedang' | 'Rendah';
export type TaskStatus = 'Belum Mulai' | 'Sedang Berjalan' | 'Pemeriksaan Akhir' | 'Selesai';
export type TaskCategory = 'Perangkat Keras' | 'Firmware' | 'Jaringan' | 'Keamanan' | 'Umum';

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string | 'IoT' | 'Mobile';
  avatarUrl?: string;
  load: 'Beban Tinggi' | 'Tersedia' | 'Optimal';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  category: TaskCategory;
  assignedTo: TeamMember;
  deadline?: string;
  timeString?: string;
  location?: string;
  attachmentsCount?: number;
  commentsCount?: number;
  progress?: number; // 0 - 100 for progress indicators
  workspace: 'IoT' | 'Mobile';
  overdueText?: string;
}

export interface MeetingNote {
  id: string;
  title: string;
  description: string;
  dateString: string;
  tag: string; // 'Q3 Planning', 'Sync', 'Client', '1-on-1' etc.
  participants: TeamMember[];
  attachmentsCount?: number;
  workspace: 'IoT' | 'Mobile';
}

export interface FollowUpItem {
  id: string;
  text: string;
  dueString: string;
  completed: boolean;
}
