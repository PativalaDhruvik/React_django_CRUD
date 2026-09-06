from django.urls import path
from . import views
urlpatterns =[
    path('Books/', views.get_books, name='get_all_books'),
    path('Books/create/', views.create_books, name='create_books')
]