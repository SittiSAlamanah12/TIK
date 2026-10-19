export type GradeLevel = '7' | '8' | '10' | '11' | '12';

export type UserRole = 'siswa' | 'guru';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  grade?: GradeLevel;
  avatar: string;
  xp: number;
  level: number;
  streakDays: number;
  badges: string[];
}

export interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  grade: GradeLevel;
  topic: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  keyPoints: string[];
  instructor: string;
}

export interface Concept3D {
  id: string;
  title: string;
  grade: GradeLevel;
  subtitle: string;
  image: string;
  description: string;
  hotspots: {
    id: string;
    label: string;
    x: number; // percentage
    y: number; // percentage
    details: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  grade: GradeLevel;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface Assignment {
  id: string;
  grade: GradeLevel;
  title: string;
  topic: string;
  deadline: string;
  instructions: string;
  totalPoints: number;
  rubric: {
    criteria: string;
    maxScore: number;
  }[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentGrade: GradeLevel;
  submittedAt: string;
  fileOrUrl: string;
  notes: string;
  status: 'pending' | 'graded';
  score?: number;
  feedback?: string;
  gradedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'submission' | 'grade' | 'quiz' | 'discussion';
  read: boolean;
  meta?: {
    assignmentId?: string;
    studentName?: string;
    score?: number;
  };
}

// Network Simulator Types
export type DeviceType = 'pc' | 'laptop' | 'switch' | 'router' | 'server';

export interface NetworkDevice {
  id: string;
  type: DeviceType;
  name: string;
  x: number;
  y: number;
  ip: string;
  subnetMask: string;
  gateway: string;
  dns?: string;
  mac: string;
  status: 'online' | 'offline';
}

export interface NetworkCable {
  id: string;
  fromId: string;
  toId: string;
  status: 'connected' | 'error';
}

export interface PingPacketAnimation {
  sourceId: string;
  targetId: string;
  progress: number;
  isReturn: boolean;
  path: string[];
}

export interface PingResultLog {
  timestamp: string;
  text: string;
  type: 'info' | 'success' | 'error';
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  timestamp: string;
  content: string;
  isTeacherAnswer?: boolean;
}

export interface ForumThread {
  id: string;
  title: string;
  grade: GradeLevel;
  topic: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  timestamp: string;
  content: string;
  tags: string[];
  upvotes: number;
  replies: ForumReply[];
  solved?: boolean;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  text: string;
  codeSnippet?: string;
  role?: UserRole;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  grade: GradeLevel;
  avatar: string;
  xp: number;
  streakDays: number;
  quizzesCompleted: number;
  tasksCompleted: number;
  badgeCount: number;
}
