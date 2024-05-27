from django.urls import path, re_path, include
from . import views

urlpatterns = [
    re_path(r'^$', views.cart_detail, name='cart_detail'),
    re_path(r'^add/(?P<product_id>\d+)/$', views.cart_add, name='cart_add'),
    re_path('cart_get_totalitems/', views.cart_get_totalitems),
    re_path('remove/', views.cart_remove2),
    re_path('changeQualityProduct/', views.changeQualityProduct),
    # re_path(r'^remove/(?P<product_id>\d+)/$', views.cart_remove, name='cart_remove'),
    path('order-sent-successfully/', views.ordersentsuccessfully, name='ordersentsuccessfully'),
]