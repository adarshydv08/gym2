import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Bell, Check, X } from 'lucide-react';

export const NotificationCenter = ({ onClose }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user?.userId) return setNotifications([]);
    setLoading(true);
    try {
      const r = await apiClient.get(`/notifications/user/${user.userId}`);
      setNotifications(r.data || []);
    } catch (err) {
      setNotifications([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const markRead = async (id) => {
    try {
      await apiClient.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      // ignore
    }
  };

  return (
    <div style={{ position: 'fixed', right: 16, top: 72, zIndex: 9998, width: 360 }}>
      <div className="glass-panel" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h4 style={{ margin: 0, fontWeight: 800 }}>Notifications</h4>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={load} className="btn-outline">Refresh</button>
            <button onClick={onClose} className="btn-outline"><X size={14} /></button>
          </div>
        </div>

        {loading ? <div style={{ color: '#a0b4c4' }}>Loading…</div> : (
          notifications.length === 0 ? <div style={{ color: '#a0b4c4' }}>No notifications</div> : (
            <div style={{ display: 'grid', gap: 8 }}>
              {notifications.map(n => (
                <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '0.5rem', borderRadius: 8, background: n.isRead ? 'transparent' : 'rgba(125,211,252,0.06)' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{n.title}</div>
                    <div style={{ color: '#a0b4c4', fontSize: '0.85rem' }}>{n.message}</div>
                    <div style={{ fontSize: '0.75rem', color: '#7dd3fc', marginTop: 6 }}>{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {!n.isRead && <button onClick={() => markRead(n.id)} className="btn-primary" title="Mark as read"><Check size={14} /></button>}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
