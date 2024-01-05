from google.auth.transport.requests import Request
from google.oauth2 import id_token
import os
import requests
import sys
open_id_connect_token = id_token.fetch_id_token(Request(), os.environ["IAP_CLIENT_ID"])
headers = {
    'Authorization': f'Bearer {open_id_connect_token}',
    'accept': 'application/json',
    'Content-Type': 'application/json'
}
json = {
    'name': sys.argv[1],
    'image': 'ghcr.io/artlas/api',
    'tag': sys.argv[2]
} 
x = requests.post("https://docker.fournierfamily.ovh/to_reload",headers=headers, json=json, timeout=600)

if x.status_code != 200 :
    exit(1)
else:
    exit(0)