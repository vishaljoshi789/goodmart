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
    path('getSearchProducts/<str:search>/', views.getSearchProducts),
    path('getProduct/<int:id>/', views.getProduct),
    path('addToCart/', views.addToCart),
    path('getCart/', views.getCart),
    path('removeFromCart/', views.remove_cart),
    path('removeCart/', views.remove_all_cart),
    path('getCartCount/', views.get_cart_count),
]
