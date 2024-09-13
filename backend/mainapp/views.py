from django.shortcuts import render
from django.http import HttpResponse
from .models import User, Product_Category, Product_Brand, Product, Cart
from .serializer import UserRegisterSerializer, UserInfoSerializer, ProductBrandSerializer, ProductCategorySerializer, ProductSerializer, ProductDetailedSerializer, CartSerializer, CartDetailedSerializer, VendorDetailSerializer
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
import json


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
def getSearchProducts(request, search):
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
        print(products)

        serializer = ProductSerializer(products, many=True)
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
            cart = Cart.objects.get(user=user, product=product)
            cart.quantity = cart.quantity+1
            cart.save()
            serializer = CartSerializer(cart)
            return Response(serializer.data, status=200)
        else:
            cart = Cart.objects.create(user = user, product=product, quantity=1)
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
        user = request.user
        if Cart.objects.filter(user=user, product=product).exists():
            cart = Cart.objects.get(user=user, product=product)
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
    
