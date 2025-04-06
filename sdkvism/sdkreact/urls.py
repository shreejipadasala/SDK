from django.urls import path
from .views import upload_file, generate_graph
from . import views
from django.views.generic import TemplateView

urlpatterns = [
    path('upload_file/', upload_file, name='upload_file'),
    path('generate_graph/', generate_graph, name='generate_graph'),
    path('get_recommendations/', views.get_recommendations, name='get_recommendations'),
    path('', TemplateView.as_view(template_name='index.html')),
]
