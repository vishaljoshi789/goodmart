from django.urls import path
from . import views

urlpatterns = [
    path('addProduct/', views.addProduct),

]