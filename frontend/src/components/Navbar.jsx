import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Dumbbell, Shield, User, LogOut, LayoutDashboard, Calendar, Flame, Bell } from 'lucide-react';

export const Navbar = ({ onOpenAuth, activeTab, setActiveTab, onToggleNotifications }) => {
  const { user, logout } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user?.userId) return setUnread(0);
    apiClient.get(`/notifications/user/${user.userId}/unread-count`).then(r => {
      setUnread(r.data?.unreadCount || 0);
    }).catch(() => setUnread(0));
  }, [user]);

  return (
    <nav className="glass-panel" style={{ margin: '1rem 2rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 100 }}>
      {/* Brand & Logo */}
      <div 
        onClick={() => setActiveTab('public')} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
      >
        <div style={{ background: 'linear-gradient(135deg, #7dd3fc 0%, #0e4d6e 100%)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(125, 211, 252, 0.4)' }}>
          <Dumbbell size={24} color="#0a0e1a" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '1px', background: 'linear-gradient(90deg, #ffffff, #7dd3fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            IRONFIT
          </h1>
          <span style={{ fontSize: '0.65rem', color: '#a0b4c4', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginTop: '-2px' }}>
            Fitness Club • Roorkee
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button 
          onClick={() => setActiveTab('public')}
          className={activeTab === 'public' ? 'btn-primary' : 'btn-outline'}
          style={{ border: 'none', background: activeTab === 'public' ? undefined : 'transparent' }}
        >
          Overview
        </button>

        {user && (
          <>
            <button 
              onClick={() => setActiveTab('portal')}
              className={activeTab === 'portal' ? 'btn-primary' : 'btn-outline'}
            >
              <LayoutDashboard size={16} /> My Portal
            </button>

            {(user.activeRole === 'ROLE_OWNER' || user.activeRole === 'ROLE_MANAGER') && (
              <button
                onClick={() => setActiveTab('approvals')}
                className={activeTab === 'approvals' ? 'btn-primary' : 'btn-outline'}
                title="Pending approvals"
              >
                <Shield size={16} /> Approvals
              </button>
            )}
          </>
        )}
      </div>

      {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
              <span className={`badge badge-${user.activeRole === 'ROLE_OWNER' ? 'owner' : user.activeRole === 'ROLE_MANAGER' ? 'manager' : 'member'}`}>
                {user.activeRole ? user.activeRole.replace('ROLE_', '') : 'MEMBER'}
              </span>
            </div>
            <button onClick={onToggleNotifications} className="btn-outline" title="Notifications" style={{ position: 'relative' }}>
              <Bell size={16} />
              {unread > 0 && <span style={{ position: 'absolute', top: -6, right: -6, background: '#ff6b6b', color: '#fff', borderRadius: 8, padding: '0 6px', fontSize: 10 }}>{unread}</span>}
            </button>
            <button 
              onClick={logout} 
              className="btn-outline" 
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', color: '#ff6b6b', borderColor: 'rgba(255, 107, 107, 0.3)' }}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button onClick={onOpenAuth} className="btn-primary">
            <User size={16} /> Login / Register
          </button>
        )}
      </div>
    </nav>
  );
};
