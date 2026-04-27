'use client'

import { requisitsData } from '@/shared/data/requisits.data'

const styles: Record<string, React.CSSProperties> = {
  bar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    display: 'flex',
    gap: 8,
    padding: '10px 12px',
    background: 'rgba(15,15,15,0.96)',
    backdropFilter: 'blur(8px)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 -4px 16px rgba(0,0,0,0.4)',
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
    background: '#dc2626',
    color: '#fff',
  },
  secondary: {
    background: 'rgba(255,255,255,0.10)',
    color: '#fff',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 0 0 0 rgba(255,255,255,0.7)',
    animation: 'svoStickyPulse 2s infinite',
  },
}

const scrollToCalc = () => {
  const el = document.getElementById('order')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export default function SvoStickyMobileCTA() {
  return (
    <>
      <style>{`
        .svoStickyMobileCta { display: none; }
        @media (max-width: 768px) {
          .svoStickyMobileCta { display: flex; }
          body { padding-bottom: 68px; }
        }
        @keyframes svoStickyPulse {
          0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.6); }
          70% { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
      `}</style>
      <div className="svoStickyMobileCta" style={styles.bar}>
        <button onClick={scrollToCalc} style={{ ...styles.btn, ...styles.primary }}>
          <span style={styles.dot} />
          Срочно — заказать
        </button>
        <a href={`tel:${requisitsData.PHONE}`} style={{ ...styles.btn, ...styles.secondary }}>
          Позвонить
        </a>
      </div>
    </>
  )
}
