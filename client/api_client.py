"""
api_client.py – REST-Wrapper (Spielfunktionen).
  >>> Verwendete REST API Version: v1
"""
from __future__ import annotations
import requests

API_VERSION = "v1"

class ApiError(Exception):
    pass

class MastermindApi:
    def __init__(self, base_url: str = "http://localhost:3000", timeout: float = 10.0):
        self.base = base_url.rstrip("/") + "/api/" + API_VERSION
        self.timeout = timeout
        self.session = requests.Session()

    def _request(self, method: str, path: str, body: dict | None = None) -> dict:
        try:
            resp = self.session.request(method, self.base + path, json=body, timeout=self.timeout)
        except requests.RequestException as exc:
            raise ApiError(f"Verbindungsfehler: {exc}") from exc
        data = {}
        try:
            data = resp.json()
        except ValueError:
            pass
        if not resp.ok:
            raise ApiError(data.get("error", f"HTTP {resp.status_code}"))
        return data

    def health(self) -> dict:
        return self._request("GET", "/health")

    def new_game(self, player: str | None = None, session_id: str | None = None) -> dict:
        return self._request("POST", "/games", {"player": player, "sessionId": session_id})

    def guess(self, game_id: str, colors: list[str]) -> dict:
        return self._request("POST", f"/games/{game_id}/guesses", {"guess": colors})
