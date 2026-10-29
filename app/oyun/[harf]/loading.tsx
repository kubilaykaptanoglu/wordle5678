export default function LoadingGame() {
  return (
    <div className="play" aria-busy="true">
      <header className="bar">
        <span className="back">Panel</span>
        <h1>Kelime</h1>
        <span className="when">…</span>
      </header>
      <div className="stage">
        <p>Tahta hazırlanıyor</p>
      </div>
    </div>
  )
}
