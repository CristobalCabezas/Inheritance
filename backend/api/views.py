from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Item
from .services.calculator import evaluate_inheritance


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Endpoint de estado del servidor y la API."""
    return Response({
        "status": "ok",
        "message": "Servidor Django REST Framework listo y funcionando",
        "backend": "Django",
        "database": "PostgreSQL"
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_items(request):
    """Lista de elementos de muestra."""
    items = Item.objects.all().values('id', 'title', 'description', 'created_at')
    return Response({"items": list(items)}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def evaluate_calculator(request):
    """
    Evalúa la partición de la herencia y el cálculo de impuestos (Modo 1).
    Endpoint público y sin almacenamiento de datos personales.
    """
    try:
        payload = request.data or {}
        results = evaluate_inheritance(payload)
        return Response(results, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            "error": "Ocurrió un error al procesar el cálculo de herencia.",
            "details": str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
