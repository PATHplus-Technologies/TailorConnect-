from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer, User
from django.shortcuts import get_object_or_404

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.conversations.all().order_by('-updated_at')

    @decorators.action(detail=False, methods=['post'])
    def start(self, request):
        # Start a conversation with another user
        other_user_id = request.data.get('user_id')
        if not other_user_id:
             return Response({"detail": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)
             
        other_user = get_object_or_404(User, id=other_user_id)
        
        # 1. Self Chat Check
        if request.user.id == other_user.id:
             return Response({"detail": "Cannot chat with yourself."}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Block Same-Role Chats
        if request.user.role == other_user.role:
            return Response({"detail": f"You cannot start a chat with another {request.user.role}."}, status=status.HTTP_403_FORBIDDEN)

        # 3. Tailor -> Client restriction (Engagement Rule)
        if request.user.role == 'tailor' and other_user.role == 'client':
            # Check for existing order
            # Note: We import inside method to avoid circular imports if any
            from orders.models import Order
            # Order.tailor links to TailorProfile, so we check tailor__user
            has_order = Order.objects.filter(tailor__user=request.user, client=other_user).exists()
            if not has_order:
                 return Response({"detail": "Tailors can only message clients they have an active order with."}, status=status.HTTP_403_FORBIDDEN)
        
        # Check if conversation already exists
        # This is a bit simplistic for >2 users, but works for 1-1
        convs = self.get_queryset().filter(participants=other_user)
        if convs.exists():
            return Response(ConversationSerializer(convs.first()).data)
            
        conv = Conversation.objects.create()
        conv.participants.add(request.user, other_user)
        return Response(ConversationSerializer(conv).data, status=status.HTTP_201_CREATED)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(conversation__participants=self.request.user)


    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
