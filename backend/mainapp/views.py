from django.shortcuts import render
from django.http import HttpResponse
from .models import User, Product_Category, Product_Brand
from .serializer import UserRegisterSerializer, UserInfoSerializer, ProductBrandSerializer, ProductCategorySerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .token import email_verification_token
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from smtplib import SMTPException
from django.core.mail import BadHeaderError
from django.core.mail import EmailMessage
from django.template.loader import render_to_string


# Create your views here.
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
        return Response(serializer.data, status=200)
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
    
