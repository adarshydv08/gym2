import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Users, Calendar, Activity, Megaphone, ClipboardList, RefreshCw, CheckCircle, Clock } from 'lucide-react';

export const ManagerPortal = ({ user }) => {
  const [tab, setTab] = useState('dashboard');
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [managerFeedbacks, setManagerFeedbacks] = useState([]);
  const [showManagerFeedback, setShowManagerFeedback] = useState(false);
  const [managerFeedbackMemberId, setManagerFeedbackMemberId] = useState(null);
  const [managerFeedbackMessage, setManagerFeedbackMessage] = useState('');
  const [showAssignTrainer, setShowAssignTrainer] = useState(false);
  const [assignMemberId, setAssignMemberId] = useState(null);
  const [assignTrainerId, setAssignTrainerId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [checkInId, setCheckInId] = useState('');
  const [checkInMsg, setCheckInMsg] = useState('');

  const loadData = () => {
    apiClient.get('/attendance/today').then(r => setAttendance(r.data || [])).catch(() => {});
    apiClient.get('/classes').then(r => setClasses(r.data || [])).catch(() => {});
    apiClient.get('/tickets').then(r => setComplaints(r.data || [])).catch(() => {});
    apiClient.get('/members').then(r => setMembers(r.data || [])).catch(() => {});
    apiClient.get('/trainers').then(r => setTrainers(r.data || [])).catch(() => {});
    if (user?.managerId) {
      apiClient.get(`/managers/${user.managerId}/feedbacks`).then(r => setManagerFeedbacks(r.data || [])).catch(() => setManagerFeedbacks([]));
    }
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

  const handleQuickCheckIn = async (memberId) => {
    try {
      await apiClient.post(`/attendance/check-in?memberId=${memberId}`, {});
      setCheckInMsg(`✅ Check-in recorded for Member ID ${memberId}`);
      loadData();
    } catch (e) {
      alert("Check-in failed: " + e.message);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this member account?")) return;
    try {
      await apiClient.delete(`/members/${memberId}`);
      setSelectedMember(null);
      loadData();
    } catch (err) {
      alert("Failed to delete member: " + err.message);
    }
  };

  const TABS = ['dashboard', 'members', 'attendance', 'classes', 'complaints'];

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

      {/* MEMBERS TAB */}
      {tab === 'members' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontWeight: 700 }}>Member Directory ({members.length})</h3>
            <input
              className="glass-input"
              placeholder="🔍 Search name, email, phone or member #..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '300px' }}
            />
          </div>

          {members.filter(m => {
            const q = searchQuery.toLowerCase();
            return !searchQuery ||
              m.user?.name?.toLowerCase().includes(q) ||
              m.user?.email?.toLowerCase().includes(q) ||
              m.user?.phone?.includes(q) ||
              m.membershipNumber?.toLowerCase().includes(q);
          }).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0b4c4' }}>
              <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>No matching members found.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(125,211,252,0.15)' }}>
                    {['Member #', 'Name', 'Email', 'Phone', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#a0b4c4', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.filter(m => {
                    const q = searchQuery.toLowerCase();
                    return !searchQuery ||
                      m.user?.name?.toLowerCase().includes(q) ||
                      m.user?.email?.toLowerCase().includes(q) ||
                      m.user?.phone?.includes(q) ||
                      m.membershipNumber?.toLowerCase().includes(q);
                  }).map(m => (
                    <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#7dd3fc', fontWeight: 600 }}>{m.membershipNumber}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{m.user?.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#a0b4c4', fontSize: '0.85rem' }}>{m.user?.email}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#a0b4c4', fontSize: '0.85rem' }}>{m.user?.phone}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className="badge" style={{ background: m.status === 'ACTIVE' ? 'rgba(134,239,172,0.15)' : 'rgba(255,107,107,0.15)', color: m.status === 'ACTIVE' ? '#86efac' : '#ff6b6b', border: `1px solid ${m.status === 'ACTIVE' ? '#86efac' : '#ff6b6b'}` }}>
                          {m.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <button onClick={() => handleQuickCheckIn(m.id)} className="btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', marginRight: '0.4rem' }}>Check In</button>
                        <button onClick={() => setSelectedMember(m)} className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', marginRight: '0.4rem' }}>View</button>
                        <button onClick={() => { setAssignMemberId(m.id); setShowAssignTrainer(true); }} className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', marginRight: '0.4rem' }}>Assign Trainer</button>
                        <button onClick={() => { setManagerFeedbackMemberId(m.id); setShowManagerFeedback(true); }} className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', marginRight: '0.4rem' }}>Manager Feedback</button>
                        <button onClick={() => handleDeleteMember(m.id)} className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderColor: '#ff6b6b', color: '#ff6b6b' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showAssignTrainer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,14,26,0.85)', backdropFilter: 'blur(6px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 800, marginBottom: '0.75rem' }}>Assign Trainer</h3>
            <p style={{ color: '#a0b4c4', marginBottom: '1rem' }}>Select a trainer to assign to this member.</p>
            <select className="glass-input" value={assignTrainerId || ''} onChange={e => setAssignTrainerId(Number(e.target.value))}>
              <option value="">-- Select trainer --</option>
              {trainers.map(t => (
                <option key={t.id} value={t.id}>{t.user?.name || t.name} — {t.specialization}</option>
              ))}
            </select>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
              <button className="btn-outline" onClick={() => { setShowAssignTrainer(false); setAssignTrainerId(null); setAssignMemberId(null); }}>Cancel</button>
              <button className="btn-primary" onClick={async () => {
                if (!assignTrainerId) return alert('Please select a trainer');
                try {
                  await apiClient.put(`/members/${assignMemberId}/assign-trainer?trainerId=${assignTrainerId}`);
                  setShowAssignTrainer(false);
                  setAssignTrainerId(null);
                  setAssignMemberId(null);
                  loadData();
                } catch (err) { alert('Failed to assign trainer: ' + (err.message || err)); }
              }}>Save</button>
            </div>
          </div>
        </div>
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
      {showManagerFeedback && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,14,26,0.85)', backdropFilter: 'blur(6px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 800, marginBottom: '0.75rem' }}>Add Manager Feedback</h3>
            <p style={{ color: '#a0b4c4', marginBottom: '1rem' }}>Provide feedback for member #{managerFeedbackMemberId}</p>
            <textarea className="glass-input" rows={6} value={managerFeedbackMessage} onChange={e => setManagerFeedbackMessage(e.target.value)} placeholder="Write feedback for this member..." />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
              <button className="btn-outline" onClick={() => { setShowManagerFeedback(false); setManagerFeedbackMessage(''); setManagerFeedbackMemberId(null); }}>Cancel</button>
              <button className="btn-primary" onClick={async () => {
                if (!user?.managerId) return alert('Manager id missing');
                try {
                  await apiClient.post(`/managers/${user.managerId}/feedbacks`, { memberId: managerFeedbackMemberId, message: managerFeedbackMessage });
                  setShowManagerFeedback(false);
                  setManagerFeedbackMessage(''); setManagerFeedbackMemberId(null);
                  apiClient.get(`/managers/${user.managerId}/feedbacks`).then(r => setManagerFeedbacks(r.data || [])).catch(() => {});
                } catch (err) { alert('Failed to save feedback: ' + err.message); }
              }}>Save</button>
            </div>
          </div>
        </div>
      )}
      {/* Member Details Modal */}
      {selectedMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,14,26,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '1rem', color: '#7dd3fc' }}>Member Profile Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div><span style={{ color: '#a0b4c4' }}>Name:</span> <br /><strong>{selectedMember.user?.name}</strong></div>
              <div><span style={{ color: '#a0b4c4' }}>Member #:</span> <br /><strong style={{ color: '#7dd3fc' }}>{selectedMember.membershipNumber}</strong></div>
              <div><span style={{ color: '#a0b4c4' }}>Email:</span> <br /><strong>{selectedMember.user?.email}</strong></div>
              <div><span style={{ color: '#a0b4c4' }}>Phone:</span> <br /><strong>{selectedMember.user?.phone}</strong></div>
              <div><span style={{ color: '#a0b4c4' }}>Emergency Contact:</span> <br /><strong>{selectedMember.emergencyContact || 'N/A'}</strong></div>
              <div><span style={{ color: '#a0b4c4' }}>Gender:</span> <br /><strong>{selectedMember.gender || 'N/A'}</strong></div>
              <div><span style={{ color: '#a0b4c4' }}>Assigned Trainer:</span> <br /><strong>{selectedMember.assignedTrainer?.user?.name || 'None'}</strong></div>
              <div><span style={{ color: '#a0b4c4' }}>Weight:</span> <br /><strong>{selectedMember.weightKg ? `${selectedMember.weightKg} kg` : 'N/A'}</strong></div>
              <div><span style={{ color: '#a0b4c4' }}>Height:</span> <br /><strong>{selectedMember.heightCm ? `${selectedMember.heightCm} cm` : 'N/A'}</strong></div>
              <div><span style={{ color: '#a0b4c4' }}>Blood Group:</span> <br /><strong style={{ color: '#ff6b6b' }}>{selectedMember.bloodGroup || 'N/A'}</strong></div>
              <div><span style={{ color: '#a0b4c4' }}>Status:</span> <br /><strong style={{ color: '#86efac' }}>{selectedMember.status}</strong></div>
              <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#a0b4c4' }}>Address:</span> <br /><strong>{selectedMember.address || 'N/A'}</strong></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <button className="btn-outline" style={{ borderColor: '#ff6b6b', color: '#ff6b6b' }} onClick={() => handleDeleteMember(selectedMember.id)}>
                Delete Member
              </button>
              <button className="btn-primary" onClick={() => setSelectedMember(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
