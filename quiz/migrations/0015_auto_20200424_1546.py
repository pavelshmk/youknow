# Generated by Django 3.0.4 on 2020-04-24 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0014_quiz_delay_minutes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quizoption',
            name='comment',
            field=models.TextField(blank=True, default='', null=True),
        ),
    ]
