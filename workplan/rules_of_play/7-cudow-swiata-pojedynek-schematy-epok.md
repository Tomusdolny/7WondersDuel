# 7 Cudów Świata: Pojedynek — schematy ułożenia kart

W każdej Epoce należy wyłożyć **20 kart**. Karty w niższym rzędzie częściowo przykrywają karty w rzędzie powyżej.

**Legenda:** `[O]` — karta odkryta, `[Z]` — karta zakryta. Schematy przedstawiają układ od górnego do dolnego rzędu.

## Epoka I — piramida

```text
                    [O] [O]                 2
                 [Z] [Z] [Z]               3
              [O] [O] [O] [O]              4
           [Z] [Z] [Z] [Z] [Z]             5
        [O] [O] [O] [O] [O] [O]            6  ← dostępne na początku
```

Rzędy: **2 + 3 + 4 + 5 + 6 = 20 kart**.

## Epoka II — odwrócona piramida

```text
        [O] [O] [O] [O] [O] [O]            6
           [Z] [Z] [Z] [Z] [Z]             5
              [O] [O] [O] [O]              4
                 [Z] [Z] [Z]               3
                    [O] [O]                 2  ← dostępne na początku
```

Rzędy: **6 + 5 + 4 + 3 + 2 = 20 kart**.

## Epoka III — układ centralny

```text
                    [O] [O]                 2
                 [Z] [Z] [Z]               3
              [O] [O] [O] [O]              4
                 [Z]     [Z]                2
              [O] [O] [O] [O]              4
                 [Z] [Z] [Z]               3
                    [O] [O]                 2  ← dostępne na początku
```

Rzędy: **2 + 3 + 4 + 2 + 4 + 3 + 2 = 20 kart**. Dwie zakryte karty w środkowym rzędzie są rozdzielone pustą przestrzenią.

## Zasada dostępności

Można wybrać wyłącznie kartę, która **nie jest nawet częściowo przykryta** przez inną kartę. Po zabraniu karty odkrywa się wszystkie zakryte karty, które stały się dostępne.

## Źródło

- [Oficjalna polska instrukcja wydawnictwa Rebel](https://repository.rebel.pl/files/instrukcje/Pojedynek_instrukcja_nowa.pdf)
