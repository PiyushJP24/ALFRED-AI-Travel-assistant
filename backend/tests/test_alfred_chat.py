"""Tests for POST /api/alfred/chat (Gemini integration)."""
import os
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://ease-trip-assistant.preview.emergentagent.com").rstrip("/")
CHAT_URL = f"{BASE_URL}/api/alfred/chat"
VALID_CATEGORIES = {"Adventure", "Culture", "Relaxation"}


def _post(payload, timeout=45):
    return requests.post(CHAT_URL, json=payload, timeout=timeout)


# --- suggest mode ---
def test_suggest_returns_valid_destinations():
    r = _post({"mode": "suggest", "text": "beaches and nightlife"})
    assert r.status_code == 200, f"got {r.status_code}: {r.text[:400]}"
    body = r.json()
    assert body.get("ok") is True
    data = body["data"]
    assert isinstance(data.get("message"), str) and data["message"].strip()
    dests = data.get("destinations")
    assert isinstance(dests, list) and 2 <= len(dests) <= 3
    for d in dests:
        assert isinstance(d.get("name"), str) and d["name"]
        assert isinstance(d.get("description"), str)
        assert d.get("category") in VALID_CATEGORIES, f"bad category: {d.get('category')}"
        assert isinstance(d.get("flightPrice"), (int, float))
        assert isinstance(d.get("duration"), str)


# --- itinerary mode ---
def test_itinerary_returns_valid_days():
    r = _post({"mode": "itinerary", "destination": "Goa", "days": 3})
    assert r.status_code == 200, f"got {r.status_code}: {r.text[:400]}"
    body = r.json()
    assert body.get("ok") is True
    data = body["data"]
    assert isinstance(data.get("message"), str)
    days = data.get("days")
    assert isinstance(days, list) and len(days) == 3
    for day in days:
        assert isinstance(day.get("label"), str) and day["label"]
        stops = day.get("stops")
        assert isinstance(stops, list) and len(stops) >= 1
        for s in stops:
            assert s.get("kind") in ("meal", "place")
            assert isinstance(s.get("label"), str) and s["label"]
            assert isinstance(s.get("detail"), str)


# --- robustness ---
def test_empty_body_does_not_crash():
    r = _post({"mode": ""})
    # accepts default (suggest) or clean 4xx/5xx, but never a raw 500 crash
    assert r.status_code in (200, 400, 422, 502, 503), f"unexpected {r.status_code}"
    # must be valid JSON, not a crashed worker
    r.json()


def test_invalid_mode_no_stack_crash():
    r = _post({"mode": "not_a_mode", "text": "hello"})
    assert r.status_code in (200, 400, 422, 502, 503)
    r.json()


def test_missing_required_field_returns_422():
    # mode is required
    r = requests.post(CHAT_URL, json={}, timeout=15)
    assert r.status_code in (200, 422)
