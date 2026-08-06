import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Dumbbell, Star, Clock, Calendar, Users, ChevronRight, MapPin, Phone, Mail, Zap, Award, TrendingUp, Shield, IndianRupee } from 'lucide-react';

const STATIC_TRAINERS = [
  { id: 1, name: 'Arjun Mehta', specialization: 'Strength & Conditioning', experience_years: 6, rating: 4.9, certifications: 'ACE, CSCS', monthly_rate: 4999 },
  { id: 2, name: 'Pooja Sharma', specialization: 'Yoga & Mobility', experience_years: 5, rating: 4.8, certifications: 'RYT 500 Certified', monthly_rate: 3999 },
  { id: 3, name: 'Vikram Singh', specialization: 'Weight Training & Bodybuilding', experience_years: 8, rating: 4.9, certifications: 'IFBB, K11', monthly_rate: 5999 },
  { id: 4, name: 'Neha Kapoor', specialization: "Women's Fitness & Functional Training", experience_years: 4, rating: 4.7, certifications: 'CrossFit L1, NASM', monthly_rate: 3499 },
];

const STATIC_PLANS = [
  { id: 1, title: 'Monthly Pass', price_inr: 1499, duration_months: 1, benefits: 'Full Gym Access, Locker, Diet Chart', is_popular: false },
  { id: 2, title: 'Quarterly Fitness', price_inr: 3999, duration_months: 3, benefits: 'Full Gym Access, 2 PT Sessions, Group Classes', is_popular: false },
  { id: 3, title: 'Half-Yearly Pro', price_inr: 6999, duration_months: 6, benefits: 'Full Access, Unlimited Classes, Steam & Sauna', is_popular: true },
  { id: 4, title: 'Yearly Champion', price_inr: 11999, duration_months: 12, benefits: 'All Access, 4 PT Sessions/mo, Guest Pass, Merch', is_popular: false },
];

const STATIC_CLASSES = [
  { title: 'Power HIIT', trainer: 'Arjun Mehta', day: 'Monday', time: '7:00 AM', category: 'HIIT', capacity: 20 },
  { title: 'Yoga & Meditation', trainer: 'Pooja Sharma', day: 'Wednesday', time: '6:30 AM', category: 'Yoga', capacity: 25 },
  { title: 'CrossFit Circuit', trainer: 'Vikram Singh', day: 'Friday', time: '6:00 PM', category: 'CrossFit', capacity: 15 },
  { title: "Women's Sculpt", trainer: 'Neha Kapoor', day: 'Tuesday', time: '5:00 PM', category: 'Women Fitness', capacity: 20 },
];

const CATEGORY_COLORS = { HIIT: '#ff6b6b', Yoga: '#c8a0f0', CrossFit: '#7dd3fc', 'Women Fitness': '#f9a8d4' };

export const PublicWebsite = ({ onOpenAuth }) => {
  const [plans, setPlans] = useState(STATIC_PLANS);
  const [trainers, setTrainers] = useState(STATIC_TRAINERS);
  const [classes, setClasses] = useState(STATIC_CLASSES);
  const [counts, setCounts] = useState({ members: 162, classes: 4, trainers: 4 });
  const [appointmentForm, setAppointmentForm] = useState({ name: '', email: '', phone: '', preferredService: '', preferredDate: '', preferredTime: '', message: '' });
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [appointmentError, setAppointmentError] = useState('');

  useEffect(() => {
    apiClient.get('/membership-plans').then(r => { if (r.data?.length) setPlans(r.data); }).catch(() => {});
    apiClient.get('/trainers').then(r => { if (r.data?.length) { setTrainers(r.data); setCounts(counts => ({ ...counts, trainers: r.data.length })); }}).catch(() => {});
    apiClient.get('/classes').then(r => { if (r.data?.length) { setClasses(r.data); setCounts(counts => ({ ...counts, classes: r.data.length })); }}).catch(() => {});
  }, []);

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setAppointmentStatus('');
    setAppointmentError('');

    if (!appointmentForm.name || !appointmentForm.email || !appointmentForm.phone || !appointmentForm.preferredService) {
      setAppointmentError('Please fill in the required fields before submitting.');
      return;
    }

    try {
      await apiClient.post('/appointments', appointmentForm);
      setAppointmentStatus('Appointment request submitted! Our team will contact you soon.');
      setAppointmentForm({ name: '', email: '', phone: '', preferredService: '', preferredDate: '', preferredTime: '', message: '' });
    } catch (err) {
      setAppointmentError(err.message || 'Unable to submit request. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>

      {/* HERO SECTION */}
      <section style={{ textAlign: 'center', padding: '5rem 1rem 4rem', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(125,211,252,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '50px', border: '1px solid rgba(125,211,252,0.25)', background: 'rgba(125,211,252,0.08)', marginBottom: '1.5rem' }}>
          <Zap size={14} color="#7dd3fc" />
          <span style={{ fontSize: '0.8rem', color: '#7dd3fc', fontWeight: 600, letterSpacing: '1px' }}>ROORKEE'S #1 PREMIUM FITNESS CLUB</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
          <span style={{ color: '#e0e8f0' }}>Forge Your </span>
          <span style={{ background: 'linear-gradient(135deg, #7dd3fc, #c8a0f0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Legend</span>
          <br /><span style={{ color: '#e0e8f0' }}>at IRONFIT</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#a0b4c4', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          Premium fitness facility with world-class equipment, expert trainers, and a community that pushes you to your limit. Civil Lines, Roorkee, Uttarakhand.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="tel:+919876543210" className="btn-outline" style={{ padding: '1rem 2rem', fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={16} /> Call Now
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '4rem', maxWidth: '600px', margin: '4rem auto 0' }}>
          {[
            { value: `${counts.members}+`, label: 'Active Members' },
            { value: `${counts.trainers}`, label: 'Expert Trainers' },
            { value: `${counts.classes}`, label: 'Weekly Classes' },
          ].map(stat => (
            <div key={stat.label} className="glass-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7dd3fc' }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#a0b4c4', marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* APPOINTMENT REQUESTS */}
      <section style={{ padding: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Book a <span style={{ color: '#7dd3fc' }}>Free Trial</span>
          </h2>
          <p style={{ color: '#a0b4c4', maxWidth: '700px', margin: '0 auto' }}>Send an appointment request instantly and our team will reach out with booking details.</p>
        </div>
        <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Start with a Personal Consultation</h3>
              <p style={{ color: '#a0b4c4' }}>Tell us what you want, and one of our trainers will contact you to schedule your first session.</p>
            </div>
            <div style={{ background: '#0f172a', borderRadius: '18px', padding: '1.5rem', color: '#e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Zap size={20} color="#7dd3fc" />
                <span style={{ fontWeight: 700 }}>Fast response guaranteed</span>
              </div>
              <p style={{ color: '#a0b4c4' }}>Your request is sent directly to our owner and manager team for immediate follow-up.</p>
            </div>
          </div>
          <form onSubmit={handleAppointmentSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input className="glass-input" type="text" placeholder="Full name" value={appointmentForm.name} onChange={e => setAppointmentForm({ ...appointmentForm, name: e.target.value })} required />
              <input className="glass-input" type="email" placeholder="Email address" value={appointmentForm.email} onChange={e => setAppointmentForm({ ...appointmentForm, email: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input className="glass-input" type="tel" placeholder="Phone number" value={appointmentForm.phone} onChange={e => setAppointmentForm({ ...appointmentForm, phone: e.target.value })} required />
              <input className="glass-input" type="text" placeholder="Preferred service" value={appointmentForm.preferredService} onChange={e => setAppointmentForm({ ...appointmentForm, preferredService: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input className="glass-input" type="date" value={appointmentForm.preferredDate} onChange={e => setAppointmentForm({ ...appointmentForm, preferredDate: e.target.value })} />
              <input className="glass-input" type="time" value={appointmentForm.preferredTime} onChange={e => setAppointmentForm({ ...appointmentForm, preferredTime: e.target.value })} />
            </div>
            <textarea className="glass-input" rows={4} placeholder="Tell us what you'd like to achieve" value={appointmentForm.message} onChange={e => setAppointmentForm({ ...appointmentForm, message: e.target.value })} />
            {appointmentStatus && <div className="alert success">{appointmentStatus}</div>}
            {appointmentError && <div className="alert error">{appointmentError}</div>}
            <button type="submit" className="btn-primary" style={{ width: 'fit-content' }}>Send Request</button>
          </form>
        </div>
      </section>

      {/* MEMBERSHIP PLANS */}
      <section style={{ padding: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Choose Your <span style={{ color: '#7dd3fc' }}>Plan</span>
          </h2>
          <p style={{ color: '#a0b4c4' }}>Transparent pricing in ₹ INR. No hidden fees.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {plans.map(plan => (
            <div key={plan.id} className="glass-panel" style={{ padding: '2rem', position: 'relative', transform: plan.is_popular ? 'scale(1.04)' : 'scale(1)', border: plan.is_popular ? '1px solid rgba(125,211,252,0.5)' : undefined }}>
              {plan.is_popular && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #7dd3fc, #0e4d6e)', padding: '0.25rem 1rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, color: '#0a0e1a', whiteSpace: 'nowrap' }}>
                  ⭐ MOST POPULAR
                </div>
              )}
              <div style={{ marginBottom: '0.5rem', color: '#a0b4c4', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{plan.duration_months} Month{plan.duration_months > 1 ? 's' : ''}</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>{plan.title}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                <IndianRupee size={22} color="#7dd3fc" />
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#7dd3fc' }}>{(plan.price_inr || plan.priceInr || 0).toLocaleString('en-IN')}</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                {(plan.benefits || '').split(',').map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#a0b4c4' }}>
                    <span style={{ color: '#7dd3fc', fontSize: '1rem' }}>✓</span> {b.trim()}
                  </li>
                ))}
              </ul>
              <button className={plan.is_popular ? 'btn-primary' : 'btn-outline'} onClick={onOpenAuth} style={{ width: '100%' }}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TRAINERS */}
      <section style={{ padding: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Meet Your <span style={{ color: '#7dd3fc' }}>Trainers</span>
          </h2>
          <p style={{ color: '#a0b4c4' }}>World-class certified fitness professionals dedicated to your transformation.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {trainers.map((trainer, i) => (
            <div key={trainer.id} className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              {/* Avatar */}
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `linear-gradient(135deg, rgba(125,211,252,0.3), rgba(200,160,240,0.3))`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '2px solid rgba(125,211,252,0.3)', fontSize: '1.75rem', fontWeight: 800, color: '#7dd3fc' }}>
                {trainer.name ? trainer.name.charAt(0) : 'T'}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.35rem' }}>{trainer.name || trainer.user?.name}</h3>
              <p style={{ color: '#7dd3fc', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>{trainer.specialization}</p>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem' }}>
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <span style={{ fontWeight: 700, color: '#f59e0b' }}>{trainer.rating || trainer.experienceYears}</span>
                <span style={{ color: '#a0b4c4', fontSize: '0.8rem' }}>· {trainer.experience_years || trainer.experienceYears}yr exp</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#a0b4c4', marginBottom: '1.25rem' }}>{trainer.certifications}</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ color: '#a0b4c4', fontSize: '0.75rem' }}>from</span>
                <IndianRupee size={14} color="#7dd3fc" />
                <span style={{ fontWeight: 700, color: '#7dd3fc' }}>{(trainer.monthly_rate || trainer.monthlyRate || 2999).toLocaleString('en-IN')}</span>
                <span style={{ color: '#a0b4c4', fontSize: '0.75rem' }}>/mo</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CLASS SCHEDULE */}
      <section style={{ padding: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Class <span style={{ color: '#7dd3fc' }}>Schedule</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {classes.map((cls, i) => {
            const color = CATEGORY_COLORS[cls.category] || '#7dd3fc';
            return (
              <div key={i} className="glass-panel" style={{ padding: '1.5rem', borderLeft: `3px solid ${color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontWeight: 700 }}>{cls.title}</h3>
                  <span style={{ background: `rgba(${color === '#ff6b6b' ? '255,107,107' : color === '#c8a0f0' ? '200,160,240' : color === '#7dd3fc' ? '125,211,252' : '249,168,212'},0.2)`, color, padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700 }}>
                    {cls.category}
                  </span>
                </div>
                <p style={{ color: '#a0b4c4', fontSize: '0.85rem', marginBottom: '0.75rem' }}>with {cls.trainer?.user?.name || cls.trainer || 'Staff'}</p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#a0b4c4' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={13} /> {cls.dayOfWeek || cls.day} · {cls.startTime || cls.time}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Users size={13} /> {cls.capacity} seats</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* GYM INFO */}
      <section style={{ padding: '4rem 0 6rem' }}>
        <div className="glass-panel" style={{ padding: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div>
            <MapPin size={28} color="#7dd3fc" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
            <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Location</h4>
            <p style={{ color: '#a0b4c4', fontSize: '0.9rem' }}>Civil Lines, Roorkee<br />Uttarakhand - 247667</p>
          </div>
          <div>
            <Clock size={28} color="#7dd3fc" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
            <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Hours</h4>
            <p style={{ color: '#a0b4c4', fontSize: '0.9rem' }}>Mon–Sat: 5:00 AM – 10:00 PM<br />Sunday: 6:00 AM – 1:00 PM</p>
          </div>
          <div>
            <Phone size={28} color="#7dd3fc" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
            <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Contact</h4>
            <p style={{ color: '#a0b4c4', fontSize: '0.9rem' }}>+91 98765 43210<br />support@ironfit.in</p>
          </div>
        </div>
      </section>
    </div>
  );
};
