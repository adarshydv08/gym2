import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { CreditCard, Activity, Calendar, Dumbbell, Bell, Ticket, IndianRupee, CheckCircle, Clock, Star, ShoppingCart, AlertCircle, X, ChevronRight } from 'lucide-react';

// ─── No DEMO data. Everything comes from the real API. ───────────────────────

export const MemberPortal = ({ user }) => {
  const [tab, setTab] = useState('dashboard');

  // Real data from API
  const [membership, setMembership] = useState(undefined); // undefined = loading, null = no membership
  const [attendance, setAttendance] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [latestWorkout, setLatestWorkout] = useState(null);
  const [trainerFeedbacks, setTrainerFeedbacks] = useState([]);
  const [managerFeedbacks, setManagerFeedbacks] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [profile, setProfile] = useState(null);

  // UI state
  const [profileForm, setProfileForm] = useState({ weightKg: '', heightCm: '', bloodGroup: '', address: '', emergencyContact: '' });
  const [complaintForm, setComplaintForm] = useState({ subject: '', category: '', description: '' });
  const [purchaseModal, setPurchaseModal] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [dataLoading, setDataLoading] = useState(true);

  const loadData = async () => {
    setDataLoading(true);
    const mid = user?.memberId;
    const uid = user?.userId;

    const promises = [];

    if (mid) {
      // Load member data in parallel
      promises.push(
        apiClient.get(`/members/${mid}`)
          .then(r => {
            const data = r.data || null;
            if (data) {
              setProfile(data);
              setProfileForm({ weightKg: data.weightKg || '', heightCm: data.heightCm || '', bloodGroup: data.bloodGroup || '', address: data.address || '', emergencyContact: data.emergencyContact || '' });
            }
          })
          .catch(() => {}),
        apiClient.get(`/memberships/member/${mid}/active`)
          .then(r => setMembership(r.data || null))
          .catch(() => setMembership(null)),
        apiClient.get(`/attendance/member/${mid}`)
          .then(r => setAttendance(r.data || []))
          .catch(() => setAttendance([])),
        apiClient.get(`/classes/bookings/member/${mid}`)
          .then(r => setBookings(r.data || []))
          .catch(() => setBookings([])),
        apiClient.get(`/payments/member/${mid}`)
          .then(r => setPayments(r.data || []))
          .catch(() => setPayments([])),
        apiClient.get(`/workouts/member/${mid}`)
          .then(r => setWorkouts(r.data || []))
          .catch(() => setWorkouts([])),
        apiClient.get(`/members/${mid}/workout-plan/latest`)
          .then(r => setLatestWorkout(r.data || null))
          .catch(() => setLatestWorkout(null)),
        apiClient.get(`/trainers/member/${mid}/trainer-feedbacks`).then(r => setTrainerFeedbacks(r.data || [])).catch(() => setTrainerFeedbacks([])),
        apiClient.get(`/managers/member/${mid}/manager-feedbacks`).then(r => setManagerFeedbacks(r.data || [])).catch(() => setManagerFeedbacks([])),
        apiClient.get(`/tickets/member/${mid}`)
          .then(r => setComplaints(r.data || []))
          .catch(() => setComplaints([]))
      );
    } else {
      setMembership(null);
    }

    if (uid) {
      promises.push(
        apiClient.get(`/notifications/user/${uid}`)
          .then(r => setNotifications(r.data || []))
          .catch(() => setNotifications([]))
      );
    }

    promises.push(
      apiClient.get('/classes')
        .then(r => setAllClasses(r.data || []))
        .catch(() => setAllClasses([])),
      apiClient.get('/membership-plans')
        .then(r => setAvailablePlans(r.data || []))
        .catch(() => setAvailablePlans([]))
    );

    await Promise.allSettled(promises);
    setDataLoading(false);
  };

  useEffect(() => { loadData(); }, [user]);

  // ─── Handlers ────────────────────────────────────────────────────────────
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
      alert('Ticket raised successfully!');
    } catch (err) {
      alert('Failed to raise ticket: ' + err.message);
    }
  };

  const handleBookClass = async (classId) => {
    if (!user?.memberId) return;
    if (!membership) {
      alert('You need an active membership to book classes.');
      setTab('membership');
      return;
    }
    try {
      await apiClient.post(`/classes/${classId}/book?memberId=${user.memberId}`, {});
      loadData();
      alert('Class booked successfully!');
    } catch (err) {
      alert('Failed to book class: ' + err.message);
    }
  };

  const handlePurchaseMembership = async () => {
    if (!selectedPlan) return;
    setPurchasing(true);
    try {
      await apiClient.post(
        `/memberships/purchase?memberId=${user.memberId}&planId=${selectedPlan.id}&paymentMethod=${encodeURIComponent(paymentMethod)}`,
        {}
      );
      setPurchaseModal(false);
      setSelectedPlan(null);
      loadData();
      alert(`🎉 Membership purchased! Welcome to ${selectedPlan.title}!`);
    } catch (err) {
      alert('Purchase failed: ' + err.message);
    }
    setPurchasing(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user?.userId) return;
    try {
      await apiClient.put(`/members/user/${user.userId}/profile`, profileForm);
      alert("Profile updated successfully!");
      loadData();
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    }
  };

  // ─── Computed values ──────────────────────────────────────────────────────
  const membershipStatus = membership?.status || null;
  const membershipPlanName = membership?.plan?.title || null;
  const membershipEndDate = membership?.endDate || null;
  const membershipDaysLeft = membershipEndDate
    ? Math.max(0, Math.ceil((new Date(membershipEndDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const memberNumber = membership
    ? (user?.memberId ? `IF-2026-${String(user.memberId).padStart(3, '0')}` : 'IF-2026-NEW')
    : null;

  const TABS = ['dashboard', 'profile', 'membership', 'classes', 'attendance', 'workouts', 'payments', 'support'];

  // ─── No Membership CTA ────────────────────────────────────────────────────
  const NoMembershipCard = () => (
    <div style={{
      background: 'linear-gradient(135deg, rgba(200,160,240,0.1) 0%, rgba(125,211,252,0.1) 100%)',
      border: '1px solid rgba(200,160,240,0.3)',
      borderRadius: '20px',
      padding: '2.5rem',
      textAlign: 'center',
      marginBottom: '2rem'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏋️</div>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>
        No Active Membership
      </h3>
      <p style={{ color: '#a0b4c4', marginBottom: '1.5rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
        You don't have an active membership yet. Choose a plan to start your fitness journey at IRONFIT!
      </p>
      <button
        className="btn-primary"
        style={{ padding: '0.875rem 2rem', fontSize: '1rem', fontWeight: 700 }}
        onClick={() => { setTab('membership'); setPurchaseModal(true); }}
      >
        <ShoppingCart size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
        Buy Membership
      </button>
    </div>
  );

  // ─── Purchase Modal ───────────────────────────────────────────────────────
  const PurchaseModal = () => (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(10,14,26,0.88)',
      backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex',
      alignItems: 'flex-start', justifyContent: 'center',
      padding: '2rem 1rem', overflowY: 'auto'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '2rem', position: 'relative', margin: 'auto' }}>
        <button
          onClick={() => { setPurchaseModal(false); setSelectedPlan(null); }}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: '#a0b4c4', cursor: 'pointer' }}
        ><X size={20} /></button>
        <h3 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.5rem' }}>Choose Your Plan</h3>
        <p style={{ color: '#a0b4c4', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Select a membership plan to get started
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {availablePlans.map(plan => {
            const isSelected = selectedPlan?.id === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan)}
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: `1px solid ${isSelected ? '#7dd3fc' : 'rgba(125,211,252,0.15)'}`,
                  background: isSelected ? 'rgba(125,211,252,0.1)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, color: isSelected ? '#7dd3fc' : '#e0e8f0' }}>{plan.title}</span>
                    {plan.isPopular && (
                      <span style={{ background: 'rgba(200,160,240,0.2)', color: '#c8a0f0', border: '1px solid rgba(200,160,240,0.4)', borderRadius: '20px', padding: '0.1rem 0.5rem', fontSize: '0.65rem', fontWeight: 700 }}>
                        POPULAR
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#a0b4c4' }}>{plan.durationMonths} month{plan.durationMonths > 1 ? 's' : ''} · {plan.benefits?.split(',')[0]?.trim()}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#86efac' }}>
                    ₹{Number(plan.priceInr).toLocaleString('en-IN')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {selectedPlan && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#a0b4c4', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>
                Payment Method
              </label>
              <select
                className="glass-input"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div style={{ background: 'rgba(134,239,172,0.08)', border: '1px solid rgba(134,239,172,0.2)', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#a0b4c4' }}>{selectedPlan.title}</span>
                <span style={{ fontWeight: 700 }}>₹{Number(selectedPlan.priceInr).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.35rem', color: '#a0b4c4' }}>
                <span>Duration</span>
                <span>{selectedPlan.durationMonths} month{selectedPlan.durationMonths > 1 ? 's' : ''}</span>
              </div>
            </div>
            <button
              className="btn-primary"
              style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', fontWeight: 700 }}
              onClick={handlePurchaseMembership}
              disabled={purchasing}
            >
              {purchasing ? 'Processing...' : `Pay ₹${Number(selectedPlan.priceInr).toLocaleString('en-IN')} via ${paymentMethod}`}
            </button>
          </>
        )}

        {availablePlans.length === 0 && (
          <p style={{ color: '#a0b4c4', textAlign: 'center', padding: '2rem' }}>Loading plans...</p>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      {purchaseModal && <PurchaseModal />}

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          Welcome back, <span style={{ color: '#7dd3fc' }}>{user?.name?.split(' ')[0] || 'Member'}</span>! 💪
        </h2>
        <p style={{ color: '#a0b4c4', marginTop: '0.25rem' }}>Your personal fitness hub — track, book, and improve.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? 'btn-primary' : 'btn-outline'}
            style={{ textTransform: 'capitalize', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ─────────────────────────────────────────────── */}
      {tab === 'dashboard' && (
        <>
          {dataLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0b4c4' }}>Loading your data...</div>
          ) : membership === null ? (
            <NoMembershipCard />
          ) : (
            /* Digital Membership Card */
            <div style={{
              background: 'linear-gradient(135deg, rgba(125,211,252,0.15) 0%, rgba(200,160,240,0.15) 100%)',
              border: '1px solid rgba(125,211,252,0.3)',
              borderRadius: '20px', padding: '2rem', marginBottom: '2rem',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(125,211,252,0.08)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#a0b4c4', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>IRONFIT FITNESS CLUB</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#7dd3fc', fontWeight: 600 }}>{memberNumber}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#a0b4c4', marginBottom: '0.5rem' }}>Plan</div>
                  <div style={{ fontWeight: 700, color: '#c8a0f0' }}>{membershipPlanName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#a0b4c4', marginTop: '0.25rem' }}>
                    Valid till: {membershipEndDate ? new Date(membershipEndDate).toLocaleDateString('en-IN') : '—'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7dd3fc' }}>{membershipDaysLeft}</div>
                  <div style={{ fontSize: '0.8rem', color: '#a0b4c4' }}>Days Remaining</div>
                </div>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#86efac' }}>{attendance.length}</div>
                  <div style={{ fontSize: '0.8rem', color: '#a0b4c4' }}>Total Visits</div>
                </div>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c8a0f0' }}>{bookings.length}</div>
                  <div style={{ fontSize: '0.8rem', color: '#a0b4c4' }}>Classes Booked</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            {[
              {
                icon: CreditCard,
                label: 'Membership',
                value: membershipStatus || 'None',
                color: membershipStatus === 'ACTIVE' ? '#86efac' : membershipStatus === 'EXPIRING_SOON' ? '#f59e0b' : '#ff6b6b',
                action: () => setTab('membership')
              },
              { icon: Activity, label: 'This Month', value: `${attendance.length} visits`, color: '#7dd3fc', action: () => setTab('attendance') },
              { icon: Calendar, label: 'Booked Classes', value: bookings.length, color: '#c8a0f0', action: () => setTab('classes') },
              { icon: Bell, label: 'Notifications', value: unreadCount || 0, color: '#f59e0b', action: () => {} },
            ].map(card => (
              <button
                key={card.label}
                className="glass-panel"
                onClick={card.action}
                style={{ padding: '1.25rem', textAlign: 'left', cursor: 'pointer', background: 'none', border: '1px solid rgba(125,211,252,0.12)', borderRadius: '16px', transition: 'all 0.2s' }}
              >
                <card.icon size={22} color={card.color} style={{ marginBottom: '0.75rem' }} />
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: card.color }}>{card.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#a0b4c4', marginTop: '0.25rem' }}>{card.label}</div>
              </button>
            ))}
          </div>
          {latestWorkout && (
            <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
              <h4 style={{ margin: 0, fontWeight: 700 }}>Latest Workout Plan</h4>
              <div style={{ color: '#a0b4c4', marginTop: '0.5rem' }}>{latestWorkout.title} · {latestWorkout.goal}</div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>{latestWorkout.notes || 'No notes provided.'}</div>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(latestWorkout.exercises || []).slice(0,3).map(ex => (
                  <div key={ex.id} className="badge" style={{ background: 'rgba(125,211,252,0.06)', border: '1px solid rgba(125,211,252,0.08)', color: '#e0f2fe' }}>{ex.exerciseName} · {ex.sets}x{ex.reps}</div>
                ))}
                { (latestWorkout.exercises || []).length > 3 && <div style={{ color: '#a0b4c4' }}>+{(latestWorkout.exercises || []).length - 3} more</div> }
              </div>
            </div>
          )}
          {(trainerFeedbacks.length > 0 || managerFeedbacks.length > 0) && (
            <div className="glass-panel" style={{ padding: '1rem', marginTop: '1rem' }}>
              <h4 style={{ margin: 0, fontWeight: 800 }}>Feedback</h4>
              {trainerFeedbacks.map(f => (
                <div key={f.id} style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontWeight: 700 }}>{f.trainer?.user?.name || 'Trainer' } · <span style={{ color: '#7dd3fc' }}>{f.rating || '-'/5}</span></div>
                  <div style={{ color: '#a0b4c4' }}>{f.message}</div>
                </div>
              ))}
              {managerFeedbacks.map(f => (
                <div key={f.id} style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontWeight: 700 }}>Manager · <span style={{ color: '#7dd3fc' }}>{new Date(f.createdAt).toLocaleDateString()}</span></div>
                  <div style={{ color: '#a0b4c4' }}>{f.message}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── MEMBERSHIP ─────────────────────────────────────────────── */}
      {tab === 'membership' && (
        <div>
          {membership === null || membership === undefined ? (
            /* New member: no membership */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>
                <AlertCircle size={48} color="#f59e0b" style={{ margin: '0 auto 1rem', display: 'block' }} />
                <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>No Active Membership</h3>
                <p style={{ color: '#a0b4c4', marginBottom: '1.5rem' }}>
                  You don't have an active membership. Choose a plan below to get started!
                </p>
                <button
                  className="btn-primary"
                  style={{ padding: '0.875rem 2rem' }}
                  onClick={() => setPurchaseModal(true)}
                >
                  <ShoppingCart size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Browse & Buy Plans
                </button>
              </div>

              {/* Show available plans */}
              {availablePlans.map(plan => (
                <div key={plan.id} className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
                  {plan.isPopular && (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(200,160,240,0.2)', color: '#c8a0f0', border: '1px solid rgba(200,160,240,0.4)', borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.65rem', fontWeight: 700 }}>
                      POPULAR
                    </div>
                  )}
                  <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{plan.title}</h3>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#86efac', marginBottom: '0.5rem' }}>
                    ₹{Number(plan.priceInr).toLocaleString('en-IN')}
                  </div>
                  <div style={{ color: '#a0b4c4', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {plan.durationMonths} month{plan.durationMonths > 1 ? 's' : ''} · {plan.description}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#7dd3fc', marginBottom: '1.5rem' }}>
                    {plan.benefits?.split(',').map((b, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <CheckCircle size={12} color="#86efac" /> {b.trim()}
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => { setSelectedPlan(plan); setPurchaseModal(true); }}
                  >
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Member has active membership */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Current Membership</h3>
                {[
                  { label: 'Plan', value: membership.plan?.title, color: '#c8a0f0' },
                  { label: 'Status', value: membership.status, color: membership.status === 'ACTIVE' ? '#86efac' : '#f59e0b' },
                  { label: 'Start Date', value: membership.startDate ? new Date(membership.startDate).toLocaleDateString('en-IN') : '—' },
                  { label: 'Valid Until', value: membership.endDate ? new Date(membership.endDate).toLocaleDateString('en-IN') : '—' },
                  { label: 'Days Remaining', value: `${membershipDaysLeft} days`, color: membershipDaysLeft < 10 ? '#ff6b6b' : '#7dd3fc' },
                  { label: 'Amount Paid', value: `₹${Number(membership.amountPaid || 0).toLocaleString('en-IN')}` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#a0b4c4', fontSize: '0.9rem' }}>{item.label}</span>
                    <span style={{ fontWeight: 600, color: item.color || '#e0e8f0' }}>{item.value}</span>
                  </div>
                ))}
                <button
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '1.5rem' }}
                  onClick={() => setPurchaseModal(true)}
                >
                  Renew / Upgrade Membership
                </button>
              </div>

              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Membership Benefits</h3>
                {membership.plan?.benefits?.split(',').map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <CheckCircle size={16} color="#86efac" />
                    <span style={{ color: '#e0e8f0', fontSize: '0.9rem' }}>{b.trim()}</span>
                  </div>
                )) || <p style={{ color: '#a0b4c4' }}>—</p>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CLASSES ─────────────────────────────────────────────────── */}
      {tab === 'classes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>My Booked Classes</h3>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#a0b4c4' }}>
                <Calendar size={40} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
                <p style={{ fontSize: '0.875rem' }}>No classes booked yet.</p>
              </div>
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

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Available Classes</h3>
            {allClasses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#a0b4c4' }}>
                <Dumbbell size={40} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
                <p style={{ fontSize: '0.875rem' }}>No classes scheduled right now.</p>
              </div>
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
                    {membership ? (
                      <button
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                        onClick={() => handleBookClass(cls.id)}
                      >
                        Book
                      </button>
                    ) : (
                      <button
                        className="btn-outline"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                        onClick={() => { setTab('membership'); setPurchaseModal(true); }}
                      >
                        Get Plan
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ATTENDANCE ──────────────────────────────────────────────── */}
      {tab === 'attendance' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Attendance History</h3>
          {attendance.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0b4c4' }}>
              <Activity size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
              <p>No attendance records yet. Start visiting the gym!</p>
            </div>
          ) : attendance.map((a, i) => (
            <div key={i} className="glass-card" style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>
                  {a.date || (a.checkInTime && new Date(a.checkInTime).toLocaleDateString('en-IN'))}
                </div>
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

      {/* ── WORKOUTS ────────────────────────────────────────────────── */}
      {tab === 'workouts' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>My Workout Plans</h3>
          {workouts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0b4c4' }}>
              <Dumbbell size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No workout plans assigned yet</p>
              <p style={{ fontSize: '0.875rem' }}>Your trainer will assign a personalized workout plan to your profile. Check back soon!</p>
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

      {/* ── PAYMENTS ─────────────────────────────────────────────────── */}
      {tab === 'payments' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Payment History</h3>
          {payments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0b4c4' }}>
              <IndianRupee size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No payment history yet</p>
              <p style={{ fontSize: '0.875rem' }}>Your payments will appear here once you purchase a membership.</p>
              {!membership && (
                <button
                  className="btn-primary"
                  style={{ marginTop: '1.25rem', padding: '0.75rem 1.5rem' }}
                  onClick={() => { setTab('membership'); setPurchaseModal(true); }}
                >
                  Buy Membership
                </button>
              )}
            </div>
          ) : payments.map((p, i) => (
            <div key={i} className="glass-card" style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>{p.description || p.membership?.plan?.title || 'Membership Payment'}</div>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: '#a0b4c4' }}>
                  <span>{p.date || (p.paymentDate && new Date(p.paymentDate).toLocaleDateString('en-IN'))}</span>
                  <span>·</span>
                  <span>{p.method || p.paymentMethod}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: '#86efac', fontSize: '1.1rem' }}>
                  ₹{(Number(p.amount || p.amountInr || 0)).toLocaleString('en-IN')}
                </div>
                <span className="badge" style={{ background: 'rgba(134,239,172,0.15)', color: '#86efac', border: '1px solid #86efac' }}>
                  {p.status || p.paymentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── SUPPORT ──────────────────────────────────────────────────── */}
      {tab === 'support' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Raise a Complaint</h3>
            <form onSubmit={handleComplaintSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required className="glass-input" placeholder="Subject" value={complaintForm.subject} onChange={e => setComplaintForm({ ...complaintForm, subject: e.target.value })} />
              <select required className="glass-input" style={{ cursor: 'pointer' }} value={complaintForm.category} onChange={e => setComplaintForm({ ...complaintForm, category: e.target.value })}>
                <option value="">Category</option>
                {['Equipment', 'Cleanliness', 'Trainer', 'Billing', 'Membership', 'General'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <textarea required className="glass-input" rows={4} placeholder="Describe your issue..." style={{ resize: 'vertical' }} value={complaintForm.description} onChange={e => setComplaintForm({ ...complaintForm, description: e.target.value })} />
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
      )}
      {/* ── PROFILE ────────────────────────────────────────────────────── */}
      {tab === 'profile' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>My Profile Details</h3>
          <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0b4c4', marginBottom: '0.5rem' }}>Body Weight (kg)</label>
              <input type="number" step="0.1" className="glass-input" value={profileForm.weightKg} onChange={e => setProfileForm({ ...profileForm, weightKg: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0b4c4', marginBottom: '0.5rem' }}>Height (cm)</label>
              <input type="number" step="0.1" className="glass-input" value={profileForm.heightCm} onChange={e => setProfileForm({ ...profileForm, heightCm: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0b4c4', marginBottom: '0.5rem' }}>Blood Group</label>
              <select className="glass-input" value={profileForm.bloodGroup} onChange={e => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}>
                <option value="">Select Blood Group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0b4c4', marginBottom: '0.5rem' }}>Emergency Contact</label>
              <input type="text" className="glass-input" value={profileForm.emergencyContact} onChange={e => setProfileForm({ ...profileForm, emergencyContact: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0b4c4', marginBottom: '0.5rem' }}>Address</label>
              <input type="text" className="glass-input" value={profileForm.address} onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.875rem 2rem' }}>Update Profile</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
