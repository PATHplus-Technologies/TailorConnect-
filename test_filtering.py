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

def test_endpoint(endpoint):
    url = f"http://127.0.0.1:8000/api/{endpoint}"
    token = get_token()
    headers = {'Authorization': f'Bearer {token}'}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read())

try:
    print("Testing Filtering...")
    all_designs = test_endpoint("designs/")
    print(f"Total Designs: {len(all_designs)}")
    
    # Assuming at least one design exists and has an owner.
    if all_designs:
        owner_id = all_designs[0]['owner']
        print(f"Filtering for Owner ID: {owner_id}")
        filtered = test_endpoint(f"designs/?tailor={owner_id}")
        print(f"Filtered Count: {len(filtered)}")
        
        if len(filtered) > 0 and len(filtered) <= len(all_designs):
            print("SUCCESS: Filtering returned valid subset.")
        else:
            print("FAILURE: Filter logic seems off.")
    else:
        print("WARNING: No designs to test filtering with.")

except Exception as e:
    print(f"ERROR: {e}")
