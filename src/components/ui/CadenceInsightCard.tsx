interface CadenceInsightCardProps {
  text: string;
  onAskMore?: () => void;
  compact?: boolean;
}

export default function CadenceInsightCard({
  text,
  onAskMore,
  compact = false,
}: CadenceInsightCardProps) {
  return (
    <div
      style={{
        background: '#F1F4FA',
        borderRadius: '16px',
        padding: compact ? '12px 14px' : '14px 16px',
        borderLeft: '3px solid #6B7FA3',
        boxShadow: '0 1px 8px rgba(26,20,14,0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
        <div
          style={{
            width: 20, height: 20,
            borderRadius: '50%',
            background: '#6B7FA3',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EEF2F8' }} />
        </div>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: '#6B7FA3',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Cadence
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '9.5px',
            color: '#B5A898',
            fontStyle: 'italic',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          AI insight
        </span>
      </div>

      <p
        style={{
          fontSize: compact ? '12.5px' : '13px',
          color: '#5A6477',
          lineHeight: 1.55,
          marginBottom: onAskMore ? '9px' : 0,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {text}
      </p>

      {onAskMore && (
        <button
          onClick={onAskMore}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            color: '#6B7FA3',
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            padding: 0,
          }}
        >
          Ask Cadence more →
        </button>
      )}
    </div>
  );
}
