from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Item


@api_view(['GET'])
def health_check(request):
    """Endpoint de estado del servidor y la API."""
    return Response({
        "status": "ok",
        "message": "Servidor Django REST Framework listo y funcionando",
        "backend": "Django",
        "database": "PostgreSQL"
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def list_items(request):
    """Lista de elementos de muestra."""
    items = Item.objects.all().values('id', 'title', 'description', 'created_at')
    return Response({"items": list(items)}, status=status.HTTP_200_OK)
