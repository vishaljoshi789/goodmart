# Generated by Django 5.0.6 on 2024-09-28 20:54

import django.db.models.deletion
import mainapp.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0018_setting_coupon_points_shop'),
    ]

    operations = [
        migrations.AddField(
            model_name='address',
            name='co_ordinates',
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='company_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='mainapp.vendor_detail'),
        ),
        migrations.AddField(
            model_name='product',
            name='hsn',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='item_type',
            field=models.CharField(blank=True, choices=[('Packed', 'Packed'), ('Open', 'Open')], max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='point',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='stock',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='tax',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True),
        ),
        migrations.AddField(
            model_name='vendor_detail',
            name='admin_visiblity',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='vendor_detail',
            name='cash_on_delivery',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='vendor_detail',
            name='featured',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='vendor_detail',
            name='free_shipping_above',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True),
        ),
        migrations.AddField(
            model_name='vendor_detail',
            name='image1',
            field=models.ImageField(blank=True, null=True, upload_to=mainapp.models.vendor_directory_path),
        ),
        migrations.AddField(
            model_name='vendor_detail',
            name='image2',
            field=models.ImageField(blank=True, null=True, upload_to=mainapp.models.vendor_directory_path),
        ),
        migrations.AddField(
            model_name='vendor_detail',
            name='image3',
            field=models.ImageField(blank=True, null=True, upload_to=mainapp.models.vendor_directory_path),
        ),
        migrations.AddField(
            model_name='vendor_detail',
            name='logo',
            field=models.ImageField(blank=True, null=True, upload_to=mainapp.models.vendor_directory_path),
        ),
        migrations.AddField(
            model_name='vendor_detail',
            name='primary_category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='primary_shop', to='mainapp.product_category'),
        ),
        migrations.AddField(
            model_name='vendor_detail',
            name='vendor_visiblity',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='vendor_detail',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='shop', to='mainapp.product_category'),
        ),
        migrations.CreateModel(
            name='ShippingCharges',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pincode', models.CharField(blank=True, max_length=6, null=True)),
                ('charges', models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True)),
                ('added_on', models.DateTimeField(auto_now_add=True, null=True)),
                ('modify_on', models.DateTimeField(auto_now=True, null=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.DeleteModel(
            name='Shop',
        ),
    ]