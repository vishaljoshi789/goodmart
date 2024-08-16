from ..models import Product
from .serializer import ProductSerializer, ProductImageSerializer, ProductSpecificationsSerializer, ProductDetailedSerializer, ProductEditSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from ..permissions import isVendor
import json

@api_view(['POST'])
@permission_classes([isVendor])
def addProductInfo(request):
    data = request.data
    data['user'] = request.user.id
    serializer = ProductSerializer(data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([isVendor])
def addProductImages(request):
    images = []
    for field, value in request.FILES.items():
            if 'image' in field:
                images.append({"image": request.FILES[field]})
    for image in images:
        image['product'] = request.data['product_id']
        serializer = ProductImageSerializer(data=image)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=400)
    return Response(status=201)

@api_view(['POST'])
@permission_classes([isVendor])
def addProductSpecifications(request):
    specifications = json.loads(request.data['specifications'])
    for specification in specifications:
        specification['product'] = request.data['product_id']
        serializer = ProductSpecificationsSerializer(data=specification)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=400)
    return Response(status=201)

@api_view(['GET'])
@permission_classes([isVendor])
def getProducts(request):
    products = Product.objects.filter(user=request.user)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=200)

@api_view(['POST'])
@permission_classes([isVendor])
def changeProductStatus(request, product_id):
    product = Product.objects.get(id=product_id)
    product.status = not product.status
    product.save()
    return Response(status=200)

@api_view(['DELETE'])
@permission_classes([isVendor])
def deleteProduct(request, product_id):
    product = Product.objects.get(id=product_id)
    product.delete()
    return Response(status=200)

@api_view(['GET'])
@permission_classes([isVendor])
def getProduct(request, product_id):
    product = Product.objects.get(id=product_id)
    serializer = ProductDetailedSerializer(product)
    return Response(serializer.data, status=200)

@api_view(['GET'])
@permission_classes([isVendor])
def getProductToEdit(request, product_id):
    product = Product.objects.get(id=product_id)
    serializer = ProductEditSerializer(product)
    return Response(serializer.data, status=200)

@api_view(['PUT'])
@permission_classes([isVendor])
def updateProductDetails(request, product_id):
    product = Product.objects.get(id=product_id)
    serializer = ProductSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([isVendor])
def updateProductImages(request, product_id):
    images = []
    product = Product.objects.get(id=product_id)
    product_images = product.images.all()
    for image in product_images:
        image.delete()
    for field, value in request.FILES.items():
            if 'image' in field:
                images.append({"image": request.FILES[field]})
    for image in images:
        image['product'] = product_id
        serializer = ProductImageSerializer(data=image)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=400)
    return Response(status=201)



