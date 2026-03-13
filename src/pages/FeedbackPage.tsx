import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';

interface FeedbackLink {
  id: string;
  ride_id: string;
  rider_name: string;
  ride_date: string;
  ride_focus: string;
  ride_duration: number | null;
  rider_reflection: string | null;
  trainer_feedback: string | null;
  trainer_name: string | null;
}

type State = 'loading' | 'ready' | 'submitted' | 'already-submitted' | 'error';

export default function FeedbackPage() {
  const { linkId } = useParams<{ linkId: string }>();
  const [state, setState] = useState<State>('loading');
  const [link, setLink] = useState<FeedbackLink | null>(null);
  const [trainerName, setTrainerName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!linkId) { setState('error'); return; }
    loadLink(linkId);
  }, [linkId]);

  const loadLink = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('feedback_links')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) { setState('error'); return; }
      setLink(data as FeedbackLink);
      setState(data.trainer_feedback ? 'already-submitted' : 'ready');
    } catch {
      setState('error');
    }
  };

  const handleSubmit = async () => {
    if (!linkId || !feedback.trim() || !link) return;
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('feedback_links')
        .update({
          trainer_name: trainerName.trim() || 'Your trainer',
          trainer_feedback: feedback.trim(),
          submitted_at: new Date().toISOString(),
        })
        .eq('id', linkId);

      if (error) throw error;
      setState('submitted');
    } catch {
      setSubmitting(false);
      alert('Something went wrong. Please try again.');
    }
  };

  const fontFamily = "'DM Sans', -apple-system, sans-serif";

  return (
    <div style={{
      minHeight: '100vh', background: '#FAF7F3',
      fontFamily,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '32px 20px 60px',
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing: border-box; }`}</style>

      {/* Wordmark */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <img src="/horsera-logo.png" alt="Horsera" style={{ height: '28px', width: 'auto' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '480px' }}>

        {state === 'loading' && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#B5A898', fontSize: '13px' }}>
            Loading...
          </div>
        )}

        {state === 'error' && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#1A140E', marginBottom: '10px' }}>
              Link not found
            </p>
            <p style={{ fontSize: '13px', color: '#B5A898' }}>
              This feedback link may have expired or is invalid.
            </p>
          </div>
        )}

        {state === 'already-submitted' && link && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#1A140E', marginBottom: '8px' }}>
              Feedback already submitted
            </p>
            <p style={{ fontSize: '13px', color: '#7A6B5D', lineHeight: 1.6 }}>
              You've already submitted feedback for {link.rider_name}'s ride on {link.ride_date}.
              They can see your notes in their Horsera app.
            </p>
          </div>
        )}

        {state === 'submitted' && link && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#8C5A3C', marginBottom: '8px' }}>
              Feedback sent
            </p>
            <p style={{ fontSize: '13px', color: '#7A6B5D', lineHeight: 1.6 }}>
              Your notes have been sent to {link.rider_name}. They'll see your feedback in their Horsera app next time they open it.
            </p>
          </div>
        )}

        {state === 'ready' && link && (
          <>
            <p style={{ fontSize: '13px', color: '#7A6B5D', marginBottom: '24px', lineHeight: 1.6 }}>
              <strong style={{ color: '#1A140E' }}>{link.rider_name}</strong> has invited you to add feedback on their ride.
            </p>

            {/* Ride summary card */}
            <div style={{
              background: '#FFFFFF', borderRadius: '16px', padding: '16px',
              boxShadow: '0 2px 10px rgba(26,20,14,0.06)',
              borderLeft: '4px solid #C9A96E',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#C9A96E', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Ride summary
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#1A140E', marginBottom: '4px' }}>
                {link.ride_date}
              </div>
              <div style={{ fontSize: '11px', color: '#B5A898', fontFamily: "'DM Mono', monospace", marginBottom: '10px' }}>
                {link.ride_focus}{link.ride_duration ? ` · ${link.ride_duration} min` : ''}
              </div>
              {link.rider_reflection && (
                <>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: '#B5A898', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '5px' }}>
                    Rider's reflection
                  </div>
                  <p style={{ fontSize: '13px', color: '#7A6B5D', lineHeight: 1.6, fontStyle: 'italic' }}>
                    "{link.rider_reflection}"
                  </p>
                </>
              )}
            </div>

            {/* Trainer name */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#B5A898', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '7px' }}>
                Your name (optional)
              </label>
              <input
                value={trainerName}
                onChange={e => setTrainerName(e.target.value)}
                placeholder="e.g. Sarah Mitchell"
                style={{
                  width: '100%', padding: '10px 14px',
                  borderRadius: '10px', border: '1.5px solid #EDE7DF',
                  fontSize: '14px', color: '#1A140E', fontFamily,
                  background: '#FFFFFF', outline: 'none',
                }}
              />
            </div>

            {/* Feedback */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#B5A898', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '7px' }}>
                Your feedback
              </label>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value.slice(0, 500))}
                placeholder="What did you observe? What should they focus on next session?"
                rows={5}
                style={{
                  width: '100%', padding: '12px 14px',
                  borderRadius: '10px', border: '1.5px solid #EDE7DF',
                  fontSize: '14px', color: '#1A140E', fontFamily,
                  background: '#FFFFFF', outline: 'none',
                  resize: 'vertical', lineHeight: 1.55,
                }}
              />
              <div style={{ textAlign: 'right', fontSize: '10px', color: feedback.length > 450 ? '#C4714A' : '#B5A898', marginTop: '4px', fontFamily: "'DM Mono', monospace" }}>
                {feedback.length}/500
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!feedback.trim() || submitting}
              style={{
                width: '100%', padding: '14px',
                background: feedback.trim() && !submitting ? '#8C5A3C' : '#EDE7DF',
                color: feedback.trim() && !submitting ? '#FAF7F3' : '#B5A898',
                border: 'none', borderRadius: '14px',
                fontSize: '14px', fontWeight: 600, cursor: feedback.trim() && !submitting ? 'pointer' : 'not-allowed',
                fontFamily, transition: 'background 0.15s ease',
              }}
            >
              {submitting ? 'Sending…' : `Send feedback to ${link.rider_name}`}
            </button>

            <p style={{ fontSize: '10.5px', color: '#B5A898', textAlign: 'center', marginTop: '14px', lineHeight: 1.5 }}>
              Your feedback will appear in {link.rider_name}'s Horsera app and inform their AI analysis.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
