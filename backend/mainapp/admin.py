from django.contrib import admin
from .models import User, Product_Category, Product_Brand, Product
# Register your models here.
admin.site.register(User)
admin.site.register(Product_Category)
admin.site.register(Product_Brand)
admin.site.register(Product)
