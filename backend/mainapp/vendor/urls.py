from django.urls import path
from . import views

urlpatterns = [
    path('addProduct/', views.addProductInfo),
    path('addProductImages/', views.addProductImages),
    path('addProductSpecs/', views.addProductSpecifications),
    path('getProducts/', views.getProducts),
    path('changeProductStatus/<int:product_id>/', views.changeProductStatus),
    path('deleteProduct/<int:product_id>/', views.deleteProduct),
    path('getProduct/<int:product_id>/', views.getProduct),
    path('getProductToEdit/<int:product_id>/', views.getProductToEdit),
    path('updateProduct/<int:product_id>/', views.updateProductDetails),
    path('updateProductImages/<int:product_id>/', views.updateProductImages),
    path('updateProductSpecs/<int:product_id>/', views.updateProductSpecifications),
    path('addKYC/', views.addKYC),
    path('getVendorDetails/', views.getVendorDetails)
]