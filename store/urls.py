from django.urls import path
from . import views

app_name = 'store'

urlpatterns = [
    path('', views.product_list, name='product_list'),
    path('products/', views.product_list, name='products'),
    path('product/<int:product_id>/', views.product_detail, name='product_detail'),
    path('cart/', views.cart_view, name='cart'),
    path('checkout/', views.checkout_view, name='checkout'),
    path('order-success/', views.order_success_view, name='order_success'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('categories/', views.categories_view, name='categories'),
    path('deals/', views.deals_view, name='deals'),
    
    # User account pages
    path('profile/', views.profile_view, name='profile'),
    path('orders/', views.orders_view, name='orders'),
    path('wishlist/', views.wishlist_view, name='wishlist'),
    path('settings/', views.settings_view, name='settings'),
    path('become-seller/', views.become_seller_view, name='become_seller'),
    
    # Authentication URLs
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('forgot-password/', views.forgot_password_view, name='forgot_password'),
]
