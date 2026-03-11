import { useState } from 'react';
import ProgressRing from '../components/ui/ProgressRing';
import MilestoneNode from '../components/ui/MilestoneNode';
import CadenceInsightCard from '../components/ui/CadenceInsightCard';
import { mockGoal, mockRider, cadenceInsights } from '../data/mock';
import type { Milestone } from '../data/mock';

export default function JourneyPage() {
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>('ms-001');

  const masteredCount = mockGoal.milestones.filter(m => m.state === 'mastered').length;
  const totalCount = mockGoal.milestones.length;
  const overallProgress = masteredCount / totalCount;
  const activeMilestone = mockGoal.milestones.find(m => m.id === expandedMilestoneId);

  return (
    <div style={{ background: '#FAF7F3', minHeight: '100%' }}>

      {/* ─── Page header ─── */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          fontSize: '10px', fontWeight: 600, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: '#B5A898',
          fontFamily: "'DM Sans', sans-serif", marginBottom: '4px',
        }}>
          Your Journey
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 400, color: '#1A140E', marginBottom: '2px' }}>
              {mockGoal.level}
            </h1>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#B5A898' }}>
              {mockGoal.test} · with {mockRider.horse}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '22px', fontWeight: 500, color: '#8C5A3C' }}>
              {masteredCount}/{totalCount}
            </div>
            <div style={{ fontSize: '10px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif" }}>milestones</div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div style={{ height: '6px', background: '#F0EBE4', borderRadius: '3px', marginBottom: '8px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${overallProgress * 100}%`,
            background: 'linear-gradient(90deg, #8C5A3C, #C9A96E)',
            borderRadius: '3px',
            transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{ fontSize: '11px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif", marginBottom: '20px' }}>
          {mockGoal.milestones.filter(m => m.state === 'mastered').map(m => m.name).join(' · ')} {masteredCount > 0 ? '✓' : ''}
        </div>
      </div>

      {/* ─── Cadence readiness insight ─── */}
      <div style={{ padding: '0 20px 16px' }}>
        <CadenceInsightCard text={cadenceInsights.journey} />
      </div>

      {/* ─── Milestone map ─── */}
      <div style={{ padding: '0 20px' }}>
        <div style={{
          fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: '#B5A898',
          fontFamily: "'DM Sans', sans-serif", marginBottom: '16px',
        }}>
          Milestone Path
        </div>

        {mockGoal.milestones.map((milestone, index) => (
          <div key={milestone.id}>
            <MilestoneNode
              name={milestone.name}
              state={milestone.state}
              ridesConsistent={milestone.ridesConsistent}
              ridesRequired={milestone.ridesRequired}
              isActive={expandedMilestoneId === milestone.id}
              isLast={index === mockGoal.milestones.length - 1}
              onClick={() => setExpandedMilestoneId(
                expandedMilestoneId === milestone.id ? null : milestone.id
              )}
            />

            {expandedMilestoneId === milestone.id && (
              <MilestoneDetail milestone={milestone} />
            )}
          </div>
        ))}
      </div>

      {/* ─── Show prep section ─── */}
      {mockRider.upcomingCompetition && (
        <div style={{ padding: '24px 20px 28px' }}>
          <div style={{ height: '1px', background: '#EDE7DF', marginBottom: '20px' }} />
          <div style={{
            fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#B5A898',
            fontFamily: "'DM Sans', sans-serif", marginBottom: '12px',
          }}>
            Show Prep
          </div>
          <div style={{
            background: '#FFFFFF', borderRadius: '16px', padding: '16px',
            boxShadow: '0 2px 10px rgba(26,20,14,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#1A140E', fontFamily: "'DM Sans', sans-serif" }}>
                  {mockRider.upcomingCompetition.name}
                </div>
                <div style={{ fontSize: '11px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif" }}>
                  {mockRider.upcomingCompetition.tests.join(' & ')}
                </div>
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: '#8C5A3C', fontWeight: 500 }}>
                {mockRider.upcomingCompetition.daysAway}d
              </div>
            </div>

            {[
              { task: 'Entry, halt, salute', state: 'solid' },
              { task: '20m trot circle (both reins)', state: 'consolidating' },
              { task: 'Free walk on long rein', state: 'solid' },
              { task: 'Working canter, 20m circle', state: 'needs-work' },
              { task: 'Return to trot, free walk', state: 'solid' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0',
                borderBottom: i < 4 ? '1px solid #F5F0E8' : 'none',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: item.state === 'solid' ? '#7D9B76' : item.state === 'consolidating' ? '#C9A96E' : '#C4714A',
                }} />
                <span style={{ fontSize: '12.5px', color: '#7A6B5D', flex: 1, fontFamily: "'DM Sans', sans-serif" }}>
                  {item.task}
                </span>
                <span style={{
                  fontSize: '10px', color: '#B5A898',
                  fontFamily: "'DM Sans', sans-serif",
                  textTransform: 'capitalize',
                }}>
                  {item.state.replace('-', ' ')}
                </span>
              </div>
            ))}

            <div style={{
              marginTop: '14px', padding: '10px 12px',
              background: '#F8F3EC', borderRadius: '10px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: '14px' }}>🎬</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#8C5A3C', fontFamily: "'DM Sans', sans-serif" }}>
                  Ride the Test — coming soon
                </div>
                <div style={{ fontSize: '11px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif" }}>
                  Record your full test and get a Judge's Eye report
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Inline expanded milestone detail ───
function MilestoneDetail({ milestone }: { milestone: Milestone }) {
  const [tab, setTab] = useState<'exercises' | 'about'>('exercises');

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '16px',
      marginLeft: '50px',
      marginBottom: '8px',
      marginTop: '-8px',
      boxShadow: '0 2px 10px rgba(26,20,14,0.06)',
      border: '1px solid #F0EBE4',
    }}>
      <div style={{ marginBottom: '14px' }}>
        {[
          { label: 'What you can control', value: milestone.biomechanicsFocus.slice(0, 2).join(', '), color: '#8C5A3C' },
          { label: 'Riding quality', value: milestone.ridingQuality, color: '#C9A96E' },
          { label: 'Performance task', value: milestone.performanceTasks[0], color: '#7D9B76' },
        ].map((layer, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: i < 2 ? '8px' : 0 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: layer.color, flexShrink: 0, marginTop: 4 }} />
            <div>
              <div style={{ fontSize: '9.5px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1px' }}>
                {layer.label}
              </div>
              <div style={{ fontSize: '12.5px', color: '#1A140E', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                {layer.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: '1px', background: '#F0EBE4', marginBottom: '12px' }} />

      <div style={{ display: 'flex', gap: 4, marginBottom: '12px' }}>
        {(['exercises', 'about'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '7px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: tab === t ? '#F0EBE4' : 'transparent',
              fontSize: '12px',
              fontWeight: tab === t ? 600 : 400,
              color: tab === t ? '#8C5A3C' : '#B5A898',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'exercises' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {milestone.exercises.length > 0 ? milestone.exercises.map(ex => (
            <div key={ex.id} style={{
              padding: '10px 12px',
              background: '#FAF7F3',
              borderRadius: '10px',
              border: '1px solid #F0EBE4',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#1A140E', fontFamily: "'DM Sans', sans-serif" }}>
                  {ex.name}
                </span>
                <span style={{
                  fontSize: '10px', color: '#B5A898',
                  background: ex.type === 'on-saddle' ? '#F0EBE4' : '#F0F4F8',
                  padding: '2px 7px', borderRadius: '10px',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {ex.type === 'on-saddle' ? '🐴 in saddle' : '🧘 off saddle'}
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#7A6B5D', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                {ex.description}
              </div>
              <div style={{ marginTop: '4px', fontSize: '10px', color: '#C9A96E', fontFamily: "'DM Mono', monospace" }}>
                {ex.duration}
              </div>
            </div>
          )) : (
            <div style={{ fontSize: '13px', color: '#B5A898', fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', textAlign: 'center', padding: '12px 0' }}>
              Exercises unlock as you progress
            </div>
          )}
        </div>
      )}

      {tab === 'about' && (
        <p style={{ fontSize: '13px', color: '#7A6B5D', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
          {milestone.description}
        </p>
      )}
    </div>
  );
}
