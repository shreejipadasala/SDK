from django.urls import path
from .views import upload_file, generate_graph

urlpatterns = [
    path('upload_file/', upload_file, name='upload_file'),
    path('generate_graph/', generate_graph, name='generate_graph'),
]
