from django.urls import path
from . import views

urlpatterns = [
    path('addProduct/', views.addProductInfo),
    path('addProductImages/', views.addProductImages),
    path('addProductSpecs/', views.addProductSpecifications),

]