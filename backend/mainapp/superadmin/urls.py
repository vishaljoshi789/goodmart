from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.get_users),
    path('isAdmin/', views.is_admin),
    path('toggleUserStatus/<int:id>/', views.toggle_user_status),
    path('deleteUser/<int:id>/', views.delete_user),
    path('getUser/<int:id>', views.getUserInfo),
]