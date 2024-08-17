from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.get_users),
    path('isAdmin/', views.is_admin),
    path('toggleUserStatus/<int:id>/', views.toggle_user_status),
    path('deleteUser/<int:id>/', views.delete_user),
    path('getUser/<int:id>', views.getUserInfo),
    path('createProductCategory/', views.createProductCategory),
    path('getProductCategories/', views.getProductCategories),
    path('getProductCategory/<int:id>/', views.getProductCategory),
    path('getProductCategoryParentId/<int:id>/', views.getProductCategoryParentId),
    path('deleteProductCategory/<int:id>/', views.deleteProductCategory),
    path('updateProductCategory/<int:id>/', views.updateProductCategory),
    path('createProductBrand/', views.createProductBrand),
    path('getProductBrands/', views.getProductBrands),
    path('deleteProductBrand/<int:id>/', views.deleteProductBrand),
    path('getProductBrand/<int:id>/', views.getProductBrand),
    path('updateProductBrand/<int:id>/', views.updateProductBrand),
    path('getProducts/', views.getProducts),
    path('changeProductStatus/<int:id>/', views.changeProductStatus),
    path('deleteProduct/<int:id>/', views.deleteProduct),
    path('getProduct/<int:id>/', views.getProduct),
    path('getProductToEdit/<int:id>/', views.getProductToEdit),
    path('updateProductDetails/<int:id>/', views.updateProductDetails),
]