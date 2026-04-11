import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tailorconnect_backend.settings')
django.setup()

from django.contrib.auth import authenticate, get_user_model
from rest_framework.test import APIClient

User = get_user_model()

def debug_auth():
    print("--- DEBUGGING AUTHENTICATION ---")
    
    # 1. Check User Existence and Status
    try:
        user = User.objects.get(username='demo_client')
        print(f"[CHECK] User 'demo_client' found.")
        print(f"        Is Active: {user.is_active}")
        print(f"        Password Hash: {user.password[:10]}...") 
    except User.DoesNotExist:
        print("[FAIL] User 'demo_client' NOT FOUND!")
        return

    # 2. Test Low-Level Authentication
    user_auth = authenticate(username='demo_client', password='pass123')
    if user_auth:
        print("[PASS] django.contrib.auth.authenticate() returned User.")
    else:
        print("[FAIL] django.contrib.auth.authenticate() returned None. Password mismatch or is_active=False.")

    # 3. Test API Endpoint (simulating what frontend does)
    client = APIClient()
    response = client.post('/api/token/', {'username': 'demo_client', 'password': 'pass123'}, format='json')
    
    print(f"\n[API TEST] POST /api/token/ Status: {response.status_code}")
    if response.status_code == 200:
        print("[PASS] Token endpoint successful.")
        try:
            print(f"       Response Keys: {response.data.keys()}")
        except AttributeError:
            print(f"       Response Content: {response.content}")
    else:
        try:
            print(f"[FAIL] Token endpoint failed. Data: {response.data}")
        except AttributeError:
             print(f"[FAIL] Token endpoint failed. Content: {response.content}")

    # 4. Test Serializer Directly (to see traceback)
    print("\n[SERIALIZER TEST]")
    try:
        from users.serializers import CustomTokenObtainPairSerializer
        # We need a dummy request context for simplejwt potentially, depending on implementation
        # But standard validate doesn't always need it.
        serializer = CustomTokenObtainPairSerializer(data={'username': 'demo_client', 'password': 'pass123'})
        if serializer.is_valid():
            print("[PASS] Serializer validation successful.")
            print(f"       Result: {serializer.validated_data}")
        else:
            print(f"[FAIL] Serializer invalid: {serializer.errors}")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"[CRASH] Serializer crashed: {e}")

if __name__ == "__main__":
    debug_auth()
