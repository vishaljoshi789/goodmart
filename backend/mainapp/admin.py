from django.contrib import admin
from .models import User, Product_Category, Product_Brand, Product, Product_Image, Product_Specifications, Cart, Vendor_Detail
# Register your models here.
admin.site.register(User)
admin.site.register(Product_Category)
admin.site.register(Product_Brand)
admin.site.register(Product)
admin.site.register(Product_Image)
admin.site.register(Product_Specifications)
admin.site.register(Cart)
admin.site.register(Vendor_Detail)