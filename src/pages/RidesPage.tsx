import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockRides, mockGoal } from '../data/mock';
import type { Ride } from '../data/mock';

const signalConfig = {
  improving:   { color: '#7D9B76', symbol: '↑', label: 'Improving' },
  consistent:  { color: '#C9A96E', symbol: '→', label: 'Consistent' },
  'needs-work': { color: '#C4714A', symbol: '↓', label: 'Needs work' },
};

const rideTypeLabel: Record<string, string> = {
  training:    '🐎 Practice',
  lesson:      '👩‍🏫 Lesson',
  practice:    '🐎 Practice',
  'mock-test': '📋 Mock Test',
  hack:        '🌲 Ride Out',
  'ride-out':  '🌲 Ride Out',
};

// ─── Best-clip hero ────────────────────────────────────────────────────────────

function BestClipHero({ ride, onClick }: { ride: Ride; onClick: () => void }) {
  const dateStr = new Date(ride.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const signal = signalConfig[ride.signal];

  return (
    <button
      onClick={onClick}
      aria-label="View your best ride clip"
      style={{
        width: '100%', border: 'none', cursor: 'pointer', padding: 0, display: 'block',
        background: 'transparent',
      }}
    >
      <div style={{
        position: 'relative', height: '190px', overflow: 'hidden',
        background: '#1C1510',
        borderRadius: '0',
      }}>
        {/* Atmospheric warm overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(140,90,60,0.12) 0%, rgba(28,21,16,0.80) 100%)',
        }} />

        {/* Film strip decoration — left */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '18px', background: '#111', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', gap: 0, zIndex: 2 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ width: '10px', height: '8px', background: '#1C1510', borderRadius: '1px' }} />
          ))}
        </div>
        {/* Film strip — right */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '18px', background: '#111', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', zIndex: 2 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ width: '10px', height: '8px', background: '#1C1510', borderRadius: '1px' }} />
          ))}
        </div>

        {/* Badge — top left */}
        <div style={{ position: 'absolute', top: 12, left: 26, zIndex: 3, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(201,169,110,0.90)', fontFamily: "'DM Mono', monospace",
          }}>
            Best clip
          </span>
        </div>

        {/* Duration badge — top right */}
        <div style={{ position: 'absolute', top: 10, right: 26, zIndex: 3, background: 'rgba(201,169,110,0.20)', borderRadius: '6px', padding: '3px 8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#C9A96E', fontFamily: "'DM Mono', monospace" }}>6s</span>
        </div>

        {/* Play button — centered */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3,
        }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'rgba(250,247,243,0.18)',
            backdropFilter: 'blur(6px)',
            border: '1.5px solid rgba(250,247,243,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Play triangle */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M6 4L14 9L6 14V4Z" fill="rgba(250,247,243,0.90)" />
            </svg>
          </div>
        </div>

        {/* Metadata — bottom */}
        <div style={{ position: 'absolute', bottom: 12, left: 26, right: 26, zIndex: 3 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9.5px', color: 'rgba(181,168,152,0.70)', marginBottom: '3px' }}>
            {dateStr} · {ride.duration}min
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: 'rgba(250,247,243,0.85)' }}>
              {ride.focusMilestone}
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: signal.color, fontWeight: 600 }}>
              {signal.symbol} {signal.label}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function RidesPage() {
  const navigate = useNavigate();
  const [showLogForm, setShowLogForm] = useState(false);
  const [logNote, setLogNote] = useState('');
  const [logFocus, setLogFocus] = useState(mockGoal.milestones[0].id);
  const [logDuration, setLogDuration] = useState('45');
  const [logType, setLogType] = useState<'lesson' | 'practice' | 'ride-out'>('practice');
  const [logSubmitted, setLogSubmitted] = useState(false);
  const [logVideoFile, setLogVideoFile] = useState<File | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleLogSubmit = () => {
    setLogSubmitted(true);
    setTimeout(() => {
      setLogSubmitted(false);
      setShowLogForm(false);
      setLogNote('');
      setLogVideoFile(null);
    }, 2000);
  };

  const grouped = mockRides.reduce((acc, ride) => {
    const d = new Date(ride.date);
    const key = d.toLocaleDateString('en', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(ride);
    return acc;
  }, {} as Record<string, Ride[]>);

  const bestClipRide = mockRides.find(r => r.videoUploaded);

  return (
    <div style={{ background: '#FAF7F3', minHeight: '100%' }}>

      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #EDE7DF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 400, color: '#1A140E' }}>
              Rides
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#B5A898' }}>
              {mockRides.length} rides
            </div>
          </div>
          <button
            onClick={() => setShowLogForm(true)}
            style={{
              background: '#8C5A3C', color: '#FAF7F3',
              border: 'none', borderRadius: '12px',
              padding: '10px 16px', fontSize: '13px',
              fontWeight: 600, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span> Record Ride
          </button>
        </div>
      </div>

      {showLogForm && (
        <div style={{
          background: '#FFFFFF', margin: '12px 20px',
          borderRadius: '20px', padding: '20px',
          boxShadow: '0 4px 20px rgba(26,20,14,0.1)',
          border: '1px solid #F0EBE4',
        }}>
          {logSubmitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✓</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#8C5A3C' }}>
                Ride recorded.
              </div>
              <div style={{ fontSize: '12px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif", marginTop: '4px' }}>
                Cadence is analysing...
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#1A140E' }}>Record a Ride</div>
                <button onClick={() => setShowLogForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B5A898', fontSize: '20px' }}>×</button>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#B5A898', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", display: 'block', marginBottom: '8px' }}>Type of ride</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['lesson', 'practice', 'ride-out'] as const).map(type => {
                    const labels = { lesson: '👩‍🏫 Lesson', practice: '🐎 Practice', 'ride-out': '🌲 Ride Out' };
                    return (
                      <button
                        key={type}
                        onClick={() => setLogType(type)}
                        style={{
                          flex: 1, padding: '8px 4px',
                          borderRadius: '10px', border: 'none', cursor: 'pointer',
                          background: logType === type ? '#8C5A3C' : '#F0EBE4',
                          color: logType === type ? '#FAF7F3' : '#7A6B5D',
                          fontSize: '12px', fontWeight: 500,
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {labels[type]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#B5A898', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", display: 'block', marginBottom: '8px' }}>Duration (minutes)</label>
                <input
                  type="number"
                  value={logDuration}
                  onChange={e => setLogDuration(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px',
                    borderRadius: '10px', border: '1.5px solid #EDE7DF',
                    fontSize: '14px', color: '#1A140E',
                    fontFamily: "'DM Mono', monospace",
                    outline: 'none', background: '#FAF7F3',
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#B5A898', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", display: 'block', marginBottom: '8px' }}>
                  Focus {logType === 'practice' ? '(optional)' : ''}
                </label>
                <select
                  value={logFocus}
                  onChange={e => setLogFocus(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px',
                    borderRadius: '10px', border: '1.5px solid #EDE7DF',
                    fontSize: '13px', color: '#1A140E',
                    fontFamily: "'DM Sans', sans-serif",
                    background: '#FAF7F3', outline: 'none',
                  }}
                >
                  <option value="open">I'll see what comes up</option>
                  {mockGoal.milestones.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#B5A898', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", display: 'block', marginBottom: '8px' }}>Reflection (optional)</label>
                <textarea
                  value={logNote}
                  onChange={e => setLogNote(e.target.value)}
                  placeholder="How did the ride feel? What worked, what didn't?"
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 12px',
                    borderRadius: '10px', border: '1.5px solid #EDE7DF',
                    fontSize: '13px', color: '#1A140E',
                    fontFamily: "'DM Sans', sans-serif",
                    background: '#FAF7F3', outline: 'none',
                    resize: 'none', lineHeight: 1.5,
                  }}
                />
              </div>

              <div
                onClick={() => videoInputRef.current?.click()}
                style={{
                  border: `1.5px dashed ${logVideoFile ? '#8C5A3C' : '#EDE7DF'}`,
                  borderRadius: '10px',
                  padding: '14px', textAlign: 'center', marginBottom: '18px',
                  cursor: 'pointer',
                  background: logVideoFile ? 'rgba(140,90,60,0.04)' : 'transparent',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎬</div>
                {logVideoFile ? (
                  <>
                    <div style={{ fontSize: '12px', color: '#8C5A3C', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                      {logVideoFile.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif", marginTop: '2px' }}>
                      Cadence will analyse after saving
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '12px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif" }}>
                      Add a video (optional)
                    </div>
                    <div style={{ fontSize: '11px', color: '#C9A96E', fontFamily: "'DM Sans', sans-serif", marginTop: '2px' }}>
                      Cadence will analyse your position
                    </div>
                  </>
                )}
              </div>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                style={{ display: 'none' }}
                onChange={e => setLogVideoFile(e.target.files?.[0] ?? null)}
              />

              <button
                onClick={handleLogSubmit}
                style={{
                  width: '100%', background: '#8C5A3C', color: '#FAF7F3',
                  border: 'none', borderRadius: '12px', padding: '13px',
                  fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Save &amp; Analyse
              </button>
            </>
          )}
        </div>
      )}

      {bestClipRide && !showLogForm && (
        <BestClipHero ride={bestClipRide} onClick={() => navigate(`/rides/${bestClipRide.id}`)} />
      )}

      <div style={{ padding: '16px 20px 28px' }}>
        {Object.entries(grouped).map(([month, rides]) => (
          <div key={month}>
            <div style={{
              fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#B5A898',
              fontFamily: "'DM Sans', sans-serif", marginBottom: '10px', marginTop: '8px',
            }}>
              {month}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {rides.map(ride => (
                <RideRow key={ride.id} ride={ride} onClick={() => navigate(`/rides/${ride.id}`)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RideRow({ ride, onClick }: { ride: Ride; onClick: () => void }) {
  const signal = signalConfig[ride.signal];
  const d = new Date(ride.date);
  const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  const rideTypeLabel: Record<string, string> = {
    training: '🐎 Training',
    lesson: '👩‍🏫 Lesson',
    'mock-test': '📋 Mock Test',
    hack: '🌳 Hack',
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: '#FFFFFF', borderRadius: '14px', padding: '13px 15px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 2px 8px rgba(26,20,14,0.05)', cursor: 'pointer',
        transition: 'transform 0.1s ease',
      }}
    >
      <div style={{ width: 9, height: 9, borderRadius: '50%', background: signal.color, flexShrink: 0, marginTop: 1 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: '13.5px', fontWeight: 500, color: '#1A140E', fontFamily: "'DM Sans', sans-serif" }}>
            {rideTypeLabel[ride.type]} · {ride.horse}
          </span>
          {ride.videoUploaded && (
            <span style={{ fontSize: '10px', background: '#F0F4F8', color: '#6B7FA3', padding: '2px 6px', borderRadius: '6px', fontFamily: "'DM Sans', sans-serif" }}>
              📹
            </span>
          )}
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10.5px', color: '#B5A898', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {dateStr} · {ride.duration}min · {ride.focusMilestone}
        </div>
      </div>

      <div style={{ textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: '18px', color: signal.color, lineHeight: 1 }}>{signal.symbol}</div>
        <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B5A898', fontFamily: "'DM Sans', sans-serif" }}>
          {signal.label}
        </div>
      </div>

      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <path d="M9 6l6 6-6 6" stroke="#D4C9BC" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    </div>
  );
}
