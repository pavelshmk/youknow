# Generated by Django 3.0.4 on 2020-04-21 13:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0011_auto_20200414_1851'),
    ]

    operations = [
        migrations.AddField(
            model_name='quizcategory',
            name='image',
            field=models.ImageField(default='category.png', upload_to=''),
        ),
    ]
