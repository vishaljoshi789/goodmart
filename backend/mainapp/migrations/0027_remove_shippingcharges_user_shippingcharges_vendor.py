# Generated by Django 5.0.6 on 2024-10-25 20:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0026_rename_price_product_variant_mrp'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shippingcharges',
            name='user',
        ),
        migrations.AddField(
            model_name='shippingcharges',
            name='vendor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='shipping_charges', to='mainapp.vendor_detail'),
        ),
    ]
