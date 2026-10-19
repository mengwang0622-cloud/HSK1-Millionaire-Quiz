# POCHIŃSKU Millionaire

Polskojęzyczny quiz chińskiego: 15 pytań, trzy koła ratunkowe i wirtualny milion. Responsywna aplikacja statyczna, bez kont, API, płatności, zewnętrznych fontów ani zależności produkcyjnych.

## Uruchomienie

Wymagania: Python 3 (serwer lokalny) i Node.js 24 (testy i budowanie). Nie trzeba uruchamiać `npm install`.

```sh
npm start
```

Serwer działa na porcie 8000. Otwieraj przez HTTP, nie jako plik `file://`, ponieważ przeglądarka pobiera bazę pytań przez `fetch`.

```sh
npm test
npm run build
python3 -m http.server 8001 --directory dist
```

`dist/` to kompletna strona gotowa do publikacji. Skrypt budowania kopiuje pliki bez modyfikowania kodu źródłowego.

## Gra

- **Gra indywidualna:** pięć łatwych, pięć średnich i pięć trudnych pytań. Błąd lub upływ czasu kończy rundę. Gwarantowane progi po 5 i 10 poprawnych odpowiedziach: 1 000 i 32 000 zł.
- **Tryb klasowy:** nauczyciel może ujawnić odpowiedź i przejść dalej po błędzie. Może też wybrać jeden poziom trudności dla całej rundy. Pokazywana nagroda jest ćwiczeniową punktacją; tylko 15 poprawnych odpowiedzi daje milion.
- Czas: bez limitu, 15, 30, 45 lub 60 sekund. Pauza wstrzymuje zegar i odsłonięcie odpowiedzi. Każde pytanie ma nowy zegar.
- Każde koło ratunkowe jest jednorazowe. Publiczność i przyjaciel są wyraźnie oznaczonymi symulacjami; mogą się mylić. 50:50 zawsze zachowuje prawidłową odpowiedź.
- Dźwięk jest domyślnie wyłączony. Efekty są generowane oryginalnie przez Web Audio; nie używamy muzyki programu telewizyjnego.
- Odpowiedź jest zatwierdzana kliknięciem. Po krótkim oczekiwaniu pojawiają się poprawna odpowiedź i objaśnienie. Przycisk następnego pytania zapewnia kontrolę tempa.
- Dane gracza pozostają w pamięci przeglądarki i nie są wysyłane na serwer. Odświeżenie strony usuwa postęp.

## Źródła i baza pytań

Źródło: przesłany podręcznik **Pochinsku_HSK1_Nowe_Slownictwo_2026.pdf**, POCHIŃSKU.PL, 12 stron, 163 hasła. PDF jest skanem, więc hasła przepisano z obrazów stron; dokument nie jest dołączony do publicznej witryny.

- `data/vocabulary.tsv`: transkrypcja znaków, pinyin i polskich znaczeń z podręcznika.
- `data/vocabulary.json`: 163 hasła z numerami stron i identyfikatorami.
- `data/contexts.js`: autorskie pytania kontekstowe, gramatyczne i komunikacyjne z odnośnikami do haseł.
- `data/questions.json`: 368 pytań z identyfikatorami, czterema odpowiedziami, indeksem poprawnej odpowiedzi, trudnością, kategorią, objaśnieniem i źródłem.
- `scripts/vocabulary.py` oraz `scripts/questions.js`: odtwarzanie plików JSON po świadomej redakcji treści.

```sh
python3 scripts/vocabulary.py
node scripts/questions.js
npm test
```

Pinyin zachowuje zapis podręcznika, w tym zapis sylab neutralnych i warianty sandhi. Nie należy traktować go jako ujednoliconego słownika wymowy. Pytania o homofoniczne 他们 / 她们 / 它们 nie są generowane. Synonimy i nakładające się znaczenia są wykluczone z odpowiednich dystraktorów. Zdania i ich poprawne odpowiedzi korzystają wyłącznie ze słownictwa podręcznika. Każdy zestaw losuje pytania i kolejność odpowiedzi od nowa. Średnia część turnieju zawiera cztery zadania kontekstowe i jedno pytanie pinyin.

## Weryfikacja

`npm test` sprawdza strukturę całej bazy, unikalność odpowiedzi, przypisanie źródeł, słownictwo zdań, losowanie, progi i koła ratunkowe. Testy nie zastępują redakcyjnej oceny językowej.

Testy przeglądarkowe wymagają Playwright oraz Chromium. Uruchom serwer na porcie 8000 i:

```sh
npm exec --yes --package=@playwright/test -- playwright --version
# Zainstaluj Playwright w osobnym katalogu narzędzi; nie zmieniaj zależności aplikacji.
PLAYWRIGHT_MODULE=/sciezka/do/playwright/index.js CHROMIUM_PATH=/usr/bin/chromium node tests/browser.cjs
```

Patrz `QA.md` po szczegóły sprawdzonych scenariuszy i ograniczenia.

## Publikacja w Vercel

1. Wyślij kod do repozytorium `mengwang0622-cloud/HSK1-Millionaire-Quiz`.
2. W panelu Vercel wybierz **Add New → Project** i zaimportuj to repozytorium.
3. Framework: **Other**. Build: `npm run build`. Output: `dist`. Install command: `npm ci` (plik blokady jest dołączony; brak zależności produkcyjnych).
4. Nie dodawaj zmiennych środowiskowych ani kluczy API. Kliknij **Deploy**.
5. Sprawdź wygenerowany publiczny adres HTTPS: rozpoczęcie gry, wszystkie pomoce, pełną rundę oraz widok mobilny.

`vercel.json` zawiera ustawienia budowania i podstawowe nagłówki bezpieczeństwa. Możliwy jest także dowolny hosting statyczny obsługujący moduły JavaScript i JSON. Samo przygotowanie `dist/` nie oznacza, że witryna została opublikowana.

## Pliki

`index.html` — dostępna struktura interfejsu; `style.css` — responsywny wygląd; `app.js` — interakcje, zegar i dźwięk; `game.js` — czysta logika losowania, punktacji i podpowiedzi. Aplikacja respektuje ustawienie ograniczania animacji i obsługuje klawiaturę przez natywne przyciski.

## Błąd Vercel: `vite: command not found`

To **nie jest projekt Vite**. Nie ustawiaj polecenia `vite build` i nie instaluj Vite tylko po to, by obejść błędne ustawienia hostingu.

W Vercel → Project → Settings → Build and Deployment ustaw:

- Production Branch: `main` (Settings → Git).
- Root Directory: katalog główny repozytorium, bez podkatalogu.
- Framework Preset: **Other**.
- Install Command: `npm ci`.
- Build Command: `npm run build`.
- Output Directory: `dist`.
- Node.js Version: **24.x**.

`vercel.json` zapisuje te polecenia i wyłącza automatyczny wybór frameworka. Jeśli w panelu istnieje stare nadpisanie `vite build`, usuń je albo zastąp `npm run build`. Uruchom nowy deployment z aktualnego `main`; redeploy starego commita zawierającego tylko README nie pobierze nowego kodu. W razie zachowania starej konfiguracji wyłącz użycie istniejącego Build Cache przy ponownym wdrożeniu.

Budowanie wykonuje `node scripts/build.js` i tworzy `dist/index.html`, moduły JavaScript, CSS oraz bazę pytań JSON. Nie wymaga Vite, kluczy API ani zewnętrznych usług.
