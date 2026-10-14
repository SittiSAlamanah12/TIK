import React from 'react';
import { X, CheckCheck, FileText, Award, Bell, Volume2 } from 'lucide-react';
import { NotificationItem } from '../types';
import { sound } from '../utils/sound';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSimulateNewSubmission: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSimulateNewSubmission,
}) => {
  if (!isOpen) return null;

  const handleTestSound = () => {
    sound.playNotificationChime();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#0a0f1d] h-full shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col border-l border-cyan-500/30 text-white">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-sm font-mono">
              PUSAT NOTIFIKASI REAL-TIME
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestSound}
              className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer border border-transparent hover:border-cyan-500/30"
              title="Tes Bunyi Notifikasi"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Toolbar - Neatly Arranged Buttons */}
        <div className="px-5 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={onSimulateNewSubmission}
            className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1.5 active:scale-98"
          >
            <span>+ Uji Notifikasi Tugas Masuk</span>
          </button>
          <button
            onClick={onMarkAllAsRead}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
          >
            <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tandai Dibaca</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              Belum ada notifikasi baru.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 transition-colors ${
                  !notif.read ? 'bg-cyan-950/30 border-l-2 border-cyan-400' : 'bg-transparent hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 shrink-0 shadow-inner">
                    {notif.type === 'submission' && (
                      <FileText className="w-4 h-4 text-cyan-400" />
                    )}
                    {notif.type === 'grade' && (
                      <Award className="w-4 h-4 text-emerald-400" />
                    )}
                    {notif.type === 'quiz' && (
                      <CheckCheck className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-white truncate">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-cyan-400/80 shrink-0 font-mono">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 text-center font-mono">
          Notifikasi otomatis aktif saat tugas diunggah & dinilai guru.
        </div>
      </div>
    </div>
  );
};
