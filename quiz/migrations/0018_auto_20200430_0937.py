# Generated by Django 3.0.4 on 2020-04-30 09:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0017_auto_20200429_1855'),
    ]

    operations = [
        migrations.CreateModel(
            name='Foundation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=64)),
            ],
        ),
        migrations.AddField(
            model_name='quiz',
            name='foundation',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='quiz.Foundation'),
        ),
    ]
