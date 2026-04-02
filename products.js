let currentStoreCategory = 'all';
let currentStoreSort = 'featured';
let currentStoreSearch = '';

const storeCategoryMeta = {
    all: { label: 'Tất cả danh mục', desc: 'Catalog được sắp theo kiểu storefront để dễ lướt và dễ chốt đơn.' },
    sungngan: { label: 'Súng ngắn', desc: 'Dòng sidearm gọn, lên tay nhanh và dễ tư vấn cho người mới.' },
    shotgun: { label: 'Shotgun', desc: 'Các mẫu pump và shell eject cho trải nghiệm close-range.' },
    sungtruong: { label: 'Súng trường', desc: 'Rifle, carbine và các mẫu dài nòng cho build đẹp.' },
    smg: { label: 'SMG', desc: 'Dáng compact, cơ động và phù hợp field nhỏ.' },
    hangnang: { label: 'Vũ khí hạng nặng', desc: 'Pháo, súng máy và hệ thống hỏa lực cao.' }, // ĐÃ THÊM HẠNG NẶNG
    danduoc: { label: 'Đạn dược', desc: 'Đạn, shell và các gói refill để đẩy AOV.' },
    phongve: { label: 'Đồ phòng vệ', desc: 'Bảo hộ cần thiết để chơi an toàn và chuyên nghiệp hơn.' },
    phukien: { label: 'Phụ kiện', desc: 'Optic, đèn, pin và đồ mod để nâng cấp setup.' },
    'sungngan-xoay': { label: 'Súng ngắn ổ xoay', desc: 'Nhóm revolver cho vibe trưng bày và shell vui tay.' },
    'sungngan-banauto': { label: 'Súng ngắn bán tự động', desc: 'Dòng sidearm cân bằng giữa dễ chơi và dễ vận hành.' },
    'sungngan-auto': { label: 'Súng ngắn tự động', desc: 'Nhóm pistol bắn nhanh cho người thích cảm giác liên thanh.' },
    'sungngan-magnum': { label: 'Súng ngắn Magnum', desc: 'Mẫu premium, form lớn và rất ăn hình trong ảnh chụp.' },
    'sungtruong-banauto': { label: 'Súng trường bán tự động', desc: 'Nhóm rifle cân bằng giữa độ ổn định và độ dễ chơi.' },
    'sungtruong-auto': { label: 'Súng trường tự động', desc: 'Những mẫu rifle bắn nhanh, rất hợp cho field group.' },
    'smg-banauto': { label: 'Tiểu liên bán tự động', desc: 'SMG dễ kiểm soát, hợp cho CQB và indoor field.' },
    'smg-auto': { label: 'Tiểu liên tự động', desc: 'SMG tốc độ cao, gọn nhẹ và tạo nhiều chuyển động.' }
};

const storeCategoryGroups = {
    all: ['all'],
    sungngan: ['sungngan', 'sungngan-xoay', 'sungngan-banauto', 'sungngan-auto', 'sungngan-magnum'],
    shotgun: ['shotgun'],
    sungtruong: ['sungtruong', 'sungtruong-banauto', 'sungtruong-auto', 'sungbantia'], // ĐÃ BỔ SUNG SÚNG BẮN TỈA
    smg: ['smg', 'smg-banauto', 'smg-auto'],
    hangnang: ['hangnang', 'sungmay-nhe', 'sungmay-trung', 'sungmay-nang', 'sungmay-danang', 'phunlua', 'khonggiat', 'phongtenlua', 'phongluu', 'phao'], // ĐÃ BỔ SUNG ĐẦY ĐỦ NHÁNH HẠNG NẶNG
    danduoc: ['danduoc'],
    phongve: ['phongve'],
    phukien: ['phukien']
};

function getStoreCategoryMeta(category) {
    return storeCategoryMeta[category] || storeCategoryMeta.all;
}

function getCurrentUserRole() {
    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    return currentUser ? currentUser.role : 'guest';
}

function formatStorePrice(value) {
    return `${Number(value || 0).toLocaleString('vi-VN')}$`;
}

function getStockPresentation(stock) {
    if (stock <= 0) return { label: 'Het hang', className: 'out' };
    if (stock < 5) return { label: `Con ${stock}`, className: 'low' };
    return { label: 'San kho', className: 'ready' };
}

function getCategoryKeys(category) {
    if (storeCategoryGroups[category]) return storeCategoryGroups[category];
    return [category];
}

function matchesStoreCategory(product, category) {
    if (category === 'all') return true;

    const categoryKeys = getCategoryKeys(category);
    return categoryKeys.includes(product.category) || categoryKeys.includes(product.subcategory);
}

function buildProductSearchText(product) {
    const categoryMeta = getStoreCategoryMeta(product.subcategory || product.category);
    return [
        product.id,
        product.name,
        product.collection,
        product.tagline,
        product.ammo,
        product.mag,
        product.acc,
        categoryMeta.label,
        ...(product.searchTags || [])
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
}

function matchesStoreSearch(product, keyword) {
    if (!keyword) return true;
    return buildProductSearchText(product).includes(keyword);
}

function sortStoreProducts(products) {
    const sorted = [...products];

    if (currentStoreSort === 'price-asc') {
        return sorted.sort((left, right) => left.price - right.price || left.name.localeCompare(right.name, 'vi'));
    }

    if (currentStoreSort === 'price-desc') {
        return sorted.sort((left, right) => right.price - left.price || left.name.localeCompare(right.name, 'vi'));
    }

    if (currentStoreSort === 'sale') {
        return sorted.sort((left, right) => (right.salePercent || 0) - (left.salePercent || 0) || right.price - left.price);
    }

    if (currentStoreSort === 'stock') {
        return sorted.sort((left, right) => right.stock - left.stock || left.name.localeCompare(right.name, 'vi'));
    }

    return sorted.sort((left, right) => {
        const featuredDelta = Number(Boolean(right.featured)) - Number(Boolean(left.featured));
        if (featuredDelta !== 0) return featuredDelta;

        const saleDelta = (right.salePercent || 0) - (left.salePercent || 0);
        if (saleDelta !== 0) return saleDelta;

        return left.name.localeCompare(right.name, 'vi');
    });
}

function syncDropdownSelectedText() {
    const textEl = document.getElementById('dropdownSelectedText');
    if (!textEl) return;

    textEl.innerText = getStoreCategoryMeta(currentStoreCategory).label;
}

function updateCatalogResultCopy(totalItems) {
    const countEl = document.getElementById('storeCatalogResultCount');
    if (!countEl) return;

    const categoryMeta = getStoreCategoryMeta(currentStoreCategory);
    const prefix = currentStoreSearch ? `Tìm thấy ${totalItems}` : `Đang hiển thị ${totalItems}`;
    countEl.innerText = `${prefix} sản phẩm trong nhóm ${categoryMeta.label.toLowerCase()}.`;
}

function buildCatalogEmptyState() {
    const categoryMeta = getStoreCategoryMeta(currentStoreCategory);
    const searchNote = currentStoreSearch
        ? `<p class="shop-empty-copy">Không có kết quả cho từ khóa "${currentStoreSearch}" trong nhóm ${categoryMeta.label.toLowerCase()}.</p>`
        : `<p class="shop-empty-copy">Nhóm ${categoryMeta.label.toLowerCase()} chưa có sản phẩm sẵn sàng lên kệ.</p>`;

    return `
        <div class="shop-empty-state">
            <strong>Kho chưa có kết quả phù hợp</strong>
            ${searchNote}
            <div class="shop-empty-actions">
                <button class="tactical-btn shop-primary-btn compact" onclick="focusStoreCategory('all')">Xem toàn bộ catalog</button>
                <button class="tactical-btn tactical-btn-secondary compact" onclick="searchProducts('')">Xóa tìm kiếm</button>
            </div>
        </div>
    `;
}

function buildStoreProductCard(product, options = {}) {
    const salePercent = Number(options.salePercent ?? product.salePercent ?? 0) || 0;
    const displayPrice = salePercent > 0 ? Math.round(product.price * (100 - salePercent) / 100) : product.price;

    return `
        <article class="store-product-card product-card fade-in-tactical">
            <div class="store-product-media" style="margin-top: 10px;">
                <img src="${product.img}" alt="${product.name}" onerror="this.onerror=null;this.src='${window.productFallbackImage || 'product-fallback.svg'}';">
            </div>
            <h3 class="store-product-title">${product.name}</h3>
            
            <div class="store-price-row">
                <span class="store-price-current">
                    <span style="color: rgb(30, 41, 59); font-size: 16px; font-weight: bold; margin-right: 4px;">Giá:</span><span style="color: rgb(239, 68, 68);">${formatStorePrice(displayPrice)}</span>
                </span>
            </div>
            
            <div class="store-card-actions">
                <button class="tactical-btn" style="background: rgb(0, 110, 255); color: rgb(255, 255, 255); width: 100%; border-radius: 12px; font-size: 14px; font-weight: bold; letter-spacing: 1px;" onclick="showDetail('${product.id}')">CHI TIẾT</button>
            </div>
        </article>
    `;
}

window.createStoreProductCard = buildStoreProductCard;

window.focusStoreCategory = function(category) {
    currentStoreCategory = category || 'all';
    syncDropdownSelectedText();
    renderProducts(currentStoreCategory);

    const section = document.getElementById('storeProductCatalog');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

window.scrollStoreSection = function(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

window.renderSaleProducts = function() {
    const container = document.getElementById('saleProductsGrid');
    if (!container) return;

    const saleProducts = [...dbProducts]
        .filter(product => (product.salePercent || 0) > 0)
        .sort((left, right) => (right.salePercent || 0) - (left.salePercent || 0) || right.price - left.price)
        .slice(0, 4);

    const displayProducts = saleProducts.length > 0
        ? saleProducts
        : [...dbProducts].sort((left, right) => right.price - left.price).slice(0, 4);

    if (displayProducts.length === 0) {
        container.innerHTML = '<div class="shop-empty-state compact"><strong>Chưa có deal để hiển thị.</strong></div>';
        return;
    }

    container.innerHTML = displayProducts.map(product => buildStoreProductCard(product, { salePercent: product.salePercent || 10 })).join('');
};

window.renderStorePromoStrip = function() {
    const container = document.getElementById('storePromoStrip');
    if (!container) return;

    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const issuedVouchers = (JSON.parse(localStorage.getItem('issuedVoucherData')) || [])
        .filter(voucher => currentUser && voucher.email === currentUser.email)
        .slice(0, 1)
        .map(voucher => ({
            code: voucher.code,
            valueLabel: voucher.valueLabel,
            condition: `${voucher.title} · ${voucher.condition}`
        }));
    const promotions = (JSON.parse(localStorage.getItem('promotionData')) || [])
        .filter(promotion => promotion.status === 'Đang áp dụng' || promotion.status === 'Đang áp dụng')
        .slice(0, Math.max(0, 3 - issuedVouchers.length));
    const displayPromotions = [...issuedVouchers, ...promotions];

    if (displayPromotions.length === 0) {
        container.innerHTML = `
            <div class="shop-promo-card">
                <small>ưu đãi sẵn có</small>
                <strong>Catalog đã sẵn sàng</strong>
                <span>Admin có thể bật thêm các mã khuyến mãi để đẩy tỷ lệ chốt đơn trong giờ cao điểm.</span>
            </div>
        `;
        return;
    }

    container.innerHTML = displayPromotions.map(promotion => `
        <article class="shop-promo-card">
            <small>${promotion.code}</small>
            <strong>${promotion.valueLabel}</strong>
            <span>${promotion.condition}</span>
        </article>
    `).join('');
};

window.renderStoreInsights = function() {
    const totalEl = document.getElementById('storeTotalCatalogCount');
    const dealEl = document.getElementById('storeHotDealCount');
    const cartEl = document.getElementById('storeCartCount');
    const pendingEl = document.getElementById('storePendingOrderCount');
    const cartNavEl = document.getElementById('cartNavCount');
    const pendingNavEl = document.getElementById('orderPendingCount');

    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const cartItems = Array.isArray(window.currentCart) ? window.currentCart : [];
    const dealCount = dbProducts.filter(product => (product.salePercent || 0) > 0).length;
    let pendingCount = 0;

    if (currentUser) {
        const transactionSource = typeof getTransactionData === 'function'
            ? getTransactionData()
            : (JSON.parse(localStorage.getItem('transactionData')) || []);

        pendingCount = transactionSource.filter(order => {
            const sameEmail = currentUser.email && order.customerEmail === currentUser.email;
            const sameName = order.customerName === currentUser.name;
            return (sameEmail || sameName) && order.status === 'Chờ duyệt';
        }).length;
    }

    if (totalEl) totalEl.innerText = dbProducts.length;
    if (dealEl) dealEl.innerText = dealCount;
    if (cartEl) cartEl.innerText = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    if (pendingEl) pendingEl.innerText = pendingCount;
    if (cartNavEl) cartNavEl.innerText = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    if (pendingNavEl) pendingNavEl.innerText = pendingCount;
}

function searchProducts(keyword) {
    currentStoreSearch = String(keyword || '').trim().toLowerCase();
    const input = document.getElementById('storeSearchInput');
    if (input && input.value !== String(keyword || '')) {
        input.value = String(keyword || '');
    }
    renderProducts(currentStoreCategory);
}

window.searchProducts = searchProducts;

function renderProducts(category = currentStoreCategory) {
    currentStoreCategory = category || 'all';

    const container = document.querySelector('.display-products');
    if (!container) return;

    syncDropdownSelectedText();

    const keyword = currentStoreSearch.trim().toLowerCase();
    const filteredProducts = sortStoreProducts(
        dbProducts.filter(product => matchesStoreCategory(product, currentStoreCategory) && matchesStoreSearch(product, keyword))
    );

    updateCatalogResultCopy(filteredProducts.length);

    if (filteredProducts.length === 0) {
        container.innerHTML = buildCatalogEmptyState();
        return;
    }

    container.innerHTML = filteredProducts.map(product => buildStoreProductCard(product)).join('');
}

window.renderProducts = renderProducts;

function showDetail(id) {
    const product = dbProducts.find(item => item.id === id);
    if (!product) return;

    currentSelectedProduct = product;

    const modalName = document.getElementById('mdlName');
    const modalTagline = document.getElementById('mdlTagline');
    const modalImg = document.getElementById('mdlImg');
    const modalPrice = document.getElementById('mdlPrice');

    if (modalName) modalName.innerText = product.name;
    if (modalTagline) modalTagline.innerText = product.tagline || getStoreCategoryMeta(product.category).desc;
    if (modalImg) {
        modalImg.src = product.img;
        modalImg.onerror = function() {
            this.onerror = null;
            this.src = window.productFallbackImage || 'product-fallback.svg';
        };
    }
    
    // CẬP NHẬT CHỮ GIÁ MÀU ĐEN - TIỀN MÀU ĐỎ
    if (modalPrice) {
        const salePercent = product.salePercent || 0;
        const finalPrice = salePercent > 0 ? Math.round(product.price * (100 - salePercent) / 100) : product.price;
        
        const priceMarkup = salePercent > 0
            ? `<span style="color: rgb(30, 41, 59); font-size: 20px; font-weight: bold; margin-right: 8px;">Giá:</span><span style="color: rgb(239, 68, 68);">${formatStorePrice(finalPrice)}</span> <span class="store-modal-old-price">${formatStorePrice(product.price)}</span>`
            : `<span style="color: rgb(30, 41, 59); font-size: 20px; font-weight: bold; margin-right: 8px;">Giá:</span><span style="color: rgb(239, 68, 68);">${formatStorePrice(finalPrice)}</span>`;
        modalPrice.innerHTML = priceMarkup;
    }

    const stockEl = document.getElementById('mdlStock');
    if (stockEl) {
        stockEl.innerText = product.stock > 0 ? `${product.stock} sản phẩm` : 'Hết hàng';
        stockEl.style.color = product.stock > 0 ? 'var(--text-dark)' : 'var(--danger)';
    }

    const rowMag = document.getElementById('rowMdlMag');
    const rowAmmo = document.getElementById('rowMdlAmmo');
    const rowAcc = document.getElementById('rowMdlAcc');
    const lblAcc = document.getElementById('lblMdlAcc');
    const valMag = document.getElementById('mdlMag');
    const valAmmo = document.getElementById('mdlAmmo');
    const valAcc = document.getElementById('mdlAcc');

    if (rowMag) rowMag.style.display = 'none';
    if (rowAmmo) rowAmmo.style.display = 'none';
    if (rowAcc) rowAcc.style.display = 'none';

    if (['sungngan', 'shotgun', 'sungtruong', 'smg', 'hangnang'].includes(product.category)) {
        if (rowMag) rowMag.style.display = 'flex';
        if (rowAmmo) rowAmmo.style.display = 'flex';
        if (rowAcc) rowAcc.style.display = 'flex';
        if (lblAcc) lblAcc.innerText = 'Phụ kiện:';
        if (valMag) valMag.innerText = product.mag || '-';
        if (valAmmo) valAmmo.innerText = product.ammo || '-';
        if (valAcc) valAcc.innerText = product.acc || 'Không có';
    } else if (product.category === 'danduoc') {
        if (rowAmmo) rowAmmo.style.display = 'flex';
        if (valAmmo) valAmmo.innerText = product.ammo || '-';
    } else if (product.category === 'phukien') {
        if (rowAcc) rowAcc.style.display = 'flex';
        if (lblAcc) lblAcc.innerText = 'Tương thích với:';
        if (valAcc) valAcc.innerText = product.acc || 'Gắn được nhiều dòng';
    } else {
        if (rowAcc) rowAcc.style.display = 'flex';
        if (lblAcc) lblAcc.innerText = 'Thông số:';
        if (valAcc) valAcc.innerText = product.acc || '-';
    }

    const qtyInput = document.getElementById('buyQty');
    if (qtyInput) qtyInput.value = 1;

    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const customerActions = document.getElementById('mdlCustomerActions');
    const adminActions = document.getElementById('mdlAdminActions');

    if (currentUser && currentUser.role === 'customer') {
        if (customerActions) customerActions.classList.remove('hide-menu');
        if (adminActions) adminActions.classList.add('hide-menu');
    } else {
        if (customerActions) customerActions.classList.add('hide-menu');
        if (adminActions) {
            adminActions.classList.remove('hide-menu');
            if (typeof updateTopSellingButtonUI === 'function') {
                updateTopSellingButtonUI(product.id);
            }
        }
    }

    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.remove('hide-menu');
}

window.showDetail = showDetail;

function closeModal() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.add('hide-menu');
    currentSelectedProduct = null;
}

window.closeModal = closeModal;

function changeQty(amount) {
    const qtyInput = document.getElementById('buyQty');
    if (!qtyInput || !currentSelectedProduct) return;

    const currentQty = Number(qtyInput.value) || 1;
    const nextQty = Math.min(Math.max(currentQty + amount, 1), currentSelectedProduct.stock || 1);

    if (nextQty === currentQty && amount > 0) {
        showToast('Đã đạt giới hạn tồn kho của sản phẩm này!');
        return;
    }

    qtyInput.value = nextQty;
}

window.changeQty = changeQty;

function toggleDropdown() {
    const menu = document.getElementById('dropdownMenu');
    if (menu) menu.classList.toggle('show');
}

window.toggleDropdown = toggleDropdown;

window.addEventListener('click', event => {
    const dropdown = document.getElementById('customCategoryDropdown');
    const menu = document.getElementById('dropdownMenu');
    if (dropdown && !dropdown.contains(event.target) && menu) {
        menu.classList.remove('show');
    }
});

function selectCategory(categoryValue, displayText, event) {
    if (event) {
        event.stopPropagation();
    }

    currentStoreCategory = categoryValue;
    const textEl = document.getElementById('dropdownSelectedText');
    if (textEl) {
        textEl.innerText = displayText;
    }

    const menu = document.getElementById('dropdownMenu');
    if (menu) {
        menu.classList.remove('show');
    }

    renderProducts(currentStoreCategory);
}

window.selectCategory = selectCategory;