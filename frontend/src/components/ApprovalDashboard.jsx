import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const ApprovalDashboard = () => {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/managers/pending-approvals');
      setPending(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await apiClient.put(`/managers/users/${userId}/approve`);
      setPending((p) => p.filter((it) => it.userId !== userId));
    } catch (err) {
      setError(err.message || 'Approve failed');
    }
  };

  const handleReject = async (userId) => {
    try {
      await apiClient.put(`/managers/users/${userId}/reject`);
      setPending((p) => p.filter((it) => it.userId !== userId));
    } catch (err) {
      setError(err.message || 'Reject failed');
    }
  };

  if (!user) return null;

  return (
    <section style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Pending Approvals</h2>
      {loading && <p style={{ color: '#a0b4c4' }}>Loading...</p>}
      {error && <div style={{ color: '#ff6b6b', marginBottom: '0.75rem' }}>{error}</div>}

      {pending.length === 0 && !loading && (
        <div style={{ color: '#9fb3c6' }}>No pending approvals at the moment.</div>
      )}

      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
        {pending.map((p) => (
          <div key={p.userId} className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{p.name} <span style={{ fontWeight: 500, color: '#7dd3fc', marginLeft: '8px' }}>{p.requestedRole?.replace('ROLE_', '')}</span></div>
              <div style={{ color: '#9fb3c6', fontSize: '0.9rem' }}>{p.email} • {p.phone}</div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-primary" onClick={() => handleApprove(p.userId)}>Approve</button>
              <button className="btn-outline" onClick={() => handleReject(p.userId)}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ApprovalDashboard;
