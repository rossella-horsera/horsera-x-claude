import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  {
    path: '/',
    label: 'Home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
          fill={active ? '#8C5A3C' : 'none'}
          stroke={active ? '#8C5A3C' : '#C4B8AC'}
          strokeWidth={active ? '0' : '1.7'}
        />
      </svg>
    ),
  },
  {
    path: '/journey',
    label: 'Journey',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={active ? '#8C5A3C' : '#C4B8AC'} strokeWidth="1.7" />
        <path
          d="M12 7.5V12L15 15"
          stroke={active ? '#8C5A3C' : '#C4B8AC'}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        {active && <circle cx="12" cy="12" r="2.5" fill="#8C5A3C" opacity="0.15" />}
      </svg>
    ),
  },
  {
    path: '/rides',
    label: 'Rides',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="4" y="5" width="16" height="16" rx="3"
          stroke={active ? '#8C5A3C' : '#C4B8AC'}
          strokeWidth="1.7"
          fill={active ? 'rgba(140,90,60,0.08)' : 'none'}
        />
        <path
          d="M8 3V7M16 3V7M4 10H20"
          stroke={active ? '#8C5A3C' : '#C4B8AC'}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="9" cy="14" r="1" fill={active ? '#8C5A3C' : '#C4B8AC'} />
        <circle cx="12" cy="14" r="1" fill={active ? '#8C5A3C' : '#C4B8AC'} />
        <circle cx="15" cy="14" r="1" fill={active ? '#8C5A3C' : '#C4B8AC'} />
      </svg>
    ),
  },
  {
    path: '/insights',
    label: 'Insights',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 18L8 12L12 15L16 8L20 11"
          stroke={active ? '#8C5A3C' : '#C4B8AC'}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {active && (
          <path d="M4 18L8 12L12 15L16 8L20 11V18H4Z" fill="#8C5A3C" opacity="0.08" />
        )}
      </svg>
    ),
  },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        height: '82px',
        background: 'rgba(250,247,243,0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid #EDE7DF',
        display: 'flex',
        alignItems: 'flex-start',
        paddingTop: '10px',
        zIndex: 50,
      }}
    >
      {navItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
            }}
          >
            <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon(active)}
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: active ? 600 : 500,
                color: active ? '#8C5A3C' : '#C4B8AC',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
