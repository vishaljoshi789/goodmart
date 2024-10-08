# Generated by Django 5.0.6 on 2024-08-10 13:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0002_remove_user_account_holder_remove_user_asso_direct_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='brand_id',
            new_name='brand',
        ),
        migrations.RenameField(
            model_name='product',
            old_name='category_id',
            new_name='category',
        ),
        migrations.RenameField(
            model_name='product',
            old_name='hsn',
            new_name='name',
        ),
        migrations.RemoveField(
            model_name='product',
            name='capping',
        ),
        migrations.RemoveField(
            model_name='product',
            name='company_id',
        ),
        migrations.RemoveField(
            model_name='product',
            name='item_name',
        ),
        migrations.RemoveField(
            model_name='product',
            name='item_type',
        ),
        migrations.RemoveField(
            model_name='product',
            name='modify_by',
        ),
        migrations.RemoveField(
            model_name='product',
            name='pairs',
        ),
        migrations.RemoveField(
            model_name='product',
            name='point',
        ),
        migrations.RemoveField(
            model_name='product',
            name='position',
        ),
        migrations.RemoveField(
            model_name='product',
            name='product_added_type',
        ),
        migrations.RemoveField(
            model_name='product',
            name='product_id',
        ),
        migrations.RemoveField(
            model_name='product',
            name='rating',
        ),
        migrations.RemoveField(
            model_name='product',
            name='ratio',
        ),
        migrations.RemoveField(
            model_name='product',
            name='shipping',
        ),
        migrations.RemoveField(
            model_name='product',
            name='stock',
        ),
        migrations.RemoveField(
            model_name='product',
            name='tag',
        ),
        migrations.RemoveField(
            model_name='product',
            name='target',
        ),
        migrations.RemoveField(
            model_name='product',
            name='tax',
        ),
        migrations.RemoveField(
            model_name='product',
            name='unit',
        ),
        migrations.AddField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='product_images/'),
        ),
        migrations.AddField(
            model_name='product',
            name='video',
            field=models.FileField(blank=True, null=True, upload_to='product_videos/'),
        ),
    ]
