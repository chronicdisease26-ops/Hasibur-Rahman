import React from 'react';
import { Comment } from '../../types';
import { NewsStore } from '../../lib/storage';
import { getRelativeTimeBengali } from '../../lib/dateUtils';
import { MessageSquare, Check, X, Trash2, AlertTriangle } from 'lucide-react';

interface AdminCommentsProps {
  comments: Comment[];
  onRefresh: () => void;
}

export const AdminComments: React.FC<AdminCommentsProps> = ({
  comments,
  onRefresh,
}) => {
  const handleStatus = (id: string, status: 'approved' | 'pending' | 'spam') => {
    NewsStore.updateCommentStatus(id, status);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি এই মন্তব্যটি স্থায়ীভাবে মুছে ফেলতে চান?')) {
      NewsStore.deleteComment(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 border border-stone-200">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="w-5 h-5 text-red-600" />
          <h1 className="text-xl font-bold font-bengali-serif text-stone-900">
            পাঠকের মন্তব্য নিয়ন্ত্রণ (Comments Moderation)
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          ওয়েবসাইটে পাঠকদের পাঠানো মন্তব্য রিভিউ ও মডারেশন করুন
        </p>
      </div>

      <div className="bg-white border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200 text-xs font-bold text-stone-700">
          সর্বমোট মন্তব্য: {comments.length.toLocaleString('bn-BD')} টি
        </div>

        {comments.length > 0 ? (
          <div className="divide-y divide-stone-200">
            {comments.map((comm) => (
              <div key={comm.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{comm.authorName}</span>
                    <span className="text-stone-400">({comm.authorEmail || 'ইমেইল নেই'})</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded font-mono ${
                        comm.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : comm.status === 'spam'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {comm.status}
                    </span>
                  </div>

                  <span className="text-[11px] text-stone-400 font-sans">
                    {getRelativeTimeBengali(comm.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-2.5 rounded border border-stone-200">
                  {comm.content}
                </p>

                <div className="flex items-center justify-end gap-2 pt-1 text-xs">
                  {comm.status !== 'approved' && (
                    <button
                      onClick={() => handleStatus(comm.id, 'approved')}
                      className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>অনুমোদন করুন</span>
                    </button>
                  )}

                  {comm.status !== 'spam' && (
                    <button
                      onClick={() => handleStatus(comm.id, 'spam')}
                      className="px-2 py-1 bg-amber-600 text-white rounded text-[11px] flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>স্প্যাম চিহ্নিত করুন</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(comm.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-stone-500">
            কোনো মন্তব্য জমা পড়েনি।
          </div>
        )}
      </div>
    </div>
  );
};
