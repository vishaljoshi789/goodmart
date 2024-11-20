from ..models import Product, Vendor_Detail, ShippingCharges, Order, SubOrder, OrderItem
from .serializer import ProductSerializer, ProductImageSerializer, ProductSpecificationsSerializer, ProductVariantSerializer, ProductDetailedSerializer, ProductEditSerializer, VendorDetailSerializer, AddressSerializer, KYCDetailSerializer, GetVendorDetailSerializer, ShippingChargesSerializer, OrderAddressSerializer, SubOrderWithOrderAddressSerializer, OrderItemSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from ..permissions import isVendor
import json
import qrcode
from io import BytesIO
from django.core.files import File
from django.conf import settings 


@api_view(['POST'])
@permission_classes([isVendor])
def addProductInfo(request):
    data = request.data
    data['user'] = request.user.id
    data['company_id'] = request.user.vendor.id
    print(data)
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

@api_view(['POST'])
@permission_classes([isVendor])
def addProductVariants(request):
    variants = json.loads(request.data['variants'])
    for variant in variants:
        variant['product'] = request.data['product_id']
        serializer = ProductVariantSerializer(data=variant)
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
    data = request.data.copy()
    data['user'] = request.user.id
    data['company_id'] = request.user.vendor.id
    print(data)
    serializer = ProductSerializer(product, data=data, partial=True)
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

@api_view(['PUT'])
@permission_classes([isVendor])
def updateProductSpecifications(request, product_id):
    product = Product.objects.get(id=product_id)
    product_specifications = product.specifications.all()
    for specification in product_specifications:
        specification.delete()
    specifications = json.loads(request.data['specifications'])
    for specification in specifications:
        specification['product'] = product_id
        serializer = ProductSpecificationsSerializer(data=specification)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=400)
    return Response(status=201)

@api_view(['PUT'])
@permission_classes([isVendor])
def updateProductVariants(request, product_id):
    product = Product.objects.get(id=product_id)
    product_variants = product.variants.all()
    for variant in product_variants:
        variant.delete()
    variants = json.loads(request.data['variants'])
    for variant in variants:
        variant['product'] = product_id
        serializer = ProductVariantSerializer(data=variant)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=400)
    return Response(status=201)

@api_view(['POST'])
@permission_classes([isVendor])
def addKYC(request):
    if request.method == 'POST':
        data = request.data.dict() if isinstance(request.data, dict) else dict(request.data)
        data['user'] = request.user.id
        data['category'] = int(request.data['category'])
        addData = {
            'user': request.user.id,
            'address': data.pop('address'),
            'landmark': data.pop('landmark'),
            'city': data.pop('city'),
            'state': data.pop('state'),
            'pin': data.pop('pin'),
            'name': request.user.name,
            'phone': request.user.phone_no,   
            'co_ordinates': data.pop('co_ordinates')
        }
        serializer = AddressSerializer(data=addData, partial=True)
        if serializer.is_valid():
            instance = serializer.save()
        data['address'] = instance.id
        serializer = KYCDetailSerializer(data=data, partial=True)
        if serializer.is_valid():
            shop = serializer.save()
            # shop_url = f"{settings.FRONTEND_URL}/shop/{shop.id}"
            
            # # Generate QR code
            # qr = qrcode.QRCode(
            #     version=1,
            #     error_correction=qrcode.constants.ERROR_CORRECT_L,
            #     box_size=10,
            #     border=4,
            # )
            # qr.add_data(shop_url)
            # qr.make(fit=True)
            
            # # Create an image from the QR code
            # img = qr.make_image(fill="black", back_color="white")
            
            # # Save the image in memory as a PNG
            # buffer = BytesIO()
            # img.save(buffer, format="PNG")
            # buffer.seek(0)
            
            # # Attach the QR code image to the vendor's model if needed
            # shop.qr.save(f"vendor_{shop.id}_qr.png", File(buffer), save=True)
            
            # Return the serializer data and a success response
            return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400) 

@api_view(['GET'])
@permission_classes([isVendor])
def getVendorDetails(request):
    if request.method == 'GET':
        user = request.user
        details =  Vendor_Detail.objects.get(user = user.id)
        serializer = GetVendorDetailSerializer(details)
        return Response(serializer.data, status=200)
    return Response(status=400)

@api_view(['PUT'])
@permission_classes([isVendor])
def updateVendorDetails(request):
    if request.method == 'PUT':
        data = request.data.dict() if isinstance(request.data, dict) else dict(request.data)
        user = request.user
        details =  Vendor_Detail.objects.get(user = user.id)
        serializer = VendorDetailSerializer(details, data=data, partial=True)
        
            
        if serializer.is_valid():
            serializer.save()
            if not details.qr:
                print("GENERATING QR CODE")
                shop_url = f"{settings.FRONTEND_URL}/shop/{details.id}"
                qr = qrcode.QRCode(
                    version=1,
                    error_correction=qrcode.constants.ERROR_CORRECT_L,
                    box_size=10,
                    border=4,
                )
                qr.add_data(shop_url)
                qr.make(fit=True)
                    
                img = qr.make_image(fill="black", back_color="white")
                    
                buffer = BytesIO()
                img.save(buffer, format="PNG")
                buffer.seek(0)
                    
                details.qr.save(f"vendor_{details.user.user_id}_qr.png", File(buffer), save=True)
            return Response(serializer.data, status=200)
    return Response(status=400)



@api_view(['GET'])
@permission_classes([isVendor])
def getVendorShipping(request):
    if request.method == 'GET':
        user = request.user
        shipping =  ShippingCharges.objects.filter(vendor = user.vendor.id)
        serializer = ShippingChargesSerializer(shipping, many=True)
        return Response(serializer.data, status=200)
    return Response(status=400)

@api_view(['POST'])
@permission_classes([isVendor])
def addVendorShipping(request):
    if request.method == 'POST':
        data = request.data.copy()
        data['vendor'] = request.user.vendor.id
        serializer = ShippingChargesSerializer(data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([isVendor])
def deleteVendorShipping(request, shipping_id):
    shipping = ShippingCharges.objects.get(id=shipping_id)
    shipping.delete()
    return Response(status=200)

@api_view(['PUT'])
@permission_classes([isVendor])
def updateVendorDefaultShipping(request):
    if request.method == 'PUT':
        vendor = request.user.vendor
        vendor.shipping = request.data['shipping']
        vendor.save()
        return Response(status=200)
    return Response(status=400)
       
@api_view(['GET'])
@permission_classes([isVendor])
def getVendorOrders(request):
    if request.method == 'GET':
        user = request.user
        # Filter sub_orders for the specific vendor
        sub_orders = SubOrder.objects.filter(vendor=user.vendor)
        
        # Serialize sub_orders and include address from the related order
        serializer = SubOrderWithOrderAddressSerializer(sub_orders, many=True)
        return Response(serializer.data, status=200)
    
    return Response(status=400)

@api_view(['GET'])
@permission_classes([isVendor])
def getOrderDetials(request, order_id):
    if request.method == 'GET':
        user = request.user
        # Filter sub_orders for the specific vendor
        sub_orders = SubOrder.objects.filter(vendor=user.vendor, id=order_id)
        
        # Serialize sub_orders and include address from the related order
        serializer = SubOrderWithOrderAddressSerializer(sub_orders, many=True)
        return Response(serializer.data, status=200)
    
    return Response(status=400)