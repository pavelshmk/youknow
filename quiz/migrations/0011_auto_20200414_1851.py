# Generated by Django 3.0.4 on 2020-04-14 18:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0010_auto_20200408_1606'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quizoption',
            name='comment',
            field=models.TextField(blank=True, default=''),
        ),
    ]