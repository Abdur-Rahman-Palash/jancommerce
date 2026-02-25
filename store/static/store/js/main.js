// central JS file for interactions

// sidebar toggle
const sidebar = document.getElementById('sidebar');
if (sidebar) {
    document.getElementById('sidebarToggle').addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
    });
}

// page spinner controls
function showSpinner() { document.getElementById('pageSpinner').classList.remove('hidden'); }
function hideSpinner() { document.getElementById('pageSpinner').classList.add('hidden'); }

// cart logic
let cartCount = 0;
function addToCartAnimation(btn, e) {
    const circle = document.createElement('span');
    circle.className = 'ripple';
    btn.appendChild(circle);
    const d = Math.max(btn.clientWidth, btn.clientHeight);
    circle.style.width = circle.style.height = d + 'px';
    circle.style.left = e.clientX - btn.offsetLeft - d/2 + 'px';
    circle.style.top = e.clientY - btn.offsetTop - d/2 + 'px';
    setTimeout(() => circle.remove(), 600);
    cartCount++;
    const badge = document.getElementById('cartCount');
    badge.textContent = cartCount;
    badge.classList.add('scale-110');
    setTimeout(() => badge.classList.remove('scale-110'), 200);
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg opacity-0 transition-opacity';
    toast.textContent = 'Added to cart';
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('opacity-100'));
    setTimeout(() => { toast.classList.remove('opacity-100'); setTimeout(() => toast.remove(), 300); }, 1200);
}

document.addEventListener('click', e => {
    if (e.target.matches('.add-cart') || e.target.closest('.add-cart')) {
        const btn = e.target.closest('.add-cart');
        addToCartAnimation(btn, e);
    }
});

// wishlist toggle
document.addEventListener('click', e => {
    if (e.target.matches('.wishlist, .wishlist *')) {
        const btn = e.target.closest('.wishlist');
        const icon = btn.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far'); icon.classList.add('fas','text-red-500');
        } else {
            icon.classList.remove('fas','text-red-500'); icon.classList.add('far');
        }
    }
});

// header hide on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const topHeader = document.getElementById('topHeader');
    if (!topHeader) return;
    const current = window.pageYOffset;
    if (current > lastScroll) {
        topHeader.classList.add('-translate-y-full');
    } else {
        topHeader.classList.remove('-translate-y-full');
    }
    lastScroll = current;
});

// quick view modal
(function(){
    const modal = document.createElement('div');
    modal.id = 'quickView';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-40';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden w-11/12 md:w-2/3 lg:w-1/2">
        <div class="p-4 flex justify-between items-center">
          <h2 id="qvTitle" class="text-xl font-bold"></h2>
          <button id="qvClose" class="text-gray-600 dark:text-gray-200">&times;</button>
        </div>
        <div class="p-4" id="qvContent"></div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#qvClose').addEventListener('click', () => modal.classList.add('hidden'));
    document.addEventListener('click', e => {
        const trigger = e.target.closest('.quick-view-trigger');
        if (trigger) {
            const id = trigger.dataset.id;
            const prod = window.products && window.products.find(p => p.id == id);
            if (prod) {
                document.getElementById('qvTitle').textContent = prod.name;
                document.getElementById('qvContent').innerHTML = `
                   <img src="${prod.image}" class="w-full" />
                   <p class="mt-2">Price: $${prod.price}</p>
                   <p class="mt-1">Category: ${prod.category}</p>
                   <button class="add-cart mt-4 bg-green-500 text-white px-4 py-2 rounded">Add to cart</button>
                `;
                modal.classList.remove('hidden');
            }
        }
    });
})();

// filter controls
(function(){
    const filterCategory = document.getElementById('categoryFilter');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const allCards = document.querySelectorAll('#productGrid .product-card');
    function applyFilters() {
        const cat = filterCategory.value;
        const maxPrice = parseFloat(priceRange.value);
        allCards.forEach(card => {
            const c = card.dataset.category;
            const p = parseFloat(card.dataset.price);
            let show = true;
            if (cat !== 'all' && c !== cat) show = false;
            if (p > maxPrice) show = false;
            card.style.display = show ? '' : 'none';
        });
    }
    if (filterCategory) filterCategory.addEventListener('change', () => { showSpinner(); setTimeout(()=>{applyFilters(); hideSpinner();},300); });
    if (priceRange) priceRange.addEventListener('input', () => { priceValue.textContent = '$' + priceRange.value; showSpinner(); setTimeout(()=>{applyFilters(); hideSpinner();},300); });
})();

// add spinner to links
document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (a && a.href && !a.href.startsWith('#')) { showSpinner(); }
});

// smooth initial load
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(()=>{ document.getElementById('skeletonGrid').classList.add('hidden'); document.getElementById('productGrid').classList.remove('hidden'); }, 800);
});
