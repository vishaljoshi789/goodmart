from django.shortcuts import render
from django.http import HttpResponse
from .models import User, Product_Category, Product_Brand, Product, Cart, Product_Variant, Address, Vendor_Detail, ShippingCharges, Order, OrderItem, SubOrder
from .serializer import UserRegisterSerializer, UserInfoSerializer, ProductBrandSerializer, ProductCategorySerializer, ProductDetailedSerializer, CartSerializer, CartDetailedSerializer, VendorDetailSerializer, AddressSerializer, OrderSerializer, OrderItemSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .token import email_verification_token
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from smtplib import SMTPException
from django.core.mail import BadHeaderError
from django.core.mail import EmailMessage
from django.template.loader import render_to_string


def index(request):
    return HttpResponse('HelloWorld')

@api_view(['POST'])
@permission_classes([AllowAny])
def registerUser(request):
    data = request.data
    data['username'] = data['email']
    serializer = UserRegisterSerializer(data=data, partial=True)
    if serializer.is_valid():
        user = serializer.save()
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = email_verification_token.make_token(user)
        verification_link = f"{settings.FRONTEND_URL}/user-panel/verify-email?uid={uid}&token={token}"
        try:
            subject = 'Registered to GoodMart'
            html_message = render_to_string('registerMail.html', {'url': verification_link, 'name': user.name, 'email': user.email, 'phone': user.phone_no, 'user_id': user.user_id})
            email_from = settings.DEFAULT_FROM_EMAIL
            recipient_list = [user.email]

            email = EmailMessage(subject, html_message, email_from, recipient_list)
            email.content_subtype = 'html'  # Set the email content type to HTML
            email.send()
            return Response({'status': 'Verification email sent.'}, status=201)
        except BadHeaderError:
            return Response({'status': 'Invalid header found.'}, status=400)
        except SMTPException as e:
            # Log the exception or handle it as needed
            return Response({'status': 'Failed to send email. Please try again later.'}, status=500)
        except Exception as e:
            # Log the exception or handle it as needed
            return Response({'status': 'An unexpected error occurred. Please try again later.'}, status=500)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserInfo(request):
    if request.method == 'GET':
        user = request.user
        serializer = UserInfoSerializer(user)
        response = serializer.data
        if user.user_type == "Product Vendor":
            try:
                response["VendorInfo"] = VendorDetailSerializer(user.vendor).data
            except:
                response["VendorInfo"] = False
        return Response(response, status=200)
    else:
        return Response(status=400)
    
    
@api_view(['GET'])
def sendVerificationEmail(request):
    user = request.user
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = email_verification_token.make_token(user)
    verification_link = f"{settings.FRONTEND_URL}/user-panel/verify-email/{uid}/{token}/"
    try:
        subject = 'Registered to GoodMart'
        html_message = render_to_string('registerMail.html', {'url': verification_link, 'name': user.name, 'email': user.email, 'phone': user.phone_no, 'user_id': user.user_id})
        email_from = settings.DEFAULT_FROM_EMAIL
        recipient_list = [user.email]

        email = EmailMessage(subject, html_message, email_from, recipient_list)
        email.content_subtype = 'html'  # Set the email content type to HTML
        email.send()
        return Response({'status': 'Verification email sent.'}, status=200)
    except BadHeaderError:
        return Response({'status': 'Invalid header found.'}, status=400)
    except SMTPException as e:
        # Log the exception or handle it as needed
        return Response({'status': 'Failed to send email. Please try again later.'}, status=500)
    except Exception as e:
        # Log the exception or handle it as needed
        return Response({'status': 'An unexpected error occurred. Please try again later.'}, status=500)

@api_view(['GET'])
def verify_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
        if email_verification_token.check_token(user, token):
            user.email_verified = True
            user.save()
            print("Email verified")
            return Response({'status': 'Email verified'}, status=200)
        else:
            print("Invalid token")
            return Response({'status': 'Invalid token'}, status=400)
    except:
        print("Error occurred")
        return Response({'status': 'Invalid token'}, status=400)
    
@api_view(['GET'])
def getProductCategory(request):
    if request.method == 'GET':
        categories = Product_Category.objects.all()
        serializer = ProductCategorySerializer(categories, many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['GET'])
def getProductBrand(request):
    if request.method == 'GET':
        brands = Product_Brand.objects.all()
        serializer = ProductBrandSerializer(brands, many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['GET'])
def getSearchProducts(request, search, category):
    if request.method == 'GET':
        products = set()
        byName = Product.objects.filter(name__contains=search)
        for i in byName:
            products.add(i)
        byTags = Product.objects.filter(tags__contains=search)
        for i in byTags:
            products.add(i)
        byDesc = Product.objects.filter(description__contains=search)
        for i in byDesc:
            products.add(i)
        byCategory = Product.objects.filter(category=category)
        for i in byCategory:
            products.add(i)
        serializer = ProductDetailedSerializer(products, many=True)
        return Response(serializer.data, status=200)
    else:
        return Response(status=400)
    
@api_view(['GET'])
def getProduct(request, id):
    if request.method == 'GET':
        try:
            product = Product.objects.get(id=id)
            serializer = ProductDetailedSerializer(product)
            return Response(serializer.data, status=200)
        except:
            return Response(status=404)
    else:
        return Response(status=400)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addToCart(request):
    if request.method == 'POST':
        product = Product.objects.get(id=request.data["id"])
        user = request.user
        if Cart.objects.filter(user=user, product=product).exists():
            cart = Cart.objects.get(user=user, product=product, variant=request.data["variant"]) if request.data["variant"] else Cart.objects.get(user=user, product=product, variant=None)
            cart.quantity = cart.quantity+1
            cart.save()
            serializer = CartSerializer(cart)
            return Response(serializer.data, status=200)
        else:
            if request.data["variant"]:
                variant = Product_Variant.objects.get(id=request.data["variant"])
            cart = Cart.objects.create(user = user, product=product, quantity=1, variant=variant) if request.data["variant"] else Cart.objects.create(user = user, product=product, quantity=1)
            cart.save()
            serializer = CartSerializer(cart)
            return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCart(request):
    if request.method == 'GET':
        user = request.user
        cart = user.cart.all()
        serializer = CartDetailedSerializer(cart, many=True)
        return Response(serializer.data, status=200)
    return Response(status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_cart(request):
    if request.method == "POST":
        product = Product.objects.get(id=request.data["id"])
        if(request.data["variant"]!= ""):
            variant = Product_Variant.objects.get(id=request.data["variant"])
        else:
            variant = None
        user = request.user
        if Cart.objects.filter(user=user, product=product, variant=variant).exists():
            cart = Cart.objects.get(user=user, product=product, variant=variant)
            if cart.quantity == 1:
                cart.delete()
                return Response(status=200)
            else:
                cart.quantity -= 1
                cart.save()
                serializer = CartSerializer(cart)
                return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_all_cart(request):
    if request.method == "POST":
        product = Product.objects.get(id=request.data["id"])
        user = request.user
        if Cart.objects.filter(user=user, product=product).exists():
            cart = Cart.objects.get(user=user, product=product)
            cart.delete()
            return Response(status=200)
    return Response(status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    if request.method == "POST":
        Cart.objects.filter(user=request.user).delete()
        return Response(status=200)
    return Response(status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart_count(request):
    if request.method == "GET":
        user = request.user
        cart = user.cart.all().count()
        return Response({'cartCount': cart}, status=200)
    return Response(status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserAddress(request):
    if request.method == 'GET':
        user = request.user
        address = user.address.all()
        serializer = AddressSerializer(address, many=True)
        return Response(serializer.data, status=200)
    return Response(status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addUserAddress(request):
    if request.method == 'POST':
        user = request.user
        data = request.data
        data['user'] = user.id
        serializer = AddressSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    return Response(status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAddress(request, id):
    if request.method == 'GET':
        user = request.user
        address = user.address.get(id=id)
        serializer = AddressSerializer(address)
        return Response(serializer.data, status=200)
    return Response(status=400)

@permission_classes([IsAuthenticated])
def getShippingCharges(address_id, vendor_id):
    address = Address.objects.get(id=address_id)
    vendor = Vendor_Detail.objects.get(id=vendor_id)
    shipping = ShippingCharges.objects.filter(vendor=vendor, pincode=address.pin)
    if shipping.exists():
        return shipping[0].charges
    else:
        return vendor.shipping


@api_view(['GET'])
def getBillingDetails(request):
    if request.method == 'GET':
        cart = request.user.cart.all()
        vendor = []
        billing = {'vendor': [], 'total': 0, 'shipping': 0}
        for i in cart:
            vendor.append(i.product.company_id)
        vendor = list(set(vendor))
        for i in vendor:
            temp = {}
            total = 0
            for item in cart:
                if item.product.company_id.id == i.id:
                    total += item.variant.offer_price * item.quantity if item.variant else item.product.offer_price * item.quantity
            temp['total'] = total
            temp['id'] = i.id
            temp['firm'] = i.firm
            temp['shipping'] = getShippingCharges(request.GET.get('address_id'), i.id) if total < i.free_shipping_above else 0
            temp['cash_on_delivery'] = i.cash_on_delivery
            temp['payment_mode'] = ""
            billing['vendor'].append(temp)
            billing['total'] += total
            billing['shipping'] += temp['shipping']
        return Response(billing, status=200)
    return Response(status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createOrder(request):
    if request.method == 'POST':
        cart = request.user.cart.all()
        print(request.data)
        address = Address.objects.get(id=request.data["address_id"])
        vendor = request.data["vendor"]
        order = Order.objects.create(user=request.user, address=address, order_confirmed=False, subtotal=request.data["total"], shipping=request.data["shipping"])
        order.save()
        for i in vendor:
            suborder = SubOrder.objects.create(order=order, vendor=Vendor_Detail.objects.get(id=i['id']), subtotal=i['total'], shipping=i['shipping'], payment_mode=i['payment_mode'], status="Pending")
            suborder.save()
            for item in cart:
                if item.product.company_id.id == i['id']:
                    orderItem = OrderItem.objects.create(order=suborder, product=item.product, quantity=item.quantity, variant=item.variant, total=item.variant.offer_price * item.quantity if item.variant else item.product.offer_price * item.quantity)
                    orderItem.save()
                    item.delete()
        
        data = {
            "order": order.id}       
        return Response(data, status=201)
    return Response(status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderDetails(request, id):
    if request.method == 'GET':
        order = Order.objects.get(id=id)
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=200)
    return Response(status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def placeOrder(request, id):
    if request.method == 'POST':
        order = Order.objects.get(id=id)
        order.order_confirmed = True
        order.save()
        return Response(status=200)
    return Response(status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrders(request):
    if request.method == 'GET':
        orders = request.user.orders.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=200)
    return Response(status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrder(request, id):
    if request.method == 'GET':
        order = Order.objects.get(id=id)
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=200)
    return Response(status=400)

@api_view(['GET'])
def getFearuredCategory(request):
    if request.method == "GET":
        category = Product_Category.objects.filter(featured=True)
        serializer = ProductCategorySerializer(category, many=True)
        return Response(serializer.data, status=200)
    return Response(status=400)

@api_view(['GET'])
def getParentCategory(request):
    if request.method == "GET":
        category = Product_Category.objects.filter(parent=None)
        serializer = ProductCategorySerializer(category, many=True)
        return Response(serializer.data, status=200)
    return Response(status=400)

@api_view(['GET'])
def getSubCategory(request, id):
    if request.method == "GET":
        category = Product_Category.objects.filter(parent=id)
        serializer = ProductCategorySerializer(category, many=True)
        return Response(serializer.data, status=200)
    return Response(status=400)