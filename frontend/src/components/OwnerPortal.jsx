import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, IndianRupee, Activity, Dumbbell, AlertTriangle, TrendingUp, UserCheck, Calendar, ChevronRight, RefreshCw } from 'lucide-react';

const GLASS_COLORS = ['#7dd3fc', '#c8a0f0', '#88b4cc', '#f9a8d4', '#86efac'];

const MetricCard = ({ icon: Icon, label, value, sub, color = '#7dd3fc' }) => (
  <div className="glass-panel" style={{ padding: '1.5rem' }}>
    <div style={{ display: 'flex', justify: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
      <div style={{ background: `rgba(${color === '#7dd3fc' ? '125,211,252' : color === '#c8a0f0' ? '200,160,240' : color === '#86efac' ? '134,239,172' : color === '#f59e0b' ? '245,158,11' : color === '#ff6b6b' ? '255,107,107' : '136,180,204'},0.15)`, padding: '0.6rem', borderRadius: '10px' }}>
        <Icon size={20} color={color} />
      </div>
    </div>
    <div style={{ fontSize: '2rem', fontWeight: 800, color, marginBottom: '0.25rem' }}>{value}</div>
    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
    {sub && <div style={{ fontSize: '0.8rem', color: '#a0b4c4' }}>{sub}</div>}
  </div>
);

export const OwnerPortal = ({ user }) => {
  const [metrics, setMetrics] = useState(null);
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [tab, setTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  const [showAddTrainer, setShowAddTrainer] = useState(false);
  const [trainerForm, setTrainerForm] = useState({ name: '', email: '', phone: '', specialization: '', experienceYears: '' });
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '' });

  const load = async () => {
    setLoading(true);
    try {
      const [m, mem, tr, comp, ann, man, pay] = await Promise.allSettled([
        apiClient.get('/reports/owner-dashboard'),
        apiClient.get('/members'),
        apiClient.get('/trainers'),
        apiClient.get('/tickets'),
        apiClient.get('/announcements'),
        apiClient.get('/managers'),
        apiClient.get('/payments')
      ]);
      if (m.status === 'fulfilled') setMetrics(m.value.data);
      if (mem.status === 'fulfilled') setMembers(mem.value.data || []);
      if (tr.status === 'fulfilled') setTrainers(tr.value.data || []);
      if (comp.status === 'fulfilled') setComplaints(comp.value.data || []);
      if (ann.status === 'fulfilled') setAnnouncements(ann.value.data || []);
      if (man.status === 'fulfilled') setManagers(man.value.data || []);
      if (pay.status === 'fulfilled') setPayments(pay.value.data || []);
    } catch { }
    setLoading(false);
  };

  const handleAddTrainer = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/trainers', trainerForm);
      setTrainerForm({ name: '', email: '', phone: '', specialization: '', experienceYears: '' });
      setShowAddTrainer(false);
      load();
    } catch (err) {
      alert("Failed to add trainer: " + err.message);
    }
  };

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/announcements', announcementForm);
      setAnnouncementForm({ title: '', content: '' });
      setShowAddAnnouncement(false);
      load();
    } catch (err) {
      alert("Failed to add announcement: " + err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApproveManager = async (managerId) => {
    try {
      await apiClient.put(`/managers/${managerId}/approve`, {});
      alert("🎉 Manager approved successfully!");
      load();
    } catch (err) {
      alert("Failed to approve manager: " + err.message);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this member account?")) return;
    try {
      await apiClient.delete(`/members/${memberId}`);
      setSelectedMember(null);
      load();
    } catch (err) {
      alert("Failed to delete member: " + err.message);
    }
  };

  const TABS = ['dashboard', 'managers', 'members', 'trainers', 'complaints', 'payments'];

  // Fallback demo data
  const data = metrics || {
    totalMembers: 162, activeMembers: 157, todayAttendance: 48,
    monthlyRevenue: 20497, totalRevenue: 95497,
    activeTrainers: 4, todayClasses: 4, openComplaints: 2,
    revenueTrend: [
      { month: 'Feb', revenue: 12500 }, { month: 'Mar', revenue: 14200 },
      { month: 'Apr', revenue: 16800 }, { month: 'May', revenue: 15400 },
      { month: 'Jun', revenue: 18900 }, { month: 'Jul', revenue: 20497 }
    ],
    attendanceTrend: [
      { day: 'Mon', attendees: 48 }, { day: 'Tue', attendees: 52 },
      { day: 'Wed', attendees: 55 }, { day: 'Thu', attendees: 50 },
      { day: 'Fri', attendees: 62 }, { day: 'Sat', attendees: 44 }, { day: 'Sun', attendees: 28 }
    ],
    popularPlans: [
      { name: 'Half-Yearly Pro', value: 45 }, { name: 'Yearly Champion', value: 30 },
      { name: 'Quarterly', value: 15 }, { name: 'Monthly', value: 10 }
    ],
  };

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      {/* Portal Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Owner <span style={{ color: '#c8a0f0' }}>BI Portal</span>
          </h2>
          <p style={{ color: '#a0b4c4', marginTop: '0.25rem' }}>Welcome back, {user?.name}. Here's your gym overview.</p>
        </div>
        <button onClick={load} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={tab === t ? 'btn-primary' : 'btn-outline'} style={{ textTransform: 'capitalize', padding: '0.5rem 1.25rem' }}>
            {t}
          </button>
        ))}
        <button onClick={() => setTab('announcements')} className={tab === 'announcements' ? 'btn-primary' : 'btn-outline'} style={{ textTransform: 'capitalize', padding: '0.5rem 1.25rem' }}>
          Announcements
        </button>
      </div>

      {/* DASHBOARD TAB */}
      {tab === 'dashboard' && (
        <>
          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <MetricCard icon={Users} label="Total Members" value={data.totalMembers} sub={`${data.activeMembers} active`} color="#7dd3fc" />
            <MetricCard icon={IndianRupee} label="Monthly Revenue" value={`₹${(data.monthlyRevenue || 0).toLocaleString('en-IN')}`} sub="This month" color="#86efac" />
            <MetricCard icon={Activity} label="Today's Check-ins" value={data.todayAttendance} sub="Live attendance" color="#c8a0f0" />
            <MetricCard icon={Dumbbell} label="Active Trainers" value={data.activeTrainers} sub="On duty" color="#88b4cc" />
            <MetricCard icon={Calendar} label="Today's Classes" value={data.todayClasses} sub="Scheduled" color="#f9a8d4" />
            <MetricCard icon={AlertTriangle} label="Open Tickets" value={data.openComplaints} sub="Awaiting response" color="#f59e0b" />
          </div>

          {/* Charts Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Revenue Trend <span style={{ color: '#a0b4c4', fontWeight: 400, fontSize: '0.85rem' }}>(INR ₹)</span></h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data.revenueTrend}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7dd3fc" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7dd3fc" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#4a6070" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#4a6070" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#0f1524', border: '1px solid rgba(125,211,252,0.2)', borderRadius: '8px', color: '#e0e8f0' }} formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#7dd3fc" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Plan Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={data.popularPlans} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                    {(data.popularPlans || []).map((_, i) => <Cell key={i} fill={GLASS_COLORS[i % GLASS_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0f1524', border: '1px solid rgba(125,211,252,0.2)', borderRadius: '8px', color: '#e0e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                {(data.popularPlans || []).map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#a0b4c4' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: GLASS_COLORS[i % GLASS_COLORS.length], flexShrink: 0 }} />
                    {p.name} ({p.value}%)
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Weekly Attendance Pattern</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.attendanceTrend}>
                <XAxis dataKey="day" stroke="#4a6070" tick={{ fontSize: 12 }} />
                <YAxis stroke="#4a6070" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0f1524', border: '1px solid rgba(125,211,252,0.2)', borderRadius: '8px', color: '#e0e8f0' }} />
                <Bar dataKey="attendees" fill="#7dd3fc" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* MANAGERS TAB */}
      {tab === 'managers' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Managers ({managers.length})</h3>
          {managers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0b4c4' }}>
              <UserCheck size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>No managers found.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(125,211,252,0.15)' }}>
                    {['Name', 'Email', 'Phone', 'Department', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#a0b4c4', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {managers.map(m => (
                    <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{m.user?.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#a0b4c4', fontSize: '0.85rem' }}>{m.user?.email}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#a0b4c4', fontSize: '0.85rem' }}>{m.user?.phone}</td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#7dd3fc', fontWeight: 600 }}>{m.department}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className="badge" style={{ background: m.user?.status?.toUpperCase() === 'ACTIVE' ? 'rgba(134,239,172,0.15)' : 'rgba(245,158,11,0.15)', color: m.user?.status?.toUpperCase() === 'ACTIVE' ? '#86efac' : '#f59e0b', border: `1px solid ${m.user?.status?.toUpperCase() === 'ACTIVE' ? '#86efac' : '#f59e0b'}` }}>
                          {m.user?.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {m.user?.status?.toUpperCase() === 'PENDING' ? (
                          <button onClick={() => handleApproveManager(m.id)} className="btn-primary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>Approve</button>
                        ) : (
                          <button className="btn-outline" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }} disabled>Approved</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MEMBERS TAB */}
      {tab === 'members' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Member Management ({members.length})</h3>
          {members.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0b4c4' }}>
              <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>No members found. Connect the backend to view live data.</p>
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
                  {members.map(m => (
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
                        <button onClick={() => setSelectedMember(m)} className="btn-outline" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', marginRight: '0.5rem' }}>View</button>
                        <button onClick={() => handleDeleteMember(m.id)} className="btn-outline" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', borderColor: '#ff6b6b', color: '#ff6b6b' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TRAINERS TAB */}
      {tab === 'trainers' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <button className="btn-primary" onClick={() => setShowAddTrainer(!showAddTrainer)}>
              {showAddTrainer ? 'Cancel' : '+ Add New Trainer'}
            </button>
          </div>
          {showAddTrainer && (
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>New Trainer Details</h3>
              <form onSubmit={handleAddTrainer} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input required className="glass-input" placeholder="Name" style={{ flex: 1, minWidth: '200px' }} value={trainerForm.name} onChange={e => setTrainerForm({ ...trainerForm, name: e.target.value })} />
                <input required className="glass-input" placeholder="Email" style={{ flex: 1, minWidth: '200px' }} value={trainerForm.email} onChange={e => setTrainerForm({ ...trainerForm, email: e.target.value })} />
                <input required className="glass-input" placeholder="Phone" style={{ flex: 1, minWidth: '200px' }} value={trainerForm.phone} onChange={e => setTrainerForm({ ...trainerForm, phone: e.target.value })} />
                <input required className="glass-input" placeholder="Specialization" style={{ flex: 1, minWidth: '200px' }} value={trainerForm.specialization} onChange={e => setTrainerForm({ ...trainerForm, specialization: e.target.value })} />
                <input required type="number" className="glass-input" placeholder="Years of Exp" style={{ flex: 1, minWidth: '150px' }} value={trainerForm.experienceYears} onChange={e => setTrainerForm({ ...trainerForm, experienceYears: e.target.value })} />
                <button type="submit" className="btn-primary" style={{ minWidth: '150px' }}>Save Trainer</button>
              </form>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {(trainers.length > 0 ? trainers : [
              { id: 1, user: { name: 'Arjun Mehta' }, specialization: 'Strength & Conditioning', rating: 4.9, experienceYears: 6 },
              { id: 2, user: { name: 'Pooja Sharma' }, specialization: 'Yoga & Mobility', rating: 4.8, experienceYears: 5 },
              { id: 3, user: { name: 'Vikram Singh' }, specialization: 'Weight Training', rating: 4.9, experienceYears: 8 },
              { id: 4, user: { name: 'Neha Kapoor' }, specialization: "Women's Fitness", rating: 4.7, experienceYears: 4 },
            ]).map(trainer => (
              <div key={trainer.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(125,211,252,0.3), rgba(200,160,240,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 800, color: '#7dd3fc', flexShrink: 0 }}>
                    {(trainer.user?.name || trainer.name || 'T').charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700 }}>{trainer.user?.name || trainer.name}</h4>
                    <p style={{ color: '#7dd3fc', fontSize: '0.8rem' }}>{trainer.specialization}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#a0b4c4' }}>
                  <span>⭐ {trainer.rating || 5.0}</span>
                  <span>· {trainer.experienceYears || trainer.experience_years}yr exp</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* COMPLAINTS TAB */}
      {tab === 'complaints' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Support Tickets ({complaints.length})</h3>
          {complaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0b4c4' }}>
              <AlertTriangle size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>No complaints found. Backend connection required for live data.</p>
            </div>
          ) : (
            complaints.map(c => (
              <div key={c.id} className="glass-card" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{c.subject}</h4>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: '#a0b4c4' }}>
                    <span>{c.category}</span> · <span>{c.priority} priority</span>
                  </div>
                </div>
                <span className="badge" style={{ background: c.status === 'OPEN' ? 'rgba(255,107,107,0.15)' : 'rgba(125,211,252,0.15)', color: c.status === 'OPEN' ? '#ff6b6b' : '#7dd3fc' }}>
                  {c.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* PAYMENTS TAB */}
      {tab === 'payments' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {[
              { label: 'Total Revenue', value: `₹${(data.totalRevenue || 0).toLocaleString('en-IN')}`, color: '#86efac' },
              { label: 'Monthly Revenue', value: `₹${(data.monthlyRevenue || 0).toLocaleString('en-IN')}`, color: '#7dd3fc' },
              { label: 'Successful Payments', value: payments.length, color: '#c8a0f0' },
            ].map(s => (
              <div key={s.label} className="glass-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ color: '#a0b4c4', fontSize: '0.85rem', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>Live Transaction History</h4>
          {payments.length === 0 ? (
            <p style={{ color: '#a0b4c4', textAlign: 'center', padding: '2rem' }}>No payment records found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(125,211,252,0.15)' }}>
                    {['Txn ID', 'Member', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#a0b4c4', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#c8a0f0', fontWeight: 600 }}>{p.transactionId}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{p.member?.user?.name || `Member #${p.member?.id}`}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#86efac' }}>₹{Number(p.amountInr || 0).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#a0b4c4', fontSize: '0.85rem' }}>{p.paymentMethod}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className="badge" style={{ background: 'rgba(134,239,172,0.15)', color: '#86efac', border: '1px solid #86efac' }}>{p.paymentStatus}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#a0b4c4', fontSize: '0.85rem' }}>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-IN') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ANNOUNCEMENTS TAB */}
      {tab === 'announcements' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <button className="btn-primary" onClick={() => setShowAddAnnouncement(!showAddAnnouncement)}>
              {showAddAnnouncement ? 'Cancel' : '+ Add Announcement'}
            </button>
          </div>
          {showAddAnnouncement && (
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>New Announcement</h3>
              <form onSubmit={handleAddAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input required className="glass-input" placeholder="Announcement Title" value={announcementForm.title} onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })} />
                <textarea required className="glass-input" rows={4} placeholder="Content..." style={{ resize: 'vertical' }} value={announcementForm.content} onChange={e => setAnnouncementForm({ ...announcementForm, content: e.target.value })} />
                <button type="submit" className="btn-primary">Post Announcement</button>
              </form>
            </div>
          )}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {announcements.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#a0b4c4' }}>
                <p>No announcements yet.</p>
              </div>
            ) : (
              announcements.map(ann => (
                <div key={ann.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#c8a0f0' }}>{ann.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: '#e0e8f0' }}>{ann.content}</p>
                  <div style={{ fontSize: '0.75rem', color: '#a0b4c4', marginTop: '1rem' }}>
                    Posted on {new Date(ann.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
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
