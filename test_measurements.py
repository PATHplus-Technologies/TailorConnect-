import urllib.request
import json
import sys

def get_token():
    url = "http://127.0.0.1:8000/api/token/"
    data = json.dumps({'username': 'demo_client', 'password': 'pass123'}).encode('utf-8')
    headers = {'Content-Type': 'application/json'}
    req = urllib.request.Request(url, data, headers)
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read())['access']

def test_measurements():
    try:
        token = get_token()
        print("Got fresh token.")
        
        url = "http://127.0.0.1:8000/api/measurements/"
        headers = {'Authorization': f'Bearer {token}'}
        req = urllib.request.Request(url, headers=headers)
        
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                print("SUCCESS: Accessed measurements endpoint.")
                data = json.loads(response.read())
                print(f"Data: {data}")
            else:
                print(f"FAILED: {response.status}")
                
    except urllib.error.HTTPError as e:
        print(f"HTTP ERROR: {e.code}")
        print(e.read().decode())
    except Exception as e:
        print(f"ERROR: {e}")

test_measurements()
