# Generated by Django 5.0.6 on 2025-03-01 20:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0017_homepageitem_brand_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='suborder',
            name='coupons',
            field=models.ManyToManyField(blank=True, to='mainapp.coupon'),
        ),
    ]
