from django.urls import path
from . import views

urlpatterns = [
    path("", views.index),
    path("registerUser/", views.registerUser),
    path("getUserInfo/", views.getUserInfo),
    path("sendVerificationEmail/", views.sendVerificationEmail),
    path('verify-email/<uidb64>/<token>/', views.verify_email, name='verify-email'),
    path('getProductCategory/', views.getProductCategory),
    path('getProductBrand/', views.getProductBrand),
]
