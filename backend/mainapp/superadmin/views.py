from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializer import UserSerializer, ProductCategorySerializer, ProductCategoryUploadSerializer, ProductBrandSerializer, ProductSerializer, ProductDetailedSerializer, ProductEditSerializer, ProductImageSerializer, ProductSpecificationsSerializer, VendorDetailSerializer, VendorDetailSerializerForDetailedView, SettingSerializer, OrderSerializer, LevelPointsSerializer, SubOrderWithOrderAddressSerializer, UserDetailsSerializer, AddressSerializer, HomepageBannerSerializer, HomepageItemSerializer, HomepageSectionSerializer, PolicySerializer, PopUpSerializer
from ..models import User, Product_Category, Product_Brand, Product, Vendor_Detail, Setting, Order, LevelPoints, SubOrder, Address, HomepageBanner, HomepageItem, HomepageSection, Policy, PopUp
import json
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction

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
def get_vendor(request):
    if request.method == "GET":
        vendors = Vendor_Detail.objects.all()
        serializer = VendorDetailSerializerForDetailedView(vendors, many=True)
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def login_user(request, id):
    if request.method == "GET":
        try:
            user = User.objects.get(id=id)
        except:
            return Response({"error": "User not found."}, status=404)
        refresh = RefreshToken.for_user(user)
        return Response({"refresh": str(refresh), "access": str(refresh.access_token)}, status=200)
    else:
        return Response(status=400)
    
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
    
@api_view(['POST'])
@permission_classes([IsAdminUser])
def change_password(request, id):
    if request.method == "POST":
        user = User.objects.get(id=id)
        user.set_password(request.data['password'])
        user.save()
        return Response({"status": "Password changed."}, status=200)
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
    

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserDetails(request, id):
    if request.method == 'GET':
        try:
            user = User.objects.get(id=id)
            serializer = UserDetailsSerializer(user.user_detail)
            return Response(serializer.data, status=200)
        except:
            return Response(status=404)
    else:
        return Response(status=400)
    

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getAddress(request, id):
    if request.method == 'GET':
        adderess = Address.objects.get(id=id)
        serializer = AddressSerializer(adderess)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUserInfo(request, id):
    if request.method == 'PUT':
        user = User.objects.get(id=id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    else:
        return Response(status=400)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUserDetails(request, id):
    if request.method == 'PUT':
        user = User.objects.get(id=id)
        serializer = UserDetailsSerializer(user.user_detail, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    else:
        return Response(status=400)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateAddress(request, id):
    if request.method == 'PUT':
        address = Address.objects.get(id=id)
        serializer = AddressSerializer(address, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
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
        products = Product.objects.all().order_by("user")
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getProductByVendor(request, id):
    if request.method == 'GET':
        products = Product.objects.filter(company_id=id)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['POST'])
@permission_classes([IsAdminUser])
def changeProductPoint(request, id):
    if request.method == 'POST':
        product = Product.objects.get(id=id)
        product.point = request.data['point']
        product.save()
        return Response({"status": "Product point changed."}, status=200)
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

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    if request.method == 'GET':
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrderDetials(request, order_id):
    if request.method == 'GET':
        sub_orders = SubOrder.objects.filter(id=order_id)
        serializer = SubOrderWithOrderAddressSerializer(sub_orders, many=True)
        return Response(serializer.data, status=200)
    
    return Response(status=400)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def updateOrderStatus(request, order_id):
    if request.method == 'POST':
        sub_order = SubOrder.objects.get(id=order_id)
        sub_order.status = request.data['status']
        sub_order.save()
        return Response(status=200)
    return Response(status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getLevelPoints(request):
    if request.method == 'GET':
        level_points = LevelPoints.objects.all()
        serializer = LevelPointsSerializer(level_points, many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['POST'])
@permission_classes([IsAdminUser])
def updateLevelPoints(request):
    levels = LevelPoints.objects.all()
    for level in levels:
        level.delete()
    if request.method == 'POST':
        data = request.data
        for level_point in data:
            serializer = LevelPointsSerializer(data=level_point)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=400)
        return Response(status=201)
    else:
        return Response(status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getHomepageBanners(request):
    if request.method == 'GET':
        banners = HomepageBanner.objects.all()
        serializer = HomepageBannerSerializer(banners, many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createMultipleHomepageBanner(request):
    if request.method == 'POST':
        banners = []
        HomepageBanner.objects.all().delete()
        for i in range(len(request.FILES)):
            banners.append({"image": request.FILES[f"banner-{i}"], "link": request.data[f"link-{i}"]})
        for banner in banners:
            serializer = HomepageBannerSerializer(data=banner)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=400)
        return Response(status=201)
    else:
        return Response(status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getHomepageSections(request):
    if request.method == 'GET':
        sections = HomepageSection.objects.all().order_by('display_order')
        serializer = HomepageSectionSerializer(sections, many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createMultipleHomepageSection(request):
    if request.method == 'POST':
        incoming_titles = {section['name'] for section in request.data}  # Extract incoming section titles

        # Fetch existing sections
        existing_sections = {section.name: section for section in HomepageSection.objects.all()}

        with transaction.atomic():  # Ensures atomicity (all or nothing)
            # DELETE sections that are not in the incoming data
            for title, section in existing_sections.items():
                if title not in incoming_titles:
                    section.delete()  # This will also delete related items if cascade delete is enabled

            for section_data in request.data:
                title = section_data.get('name')  # Ensure the correct field is used
                
                if title in existing_sections:
                    # UPDATE existing section
                    serializer = HomepageSectionSerializer(existing_sections[title], data=section_data, partial=True)
                else:
                    # CREATE new section
                    serializer = HomepageSectionSerializer(data=section_data)

                if serializer.is_valid():
                    serializer.save()
                else:
                    return Response(serializer.errors, status=400)

        return Response(status=201)
    return Response(status=400)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getHomepageItems(request):
    if request.method == 'GET':
        items = HomepageItem.objects.all()
        serializer = HomepageItemSerializer(items, many=True)
        return Response(serializer.data, status=200)
    return Response(status=400)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createMultipleHomepageItem(request):
    if request.method == 'POST':
        valid_items = []
        for item in request.data:
            serializer = HomepageItemSerializer(data=item)
            if serializer.is_valid():
                valid_items.append(serializer)
            else:
                return Response(serializer.errors, status=400)  # Stop and return error
        HomepageItem.objects.all().delete()
        for serializer in valid_items:
            serializer.save()
        return Response(status=201)
    return Response(status=400)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getPolicies(request):
    policies = Policy.objects.all()
    serializer = PolicySerializer(policies, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getPolicyByType(request, policy_type):
    try:
        policy = Policy.objects.get(policy_type=policy_type)
        serializer = PolicySerializer(policy)
        return Response(serializer.data)
    except Policy.DoesNotExist:
        return Response({'error': 'Policy not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createPolicy(request):
    serializer = PolicySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=404)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updatePolicy(request, policy_type):
    try:
        policy = Policy.objects.get(policy_type=policy_type)
    except Policy.DoesNotExist:
        return Response({'error': 'Policy not found'}, status=404)
    data = {
        'policy_type': policy_type,
        'content': request.data['content'],
    }
    serializer = PolicySerializer(policy, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deletePolicy(request, policy_type):
    try:
        policy = Policy.objects.get(policy_type=policy_type)
        policy.delete()
        return Response({'message': 'Policy deleted successfully'}, status=204)
    except Policy.DoesNotExist:
        return Response({'error': 'Policy not found'}, status=404)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getPopUps(request):
    popups = PopUp.objects.all()
    serializer = PopUpSerializer(popups, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createPopUp(request):
    serializer = PopUpSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updatePopUp(request, id):
    try:
        popup = PopUp.objects.get(id=id)
    except PopUp.DoesNotExist:
        return Response({'error': 'PopUp not found'}, status=404)
    serializer = PopUpSerializer(popup, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deletePopUp(request, id):
    try:
        popup = PopUp.objects.get(id=id)
        popup.delete()
        return Response({'message': 'PopUp deleted successfully'}, status=204)
    except PopUp.DoesNotExist:
        return Response({'error': 'PopUp not found'}, status=404)