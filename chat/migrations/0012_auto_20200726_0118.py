# Generated by Django 3.0.7 on 2020-07-26 01:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0011_auto_20200721_0741'),
    ]

    operations = [
        migrations.AlterField(
            model_name='animation',
            name='bgColor',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
    ]