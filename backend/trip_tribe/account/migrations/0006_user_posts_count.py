# Generated by Django 5.0.6 on 2024-08-23 13:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0005_alter_user_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='posts_count',
            field=models.IntegerField(default=0),
        ),
    ]