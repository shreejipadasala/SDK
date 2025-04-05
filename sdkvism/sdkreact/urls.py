from django.urls import path
from .views import upload_file, generate_graph
from . import views
urlpatterns = [
    path('upload_file/', upload_file, name='upload_file'),
    path('generate_graph/', generate_graph, name='generate_graph'),
    path('get_recommendations/', views.get_recommendations, name='get_recommendations')
]
