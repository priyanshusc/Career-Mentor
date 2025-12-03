from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser  # Fixed: Use CustomUser instead of User
        fields = ['id', 'username', 'email', 'password']

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def create(self, validated_data):
        user = CustomUser.objects.create_user(  # Fixed: Use CustomUser
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
