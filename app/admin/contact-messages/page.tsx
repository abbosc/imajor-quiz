'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/admin/contact-messages');
      if (!response.ok) throw new Error('Failed to fetch messages');
      const { data } = await response.json();
      setMessages(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, is_read: boolean) => {
    try {
      await fetch('/api/admin/contact-messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_read }),
      });
      setMessages(messages.map(m => m.id === id ? { ...m, is_read } : m));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read });
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await fetch(`/api/admin/contact-messages?id=${id}`, { method: 'DELETE' });
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B4A]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Contact Messages</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-[#64748B] mt-1">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
          )}
        </div>
        <span className="text-sm sm:text-base text-[#64748B]">{messages.length} total</span>
      </div>

      {messages.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.is_read) markAsRead(message.id, true);
                }}
                className={`bg-white rounded-xl border border-[#E2E8F0] p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedMessage?.id === message.id ? 'ring-2 ring-[#FF6B4A]' : ''
                } ${!message.is_read ? 'border-l-4 border-l-[#FF6B4A]' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#0F172A] truncate">{message.name}</h3>
                      {!message.is_read && (
                        <span className="w-2 h-2 bg-[#FF6B4A] rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-[#64748B] truncate">{message.email}</p>
                  </div>
                  <span className="text-xs text-[#94A3B8] whitespace-nowrap ml-2">
                    {formatDate(message.created_at)}
                  </span>
                </div>
                <p className="text-sm text-[#64748B] line-clamp-2">{message.message}</p>
              </div>
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:sticky lg:top-6 h-fit">
            {selectedMessage ? (
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#0F172A]">{selectedMessage.name}</h3>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-[#FF6B4A] hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-[#94A3B8] mb-4">{formatDate(selectedMessage.created_at)}</p>
                <div className="bg-[#F8FAFC] rounded-xl p-4">
                  <p className="text-[#0F172A] whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: iMajor Contact Form`}
                    className="flex-1 py-2 px-4 rounded-xl font-medium text-white gradient-accent hover:shadow-lg text-center transition-all"
                  >
                    Reply via Email
                  </a>
                  <button
                    onClick={() => markAsRead(selectedMessage.id, !selectedMessage.is_read)}
                    className="py-2 px-4 rounded-xl font-medium border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                  >
                    Mark as {selectedMessage.is_read ? 'Unread' : 'Read'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 text-center text-[#64748B]">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p>Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <p className="text-[#64748B] text-center py-8">No contact messages yet</p>
        </div>
      )}
    </AdminLayout>
  );
}
