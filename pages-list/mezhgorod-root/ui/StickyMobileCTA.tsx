'use client'

import { requisitsData } from '@/shared/data/requisits.data'

const styles: Record<string, React.CSSProperties> = {
  bar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    gap: 8,
    padding: '10px 12px',
    background: 'rgba(20,20,20,0.95)',
    backdropFilter: 'blur(8px)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 -4px 16px rgba(0,0,0,0.3)',
  },
  btn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  primary: {
    background: '#ff6b00',
    color: '#fff',
  },
  secondary: {
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
  },
}

const scrollToCalc = () => {
  const el = document.getElementById('order')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export default function StickyMobileCTA() {
  return (
    <>
      <style>{`
        .stickyMobileCta { display: none; }
        @media (max-width: 768px) {
          .stickyMobileCta { display: flex; }
          body { padding-bottom: 68px; }
        }
      `}</style>
      <div className="stickyMobileCta" style={styles.bar}>
        <button onClick={scrollToCalc} style={{ ...styles.btn, ...styles.primary }}>
          Рассчитать
        </button>
        <a href={`tel:${requisitsData.PHONE}`} style={{ ...styles.btn, ...styles.secondary }}>
          Позвонить
        </a>
      </div>
    </>
  )
}
