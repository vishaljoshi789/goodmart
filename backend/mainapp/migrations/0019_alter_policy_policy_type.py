# Generated by Django 5.0.6 on 2025-03-09 04:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0018_suborder_coupons'),
    ]

    operations = [
        migrations.AlterField(
            model_name='policy',
            name='policy_type',
            field=models.CharField(choices=[('Terms and Conditions', 'Terms and Conditions'), ('Return Policy', 'Return Policy'), ('Refund Policy', 'Refund Policy'), ('Privacy Policy', 'Privacy Policy'), ('Shipping Policy', 'Shipping Policy'), ('Product Warranty', 'Product Warranty'), ('Our Mission and Vision', 'Our Mission and Vision')], max_length=25, unique=True),
        ),
    ]
