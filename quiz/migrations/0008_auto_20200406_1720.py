# Generated by Django 3.0.4 on 2020-04-06 17:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0007_quiz_creator'),
    ]

    operations = [
        migrations.AddField(
            model_name='quiz',
            name='end_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='quiz',
            name='max_length',
            field=models.DurationField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='quizanswer',
            name='question',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='quiz.QuizQuestion'),
        ),
    ]