# Generated by Django 5.0.6 on 2024-08-15 13:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0005_rename_specification_product_specifications_key_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='status',
            field=models.BooleanField(default=True),
        ),
    ]