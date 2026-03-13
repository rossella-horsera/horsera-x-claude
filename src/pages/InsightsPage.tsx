import { useState } from 'react';
import { biometricsTrend, cadenceInsights, mockRides } from '../data/mock';
import CadenceInsightCard from '../components/ui/CadenceInsightCard';

type TabId = 'position' | 'scales' | 'patterns';

const METRIC_CONFIG = [
  { key: 'lowerLeg',   label: 'Lower Leg',   color: '#8C5A3C' },
  { key: 'reins',      label: 'Reins',        color: '#C9A96E' },
  { key: 'core',       label: 'Core',         color: '#7D9B76' },
  { key: 'upperBody',  label: 'Upper Body',   color: '#6B7FA3' },
  { key: 'pelvis',     label: 'Pelvis',       color: '#B5A898' },
] as const;

type MetricKey = typeof METRIC_CONFIG[number]['key'];

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const w = 80, h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 0.01;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {data.length > 0 && (() => {
        const last = data[data.length - 1];
        const x = w;
        const y = h - ((last - min) / range) * (h - 4) - 2;
        return <circle cx={x} cy={y} r="2.5" fill={color} />;
      })()}
    </svg>
  );
}

function TrendChart({
  data,
  activeMetrics,
}: {
  data: typeof biometricsTrend;
  activeMetrics: Set<MetricKey>;
}) {
  const W = 320, H = 140;
  const padL = 28, padR = 8, padT = 8, padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const yTicks = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

  const xPos = (i: number) => padL + (i / (data.length - 1)) * chartW;
  const yPos = (v: number) => padT + chartH - ((v - 0.5) / 0.5) * chartH;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{ overflow: 'visible', display: 'block' }}
    >
      {yTicks.map(t => (
        <g key={t}>
          <line
            x1={padL} y1={yPos(t)} x2={W - padR} y2={yPos(t)}
            stroke="#EDE7DF" strokeWidth="0.8"
          />
          <text
            x={padL - 4} y={yPos(t) + 4}
            fontSize="8" fill="#B5A898" textAnchor="end"
            fontFamily="'DM Mono', monospace"
          >
            {Math.round(t * 100)}
          </text>
        </g>
      ))}

      {data.map((d, i) => (
        <text
          key={i}
          x={xPos(i)} y={H - 4}
          fontSize="7.5" fill="#B5A898" textAnchor="middle"
          fontFamily="'DM Sans', sans-serif"
        >
          {d.date.replace('Feb ', 'F').replace('Mar ', 'M')}
        </text>
      ))}

      {METRIC_CONFIG.map(({ key, color }) => {
        if (!activeMetrics.has(key)) return null;
        const pts = data.map((d, i) =>
          `${xPos(i)},${yPos((d as unknown as Record<string, number>)[key])}`
        ).join(' ');
        return (
          <g key={key}>
            <polyline
              points={pts}
              fill="none"
              stroke={color}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((d, i) => (
              <circle
                key={i}
                cx={xPos(i)}
                cy={yPos((d as unknown as Record<string, number>)[key])}
                r="2"
                fill={color}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function MetricSummaryRow({ metricKey, label, color, data }: {
  metricKey: MetricKey;
  label: string;
  color: string;
  data: typeof biometricsTrend;
}) {
  const values = data.map(d => (d as unknown as Record<string, number>)[metricKey]);
  const latest = values[values.length - 1];
  const first = values[0];
  const delta = latest - first;
  const latestPct = Math.round(latest * 100);
  const deltaPct = Math.round(delta * 100);
  const trend = delta > 0.02 ? 'up' : delta < -0.02 ? 'down' : 'flat';

  const trendColor = trend === 'up' ? '#7D9B76' : trend === 'down' ? '#C4714A' : '#C9A96E';
  const trendSymbol = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #F0EBE4' }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12.5px', color: '#1A140E', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
          {label}
        </div>
        <div style={{ fontSize: '10px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif" }}>
          {latestPct}% · <span style={{ color: trendColor }}>{trendSymbol} {Math.abs(deltaPct)}pts since Feb</span>
        </div>
      </div>
      <SparkLine data={values} color={color} />
    </div>
  );
}

function PatternsTab() {
  const signalCounts = { improving: 0, consistent: 0, 'needs-work': 0 };
  mockRides.forEach(r => signalCounts[r.signal]++);
  const total = mockRides.length;

  const patterns = [
    {
      icon: '🔁',
      title: 'Right-rein drift',
      detail: 'Your lower leg tends to drift forward on the right rein — visible in 4 of your last 5 rides.',
      color: '#C4714A',
      tag: 'Persistent',
    },
    {
      icon: '⏱',
      title: 'Warm-up pattern',
      detail: 'Rein steadiness consistently improves in the second half of every ride.',
      color: '#C9A96E',
      tag: 'Consistent',
    },
    {
      icon: '✓',
      title: 'Core is solid',
      detail: 'Core stability scores have been above 85% for 6 consecutive rides. This is mastered.',
      color: '#7D9B76',
      tag: 'Mastered',
    },
    {
      icon: '📈',
      title: '4-week trajectory',
      detail: 'All 5 biometric areas have improved over the past 4 weeks. Lower leg shows the most growth (+17pts).',
      color: '#8C5A3C',
      tag: 'Positive',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 10px rgba(26,20,14,0.05)' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: '#B5A898', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", marginBottom: '12px' }}>
          Ride Signals — Last {total} Rides
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: 'Improving', count: signalCounts.improving, color: '#7D9B76', symbol: '↑' },
            { label: 'Consistent', count: signalCounts.consistent, color: '#C9A96E', symbol: '→' },
            { label: 'Needs work', count: signalCounts['needs-work'], color: '#C4714A', symbol: '↓' },
          ].map(({ label, count, color, symbol }) => (
            <div key={label} style={{ flex: 1, textAlign: 'center', background: '#FAF7F3', borderRadius: '10px', padding: '10px 4px' }}>
              <div style={{ fontSize: '20px', color, marginBottom: '2px' }}>{symbol}</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#1A140E', fontFamily: "'DM Mono', monospace" }}>{count}</div>
              <div style={{ fontSize: '9px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {patterns.map((p, i) => (
        <div key={i} style={{
          background: '#FFFFFF', borderRadius: '16px', padding: '14px 16px',
          boxShadow: '0 2px 10px rgba(26,20,14,0.05)',
          borderLeft: `3px solid ${p.color}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
            <span style={{ fontSize: '14px' }}>{p.icon}</span>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1A140E', fontFamily: "'DM Sans', sans-serif" }}>
              {p.title}
            </span>
            <span style={{
              marginLeft: 'auto', fontSize: '9px', fontWeight: 600,
              color: p.color, background: `${p.color}18`,
              padding: '2px 7px', borderRadius: '6px',
              fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.06em',
            }}>
              {p.tag}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#7A6B5D', lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
            {p.detail}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('position');
  const [activeMetrics, setActiveMetrics] = useState<Set<MetricKey>>(
    new Set(['lowerLeg', 'reins', 'core'])
  );

  const toggleMetric = (key: MetricKey) => {
    setActiveMetrics(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const latest = biometricsTrend[biometricsTrend.length - 1];
  const overallScore = Math.round(
    ((latest.lowerLeg + latest.reins + latest.core + latest.upperBody + latest.pelvis) / 5) * 100
  );

  const tabs: { id: TabId; label: string }[] = [
    { id: 'position', label: 'Your Position' },
    { id: 'scales', label: 'The Scales' },
    { id: 'patterns', label: 'Patterns' },
  ];

  return (
    <div style={{ background: '#FAF7F3', minHeight: '100%' }}>

      <div style={{ padding: '20px 20px 0' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 400, color: '#1A140E', marginBottom: '4px' }}>
          Insights
        </h1>
        <p style={{ fontSize: '12px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif", margin: '0 0 16px' }}>
          4-week position overview
        </p>

        <div style={{
          background: '#FFFFFF', borderRadius: '14px', padding: '12px 16px',
          boxShadow: '0 2px 8px rgba(26,20,14,0.06)', marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B5A898', fontFamily: "'DM Sans', sans-serif", marginBottom: '2px' }}>
              Development Readiness
            </div>
            <div style={{ fontSize: '11.5px', color: '#7A6B5D', fontFamily: "'DM Sans', sans-serif" }}>
              How ready you are to progress to the next milestone
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '22px', fontWeight: 500, color: '#8C5A3C', lineHeight: 1 }}>
              {overallScore}%
            </div>
            <div style={{ fontSize: '10px', color: '#7D9B76', fontFamily: "'DM Sans', sans-serif", marginTop: '2px' }}>
              ↑ 4wk
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        <CadenceInsightCard text={cadenceInsights.insights} />

        <div style={{
          display: 'flex', gap: '4px',
          background: '#F0EBE4', borderRadius: '12px', padding: '4px',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '7px 4px',
                background: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                border: 'none', borderRadius: '9px', cursor: 'pointer',
                fontSize: '12px', fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? '#8C5A3C' : '#B5A898',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.15s ease',
                boxShadow: activeTab === tab.id ? '0 1px 4px rgba(26,20,14,0.08)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'position' && (
          <>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {METRIC_CONFIG.map(({ key, label, color }) => {
                const active = activeMetrics.has(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleMetric(key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '4px 10px', borderRadius: '20px', cursor: 'pointer',
                      border: `1.5px solid ${active ? color : '#EDE7DF'}`,
                      background: active ? `${color}18` : '#FFFFFF',
                      fontSize: '11px', fontFamily: "'DM Sans', sans-serif",
                      color: active ? color : '#B5A898',
                      fontWeight: active ? 600 : 400,
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: active ? color : '#EDE7DF' }} />
                    {label}
                  </button>
                );
              })}
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 10px rgba(26,20,14,0.05)' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#B5A898', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", marginBottom: '12px' }}>
                Readiness Over Time (0–100%)
              </div>
              <TrendChart data={biometricsTrend} activeMetrics={activeMetrics} />
              <div style={{ fontSize: '9px', color: '#B5A898', fontFamily: "'DM Mono', monospace", marginTop: '8px', textAlign: 'right' }}>
                AI-assisted · Sample data
              </div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '14px 16px', boxShadow: '0 2px 10px rgba(26,20,14,0.05)' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#B5A898', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", marginBottom: '4px' }}>
                Latest Snapshot
              </div>
              {METRIC_CONFIG.map(({ key, label, color }) => (
                <MetricSummaryRow key={key} metricKey={key} label={label} color={color} data={biometricsTrend} />
              ))}
            </div>
          </>
        )}

        {activeTab === 'scales' && (() => {
          const last = biometricsTrend[biometricsTrend.length - 1];
          const prev = biometricsTrend[0];
          const scalesDefs = [
            {
              name: 'Rhythm',
              description: 'Regularity and tempo of footfalls',
              value: (last.lowerLeg + last.core) / 2,
              prevValue: (prev.lowerLeg + prev.core) / 2,
              color: '#8C5A3C',
            },
            {
              name: 'Relaxation',
              description: 'Suppleness and freedom from tension',
              value: (last.pelvis + last.upperBody) / 2,
              prevValue: (prev.pelvis + prev.upperBody) / 2,
              color: '#C9A96E',
            },
            {
              name: 'Contact',
              description: 'Steady, elastic connection with the bit',
              value: (last.reins + last.pelvis) / 2,
              prevValue: (prev.reins + prev.pelvis) / 2,
              color: '#7D9B76',
            },
            {
              name: 'Impulsion',
              description: 'Energy and thrust from the hindquarters',
              value: (last.core + last.lowerLeg) / 2,
              prevValue: (prev.core + prev.lowerLeg) / 2,
              color: '#6B7FA3',
            },
            {
              name: 'Straightness',
              description: 'Alignment of the horse on straight and curved lines',
              value: (last.reins + last.upperBody) / 2,
              prevValue: (prev.reins + prev.upperBody) / 2,
              color: '#C4714A',
            },
            {
              name: 'Balance',
              description: 'Distribution of weight, engagement of hindquarters',
              value: (last.core + last.upperBody + last.pelvis) / 3,
              prevValue: (prev.core + prev.upperBody + prev.pelvis) / 3,
              color: '#B5A898',
            },
          ];

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px 14px', background: '#EEF2F8', borderRadius: '12px', border: '1px solid rgba(107,127,163,0.15)' }}>
                <p style={{ fontSize: '11.5px', color: '#6B7FA3', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, margin: 0 }}>
                  The USDF Scales of Training — derived from your biomechanics data. These build on each other from the ground up.
                </p>
              </div>

              {scalesDefs.map((scale, idx) => {
                const pct = Math.round(scale.value * 100);
                const delta = Math.round((scale.value - scale.prevValue) * 100);
                const trend = delta > 2 ? 'up' : delta < -2 ? 'down' : 'flat';
                const trendColor = trend === 'up' ? '#7D9B76' : trend === 'down' ? '#C4714A' : '#B5A898';
                const trendSymbol = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
                return (
                  <div key={scale.name} style={{
                    background: '#FFFFFF', borderRadius: '16px', padding: '14px 16px',
                    boxShadow: '0 2px 10px rgba(26,20,14,0.05)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%',
                        background: `${scale.color}18`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', fontWeight: 600, color: scale.color }}>{idx + 1}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#1A140E' }}>{scale.name}</div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#B5A898' }}>{scale.description}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '18px', fontWeight: 500, color: scale.color, lineHeight: 1 }}>{pct}%</div>
                        <div style={{ fontSize: '9px', color: trendColor, fontFamily: "'DM Sans', sans-serif", marginTop: '2px' }}>
                          {trendSymbol} {Math.abs(delta)}pts
                        </div>
                      </div>
                    </div>
                    <div style={{ height: '5px', background: '#F0EBE4', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: scale.color, borderRadius: '3px' }} />
                    </div>
                  </div>
                );
              })}

              <div style={{ padding: '10px 14px', background: '#FAF7F3', borderRadius: '12px', border: '1px solid #EDE7DF' }}>
                <p style={{ fontSize: '10.5px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, margin: 0 }}>
                  Scores are derived from your biomechanics data. They update as you record more rides. Video analysis increases accuracy.
                </p>
              </div>
            </div>
          );
        })()}

        {activeTab === 'patterns' && <PatternsTab />}

      </div>
    </div>
  );
}
