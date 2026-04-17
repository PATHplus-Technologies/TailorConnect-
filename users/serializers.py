from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import TailorProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # Extra fields for Tailor registration
    specialty = serializers.CharField(write_only=True, required=False, allow_blank=True)
    experience = serializers.IntegerField(write_only=True, required=False)
    bio = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'phone', 'address', 'specialty', 'experience', 'bio']
        read_only_fields = ['id']

    def create(self, validated_data):
        specialty = validated_data.pop('specialty', '')
        experience = validated_data.pop('experience', 0)
        bio = validated_data.pop('bio', '')
        
        # Security: Prevent admin role creation via public API
        role = validated_data.get('role', 'client')
        if role == 'admin':
            raise serializers.ValidationError({'role': 'Admin accounts cannot be created through registration.'})
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=role,
            phone=validated_data.get('phone', ''),
            address=validated_data.get('address', '')
        )

        if user.role == 'tailor':
            from .models import TailorProfile
            profile, created = TailorProfile.objects.get_or_create(user=user)
            profile.experience = experience
            profile.location = user.address
            profile.address = user.address
            profile.phone = user.phone
            profile.bio = bio
            profile.save()
            # Handle specialties (assuming comma-separated string from frontend for now)
            if specialty:
                from .models import Specialty
                specialty_names = [s.strip() for s in specialty.split(',') if s.strip()]
                for name in specialty_names:
                    spec_obj, _ = Specialty.objects.get_or_create(name=name)
                    profile.specialties.add(spec_obj)
            
        return user


class TailorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    specialties = serializers.StringRelatedField(many=True, read_only=True)
    specialty_list = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = TailorProfile
        fields = ['id', 'user', 'specialties', 'specialty_list', 'experience', 'location', 'latitude', 'longitude', 'phone', 'address', 'available', 'bio', 'avatar']
        read_only_fields = ['id', 'user']
    
    def update(self, instance, validated_data):
        specialty_list = validated_data.pop('specialty_list', None)
        
        # Update profile fields
        profile = super().update(instance, validated_data)

        if specialty_list is not None:
            from .models import Specialty
            profile.specialties.clear()
            for name in specialty_list:
                spec_obj, _ = Specialty.objects.get_or_create(name=name)
                profile.specialties.add(spec_obj)
        
        return profile

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['role'] = self.user.role
        data['user_id'] = self.user.id
        return data

from measurements.models import MeasurementProfile

class MeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeasurementProfile
        fields = ['id', 'profile_name', 'chest', 'waist', 'hips', 'shoulder', 'sleeve_length', 'inseam', 'neck', 'thigh', 'length', 'updated_at']

class ClientDetailSerializer(serializers.ModelSerializer):
    measurements = MeasurementSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'address', 'measurements']
        read_only_fields = fields