from django.db import models

# Create your models here.
class BookStore(models.Model):
    title = models.TextField(max_length=50)
    release_date = models.DateField()

    def __str__(self):
        return self.title