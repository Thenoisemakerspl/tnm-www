#!/usr/bin/env python3
import json
import os
import re
import shutil
import subprocess
import sys

KATALOG = os.environ.get('BRAMA_KATALOG') or os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
NA_GITHUB = os.environ.get('GITHUB_ACTIONS') == 'true'

POZA_STRONA = ('.github/', '.git/')

WYMAGANE = [
    'index.html', 'en/index.html', 'thank-you.html', 'en/thank-you.html', '404.html',
    'vercel.json', 'robots.txt', 'sitemap.xml',
    'assets/js/main.js', 'assets/js/main.en.js', 'assets/js/intake.js', 'assets/js/intake.en.js',
    'assets/js/konfigurator.js', 'assets/js/konfigurator.en.js',
    'assets/js/konfigurator-config.js', 'assets/js/konfigurator-config.en.js',
    'assets/js/consent.js', 'assets/js/consent.en.js', 'assets/js/pixel.js',
    'data/content.json', 'data/content.en.json',
]

SEKRETY = [
    ('klucz Stripe', r'\b(?:s' + r'k|r' + r'k)_(?:live|test)_[0-9A-Za-z]{10,}'),
    ('token Airtable', r'\bp' + r'at[A-Za-z0-9]{14}\.[a-f0-9]{20,}'),
    ('token GitHub', r'\bgh[pousr]_[A-Za-z0-9]{30,}|\bgithub_' + r'pat_[A-Za-z0-9_]{20,}'),
    ('klucz Google', r'\bAI' + r'za[0-9A-Za-z_\-]{35}'),
    ('token Slack', r'\bxo' + r'x[baprs]-[0-9A-Za-z-]{10,}'),
    ('klucz OpenAI/Anthropic', r'\bs' + r'k-(?:proj-|ant-)?[A-Za-z0-9_\-]{30,}'),
    ('klucz prywatny', r'-----BEGIN [A-Z ]*PRIVATE ' + r'KEY-----'),
    ('token JWT', r'\bey' + r'J[A-Za-z0-9_\-]{10,}\.ey' + r'J[A-Za-z0-9_\-]{10,}\.'),
    ('nagłówek Bearer', r'\bBea' + r'rer\s+[A-Za-z0-9._\-]{20,}'),
]

DOZWOLONE_HOSTY = {'use.typekit.net'}

TEKSTOWE = ('.html', '.js', '.css', '.json', '.txt', '.xml', '.md', '.yml', '.yaml', '.py', '.svg')

bledy = []
ostrzezenia = []


REGEX_PRZED = set('(,=:[!&|?{};+-*%<>~^')
SLOWA_PRZED_REGEX = ('return', 'typeof', 'case', 'do', 'else', 'in', 'of', 'new', 'delete', 'void', 'throw', 'instanceof', 'yield', 'await')


def komentarze_js(kod):
    wynik = []
    i, n = 0, len(kod)
    poprz = ''
    slowo = ''
    stos = []
    while i < n:
        c = kod[i]
        d = kod[i + 1] if i + 1 < n else ''
        if c == '/' and d == '/':
            wynik.append(i)
            j = kod.find('\n', i)
            i = n if j < 0 else j
            continue
        if c == '/' and d == '*':
            wynik.append(i)
            j = kod.find('*/', i + 2)
            i = n if j < 0 else j + 2
            continue
        if c in '"\'':
            i += 1
            while i < n and kod[i] != c and kod[i] != '\n':
                i += 2 if kod[i] == '\\' else 1
            i += 1; poprz = 'a'; slowo = ''
            continue
        if c == '`':
            i += 1
            while i < n and kod[i] != '`':
                if kod[i] == '\\':
                    i += 2; continue
                if kod[i] == '$' and i + 1 < n and kod[i + 1] == '{':
                    stos.append('`'); i += 2; break
                i += 1
            else:
                i += 1; poprz = 'a'; slowo = ''
                continue
            poprz = '{'; slowo = ''
            continue
        if c == '}' and stos:
            stos.pop()
            i += 1
            while i < n and kod[i] != '`':
                if kod[i] == '\\':
                    i += 2; continue
                if kod[i] == '$' and i + 1 < n and kod[i + 1] == '{':
                    stos.append('`'); i += 2; break
                i += 1
            else:
                i += 1; poprz = 'a'; slowo = ''
                continue
            poprz = '{'; slowo = ''
            continue
        if c == '{' and stos:
            stos.append('{')
        if c == '/' and (poprz == '' or poprz in REGEX_PRZED or slowo in SLOWA_PRZED_REGEX):
            i += 1
            w_klasie = False
            while i < n and kod[i] != '\n':
                if kod[i] == '\\':
                    i += 2; continue
                if kod[i] == '[':
                    w_klasie = True
                elif kod[i] == ']':
                    w_klasie = False
                elif kod[i] == '/' and not w_klasie:
                    break
                i += 1
            i += 1
            while i < n and (kod[i].isalpha()):
                i += 1
            poprz = 'a'; slowo = ''
            continue
        if not c.isspace():
            if c.isalnum() or c in '_$':
                slowo = (slowo + c) if (poprz and (poprz.isalnum() or poprz in '_$')) else c
            else:
                slowo = ''
            poprz = c
        i += 1
    return wynik


def blad(plik, linia, tekst):
    bledy.append((plik, linia, tekst))


def ostrzezenie(plik, linia, tekst):
    ostrzezenia.append((plik, linia, tekst))


def pliki():
    for root, dirs, files in os.walk(KATALOG):
        dirs[:] = [d for d in dirs if d != '.git']
        for f in files:
            pelna = os.path.join(root, f)
            yield os.path.relpath(pelna, KATALOG).replace(os.sep, '/'), pelna


def nr_linii(tekst, pozycja):
    return tekst.count('\n', 0, pozycja) + 1


def na_stronie(rel):
    return not rel.startswith(POZA_STRONA)


def sprawdz_sekrety(rel, tresc):
    if rel == '.github/narzedzia/sprawdz.py':
        return
    for nazwa, wzor in SEKRETY:
        for m in re.finditer(wzor, tresc):
            blad(rel, nr_linii(tresc, m.start()),
                 f'Wygląda jak {nazwa}. Klucze i hasła nie mogą być w kodzie strony, '
                 f'bo każdy może je odczytać. Usuń ten fragment.')


def sprawdz_html(rel, tresc):
    for m in re.finditer(r'<!--', tresc):
        blad(rel, nr_linii(tresc, m.start()),
             'Komentarz HTML (<!-- ... -->). Na stronie nie zostawiamy notatek, bo widzi je '
             'każdy w źródle strony. Usuń komentarz.')
    for m in re.finditer(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', tresc, re.S | re.I):
        cialo, start = m.group(1), m.start(1)
        for k in komentarze_js(cialo):
            blad(rel, nr_linii(tresc, start + k),
                 'Komentarz w skrypcie wewnątrz strony (/* ... */ albo // ...). Usuń go.')
    for m in re.finditer(r'<style\b[^>]*>(.*?)</style>', tresc, re.S | re.I):
        for k in re.finditer(r'/\*', m.group(1)):
            blad(rel, nr_linii(tresc, m.start(1) + k.start()),
                 'Komentarz w stylach wewnątrz strony (/* ... */). Usuń go.')
    malo = tresc.lower()
    brak = [z for z in ('<html', '</html>', '<head', '<body', '</body>', '<title') if z not in malo]
    if brak:
        blad(rel, 1, 'Strona jest niekompletna (brakuje: ' + ', '.join(brak) + '). '
                     'Prawdopodobnie część pliku została usunięta. Przywróć ją (Historia zmian w GitHub).')
    widoczny = re.sub(r'<(script|style)\b.*?</\1>|<[^>]+>|&nbsp;|\s+', ' ', tresc, flags=re.S | re.I)
    if rel in WYMAGANE and len(widoczny.split()) < 30:
        blad(rel, 1, 'Ta strona jest prawie pusta. Przywróć jej treść (Historia zmian w GitHub).')
    baza = os.path.dirname(os.path.join(KATALOG, rel))
    for m in re.finditer(r'\b(?:src|href)\s*=\s*["\']([^"\'#?]+)', tresc, re.I):
        u = m.group(1).strip()
        if not u or re.match(r'^(?:[a-z]+:|//|\$|\{)', u, re.I):
            continue
        if u.startswith('/'):
            if u.rstrip('/') in ADRESY_SERWERA or u == '/':
                continue
            cel = os.path.normpath(os.path.join(KATALOG, u.lstrip('/')))
        else:
            cel = os.path.normpath(os.path.join(baza, u))
        if not (os.path.exists(cel) or os.path.exists(cel + '.html') or os.path.exists(os.path.join(cel, 'index.html'))):
            blad(rel, nr_linii(tresc, m.start()),
                 f'Plik „{u}” nie istnieje w repozytorium. Na stronie pojawi się puste miejsce albo '
                 'niedziałający link. Sprawdź nazwę pliku litera po literze (wielkość liter ma znaczenie).')


def sprawdz_svg(rel, tresc):
    for m in re.finditer(r'<!--(.*?)-->', tresc, re.S):
        if re.match(r'\s*(?:Generator:|@license)', m.group(1)):
            continue
        blad(rel, nr_linii(tresc, m.start()),
             'Komentarz w pliku SVG (<!-- ... -->). Na stronie nie zostawiamy notatek. Usuń go.')


def sprawdz_zewnetrzne(rel, tresc):
    wistia = ('Gotowy kod osadzenia Wistia. Taki kod włącza wideo przed zgodą na cookies. '
              'Skopiuj blok „video-facade" z innej strony i zmień w nim media-id '
              '(instrukcja „Zdjęcia i wideo”).')
    for m in re.finditer(r'<wistia-player\b|<[^>]*\bclass\s*=\s*["\'][^"\']*\bwistia_(?:embed|async)', tresc, re.I):
        blad(rel, nr_linii(tresc, m.start()), wistia)
    for m in re.finditer(r'<(script|iframe|embed|object|link)\b[^>]*?\b(?:src|href|data)\s*=\s*["\']'
                         r'((?:https?:)?//[^"\'/]+)', tresc, re.I):
        znacznik, host = m.group(1).lower(), re.sub(r'^(https?:)?//', '', m.group(2)).lower()
        if host in DOZWOLONE_HOSTY:
            continue
        if 'wistia' in host:
            blad(rel, nr_linii(tresc, m.start()), wistia)
            continue
        blad(rel, nr_linii(tresc, m.start()),
             f'Element <{znacznik}> ładuje coś z zewnętrznego serwera ({host}). Takie narzędzie '
             'może zapisywać cookies bez zgody i wymaga wpisu w banerze zgód. Uzgodnij je z osobą '
             'techniczną (instrukcja „Czego nie zmieniać”).')
    for m in re.finditer(r'<img\b[^>]*?\bsrc\s*=\s*["\']((?:https?:)?//[^"\'/]+)', tresc, re.I):
        ostrzezenie(rel, nr_linii(tresc, m.start()),
                    'Zdjęcie z zewnętrznego serwera. Gdy tamten plik zniknie, na stronie zostanie '
                    'puste miejsce. Bezpieczniej wgrać zdjęcie do assets/img/ (instrukcja „Zdjęcia i wideo”).')


def sprawdz_css(rel, tresc):
    for m in re.finditer(r'/\*', tresc):
        blad(rel, nr_linii(tresc, m.start()),
             'Komentarz w CSS (/* ... */). Na stronie nie zostawiamy notatek. Usuń go.')


def sprawdz_js(rel, pelna, tresc):
    for k in komentarze_js(tresc):
        blad(rel, nr_linii(tresc, k),
             'Komentarz w JavaScript (/* ... */ albo // ...). Na stronie nie zostawiamy notatek. Usuń go.')
    if shutil.which('node'):
        wynik = subprocess.run(['node', '--check', pelna], capture_output=True, text=True)
        if wynik.returncode != 0:
            m = re.search(r':(\d+)\n', wynik.stderr)
            blad(rel, int(m.group(1)) if m else 1,
                 'Błąd składni JavaScript: plik się nie wczyta i część strony przestanie działać '
                 '(np. pop-upy, kafelki zajęć). Szczegóły: '
                 + ' '.join(wynik.stderr.strip().splitlines()[-3:]))
    else:
        ostrzezenie(rel, 1, 'Brak programu node: składnia JavaScript nie została sprawdzona.')


def sprawdz_json(rel, tresc):
    try:
        json.loads(tresc)
    except json.JSONDecodeError as e:
        blad(rel, e.lineno, f'Błąd w pliku JSON (linia {e.lineno}, kolumna {e.colno}): {e.msg}. '
                            'Najczęściej brakuje przecinka albo cudzysłowu.')


def sprawdz_slowa(rel, tresc):
    for m in re.finditer(r'\b(TODO|FIXME)\b', tresc):
        blad(rel, nr_linii(tresc, m.start()),
             f'Słowo {m.group(1)} wygląda na notatkę roboczą. Usuń je ze strony.')


def sprawdz_piksel_i_zgody():
    for rel in ('assets/js/consent.js', 'assets/js/consent.en.js'):
        p = os.path.join(KATALOG, rel)
        if os.path.exists(p):
            t = open(p, encoding='utf-8').read()
            m = re.search(r'const\s+CONSENT_ENABLED\s*=\s*(true|false)\s*;', t)
            if not m or m.group(1) != 'true':
                blad(rel, nr_linii(t, m.start()) if m else 1,
                     'Baner zgód na cookies jest wyłączony (CONSENT_ENABLED nie jest true). '
                     'Bez banera strona nie pyta o zgodę, a piksel Meta nie wystartuje. '
                     'Przywróć: const CONSENT_ENABLED = true;')
    p = os.path.join(KATALOG, 'assets/js/pixel.js')
    if os.path.exists(p):
        t = open(p, encoding='utf-8').read()
        m = re.search(r'var\s+PIXEL_ID\s*=\s*"(\d*)"', t)
        if not m or not m.group(1):
            blad('assets/js/pixel.js', nr_linii(t, m.start()) if m else 1,
                 'Identyfikator piksela Meta jest pusty. Reklamy przestaną liczyć wizyty i zakupy.')


def sprawdz_vercel_json():
    p = os.path.join(KATALOG, 'vercel.json')
    if not os.path.exists(p):
        return
    try:
        cfg = json.load(open(p, encoding='utf-8'))
    except json.JSONDecodeError:
        return
    for klucz in ('ignoreCommand', 'buildCommand', 'git'):
        if klucz in cfg:
            blad('vercel.json', 1, f'W vercel.json pojawiło się ustawienie "{klucz}". Steruje ono publikacją '
                                   'i może wyłączyć sprawdzanie zmian. Usuń je; publikacją zarządza administrator.')
    for klucz in ('rewrites', 'redirects', 'headers'):
        if not isinstance(cfg.get(klucz), list) or not cfg.get(klucz):
            blad('vercel.json', 1, f'W vercel.json brakuje sekcji "{klucz}". Adresy typu '
                                   '/rejestracja albo przekierowania przestaną działać.')


def adresy_serwera():
    try:
        cfg = json.load(open(os.path.join(KATALOG, 'vercel.json'), encoding='utf-8'))
    except (OSError, json.JSONDecodeError):
        return set()
    return {r.get('source', '').rstrip('/') for k in ('rewrites', 'redirects') for r in cfg.get(k, [])}


ADRESY_SERWERA = set()


def main():
    ADRESY_SERWERA.update(adresy_serwera())
    for rel in WYMAGANE:
        if not os.path.exists(os.path.join(KATALOG, rel)):
            blad(rel, 1, 'Brakuje tego pliku. Bez niego część strony albo powrót z płatności '
                         'przestanie działać. Przywróć plik (Historia zmian w GitHub).')
    for rel, pelna in pliki():
        rozmiar = os.path.getsize(pelna)
        if rozmiar > 50 * 1024 * 1024:
            blad(rel, 1, 'Plik jest większy niż 50 MB. Zmniejsz go przed wgraniem.')
        elif rozmiar > 10 * 1024 * 1024:
            ostrzezenie(rel, 1, f'Duży plik ({rozmiar // (1024 * 1024)} MB): strona będzie się wolniej ładować.')
        if not rel.lower().endswith(TEKSTOWE):
            continue
        try:
            tresc = open(pelna, encoding='utf-8').read()
        except UnicodeDecodeError:
            blad(rel, 1, 'Plik nie jest zapisany jako UTF-8. Polskie znaki mogą się popsuć.')
            continue
        sprawdz_sekrety(rel, tresc)
        if not na_stronie(rel):
            continue
        if rel.endswith('.svg'):
            sprawdz_svg(rel, tresc)
        if rel.endswith('.html'):
            sprawdz_html(rel, tresc)
            sprawdz_zewnetrzne(rel, tresc)
        elif rel.endswith('.css'):
            sprawdz_css(rel, tresc)
        elif rel.endswith('.js'):
            sprawdz_js(rel, pelna, tresc)
        elif rel.endswith('.json'):
            sprawdz_json(rel, tresc)
        if rel.endswith(('.html', '.css', '.js', '.json')):
            sprawdz_slowa(rel, tresc)
    sprawdz_piksel_i_zgody()
    sprawdz_vercel_json()

    for plik, linia, tekst in ostrzezenia:
        print(f'::warning file={plik},line={linia}::{tekst}' if NA_GITHUB else f'UWAGA  {plik}:{linia}  {tekst}')
    for plik, linia, tekst in bledy:
        print(f'::error file={plik},line={linia}::{tekst}' if NA_GITHUB else f'BŁĄD   {plik}:{linia}  {tekst}')

    podsumowanie = os.environ.get('GITHUB_STEP_SUMMARY')
    if bledy:
        tekst = (f'## ❌ Strona NIE została opublikowana\n\nSprawdzenie znalazło {len(bledy)} '
                 f'problem(ów). Popraw je i zapisz zmianę jeszcze raz.\n\n'
                 + '\n'.join(f'- `{p}` linia {l}: {t}' for p, l, t in bledy[:50]))
        print(f'\nWYNIK: {len(bledy)} błędów, {len(ostrzezenia)} uwag. Publikacja wstrzymana.')
    else:
        tekst = ('## ✅ Sprawdzenie zakończone bez błędów\n\n' + ('Po scaleniu na main Vercel opublikuje tę wersję.' if os.environ.get('GITHUB_EVENT_NAME') == 'pull_request' else 'Vercel opublikuje tę wersję, zwykle w 1-3 minuty.'))
        if ostrzezenia:
            tekst += '\n\nUwagi (nie blokują):\n' + '\n'.join(f'- `{p}`: {t}' for p, l, t in ostrzezenia)
        print(f'\nWYNIK: 0 błędów, {len(ostrzezenia)} uwag.')
    if podsumowanie:
        with open(podsumowanie, 'a', encoding='utf-8') as f:
            f.write(tekst + '\n')
    return 1 if bledy else 0


if __name__ == '__main__':
    sys.exit(main())
