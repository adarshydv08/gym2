import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { PublicWebsite } from './components/PublicWebsite';
import { OwnerPortal } from './components/OwnerPortal';
import { ManagerPortal } from './components/ManagerPortal';
import { MemberPortal } from './components/MemberPortal';
import './index.css';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('public');

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid rgba(125,211,252,0.2)', borderTop: '3px solid #7dd3fc', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#a0b4c4' }}>Loading IRONFIT...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const renderPortal = () => {
    if (!user) return null;
    const role = user.activeRole;
    if (role === 'ROLE_OWNER') return <OwnerPortal user={user} />;
    if (role === 'ROLE_MANAGER') return <ManagerPortal user={user} />;
    return <MemberPortal user={user} />;
  };

  return (
    <>
      <Navbar
        onOpenAuth={() => setShowAuth(true)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'portal' && !user) { setShowAuth(true); return; }
          setActiveTab(tab);
        }}
      />

      <main>
        {/* Auto-navigate logged-in users to portal */}
        {user && activeTab === 'public' && (
          <div style={{ textAlign: 'center', padding: '1rem 2rem', background: 'rgba(125,211,252,0.06)', borderBottom: '1px solid rgba(125,211,252,0.12)' }}>
            <span style={{ color: '#7dd3fc', fontSize: '0.9rem' }}>
              You are logged in as <strong>{user.name}</strong> ({user.activeRole?.replace('ROLE_', '')}).{' '}
              <button onClick={() => setActiveTab('portal')} style={{ background: 'none', border: 'none', color: '#7dd3fc', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>
                Go to your Portal →
              </button>
            </span>
          </div>
        )}

        {activeTab === 'public' && <PublicWebsite onOpenAuth={() => setShowAuth(true)} />}
        {activeTab === 'portal' && user && renderPortal()}
        {activeTab === 'portal' && !user && (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#a0b4c4' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Please sign in to access your portal</h3>
            <button className="btn-primary" onClick={() => setShowAuth(true)}>Sign In</button>
          </div>
        )}
      </main>

      {showAuth && <LoginModal onClose={() => { setShowAuth(false); if (user) setActiveTab('portal'); }} />}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
