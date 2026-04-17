import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tailorconnect_backend.settings')
django.setup()

from users.models import Specialty

# List of Guinean and West African tailoring specialties
specialties = [
    "Lépi Specialist",
    "Kindili Specialist",
    "Forêt Sacrée",
    "Bazin Rich",
    "Hand Embroidery",
    "Wedding & Bridal",
    "Traditional Wear",
    "Modern Fusion",
    "Suits",
    "Dresses",
    "Shirts",
    "Alterations"
]

def seed_specialties():
    print("Seeding specialties...")
    for name in specialties:
        obj, created = Specialty.objects.get_or_create(name=name)
        if created:
            print(f"✅ Created: {name}")
        else:
            print(f"ℹ️ Already exists: {name}")
    print("Seeding complete.")

if __name__ == "__main__":
    seed_specialties()
