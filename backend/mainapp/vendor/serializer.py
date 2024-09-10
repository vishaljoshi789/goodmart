from rest_framework import serializers
from ..models import Product, Product_Image, Product_Specifications, Vendor_Detail

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Image
        fields = '__all__'

class ProductSpecificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Specifications
        fields = '__all__'


class ProductDetailedSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True)
    specifications = ProductSpecificationsSerializer(many=True)
    category = serializers.StringRelatedField()
    brand = serializers.StringRelatedField()
    class Meta:
        model = Product
        fields = ['id', 'name', 'mrp', 'description', 'images', 'specifications', 'status', 'added_on', 'modify_on', 'offer_price', 'tags', 'category', 'brand', 'image', 'video']


class ProductEditSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True)
    specifications = ProductSpecificationsSerializer(many=True)
    class Meta:
        model = Product
        fields = ['id', 'name', 'mrp', 'description', 'images', 'specifications', 'status', 'added_on', 'modify_on', 'offer_price', 'tags', 'category', 'brand', 'image', 'video']


class VendorDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor_Detail
        fields = '__all__'