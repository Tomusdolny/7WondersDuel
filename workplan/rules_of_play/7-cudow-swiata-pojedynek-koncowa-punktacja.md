# 7 Cudów Świata: Pojedynek — końcowa punktacja

Końcowe punkty oblicza się tylko wtedy, gdy żaden gracz wcześniej nie wygrał przez dominację militarną albo naukową.

## 1. Przewaga militarna

Sprawdź położenie pionka konfliktu.

| Położenie pionka | Punkty gracza mającego przewagę |
|---|---:|
| Pole neutralne na środku | 0 |
| Pierwsza strefa po stronie przeciwnika | 2 |
| Druga strefa | 5 |
| Ostatnia strefa przed stolicą | 10 |

Drugi gracz otrzymuje za wojsko **0 punktów**.

## 2. Karty Budowli

Dodaj wszystkie punkty widoczne na wybudowanych kartach:

- niebieskich — Budowle cywilne,
- zielonych — Budowle naukowe,
- żółtych — Budowle handlowe,
- fioletowych — Gildie.

Brązowe, szare i czerwone karty zazwyczaj nie dają bezpośrednio punktów, ale mogą zwiększać wartość Gildii.

## 3. Gildie

Punkty z Gildii otrzymuje wyłącznie ich właściciel:

- **Gildia kupiecka** — 1 punkt za każdą żółtą kartę w mieście, które ma ich więcej.
- **Cech armatorów** — 1 punkt za każdą brązową i szarą kartę w wybranym mieście z większą łączną liczbą tych kart.
- **Cech budowniczych** — 2 punkty za każdy wybudowany Cud w mieście, które ma ich więcej.
- **Stowarzyszenie urzędników** — 1 punkt za każdą niebieską kartę w mieście, które ma ich więcej.
- **Towarzystwo naukowe** — 1 punkt za każdą zieloną kartę w mieście, które ma ich więcej.
- **Cech lichwiarzy** — 1 punkt za każdy pełny zestaw 3 monet w bogatszym mieście.
- **Gildia strategów** — 1 punkt za każdą czerwoną kartę w mieście, które ma ich więcej.

Przy remisie właściciel Gildii wybiera miasto. Miasto wykorzystane do naliczenia punktów nie musi być tym samym, z którego wcześniej naliczono monety.

## 4. Wybudowane Cuda

Dodaj punkty wskazane na wszystkich wybudowanych przez siebie Cudach. Niewybudowane Cuda nie dają punktów.

## 5. Żetony postępu

Dodaj punkty wynikające z posiadanych żetonów:

- **Rolnictwo** — 4 punkty.
- **Filozofia** — 7 punktów.
- **Matematyka** — 3 punkty za każdy posiadany żeton postępu, wliczając Matematykę.
- Pozostałe żetony — 0 punktów, o ile nie mają podanej wartości punktowej.

### Przykład Matematyki

Gracz posiada Matematykę oraz 2 inne żetony postępu. Ma łącznie 3 żetony, więc otrzymuje:

`3 żetony × 3 punkty = 9 punktów`.

Ewentualne punkty zapisane na pozostałych żetonach dodaje się osobno.

## 6. Monety

Za każde pełne **3 monety** w swoim skarbcu otrzymujesz **1 punkt**.

| Monety | Punkty |
|---:|---:|
| 0–2 | 0 |
| 3–5 | 1 |
| 6–8 | 2 |
| 9–11 | 3 |
| 12–14 | 4 |
| 15–17 | 5 |

Monety pozostałe ponad ostatnią pełną trójkę nie dają punktów.

## Wzór

```text
wynik końcowy =
  punkty militarne
+ punkty z Budowli
+ punkty z Gildii
+ punkty z Cudów
+ punkty z żetonów postępu
+ pełne zestawy 3 monet
```

Zapis matematyczny:

```text
wynik = wojsko + Budowle + Gildie + Cuda + żetony + floor(monety / 3)
```

## Tabela do podliczenia

| Kategoria | Gracz 1 | Gracz 2 |
|---|---:|---:|
| Przewaga militarna |  |  |
| Budowle cywilne — niebieskie |  |  |
| Budowle naukowe — zielone |  |  |
| Budowle handlowe — żółte |  |  |
| Gildie — fioletowe |  |  |
| Cuda |  |  |
| Żetony postępu |  |  |
| Monety — 1 punkt za każde pełne 3 |  |  |
| **Łącznie** |  |  |

## Rozstrzyganie remisu

1. Wygrywa gracz mający więcej punktów z samych **niebieskich Budowli cywilnych**.
2. Jeśli nadal jest remis, gracze **współdzielą zwycięstwo**.

## Źródło

- [Oficjalna polska instrukcja wydawnictwa Rebel](https://repository.rebel.pl/files/instrukcje/Pojedynek_instrukcja_nowa.pdf)
