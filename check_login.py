import urllib.request
import json
import sys

url = "http://127.0.0.1:8000/api/token/"
data = json.dumps({'username': 'demo_client', 'password': 'pass123'}).encode('utf-8')
headers = {'Content-Type': 'application/json'}

try:
    req = urllib.request.Request(url, data, headers)
    with urllib.request.urlopen(req) as response:
        if response.status == 200:
            res_body = response.read()
            tokens = json.loads(res_body)
            print("LOGIN SUCCESS!")
            print(f"Token: {tokens['access'][:20]}...")
        else:
            print(f"LOGIN FAILED: {response.status}")
except urllib.error.HTTPError as e:
    print(f"HTTP ERROR: {e.code}")
    print(e.read().decode())
except urllib.error.URLError as e:
    print(f"CONNECTION ERROR: {e.reason}")
    print("Is the server running on port 8000?")
