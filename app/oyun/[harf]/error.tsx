"use client"

export default function GameError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="empty">
      <div>
        <h1>Oyun açılamadı</h1>
        <p>Bağlantı ya da sunucu yanıt vermedi.</p>
        <button type="button" onClick={reset}>
          Tekrar dene
        </button>
      </div>
    </div>
  )
}
