import urllib.request
import json
import sys

def get_token(username, password):
    url = "http://127.0.0.1:8000/api/token/"
    data = json.dumps({'username': username, 'password': password}).encode('utf-8')
    headers = {'Content-Type': 'application/json'}
    try:
        req = urllib.request.Request(url, data, headers)
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read())['access']
    except urllib.error.HTTPError as e:
        print(f"Failed to get token: {e}")
        return None

def test_endpoint(endpoint, token=None, method='GET', data=None):
    url = f"http://127.0.0.1:8000/api/{endpoint}"
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    
    body = None
    if data:
        body = json.dumps(data).encode('utf-8')
    
    try:
        req = urllib.request.Request(url, data=body, headers=headers, method=method)
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read())
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.reason}")
        print(e.read().decode())
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

# Main execution
# 1. Login as a tailor (need to know a tailor creds or create one, assuming 'tailor1'/'pass123' or use existing)
# Ideally we should use Django ORM to ensure a user exists, but this is an external script.
# We can use the open python file to query ORM if needed, but let's try to infer from 'test_profile_update.py' which found a tailor.

# Let's try to run a snippet to finding a tailor username first using manage.py shell or similar.
# But for now, let's try common default.
# Actually, I'll use the ORM to find a tailor user and their password (we can't get password).
# So I should create a temporary user or set a known password.
# Or use `test_profile_update.py` approach to find a user. But I need to authenticate via API.

# Better approach: Use Django test client or setup script.
# I will use a hybrid: Use Django setup to change a tailor's password to something known, then use API.

import os
import django

# Setup Django
sys.path.append('c:\\Users\\USER\\Documents\\PATH+Technologies\\TailorConnect')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tailorconnect_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import TailorProfile

User = get_user_model()
tailor_user = User.objects.filter(role='tailor').first()
if not tailor_user:
    print("No tailor user found!")
    sys.exit(1)

# Set known password
tailor_user.set_password("testing123")
tailor_user.save()
print(f"Using tailor: {tailor_user.username}")

# Now test API
token = get_token(tailor_user.username, "testing123")
if not token:
    print("Could not retrieve token")
    sys.exit(1)

print("Got token.")

# Get Profile ID
try:
    profile = tailor_user.tailor_profile
    profile_id = profile.id
    print(f"Profile ID: {profile_id}")
except Exception as e:
    print(f"Could not get profile from ORM: {e}")
    sys.exit(1)

# Try GET
print(f"Fetching profile {profile_id}...")
resp = test_endpoint(f"profiles/{profile_id}/", token)
if resp:
    print("GET success")
else:
    print("GET failed")

# Try PATCH
print(f"Updating profile {profile_id}...")
update_data = {
    "bio": "Updated via API test script",
    "experience": 5
}
resp = test_endpoint(f"profiles/{profile_id}/", token, method='PATCH', data=update_data)

if resp:
    print("PATCH success!")
    print(f"New Bio: {resp.get('bio')}")
else:
    print("PATCH failed!")
