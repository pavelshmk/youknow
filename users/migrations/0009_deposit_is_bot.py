# Generated by Django 3.0.4 on 2020-04-27 08:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_deposit'),
    ]

    operations = [
        migrations.AddField(
            model_name='deposit',
            name='is_bot',
            field=models.BooleanField(default=False),
        ),
    ]
