import React from 'react';
import { AuditLog } from '../../types';
import { getRelativeTimeBengali } from '../../lib/dateUtils';
import { History, Shield } from 'lucide-react';

interface AdminAuditLogProps {
  logs: AuditLog[];
}

export const AdminAuditLog: React.FC<AdminAuditLogProps> = ({ logs }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 border border-stone-200">
        <div className="flex items-center gap-2 mb-1">
          <History className="w-5 h-5 text-red-600" />
          <h1 className="text-xl font-bold font-bengali-serif text-stone-900">
            সম্পাদকীয় অডিট ও নিরাপত্তা লগ
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          প্রশাসক ও সম্পাদকীয় কর্মকর্তাদের সাম্প্রতিক সকল কার্যক্রমের তালিকা
        </p>
      </div>

      <div className="bg-white border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200 text-xs font-bold text-stone-700">
          মোট রেকর্ড: {logs.length.toLocaleString('bn-BD')} টি
        </div>

        <div className="divide-y divide-stone-200">
          {logs.map((log) => (
            <div key={log.id} className="p-4 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-stone-400" />
                  <span>{log.action}</span>
                </div>
                {log.details && (
                  <p className="text-stone-600 text-[11px]">{log.details}</p>
                )}
                <div className="text-[10px] text-stone-400 font-sans">
                  সম্পাদনাকারী: <strong className="text-stone-700">{log.user}</strong>
                </div>
              </div>

              <span className="text-[11px] text-stone-500 font-mono shrink-0">
                {getRelativeTimeBengali(log.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
