import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tailorconnect_backend.settings")
django.setup()

from django.contrib.auth import get_user_model
from users.models import TailorProfile
from measurements.models import MeasurementProfile
from orders.serializers import OrderSerializer
from designs.models import Design

User = get_user_model()

def test_create_order():
    try:
        # Get or create necessary data
        client = User.objects.filter(role='client').first()
        if not client:
            print("No client found")
            return

        tailor_user = User.objects.filter(role='tailor').first()
        if not tailor_user:
            print("No tailor user found")
            return
            
        tailor_profile = TailorProfile.objects.filter(user=tailor_user).first()
        if not tailor_profile:
            print("No tailor profile found")
            return

        print(f"Client: {client.id}, Tailor Profile: {tailor_profile.id}")

        # Simulate Payload
        data = {
            "tailor": tailor_profile.id,
            "client": client.id,
            "design": None,
            "measurements": None 
        }

        print("Testing payload:", data)

        serializer = OrderSerializer(data=data)
        if serializer.is_valid():
            print("Serializer is valid")
            # emulate perform_create
            order = serializer.save(client=client)
            print("Order created successfully:", order.order_id)
            
            # Check response data (where get_measurement_snapshot runs)
            print(" serialized data:", serializer.data)
        else:
            print("Validation errors:", serializer.errors)

    except Exception as e:
        with open("debug_log.txt", "w") as f:
            import traceback
            traceback.print_exc(file=f)
        print("EXCEPTION CAUGHT. See debug_log.txt")

if __name__ == "__main__":
    test_create_order()
