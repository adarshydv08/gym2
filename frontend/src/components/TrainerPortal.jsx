import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Activity, Clock, Dumbbell, Users, ClipboardList, RefreshCw, Plus, Trash2, Edit3 } from 'lucide-react';

export const TrainerPortal = ({ user }) => {
  const [tab, setTab] = useState('dashboard');
  const [classes, setClasses] = useState([]);
  const [members, setMembers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMemberId, setFeedbackMemberId] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [newPlan, setNewPlan] = useState({ memberId: '', title: '', goal: '', notes: '' });
  const [creating, setCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    const trainerId = user?.trainerId;
    if (!trainerId) {
      setClasses([]);
      setWorkouts([]);
      setLoading(false);
      return;
    }

    try {
      const [classesResponse, workoutsResponse, membersResponse] = await Promise.all([
        apiClient.get(`/trainers/${trainerId}/classes`),
        apiClient.get(`/trainers/${trainerId}/workouts`),
        apiClient.get(`/trainers/${trainerId}/members`)
      ]);
      setClasses(classesResponse.data || []);
      setWorkouts(workoutsResponse.data || []);
      setMembers(membersResponse.data || []);
      // load feedbacks
      apiClient.get(`/trainers/${trainerId}/feedbacks`).then(r => setFeedbacks(r.data || [])).catch(() => setFeedbacks([]));
    } catch (err) {
      console.warn('Trainer portal load failed', err.message);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [user]);

  const handleCreateWorkout = async (e) => {
    e.preventDefault();
    if (!newPlan.memberId || !newPlan.title) {
      setErrorMsg('Member ID and title are required.');
      return;
    }
    setCreating(true);
    setErrorMsg('');
    try {
      await apiClient.post('/workouts', {
        memberId: Number(newPlan.memberId),
        trainerId: user.trainerId,
        title: newPlan.title,
        goal: newPlan.goal,
        notes: newPlan.notes
      });
      setSuccessMsg('Workout plan created successfully.');
      setNewPlan({ memberId: '', title: '', goal: '', notes: '' });
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Unable to create workout plan.');
    }
    setCreating(false);
  };

  const handleDeleteWorkout = async (id) => {
    if (!window.confirm('Delete this workout plan?')) return;
    try {
      await apiClient.delete(`/workouts/${id}`);
      loadData();
      setSuccessMsg('Workout plan deleted.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete workout plan.');
    }
  };

  const assignedMembers = members.length;

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Trainer <span style={{ color: '#88b4cc' }}>Portal</span></h2>
          <p style={{ color: '#a0b4c4', marginTop: '0.25rem' }}>Welcome {user?.name}. Manage classes and workout plans.</p>
        </div>
        <button onClick={loadData} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['dashboard', 'classes', 'workouts'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={tab === t ? 'btn-primary' : 'btn-outline'} style={{ textTransform: 'capitalize', padding: '0.5rem 1.25rem' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {[
              { icon: Users, label: 'Assigned Members', value: assignedMembers, color: '#7dd3fc' },
              { icon: Dumbbell, label: 'Workout Plans', value: workouts.length, color: '#c8a0f0' },
              { icon: Clock, label: 'Scheduled Classes', value: classes.length, color: '#88b4cc' },
              { icon: Activity, label: 'Next Session', value: classes[0]?.dayOfWeek ? `${classes[0].dayOfWeek} ${classes[0].startTime}` : 'TBD', color: '#f9a8d4' },
            ].map(card => (
              <div key={card.label} className="glass-panel" style={{ padding: '1.5rem' }}>
                <card.icon size={24} color={card.color} style={{ marginBottom: '0.75rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: 800, color: card.color }}>{card.value}</div>
                <div style={{ color: '#a0b4c4', fontSize: '0.85rem', marginTop: '0.25rem' }}>{card.label}</div>
              </div>
            ))}
          </div>
          {members.length > 0 && (
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Assigned Members</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {members.slice(0, 4).map(member => (
                  <div key={member.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{member.user?.name || `Member #${member.id}`}</div>
                      <div style={{ color: '#a0b4c4', fontSize: '0.85rem' }}>{member.membershipNumber || 'No membership #'} · {member.status}</div>
                    </div>
                    <div style={{ textAlign: 'right', color: '#7dd3fc', fontWeight: 600 }}>{member.assignedTrainer?.user?.name ? member.assignedTrainer.user.name : 'Assigned'}</div>
                  </div>
                ))}
                {members.length > 4 && (
                  <div style={{ color: '#a0b4c4', fontSize: '0.9rem' }}>+{members.length - 4} more assigned members</div>
                )}
              </div>
            </div>
          )}
          {!loading && workouts.length === 0 && classes.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: '#a0b4c4' }}>No assigned classes or workout plans found yet.</p>
            </div>
          ) : null}
        </>
      )}

      {tab === 'classes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#a0b4c4' }}>Loading classes…</div>
          ) : classes.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#a0b4c4' }}>No classes assigned yet.</div>
          ) : classes.map(cls => (
            <div key={cls.id} className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{cls.title}</h4>
              <p style={{ color: '#7dd3fc', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{cls.category}</p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#a0b4c4' }}>
                <span>{cls.dayOfWeek} · {cls.startTime} - {cls.endTime}</span>
                <span>{cls.capacity} seats</span>
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#a0b4c4' }}>{cls.description}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'workouts' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div>
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: 700 }}>Workout Plans</h3>
                  <p style={{ color: '#a0b4c4', fontSize: '0.9rem' }}>Create, review, and delete plans assigned to your members.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Plus size={16} />
                </div>
              </div>
              {successMsg && <div className="alert success" style={{ marginBottom: '1rem' }}>{successMsg}</div>}
              {errorMsg && <div className="alert error" style={{ marginBottom: '1rem' }}>{errorMsg}</div>}
              {workouts.length === 0 ? (
                <p style={{ color: '#a0b4c4' }}>No workout plans created yet. Use the form to assign a new plan.</p>
              ) : (
                workouts.map(workout => (
                  <div key={workout.id} className="glass-card" style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>{workout.title}</div>
                        <div style={{ color: '#a0b4c4', fontSize: '0.85rem' }}>{workout.goal || 'No goal specified'}</div>
                        <div style={{ color: '#a0b4c4', fontSize: '0.85rem', marginTop: '0.75rem' }}>Member: {workout.member?.user?.name || `#${workout.member?.id}`}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => { setFeedbackMemberId(workout.member?.id); setShowFeedbackModal(true); }} className="btn-outline" style={{ padding: '0.4rem 0.75rem' }}>Give Feedback</button>
                        <button onClick={() => handleDeleteWorkout(workout.id)} className="btn-outline" style={{ borderColor: '#ff6b6b', color: '#ff6b6b', padding: '0.4rem 0.75rem' }}>
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>Recent Feedback</h4>
                {feedbacks.length === 0 ? (
                  <p style={{ color: '#a0b4c4' }}>No feedback submitted yet.</p>
                ) : (
                  <div style={{ display: 'grid', gap: '0.85rem' }}>
                    {feedbacks.slice(0, 5).map(fb => (
                      <div key={fb.id} className="glass-card" style={{ padding: '0.95rem', borderRadius: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                          <div style={{ fontWeight: 700 }}>{fb.member?.user?.name || `Member #${fb.member?.id}`}</div>
                          <div style={{ color: '#86efac', fontWeight: 700 }}>Rating: {fb.rating || 'N/A'}</div>
                        </div>
                        <p style={{ color: '#a0b4c4', marginBottom: '0.5rem' }}>{fb.message || 'No feedback text provided.'}</p>
                        <div style={{ fontSize: '0.8rem', color: '#7dd3fc' }}>Trainer: {fb.trainer?.user?.name || user?.name || 'You'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>New Workout Plan</h3>
            <form onSubmit={handleCreateWorkout} style={{ display: 'grid', gap: '1rem' }}>
              <label>
                Member
                {members.length > 0 ? (
                  <select className="glass-input" value={newPlan.memberId} onChange={e => setNewPlan({ ...newPlan, memberId: e.target.value })}>
                    <option value="">Select member</option>
                    {members.map(member => (
                      <option key={member.id} value={member.id}>{member.user?.name || `Member #${member.id}`}</option>
                    ))}
                  </select>
                ) : (
                  <input className="glass-input" value={newPlan.memberId} onChange={e => setNewPlan({ ...newPlan, memberId: e.target.value })} type="number" placeholder="Member ID" />
                )}
              </label>
              <label>
                Title
                <input className="glass-input" value={newPlan.title} onChange={e => setNewPlan({ ...newPlan, title: e.target.value })} placeholder="e.g. Strength Builder" />
              </label>
              <label>
                Goal
                <input className="glass-input" value={newPlan.goal} onChange={e => setNewPlan({ ...newPlan, goal: e.target.value })} placeholder="e.g. Gain lean muscle" />
              </label>
              <label>
                Notes
                <textarea className="glass-input" value={newPlan.notes} onChange={e => setNewPlan({ ...newPlan, notes: e.target.value })} placeholder="Additional guidance or plan details" rows={4} />
              </label>
              <button type="submit" className="btn-primary" disabled={creating}>
                {creating ? 'Creating...' : 'Create Workout'}
              </button>
            </form>
          </div>
        </div>
      )}

        {showFeedbackModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,14,26,0.85)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '1.25rem' }}>
              <h3 style={{ margin: 0, fontWeight: 800 }}>Add Trainer Feedback</h3>
              <p style={{ color: '#a0b4c4' }}>Provide feedback for member #{feedbackMemberId}</p>
              <textarea className="glass-input" rows={6} value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} placeholder="Write your feedback..." />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
                <label style={{ color: '#a0b4c4' }}>Rating</label>
                <input type="number" min={1} max={5} value={feedbackRating} onChange={e => setFeedbackRating(Number(e.target.value))} className="glass-input" style={{ width: '80px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button className="btn-outline" onClick={() => { setShowFeedbackModal(false); setFeedbackMessage(''); setFeedbackRating(5); setFeedbackMemberId(''); }}>Cancel</button>
                <button className="btn-primary" onClick={async () => {
                  try {
                    await apiClient.post(`/trainers/${user.trainerId}/feedbacks`, { memberId: feedbackMemberId, message: feedbackMessage, rating: feedbackRating });
                    setShowFeedbackModal(false);
                    setFeedbackMessage(''); setFeedbackRating(5); setFeedbackMemberId('');
                    if (user?.trainerId) apiClient.get(`/trainers/${user.trainerId}/feedbacks`).then(r => setFeedbacks(r.data || [])).catch(() => {});
                  } catch (err) { alert('Failed to save feedback: ' + err.message); }
                }}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* feedback list */}
        {feedbacks.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Recent Feedbacks</h4>
            {feedbacks.map(f => (
              <div key={f.id} className="glass-card" style={{ padding: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 700 }}>{f.member?.user?.name || `#${f.member?.id}`} · <span style={{ fontWeight: 600, color: '#7dd3fc' }}>{f.rating || '-'}/5</span></div>
                <div style={{ color: '#a0b4c4', marginTop: '0.35rem' }}>{f.message}</div>
                <div style={{ color: '#a0b4c4', fontSize: '0.8rem', marginTop: '0.35rem' }}>{new Date(f.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};
