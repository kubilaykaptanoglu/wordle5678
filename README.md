# Kelime5678

5, 6, 7 ve 8 harfli günlük Türkçe kelime oyunu. Her uzunluğun kelimesi Türkiye saatiyle gece yarısı değişir. Sözlük ve günün kelimesi tarayıcıya gönderilmez; tahmin sunucuda değerlendirilir. Kelime yalnızca doğru tahminde görünür. Geçmiş günler /cevaplar sayfasındadır.

## Çalıştırma

```bash
npm install
cp .env.example .env.local
npm test
npm run dev
```

`GAME_SECRET` en az 24 karakter olmalıdır. Üretimde tanımlı değilse sunucu açılmaz. `NEXT_PUBLIC_SITE_URL` kanonik adres, Open Graph ve site haritası için kullanılır.

## Oyun

Panel `/` adresindedir. Masalar `/oyun/5`, `/oyun/6`, `/oyun/7` ve `/oyun/8`. Her masada 2.000'den fazla geçerli kelime vardır. Günlük cevap, bu listenin sık kullanılan alt kümesinden seçilir.

Deneme hakkı httpOnly imzalı çerezde tutulur. Kelime çereze yazılmaz.

## Sözlük

Listeler `scripts/build-words.py` ile üretilir. Tahmin listesi, TDK imla kılavuzundan derlenen [Türkçe Kelime Listesi](https://github.com/CanNuhlar/Turkce-Kelime-Listesi) kaynağından süzülür. Günlük cevaplar [FrequencyWords](https://github.com/hermitdave/FrequencyWords) Türkçe sıklık listesiyle kesişir. Özel adlar, birleşik yazımlar ve alfabe dışı harfler elenir.
