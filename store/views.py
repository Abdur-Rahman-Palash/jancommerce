from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse
import json


# dummy product data defined in view (no DB)
def get_dummy_products():
    vendors = [
        {"name": "Alpha Store", "rating": 4.5},
        {"name": "Beta Traders", "rating": 4.0},
        {"name": "Gamma Goods", "rating": 3.5},
        {"name": "Delta Tech", "rating": 4.8},
    ]
    products = []
    for i in range(1, 13):
        product = {
            "id": i,
            "name": f"Premium Product {i}",
            "price": round(10 + i * 2.5, 2),
            "old_price": round(12 + i * 2.5, 2) if i % 3 == 0 else None,
            "discount": f"{10 + (i % 3) * 5}%" if i % 3 == 0 else None,
            "image": f"https://picsum.photos/seed/product{i}/400/300.jpg",
            "rating": (i % 5) + 1,
            "category": ["Electronics", "Fashion", "Home", "Sports"][i % 4],
            "badge": "New" if i % 4 == 0 else ("Sale" if i % 5 == 0 else ("Hot" if i % 7 == 0 else "")),
            "vendor": vendors[i % len(vendors)],
            "featured": i <= 4,  # First 4 products are featured
            "description": f"High-quality {['Electronics', 'Fashion', 'Home', 'Sports'][i % 4]} product with premium features and modern design."
        }
        products.append(product)
    return products


def product_list(request):
    products = get_dummy_products()
    context = {
        'products': products,
    }
    return render(request, 'store/product_list.html', context)


def product_detail(request, product_id):
    products = get_dummy_products()
    product = next((p for p in products if p['id'] == product_id), None)
    
    if not product:
        return render(request, 'store/404.html', status=404)
    
    # Get related products (same category, excluding current)
    related_products = [p for p in products if p['category'] == product['category'] and p['id'] != product['id']][:4]
    
    context = {
        'product': product,
        'related_products': related_products,
    }
    return render(request, 'store/product_detail.html', context)


def cart_view(request):
    return render(request, 'store/cart.html')


def dashboard_view(request):
    return render(request, 'store/dashboard.html')


def categories_view(request):
    products = get_dummy_products()
    categories = list(set(p['category'] for p in products))
    
    context = {
        'categories': categories,
        'products': products,
    }
    return render(request, 'store/categories.html', context)


def deals_view(request):
    products = get_dummy_products()
    
    # Get products with discounts (deals)
    deals = []
    for product in products:
        if hasattr(product, 'old_price') and product.old_price and product.old_price > product.price:
            deals.append(product)
    
    context = {
        'deals': deals,
        'products': products,
    }
    return render(request, 'store/deals.html', context)


# Authentication Views
def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        remember = request.POST.get('remember')
        
        # For demo purposes, we'll create/find a user
        # In production, you'd use proper authentication
        try:
            # Try to get user by email (Django uses username by default)
            username = email.split('@')[0]  # Simple username from email
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                
                # Handle remember me
                if not remember:
                    request.session.set_expiry(0)  # Session expires on browser close
                else:
                    request.session.set_expiry(1209600)  # 2 weeks
                
                messages.success(request, f'Welcome back, {user.first_name or username}!')
                return redirect('/')
            else:
                # For demo, create a user if not exists
                if not User.objects.filter(username=username).exists():
                    user = User.objects.create_user(
                        username=username,
                        email=email,
                        password=password,
                        first_name='Demo',
                        last_name='User'
                    )
                    login(request, user)
                    messages.success(request, f'Welcome to JanCommerce, {user.first_name}!')
                    return redirect('/')
                else:
                    messages.error(request, 'Invalid email or password')
        except Exception as e:
            messages.error(request, 'Login failed. Please try again.')
    
    return render(request, 'store/login.html')


def signup_view(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        account_type = request.POST.get('account_type', 'buyer')
        terms = request.POST.get('terms')
        
        # Validation
        if not all([first_name, last_name, email, password, confirm_password]):
            messages.error(request, 'All fields are required')
            return render(request, 'store/signup.html')
        
        if password != confirm_password:
            messages.error(request, 'Passwords do not match')
            return render(request, 'store/signup.html')
        
        if len(password) < 8:
            messages.error(request, 'Password must be at least 8 characters long')
            return render(request, 'store/signup.html')
        
        if not terms:
            messages.error(request, 'You must agree to the terms and conditions')
            return render(request, 'store/signup.html')
        
        try:
            # Create user
            username = email.split('@')[0]
            if User.objects.filter(username=username).exists():
                username = f"{username}_{User.objects.count()}"
            
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            # Log the user in
            login(request, user)
            
            messages.success(request, f'Account created successfully! Welcome to JanCommerce, {first_name}!')
            return redirect('/')
            
        except Exception as e:
            messages.error(request, 'Account creation failed. Email might already be registered.')
    
    return render(request, 'store/signup.html')


def logout_view(request):
    logout(request)
    messages.success(request, 'You have been logged out successfully')
    return redirect('/login')


def forgot_password_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        # For demo purposes, just show success message
        messages.success(request, f'Password reset link has been sent to {email}')
        return redirect('/login/')
    
    return render(request, 'store/forgot_password.html')


def profile_view(request):
    return render(request, 'store/profile.html')


def orders_view(request):
    return render(request, 'store/orders.html')


def wishlist_view(request):
    return render(request, 'store/wishlist.html')


def settings_view(request):
    return render(request, 'store/settings.html')


def become_seller_view(request):
    return render(request, 'store/become_seller.html')


def checkout_view(request):
    return render(request, 'store/checkout.html')


def order_success_view(request):
    return render(request, 'store/order_success.html')
