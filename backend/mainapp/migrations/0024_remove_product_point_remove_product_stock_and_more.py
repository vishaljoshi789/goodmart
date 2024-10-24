# Generated by Django 5.0.6 on 2024-10-20 14:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0023_remove_product_mrp_remove_product_offer_price_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='point',
        ),
        migrations.RemoveField(
            model_name='product',
            name='stock',
        ),
        migrations.AddField(
            model_name='product_variant',
            name='expiry_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='product_variant',
            name='offer_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='item_type',
            field=models.CharField(blank=True, choices=[('Packed', 'Packed'), ('Open', 'Open'), ('Loose', 'Loose')], max_length=10, null=True),
        ),
    ]
