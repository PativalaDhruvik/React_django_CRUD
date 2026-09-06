from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import BookStore
from .serializers import BookStoreSerializer


@api_view(['GET'])
def get_books(request):
    books = BookStore.objects.all()
    serializer = BookStoreSerializer(books, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_books(request):
    serializer = BookStoreSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)  # return created book JSON
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # return validation errors

@api_view(['PUT','DELETE'])
def update_books(request, pk):
    try:
        book = BookStore.objects.get(pk=pk)
    except BookStore.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)   
    
    if request.method == 'DELETE':
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        serializer = BookStoreSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


