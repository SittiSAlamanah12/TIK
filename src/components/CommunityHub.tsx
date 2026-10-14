import React, { useState } from 'react';
import {
  GradeLevel,
  UserRole,
  ForumThread,
  ChatMessage,
  ForumReply
} from '../types';
import {
  INITIAL_FORUM_THREADS,
  INITIAL_CHAT_MESSAGES,
  CURRENT_STUDENT,
  TEACHER_PROFILE
} from '../data/mockData';
import { sound } from '../utils/sound';
import {
  MessageSquare,
  MessagesSquare,
  ThumbsUp,
  Send,
  Plus,
  CheckCircle2,
  Code,
  Hash,
  Users,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface CommunityHubProps {
  userRole: UserRole;
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({
  userRole,
  selectedGrade,
}) => {
  const [activeTab, setActiveTab] = useState<'forum' | 'chat'>('forum');

  // Forum State
  const [threads, setThreads] = useState<ForumThread[]>(INITIAL_FORUM_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState<string>(INITIAL_FORUM_THREADS[0].id);
  const [isCreatingThread, setIsCreatingThread] = useState<boolean>(false);
  const [newThreadTitle, setNewThreadTitle] = useState<string>('');
  const [newThreadContent, setNewThreadContent] = useState<string>('');
  const [newThreadTags, setNewThreadTags] = useState<string>('Jaringan, Subnetting');
  const [replyInput, setReplyInput] = useState<string>('');

  // Chat State
  const [chatChannels] = useState<{ id: string; name: string; desc: string }[]>([
    { id: 'ch_umum', name: 'umum-diskusi-tik', desc: 'Diskusi umum seluruh kelas TIK' },
    { id: 'ch_kelompok_jaringan', name: 'kelompok-1-lab-jaringan', desc: 'Kolaborasi praktikum topologi & IP' },
    { id: 'ch_koding', name: 'bantuan-koding-python', desc: 'Tanya jawab algoritma & kode program' },
  ]);
  const [activeChannelId, setActiveChannelId] = useState<string>('ch_kelompok_jaringan');
  const [channelMessages, setChannelMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_MESSAGES);
  const [chatInputText, setChatInputText] = useState<string>('');
  const [showCodeSnippetInput, setShowCodeSnippetInput] = useState<boolean>(false);
  const [codeSnippetText, setCodeSnippetText] = useState<string>('');

  const currentThread = threads.find((t) => t.id === selectedThreadId) || threads[0];
  const currentMessages = channelMessages[activeChannelId] || [];

  // Upvote thread
  const handleUpvote = (threadId: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, upvotes: t.upvotes + 1 } : t))
    );
    sound.playSuccessChime();
  };

  // Submit new forum thread
  const handleCreateThreadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    const author = userRole === 'guru' ? TEACHER_PROFILE : CURRENT_STUDENT;
    const newThread: ForumThread = {
      id: `thread_${Date.now()}`,
      title: newThreadTitle,
      grade: selectedGrade,
      topic: 'Diskusi Praktikum',
      authorName: author.name,
      authorAvatar: author.avatar,
      authorRole: userRole,
      timestamp: 'Baru saja',
      content: newThreadContent,
      tags: newThreadTags.split(',').map((t) => t.trim()),
      upvotes: 1,
      replies: [],
    };

    setThreads((prev) => [newThread, ...prev]);
    setSelectedThreadId(newThread.id);
    setIsCreatingThread(false);
    setNewThreadTitle('');
    setNewThreadContent('');
    sound.playNotificationChime();
  };

  // Submit forum reply
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    const author = userRole === 'guru' ? TEACHER_PROFILE : CURRENT_STUDENT;
    const newReply: ForumReply = {
      id: `rep_${Date.now()}`,
      authorName: author.name,
      authorRole: userRole,
      authorAvatar: author.avatar,
      timestamp: 'Baru saja',
      content: replyInput,
      isTeacherAnswer: userRole === 'guru',
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThreadId
          ? { ...t, replies: [...t.replies, newReply] }
          : t
      )
    );

    setReplyInput('');
    sound.playNotificationChime();
  };

  // Send Chat message
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim() && !codeSnippetText.trim()) return;

    const author = userRole === 'guru' ? TEACHER_PROFILE : CURRENT_STUDENT;
    const newMsg: ChatMessage = {
      id: `cmsg_${Date.now()}`,
      channelId: activeChannelId,
      authorName: author.name,
      authorAvatar: author.avatar,
      role: userRole,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      text: chatInputText,
      codeSnippet: codeSnippetText.trim() ? codeSnippetText : undefined,
    };

    setChannelMessages((prev) => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg],
    }));

    setChatInputText('');
    setCodeSnippetText('');
    setShowCodeSnippetInput(false);
    sound.playNotificationChime();
  };

  return (
    <section id="komunitas" className="py-12 bg-[#05070e] cyber-grid border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
              <span>KOMUNITAS DISKUSI & CHAT LIVE // FORUM SMA</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Kolaborasi Kelompok TIK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ruang Diskusi & Obrolan Kelompok Siswa
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Tanyakan materi yang belum dipahami di forum terstruktur atau koordinasi tugas kelompok
              dan bagikan konfigurasi IP / snippet kode program secara real-time.
            </p>
          </div>

          {/* Tab Switcher: Forum vs Chat - Neatly Arranged Buttons */}
          <div className="inline-flex p-1 bg-slate-900/90 rounded-xl border border-slate-800 shadow-lg">
            <button
              onClick={() => setActiveTab('forum')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'forum'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Forum Diskusi Terstruktur</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ruang Chat Kelompok Live</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Structured Forum */}
        {activeTab === 'forum' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400/80">
                MENAMPILKAN PERTANYAAN & DISKUSI TIK:
              </span>
              <button
                onClick={() => setIsCreatingThread(!isCreatingThread)}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)] active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Diskusi Baru</span>
              </button>
            </div>

            {/* Create Thread Modal / Form */}
            {isCreatingThread && (
              <form
                onSubmit={handleCreateThreadSubmit}
                className="p-5 bg-slate-900/90 rounded-2xl border border-cyan-500/30 space-y-4 shadow-xl"
              >
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Tanyakan Sesuatu ke Teman & Guru</span>
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Judul Pertanyaan</label>
                    <input
                      type="text"
                      required
                      value={newThreadTitle}
                      onChange={(e) => setNewThreadTitle(e.target.value)}
                      placeholder="Contoh: Mengapa ping request timed out pada router?"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Isi Pertanyaan Lengkap</label>
                    <textarea
                      rows={3}
                      required
                      value={newThreadContent}
                      onChange={(e) => setNewThreadContent(e.target.value)}
                      placeholder="Ceritakan kendala atau konsep yang ingin Anda tanyakan..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsCreatingThread(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)] active:scale-95"
                  >
                    Terbitkan Thread
                  </button>
                </div>
              </form>
            )}

            {/* Forum Split: Thread List (5 cols) & Thread Details (7 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Thread List */}
              <div className="lg:col-span-5 space-y-3">
                {threads.map((t) => {
                  const isSelected = selectedThreadId === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedThreadId(t.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/50'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                        <span className="font-bold text-white">{t.authorName}</span>
                        <span className="font-mono text-[11px] text-slate-500">{t.timestamp}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 line-clamp-2">
                        {t.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-cyan-400 font-bold">
                            {t.replies.length} balasan
                          </span>
                          {t.solved && (
                            <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Terjawab
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpvote(t.id);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 cursor-pointer text-xs"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="font-mono font-bold tabular-nums">{t.upvotes}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Thread Detail & Replies */}
              <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-cyan-500/20 p-6 shadow-xl space-y-6">
                {/* Main Thread Content */}
                <div className="space-y-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentThread.authorAvatar}
                      alt={currentThread.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-cyan-500/30"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {currentThread.authorName}
                        </span>
                        {currentThread.authorRole === 'guru' && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                            Guru Pengampu
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {currentThread.timestamp}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {currentThread.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {currentThread.content}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentThread.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] text-cyan-300 font-mono bg-slate-950/90 border border-cyan-500/30 px-2.5 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Replies Stream */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold text-cyan-400">
                    JAWABAN & DISKUSI ({currentThread.replies.length}):
                  </h4>

                  {currentThread.replies.length === 0 ? (
                    <div className="py-6 text-center text-slate-500 text-xs">
                      Belum ada jawaban untuk pertanyaan ini. Jadilah yang pertama menjawab!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentThread.replies.map((rep) => (
                        <div
                          key={rep.id}
                          className={`p-4 rounded-2xl border text-xs space-y-2 ${
                            rep.isTeacherAnswer
                              ? 'bg-amber-950/30 border-amber-500/40'
                              : 'bg-slate-950/70 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={rep.authorAvatar}
                                alt={rep.authorName}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="font-bold text-white">
                                {rep.authorName}
                              </span>
                              {rep.isTeacherAnswer && (
                                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black">
                                  Jawaban Resmi Guru
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {rep.timestamp}
                            </span>
                          </div>
                          <p className="text-slate-300 leading-relaxed pl-8">
                            {rep.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  <form onSubmit={handleSendReply} className="pt-2 flex gap-2">
                    <input
                      type="text"
                      required
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      placeholder="Tulis balasan atau penjelasan Anda..."
                      className="flex-1 px-4 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-400 text-white placeholder-slate-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)] active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5 text-slate-950" />
                      <span>Kirim</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Live Group Chat */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 rounded-3xl border border-cyan-500/30 shadow-2xl overflow-hidden min-h-[500px]">
            {/* Left Column: Channels Sidebar (4 cols) */}
            <div className="lg:col-span-4 bg-[#0a0e1a] p-4 border-r border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs text-cyan-400 font-mono font-bold px-2">
                <span>SALURAN KELOMPOK</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>

              <div className="space-y-1.5">
                {chatChannels.map((ch) => {
                  const isActive = activeChannelId === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChannelId(ch.id)}
                      className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-2.5 border ${
                        isActive
                          ? 'bg-cyan-950/40 border-cyan-500/50 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                          : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      <Hash className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate">{ch.name}</div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">{ch.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-cyan-400 block font-mono">STATUS LIVE COMMS:</span>
                <p>Kirim pesan dan sematkan cuplikan konfigurasi IP untuk diuji bareng di simulator.</p>
              </div>
            </div>

            {/* Right Column: Chat Stream & Message Input (8 cols) */}
            <div className="lg:col-span-8 flex flex-col bg-[#070b14]">
              {/* Channel Header Bar */}
              <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white font-mono">
                    {chatChannels.find((c) => c.id === activeChannelId)?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  <span>Online & Sinkron</span>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[380px]">
                {currentMessages.map((msg) => {
                  return (
                    <div key={msg.id} className="flex items-start gap-3 text-xs">
                      <img
                        src={msg.authorAvatar}
                        alt={msg.authorName}
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{msg.authorName}</span>
                          {msg.role === 'guru' && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black">
                              Guru
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-mono">
                            {msg.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed bg-slate-900/90 p-3 rounded-2xl border border-slate-800 inline-block">
                          {msg.text}
                        </p>

                        {/* Optional Code/Config Snippet */}
                        {msg.codeSnippet && (
                          <div className="mt-2 bg-[#030712] rounded-xl p-3 border border-cyan-500/30 font-mono text-[11px] text-cyan-300 whitespace-pre-wrap shadow-inner">
                            {msg.codeSnippet}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Bar */}
              <div className="p-3.5 bg-slate-950 border-t border-slate-800 space-y-2">
                {showCodeSnippetInput && (
                  <div className="p-2.5 bg-slate-900 rounded-2xl border border-cyan-500/30">
                    <label className="text-[11px] text-cyan-300 font-mono block mb-1">
                      Sematkan Konfigurasi IP / Kode Program:
                    </label>
                    <textarea
                      rows={3}
                      value={codeSnippetText}
                      onChange={(e) => setCodeSnippetText(e.target.value)}
                      placeholder="PC-1: 192.168.1.10 / Netmask: 255.255.255.0..."
                      className="w-full bg-slate-950 text-cyan-300 font-mono text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                )}

                <form onSubmit={handleSendChatMessage} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCodeSnippetInput(!showCodeSnippetInput)}
                    className="p-2.5 text-slate-400 hover:text-cyan-400 rounded-xl hover:bg-slate-900 border border-transparent hover:border-cyan-500/30 transition-colors cursor-pointer"
                    title="Sisipkan Cuplikan Konfigurasi / Kode"
                  >
                    <Code className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    placeholder="Ketik pesan untuk kelompok belajar..."
                    className="flex-1 bg-slate-900 text-white placeholder-slate-500 px-4 py-2.5 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-400"
                  />

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)] active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5 text-slate-950" />
                    <span>Kirim</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
