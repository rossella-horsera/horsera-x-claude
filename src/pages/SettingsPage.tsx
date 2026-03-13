import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockRider } from '../data/mock';

type Section = 'rider' | 'horse' | 'preferences';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>('rider');

  // Rider profile state (local — no persistence in MVP)
  const [riderName, setRiderName] = useState(mockRider.firstName + ' ' + (mockRider.lastName ?? ''));
  const [riderDiscipline, setRiderDiscipline] = useState('Dressage');
  const [riderLevel, setRiderLevel] = useState('Training Level');

  // Horse profile state
  const [horseName, setHorseName] = useState(mockRider.horse);
  const [horseBreed, setHorseBreed] = useState('Warmblood');
  const [horseAge, setHorseAge] = useState('10');

  // Preferences
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [notifications, setNotifications] = useState(true);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: 'rider', label: 'My Profile', icon: '👤' },
    { id: 'horse', label: 'My Horse', icon: '🐴' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  ];

  return (
    <div style={{ background: '#FAF7F3', minHeight: '100%' }}>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #EDE7DF' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            color: '#8C5A3C', fontSize: '13px', fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif", padding: 0, marginBottom: '12px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="#8C5A3C" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          Back
        </button>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 400, color: '#1A140E' }}>
          Settings
        </h1>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '12px 20px 0', background: '#FAF7F3' }}>
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            style={{
              flex: 1, padding: '8px 4px',
              borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: section === s.id ? '#8C5A3C' : '#F0EBE4',
              color: section === s.id ? '#FAF7F3' : '#7A6B5D',
              fontSize: '11px', fontWeight: section === s.id ? 600 : 400,
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ fontSize: '14px', marginBottom: '2px' }}>{s.icon}</div>
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px 20px 100px' }}>

        {/* ── Rider Profile ── */}
        {section === 'rider' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Avatar placeholder */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 2px 8px rgba(26,20,14,0.05)' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'linear-gradient(135deg, #C9A96E 0%, #8C5A3C 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: '24px', color: '#FAF7F3', fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
                  {riderName.charAt(0)}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#1A140E', fontFamily: "'DM Sans', sans-serif" }}>{riderName}</div>
                <div style={{ fontSize: '11px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif", marginTop: '2px' }}>{riderDiscipline} · {riderLevel}</div>
              </div>
              <button style={{ background: '#F0EBE4', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', color: '#7A6B5D', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                Edit photo
              </button>
            </div>

            <FieldCard label="Full name">
              <input value={riderName} onChange={e => setRiderName(e.target.value)} style={inputStyle} />
            </FieldCard>

            <FieldCard label="Discipline">
              <select value={riderDiscipline} onChange={e => setRiderDiscipline(e.target.value)} style={inputStyle}>
                <option>Dressage</option>
                <option>Pony Club</option>
                <option>Trail Riding</option>
                <option>Hunter / Jumper</option>
                <option>Eventing</option>
                <option>Western Dressage</option>
              </select>
            </FieldCard>

            <FieldCard label="Current level">
              <select value={riderLevel} onChange={e => setRiderLevel(e.target.value)} style={inputStyle}>
                <option>Intro Level</option>
                <option>Training Level</option>
                <option>First Level</option>
                <option>Second Level</option>
                <option>Third Level</option>
                <option>Fourth Level</option>
                <option>Prix St. Georges</option>
                <option>Intermediaire</option>
                <option>Grand Prix</option>
              </select>
            </FieldCard>
          </div>
        )}

        {/* ── Horse Profile ── */}
        {section === 'horse' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Horse avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 2px 8px rgba(26,20,14,0.05)' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '14px',
                background: '#F0EBE4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: '28px' }}>🐴</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#1A140E', fontFamily: "'DM Sans', sans-serif" }}>{horseName}</div>
                <div style={{ fontSize: '11px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif", marginTop: '2px' }}>{horseBreed} · {horseAge} years old</div>
              </div>
              <button style={{ background: '#F0EBE4', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', color: '#7A6B5D', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                Edit photo
              </button>
            </div>

            <FieldCard label="Horse name">
              <input value={horseName} onChange={e => setHorseName(e.target.value)} style={inputStyle} />
            </FieldCard>

            <FieldCard label="Breed">
              <input value={horseBreed} onChange={e => setHorseBreed(e.target.value)} placeholder="e.g. Warmblood, Thoroughbred…" style={inputStyle} />
            </FieldCard>

            <FieldCard label="Age">
              <input type="number" value={horseAge} onChange={e => setHorseAge(e.target.value)} min="1" max="35" style={inputStyle} />
            </FieldCard>

            <div style={{
              padding: '12px 14px', background: '#F5F8FF', borderRadius: '12px',
              border: '1px solid rgba(107,127,163,0.15)',
            }}>
              <p style={{ fontSize: '11.5px', color: '#6B7FA3', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, margin: 0 }}>
                Multi-horse profiles are coming soon. Cadence will be able to track your development across different horses.
              </p>
            </div>
          </div>
        )}

        {/* ── Preferences ── */}
        {section === 'preferences' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(26,20,14,0.05)' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #F0EBE4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#1A140E', fontFamily: "'DM Sans', sans-serif" }}>Units</div>
                  <div style={{ fontSize: '11px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif" }}>Distances and measurements</div>
                </div>
                <div style={{ display: 'flex', background: '#F0EBE4', borderRadius: '8px', padding: '3px' }}>
                  {(['metric', 'imperial'] as const).map(u => (
                    <button
                      key={u}
                      onClick={() => setUnits(u)}
                      style={{
                        padding: '4px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                        background: units === u ? '#8C5A3C' : 'transparent',
                        color: units === u ? '#FAF7F3' : '#7A6B5D',
                        fontSize: '11px', fontWeight: 500,
                        fontFamily: "'DM Sans', sans-serif",
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {u === 'metric' ? 'km' : 'mi'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#1A140E', fontFamily: "'DM Sans', sans-serif" }}>Ride reminders</div>
                  <div style={{ fontSize: '11px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif" }}>Nudge me to record after a ride</div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  style={{
                    width: 44, height: 26, borderRadius: '13px',
                    background: notifications ? '#8C5A3C' : '#EDE7DF',
                    border: 'none', cursor: 'pointer',
                    position: 'relative', transition: 'background 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 3,
                    left: notifications ? 21 : 3,
                    width: 20, height: 20, borderRadius: '50%',
                    background: '#FFFFFF',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                    transition: 'left 0.2s ease',
                  }} />
                </button>
              </div>
            </div>

            <div style={{
              padding: '12px 14px', background: '#F5F8FF', borderRadius: '12px',
              border: '1px solid rgba(107,127,163,0.15)',
            }}>
              <p style={{ fontSize: '11.5px', color: '#6B7FA3', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, margin: 0 }}>
                Push notifications require the app to be installed to your home screen. Preferences are saved locally for MVP — cloud sync is coming.
              </p>
            </div>
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          style={{
            marginTop: '24px', width: '100%',
            background: saved ? '#7D9B76' : '#8C5A3C',
            color: '#FAF7F3', border: 'none', borderRadius: '14px',
            padding: '14px', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            transition: 'background 0.2s ease',
          }}
        >
          {saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

// ─── Shared field card ──────────────────────────────────────────────────────

function FieldCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '14px 16px', boxShadow: '0 1px 6px rgba(26,20,14,0.05)' }}>
      <label style={{
        display: 'block', fontSize: '10px', fontWeight: 600,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: '#B5A898', fontFamily: "'DM Sans', sans-serif",
        marginBottom: '8px',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0',
  border: 'none', background: 'transparent',
  fontSize: '14px', color: '#1A140E',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
};
