import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tailorconnect_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

try:
    user = User.objects.get(username='demo_client')
    user.set_password('pass123')
    user.save()
    print(f"SUCCESS: Password for '{user.username}' has been reset to 'pass123'")
except User.DoesNotExist:
    print("ERROR: User 'demo_client' does not exist. Creating it now...")
    User.objects.create_user(username='demo_client', password='pass123', email='client@demo.com')
    print("SUCCESS: User 'demo_client' created with password 'pass123'")
