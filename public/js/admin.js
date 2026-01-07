/**
 * Blackshot Admin Logic
 */

let isEditing = false;
let editingId = null;

// --- Authentication ---
function checkLogin() {
    const pwd = document.getElementById('admin-password').value;
    if (pwd === 'admin123') {
        document.getElementById('login-overlay').style.display = 'none';
        sessionStorage.setItem('isAdmin', 'true');
        loadProducts();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

function logout() {
    sessionStorage.removeItem('isAdmin');
    location.reload();
}

// Check session on load
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('isAdmin') === 'true') {
        document.getElementById('login-overlay').style.display = 'none';
        loadProducts();
    }
});

// --- Product Management ---
function loadProducts() {
    const tbody = document.getElementById('product-table-body');
    const products = Store.getProducts();

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No products found</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(p => `
        <tr>
            <td><img src="${p.image}" class="thumbnail" alt="img"></td>
            <td>${p.name}</td>
            <td>${Store.formatPrice(p.price)}</td>
            <td>${p.category}</td>
            <td>
                <button class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;" onclick="editProduct(${p.id})">Edit</button>
                <button class="btn btn-outline" style="padding: 5px 10px; font-size: 0.8rem; border-color: #dc3545; color: #dc3545;" onclick="deleteProduct(${p.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// --- Modal & Form ---
function openModal() {
    document.getElementById('product-modal').style.display = 'flex';
    document.getElementById('product-form').reset();
    document.getElementById('modal-title').textContent = 'Add Product';
    isEditing = false;
    editingId = null;
}

function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Edit Mode
window.editProduct = function (id) {
    const product = Store.getProduct(id);
    if (!product) return;

    openModal();
    document.getElementById('modal-title').textContent = 'Edit Product';
    isEditing = true;
    editingId = id;

    // Populate fields
    document.getElementById('p-name').value = product.name;
    document.getElementById('p-category').value = product.category;
    document.getElementById('p-price').value = product.price;
    document.getElementById('p-old-price').value = product.oldPrice || '';
    document.getElementById('p-desc').value = product.description;
    document.getElementById('p-image-url').value = product.image.startsWith('data:') ? '' : product.image;
    document.getElementById('p-specs').value = product.specifications ? product.specifications.join(', ') : '';
};

// Delete
window.deleteProduct = function (id) {
    if (confirm('Are you sure you want to delete this product?')) {
        Store.deleteProduct(id);
        loadProducts();
    }
};

// Form Submission
document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('p-name').value;
    const category = document.getElementById('p-category').value;
    const price = Number(document.getElementById('p-price').value);
    const oldPrice = Number(document.getElementById('p-old-price').value);
    const description = document.getElementById('p-desc').value;
    const specs = document.getElementById('p-specs').value.split(',').map(s => s.trim()).filter(s => s);

    // Image Handling (File > URL)
    let image = document.getElementById('p-image-url').value;
    const fileInput = document.getElementById('p-image-file');

    if (fileInput.files && fileInput.files[0]) {
        try {
            image = await toBase64(fileInput.files[0]);
        } catch (err) {
            console.error('Image upload failed', err);
            alert('Error processing image');
            return;
        }
    } else if (!image && isEditing) {
        // Keep existing image if no new one provided
        const existing = Store.getProduct(editingId);
        image = existing.image;
    } else if (!image) {
        image = 'https://placehold.co/600x400?text=No+Image';
    }

    const productData = {
        name, category, price, oldPrice, description, image, specifications: specs
    };

    if (isEditing) {
        Store.updateProduct(editingId, productData);
    } else {
        Store.addProduct(productData);
    }

    closeModal();
    loadProducts();
});

// Helper: File to Base64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
