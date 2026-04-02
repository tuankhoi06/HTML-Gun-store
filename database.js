const initAccounts = [
    { username: 'admin123', password: '12', role: 'admin', name: 'Admin', email: 'admin@gunstore.com', phone: '0999999999', status: 'active', joinDate: '2025-01-01T08:00:00.000Z' },
    { username: 'khach123', password: '12', role: 'customer', name: 'Khách VIP 1', email: 'khach123@gmail.com', phone: '0888888888', spent: 2150, status: 'active', joinDate: '2025-02-15T09:30:00.000Z' }
];

const productStorageKey = 'productCatalog';
const productSeedVersionKey = 'productSeedVersion';
// Đổi version sang v3 để hệ thống tự động xóa data cũ và nạp data mới có dấu
const productSeedVersion = 'dngear-product-seed-v3'; 
const productFallbackImage = 'product-fallback.svg';

// BỘ DỮ LIỆU MỚI: Đầy đủ dấu, chuẩn thông tin, bao quát mọi chỉ mục
const defaultProductSeed = [
    // --- NHÓM SÚNG NGẮN ---
    {
        id: 'PST01', name: 'Súng ngắn ổ xoay ZP-5', category: 'sungngan', subcategory: 'sungngan-xoay',
        price: 420, stock: 15, ammo: 'Đạn xốp Short Dart', mag: 'Ổ xoay 6 viên', acc: 'Vỏ kim loại, văng shell',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=ZP-5+Revolver',
        collection: 'Cổ điển', tagline: 'Phong cách revolver cổ điển, nạp shell từng viên.', salePercent: 0, featured: true, searchTags: ['revolver', 'ổ xoay']
    },
    {
        id: 'PST02', name: 'Glock 17 Gen 5', category: 'sungngan', subcategory: 'sungngan-banauto',
        price: 480, stock: 20, ammo: 'Gel ball 7-8mm', mag: 'Băng đạn 15 viên', acc: 'Khung polymer, khóa nòng nhôm',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Glock+17+Gen+5',
        collection: 'Bán chạy', tagline: 'Dòng súng ngắn quốc dân, dễ chơi dễ bảo dưỡng.', salePercent: 10, featured: true, searchTags: ['glock', 'bán tự động']
    },
    {
        id: 'PST03', name: 'Glock 18C Liên thanh', category: 'sungngan', subcategory: 'sungngan-auto',
        price: 520, stock: 12, ammo: 'Gel ball 7-8mm', mag: 'Băng dài 30 viên', acc: 'Chế độ Auto, pin Lipo',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Glock+18C+Auto',
        collection: 'Tốc độ cao', tagline: 'Chế độ xả đạn liên thanh cực rát, phù hợp càn quét.', salePercent: 0, featured: false, searchTags: ['glock 18', 'tự động', 'auto']
    },
    {
        id: 'PST04', name: 'Desert Eagle .50 Magnum', category: 'sungngan', subcategory: 'sungngan-magnum',
        price: 650, stock: 8, ammo: 'Đạn xốp Mega', mag: 'Băng đạn 7 viên', acc: 'Blowback giật mạnh',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Desert+Eagle',
        collection: 'Premium', tagline: 'Sức mạnh tuyệt đối, ngoại hình hầm hố cho góc trưng bày.', salePercent: 15, featured: true, searchTags: ['deagle', 'magnum', 'đại bàng sa mạc']
    },

    // --- NHÓM SÚNG TRƯỜNG & BẮN TỈA ---
    {
        id: 'RFL01', name: 'M4A1 Carbine Semi-Auto', category: 'sungtruong', subcategory: 'sungtruong-banauto',
        price: 850, stock: 10, ammo: 'Đạn xốp Elite', mag: 'Băng đạn 30 viên', acc: 'Ray Picatinny, báng rút',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=M4A1+Carbine',
        collection: 'Quân sự', tagline: 'Mẫu súng trường tiêu chuẩn, tương thích nhiều phụ kiện.', salePercent: 0, featured: false, searchTags: ['m4a1', 'carbine', 'bán tự động']
    },
    {
        id: 'RFL02', name: 'AK-47 Tactical Auto', category: 'sungtruong', subcategory: 'sungtruong-auto',
        price: 920, stock: 14, ammo: 'Gel ball 7-8mm', mag: 'Băng cong 35 viên', acc: 'Ốp tay M-LOK, báng gấp',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=AK-47+Tactical',
        collection: 'Huyền thoại', tagline: 'Phiên bản độ Tactical hiện đại của huyền thoại AK-47.', salePercent: 12, featured: true, searchTags: ['ak47', 'tactical', 'tự động']
    },
    {
        id: 'SNP01', name: 'AWM Sniper Rifle', category: 'sungtruong', subcategory: 'sungbantia',
        price: 1150, stock: 5, ammo: 'Đạn xốp + Shell eject', mag: 'Băng đạn 5 viên', acc: 'Ống ngắm 8x, chân chống bipod',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=AWM+Sniper',
        collection: 'Bắn tỉa', tagline: 'Trải nghiệm lên đạn bolt-action và văng shell cực chân thực.', salePercent: 20, featured: true, searchTags: ['awm', 'sniper', 'bắn tỉa']
    },

    // --- NHÓM SHOTGUN & TIỂU LIÊN ---
    {
        id: 'SHT01', name: 'Remington M870 Pump-Action', category: 'shotgun', subcategory: 'shotgun',
        price: 680, stock: 9, ammo: 'Đạn xốp loại to', mag: 'Nạp ống 5 shell', acc: 'Lên đạn cơ học, văng vỏ',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=M870+Shotgun',
        collection: 'Cận chiến', tagline: 'Tiếng lên đạn rắc rắc cực đã tai, phù hợp cận chiến.', salePercent: 0, featured: true, searchTags: ['m870', 'shotgun', 'pump']
    },
    {
        id: 'SMG01', name: 'MP5 Tactical CQB', category: 'smg', subcategory: 'smg-banauto',
        price: 750, stock: 11, ammo: 'Gel ball 7-8mm', mag: 'Băng đạn 25 viên', acc: 'Đèn pin tích hợp, báng trượt',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=MP5+Tactical',
        collection: 'Đột kích', tagline: 'Nhỏ gọn, độ chính xác cao cho các không gian hẹp.', salePercent: 0, featured: false, searchTags: ['mp5', 'cqb', 'smg']
    },
    {
        id: 'SMG02', name: 'Vector Kriss V2 Liên thanh', category: 'smg', subcategory: 'smg-auto',
        price: 890, stock: 7, ammo: 'Gel ball 7-8mm', mag: 'Băng đạn 30 viên', acc: 'Cơ chế xả đạn nhanh, giảm thanh giả',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Vector+Kriss',
        collection: 'Công nghệ', tagline: 'Thiết kế tương lai, tốc độ nhả đạn kinh hoàng.', salePercent: 15, featured: true, searchTags: ['vector', 'kriss', 'auto']
    },

    // --- NHÓM HẠNG NẶNG ---
    {
        id: 'HMG01', name: 'Súng máy hạng nhẹ M249', category: 'hangnang', subcategory: 'sungmay-nhe',
        price: 1450, stock: 4, ammo: 'Gel ball 7-8mm', mag: 'Hộp đạn tròn 1000 viên', acc: 'Chân chống, dây đeo chịu lực',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=M249+SAW',
        collection: 'Hỏa lực', tagline: 'Duy trì hỏa lực đàn áp cực mạnh cho đội hình.', salePercent: 0, featured: false, searchTags: ['m249', 'súng máy', 'lmg']
    },
    {
        id: 'HMG02', name: 'Súng máy hạng trung M60', category: 'hangnang', subcategory: 'sungmay-trung',
        price: 1600, stock: 3, ammo: 'Đạn xốp chuỗi', mag: 'Dây tiếp đạn 50 viên', acc: 'Mô phỏng dây đạn chạy liên tục',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=M60+Machine+Gun',
        collection: 'Hỏa lực', tagline: 'Cỗ máy cày nát mọi rào cản trong trận giả chiến.', salePercent: 0, featured: false, searchTags: ['m60', 'súng máy', 'mmg']
    },
    {
        id: 'HMG03', name: 'Browning M2 Heavy', category: 'hangnang', subcategory: 'sungmay-nang',
        price: 2200, stock: 2, ammo: 'Đạn xốp cỡ đại', mag: 'Hộp đạn 30 viên', acc: 'Giá đỡ ba chân, tay cầm đôi',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Browning+M2',
        collection: 'Phòng thủ', tagline: 'Vũ khí cố định bảo vệ cứ điểm tuyệt đối.', salePercent: 5, featured: true, searchTags: ['m2 browning', 'súng máy hạng nặng']
    },
    {
        id: 'HMG04', name: 'Súng máy đa chức năng PKM', category: 'hangnang', subcategory: 'sungmay-danang',
        price: 1750, stock: 3, ammo: 'Gel ball 7-8mm', mag: 'Hộp đạn thép 800 viên', acc: 'Báng gỗ mô phỏng, nòng dài',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=PKM+Machine+Gun',
        collection: 'Hỏa lực', tagline: 'Dòng súng máy danh tiếng với độ bền bỉ cao.', salePercent: 0, featured: false, searchTags: ['pkm', 'đa chức năng']
    },
    {
        id: 'HWP01', name: 'Súng phun lửa M2 Replica', category: 'hangnang', subcategory: 'phunlua',
        price: 850, stock: 5, ammo: 'Nước (phun sương tạo khói)', mag: 'Bình chứa sau lưng', acc: 'Đèn LED tạo hiệu ứng lửa',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=M2+Flamethrower',
        collection: 'Độc lạ', tagline: 'Tạo khói sương mô phỏng lửa an toàn tuyệt đối.', salePercent: 10, featured: false, searchTags: ['phun lửa', 'flamethrower']
    },
    {
        id: 'HWP02', name: 'Súng không giật Carl Gustaf', category: 'hangnang', subcategory: 'khonggiat',
        price: 950, stock: 4, ammo: 'Đầu đạn xốp cỡ lớn', mag: 'Nạp từng quả', acc: 'Ống ngắm quang học mô phỏng',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Carl+Gustaf',
        collection: 'Chống tăng', tagline: 'Khai hỏa cực êm, đường đạn bay thẳng tắp.', salePercent: 0, featured: false, searchTags: ['carl gustaf', 'không giật']
    },
    {
        id: 'HWP03', name: 'Súng phóng tên lửa RPG-7', category: 'hangnang', subcategory: 'phongtenlua',
        price: 1100, stock: 6, ammo: 'Tên lửa xốp an toàn', mag: 'Nạp từ đầu nòng', acc: 'Âm thanh khai hỏa giả lập',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=RPG-7+Launcher',
        collection: 'Chống tăng', tagline: 'Đậm chất biểu tượng, quả rocket xốp an toàn.', salePercent: 0, featured: true, searchTags: ['rpg7', 'phóng tên lửa', 'bazooka']
    },
    {
        id: 'HWP04', name: 'Súng phóng lựu M320', category: 'hangnang', subcategory: 'phongluu',
        price: 550, stock: 8, ammo: 'Lựu đạn xốp 40mm', mag: 'Nạp từng quả', acc: 'Gắn kèm ray súng trường hoặc bắn độc lập',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=M320+Grenade',
        collection: 'Hỗ trợ', tagline: 'Phá vỡ góc nấp của đối phương bằng đạn nổ diện rộng.', salePercent: 0, featured: false, searchTags: ['m320', 'phóng lựu']
    },
    {
        id: 'HWP05', name: 'Mô hình Pháo M777', category: 'hangnang', subcategory: 'phao',
        price: 3500, stock: 1, ammo: 'Đạn xốp pháo binh', mag: 'Nạp thủ công', acc: 'Bánh xe di chuyển, thước ngắm cơ',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=M777+Howitzer',
        collection: 'Trưng bày lớn', tagline: 'Mô hình tỷ lệ lớn, phù hợp decor sân bãi.', salePercent: 0, featured: false, searchTags: ['m777', 'pháo', 'howitzer']
    },

    // --- NHÓM ĐẠN DƯỢC, TỰ VỆ, PHỤ KIỆN ---
    {
        id: 'AMO01', name: 'Hộp Đạn Xốp Soft Bullet', category: 'danduoc', subcategory: 'danduoc',
        price: 45, stock: 150, ammo: 'Đạn xốp đầu hít / đầu mềm', mag: '-', acc: 'Hộp nhựa 100 viên',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Soft+Bullet+100',
        collection: 'Tiêu hao', tagline: 'Tương thích hầu hết các súng Nerf và đồ chơi đạn xốp.', salePercent: 5, featured: false, searchTags: ['đạn xốp', 'soft bullet']
    },
    {
        id: 'DEF01', name: 'Áo giáp chiến thuật Tactical', category: 'phongve', subcategory: 'phongve',
        price: 250, stock: 35, ammo: '-', mag: '-', acc: 'Nhiều túi đựng đạn, chống va đập xốp',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Tactical+Vest',
        collection: 'Bảo hộ', tagline: 'Bảo vệ cơ thể và tăng vẻ ngầu khi ra sân.', salePercent: 0, featured: false, searchTags: ['áo giáp', 'tactical vest', 'đồ tự vệ']
    },
    {
        id: 'ACC01', name: 'Ống ngắm Red Dot Sight', category: 'phukien', subcategory: 'phukien',
        price: 180, stock: 40, ammo: '-', mag: '-', acc: 'Gắn ray 20mm tiêu chuẩn',
        img: 'https://via.placeholder.com/420x320/e2e8f0/0f172a?text=Red+Dot+Sight',
        collection: 'Nâng cấp', tagline: 'Hỗ trợ ngắm bắn mục tiêu nhanh và chuẩn xác.', salePercent: 10, featured: false, searchTags: ['red dot', 'ống ngắm', 'phụ kiện']
    }
];

let currentSelectedProduct = null;
let dbProducts = [];

function normalizeSearchTags(value) {
    if (Array.isArray(value)) {
        return value.map(item => String(item || '').trim().toLowerCase()).filter(Boolean);
    }
    if (typeof value === 'string') {
        return value.split(',').map(item => item.trim().toLowerCase()).filter(Boolean);
    }
    return [];
}

function normalizeProduct(product, fallback = {}) {
    const merged = { ...fallback, ...product };
    const price = Number(merged.price);
    const stock = Number(merged.stock);
    const salePercent = Number(merged.salePercent);

    return {
        id: String(merged.id || '').trim().toUpperCase(),
        name: String(merged.name || 'Sản phẩm mới').trim(),
        category: String(merged.category || 'phukien').trim().toLowerCase(),
        subcategory: String(merged.subcategory || merged.category || 'phukien').trim().toLowerCase(),
        price: Number.isFinite(price) ? Math.max(0, Math.round(price)) : 0,
        stock: Number.isFinite(stock) ? Math.max(0, Math.round(stock)) : 0,
        ammo: String(merged.ammo || '').trim(),
        mag: String(merged.mag || '').trim(),
        acc: String(merged.acc || '').trim(),
        img: String(merged.img || productFallbackImage).trim() || productFallbackImage,
        collection: String(merged.collection || 'Hàng mới về').trim(),
        tagline: String(merged.tagline || 'Sản phẩm đang được cập nhật thông tin.').trim(),
        salePercent: Number.isFinite(salePercent) ? Math.max(0, Math.min(95, Math.round(salePercent))) : 0,
        featured: Boolean(merged.featured),
        searchTags: normalizeSearchTags(merged.searchTags),
        createdAt: merged.createdAt || new Date().toISOString()
    };
}

function sanitizeStoredProducts(products) {
    return (Array.isArray(products) ? products : [])
        .map(item => normalizeProduct(item))
        .filter(item => item.id);
}

function hydrateProductCatalog() {
    let storedProducts = sanitizeStoredProducts(JSON.parse(localStorage.getItem(productStorageKey)) || []);
    const seededProducts = defaultProductSeed.map(item => normalizeProduct(item, item));

    // Thuật toán "Xóa đi làm lại": Nếu rỗng hoặc khác version, ta ép lấy thẳng bộ Seed mới để làm sạch rác
    if (storedProducts.length === 0 || localStorage.getItem(productSeedVersionKey) !== productSeedVersion) {
        storedProducts = seededProducts;
        localStorage.setItem(productSeedVersionKey, productSeedVersion);
    }

    // Sắp xếp ưu tiên hàng nổi bật lên đầu, sau đó theo tên A-Z
    const nextProducts = storedProducts.sort((left, right) => {
        const featuredDelta = Number(Boolean(right.featured)) - Number(Boolean(left.featured));
        if (featuredDelta !== 0) return featuredDelta;
        return left.name.localeCompare(right.name, 'vi');
    });

    dbProducts.splice(0, dbProducts.length, ...nextProducts);
    localStorage.setItem(productStorageKey, JSON.stringify(dbProducts));
}

function persistProducts(nextProducts = dbProducts) {
    const normalizedProducts = sanitizeStoredProducts(nextProducts);
    dbProducts.splice(0, dbProducts.length, ...normalizedProducts);
    localStorage.setItem(productStorageKey, JSON.stringify(dbProducts));
    return dbProducts;
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch (error) {
        return null;
    }
}

function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function getCurrentUserCartKey() {
    const currentUser = getCurrentUser();
    if (!currentUser) return 'cart:guest';
    return `cart:${currentUser.email || currentUser.username || currentUser.name || 'guest'}`;
}

function initAccountsData() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (!Array.isArray(users) || users.length === 0) {
        users = [...initAccounts];
    } else {
        initAccounts.forEach(seedAccount => {
            const existingIndex = users.findIndex(user => user.username === seedAccount.username || user.email === seedAccount.email);
            if (existingIndex > -1) {
                users[existingIndex] = {
                    ...users[existingIndex],
                    ...seedAccount
                };
            } else {
                users.push(seedAccount);
            }
        });
    }
    localStorage.setItem('users', JSON.stringify(users));
}

function initApp() {
    initAccountsData();
    hydrateProductCatalog();
}

window.persistProducts = persistProducts;
window.getCurrentUser = getCurrentUser;
window.saveCurrentUser = saveCurrentUser;
window.getCurrentUserCartKey = getCurrentUserCartKey;
window.productFallbackImage = productFallbackImage;
window.findProductById = function(id) {
    return dbProducts.find(product => product.id === id) || null;
};

initApp();

function normalizeProduct(product, fallback = {}) {
    const merged = { ...fallback, ...product };
    const price = Number(merged.price);
    const stock = Number(merged.stock);
    const salePercent = Number(merged.salePercent);

    return {
        id: String(merged.id || '').trim().toUpperCase(),
        name: String(merged.name || 'Sản phẩm mới').trim(),
        category: String(merged.category || 'phukien').trim().toLowerCase(),
        subcategory: String(merged.subcategory || merged.category || 'phukien').trim().toLowerCase(),
        price: Number.isFinite(price) ? Math.max(0, Math.round(price)) : 0,
        stock: Number.isFinite(stock) ? Math.max(0, Math.round(stock)) : 0,
        ammo: String(merged.ammo || '').trim(),
        mag: String(merged.mag || '').trim(),
        acc: String(merged.acc || '').trim(),
        img: String(merged.img || productFallbackImage).trim() || productFallbackImage,
        collection: String(merged.collection || 'Hàng mới về').trim(),
        tagline: String(merged.tagline || 'Sản phẩm đang được cập nhật thông tin.').trim(),
        salePercent: Number.isFinite(salePercent) ? Math.max(0, Math.min(95, Math.round(salePercent))) : 0,
        featured: Boolean(merged.featured),
        supplierId: String(merged.supplierId || '').trim(), // ĐÃ BỔ SUNG TRƯỜNG NÀY ĐỂ KHÔNG BỊ MẤT DỮ LIỆU
        searchTags: normalizeSearchTags(merged.searchTags),
        createdAt: merged.createdAt || new Date().toISOString()
    };
}