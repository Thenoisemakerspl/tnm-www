#!/usr/bin/env python3
import os
import subprocess
import sys

przed, po = (sys.argv[1:3] + ['', ''])[:2]
NA_GITHUB = os.environ.get('GITHUB_ACTIONS') == 'true'

r = subprocess.run(['git', 'cat-file', '-e', f'{przed}^{{commit}}'], capture_output=True)
if not przed or set(przed) == {'0'} or r.returncode != 0:
    zakres = [po]
    opis = 'pierwsza publikacja albo historia niedostępna'
    pliki = subprocess.run(['git', 'show', '--name-only', '-z', '--format=', po],
                           capture_output=True, text=True).stdout.split('\0')
else:
    opis = f'{przed[:7]}..{po[:7]}'
    pliki = subprocess.run(['git', 'diff', '--name-only', '-z', przed, po],
                           capture_output=True, text=True).stdout.split('\0')
pliki = [p for p in pliki if p.strip()]

ZDJECIA = ('.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif')
uwagi = []
for p in pliki:
    if p.startswith('.github/') or p == 'vercel.json':
        uwagi.append((p, f'Zmieniono {p}. Ten plik steruje publikacją albo adresami strony; '
                         'upewnij się, że zmiana była zamierzona.'))
    if not os.path.exists(p) or p.startswith('.github/'):
        continue
    nazwa = p.rsplit('/', 1)[-1]
    if not all(c.isascii() and (c.islower() or c.isdigit() or c in '-_.') for c in nazwa):
        uwagi.append((p, f'Nazwa pliku „{nazwa}" ma spację, wielką literę albo polski znak. '
                         'Na stronie bezpieczniej działają nazwy z małych liter, cyfr i myślników, '
                         'np. zespol-2026-wiosna.webp (instrukcja „Zdjęcia i wideo”).'))
    if p.lower().endswith(ZDJECIA):
        mb = os.path.getsize(p) / (1024 * 1024)
        if mb > 1:
            uwagi.append((p, f'Zdjęcie ma {mb:.1f} MB. Strona będzie się wolniej ładować, zwłaszcza '
                             'na telefonie. Zmniejsz je do ok. 300-500 KB (instrukcja „Zdjęcia i wideo”).'))
for p, tekst in uwagi:
    print(f'::warning file={p}::{tekst}' if NA_GITHUB else f'UWAGA {tekst}')

podsumowanie = os.environ.get('GITHUB_STEP_SUMMARY')
if podsumowanie:
    with open(podsumowanie, 'a', encoding='utf-8') as f:
        f.write(f'### Zmienione pliki ({opis}): {len(pliki)}\n\n')
        f.write('\n'.join(f'- `{p}`' for p in pliki[:100]) + '\n')
print(f'Zmienione pliki ({opis}): {len(pliki)}')
for p in pliki[:100]:
    print(' ', p)
