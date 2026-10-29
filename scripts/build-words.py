#!/usr/bin/env python3
"""TDK imla listesi ve sıklık listesinden 5–8 harfli sözlükleri üretir.

Kaynaklar:
- https://github.com/CanNuhlar/Turkce-Kelime-Listesi (turkce_kelime_listesi.txt)
- https://github.com/hermitdave/FrequencyWords (content/2018/tr/tr_50k.txt)

Tahmin listesi sözlükteki kelimelerdir. Günlük cevaplar, sıklık listesiyle
kesişen daha bilinen kelimelerdir. Açık saçık günlük cevaplar elenir;
tahmin listesinde kalırlar.
"""

from __future__ import annotations

import argparse
import unicodedata
from pathlib import Path

ORDER = "abcçdefgğhıijklmnoöprsştuüvyz"
INDEX = {ch: i for i, ch in enumerate(ORDER)}
ALPHABET = set(ORDER)
CIRC = {"â": "a", "î": "i", "û": "u", "Â": "a", "Î": "i", "Û": "u"}
LENGTHS = (5, 6, 7, 8)

# Günlük cevap olmasın. Tahmin listesinden silinmez.
ANSWER_BLOCK = {
    "sikmek",
    "sikme",
    "sikalar",
    "sikiş",
    "sikişmek",
    "orospu",
    "pezevenk",
    "kahpe",
    "kahpece",
    "kahpecik",
    "kahpelik",
    "sürtük",
    "taşak",
    "taşaklı",
    "dürzü",
    "puştluk",
    "ibnelik",
    "kaltak",
    "kaltakçı",
    "şerefsiz",
    "piçlik",
    "piçleşme",
    "boklu",
    "bokluk",
    "sıçmak",
    "sıçtırma",
    "sidikli",
}


def tr_fold(raw: str) -> str:
    text = unicodedata.normalize("NFC", raw.strip())
    text = text.replace("İ", "i").replace("I", "ı")
    text = "".join(CIRC.get(ch, ch) for ch in text)
    text = unicodedata.normalize("NFC", text.lower())
    text = text.replace("\u0307", "")
    return text


def sort_key(word: str) -> list[int]:
    try:
        return [INDEX[ch] for ch in word]
    except KeyError as exc:
        raise SystemExit(f"alfabe dışı harf: {word}") from exc


def valid_word(word: str) -> bool:
    if not word or len(word) not in LENGTHS:
        return False
    if any(unicodedata.category(ch) == "Mn" for ch in word):
        return False
    return all(ch in ALPHABET for ch in word)


def load_guesses(path: Path) -> dict[int, set[str]]:
    buckets: dict[int, set[str]] = {n: set() for n in LENGTHS}
    for line in path.read_text(encoding="utf-8").splitlines():
        raw = unicodedata.normalize("NFC", line.strip())
        if not raw or any(ch.isupper() for ch in raw):
            continue
        word = tr_fold(raw)
        if valid_word(word):
            buckets[len(word)].add(word)
    return buckets


def load_answers(path: Path, guesses: dict[int, set[str]]) -> dict[int, set[str]]:
    found: dict[int, set[str]] = {n: set() for n in LENGTHS}
    for line in path.read_text(encoding="utf-8").splitlines():
        parts = line.split()
        if len(parts) < 2:
            continue
        word = tr_fold(parts[0])
        if not valid_word(word):
            continue
        if word in ANSWER_BLOCK or word not in guesses[len(word)]:
            continue
        found[len(word)].add(word)
    return found


def write_list(path: Path, words: set[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    ordered = sorted(words, key=sort_key)
    path.write_text("\n".join(ordered) + "\n", encoding="utf-8")


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser()
    parser.add_argument("--tdk", type=Path, required=True)
    parser.add_argument("--freq", type=Path, required=True)
    args = parser.parse_args()

    guesses = load_guesses(args.tdk)
    answers = load_answers(args.freq, guesses)

    for length in LENGTHS:
        if len(guesses[length]) < 2000:
            raise SystemExit(f"{length} harf tahmin listesi 2000'in altında: {len(guesses[length])}")
        if len(answers[length]) < 1000:
            raise SystemExit(f"{length} harf cevap listesi 1000'in altında: {len(answers[length])}")
        missing = answers[length] - guesses[length]
        if missing:
            raise SystemExit(f"{length} harf cevapları tahmin listesinde yok")
        write_list(root / "data" / "guesses" / f"{length}.txt", guesses[length])
        write_list(root / "data" / "answers" / f"{length}.txt", answers[length])
        print(f"{length}: tahmin {len(guesses[length])}  cevap {len(answers[length])}")


if __name__ == "__main__":
    main()
