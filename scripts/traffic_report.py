#!/usr/bin/env python3
"""Create an honest daily traffic snapshot from GoatCounter when an API key is available."""
from __future__ import annotations
import json, os
from datetime import datetime, timezone, timedelta
from urllib.parse import urlencode
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data/traffic/latest.json'
API = 'https://homeprojectwise.goatcounter.com/api/v0'


def get(path, params):
    token = os.environ.get('GOATCOUNTER_API_KEY', '').strip()
    if not token:
        return None
    url = f'{API}/{path}?{urlencode(params)}'
    req = Request(url, headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'})
    try:
        with urlopen(req, timeout=30) as r:
            return json.load(r)
    except HTTPError as exc:
        raise RuntimeError(f'GoatCounter HTTP {exc.code} on /{path}') from exc


def main():
    now = datetime.now(timezone.utc)
    start = (now - timedelta(days=1)).replace(minute=0, second=0, microsecond=0)
    previous_start = start - timedelta(days=1)
    token = os.environ.get('GOATCOUNTER_API_KEY', '').strip()

    if not token:
        payload = {
            'status': 'UNAVAILABLE',
            'reason': 'GOATCOUNTER_API_KEY is not configured for GitHub Actions. No traffic number is inferred.',
            'generated_at': now.isoformat(),
        }
    else:
        try:
            common = {'start': start.isoformat(), 'end': now.isoformat(), 'limit': 100}
            errors = {}

            def safe(name, path, params):
                try:
                    return get(path, params)
                except Exception as exc:
                    errors[name] = str(exc)
                    return None

            probe = safe('me', 'me', {})
            total = safe('total', 'stats/total', {'start': start.isoformat(), 'end': now.isoformat()})
            hits = safe('hits', 'stats/hits', common)
            refs = safe('toprefs', 'stats/toprefs', common)
            locations = safe('locations', 'stats/locations', common)
            prev = safe('previous_total', 'stats/total', {'start': previous_start.isoformat(), 'end': start.isoformat()})
            payload = {
                'status': 'OK' if not errors else ('PARTIAL' if total is not None else 'UNAVAILABLE'),
                'endpoint_errors': errors,
                'api_user_ok': probe is not None,
                'generated_at': now.isoformat(),
                'period_start': start.isoformat(),
                'period_end': now.isoformat(),
                'visitors': total.get('total') if isinstance(total, dict) else None,
                'pageviews': total,
                'paths': hits,
                'referrers': refs,
                'locations': locations,
                'previous_period_visitors': prev.get('total') if isinstance(prev, dict) else None,
                'previous_period_pageviews': prev,
            }
        except Exception as exc:
            payload = {'status': 'UNAVAILABLE', 'generated_at': now.isoformat(), 'reason': f'GoatCounter API unavailable: {exc}'}

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
