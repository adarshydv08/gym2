import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Users, Calendar, Activity, Megaphone, ClipboardList, RefreshCw, CheckCircle, Clock } from 'lucide-react';

export const ManagerPortal = ({ user }) => {
  const [tab, setTab] = useState('dashboard');
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [members, setMembers] = useState([]);
  const [checkInId, setCheckInId] = useState('');
  const [checkInMsg, setCheckInMsg] = useState('');

  const loadData = () => {
    apiClient.get('/attendance/today').then(r => setAttendance(r.data || [])).catch(() => {});
    apiClient.get('/classes').then(r => setClasses(r.data || [])).catch(() => {});
    apiClient.get('/tickets').then(r => setComplaints(r.data || [])).catch(() => {});
    apiClient.get('/members').then(r => setMembers(r.data || [])).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateTicket = async (ticketId, status) => {
    try {
      await apiClient.put(`/tickets/${ticketId}/status?status=${status}`);
      loadData();
    } catch (err) {
      alert("Failed to update ticket: " + err.message);
    }
  };

  const handleCheckIn = async () => {
    if (!checkInId) return;
    try {
      await apiClient.post(`/attendance/check-in?memberId=${checkInId}`, {});
      setCheckInMsg(`✅ Check-in recorded for Member ID ${checkInId}`);
      setCheckInId('');
      apiClient.get('/attendance/today').then(r => setAttendance(r.data || [])).catch(() => {});
    } catch (e) {
      setCheckInMsg(`❌ ${e.message}`);
    }
  };

  const TABS = ['dashboard', 'attendance', 'classes', 'complaints'];

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Manager <span style={{ color: '#88b4cc' }}>Operations Portal</span></h2>
          <p style={{ color: '#a0b4c4', marginTop: '0.25rem' }}>Welcome, {user?.name}. Manage daily gym operations.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={tab === t ? 'btn-primary' : 'btn-outline'} style={{ textTransform: 'capitalize', padding: '0.5rem 1.25rem' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {[
              { icon: Activity, label: "Today's Check-ins", value: attendance.length, color: '#7dd3fc' },
              { icon: Calendar, label: 'Active Classes', value: classes.length, color: '#c8a0f0' },
              { icon: Users, label: 'Total Members', value: members.length, color: '#88b4cc' },
              { icon: ClipboardList, label: 'Open Tickets', value: complaints.filter(c => c.status === 'OPEN').length, color: '#f59e0b' },
            ].map(m => (
              <div key={m.label} className="glass-panel" style={{ padding: '1.5rem' }}>
                <m.icon size={24} color={m.color} style={{ marginBottom: '0.75rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ color: '#a0b4c4', fontSize: '0.85rem', marginTop: '0.25rem' }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Check-in */}
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Quick Member Check-In</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.8rem', color: '#a0b4c4', display: 'block', marginBottom: '0.5rem' }}>Member ID</label>
                <input className="glass-input" type="number" placeholder="Enter Member ID (e.g. 1)" value={checkInId} onChange={e => setCheckInId(e.target.value)} />
              </div>
              <button className="btn-primary" onClick={handleCheckIn} style={{ whiteSpace: 'nowrap' }}>
                <CheckCircle size={16} /> Check In
              </button>
            </div>
            {checkInMsg && <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: checkInMsg.startsWith('✅') ? '#86efac' : '#ff6b6b' }}>{checkInMsg}</p>}
          </div>
        </>
      )}

      {tab === 'attendance' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Today's Attendance ({attendance.length})</h3>
          {attendance.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0b4c4' }}>
              <Activity size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>No check-ins yet today, or backend not connected.</p>
            </div>
          ) : (
            attendance.map(a => (
              <div key={a.id} className="glass-card" style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{a.member?.user?.name || `Member #${a.member?.id}`}</div>
                  <div style={{ fontSize: '0.8rem', color: '#a0b4c4' }}>
                    In: {new Date(a.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    {a.checkOutTime && ` · Out: ${new Date(a.checkOutTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`}
                  </div>
                </div>
                <span className="badge" style={{ background: a.checkOutTime ? 'rgba(134,239,172,0.15)' : 'rgba(125,211,252,0.15)', color: a.checkOutTime ? '#86efac' : '#7dd3fc' }}>
                  {a.checkOutTime ? 'Completed' : 'In Gym'}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'classes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {(classes.length > 0 ? classes : [
            { id: 1, title: 'Power HIIT', dayOfWeek: 'Monday', startTime: '7:00 AM', capacity: 20, category: 'HIIT' },
            { id: 2, title: 'Yoga & Meditation', dayOfWeek: 'Wednesday', startTime: '6:30 AM', capacity: 25, category: 'Yoga' },
            { id: 3, title: 'CrossFit Circuit', dayOfWeek: 'Friday', startTime: '6:00 PM', capacity: 15, category: 'CrossFit' },
            { id: 4, title: "Women's Sculpt", dayOfWeek: 'Tuesday', startTime: '5:00 PM', capacity: 20, category: 'Women Fitness' },
          ]).map(cls => (
            <div key={cls.id} className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{cls.title}</h4>
              <p style={{ color: '#7dd3fc', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{cls.category}</p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#a0b4c4' }}>
                <span><Clock size={12} style={{ marginRight: '0.35rem' }} />{cls.dayOfWeek} · {cls.startTime}</span>
                <span><Users size={12} style={{ marginRight: '0.35rem' }} />{cls.capacity} seats</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'complaints' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Support Tickets ({complaints.length})</h3>
          {complaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0b4c4' }}>
              <p>No complaints found. Backend connection needed.</p>
            </div>
          ) : complaints.map(c => (
            <div key={c.id} className="glass-card" style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{c.subject}</div>
                <div style={{ fontSize: '0.8rem', color: '#a0b4c4' }}>{c.category} · {c.priority}</div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className="badge" style={{ color: c.status === 'OPEN' ? '#ff6b6b' : '#7dd3fc' }}>{c.status}</span>
                {c.status === 'OPEN' && (
                  <button className="btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }} onClick={() => handleUpdateTicket(c.id, 'CLOSED')}>
                    Close
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
