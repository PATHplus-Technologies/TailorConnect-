import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tailorconnect_backend.settings')
django.setup()

from designs.models import Design
from orders.models import OrderItem, Order
from users.models import User, TailorProfile

def run():
    print("Verifying Backend Changes...")
    
    # 1. Test Design Components
    print("\n[1] Testing Design Components...")
    try:
        # Create user if needed for owner
        user, _ = User.objects.get_or_create(username="test_designer", defaults={"email":"test@example.com"})
        
        design = Design.objects.create(
            name="Premium Kaftan Set",
            components=["Top", "Pants", "Cap"],
            owner=user,
            price=150.00
        )
        print(f"PASS: Created Design '{design.name}' with components: {design.components}")
    except Exception as e:
        print(f"FAIL: Design creation error: {e}")

    # 2. Test OrderItem Split Sizing & Custom Measurements
    print("\n[2] Testing OrderItem Fields...")
    try:
        # Create dummy order context
        client, _ = User.objects.get_or_create(username="messi_client", defaults={"email":"messi@example.com"})
        tailor_user, _ = User.objects.get_or_create(username="tailor_bob", defaults={"email":"bob@example.com"})
        tailor, _ = TailorProfile.objects.get_or_create(user=tailor_user)
        
        order = Order.objects.create(client=client, tailor=tailor)
        
        # Create OrderItem with new data
        item_sizes = {"Top": "XL", "Pants": "L", "Cap": "Standard"}
        custom_measures = {"Chest": 42.5, "Inseam": 32}
        
        item = OrderItem.objects.create(
            order=order,
            design=design,
            quantity=1,
            size_selection=item_sizes,
            custom_measurements=custom_measures
        )
        
        # Verify fetching back
        fetched_item = OrderItem.objects.get(id=item.id)
        
        if fetched_item.size_selection == item_sizes:
            print(f"PASS: Saved and retrieved size_selection: {fetched_item.size_selection}")
        else:
            print(f"FAIL: size_selection mismatch. Got {fetched_item.size_selection}")
            
        if fetched_item.custom_measurements == custom_measures:
             print(f"PASS: Saved and retrieved custom_measurements: {fetched_item.custom_measurements}")
        else:
             print(f"FAIL: custom_measurements mismatch. Got {fetched_item.custom_measurements}")
             
    except Exception as e:
        print(f"FAIL: OrderItem test error: {e}")

if __name__ == "__main__":
    run()
