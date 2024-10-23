from rest_framework import serializers
from .models import User, Product_Category, Product_Brand, Product, Product_Image, Product_Specifications, Cart, Vendor_Detail, Product_Variant


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'user_id', 'name', 'phone_no', 'password', 'username', 'user_type']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'user_id', 'name', 'phone_no', 'date_joined', "last_login", 'email_verified', 'phone_verified', 'user_type', 'status']

class ProductBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Brand
        fields = '__all__'

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta: 
        model = Product_Category
        fields = '__all__'

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

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Variant
        fields = '__all__'

class ProductDetailedSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True)
    specifications = ProductSpecificationsSerializer(many=True)
    category = serializers.StringRelatedField()
    brand = serializers.StringRelatedField()
    variants = ProductVariantSerializer(many=True)
    class Meta:
        model = Product
        fields = ['id', 'user', 'name', 'mrp', 'variants', 'description', 'images', 'specifications', 'status', 'added_on', 'modify_on', 'offer_price', 'tags', 'category', 'brand', 'image', 'video']

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

class CartDetailedSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = Cart
        fields = ['id', 'user', 'product', 'quantity']

class VendorDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor_Detail
        fields = '__all__'

