from django.urls import path
from .views import upload_file, generate_graph
from . import views
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('upload_file/', upload_file, name='upload_file'),
    path('generate_graph/', generate_graph, name='generate_graph'),
    path('get_recommendations/', views.get_recommendations, name='get_recommendations'),
    path('', TemplateView.as_view(template_name='index.html')),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)