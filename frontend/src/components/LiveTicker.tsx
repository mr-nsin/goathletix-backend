import React, { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Activity, Bell } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface ActivityLog {
  id: string;
  userDisplayName?: string;
  actionType: string;
  targetName: string;
  createdAt: string;
}

export function LiveTicker() {
  const socket = useSocket();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_activity', (activity: ActivityLog) => {
      setActivities((prev) => [activity, ...prev].slice(0, 10)); // keep last 10
      setCurrentIndex(0);
    });

    return () => {
      socket.off('new_activity');
    };
  }, [socket]);

  // Rotate through activities if we have multiple
  useEffect(() => {
    if (activities.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activities.length]);

  if (activities.length === 0) return null;

  const currentActivity = activities[currentIndex];

  const getActionText = (actionType: string) => {
    switch (actionType) {
      case 'calendar_add': return 'added to their calendar';
      case 'follow': return 'followed';
      case 'save': return 'saved';
      default: return 'interacted with';
    }
  };

  return (
    <div className="w-full bg-[#1e2b66] text-white text-xs py-2 px-6 flex justify-center items-center shadow-inner relative z-50">
      <div className="flex items-center gap-3 overflow-hidden max-w-5xl w-full">
        <span className="flex items-center gap-2 font-bold text-[#37DAC3] uppercase tracking-widest shrink-0 font-mono text-[10px]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#37DAC3]"></span>
          </span>
          Live Activity
        </span>

        <div className="h-4 flex-1 relative overflow-hidden flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentActivity.id + currentIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute left-0 right-0 flex items-center gap-1.5 text-indigo-100 truncate font-mono text-[11px]"
            >
              <Bell className="w-3 h-3 text-indigo-300 shrink-0" />
              <span className="font-bold text-white uppercase tracking-wider">{currentActivity.userDisplayName || 'Someone'}</span>
              <span>{getActionText(currentActivity.actionType)}</span>
              <span className="font-bold text-[#37DAC3] truncate tracking-wider">{currentActivity.targetName}</span>
              <span className="text-indigo-300/70 ml-3 shrink-0 text-[10px]">
                {new Date(currentActivity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
