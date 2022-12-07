# Generated by Django 3.0.4 on 2020-04-29 18:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0016_quizquestion_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quiz',
            name='is_copy',
        ),
        migrations.AddField(
            model_name='quiz',
            name='copy_source',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='quiz.Quiz'),
        ),
    ]