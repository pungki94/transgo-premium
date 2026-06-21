import os
import urllib.request
import json
from urllib.error import URLError

GOOGLE_SHEETS_ID = "1gi0jDSZv39xF4TdiyeHE6NwsIMplQuvLxyqPOTdX6A4"
GOOGLE_API_KEY = "AIzaSyD0SxpjbbZ7nbSF0qbyWcU-9Kq1eGyZIEc"

def fetch_sheet(sheet_name):
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{GOOGLE_SHEETS_ID}/values/{sheet_name}?key={GOOGLE_API_KEY}"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            with open('settings_raw.json', 'w') as f:
                json.dump(data.get('values', []), f, indent=2)
            print("Successfully dumped to settings_raw.json")
    except Exception as e:
        print(f"Failed to fetch '{sheet_name}': {e}")

if __name__ == "__main__":
    fetch_sheet("settings")
