# Generated by Django 5.0.6 on 2024-10-23 09:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0025_product_mrp_product_offer_price'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product_variant',
            old_name='price',
            new_name='mrp',
        ),
    ]