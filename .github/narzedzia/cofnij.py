#!/usr/bin/env python3
import os
import re
import subprocess
import sys

ZNACZNIK = '[cofnij]'
ADMINISTRACJA = '[administracja]'
POZA_STRONA = ('.github/', '.vercelignore')
NA_GITHUB = os.environ.get('GITHUB_ACTIONS') == 'true'


def git(*args, ok=True):
    r = subprocess.run(['git', *args], capture_output=True, text=True)
    if ok and r.returncode != 0:
        raise RuntimeError(f'git {" ".join(args)}: {r.stderr.strip()}')
    return r


def odmowa(tekst):
    print(f'::error::{tekst}' if NA_GITHUB else f'ODMOWA: {tekst}')
    podsumowanie = os.environ.get('GITHUB_STEP_SUMMARY')
    if podsumowanie:
        with open(podsumowanie, 'a', encoding='utf-8') as f:
            f.write(f'## ⛔ Nic nie zostało cofnięte\n\n{tekst}\n')
    sys.exit(1)


def zmienione_pliki(sha):
    if git('rev-parse', '--verify', '--quiet', f'{sha}^1', ok=False).returncode == 0:
        out = git('diff', '--name-only', f'{sha}^1', sha).stdout
    else:
        out = git('diff-tree', '--no-commit-id', '--name-only', '-r', '--root', sha).stdout
    return [l for l in out.splitlines() if l]


def zmienia_strone(pliki):
    return any(not p.startswith(POZA_STRONA) for p in pliki)


def main():
    historia = git('log', '--first-parent', '--format=%H%x09%P%x09%s%x09%b%x1e', 'HEAD').stdout
    pominiete = set()
    cel = None
    for rekord in historia.split('\x1e'):
        rekord = rekord.strip('\n')
        if not rekord:
            continue
        sha, rodzice, temat, tresc = (rekord.split('\t', 3) + ['', '', ''])[:4]
        rodzice = rodzice.split()
        if sha in pominiete:
            continue
        if ZNACZNIK in tresc:
            m = re.search(r'Cofa:\s*([0-9a-f]{40})', tresc)
            if m:
                pominiete.add(m.group(1))
            continue
        if ADMINISTRACJA in tresc:
            continue
        if not zmienia_strone(zmienione_pliki(sha)):
            continue
        if len(rodzice) > 1:
            odmowa(f'Ostatnia zmiana strony to połączenie gałęzi ({sha[:7]} „{temat}”). '
                   'Takiej zmiany automat nie cofa. Skontaktuj się z administratorem strony.')
        if not rodzice:
            odmowa('Nie ma już czego cofać: następna zmiana to pierwszy zapis strony w repozytorium.')
        cel = (sha, temat)
        break
    if not cel:
        odmowa('Nie znaleziono żadnej zmiany strony do cofnięcia.')

    sha, temat = cel
    r = git('revert', '--no-commit', sha, ok=False)
    if r.returncode != 0:
        git('revert', '--abort', ok=False)
        git('reset', '--hard', 'HEAD', ok=False)
        odmowa(f'Zmiany „{temat}” ({sha[:7]}) nie da się cofnąć automatycznie, bo późniejsze '
               'zapisy zmieniły te same miejsca w plikach. Nic nie zostało zmienione. '
               'Cofnij ręcznie (Historia pliku w GitHub) albo skontaktuj się z administratorem.')
    if not git('diff', '--cached', '--name-only').stdout.strip():
        git('reset', '--hard', 'HEAD', ok=False)
        odmowa(f'Zmiana „{temat}” ({sha[:7]}) jest już wycofana w obecnej wersji. Nic nie zostało zmienione.')
    wiadomosc = f'Cofnięcie zmiany: {temat}\n\nCofa: {sha}\n{ZNACZNIK}'
    git('commit', '-m', wiadomosc)
    nowy = git('rev-parse', 'HEAD').stdout.strip()
    print(f'Przygotowano cofnięcie: {sha[:7]} „{temat}” -> nowy zapis {nowy[:7]}')
    podsumowanie = os.environ.get('GITHUB_STEP_SUMMARY')
    if podsumowanie:
        pliki = '\n'.join(f'- `{p}`' for p in zmienione_pliki(sha) if not p.startswith(POZA_STRONA))
        with open(podsumowanie, 'a', encoding='utf-8') as f:
            f.write(f'## ↩️ Cofnięto zmianę „{temat}”\n\nZapis `{sha[:7]}`. Przywrócone pliki:\n{pliki}\n')
    return 0


if __name__ == '__main__':
    sys.exit(main())
