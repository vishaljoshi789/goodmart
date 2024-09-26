from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializer import UserSerializer, ProductCategorySerializer, ProductCategoryUploadSerializer, ProductBrandSerializer, ProductSerializer, ProductDetailedSerializer, ProductEditSerializer, ProductImageSerializer, ProductSpecificationsSerializer, VendorDetailSerializer, VendorDetailSerializerForDetailedView, SettingSerializer
from ..models import User, Product_Category, Product_Brand, Product, Vendor_Detail, Setting
import json

@api_view(['GET'])
def is_admin(request):
    if request.method == "GET" and request.user.is_staff:
        return Response({"is_admin": True}, status=200)
    else:
        return Response(status=404)

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
    
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProductCategory(request):
    if request.method == 'POST':
        serializer = ProductCategoryUploadSerializer(data=request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    else:
        return Response(status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getProductCategories(request):
    if request.method == 'GET':
        product_categories = Product_Category.objects.all().order_by('-added_on')
        serializer = ProductCategorySerializer(product_categories, many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getProductCategory(request, id):
    if request.method == 'GET':
        product_category = Product_Category.objects.get(id=id)
        serializer = ProductCategorySerializer(product_category)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getProductCategoryParentId(request, id):
    if request.method == 'GET':
        product_category = Product_Category.objects.get(id=id)
        serializer = ProductCategoryUploadSerializer(product_category)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProductCategory(request, id):
    if request.method == 'DELETE':
        product_category = Product_Category.objects.get(id=id)
        product_category.image.delete()
        product_category.delete()
        return Response({"status": "Product category deleted."}, status=204)
    else:
        return Response(status=400)
    
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProductCategory(request, id):
    if request.method == 'PUT':
        data = request.data.copy()  
        product_category = Product_Category.objects.get(id=id)
        if data['image'] == "":
            product_category.image.delete()
            data.pop('image')
        elif product_category.image and data['image']==product_category.image.url:
            data.pop('image')
        elif product_category.image:
            product_category.image.delete()
        serializer = ProductCategoryUploadSerializer(product_category, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    else:
        return Response({"error": "Something Went Wrong"}, status=400)
    
    
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProductBrand(request):
    if request.method == 'POST':
        serializer = ProductBrandSerializer(data=request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    else:
        return Response(status=400)
    
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getProductBrands(request):
    if request.method == 'GET':
        product_brands = Product_Brand.objects.all().order_by('-added_on')
        serializer = ProductBrandSerializer(product_brands, many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
    
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProductBrand(request, id):
    if request.method == 'DELETE':
        product_category = Product_Brand.objects.get(id=id)
        product_category.image.delete()
        product_category.delete()
        return Response({"status": "Product category deleted."}, status=204)
    else:
        return Response(status=400)
    
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getProductBrand(request, id):
    if request.method == 'GET':
        product_brand = Product_Brand.objects.get(id=id)
        serializer = ProductBrandSerializer(product_brand)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProductBrand(request, id):
    if request.method == 'PUT':
        data = request.data.copy()  
        product_brand = Product_Brand.objects.get(id=id)
        if data['image'] == "":
            product_brand.image.delete()
            data.pop('image')
        elif product_brand.image and data['image']==product_brand.image.url:
            data.pop('image')
        elif product_brand.image:
            product_brand.image.delete()
        serializer = ProductBrandSerializer(product_brand, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    else:
        return Response({"error": "Something Went Wrong"}, status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getProducts(request):
    if request.method == 'GET':
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['POST'])
@permission_classes([IsAdminUser])
def changeProductStatus(request, id):
    if request.method == 'POST':
        product = Product.objects.get(id=id)
        product.status = not product.status
        product.save()
        return Response({"status": "Product status changed."}, status=200)
    else:
        return Response(status=400)
    
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, id):
    if request.method == 'DELETE':
        product = Product.objects.get(id=id)
        product.delete()
        return Response({"status": "Product deleted."}, status=204)
    else:
        return Response(status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getProduct(request, id):
    if request.method == 'GET':
        product = Product.objects.get(id=id)
        serializer = ProductDetailedSerializer(product)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getProductToEdit(request, id):
    if request.method == 'GET':
        product = Product.objects.get(id=id)
        serializer = ProductEditSerializer(product)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProductDetails(request, id):
    product = Product.objects.get(id=id)
    serializer = ProductSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProductImages(request, id):
    images = []
    product = Product.objects.get(id=id)
    product_images = product.images.all()
    for image in product_images:
        image.delete()
    for field, value in request.FILES.items():
            if 'image' in field:
                images.append({"image": request.FILES[field]})
    for image in images:
        image['product'] = id
        serializer = ProductImageSerializer(data=image)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=400)
    return Response(status=201)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProductSpecifications(request, id):
    product = Product.objects.get(id=id)
    product_specifications = product.specifications.all()
    for specification in product_specifications:
        specification.delete()
    specifications = json.loads(request.data['specifications'])
    for specification in specifications:
        specification['product'] = id
        serializer = ProductSpecificationsSerializer(data=specification)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=400)
    return Response(status=201)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getVendorDetails(request):
    if request.method == 'GET':
        vendors = Vendor_Detail.objects.all()
        serializer = VendorDetailSerializer(vendors, many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getVendorDetail(request, id):
    if request.method == 'GET':
        vendor = Vendor_Detail.objects.get(id=id)
        serializer = VendorDetailSerializerForDetailedView(vendor)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateVendorKYCStatus(request, id, status):
    if request.method == 'PUT':
        vendor = Vendor_Detail.objects.get(id=id)
        vendor.status = status
        vendor.save()
        return Response({"status": "KYC status changed."}, status=200)
    else:
        return Response(status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getSetting(request):
    if request.method == 'GET':
        setting = Setting.objects.all().first()
        serializer = SettingSerializer(setting)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['POST'])
@permission_classes([IsAdminUser])
def updateSetting(request):
    if request.method == 'POST':
        setting = Setting.objects.all().first()
        if setting:
            serializer = SettingSerializer(setting, data=request.data, partial=True)
        else:
            serializer = SettingSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)


