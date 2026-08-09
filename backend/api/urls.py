from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('items/', views.list_items, name='list_items'),
    path('calculator/evaluate/', views.evaluate_calculator, name='evaluate_calculator'),
]
