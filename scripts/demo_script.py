import os
import django
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tailorconnect_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import TailorProfile
from measurements.models import MeasurementProfile
from chat.models import Conversation, Message
from orders.models import Order
from payments.models import Transaction
from reviews.models import Review
from designs.models import Design

User = get_user_model()

def run_demo():
    print("🚀 Starting Backend Feature Demo...\n")

    # 1. Create Users
    print("👤 Creating Users...")
    client, _ = User.objects.get_or_create(username='demo_client', email='client@demo.com', defaults={'role': 'client'})
    if not client.check_password('pass123'): client.set_password('pass123'); client.save()
    
    tailor_user, _ = User.objects.get_or_create(username='demo_tailor', email='tailor@demo.com', defaults={'role': 'tailor'})
    if not tailor_user.check_password('pass123'): tailor_user.set_password('pass123'); tailor_user.save()
    
    print(f"   ✅ Client: {client.username}")
    print(f"   ✅ Tailor: {tailor_user.username}")

    # 2. Create Tailor Profile and Design
    print("\n🧵 Setting up Tailor Profile...")
    tailor_profile, created = TailorProfile.objects.get_or_create(
        user=tailor_user,
        defaults={'specialty': 'Traditional Wear', 'experience': 5, 'location': 'Conakry'}
    )
    if not created: 
        tailor_profile.specialty = 'Traditional Wear'
        tailor_profile.save()
    
    design, _ = Design.objects.get_or_create(
        name="Bazin Riche", 
        owner=tailor_user,
        defaults={'price': 500000, 'description': 'Premium quality bazin'}
    )
    print(f"   ✅ Tailor Profile: {tailor_profile}")
    print(f"   ✅ Design: {design.name} ({design.price} GNF)")

    # 3. Create Measurement Profile (NEW)
    print("\n📏 Creating Measurement Profile...")
    measure, _ = MeasurementProfile.objects.get_or_create(
        user=client,
        profile_name="My Festival Fit",
        defaults={
            'chest': 42.5, 'waist': 34.0, 'inseam': 32.0, 
            'shoulder': 18.0, 'sleeve_length': 25.0
        }
    )
    print(f"   ✅ Created: {measure}")

    # 4. Chat Flow (NEW)
    print("\n💬 Testing Chat System...")
    # Client starts conversation
    conversation = Conversation.objects.create()
    conversation.participants.add(client, tailor_user)
    
    msg1 = Message.objects.create(conversation=conversation, sender=client, content="Hello! Can you make this Bazin in blue?")
    msg2 = Message.objects.create(conversation=conversation, sender=tailor_user, content="Yes, I have blue fabric available.")
    
    print(f"   ✅ Conversation ID: {conversation.id}")
    print(f"   ✅ Message 1 ({msg1.sender.username}): {msg1.content}")
    print(f"   ✅ Message 2 ({msg2.sender.username}): {msg2.content}")

    # 5. Order & Payment (NEW)
    print("\n💳 Processing Order & Payment...")
    order = Order.objects.create(
        client=client,
        tailor=tailor_profile,
        design=design,
        status='pending',
        price=design.price
    )
    
    transaction = Transaction.objects.create(
        order=order,
        amount=order.price,
        currency='GNF',
        status='successful',
        provider_ref='PAY-123456789'
    )
    
    # Update order status after payment
    order.status = 'accepted'
    order.save()
    
    print(f"   ✅ Order #{order.order_id} created.")
    print(f"   ✅ Transaction recorded: {transaction}")
    print(f"   ✅ Order Status updated to: {order.status}")

    # 6. Review (NEW)
    print("\n⭐ Submitting Review...")
    review, _ = Review.objects.get_or_create(
        client=client,
        tailor=tailor_profile,
        order=order,
        defaults={'rating': 5, 'comment': "Excellent work! Fits perfectly."}
    )
    print(f"   ✅ Review: {review.rating} stars - '{review.comment}'")

    print("\n✨ DEMO COMPLETE! All systems functional.")

if __name__ == '__main__':
    run_demo()
