from django.shortcuts import render
from django.http import HttpResponse
from .models import User
from .serializer import UserSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

# Create your views here.
def index(request):
    return HttpResponse('HelloWorld')

@api_view(['GET'])
def getUser(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=200)

@api_view(['POST'])
def registerUser(request):
    serializer = UserSerializer(data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)
