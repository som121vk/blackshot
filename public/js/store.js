/**
 * Blackshot Toy Store - Central Data Store
 * Handles all interactions with localStorage
 */

const PRODUCTS_KEY = 'blackshot_products';
const REVIEWS_KEY = 'blackshot_reviews';

const DEFAULT_PRODUCTS = [
    {
        id: 1700000000001,
        name: "Speedster Racing Car",
        description: "High-speed remote control car with durable tires and rechargeable battery.",
        price: 1499,
        oldPrice: 1999,
        category: "Remote Control",
        image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=800&auto=format&fit=crop",
        specifications: ["Material: Plastic", "Battery: 1200mAh", "Speed: 15km/h"]
    },
    {
        id: 1700000000002,
        name: "Cuddly Brown Bear",
        description: "Ultra-soft plush toy perfect for hugging. Safe for all ages.",
        price: 899,
        oldPrice: 1299,
        category: "Soft Toys",
        image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?q=80&w=800&auto=format&fit=crop",
        specifications: ["Size: 40cm", "Material: Cotton", "Washable: Yes"]
    },
    {
        id: 1700000000003,
        name: "Mega Building Blocks",
        description: "500-piece building set to unleash creativity. Compatible with major brands.",
        price: 2499,
        oldPrice: 3499,
        category: "Educational",
        image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop",
        specifications: ["Pieces: 500", "Material: ABS", "Age: 5+"]
    },
    {
        id: 1700000000004,
        name: "Superhero Action Figure",
        description: "Poseable action figure with accessories. A must-have for collectors.",
        price: 799,
        oldPrice: 999,
        category: "Action Figures",
        image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=800&auto=format&fit=crop",
        specifications: ["Height: 15cm", "Points of Articulation: 10", "Material: PVC"]
    }
];

const Store = {
    init() {
        if (!localStorage.getItem(PRODUCTS_KEY)) {
            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
        }
        if (!localStorage.getItem(REVIEWS_KEY)) {
            localStorage.setItem(REVIEWS_KEY, JSON.stringify([]));
        }
    },

    // --- Products ---
    getProducts() {
        return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    },

    getProduct(id) {
        const products = this.getProducts();
        return products.find(p => p.id == id);
    },

    addProduct(product) {
        const products = this.getProducts();
        const newProduct = {
            id: Date.now(),
            ...product
        };
        products.push(newProduct);
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
        return newProduct;
    },

    updateProduct(id, updatedData) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedData };
            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
            return products[index];
        }
        return null;
    },

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id != id);
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    },

    // --- Reviews ---
    getReviews(productId) {
        const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
        return reviews.filter(r => r.productId == productId);
    },

    addReview(review) {
        const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
        const newReview = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            ...review
        };
        reviews.push(newReview);
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
        return newReview;
    },

    // --- Utils ---
    formatPrice(price) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(price);
    }
};

// Initialize on load
Store.init();
