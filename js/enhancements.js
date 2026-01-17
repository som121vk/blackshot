// UI/UX Enhancements for Blackshot Toy Store
// This file adds modern animations and interactive elements

(function() {
    'use strict';

    // Toast Notification System
    const ToastManager = {
        container: null,
        
        init() {
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 'toast-container';
                document.body.appendChild(this.container);
            }
        },
        
        show(message, type = 'success', duration = 3000) {
            this.init();
            
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                info: 'fa-info-circle'
            };
            
            toast.innerHTML = `
                <i class="fas ${icons[type]} toast-icon"></i>
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            `;
            
            this.container.appendChild(toast);
            
            // Close button
            toast.querySelector('.toast-close').addEventListener('click', () => {
                this.remove(toast);
            });
            
            // Auto remove
            setTimeout(() => this.remove(toast), duration);
        },
        
        remove(toast) {
            toast.style.animation = 'slideOutRight 0.4s ease-out';
            setTimeout(() => toast.remove(), 400);
        }
    };

    // Add slideOutRight animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOutRight {
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Enhanced Add to Cart with Toast
    window.addToCartWithToast = function(productId) {
        if (typeof Store !== 'undefined') {
            Store.addToCart(productId, 1);
            
            // Update cart count with animation
            const cartCount = document.getElementById('cart-count');
            if (cartCount) {
                cartCount.classList.add('updated');
                cartCount.textContent = Store.getCartCount();
                setTimeout(() => cartCount.classList.remove('updated'), 600);
            }
            
            // Show toast notification
            const product = Store.getProducts().find(p => p.id === productId);
            const productName = product ? product.name : 'Product';
            ToastManager.show(`${productName} added to cart!`, 'success');
            
            // Button feedback
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = '✓ Added!';
            btn.style.background = '#28a745';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 1500);
        }
    };

    // Scroll to Top Button
    function initScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollBtn);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Intersection Observer for Scroll Animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe sections
        const sections = document.querySelectorAll('.section-padding');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }

    // Enhanced Search Bar
    function initSearchEnhancements() {
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
            searchInput.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });

            searchInput.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });

            // Add search suggestions (placeholder for future enhancement)
            searchInput.addEventListener('input', function() {
                // Future: Add live search suggestions
            });
        }
    }

    // Parallax Effect for Hero Slider
    function initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroSlider = document.querySelector('.hero-slider-container');
            if (heroSlider && scrolled < 600) {
                heroSlider.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }

    // Loading State for Images
    function initImageLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Smooth Quantity Change Animation
    function initQuantityAnimations() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('qty-btn')) {
                const qtyDisplay = e.target.parentElement.querySelector('.qty-display');
                if (qtyDisplay) {
                    qtyDisplay.style.animation = 'none';
                    setTimeout(() => {
                        qtyDisplay.style.animation = 'pulse 0.3s ease';
                    }, 10);
                }
            }
        });
    }

    // Enhanced Form Validation
    function initFormEnhancements() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('invalid', (e) => {
                    e.preventDefault();
                    input.classList.add('error');
                    input.style.animation = 'shake 0.5s';
                });

                input.addEventListener('input', () => {
                    input.classList.remove('error');
                });
            });
        });
    }

    // Add shake animation
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        input.error, textarea.error, select.error {
            border-color: #dc3545 !important;
        }
    `;
    document.head.appendChild(shakeStyle);

    // Initialize all enhancements when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initScrollToTop();
        initScrollAnimations();
        initSearchEnhancements();
        initParallax();
        initImageLoading();
        initQuantityAnimations();
        initFormEnhancements();
        
        // Make ToastManager globally available
        window.ToastManager = ToastManager;
        
        console.log('🎨 UI/UX Enhancements loaded successfully!');
    }

})();
