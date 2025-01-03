import requests
from dotenv import load_dotenv
import os
#Ebay API implementation

def get_items(query, limit):

    url = "https://api.ebay.com/buy/browse/v1/item_summary/search"
    headers = {
        "Authorization": "Bearer " + get_ebay_token(),
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_CA",
        "Accept-Language": "en-CA",
    }
    params = {
        "q": query,
        "limit": limit,
    }

    response = requests.get(url, headers = headers, params = params)

    return response

load_dotenv()
ENCODED_ID_AND_SECRET = os.getenv("BASE_64_ENCODED_ID_AND_SECRET")

def get_ebay_token():
    url = "https://api.ebay.com/identity/v1/oauth2/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic "  + ENCODED_ID_AND_SECRET
    }
    data = {
        "grant_type": "client_credentials",
        "scope": "https://api.ebay.com/oauth/api_scope"
    }

    response = requests.post(url, headers=headers, data=data)
    response.raise_for_status()
    return response.json()["access_token"]


def get_item_by_id(id):
    url = f"https://api.ebay.com/buy/browse/v1/item/{id}"

    headers = {
        "Authorization": "Bearer " + get_ebay_token(),
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_CA",
        "Accept-Language": "en-CA",
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

get_items("book", "2")