from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password',
            'company_name', 'company_logo', 'company_email', 'company_address', 
            'tax_number', 'default_currency', 'phone_number',
            'subscription_tier', 'subscription_end_date'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'subscription_tier': {'read_only': True},
            'subscription_end_date': {'read_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            company_name=validated_data.get('company_name', ''),
            phone_number=validated_data.get('phone_number', '')
        )
        return user
