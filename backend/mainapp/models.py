from django.db import models
from django.contrib.auth.models import AbstractUser
from .UserManager import CustomUserManager
from django.utils.timezone import now, timedelta
# Create your models here.

def user_directory_path(instance, filename):
    return 'user_{0}/{1}'.format(instance.username, filename)

def user_detail_directory_path(instance, filename):
    return 'user_{0}/{1}'.format(instance.user.username, filename)

def vendor_directory_path(instance, filename):
    return 'vendor_{0}/{1}'.format(instance.user, filename)

def web_direcory_path(instance, filename):
    return 'web/{0}'.format(filename)

class User(AbstractUser):
    user_id = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    phone_no = models.CharField(unique=True, max_length=15, blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True)
    user_type = models.CharField(max_length=20, blank=True, null=True, choices=(("Customer", "Customer"), ("Product Vendor", "Product Vendor"), ("Service Vendor", "Service Vendor")))
    added_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modify_on = models.DateTimeField(auto_now=True, blank=True, null=True)
    co_ordinates = models.CharField(max_length=150, blank=True, null=True)
    status = models.BooleanField(default=True)
    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)
    passcode = models.IntegerField(blank=True, null=True)
    referral = models.ForeignKey("self", on_delete=models.CASCADE, blank=True, null=True, related_name='referral_user')
    # dob = models.DateField(blank=True, null=True)
    # gender = models.CharField(max_length=6, choices=(("Male", "Male"), ("Female", "Female")), blank=True, null=True)
    # mother = models.CharField(max_length=50, blank=True, null=True)
    # father = models.CharField(max_length=50, blank=True, null=True)
    # pan_certificate = models.ImageField(upload_to=user_directory_path, blank=True, null=True)
    # aadhar_certificate = models.ImageField(upload_to=user_directory_path, blank=True, null=True) 
    # payment = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    # payment_mode = models.CharField(max_length=100, blank=True, null=True)
    # payment_detail = models.CharField(max_length=100, blank=True, null=True)
    # payment_date = models.DateField(blank=True, null=True)
    # green_date_time = models.DateTimeField(blank=True, null=True)
    # nop = models.IntegerField(blank=True, null=True)
    # nopp = models.IntegerField(blank=True, null=True)
    # ewallet = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    # level = models.IntegerField(blank=True, null=True)
    # sponsor = models.CharField(max_length=20, blank=True, null=True)
    # parent = models.CharField(max_length=100, blank=True, null=True)
    # position = models.IntegerField(blank=True, null=True)
    # parents = models.TextField(blank=True, null=True)
    # child = models.IntegerField(blank=True, null=True)
    # donation = models.IntegerField(blank=True, null=True)
    # p_address = models.TextField(blank=True, null=True)
    # landmark = models.CharField(max_length=150, blank=True, null=True)
    # category = models.CharField(max_length=100, blank=True, null=True)
    # pan_approve = models.IntegerField(blank=True, null=True)
    # epin = models.CharField(max_length=100, blank=True, null=True)
    # otp = models.IntegerField(blank=True, null=True)
    # otp_verified = models.IntegerField(blank=True, null=True)
    # token = models.CharField(max_length=50, blank=True, null=True)
    # pass_otp = models.IntegerField(blank=True, null=True)
    # pass_verified = models.IntegerField(blank=True, null=True)
    # verify_datetime = models.DateTimeField(blank=True, null=True)
    # business_updated = models.IntegerField(blank=True, null=True)
    # last_login = models.DateTimeField(blank=True, null=True)
    # ip_add = models.CharField(max_length=20, blank=True, null=True)
    # modify_by = models.IntegerField(blank=True, null=True)
    # p_pin = models.CharField(max_length=100, blank=True, null=True)
    # city = models.CharField(max_length=100, blank=True, null=True)
    # state = models.CharField(max_length=100, blank=True, null=True)
    # photograph = models.ImageField(upload_to=user_directory_path, blank=True, null=True)
    # gst = models.CharField(max_length=20, blank=True, null=True)
    # notice = models.IntegerField(blank=True, null=True)
    # joining_product = models.IntegerField(blank=True, null=True)
    # login_status = models.IntegerField(blank=True, null=True)
    # login_token = models.CharField(max_length=100, blank=True, null=True)
    # ip_address = models.CharField(max_length=100, blank=True, null=True)
    # login_otp = models.CharField(max_length=100, blank=True, null=True)
    # asso_with = models.TextField(null=True, blank=True)
    # asso_left = models.TextField(blank=True, null=True)
    # asso_right = models.TextField(blank=True, null=True)
    # asso_direct = models.TextField(blank=True, null=True)
    # pre_asso_list = models.TextField(blank=True, null=True)
    # left_points = models.IntegerField(blank=True, null=True)
    # right_points = models.IntegerField(blank=True, null=True)
    # bb_points = models.IntegerField(blank=True, null=True)
    # product_capping = models.IntegerField(blank=True, null=True)
    # wallet_status = models.BooleanField(default=True, blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()
    def __str__(self):
        return "{}".format(self.email)
    
class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    def is_valid(self):
        return now() < self.created_at + timedelta(minutes=15)  # 10-minute validity
    

    
class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name='address')
    name = models.CharField(max_length=100, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    landmark = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pin = models.CharField(max_length=6, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    co_ordinates = models.CharField(max_length=150, blank=True, null=True)
    alternate_phone = models.CharField(max_length=15, blank=True, null=True)
    added_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modify_on = models.DateTimeField(auto_now=True, blank=True, null=True)

class User_Detail(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True, related_name='user_detail')
    photograph = models.ImageField(upload_to=user_detail_directory_path, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    passbook_image = models.ImageField(upload_to=user_detail_directory_path, blank=True, null=True)
    bank_account_number = models.CharField(max_length=20, blank=True, null=True)
    bank = models.CharField(max_length=50, blank=True, null=True)
    ifsc = models.CharField(max_length=15, blank=True, null=True)
    account_holder = models.CharField(max_length=150, blank=True, null=True)
    billing_address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=True, null=True, related_name='billing_address')

    
class Product_Category(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='category_images/', blank=True, null=True)
    views = models.IntegerField(blank=True, null=True)
    featured = models.BooleanField(default=False)
    parent = models.ForeignKey("self", on_delete=models.CASCADE, blank=True, null=True)
    color = models.CharField(max_length=20, blank=True, null=True)
    border = models.CharField(max_length=20, blank=True, null=True)
    added_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modify_on = models.DateTimeField(auto_now=True, blank=True, null=True)
    modify_by = models.IntegerField(blank=True, null=True)

    
    def __str__(self):
        return self.name

class Vendor_Detail(models.Model):
    firm = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(Product_Category, on_delete=models.CASCADE, blank=True, null=True, related_name='shop')
    primary_category = models.ForeignKey(Product_Category, on_delete=models.CASCADE, blank=True, null=True, related_name='primary_shop')
    business_category = models.CharField(max_length=100, blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True, related_name='vendor')
    photograph = models.ImageField(upload_to=vendor_directory_path, blank=True, null=True)
    gst = models.CharField(max_length=20, blank=True, null=True)
    gst_certificate = models.ImageField(upload_to=vendor_directory_path, blank=True, null=True)
    pan = models.CharField(max_length=20, blank=True, null=True)
    pan_certificate = models.ImageField(upload_to=vendor_directory_path, blank=True, null=True)
    aadhar = models.CharField(max_length=20, blank=True, null=True)
    aadhar_front_image = models.ImageField(upload_to=vendor_directory_path, blank=True, null=True)
    aadhar_back_image = models.ImageField(upload_to=vendor_directory_path, blank=True, null=True)
    address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=True, null=True)
    qr = models.ImageField(upload_to=vendor_directory_path, blank=True, null=True)
    vendor_visiblity = models.BooleanField(default=True)
    admin_visiblity = models.BooleanField(default=False)
    status = models.CharField(max_length=20, blank=True, null=True, choices=(("Pending", "Pending"), ("Approved", "Approved"), ("Rejected", "Rejected")), default="Pending")
    status_message = models.CharField(max_length=100, blank=True, null=True, default="Status is in Pending State")
    cash_on_delivery = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    added_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modify_on = models.DateTimeField(auto_now=True, blank=True, null=True)
    image1 = models.ImageField(upload_to=vendor_directory_path, blank=True, null=True)
    image2 = models.ImageField(upload_to=vendor_directory_path, blank=True, null=True)
    image3 = models.ImageField(upload_to=vendor_directory_path, blank=True, null=True)
    logo = models.ImageField(upload_to=vendor_directory_path, blank=True, null=True)
    free_shipping_above = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    shipping = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    

    
class Product_Brand(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    image = models.ImageField(upload_to='brand_images/', blank=True, null=True)
    featured = models.BooleanField(default=False)
    added_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modify_on = models.DateTimeField(auto_now=True, blank=True, null=True)
    modify_by = models.IntegerField(blank=True, null=True)
    
    def __str__(self):
        return self.name

class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(Product_Category, on_delete=models.CASCADE, blank=True, null=True)
    brand = models.ForeignKey(Product_Brand, on_delete=models.CASCADE, blank=True, null=True)
    status = models.BooleanField(default=True)
    added_on = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    modify_on = models.DateTimeField(auto_now=True, null=True, blank=True)
    tags = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to=vendor_directory_path, blank=True, null=True)
    video = models.FileField(upload_to=vendor_directory_path, blank=True, null=True)
    hsn = models.CharField(max_length=100, blank=True, null=True)
    tax = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    item_type = models.CharField(max_length=10, blank=True, null=True, choices=(("Packed", "Packed"), ("Open", "Open"), ("Loose", "Loose")))
    company_id = models.ForeignKey(Vendor_Detail, on_delete=models.CASCADE, blank=True, null=True)
    barcode_number = models.CharField(max_length=100, blank=True, null=True)
    inventory_fee = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, default=10)
    offer_price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    mrp = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    purchase_amount = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    stock = models.IntegerField(blank=True, null=True)
    point = models.IntegerField(default=0, blank=True, null=True)
    # position = models.IntegerField(blank=True, null=True)
    # unit = models.CharField(max_length=100, blank=True, null=True)
    # rating = models.IntegerField(blank=True, null=True)
    # modify_by = models.IntegerField(blank=True, null=True)
    # shipping = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    # product_id = models.CharField(max_length=100, blank=True, null=True)
    # product_added_type = models.IntegerField(default=1, blank=True, null=True)
    # target = models.CharField(max_length=100, default='repurchase', blank=True, null=True)
    # capping = models.IntegerField(blank=True, null=True)
    # ratio = models.IntegerField(blank=True, null=True)
    # pairs = models.IntegerField(blank=True, null=True)


    def __str__(self):
        return str(self.name)
    
class Product_Variant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(max_length=100, blank=True, null=True, choices=(("Quantity", "Quantity"), ("Size", "Size"), ("Color", "Color"), ("Weight", "Weight"), ("Material", "Material")))
    offer_price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    mrp = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    stock = models.IntegerField(blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    added_on = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    modify_on = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    def __str__(self):
        return str(self.name)
    
class Product_Image(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    added_on = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    modify_on = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    def __str__(self):
        return str(self.product.name)
    
class Product_Specifications(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='specifications')
    key = models.CharField(max_length=100, blank=True, null=True)
    value = models.CharField(max_length=100, blank=True, null=True)
    added_on = models.DateTimeField(auto_now_add=True, null=True, blank=True) 
    modify_on = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    def __str__(self):
        return str(self.product.name)
    
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name='cart')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, blank=True, null=True)
    variant = models.ForeignKey(Product_Variant, on_delete=models.CASCADE, blank=True, null=True)
    quantity = models.IntegerField(blank=True, null=True)
    added_on = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    modify_on = models.DateTimeField(auto_now=True, null=True, blank=True)

class ShippingCharges(models.Model):
    vendor = models.ForeignKey(Vendor_Detail, on_delete=models.CASCADE, null=True, blank=True, related_name='shipping_charges')
    pincode = models.CharField(max_length=6, null=True, blank=True)
    charges = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    added_on = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    modify_on = models.DateTimeField(auto_now=True, null=True, blank=True)

class Coupon(models.Model):
    COUPON_TYPE_CHOICES = [
        ('REDEEMABLE', 'REDEEMABLE'),
        ('DIRECT_USE', 'DIRECT_USE'),
    ]
    code = models.CharField(max_length=50, unique=True, default='000000')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="coupons", null=True, blank=True)
    vendor = models.ForeignKey(Vendor_Detail, on_delete=models.CASCADE, blank=True, null=True)
    description = models.TextField(null=True)
    title = models.CharField(max_length=1000, null=True)
    type = models.CharField(max_length=20, choices=COUPON_TYPE_CHOICES, default='REDEEMABLE')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField(blank=True, null=True) 

    def __str__(self):
        return f"Coupon {self.code} - {self.type}"
    

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='orders')
    address = models.ForeignKey(Address, on_delete=models.CASCADE, null=True, blank=True)
    subtotal = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    shipping = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    added_on = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    modify_on = models.DateTimeField(auto_now=True, null=True, blank=True)
    order_confirmed = models.BooleanField(default=False)
    
class SubOrder(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True, related_name='sub_orders')
    vendor = models.ForeignKey(Vendor_Detail, on_delete=models.CASCADE, null=True, blank=True)
    subtotal = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    shipping = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, null=True, blank=True, choices=(("Pending", "Pending"), ("Approved", "Approved"), ("Rejected", "Rejected"), ("Processing", "Processing"), ("Delivered", "Delivered"), ("Cancelled", "Cancelled")), default="Pending")
    payment_mode = models.CharField(max_length=20, null=True, blank=True, choices=(("COD", "COD"), ("Online", "Online")))
    payment_status = models.CharField(max_length=20, null=True, blank=True, choices=(("Pending", "Pending"), ("Approved", "Approved"), ("Rejected", "Rejected")), default="Pending")
    payment_id = models.CharField(max_length=100, null=True, blank=True)
    coupons = models.ManyToManyField(Coupon, blank=True)

class OrderItem(models.Model):
    order = models.ForeignKey(SubOrder, on_delete=models.CASCADE, null=True, blank=True, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    variant = models.ForeignKey(Product_Variant, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.IntegerField(null=True, blank=True)
    total = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    added_on = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    modify_on = models.DateTimeField(auto_now=True, null=True, blank=True)

class LevelPoints(models.Model):
    points = models.IntegerField(null=True, blank=True)
    added_on = models.DateTimeField(auto_now_add=True, null=True, blank=True)

class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="wallet")
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    passcode = models.CharField(max_length=6, blank=True, null=True)

    def add_balance(self, amount, description="", related_coupon=None):
        """Adds a specific amount to the wallet balance and logs a transaction."""
        if amount > 0:
            Transaction.objects.create(
                wallet=self,
                transaction_type='CREDIT',
                amount=amount,
                description=description,
                related_coupon=related_coupon
            )
            self.balance += amount
            self.save()
            # Log the transaction
        else:
            raise ValueError("Amount to add must be positive.")

    def deduct_balance(self, amount, description="", related_order=None):
        """Deducts a specific amount from the wallet balance and logs a transaction."""
        if amount > 0:
            if amount <= self.balance:
                self.balance -= amount
                self.save()
                # Log the transaction
                Transaction.objects.create(
                    wallet=self,
                    transaction_type='DEBIT',
                    amount=amount,
                    description=description,
                    related_order=related_order
                )
            else:
                raise ValueError("Insufficient balance.")
        else:
            raise ValueError("Amount to deduct must be positive.")
        

class Transaction(models.Model):
    TRANSACTION_TYPE_CHOICES = [
        ('CREDIT', 'Credit'),  # Adding balance to the wallet
        ('DEBIT', 'Debit'),    # Deducting balance from the wallet
    ]

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="transactions")
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)  # Reason for the transaction
    related_coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True, related_name="transactions")
    related_order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True, related_name="transactions")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.wallet.user.username} - {self.transaction_type} - {self.amount}"

class Setting(models.Model):
    registration_points = models.PositiveIntegerField(null=True, blank=True, default=0)
    platform_fee = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)

class HomepageBanner(models.Model):
    image = models.ImageField(upload_to=web_direcory_path, blank=True, null=True)
    link = models.CharField(max_length=500, blank=True, null=True)
    added_on = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    modify_on = models.DateTimeField(auto_now=True, null=True, blank=True)


class HomepageSection(models.Model):
    SECTION_CHOICES = [
        ('Top Deals', 'Top Deals'),
        ('Recommended for You', 'Recommended for You'),
        ('Featured Items', 'Featured Items'),
        ('Shop by Brand', 'Shop by Brand'),
        ('New Arrivals', 'New Arrivals'),
        ('Trending Products', 'Trending Products'),
    ]
    CONTENT_TYPE_CHOICES = [
        ('Product', 'Product'),
        ('Category', 'Category'),
        ('Brand', 'Brand')
    ]
    name = models.CharField(max_length=100, choices=SECTION_CHOICES, unique=True)
    display_order = models.PositiveIntegerField(help_text="Order in which the section appears")
    content_type = models.CharField(max_length=10, choices=CONTENT_TYPE_CHOICES, null=True)

    
class HomepageItem(models.Model):
    section = models.ForeignKey(HomepageSection, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, blank=True, null=True)
    category = models.ForeignKey(Product_Category, on_delete=models.CASCADE, blank=True, null=True)
    brand = models.ForeignKey(Product_Brand, on_delete=models.CASCADE, blank=True, null=True)
    image = models.ImageField(upload_to=web_direcory_path, blank=True, null=True)
    added_on = models.DateTimeField(auto_now_add=True)
    modify_on = models.DateTimeField(auto_now=True)

class Policy(models.Model):
    POLICY_TYPES = [
        ('Terms and Conditions', 'Terms and Conditions'),
        ('Return Policy', 'Return Policy'),
        ('Refund Policy', 'Refund Policy'),
        ('Privacy Policy', 'Privacy Policy'),
        ('Shipping Policy', 'Shipping Policy'),
        ('Product Warranty', 'Product Warranty'),
        ('Our Mission and Vision', 'Our Mission and Vision'),
    ]

    policy_type = models.CharField(max_length=25, choices=POLICY_TYPES, unique=True)
    content = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return dict(self.POLICY_TYPES).get(self.policy_type, "Policy")
    
class PopUp(models.Model):
    POPUP_TYPE = [
        ('Home Page', 'Home Page'),
        ('Category', 'Category'),
        ('Brand', 'Brand'),
        ('Vendor', 'Vendor'),
        ('Customer', 'Customer'),
        ('Wallet', 'Wallet'),
        ('Login', 'Login')
    ]
    title = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=15, choices=POPUP_TYPE, null=True)
    status = models.BooleanField(default=True)
    image = models.ImageField(upload_to=web_direcory_path, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    button_text = models.CharField(max_length=100, blank=True, null=True)
    button_url = models.TextField(blank=True, null=True)

