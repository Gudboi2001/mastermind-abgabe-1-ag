"""
mastermind_client.py – Interaktiver Client (Arbeitspaket G)
  >>> Verwendete REST API Version: v1

Startet eine Runde, liest Tips von der Konsole, validiert die Eingabe
(4 gültige Farben) und gibt die Server-Antwort aus. Nach Gewinn: neue
Runde oder beenden.
Aufruf:  python mastermind_client.py [--url http://host:port]
"""
from __future__ import annotations
import argparse
import sys
from api_client import MastermindApi, ApiError, API_VERSION

COLORS = ["rot", "orange", "gelb", "grün", "blau", "violet"]
SHORT = {"r": "rot", "o": "orange", "g": "gelb", "n": "grün", "b": "blau", "v": "violet"}


def parse_guess(raw: str) -> list[str] | None:
    parts = raw.replace(",", " ").split()
    if len(parts) != 4:
        print("  ! Bitte genau 4 Farben eingeben.")
        return None
    result = []
    for p in parts:
        p = p.strip().lower()
        if p in COLORS:
            result.append(p)
        elif p in SHORT:
            result.append(SHORT[p])
        else:
            print(f"  ! Ungültige Farbe: '{p}'. Erlaubt: {', '.join(COLORS)} (oder r/o/g/n/b/v).")
            return None
    return result


def render_feedback(res: dict) -> None:
    dots = "*" * res["black"] + "o" * res["white"] + "." * (4 - res["black"] - res["white"])
    print(f"  Hinweis: [{dots}]  {res['black']} richtig, {res['white']} nur Farbe")


def play_round(api: MastermindApi, session_id: str) -> None:
    game = api.new_game(session_id=session_id)
    gid = game["gameId"]
    print(f"\nNeue Runde. Farben: {', '.join(COLORS)}  ('q' = Runde abbrechen)\n")
    while True:
        raw = input("Dein Tip > ").strip()
        if raw.lower() == "q":
            print("Runde abgebrochen.")
            return
        guess = parse_guess(raw)
        if guess is None:
            continue
        try:
            res = api.guess(gid, guess)
        except ApiError as exc:
            print(f"  ! Serverfehler: {exc}")
            continue
        if res["solved"]:
            print(f"\n*** Gewonnen in {res['attempts']} Versuchen! ***")
            return
        render_feedback(res)


def main() -> int:
    ap = argparse.ArgumentParser(description="Interaktiver Mastermind-Client (G)")
    ap.add_argument("--url", default="http://localhost:3000")
    args = ap.parse_args()
    api = MastermindApi(args.url)
    print("=" * 40)
    print(f"  Mastermind Client (REST API {API_VERSION})")
    print("=" * 40)
    try:
        api.health()
    except ApiError as exc:
        print(f"Server nicht erreichbar: {exc}")
        return 1
    while True:
        print("\nMenü:  [1] Spielen   [2] Beenden")
        choice = input("Auswahl > ").strip()
        if choice == "1":
            play_round(api, "cli")
        elif choice == "2":
            print("Auf Wiedersehen!")
            return 0
        else:
            print("  ! Bitte 1 oder 2 wählen.")


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (KeyboardInterrupt, EOFError):
        print("\nBeendet.")
        sys.exit(0)
