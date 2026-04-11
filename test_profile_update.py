import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tailorconnect_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import TailorProfile

User = get_user_model()

# Find a tailor user
tailor_user = User.objects.filter(role='tailor').first()

if tailor_user:
    print(f"Found tailor: {tailor_user.username} (ID: {tailor_user.id})")
    
    # Get their profile
    try:
        profile = TailorProfile.objects.get(user=tailor_user)
        print(f"Profile ID: {profile.id}")
        print(f"Current bio: {profile.bio}")
        print(f"Current specialty: {profile.specialty}")
        print(f"Current experience: {profile.experience}")
        print(f"Current location: {profile.location}")
        
        # Try updating
        profile.bio = "Updated bio for testing"
        profile.save()
        print("\n✅ Profile updated successfully!")
        
        # Verify
        profile.refresh_from_db()
        print(f"New bio: {profile.bio}")
        
    except TailorProfile.DoesNotExist:
        print(f"❌ No TailorProfile found for user {tailor_user.username}")
else:
    print("❌ No tailor users found")
