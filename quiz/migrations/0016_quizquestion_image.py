# Generated by Django 3.0.4 on 2020-04-28 16:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0015_auto_20200424_1546'),
    ]

    operations = [
        migrations.AddField(
            model_name='quizquestion',
            name='image',
            field=models.TextField(blank=True, null=True),
        ),
    ]
