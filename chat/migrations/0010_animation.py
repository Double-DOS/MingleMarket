# Generated by Django 3.0.7 on 2020-07-21 07:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0009_contact_warning'),
    ]

    operations = [
        migrations.CreateModel(
            name='Animation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('startConfetti', models.CharField(max_length=3)),
                ('confettiType', models.IntegerField()),
                ('bgColor', models.CharField(max_length=10)),
            ],
        ),
    ]