import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import CadenceFAB from './CadenceFAB';
import { CadenceProvider, useCadence } from '../../context/CadenceContext';
import { mockRider } from '../../data/mock';

interface AppShellProps {
  children: React.ReactNode;
}

function AppShellInner({ children }: AppShellProps) {
  const { openCadence } = useCadence();
  const navigate = useNavigate();

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        height: '100dvh',
        background: '#FAF7F3',
        fontFamily: "'DM Sans', sans-serif",
        maxWidth: '430px',
        margin: '0 auto',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #FAF7F3; }
        ::-webkit-scrollbar { display: none; }
        scrollbar-width: none;
        @keyframes cadence-breathe {
          0%   { transform: scale(1);    opacity: 1; }
          45%  { transform: scale(1.22); opacity: 0.80; }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes cadence-glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.28), 0 0 0 1px rgba(201,169,110,0.18), 0 0 0px rgba(201,169,110,0); }
          45%  { box-shadow: 0 4px 24px rgba(0,0,0,0.32), 0 0 0 1px rgba(201,169,110,0.60), 0 0 36px rgba(201,169,110,0.40); }
        }
        @keyframes cadence-ripple {
          0%   { transform: scale(1);    opacity: 0.60; }
          75%  { transform: scale(2.0);  opacity: 0; }
          100% { transform: scale(2.0);  opacity: 0; }
        }
        @keyframes cadence-ripple-delay {
          0%, 40% { transform: scale(1);   opacity: 0; }
          50%      { transform: scale(1);   opacity: 0.50; }
          90%      { transform: scale(1.9); opacity: 0; }
          100%     { transform: scale(1.9); opacity: 0; }
        }
      `}</style>

      {/* ── Top header bar — Horsera brand mark ── */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        minHeight: '48px',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        background: 'rgba(250,247,243,0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #EDE7DF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        flexShrink: 0,
      }}>
        <img
          src="/horsera-logo.png"
          alt="Horsera"
          style={{ height: '30px', width: 'auto', display: 'block' }}
        />
        {/* Avatar — opens settings */}
        <button
          onClick={() => navigate('/settings')}
          aria-label="Settings"
          style={{
            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #C9A96E 0%, #8C5A3C 100%)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(140,90,60,0.25)',
          }}
        >
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '13px', color: '#FAF7F3', fontWeight: 400,
            lineHeight: 1,
          }}>
            {mockRider.firstName.charAt(0)}
          </span>
        </button>
      </header>

      <main
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: '82px', paddingTop: 'calc(48px + env(safe-area-inset-top, 0px))' }}
      >
        {children}
      </main>

      <BottomNav />
      <CadenceFAB onClick={openCadence} />
    </div>
  );
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <CadenceProvider>
      <AppShellInner>{children}</AppShellInner>
    </CadenceProvider>
  );
}
