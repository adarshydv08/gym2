import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, X, User, Mail, Phone, Lock, Eye, EyeOff, Shield, Crown, Users } from 'lucide-react';

const ROLES = [
  { id: 'ROLE_OWNER', label: 'Owner', icon: Crown, color: '#c8a0f0', desc: 'Full administrative access' },
  { id: 'ROLE_MANAGER', label: 'Manager', icon: Shield, color: '#88b4cc', desc: 'Operations & staff access' },
  { id: 'ROLE_MEMBER', label: 'Member', icon: Users, color: '#7dd3fc', desc: 'Personal fitness portal' },
];

export const LoginModal = ({ onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('ROLE_MEMBER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ identifier: '', password: '', name: '', email: '', phone: '', confirmPassword: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.identifier, form.password, selectedRole);
        onClose();
      } else {
        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
        await register({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: selectedRole });
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const selectedRoleData = ROLES.find(r => r.id === selectedRole);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,14,26,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 1rem', overflowY: 'auto' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', position: 'relative', animation: 'fadeIn 0.3s ease', margin: 'auto' }}>
        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: '#a0b4c4', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #7dd3fc, #0e4d6e)', borderRadius: '16px', padding: '1rem', boxShadow: '0 0 24px rgba(125,211,252,0.3)' }}>
              <Dumbbell size={32} color="#0a0e1a" />
            </div>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: '1.5rem', background: 'linear-gradient(90deg, #fff, #7dd3fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {mode === 'login' ? 'Welcome Back' : 'Join IRONFIT'}
          </h2>
          <p style={{ color: '#a0b4c4', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            IRONFIT FITNESS CLUB · Civil Lines, Roorkee
          </p>
        </div>

        {/* Role Selector */}
        {mode === 'register' && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#a0b4c4', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.75rem' }}>
              Sign in as
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {ROLES.map(role => {
                const Icon = role.icon;
                const active = selectedRole === role.id;
                return (
                  <button type="button" key={role.id} onClick={() => setSelectedRole(role.id)} style={{ padding: '0.75rem 0.5rem', borderRadius: '10px', border: `1px solid ${active ? role.color : 'rgba(125,211,252,0.12)'}`, background: active ? `rgba(${role.color === '#c8a0f0' ? '200,160,240' : role.color === '#88b4cc' ? '136,180,204' : '125,211,252'},0.15)` : 'transparent', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                    <Icon size={18} color={active ? role.color : '#a0b4c4'} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: active ? role.color : '#a0b4c4' }}>{role.label}</span>
                  </button>
                );
              })}
            </div>
            {selectedRoleData && (
              <p style={{ fontSize: '0.75rem', color: selectedRoleData.color, textAlign: 'center', marginTop: '0.5rem', opacity: 0.8 }}>
                {selectedRoleData.desc}
              </p>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0b4c4' }} />
                <input className="glass-input" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required style={{ paddingLeft: '2.75rem' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0b4c4' }} />
                <input className="glass-input" name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} style={{ paddingLeft: '2.75rem' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0b4c4' }} />
                <input className="glass-input" name="phone" placeholder="+91 Mobile Number" value={form.phone} onChange={handleChange} required style={{ paddingLeft: '2.75rem' }} />
              </div>
            </>
          )}

          {mode === 'login' && (
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0b4c4' }} />
              <input className="glass-input" name="identifier" placeholder="Email or +91 Mobile Number" value={form.identifier} onChange={handleChange} required style={{ paddingLeft: '2.75rem' }} />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0b4c4' }} />
            <input className="glass-input" name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={handleChange} required style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#a0b4c4', cursor: 'pointer' }}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {mode === 'register' && (
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0b4c4' }} />
              <input className="glass-input" name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required style={{ paddingLeft: '2.75rem' }} />
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#ff6b6b', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', width: '100%', padding: '0.875rem' }} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>



        {/* Switch Mode */}
        <p style={{ textAlign: 'center', marginTop: '1.25rem', color: '#a0b4c4', fontSize: '0.875rem' }}>
          {mode === 'login' ? "New to IronFit? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} style={{ background: 'none', border: 'none', color: '#7dd3fc', cursor: 'pointer', fontWeight: 600 }}>
            {mode === 'login' ? 'Create Account' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};
