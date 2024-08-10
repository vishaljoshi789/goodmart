from ..models import Product
from .serializer import ProductSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from ..permissions import isVendor

@api_view(['POST'])
@permission_classes([isVendor])
def addProduct(request):
    data = request.data
    data['user'] = request.user.id
    serializer = ProductSerializer(data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

