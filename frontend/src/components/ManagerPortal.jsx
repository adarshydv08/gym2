import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Users, Calendar, Activity, Megaphone, ClipboardList, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ManagerPortal = ({ user }) => {
  const [tab, setTab] = useState('dashboard');
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [managerFeedbacks, setManagerFeedbacks] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [approvalMessage, setApprovalMessage] = useState('');
  const [approvalError, setApprovalError] = useState('');
  const [showManagerFeedback, setShowManagerFeedback] = useState(false);
  const [managerFeedbackMemberId, setManagerFeedbackMemberId] = useState(null);
  const [managerFeedbackMessage, setManagerFeedbackMessage] = useState('');
  const [showAssignTrainer, setShowAssignTrainer] = useState(false);
  const [assignMemberId, setAssignMemberId] = useState(null);
  const [assignTrainerId, setAssignTrainerId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [assigning, setAssigning] = useState(false);

  const loadData = () => {
    apiClient.get('/attendance/today').then(r => setAttendance(r.data || [])).catch(() => {});
    apiClient.get('/classes').then(r => setClasses(r.data || [])).catch(() => {});
    apiClient.get('/tickets').then(r => setComplaints(r.data || [])).catch(() => {});
    apiClient.get('/members').then(r => setMembers(r.data || [])).catch(() => {});
    apiClient.get('/trainers').then(r => setTrainers(r.data || [])).catch(() => {});
    apiClient.get('/managers/pending-approvals').then(r => setPendingApprovals(r.data || [])).catch(() => setPendingApprovals([]));
    if (user?.managerId) {
      apiClient.get(`/managers/${user.managerId}/feedbacks`).then(r => setManagerFeedbacks(r.data || [])).catch(() => setManagerFeedbacks([]));
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const { showToast } = useToast();

  const handleUpdateTicket = async (ticketId, status) => {
    try {
      await apiClient.put(`/tickets/${ticketId}/status?status=${status}`);
      showToast(`Ticket status updated to ${status.replace('_', ' ')}`, { type: 'success' });
      loadData();
    } catch (err) {
      showToast("Failed to update ticket: " + (err.message || err), { type: 'error' });
    }
  };

  const handleDeleteComplaint = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) return;
    try {
      await apiClient.delete(`/tickets/${ticketId}`);
      showToast('Complaint deleted successfully.', { type: 'success' });
      loadData();
    } catch (err) {
      showToast('Failed to delete complaint: ' + (err.message || err), { type: 'error' });
    }
  };

  const handleQuickCheckIn = async (memberId) => {
    try {
      await apiClient.post(`/attendance/check-in?memberId=${memberId}`, {});
      showToast('Check-in recorded successfully.', { type: 'success' });
      loadData();
    } catch (e) {
      showToast('Check-in failed: ' + (e.message || e), { type: 'error' });
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this member account?")) return;
    try {
      await apiClient.delete(`/members/${memberId}`);
      setSelectedMember(null);
      showToast('Member deleted successfully.', { type: 'success' });
      setActionError('');
      loadData();
    } catch (err) {
      showToast("Failed to delete member: " + (err.message || err), { type: 'error' });
      setActionMessage('');
    }
  };

  const handleApprovePendingUser = async (userId) => {
    setApprovalMessage('');
    setApprovalError('');
    try {
      await apiClient.put(`/managers/users/${userId}/approve`, {});
      // optimistic update: remove from pending list immediately
      setPendingApprovals(prev => prev.filter(p => p.userId !== userId));
      setApprovalMessage('Approval completed successfully.');
      setActionMessage('User approved successfully.');
      setActionError('');
    } catch (err) {
      setApprovalError(err.message || 'Failed to approve request.');
      setActionMessage('');
    }
  };

  const handleRejectPendingUser = async (userId) => {
    setApprovalMessage('');
    setApprovalError('');
    try {
      await apiClient.put(`/managers/users/${userId}/reject`, {});
      setPendingApprovals(prev => prev.filter(p => p.userId !== userId));
      setApprovalMessage('Request rejected successfully.');
      setActionMessage('User rejected successfully.');
      setActionError('');
    } catch (err) {
      setApprovalError(err.message || 'Failed to reject request.');
      setActionMessage('');
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

      {(approvalMessage || approvalError) && (
        <div style={{ marginBottom: '1rem' }}>
          {approvalMessage && <div className="alert alert-success">{approvalMessage}</div>}
          {approvalError && <div className="alert alert-error">{approvalError}</div>}
        </div>
      )}

      {tab === 'dashboard' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {[
              { icon: Activity, label: "Today's Check-ins", value: attendance.length, highlight: '#7dd3fc' },
              { icon: Calendar, label: 'Active Classes', value: classes.length, highlight: '#c8a0f0' },
              { icon: Users, label: 'Total Members', value: members.length, highlight: '#88b4cc' },
              { icon: ClipboardList, label: 'Open Tickets', value: complaints.filter(c => c.status === 'OPEN').length, highlight: '#f59e0b' },
            ].map(m => (
              <div key={m.label} className="glass-panel" style={{ padding: '1.5rem' }}>
                <m.icon size={24} color="#ffffff" style={{ marginBottom: '0.75rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: 800, color: m.highlight }}>{m.value}</div>
                <div style={{ color: '#a0b4c4', fontSize: '0.85rem', marginTop: '0.25rem' }}>{m.label}</div>
              </div>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontWeight: 700 }}>Pending Approval Queue</h3>
              <span className="badge" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid #f59e0b' }}>{pendingApprovals.length} waiting</span>
            </div>
            {pendingApprovals.length === 0 ? (
              <p style={{ color: '#a0b4c4' }}>No pending approvals at the moment.</p>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {pendingApprovals.map(item => (
                  <div key={item.userId} className="glass-card" style={{ padding: '0.9rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{item.name}</div>
                      <div style={{ color: '#a0b4c4', fontSize: '0.82rem' }}>{item.email} · {item.requestedRole?.replace('ROLE_', '')}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleApprovePendingUser(item.userId)}>Approve</button>
                      <button className="btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', borderColor: '#ff6b6b', color: '#ff6b6b' }} onClick={() => handleRejectPendingUser(item.userId)}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Quick Member Check-In</h3>
            <p style={{ color: '#a0b4c4', marginBottom: '0.75rem' }}>
              Record attendance directly from the member table using the Check In button. This avoids any duplicate manual entry by member ID.
            </p>
            <ul style={{ color: '#a0b4c4', fontSize: '0.9rem', paddingLeft: '1.2rem' }}>
              <li>Click Check In next to the member record</li>
              <li>Attendance refreshes automatically</li>
              <li>Pending members can be assigned a trainer from the same row</li>
            </ul>
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
                    {['Member #', 'Name', 'Email', 'Phone', 'Status', 'Trainer', 'Actions'].map(h => (
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
                      <td style={{ padding: '0.75rem 1rem', color: '#a0b4c4', fontSize: '0.85rem' }}>
                        {m.assignedTrainer?.user?.name || 'Unassigned'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className="badge" style={{ background: m.assignedTrainer ? 'rgba(134,239,172,0.15)' : 'rgba(245,158,11,0.15)', color: m.assignedTrainer ? '#86efac' : '#f59e0b', border: `1px solid ${m.assignedTrainer ? '#86efac' : '#f59e0b'}` }}>
                          {m.assignedTrainer ? 'Assigned' : 'Pending'}
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
                if (!assignTrainerId) { showToast('Please select a trainer', { type: 'error' }); return; }
                try {
                  await apiClient.put(`/members/${assignMemberId}/assign-trainer?trainerId=${assignTrainerId}`);
                  setShowAssignTrainer(false);
                  setAssignTrainerId(null);
                  setAssignMemberId(null);
                  loadData();
                } catch (err) { showToast('Failed to assign trainer: ' + (err.message || err), { type: 'error' }); }
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
            <div key={c.id} className="glass-card" style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{c.subject}</div>
                <div style={{ fontSize: '0.8rem', color: '#a0b4c4' }}>{c.category} · {c.priority}</div>
                <div style={{ marginTop: '0.35rem' }}>
                  <span className="badge" style={{ background: c.status === 'OPEN' ? 'rgba(255,107,107,0.15)' : c.status === 'IN_PROGRESS' ? 'rgba(245,158,11,0.15)' : 'rgba(134,239,172,0.15)', color: c.status === 'OPEN' ? '#ff6b6b' : c.status === 'IN_PROGRESS' ? '#f59e0b' : '#86efac', border: `1px solid ${c.status === 'OPEN' ? '#ff6b6b' : c.status === 'IN_PROGRESS' ? '#f59e0b' : '#86efac'}` }}>{c.status.replace('_', ' ')}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {c.status !== 'IN_PROGRESS' && (
                  <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => handleUpdateTicket(c.id, 'IN_PROGRESS')}>
                    In Progress
                  </button>
                )}
                {c.status !== 'RESOLVED' && (
                  <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => handleUpdateTicket(c.id, 'RESOLVED')}>
                    Resolve
                  </button>
                )}
                <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderColor: '#ff6b6b', color: '#ff6b6b' }} onClick={() => handleDeleteComplaint(c.id)}>
                  Delete
                </button>
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
