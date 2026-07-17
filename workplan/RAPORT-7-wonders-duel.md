# Raport: 7 Wonders Duel — dane kart, porównanie z aplikacją, tech-stack

**Źródła:** oficjalna instrukcja Repos Production / Asmodee, oficjalna strona gry, sklepy App Store / Google Play, materiały Repos Production.  
**Zakres kart:** edycja podstawowa (base game). Rozszerzenia (*Pantheon*, *Agora*, *Edifice* itd.) — poza zakresem listy kart.  
**Konwencja nazw:** angielskie nazwy oficjalne (użyteczne w implementacji); polskie wydanie to *7 Cudów Świata: Pojedynek*.

---

## 1. Skrót zasad istotnych dla danych kart

### Zasoby
| Symbol | Nazwa EN | Typ |
|--------|----------|-----|
| Wood | Drewno | surowiec (brąz) |
| Stone | Kamień | surowiec (brąz) |
| Clay | Glina | surowiec (brąz) |
| Glass | Szkło | produkt (szary) |
| Papyrus | Papirus | produkt (szary) |

### Kolory kart
| Kolor | Typ | Rola |
|-------|-----|------|
| Brązowy | Raw materials | produkcja Wood / Stone / Clay |
| Szary | Manufactured goods | produkcja Glass / Papyrus |
| Niebieski | Civilian | punkty zwycięstwa (VP) |
| Zielony | Scientific | VP + symbol nauki |
| Żółty | Commercial | monety, handel, czasem VP / produkcja |
| Czerwony | Military | tarcze (Shields) → tor konfliktu |
| Fioletowy | Guild | punkty zależne od kryteriów |

### Setup (istotne dla silnika)
- Każdy gracz startuje z **7 monetami**.
- Z każdej ery: **wyrzuć 3 karty** (bez oglądania) → zostaje **20 kart** na strukturę.
- Do ery III: wylosuj **3 z 7 guildów**, dodaj do talii Age III; pozostałe 4 odłóż.
- Z 10 żetonów Postępu (*Progress*): wyłóż **5 losowych** na planszę.
- Cuda: draft 4+4 z 12; każdy gracz ma 4; w całej grze można zbudować max **7 cudów**.
- Handel: brakujący zasób kosztuje `2 + N` monet, gdzie `N` = liczba tego samego zasobu u przeciwnika **tylko z kart brązowych i szarych** (żółte i cuda nie windują ceny). Zakup idzie do **banku**, nie do przeciwnika.
- Discard za monety: `2 + 1 za każdą żółtą kartę` w Twoim mieście.
- Zwycięstwo natychmiastowe: **militarny** (pionek na stolicy wroga) lub **naukowy** (6 różnych symboli nauki).
- Remis VP: wygrywa więcej VP z kart niebieskich; dalej — remis dzielony.
- Skarbiec: `1 VP / 3 monety` (pełne zestawy).

### Symbole nauki (7)
Występują na zielonych kartach + żetonie *Law*. Para identycznych → wybór żetonu Postępu z planszy.

| Symbol (umowny) | Karty z tym symbolem |
|-----------------|----------------------|
| Writing (tabliczka) | Scriptorium, Library |
| Wheel | Apothecary, School |
| Math (moździerz) | Workshop, Laboratory |
| Chemistry (moździerz/apothecary alt.) | Pharmacist, Dispensary |
| Sundial | Academy, Study |
| Astronomy (glob) | University, Observatory |
| Law | tylko żeton Progress *Law* |

> Uwaga: w implementacji lepiej użyć ID symboli (`writing`, `wheel`, `math`, `chemistry`, `sundial`, `astronomy`, `law`), nie ikon.

### Łańcuchy (free construction)

| Age I (daje łańcuch) | Age II (darmowe) | Age III (darmowe) |
|----------------------|------------------|-------------------|
| Stable | Horse Breeders | — |
| Garrison | Barracks | — |
| Palisade | — | Fortifications |
| Archery Range (link na Age II) | — | Siege Workshop |
| Parade Ground (link na Age II) | — | Circus |
| Theater | Statue | Gardens |
| Altar | Temple | Pantheon |
| Baths | Aqueduct | — |
| Tavern | — | Lighthouse |
| Brewery (link na Age II) | — | Arena |
| Scriptorium | Library | — |
| Pharmacist | Dispensary | — |
| School (link na Age II) | — | University |
| Laboratory (link na Age II) | — | Observatory |
| Rostrum (link na Age II) | — | Senate |

---

## 2. Kompletna lista kart — dane do rozgrywki

Legenda kolumn:
- **Koszt** — monety i/lub zasoby; `—` = darmowa
- **Łańcuch** — budynek Age I/II umożliwiający darmową budowę
- **Efekt** — produkcja / VP / tarcze / monety / handel / specjalny

### 2.1 Age I (23 karty)

#### Brązowe (6)
| Karta | Koszt | Efekt |
|-------|-------|-------|
| Lumber Yard | — | +1 Wood |
| Logging Camp | 1 moneta | +1 Wood |
| Clay Pool | — | +1 Clay |
| Clay Pit | 1 moneta | +1 Clay |
| Quarry | — | +1 Stone |
| Stone Pit | 1 moneta | +1 Stone |

#### Szare (2)
| Karta | Koszt | Efekt |
|-------|-------|-------|
| Glassworks | 1 moneta | +1 Glass |
| Press | 1 moneta | +1 Papyrus |

#### Niebieskie (3)
| Karta | Koszt | Efekt | Łańcuch wychodzący |
|-------|-------|-------|--------------------|
| Theater | — | 3 VP | → Statue |
| Altar | — | 3 VP | → Temple |
| Baths | 1 Stone | 3 VP | → Aqueduct |

#### Zielone (4)
| Karta | Koszt | Efekt | Symbol | Łańcuch |
|-------|-------|-------|--------|---------|
| Workshop | 1 Papyrus | 1 VP | Math | → Laboratory |
| Apothecary | 1 Glass | 1 VP | Wheel | → School |
| Scriptorium | 2 monety | — | Writing | → Library |
| Pharmacist | 2 monety | — | Chemistry | → Dispensary |

#### Żółte (4)
| Karta | Koszt | Efekt | Łańcuch |
|-------|-------|-------|---------|
| Stone Reserve | 3 monety | handel Stone za 1 monetę | — |
| Clay Reserve | 3 monety | handel Clay za 1 monetę | — |
| Wood Reserve | 3 monety | handel Wood za 1 monetę | — |
| Tavern | — | natychmiast +4 monety | → Lighthouse |

#### Czerwone (4)
| Karta | Koszt | Tarcze | Łańcuch |
|-------|-------|--------|---------|
| Guard Tower | — | 1 | — |
| Stable | 1 Wood | 1 | → Horse Breeders |
| Garrison | 1 Clay | 1 | → Barracks |
| Palisade | 1 moneta | 1 | → Fortifications |

---

### 2.2 Age II (23 karty)

#### Brązowe (3)
| Karta | Koszt | Efekt |
|-------|-------|-------|
| Sawmill | 2 monety | +2 Wood |
| Brickyard | 2 monety | +2 Clay |
| Shelf Quarry | 2 monety | +2 Stone |

#### Szare (2)
| Karta | Koszt | Efekt |
|-------|-------|-------|
| Glass-Blower | — | +1 Glass |
| Drying Room | — | +1 Papyrus |

#### Niebieskie (5)
| Karta | Koszt | Łańcuch (darmowa) | Efekt | Łańcuch wychodzący |
|-------|-------|-------------------|-------|--------------------|
| Courthouse | 2 Wood + 1 Glass | — | 5 VP | — |
| Aqueduct | 3 Stone | Baths | 5 VP | — |
| Temple | 1 Wood + 1 Papyrus | Altar | 4 VP | → Pantheon |
| Statue | 2 Clay | Theater | 4 VP | → Gardens |
| Rostrum | 1 Stone + 1 Wood | — | 4 VP | → Senate |

#### Zielone (4)
| Karta | Koszt | Łańcuch | Efekt | Symbol | Łańcuch wych. |
|-------|-------|---------|-------|--------|---------------|
| Library | 1 Stone + 1 Wood + 1 Glass | Scriptorium | 2 VP | Writing | — |
| Dispensary | 2 Clay + 1 Stone | Pharmacist | 2 VP | Chemistry | — |
| Laboratory | 1 Wood + 2 Glass | — | 1 VP | Math | → Observatory |
| School | 1 Wood + 2 Papyrus | — | 1 VP | Wheel | → University |

#### Żółte (4)
| Karta | Koszt | Efekt | Łańcuch |
|-------|-------|-------|---------|
| Forum | 1 moneta + 1 Clay | produkcja 1 z {Glass, Papyrus} | — |
| Caravansery | 2 monety + 1 Glass + 1 Papyrus | produkcja 1 z {Wood, Stone, Clay} | — |
| Customs House | 4 monety | handel Glass i Papyrus po 1 monecie | — |
| Brewery | — | natychmiast +6 monet | → Arena |

#### Czerwone (5)
| Karta | Koszt | Łańcuch | Tarcze | Łańcuch wych. |
|-------|-------|---------|--------|---------------|
| Walls | 2 Wood | — | 2 | — |
| Horse Breeders | 1 Clay + 1 Wood | Stable | 1 | — |
| Archery Range | 1 Stone + 1 Wood + 1 Papyrus | — | 2 | → Siege Workshop |
| Barracks | 3 monety | Garrison | 1 | — |
| Parade Ground | 2 Clay + 1 Papyrus | — | 2 | → Circus |

---

### 2.3 Age III — budynki (20 kart)

*(Do talii gry dodaje się 3 z 7 guildów → struktura Age III ma 20 kart.)*

#### Niebieskie (6)
| Karta | Koszt | Łańcuch | Efekt |
|-------|-------|---------|-------|
| Palace | 1 Stone + 1 Wood + 1 Clay + 2 Glass | — | 7 VP |
| Town Hall | 3 Stone + 2 Wood | — | 7 VP |
| Obelisk | 2 Stone + 1 Glass | — | 5 VP |
| Gardens | 2 Wood + 2 Clay | Statue | 6 VP |
| Pantheon | 1 Clay + 1 Wood + 2 Papyrus | Temple | 6 VP |
| Senate | 1 Clay + 1 Stone + 2 Papyrus | Rostrum | 6 VP |

#### Zielone (4)
| Karta | Koszt | Łańcuch | Efekt | Symbol |
|-------|-------|---------|-------|--------|
| Academy | 1 Stone + 1 Wood + 2 Glass | — | 3 VP | Sundial |
| Study | 2 Wood + 1 Glass + 1 Papyrus | — | 3 VP | Sundial |
| University | 1 Clay + 1 Glass + 1 Papyrus | School | 2 VP | Astronomy |
| Observatory | 1 Stone + 2 Papyrus | Laboratory | 2 VP | Astronomy |

#### Żółte (5)
| Karta | Koszt | Łańcuch | Efekt |
|-------|-------|---------|-------|
| Chamber of Commerce | 2 Papyrus | — | 3 VP; przy budowie: +3 monety za każdą szarą kartę w Twoim mieście |
| Port | 1 Wood + 1 Glass + 1 Papyrus | — | 3 VP; przy budowie: +2 monety za każdą brązową kartę w Twoim mieście |
| Armory | 2 Stone + 1 Glass | — | 3 VP; przy budowie: +1 moneta za każdą czerwoną kartę w Twoim mieście |
| Lighthouse | 2 Clay + 1 Glass | Tavern | 3 VP; przy budowie: +1 moneta za każdą żółtą kartę w Twoim mieście |
| Arena | 1 Clay + 1 Stone + 1 Wood | Brewery | 3 VP; przy budowie: +2 monety za każdy zbudowany cud w Twoim mieście |

#### Czerwone (5)
| Karta | Koszt | Łańcuch | Tarcze |
|-------|-------|---------|--------|
| Arsenal | 3 Clay + 2 Wood | — | 3 |
| Pretorium | 8 monet | — | 3 |
| Siege Workshop | 3 Wood + 1 Glass | Archery Range | 2 |
| Circus | 2 Clay + 2 Stone | Parade Ground | 2 |
| Fortifications | 2 Stone + 1 Clay + 1 Papyrus | Palisade | 2 |

---

### 2.4 Guilds — fioletowe (7 kart)

*Koszt płacisz zawsze zasobami. Przy budowie (oprócz Builders i Moneylenders) monety wg „miasta z największą liczbą X”; na koniec gry VP wg tego samego kryterium. Dla Shipowners: jedno miasto liczone łącznie dla brąz+szary.*

| Karta | Koszt | Efekt |
|-------|-------|-------|
| Merchants Guild *(Traders Guild)* | 1 Wood + 1 Clay + 1 Glass + 1 Papyrus | 1 moneta / 1 VP za każdą żółtą w mieście z największą liczbą żółtych |
| Shipowners Guild | 1 Stone + 1 Clay + 1 Glass + 1 Papyrus | 1 moneta / 1 VP za każdą brązową+szarą w mieście z największą liczbą tych kart |
| Builders Guild | 2 Stone + 1 Wood + 1 Clay + 1 Glass | 2 VP za każdy cud w mieście z największą liczbą cudów |
| Magistrates Guild | 2 Wood + 1 Clay + 1 Papyrus | 1 moneta / 1 VP za każdą niebieską w mieście z największą liczbą niebieskich |
| Scientists Guild | 2 Clay + 2 Wood | 1 moneta / 1 VP za każdą zieloną w mieście z największą liczbą zielonych |
| Moneylenders Guild | 2 Stone + 2 Wood | 1 VP za każde 3 monety w bogatszym skarbcu |
| Tacticians Guild | 2 Stone + 1 Clay + 1 Papyrus | 1 moneta / 1 VP za każdą czerwoną w mieście z największą liczbą czerwonych |

---

### 2.5 Wonders (12 kart)

| Cud | Koszt | Efekty natychmiastowe / stałe | VP | Tarcze | Extra turn |
|-----|-------|-------------------------------|----|--------|------------|
| The Appian Way | 2 Stone + 2 Clay + 1 Papyrus | +3 monety; przeciwnik −3 monety | 3 | — | tak |
| Circus Maximus | 2 Stone + 1 Wood + 1 Glass | odrzuć 1 szarą kartę przeciwnika | 3 | 1 | nie |
| The Colossus | 3 Clay + 1 Glass | — | 3 | 2 | nie |
| The Great Library | 3 Wood + 1 Papyrus + 1 Glass | wylosuj 3 z odrzuconych Progress; weź 1 | 4 | — | nie |
| The Great Lighthouse | 1 Wood + 1 Stone + 2 Papyrus | produkcja 1 z {Wood, Stone, Clay}* | 4 | — | nie |
| The Hanging Gardens | 2 Wood + 1 Papyrus + 1 Glass | +6 monet | 3 | — | tak |
| The Mausoleum | 2 Clay + 2 Glass + 1 Papyrus | zbuduj za darmo 1 kartę z discardu gry** | 2 | — | nie |
| Piraeus | 2 Wood + 1 Stone + 1 Clay | produkcja 1 z {Glass, Papyrus}* | 2 | — | tak |
| The Pyramids | 3 Stone + 1 Papyrus | — | 9 | — | nie |
| The Sphinx | 1 Stone + 1 Clay + 2 Glass | — | 6 | — | tak |
| The Statue of Zeus | 1 Wood + 1 Stone + 1 Clay + 2 Papyrus | odrzuć 1 brązową kartę przeciwnika | 3 | 1 | nie |
| The Temple of Artemis | 1 Wood + 1 Stone + 1 Glass + 1 Papyrus | +12 monet | 0 | — | tak |

\* Produkcja cudów **nie wpływa** na koszt handlu przeciwnika.  
\*\* Karty odrzucone przy setupie **nie** wchodzą do discardu gry.

---

### 2.6 Progress tokens (10; w grze 5)

| Żeton | Efekt |
|-------|-------|
| Agriculture | +6 monet; 4 VP |
| Architecture | przyszłe cuda: −2 zasoby (wybierasz które) |
| Economy | dostajesz monety wydane przez przeciwnika na handel zasobami |
| Law | dodatkowy symbol nauki (Law) |
| Masonry | przyszłe niebieskie: −2 zasoby |
| Mathematics | 3 VP za każdy posiadany żeton Progress (w tym ten) |
| Philosophy | 7 VP |
| Strategy | nowe czerwone karty: +1 tarcza (nie dotyczy cudów ani kart już zbudowanych) |
| Theology | przyszłe cuda zyskują „extra turn” (nie kumuluje się z cudami, które już go mają) |
| Urbanism | +6 monet; przy budowie przez łańcuch: +4 monety |

---

### 2.7 Żetony militarne i tor konfliktu

- Tor: 9 stref / 19 pól; skraje = stolice.
- Wejście w strefę z żetonem: przeciwnik traci **2** lub **5** monet (żeton usuwany).
- Koniec gry (bez supremacji): VP z pozycji pionka = **0 / 2 / 5 / 10**.
- Wejście na stolicę przeciwnika = natychmiastowe zwycięstwo militarne.

---

### 2.8 Schemat danych pod implementację (sugerowany)

```ts
type Resource = 'wood' | 'stone' | 'clay' | 'glass' | 'papyrus';
type CardColor = 'brown' | 'grey' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';
type Science = 'writing' | 'wheel' | 'math' | 'chemistry' | 'sundial' | 'astronomy' | 'law';

interface BuildingCard {
  id: string;
  name: string;
  age: 1 | 2 | 3;
  color: CardColor;
  cost: { coins?: number; resources?: Partial<Record<Resource, number>> };
  freeFrom?: string;          // id karty łańcucha
  providesLink?: string;      // id łańcucha wychodzącego
  produces?: Partial<Record<Resource, number>>;
  producesOneOf?: Resource[];
  tradeDiscount?: Resource[]; // koszt handlu = 1
  vp?: number;
  shields?: number;
  science?: Science;
  coinsOnBuild?: number | { per: CardColor | 'wonder'; amount: number };
  guildScoring?: { per: 'yellow' | 'brown+grey' | 'wonder' | 'blue' | 'green' | 'red' | 'coins/3'; vp: number; coinsOnBuild?: boolean };
}
```

**Suma komponentów kartowych (base):** 23 + 23 + 20 + 7 + 12 = **85 kart** (+ 10 Progress, 4 Military tokens).

---

## 3. Planszówka vs oficjalna aplikacja mobilna

Oficjalna app: **7 Wonders Duel** (Repos Production), iOS / Android, wydanie ~2019. Osobny kanał cyfrowy: **Board Game Arena** (przeglądarka) — też digitalizacja, ale inny produkt niż app Repos.

### 3.1 Co jest wspólne (rdzeń gry)
- Te same 3 ery, struktura kart face-up/face-down, 3 akcje na turę (buduj / discard / cud).
- Te same warunki zwycięstwa: militarne, naukowe, cywilne (VP).
- Ten sam zestaw kart base game, cudów i żetonów Progress.
- Handel, łańcuchy, limit 7 cudów — zgodnie z instrukcją.

### 3.2 Różnice — wypunktowane

**Zawartość / content**
- Planszówka: base + oficjalne rozszerzenia (*Pantheon*, *Agora*, nowsze dodatki).
- App: **tylko base game**; brak Pantheon / Agora (Repos nie zapowiadało ich w app).
- Planszówka: fizyczny scorebook, komponenty, pomoce.
- App: wbudowany tutorial, statystyki, sklep w aplikacji (cosmetics / meta — zależnie od wersji).

**Tryby gry**
- Planszówka: wyłącznie lokalnie, 2 osoby przy stole.
- App: AI (solo), Pass’n Play (1 urządzenie), online vs znajomi, ranked matchmaking.
- Planszówka: brak AI; „trening” tylko vs człowiek lub BGA / inna digitalizacja.

**Egzekwowanie zasad**
- Planszówka: gracze sami liczą koszty handlu, VP, legalność ruchów — możliwe pomyłki / house rules.
- App: silnik egzekwuje reguły, podświetla legalne karty, automatycznie przesuwa tor militarny i przyznaje Progress.

**Informacja o stanie gry**
- Planszówka: VP zwykle liczone na koniec (chyba że ktoś liczy na bieżąco).
- App: często pokazuje bieżący wynik VP (zmniejsza „mgłę wojny” względem stołu).
- App: long-press / podgląd karty — kompensacja za mniejszą czytelność symboli na ekranie.

**Setup i tempo**
- Planszówka: ręczne układanie piramidy, draft cudów, tasowanie — ~5–10 min setup.
- App: natychmiastowy setup; brak „dotyku” komponentów.
- Online w app: **timery tur** (częsta krytyka: za krótkie / brak async).
- Planszówka: naturalne tempo rozmowy; brak force-timeout.

**Multiplayer / dostępność**
- App online: wymaga obu graczy **jednocześnie** (brak solidnego trybu asynchronicznego).
- Planszówka: zero zależności od serwera / konta.
- App: płatna (~cena sklepowa); aktualizacje OS bywają problematyczne (recenzje: bugi online, czasem brak wsparcia tabletów).
- Planszówka: jednorazowy zakup pudełka; rozszerzenia osobno.

**UX / prezentacja**
- Planszówka: pełne ilustracje Miguel Coimbra, czytelność przy stole.
- App: UI skondensowane pod telefon; symbole uproszczone; inna „obecność” gry.
- Planszówka: dyskusja, blef społeczny, rytuał stołu.
- App: wygodna w podróży, solo vs AI, ranked ladder.

**Inne digitalizacje (kontekst)**
- **Board Game Arena**: web, często lepszy online async / social niż oficjalna app; też bez pełnego parytetu wszystkich dodatków w każdym momencie.
- App ≠ pełny zamiennik ekosystemu planszówki (szczególnie rozszerzeń).

### 3.3 Tabela skrótowa

| Aspekt | Planszówka | App Repos |
|--------|------------|-----------|
| Base rules | tak | tak |
| Pantheon / Agora | tak (osobno) | nie |
| Solo / AI | nie | tak |
| Online ranked | nie | tak |
| Pass’n Play | „naturalnie” | tak |
| Auto-rules | nie | tak |
| Live VP | opcjonalnie | zwykle tak |
| Async multiplayer | n/a | słabe / brak |
| Setup | ręczny | automatyczny |
| Trwałość produktu | fizyczna | zależna od sklepu / serwerów |

---

## 4. Propozycja tech-stacku (Twoja planszówka „w stylu” 7WD)

Zakładasz **własną grę inspirowaną** mechaniką Duel (nie klon z assetami Repos — prawa autorskie do nazw/kart/grafiki). Poniżej stack pod **prototype → produkcja**.

### 4.1 Rekomendacja: **web app (PWA)** — zgadzam się z Twoim kierunkiem

Dla 2-osobowej gry karcianej z jawnym układem kart web jest najlepszym kompromisem:

- jeden codebase → desktop + mobile,
- szybka iteracja reguł (hot reload),
- łatwy share linkiem (np. `?room=xyz`),
- deploy zero-friction (Vercel / Cloudflare Pages),
- później: wrapper w Capacitor/Tauri jeśli zechcesz „apkę w sklepie”.

Natywna app (Unity / Godot / osobno iOS+Android) ma sens dopiero gdy: ciężkie animacje 3D, offline offline-first sklep, lub silne wymaganie Game Center / Play Games. Na fazę MVP to **nadmiar**.

### 4.2 Proponowany stack

| Warstwa | Technologia | Dlaczego |
|---------|-------------|----------|
| UI | **React + TypeScript + Vite** | szybki feedback, ekosystem, łatwy state |
| Styling | **CSS Modules** lub Tailwind | czytelny layout piramidy kart |
| Stan gry | **pure TS engine** (osobny pakiet `game-core`) | testowalny bez UI; deterministyczny reducer |
| Testy reguł | **Vitest** | unit testy kosztów, łańcuchów, zwycięstw |
| Multiplayer lokalny | ten sam device / dwa panele | Pass’n Play jak w app |
| Multiplayer online | **PartyKit** lub **Colyseus** lub **Supabase Realtime** | pokoje 1v1, sync state |
| Autorytet gry | silnik na serwerze (lub shared + checksum) | antycheat przy ranked |
| Auth (opcjonalnie) | Clerk / Supabase Auth | konta, ranked później |
| AI (później) | osobny worker: heurystyki → MCTS | jak oficjalna app |
| Hosting | Vercel / Cloudflare | tani start |
| Analityka | Plausible / PostHog | funnels, balans kart |

### 4.3 Architektura silnika (ważniejsze niż framework UI)

```
┌─────────────┐     actions      ┌──────────────┐
│  React UI   │ ───────────────► │  game-core   │
│  (widoki)   │ ◄─────────────── │  (pure TS)   │
└─────────────┘   GameState      └──────┬───────┘
                                        │
                               JSON card data
                               (Age I/II/III, wonders…)
```

1. **Dane kart = JSON/TS constants** (jak sekcja 2) — zero logiki w komponentach.
2. **`GameState` immutable** + funkcja `applyAction(state, action) → state | error`.
3. UI tylko renderuje i wysyła akcje: `selectCard`, `build`, `discard`, `buildWonder`, `chooseProgress`…
4. Multiplayer: serwer przyjmuje akcję, waliduje przez ten sam `game-core`, broadcastuje nowy stan.

### 4.4 Fazy rozwoju

1. **MVP lokalne:** 1 urządzenie, 2 gracze, pełny base-like ruleset (Twoje karty), bez AI.
2. **Online room:** link + WebSocket, bez kont.
3. **AI v0:** greedy + blokowanie military/science.
4. **Meta:** konta, ranked, replay, balans (telemetria które karty wygrywają).
5. **PWA / store:** dopiero gdy reguły i UX są stabilne.

### 4.5 Czego unikać na start
- Unity „bo to gra” — wolniejszy feedback pętli reguł.
- Osobne natywne kody iOS/Android.
- Overengineering ECS / event sourcing zanim masz działającą piramidę kart.
- Kopiowanie nazw/kart/grafiki 7WD 1:1 (IP) — projektuj **własny zestaw** na tym samym *shape* danych.

### 4.6 Minimalny koszt produkcji
- Dev: Vite SPA + silnik TS.
- Online: 1 mały serwis realtime.
- Brak backendu bazodanowego na MVP (wystarczy efemeryczny room state).

---

## 5. Podsumowanie

1. **Base 7WD** to zamknięty, dobrze udokumentowany dataset: 66 kart er + 7 guildów + 12 cudów + 10 Progress — wystarczy do pełnego silnika.
2. **Oficjalna app** wiernie przenosi base, ale dodaje AI/online/UX-automatyzację i **nie zastępuje** ekosystemu rozszerzeń planszówki.
3. Na własną grę w tym stylu: **web (React+TS) + pure game-core + opcjonalny realtime** — najszybsza ścieżka od prototypu do produkcji; natywność odłóż na później.

---

*Dokument wygenerowany jako baza pod implementację. Przed kodowaniem warto jeszcze raz zweryfikować 1–2 karty żółte Age III (Lighthouse / Arena / Port) na fizycznym egzemplarzu lub skanie kart — wartości VP/monet są ustalone, ale ikonografia edycji językowych bywa myląca przy OCR.*
