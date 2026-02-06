// C:\Users\HP\reminder\src\app\admin\page.js
'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Mail, CheckCircle, Archive, Clock } from 'lucide-react';

export default function AdminPage() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);
  const [checkResult, setCheckResult] = useState(null);

  useEffect(() => {
    fetchAllReminders();
  }, []);

  const fetchAllReminders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/reminders');
      const data = await res.json();
      setReminders(data);
    } catch (error) {
      console.error('Failed to fetch all reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const restoreReminder = async (id) => {
    if (!confirm('Restore this archived reminder?')) return;
    
    try {
      const response = await fetch('/api/admin/reminders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (response.ok) {
        alert('Reminder restored!');
        fetchAllReminders();
      }
    } catch (error) {
      console.error('Failed to restore reminder:', error);
      alert('Failed to restore reminder');
    }
  };

  const triggerReminderCheck = async () => {
    try {
      setChecking(true);
      const res = await fetch('/api/check-reminders');
      const data = await res.json();
      setLastCheck(new Date().toLocaleTimeString());
      setCheckResult(data);
      
      if (data.emailsSent > 0) {
        alert(`✅ Sent ${data.emailsSent} reminder emails!`);
      } else {
        alert('No reminders to send at this time.');
      }
    } catch (error) {
      console.error('Failed to check reminders:', error);
      alert('Failed to check reminders');
    } finally {
      setChecking(false);
    }
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const active = reminders.filter(r => !r.deleted && !r.completed);
  const completed = reminders.filter(r => !r.deleted && r.completed);
  const archived = reminders.filter(r => r.deleted);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={fetchAllReminders}
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Email Reminder Control Panel */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Mail className="w-6 h-6" />
              Email Reminder System
            </h2>
            <p className="text-purple-100 mt-1">
              Automatically sends reminders 1 hour and 15 minutes before events
            </p>
            {lastCheck && (
              <p className="text-purple-200 text-sm mt-2">
                Last check: {lastCheck}
                {checkResult && ` - Checked ${checkResult.checked} reminders, sent ${checkResult.emailsSent} emails`}
              </p>
            )}
          </div>
          <button
            onClick={triggerReminderCheck}
            disabled={checking}
            className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {checking ? (
              <>
                <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Check & Send Now
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold">{reminders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold">{active.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold">{completed.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <Archive className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Archived</p>
              <p className="text-2xl font-bold">{archived.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reminders Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Active Reminders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Active ({active.length})
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {active.map(r => {
              const reminderId = r._id?.toString() || r.id;
              const alertsSent = r.alertsTriggered || [];
              return (
                <div key={reminderId} className="border border-orange-200 rounded-lg p-4 bg-orange-50/50">
                  <h3 className="font-bold">{r.title}</h3>
                  <p className="text-sm text-gray-600">{r.subject || 'No subject'}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(r.dateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {alertsSent.includes(60) && (
                      <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                        ✓ 1hr sent
                      </span>
                    )}
                    {alertsSent.includes(15) && (
                      <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                        ✓ 15min sent
                      </span>
                    )}
                    {alertsSent.length === 0 && (
                      <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600">
                        No alerts sent yet
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {active.length === 0 && (
              <p className="text-gray-500 text-center py-4">No active reminders</p>
            )}
          </div>
        </div>

        {/* Completed Reminders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Completed ({completed.length})
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {completed.map(r => {
              const reminderId = r._id?.toString() || r.id;
              return (
                <div key={reminderId} className="border border-green-200 rounded-lg p-4 bg-green-50/50">
                  <h3 className="font-bold text-gray-600 line-through">{r.title}</h3>
                  <p className="text-sm text-gray-500">{r.subject || 'No subject'}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(r.dateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                    ✓ Completed
                  </span>
                </div>
              );
            })}
            {completed.length === 0 && (
              <p className="text-gray-500 text-center py-4">No completed reminders</p>
            )}
          </div>
        </div>

        {/* Archived Reminders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
            <Archive className="w-5 h-5" />
            Archived ({archived.length})
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {archived.map(r => {
              const reminderId = r._id?.toString() || r.id;
              return (
                <div key={reminderId} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h3 className="font-bold">{r.title}</h3>
                  <p className="text-sm text-gray-600">{r.subject || 'No subject'}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(r.dateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={() => restoreReminder(reminderId)}
                      className="px-3 py-1.5 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      🔄 Restore
                    </button>
                  </div>
                </div>
              );
            })}
            {archived.length === 0 && (
              <p className="text-gray-500 text-center py-4">No archived reminders</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}