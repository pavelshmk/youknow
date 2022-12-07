from rest_framework.serializers import ModelSerializer

from users.models import AppUser


class UserSerializer(ModelSerializer):
    class Meta:
        model = AppUser
        fields = 'pk', 'name', 'avatar',