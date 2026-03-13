import { useState, useRef, useEffect, useCallback } from 'react';
import { mockRider, mockGoal, mockRides, cadenceInsights } from '../../data/mock';
import { supabase } from '../../integrations/supabase/client';

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

// ─── Daily message limit ───────────────────────────────────────────────────────
const DAILY_LIMIT = 20;
const LIMIT_KEY = 'cadence_msg_count';
const LIMIT_DATE_KEY = 'cadence_msg_date';

function getRemainingMessages(): number {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem(LIMIT_DATE_KEY);
  if (savedDate !== today) {
    localStorage.setItem(LIMIT_DATE_KEY, today);
    localStorage.setItem(LIMIT_KEY, '0');
    return DAILY_LIMIT;
  }
  const count = parseInt(localStorage.getItem(LIMIT_KEY) ?? '0', 10);
  return Math.max(0, DAILY_LIMIT - count);
}

function incrementMessageCount() {
  const today = new Date().toDateString();
  localStorage.setItem(LIMIT_DATE_KEY, today);
  const count = parseInt(localStorage.getItem(LIMIT_KEY) ?? '0', 10);
  localStorage.setItem(LIMIT_KEY, String(count + 1));
}

// ─── Rider context builder ─────────────────────────────────────────────────────
function buildRiderContext() {
  const activeMilestone = mockGoal.milestones.find(m => m.state === 'working');
  const recentRides = mockRides.slice(0, 5).map(r => ({
    date: new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    focus: r.focusMilestone,
    signal: r.signal,
    reflection: r.reflection,
  }));

  return {
    riderName: mockRider.firstName,
    horse: mockRider.horse,
    trainer: mockRider.trainer ?? 'your trainer',
    activeMilestoneName: activeMilestone?.name ?? 'General Training',
    activeMilestoneNote: activeMilestone?.cadenceNote ?? cadenceInsights.home,
    ridesConsistent: activeMilestone?.ridesConsistent ?? 0,
    ridesRequired: activeMilestone?.ridesRequired ?? 5,
    recentRides,
    upcomingCompetition: mockRider.upcomingCompetition
      ? {
          name: mockRider.upcomingCompetition.name,
          daysAway: mockRider.upcomingCompetition.daysAway,
          level: mockRider.upcomingCompetition.level,
        }
      : undefined,
  };
}

// ─── Fallback (when API unavailable) ──────────────────────────────────────────
const getFallbackResponse = (question: string): string => {
  const q = question.toLowerCase();
  if (q.includes('focus') || q.includes('next ride')) {
    return 'Based on your last 3 rides, I\'d focus on your lower leg stability — specifically the right-rein drift we\'ve been seeing. Try the two-point transitions before each canter.';
  }
  if (q.includes('stirrup') || q.includes('right')) {
    return 'The right stirrup pattern shows up consistently across 4 of your last 5 rides. It\'s often linked to a subtle rightward hip collapse. Your core stability is mastered, so you have the foundation to fix it. Try consciously weighting the right stirrup in every downward transition.';
  }
  if (q.includes('ready') || q.includes('spring classic') || q.includes('show')) {
    return `You have ${mockRider.upcomingCompetition?.daysAway ?? 21} days until the Spring Classic. Your core stability is mastered, and rein steadiness is consolidating well. Lower leg stability is your main wild card. Want me to outline a prep plan?`;
  }
  if (q.includes('lower leg') || q.includes('stability score')) {
    return 'Your lower leg stability is in the "slight movement" range, improving from 6 weeks ago. The drift is mainly on the right rein and in transitions. The stirrup-less work you\'ve been doing is helping — it\'s showing in the trend.';
  }
  return 'That\'s a great question. Your strongest area right now is core stability, so use that as your anchor point. Build everything else from a solid seat outward. Is there a specific part of your training you\'d like to dig into?';
};

interface CadenceDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CadenceDrawer({ open, onClose }: CadenceDrawerProps) {
  const activeMilestone = mockGoal.milestones.find(m => m.state === 'working');
  const openingNote = activeMilestone?.cadenceNote
    ? `Hi ${mockRider.firstName}. ${activeMilestone.cadenceNote} What's on your mind today?`
    : `Hi ${mockRider.firstName}. I've been watching your recent rides. Your rein steadiness has improved noticeably — and your lower leg is your current focus. What's on your mind today?`;

  const [messages, setMessages] = useState<Message[]>([
    { role: 'cadence', text: openingNote, timestamp: 'Now' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [remaining, setRemaining] = useState(getRemainingMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ start: () => void; stop: () => void; abort: () => void; onresult: ((e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void) | null; onerror: (() => void) | null; onend: (() => void) | null } | null>(null);
  // Holds the conversation history in Anthropic message format for context
  const historyRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>([]);

  const toggleVoice = useCallback(() => {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: new () => typeof recognitionRef.current; webkitSpeechRecognition?: new () => typeof recognitionRef.current }).SpeechRecognition
      || (window as unknown as { SpeechRecognition?: new () => typeof recognitionRef.current; webkitSpeechRecognition?: new () => typeof recognitionRef.current }).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  }, [isListening]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { role: 'rider', text, timestamp: now }]);
    setInput('');
    setIsTyping(true);

    // Check daily limit
    if (remaining <= 0) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'cadence',
        text: "You've reached your daily message limit (20 messages). Come back tomorrow — I'll be here.",
        timestamp: now,
      }]);
      return;
    }

    // Add to history
    historyRef.current = [...historyRef.current, { role: 'user', content: text }];

    try {
      // Try the real Cadence API first
      await callCadenceAPI(text, now);
    } catch {
      // Graceful fallback to mock responses
      setIsTyping(false);
      const fallback = getFallbackResponse(text);
      historyRef.current = [...historyRef.current, { role: 'assistant', content: fallback }];
      setMessages(prev => [...prev, { role: 'cadence', text: fallback, timestamp: now }]);
    }
  };

  const callCadenceAPI = async (text: string, timestamp: string) => {
    // Stream from Supabase edge function
    const response = await supabase.functions.invoke('cadence-chat', {
      body: {
        messages: historyRef.current,
        riderContext: buildRiderContext(),
      },
    });

    if (response.error) throw response.error;

    // Supabase functions.invoke doesn't support streaming directly —
    // use fetch for the streaming response instead
    const { data: { session } } = await supabase.auth.getSession();
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

    const fetchResponse = await fetch(`${supabaseUrl}/functions/v1/cadence-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${session?.access_token ?? anonKey}`,
      },
      body: JSON.stringify({
        messages: historyRef.current,
        riderContext: buildRiderContext(),
      }),
    });

    if (!fetchResponse.ok) throw new Error(`HTTP ${fetchResponse.status}`);
    if (!fetchResponse.body) throw new Error('No response body');

    incrementMessageCount();
    setRemaining(getRemainingMessages());

    // Stream the response into a message
    setIsTyping(false);
    let accumulated = '';
    const placeholderTimestamp = timestamp;

    setMessages(prev => [...prev, { role: 'cadence', text: '', timestamp: placeholderTimestamp }]);

    const reader = fetchResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) {
            accumulated += parsed.text;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: 'cadence',
                text: accumulated,
                timestamp: placeholderTimestamp,
              };
              return updated;
            });
          }
        } catch {
          // skip
        }
      }
    }

    if (accumulated) {
      historyRef.current = [...historyRef.current, { role: 'assistant', content: accumulated }];
    }
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
          {remaining <= 5 && remaining > 0 && (
            <div style={{ marginLeft: 'auto', marginRight: '8px', fontSize: '10px', color: '#C4714A', fontFamily: "'DM Mono', monospace" }}>
              {remaining} left today
            </div>
          )}
          <button
            onClick={onClose}
            style={{
              marginLeft: remaining <= 5 && remaining > 0 ? 0 : 'auto',
              background: 'none', border: 'none',
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
                {msg.text || (
                  // Show typing dots while streaming
                  <div style={{ display: 'flex', gap: 4, padding: '2px 0' }}>
                    {[0, 1, 2].map(j => (
                      <div key={j} style={{ width: 6, height: 6, borderRadius: '50%', background: '#6B7FA3', animation: `bounce 1.2s ${j * 0.2}s infinite` }} />
                    ))}
                  </div>
                )}
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
          {/* Voice mic button */}
          <button
            onClick={toggleVoice}
            aria-label={isListening ? 'Stop listening' : 'Speak to Cadence'}
            style={{
              width: 40, height: 40,
              borderRadius: '50%',
              background: isListening ? '#6B7FA3' : '#F0EBE4',
              border: 'none',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s ease',
              flexShrink: 0,
              animation: isListening ? 'cadence-breathe 1.2s ease-in-out infinite' : 'none',
            }}
          >
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
              <rect x="4" y="0" width="6" height="9" rx="3" fill={isListening ? '#FAF7F3' : '#B5A898'} />
              <path d="M1 8C1 11.314 3.686 14 7 14C10.314 14 13 11.314 13 8" stroke={isListening ? '#FAF7F3' : '#B5A898'} strokeWidth="1.5" strokeLinecap="round" />
              <line x1="7" y1="14" x2="7" y2="16" stroke={isListening ? '#FAF7F3' : '#B5A898'} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder={isListening ? 'Listening…' : 'Ask Cadence anything…'}
            disabled={remaining <= 0}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '12px',
              border: `1.5px solid ${isListening ? '#6B7FA3' : '#EDE7DF'}`,
              background: '#FFFFFF',
              fontSize: '14px',
              color: '#1A140E',
              fontFamily: "'DM Sans', sans-serif",
              outline: 'none',
              transition: 'border-color 0.15s ease',
              opacity: remaining <= 0 ? 0.5 : 1,
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={remaining <= 0}
            style={{
              width: 40, height: 40,
              borderRadius: '50%',
              background: input.trim() && remaining > 0 ? '#8C5A3C' : '#F0EBE4',
              border: 'none',
              cursor: input.trim() && remaining > 0 ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s ease',
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={input.trim() && remaining > 0 ? '#FAF7F3' : '#B5A898'} strokeWidth="2" strokeLinecap="round" />
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
