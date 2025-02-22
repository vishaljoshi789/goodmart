from rest_framework import serializers
from ..models import Product, Product_Image, Product_Specifications, Vendor_Detail, Address, Product_Variant, ShippingCharges, Order, OrderItem, SubOrder, Product_Brand


class ProductBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Brand
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
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'images', 'specifications', 'status', 'added_on', 'modify_on', 'tags', 'category', 'brand', 'image', 'video', 'barcode_number', 'item_type', 'tax', 'mrp', 'offer_price', 'stock', 'hsn', 'purchase_amount']


class ProductEditSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True)
    specifications = ProductSpecificationsSerializer(many=True)
    variants = ProductVariantSerializer(many=True)
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'variants', 'images', 'specifications', 'status', 'added_on', 'modify_on', 'tags', 'category', 'brand', 'image', 'video', 'barcode_number', 'item_type', 'tax', 'mrp', 'offer_price', 'stock', 'hsn', 'purchase_amount']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class VendorDetailSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    primary_category = serializers.StringRelatedField()
    class Meta:
        model = Vendor_Detail
        fields = '__all__'

class GetVendorDetailSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    primary_category = serializers.StringRelatedField()
    address = AddressSerializer()
    class Meta:
        model = Vendor_Detail
        fields = '__all__'

class KYCDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor_Detail
        fields = '__all__'

class ShippingChargesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingCharges
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