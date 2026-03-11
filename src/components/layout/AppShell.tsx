import React, { useState } from 'react';
import BottomNav from './BottomNav';
import CadenceFAB from './CadenceFAB';
import CadenceDrawer from './CadenceDrawer';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [cadenceOpen, setCadenceOpen] = useState(false);

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
      `}</style>

      <main
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: '82px' }}
      >
        {children}
      </main>

      <BottomNav />
      <CadenceFAB onClick={() => setCadenceOpen(true)} />
      <CadenceDrawer
        open={cadenceOpen}
        onClose={() => setCadenceOpen(false)}
      />
    </div>
  );
}
