import { useState, useRef, useEffect } from 'react';
import { mockRider, cadenceInsights } from '../../data/mock';

interface Message {
  role: 'cadence' | 'rider';
  text: string;
  timestamp: string;
}

const suggestedPrompts = [
  'What should I focus on in my next ride?',
  'Why do I keep losing my right stirrup?',
  'Am I ready for the Spring Classic?',
  'Explain my lower leg stability score',
];

const getCadenceResponse = (question: string): string => {
  const q = question.toLowerCase();
  if (q.includes('focus') || q.includes('next ride')) {
    return 'Based on your last 3 rides, I\'d focus on your lower leg stability — specifically the right-rein drift we\'ve been seeing. Try the two-point transitions before each canter. You have a lesson this afternoon, so this is a good thing to mention to Sarah.';
  }
  if (q.includes('stirrup') || q.includes('right')) {
    return 'The right stirrup pattern is interesting — it shows up consistently across 4 of your last 5 rides. It\'s often linked to a subtle rightward hip collapse. Your pelvis levelness score confirms this. The good news: your core stability is mastered, so you have the foundation to fix it. Try this: in your next ride, consciously weight the right stirrup in every downward transition.';
  }
  if (q.includes('ready') || q.includes('spring classic') || q.includes('show')) {
    return 'You have 21 days until the Spring Classic — that\'s actually a good amount of time. Your core stability is mastered, and rein steadiness is consolidating well (4/5 rides consistent). Lower leg stability is your main wild card at 3/5 rides. If you ride 4 times this week with intentional focus on the lower leg, I\'d rate your readiness as "nearly there" by show week. Want me to outline a prep plan?';
  }
  if (q.includes('lower leg') || q.includes('stability score')) {
    return 'Your lower leg stability score is 0.72 — that\'s in the "slight movement" range, improving from 0.55 six weeks ago. The score measures how much your ankle drifts relative to your hip over time. The drift is mainly on the right rein and in transitions. The stirrup-less work you\'ve been doing is helping — it\'s showing in the trend.';
  }
  return 'That\'s a great question. Based on your recent rides and your current focus on Training Level Test 1, I\'d approach it this way: your strongest area right now is core stability, so use that as your anchor point. Build everything else from a solid seat outward. Is there a specific part of your training you\'d like to dig into?';
};

interface CadenceDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CadenceDrawer({ open, onClose }: CadenceDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'cadence',
      text: `Hi ${mockRider.firstName}. I've been watching your recent rides. Your rein steadiness has improved noticeably — and your lower leg is your current focus. What's on your mind today?`,
      timestamp: 'Now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { role: 'rider', text, timestamp: now }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { role: 'cadence', text: getCadenceResponse(text), timestamp: now },
      ]);
    }, 1200);
  };

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(26,20,14,0.4)',
          zIndex: 70,
          transition: 'opacity 0.2s ease',
        }}
      />

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '430px',
          height: '72%',
          background: '#FAF7F3',
          borderRadius: '28px 28px 0 0',
          zIndex: 80,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px', paddingBottom: '4px' }}>
          <div style={{ width: '36px', height: '4px', background: '#EDE7DF', borderRadius: '2px' }} />
        </div>

        <div style={{
          padding: '12px 20px 14px',
          borderBottom: '1px solid #EDE7DF',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '50%',
            background: '#1C1510',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{ width: '15px', height: '15px', borderRadius: '50%', background: '#C9A96E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1C1510' }} />
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 600, color: '#1A140E' }}>Cadence</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#B5A898' }}>Your intelligent riding advisor</div>
          </div>
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              cursor: 'pointer', color: '#B5A898', fontSize: '20px', lineHeight: 1,
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'rider' ? 'flex-end' : 'flex-start',
              }}
            >
              {msg.role === 'cadence' && (
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#6B7FA3', flexShrink: 0, marginRight: 8, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#EEF2F8' }} />
                </div>
              )}
              <div
                style={{
                  maxWidth: '78%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'rider' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                  background: msg.role === 'rider' ? '#8C5A3C' : '#F1F4FA',
                  color: msg.role === 'rider' ? '#FAF7F3' : '#1A140E',
                  fontSize: '13.5px',
                  lineHeight: 1.55,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#6B7FA3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#EEF2F8' }} />
              </div>
              <div style={{ padding: '10px 14px', borderRadius: '4px 16px 16px 16px', background: '#F1F4FA', display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#6B7FA3', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length < 3 && (
          <div style={{ padding: '0 16px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {suggestedPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => sendMessage(p)}
                style={{
                  background: '#F0EBE4',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '11.5px',
                  color: '#7A6B5D',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <div style={{
          padding: '12px 16px 24px',
          borderTop: '1px solid #EDE7DF',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end',
          background: '#FAF7F3',
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask Cadence anything..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1.5px solid #EDE7DF',
              background: '#FFFFFF',
              fontSize: '14px',
              color: '#1A140E',
              fontFamily: "'DM Sans', sans-serif",
              outline: 'none',
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            style={{
              width: 40, height: 40,
              borderRadius: '50%',
              background: input.trim() ? '#8C5A3C' : '#F0EBE4',
              border: 'none',
              cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s ease',
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={input.trim() ? '#FAF7F3' : '#B5A898'} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <style>{`
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-4px); }
          }
        `}</style>
      </div>
    </>
  );
}
