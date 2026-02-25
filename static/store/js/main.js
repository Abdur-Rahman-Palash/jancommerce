// Modern SPA Router and State Management
class JanCommerceRouter {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.state = {
      products: [],
      cart: [],
      filters: {
        category: 'all',
        priceRange: [0, 1000],
        search: ''
      }
    };
    this.init();
  }

  init() {
    // Initialize products from window data
    if (window.products) {
      this.state.products = window.products;
    }

    // Setup routing
    this.setupRouting();
    
    // Setup cart functionality
    this.setupCart();
    
    // Setup filters
    this.setupFilters();
    
    // Setup sidebar toggle
    this.setupSidebar();
    
    // Load initial products
    this.loadProducts();
    
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      this.handleRoute(e.state?.route || '/');
    });
  }

  setupRouting() {
    // Intercept link clicks for SPA navigation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.getAttribute('href').startsWith('/')) {
        e.preventDefault();
        const route = link.getAttribute('href');
        this.navigate(route);
      }
    });
  }

  navigate(route, data = {}) {
    // Update URL without page refresh
    history.pushState({ route, data }, '', route);
    this.handleRoute(route, data);
  }

  handleRoute(route, data = {}) {
    this.currentRoute = route;
    
    // Hide all main content sections
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => section.style.display = 'none');
    
    // Route handling
    switch(route) {
      case '/':
      case '/home':
        this.showHome();
        break;
      case '/products':
        this.showProducts();
        break;
      case '/cart':
        this.showCart();
        break;
      case '/dashboard':
        this.showDashboard();
        break;
      default:
        if (route.startsWith('/product/')) {
          const productId = route.split('/')[2];
          this.showProduct(productId);
        } else {
          this.show404();
        }
    }
  }

  showHome() {
    document.querySelector('.hero-section')?.style.removeProperty('display');
    document.querySelector('.pricing-section')?.style.removeProperty('display');
    document.querySelector('.featured-section')?.style.removeProperty('display');
    this.updatePageTitle('Home - JanCommerce');
  }

  showProducts() {
    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
      productGrid.style.display = 'grid';
      document.querySelector('.hero-section')?.style.display = 'none';
      document.querySelector('.pricing-section')?.style.display = 'none';
    }
    this.updatePageTitle('Products - JanCommerce');
  }

  showCart() {
    this.renderCart();
    this.updatePageTitle('Cart - JanCommerce');
  }

  showDashboard() {
    this.renderDashboard();
    this.updatePageTitle('Dashboard - JanCommerce');
  }

  showProduct(productId) {
    const product = this.state.products.find(p => p.id == productId);
    if (product) {
      this.renderProductDetail(product);
    } else {
      this.show404();
    }
  }

  show404() {
    this.render404();
  }

  updatePageTitle(title) {
    document.title = title;
  }

  setupCart() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('jancommerce_cart');
    if (savedCart) {
      this.state.cart = JSON.parse(savedCart);
    }
    this.updateCartUI();

    // Cart button click
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate('/cart');
      });
    }
  }

  addToCart(productId) {
    const product = this.state.products.find(p => p.id === productId);
    if (product) {
      const existingItem = this.state.cart.find(item => item.id === productId);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.state.cart.push({ ...product, quantity: 1 });
      }
      this.saveCart();
      this.updateCartUI();
      this.showNotification('Product added to cart!');
    }
  }

  removeFromCart(productId) {
    this.state.cart = this.state.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartUI();
  }

  saveCart() {
    localStorage.setItem('jancommerce_cart', JSON.stringify(this.state.cart));
  }

  updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      const totalItems = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      cartCount.style.transform = totalItems > 0 ? 'scale(1)' : 'scale(0)';
    }
  }

  setupFilters() {
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        this.state.filters.category = e.target.value;
        this.filterProducts();
      });
    }

    // Search filter
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.filters.search = e.target.value.toLowerCase();
        this.filterProducts();
      });
    }
  }

  filterProducts() {
    const filtered = this.state.products.filter(product => {
      const matchesCategory = this.state.filters.category === 'all' || 
                             product.category === this.state.filters.category;
      const matchesSearch = this.state.filters.search === '' || 
                           product.name.toLowerCase().includes(this.state.filters.search);
      return matchesCategory && matchesSearch;
    });

    this.renderProducts(filtered);
  }

  renderProducts(products) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => `
      <div class="product-card" data-category="${product.category}" data-price="${product.price}">
        <div class="relative">
          <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover" />
          <span class="absolute top-2 left-2 bg-gray-800 bg-opacity-60 text-white px-2 py-1 text-xs rounded">${product.vendor.name}</span>
        </div>
        ${product.badge ? `<span class="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 text-xs font-semibold rounded">${product.badge}</span>` : ''}
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-1">${product.name}</h3>
          <p class="text-xs text-gray-600 mb-1">Sold by: ${product.vendor.name}</p>
          <p class="text-gray-800 font-bold mb-2">$${product.price}</p>
          <div class="flex items-center mb-2">
            ${this.renderStars(product.rating)}
          </div>
          <button class="add-cart btn-micro bg-gradient-to-r from-green-400 to-teal-400 text-white px-4 py-2 rounded-full" onclick="router.addToCart(${product.id})">
            Add to cart
          </button>
        </div>
      </div>
    `).join('');
  }

  renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += i <= rating ? '<i class="fas fa-star text-yellow-400"></i>' : '<i class="far fa-star text-yellow-400"></i>';
    }
    return stars;
  }

  setupSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('translate-x-0');
        sidebar.classList.toggle('-translate-x-full');
      });
    }
  }

  loadProducts() {
    // Hide skeleton and show products
    setTimeout(() => {
      const skeletonGrid = document.getElementById('skeletonGrid');
      const productGrid = document.getElementById('productGrid');
      
      if (skeletonGrid) skeletonGrid.classList.add('hidden');
      if (productGrid) {
        productGrid.classList.remove('hidden');
        this.renderProducts(this.state.products);
      }
    }, 1000);
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-down';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  renderCart() {
    // Implementation for cart rendering
    console.log('Rendering cart with items:', this.state.cart);
  }

  renderDashboard() {
    // Implementation for dashboard rendering
    console.log('Rendering dashboard');
  }

  renderProductDetail(product) {
    // Implementation for product detail rendering
    console.log('Rendering product detail:', product);
  }

  render404() {
    // Implementation for 404 page
    console.log('Rendering 404 page');
  }
}

// Initialize router when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.router = new JanCommerceRouter();
});
