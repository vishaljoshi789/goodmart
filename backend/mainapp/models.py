from django.db import models
from django.contrib.auth.models import AbstractUser
from .UserManager import CustomUserManager
# Create your models here.

def user_directory_path(instance, filename):
    return 'user_{0}/{1}'.format(instance.username, filename)

def vendor_directory_path(instance, filename):
    return 'vendor_{0}/{1}'.format(instance.user, filename)

class User(AbstractUser):
    user_id = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    phone_no = models.CharField(unique=True, max_length=10, blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=6, choices=(("Male", "Male"), ("Female", "Female")), blank=True, null=True)
    mother = models.CharField(max_length=50, blank=True, null=True)
    father = models.CharField(max_length=50, blank=True, null=True)
    pan_certificate = models.ImageField(upload_to=user_directory_path, blank=True, null=True)
    aadhar_certificate = models.ImageField(upload_to=user_directory_path, blank=True, null=True)
    user_type = models.CharField(max_length=20, blank=True, null=True, choices=(("Customer", "Customer"), ("Product Vendor", "Product Vendor"), ("Service Vendor", "Service Vendor")))
    added_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modify_on = models.DateTimeField(auto_now=True, blank=True, null=True)
    pan = models.CharField(max_length=10, blank=True, null=True)
    aadhar = models.CharField(max_length=16, blank=True, null=True)
    co_ordinates = models.CharField(max_length=150, blank=True, null=True)
    status = models.BooleanField(default=True)
    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)
    aadhar_verified = models.BooleanField(blank=True, null=True)
    pan_verified = models.BooleanField(blank=True, null=True)
    # bank_certificate = models.ImageField(upload_to=user_directory_path, blank=True, null=True)
    # bank_account = models.CharField(max_length=20, blank=True, null=True)
    # bank = models.CharField(max_length=50, blank=True, null=True)
    # ifsc = models.CharField(max_length=15, blank=True, null=True)
    # account_holder = models.CharField(max_length=150, blank=True, null=True)
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
    # passcode = models.IntegerField(blank=True, null=True)
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
    
class Product_Category(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='category_images/', blank=True, null=True)
    featured = models.BooleanField(default=False)
    parent = models.ForeignKey("self", on_delete=models.CASCADE, blank=True, null=True)
    added_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modify_on = models.DateTimeField(auto_now=True, blank=True, null=True)
    modify_by = models.IntegerField(blank=True, null=True)
    
    def __str__(self):
        return self.name
    
class Product_Brand(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
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
    mrp = models.DecimalField(max_digits=8, decimal_places=1, blank=True, null=True)
    offer_price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    status = models.BooleanField(default=False)
    added_on = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    modify_on = models.DateTimeField(auto_now=True, null=True, blank=True)
    tags = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to=vendor_directory_path, blank=True, null=True)
    video = models.FileField(upload_to=vendor_directory_path, blank=True, null=True)
    # item_type = models.IntegerField(blank=True, null=True)
    # position = models.IntegerField(blank=True, null=True)
    # unit = models.CharField(max_length=100, blank=True, null=True)
    # stock = models.IntegerField(blank=True, null=True)
    # rating = models.IntegerField(blank=True, null=True)
    # point = models.IntegerField(default=1, blank=True, null=True)
    # modify_by = models.IntegerField(blank=True, null=True)
    # shipping = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    # tax = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    # product_id = models.CharField(max_length=100, blank=True, null=True)
    # product_added_type = models.IntegerField(default=1, blank=True, null=True)
    # company_id = models.IntegerField(blank=True, null=True)
    # target = models.CharField(max_length=100, default='repurchase', blank=True, null=True)
    # capping = models.IntegerField(blank=True, null=True)
    # ratio = models.IntegerField(blank=True, null=True)
    # pairs = models.IntegerField(blank=True, null=True)
    # hsn = models.CharField(max_length=100, blank=True, null=True)


    def __str__(self):
        return str(self.name)
    
class Product_Image(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    added_on = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    modify_on = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    def __str__(self):
        return str(self.product.name)
    
class Product_Specifications(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    key = models.CharField(max_length=100, blank=True, null=True)
    value = models.CharField(max_length=100, blank=True, null=True)
    added_on = models.DateTimeField(auto_now_add=True, null=True, blank=True) 
    modify_on = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    def __str__(self):
        return str(self.product.name)
    
