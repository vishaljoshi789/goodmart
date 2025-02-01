from rest_framework import serializers
from ..models import User, Product_Category, Product_Brand, Product, Product_Image, Product_Specifications, Vendor_Detail, Setting, Order, LevelPoints, OrderItem, SubOrder, Product_Variant, Address, User_Detail, HomepageBanner

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
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
    
class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_Detail
        fields = '__all__'
    
class ProductCategoryUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Category
        fields = '__all__'

class ProductCategorySerializer(serializers.ModelSerializer):
    parent = serializers.StringRelatedField()
    class Meta:
        model = Product_Category
        fields = '__all__'

class ProductBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Brand
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Image
        fields = '__all__'

class ProductSpecificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Specifications
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Product
        fields = '__all__'

class ProductDetailedSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True)
    specifications = ProductSpecificationsSerializer(many=True)
    category = serializers.StringRelatedField()
    brand = serializers.StringRelatedField()
    class Meta:
        model = Product
        fields = ['id', 'user', 'name', 'mrp', 'description', 'images', 'specifications', 'status', 'added_on', 'modify_on', 'offer_price', 'tags', 'category', 'brand', 'image', 'video']


class ProductEditSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True)
    specifications = ProductSpecificationsSerializer(many=True)
    class Meta:
        model = Product
        fields = ['id', 'user',  'name', 'mrp', 'description', 'images', 'specifications', 'status', 'added_on', 'modify_on', 'offer_price', 'tags', 'category', 'brand', 'image', 'video']

class VendorDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor_Detail
        fields = '__all__'

class VendorDetailSerializerForDetailedView(serializers.ModelSerializer):
    user = UserSerializer()
    category = ProductCategorySerializer()
    class Meta:
        model = Vendor_Detail
        fields = '__all__'

class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class LevelPointsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelPoints
        fields = '__all__'

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Variant
        fields = '__all__'

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductDetailedSerializer()
    variant = ProductVariantSerializer()
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['address']  # Include only the address or other required fields

class SubOrderWithOrderAddressSerializer(serializers.ModelSerializer):
    address = AddressSerializer(source='order.address')
    items = OrderItemSerializer(many=True)
    added_on = serializers.DateTimeField(source='order.added_on')
    class Meta:
        model = SubOrder
        fields = '__all__'  # Include all SubOrder fields or specify required fields
        extra_fields = ['address', 'added_on']

class HomepageBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomepageBanner
        fields = '__all__'