export function Legend() {
  return (
    <ul className="legend">
      <li>
        <span className="swatch ok" aria-hidden="true" />
        Yeşil, doğru yer
      </li>
      <li>
        <span className="swatch mid" aria-hidden="true" />
        Sarı, yanlış yer
      </li>
      <li>
        <span className="swatch no" aria-hidden="true" />
        Gri, kelimede yok
      </li>
    </ul>
  )
}
