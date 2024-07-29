from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializer import UserSerializer
from ..models import User

@api_view(['GET'])
@permission_classes([IsAdminUser])
def is_admin(request):
    if request.method == "GET":
        return Response({"is_admin": True})
    else:
        return Response(status=400)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_users(request):
    if request.method == "GET":
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def toggle_user_status(request, id):
    if request.method == "GET":
        user = User.objects.get(id=id)
        user.status = not user.status
        user.save()
        return Response({"status": "User status toggled."}, status=200)
    else:
        return Response(status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def delete_user(request, id):
    if request.method == "GET":
        user = User.objects.get(id=id)
        user.delete()
        return Response({"status": "User deleted."}, status=200)
    else:
        return Response(status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserInfo(request, id):
    if request.method == 'GET':
        user = User.objects.get(id=id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)