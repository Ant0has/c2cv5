'use client'

import * as Sentry from '@sentry/nextjs'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '72px', fontWeight: 600, color: '#ccc', marginBottom: '16px' }}>
        Ошибка
      </div>
      <h1 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '12px' }}>
        Что-то пошло не так
      </h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px', maxWidth: '400px' }}>
        Попробуйте обновить страницу. Если ошибка повторяется — свяжитесь с нами.
      </p>
      <div style={{ display: 'flex', gap: '16px' }}>
        <button
          onClick={reset}
          style={{
            padding: '12px 32px',
            fontSize: '16px',
            fontWeight: 500,
            color: '#fff',
            backgroundColor: '#f97316',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Обновить страницу
        </button>
        <Link
          href="/"
          style={{
            padding: '12px 32px',
            fontSize: '16px',
            fontWeight: 500,
            color: '#333',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            textDecoration: 'none',
          }}
        >
          На главную
        </Link>
      </div>
    </div>
  )
}
