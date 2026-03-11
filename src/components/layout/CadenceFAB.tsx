interface CadenceFABProps {
  onClick: () => void;
}

export default function CadenceFAB({ onClick }: CadenceFABProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Open Cadence — your intelligent riding advisor"
      style={{
        position: 'fixed',
        bottom: '94px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: '#1C1510',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        boxShadow: [
          '0 4px 20px rgba(0,0,0,0.28)',
          '0 0 0 1px rgba(201,169,110,0.22)',
          '0 0 24px rgba(201,169,110,0.07)',
        ].join(', '),
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
      }}
    >
      <div
        style={{
          width: '21px',
          height: '21px',
          borderRadius: '50%',
          background: '#C9A96E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            background: '#1C1510',
          }}
        />
      </div>
    </button>
  );
}
