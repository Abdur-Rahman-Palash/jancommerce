import json
from pathlib import Path


def get_products():
    data_file = Path(__file__).resolve().parent.parent / 'data' / 'products.json'
    try:
        with open(data_file) as f:
            return json.load(f)
    except FileNotFoundError:
        return []
