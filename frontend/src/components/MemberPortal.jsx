import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { CreditCard, Activity, Calendar, Dumbbell, Bell, Ticket, ChevronRight, IndianRupee, CheckCircle, Clock, Star } from 'lucide-react';

const DEMO_MEMBERSHIP = { planName: 'Half-Yearly Pro', status: 'ACTIVE', endDate: '2026-12-01', daysLeft: 124, amountPaid: 6999 };
const DEMO_ATTENDANCE = [
  { date: '2026-07-30', checkIn: '7:15 AM', checkOut: '8:45 AM' },
  { date: '2026-07-29', checkIn: '7:00 AM', checkOut: '8:30 AM' },
  { date: '2026-07-28', checkIn: '6:45 AM', checkOut: '8:00 AM' },
];
const DEMO_CLASSES = [
  { title: 'Power HIIT', day: 'Monday', time: '7:00 AM', status: 'CONFIRMED' },
  { title: 'Yoga & Meditation', day: 'Wednesday', time: '6:30 AM', status: 'CONFIRMED' },
];
const DEMO_PAYMENTS = [
  { date: '01 Jun 2026', description: 'Half-Yearly Pro Membership', amount: 6999, method: 'UPI', status: 'SUCCESSFUL', invoice: 'INV-2026-0001' },
];

export const MemberPortal = ({ user }) => {
  const [tab, setTab] = useState('dashboard');
  const [membership, setMembership] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [allClasses, setAllClasses] = useState([]);
  const [complaintForm, setComplaintForm] = useState({ subject: '', category: '', description: '' });

  const loadData = async () => {
    const mid = user?.memberId;
    const uid = user?.userId;
    if (mid) {
      apiClient.get(`/attendance/member/${mid}`).then(r => setAttendance(r.data || [])).catch(() => {});
      apiClient.get(`/classes/bookings/member/${mid}`).then(r => setBookings(r.data || [])).catch(() => {});
      apiClient.get(`/payments/member/${mid}`).then(r => setPayments(r.data || [])).catch(() => {});
      apiClient.get(`/workouts/member/${mid}`).then(r => setWorkouts(r.data || [])).catch(() => {});
      apiClient.get(`/tickets/member/${mid}`).then(r => setComplaints(r.data || [])).catch(() => {});
      apiClient.get(`/members/${mid}`).then(r => setMembership(r.data || null)).catch(() => {});
    }
    if (uid) {
      apiClient.get(`/notifications/user/${uid}`).then(r => setNotifications(r.data || [])).catch(() => {});
    }
    apiClient.get('/classes').then(r => setAllClasses(r.data || [])).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!complaintForm.subject || !complaintForm.category || !complaintForm.description) return;
    try {
      await apiClient.post('/tickets', {
        memberId: user?.memberId,
        subject: complaintForm.subject,
        category: complaintForm.category,
        description: complaintForm.description,
        priority: 'MEDIUM'
      });
      setComplaintForm({ subject: '', category: '', description: '' });
      loadData();
      alert("Ticket raised successfully!");
    } catch (err) {
      alert("Failed to raise ticket: " + err.message);
    }
  };

  const handleBookClass = async (classId) => {
    if (!user?.memberId) return;
    try {
      await apiClient.post(`/classes/${classId}/book?memberId=${user.memberId}`, {});
      loadData();
      alert("Class booked successfully!");
    } catch (err) {
      alert("Failed to book class: " + err.message);
    }
  };

  const TABS = ['dashboard', 'membership', 'classes', 'attendance', 'workouts', 'payments', 'support'];

  const displayAttendance = attendance.length > 0 ? attendance : DEMO_ATTENDANCE;
  const displayPayments = payments.length > 0 ? payments : DEMO_PAYMENTS;

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          Welcome back, <span style={{ color: '#7dd3fc' }}>{user?.name?.split(' ')[0] || 'Member'}</span>! 💪
        </h2>
        <p style={{ color: '#a0b4c4', marginTop: '0.25rem' }}>Your personal fitness hub — track, book, and improve.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={tab === t ? 'btn-primary' : 'btn-outline'} style={{ textTransform: 'capitalize', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            {t}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {tab === 'dashboard' && (
        <>
          {/* Digital Membership Card */}
          <div style={{ background: 'linear-gradient(135deg, rgba(125,211,252,0.15) 0%, rgba(200,160,240,0.15) 100%)', border: '1px solid rgba(125,211,252,0.3)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(125,211,252,0.08)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#a0b4c4', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>IRONFIT FITNESS CLUB</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{user?.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#7dd3fc', fontWeight: 600 }}>{user?.memberId ? `IF-2026-00${user.memberId}` : 'IF-2026-001'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#a0b4c4', marginBottom: '0.5rem' }}>Plan</div>
                <div style={{ fontWeight: 700, color: '#c8a0f0' }}>{DEMO_MEMBERSHIP.planName}</div>
                <div style={{ fontSize: '0.8rem', color: '#a0b4c4', marginTop: '0.25rem' }}>Valid till: {DEMO_MEMBERSHIP.endDate}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7dd3fc' }}>{DEMO_MEMBERSHIP.daysLeft}</div>
                <div style={{ fontSize: '0.8rem', color: '#a0b4c4' }}>Days Remaining</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#86efac' }}>{displayAttendance.length}+</div>
                <div style={{ fontSize: '0.8rem', color: '#a0b4c4' }}>Total Visits</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c8a0f0' }}>{DEMO_CLASSES.length}</div>
                <div style={{ fontSize: '0.8rem', color: '#a0b4c4' }}>Classes Booked</div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            {[
              { icon: CreditCard, label: 'Membership', value: 'ACTIVE', color: '#86efac', action: () => setTab('membership') },
              { icon: Activity, label: 'This Month', value: `${displayAttendance.length} visits`, color: '#7dd3fc', action: () => setTab('attendance') },
              { icon: Calendar, label: 'Booked Classes', value: DEMO_CLASSES.length, color: '#c8a0f0', action: () => setTab('classes') },
              { icon: Bell, label: 'Notifications', value: notifications.filter(n => !n.isRead).length || '2', color: '#f59e0b', action: () => {} },
            ].map(card => (
              <button key={card.label} className="glass-panel" onClick={card.action} style={{ padding: '1.25rem', textAlign: 'left', cursor: 'pointer', background: 'none', border: '1px solid rgba(125,211,252,0.12)', borderRadius: '16px', transition: 'all 0.2s' }}>
                <card.icon size={22} color={card.color} style={{ marginBottom: '0.75rem' }} />
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: card.color }}>{card.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#a0b4c4', marginTop: '0.25rem' }}>{card.label}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* MEMBERSHIP */}
      {tab === 'membership' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Current Membership</h3>
            {[
              { label: 'Plan', value: DEMO_MEMBERSHIP.planName, color: '#c8a0f0' },
              { label: 'Status', value: DEMO_MEMBERSHIP.status, color: '#86efac' },
              { label: 'Valid Until', value: DEMO_MEMBERSHIP.endDate },
              { label: 'Days Remaining', value: `${DEMO_MEMBERSHIP.daysLeft} days`, color: '#7dd3fc' },
              { label: 'Amount Paid', value: `₹${DEMO_MEMBERSHIP.amountPaid.toLocaleString('en-IN')}` },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#a0b4c4', fontSize: '0.9rem' }}>{item.label}</span>
                <span style={{ fontWeight: 600, color: item.color || '#e0e8f0' }}>{item.value}</span>
              </div>
            ))}
            <button className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Renew Membership</button>
          </div>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Your Trainer</h3>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(125,211,252,0.3), rgba(200,160,240,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#7dd3fc', margin: '0 auto 1rem' }}>A</div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Arjun Mehta</h4>
              <p style={{ color: '#7dd3fc', fontSize: '0.85rem', marginBottom: '0.75rem' }}>Strength & Conditioning</p>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', marginBottom: '1.25rem' }}>
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <span style={{ fontWeight: 700, color: '#f59e0b' }}>4.9</span>
              </div>
              <button className="btn-outline" style={{ width: '100%' }}>Message Trainer</button>
            </div>
          </div>
        </div>
      )}

      {/* CLASSES */}
      {tab === 'classes' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* My Booked Classes */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>My Booked Classes</h3>
              {bookings.length === 0 ? (
                 <div style={{ textAlign: 'center', padding: '2rem', color: '#a0b4c4' }}><p>No bookings yet.</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {bookings.map((booking, i) => (
                    <div key={i} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontWeight: 700, marginBottom: '0.35rem' }}>{booking.gymClass?.title || 'Class'}</h4>
                        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: '#a0b4c4' }}>
                          <span><Clock size={13} style={{ marginRight: '0.35rem' }} />{booking.gymClass?.dayOfWeek} · {booking.gymClass?.startTime}</span>
                        </div>
                      </div>
                      <span className="badge badge-member">{booking.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Available Classes */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Available Classes</h3>
              {allClasses.length === 0 ? (
                 <div style={{ textAlign: 'center', padding: '2rem', color: '#a0b4c4' }}><p>No available classes.</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {allClasses.map((cls, i) => (
                    <div key={i} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontWeight: 700, marginBottom: '0.35rem' }}>{cls.title}</h4>
                        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: '#a0b4c4' }}>
                          <span><Clock size={13} style={{ marginRight: '0.35rem' }} />{cls.dayOfWeek} · {cls.startTime}</span>
                        </div>
                      </div>
                      <button className="btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }} onClick={() => handleBookClass(cls.id)}>Book</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ATTENDANCE */}
      {tab === 'attendance' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Attendance History</h3>
          {displayAttendance.map((a, i) => (
            <div key={i} className="glass-card" style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{a.date || (a.checkInTime && new Date(a.checkInTime).toLocaleDateString('en-IN'))}</div>
                <div style={{ fontSize: '0.8rem', color: '#a0b4c4', marginTop: '0.25rem' }}>
                  In: {a.checkIn || (a.checkInTime && new Date(a.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))}
                  {(a.checkOut || a.checkOutTime) && ` · Out: ${a.checkOut || new Date(a.checkOutTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`}
                </div>
              </div>
              <CheckCircle size={18} color="#86efac" />
            </div>
          ))}
        </div>
      )}

      {/* WORKOUTS */}
      {tab === 'workouts' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>My Workout Plans</h3>
          {workouts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0b4c4' }}>
              <Dumbbell size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
              <p>Your trainer will assign workouts soon. Backend connection required for live data.</p>
            </div>
          ) : workouts.map(w => (
            <div key={w.id} className="glass-card" style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{w.title}</h4>
              <p style={{ fontSize: '0.85rem', color: '#a0b4c4', marginBottom: '0.75rem' }}>Goal: {w.goal}</p>
              {(w.exercises || []).slice(0, 3).map((ex, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#a0b4c4', padding: '0.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span>{ex.exerciseName}</span>
                  <span>{ex.sets}x{ex.reps} {ex.weightKg > 0 ? `@ ${ex.weightKg}kg` : ''}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* PAYMENTS */}
      {tab === 'payments' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Payment History</h3>
          {displayPayments.map((p, i) => (
            <div key={i} className="glass-card" style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>{p.description || 'Membership Payment'}</div>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: '#a0b4c4' }}>
                  <span>{p.date || (p.paymentDate && new Date(p.paymentDate).toLocaleDateString('en-IN'))}</span>
                  <span>·</span>
                  <span>{p.method || p.paymentMethod}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: '#86efac', fontSize: '1.1rem' }}>
                  ₹{(p.amount || p.amountInr || 0).toLocaleString('en-IN')}
                </div>
                <span className="badge" style={{ background: 'rgba(134,239,172,0.15)', color: '#86efac', border: '1px solid #86efac' }}>
                  {p.status || p.paymentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUPPORT */}
      {tab === 'support' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Raise a Complaint</h3>
              <form onSubmit={handleComplaintSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input required className="glass-input" placeholder="Subject" value={complaintForm.subject} onChange={e => setComplaintForm({...complaintForm, subject: e.target.value})} />
                <select required className="glass-input" style={{ cursor: 'pointer' }} value={complaintForm.category} onChange={e => setComplaintForm({...complaintForm, category: e.target.value})}>
                  <option value="">Category</option>
                  {['Equipment', 'Cleanliness', 'Trainer', 'Billing', 'Membership', 'General'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <textarea required className="glass-input" rows={4} placeholder="Describe your issue..." style={{ resize: 'vertical' }} value={complaintForm.description} onChange={e => setComplaintForm({...complaintForm, description: e.target.value})} />
                <button type="submit" className="btn-primary">Submit Ticket</button>
              </form>
            </div>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>My Tickets</h3>
              {complaints.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#a0b4c4' }}>
                  <Ticket size={40} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
                  <p style={{ fontSize: '0.875rem' }}>No support tickets raised yet.</p>
                </div>
              ) : complaints.map(c => (
                <div key={c.id} className="glass-card" style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>{c.subject}</span>
                    <span className="badge" style={{ color: c.status === 'OPEN' ? '#ff6b6b' : '#7dd3fc' }}>{c.status}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#a0b4c4' }}>{c.category} · {c.priority} priority</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
