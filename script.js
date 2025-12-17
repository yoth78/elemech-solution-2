// ============================================
// Elemech Solution P.L.C - Main JavaScript
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. DARK/LIGHT MODE TOGGLE
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    const themeStatus = document.getElementById('themeStatus');
    const themeMeta = document.getElementById('theme-meta');
    
    // Initialize theme on page load
    function initTheme() {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('elemech-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Determine initial theme
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        // Apply theme
        if (initialTheme === 'dark') {
            document.body.classList.add('dark-mode');
            if (themeStatus) themeStatus.textContent = 'Dark Mode';
            updateThemeMeta('dark');
        } else {
            document.body.classList.remove('dark-mode');
            if (themeStatus) themeStatus.textContent = 'Light Mode';
            updateThemeMeta('light');
        }
        
        // Save preference if not already saved
        if (!savedTheme) {
            localStorage.setItem('elemech-theme', initialTheme);
        }
    }
    
    // Update theme meta tag for mobile browsers
    function updateThemeMeta(theme) {
        if (!themeMeta) return;
        const themeColor = theme === 'dark' ? '#0f172a' : '#0066ff';
        themeMeta.setAttribute('content', themeColor);
    }
    
    // Toggle theme function
    function toggleTheme() {
        const isDark = document.body.classList.toggle('dark-mode');
        const newTheme = isDark ? 'dark' : 'light';
        
        // Update status text
        if (themeStatus) {
            themeStatus.textContent = isDark ? 'Dark Mode' : 'Light Mode';
        }
        
        // Update meta tag
        updateThemeMeta(newTheme);
        
        // Save preference
        localStorage.setItem('elemech-theme', newTheme);
        
        // Add smooth transition class
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
        
        // Dispatch custom event for other scripts
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: newTheme }
        }));
    }
    
    // Listen for system theme changes
    function watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Only update if user hasn't set a preference
            if (!localStorage.getItem('elemech-theme')) {
                if (e.matches) {
                    document.body.classList.add('dark-mode');
                    if (themeStatus) themeStatus.textContent = 'Dark Mode';
                    updateThemeMeta('dark');
                } else {
                    document.body.classList.remove('dark-mode');
                    if (themeStatus) themeStatus.textContent = 'Light Mode';
                    updateThemeMeta('light');
                }
            }
        });
    }
    
    // ============================================
    // 2. MOBILE NAVIGATION
    // ============================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    function initMobileNavigation() {
        if (!navToggle || !navMenu) return;
        
        // Toggle mobile menu
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    // ============================================
    // 3. GALLERY FILTERING
    // ============================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    function initGalleryFilter() {
        if (filterButtons.length === 0 || galleryItems.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
                
                // Add animation to filtered items
                const visibleItems = document.querySelectorAll(`.gallery-item${filterValue !== 'all' ? `[data-category="${filterValue}"]` : ''}`);
                visibleItems.forEach((item, index) => {
                    item.style.animationDelay = `${index * 0.1}s`;
                    item.classList.add('fade-in-up');
                });
            });
        });
    }
    
    // ============================================
    // 4. CONTACT FORM HANDLING
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    function initContactForm() {
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const service = document.getElementById('service');
            const message = document.getElementById('message');
            const formMessage = document.getElementById('formMessage');
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Validate form
            if (!validateForm(name, email, message, formMessage)) {
                return;
            }
            
            // Show loading state
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Create form data object
            const formData = {
                name: name.value.trim(),
                email: email.value.trim(),
                phone: phone ? phone.value.trim() : '',
                service: service ? service.value : '',
                message: message.value.trim(),
                timestamp: new Date().toISOString()
            };
            
            // Simulate form submission (replace with actual AJAX call)
            setTimeout(() => {
                // Show success message
                showFormMessage('success', 'Thank you for your message! We will contact you within 24 hours.', formMessage);
                
                // Reset form
                contactForm.reset();
                
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
                
                // Log form submission (for demo)
                console.log('Form submitted:', formData);
                
            }, 1500); // Simulate network delay
        });
    }
    
    // Form validation helper
    function validateForm(name, email, message, formMessage) {
        let isValid = true;
        let errorMessage = '';
        
        // Name validation
        if (!name.value.trim()) {
            isValid = false;
            errorMessage += '• Name is required<br>';
            name.style.borderColor = '#dc3545';
        } else if (name.value.trim().length < 2) {
            isValid = false;
            errorMessage += '• Name must be at least 2 characters<br>';
            name.style.borderColor = '#dc3545';
        } else {
            name.style.borderColor = '';
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            isValid = false;
            errorMessage += '• Email is required<br>';
            email.style.borderColor = '#dc3545';
        } else if (!emailRegex.test(email.value)) {
            isValid = false;
            errorMessage += '• Please enter a valid email address<br>';
            email.style.borderColor = '#dc3545';
        } else {
            email.style.borderColor = '';
        }
        
        // Message validation
        if (!message.value.trim()) {
            isValid = false;
            errorMessage += '• Message is required<br>';
            message.style.borderColor = '#dc3545';
        } else if (message.value.trim().length < 10) {
            isValid = false;
            errorMessage += '• Message must be at least 10 characters<br>';
            message.style.borderColor = '#dc3545';
        } else {
            message.style.borderColor = '';
        }
        
        if (!isValid) {
            showFormMessage('error', errorMessage, formMessage);
        }
        
        return isValid;
    }
    
    // Show form message helper
    function showFormMessage(type, message, container) {
        if (!container) return;
        
        container.innerHTML = message;
        container.className = `form-message ${type}`;
        container.style.display = 'block';
        
        // Scroll to message
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // ============================================
    // 5. SMOOTH SCROLLING
    // ============================================
    function initSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Only process if it's an anchor link (starts with #)
                if (href.startsWith('#')) {
                    e.preventDefault();
                    
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        // Calculate offset for fixed header
                        const headerHeight = document.querySelector('.navbar').offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    // ============================================
    // 6. SCROLL TO TOP BUTTON
    // ============================================
    function initScrollToTop() {
        // Create scroll to top button
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-top';
        scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollTopBtn);
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ============================================
    // 7. SERVICE CARDS ANIMATION
    // ============================================
    function initServiceCardsAnimation() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        if (serviceCards.length === 0) return;
        
        // Add animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = `${Array.from(serviceCards).indexOf(entry.target) * 0.1}s`;
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        serviceCards.forEach(card => observer.observe(card));
    }
    
    // ============================================
    // 8. BRAND LOGOS ANIMATION
    // ============================================
    function initBrandLogosAnimation() {
        const brandItems = document.querySelectorAll('.brand-item');
        
        if (brandItems.length === 0) return;
        
        // Add hover effect
        brandItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const logo = this.querySelector('.brand-logo');
                if (logo) {
                    logo.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                const logo = this.querySelector('.brand-logo');
                if (logo) {
                    logo.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
    
    // ============================================
    // 9. STATS COUNTER ANIMATION
    // ============================================
    function initStatsCounter() {
        const statItems = document.querySelectorAll('.stat-item h3');
        
        if (statItems.length === 0) return;
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        statItems.forEach(stat => observer.observe(stat));
    }
    
    function animateCounter(element) {
        const target = parseInt(element.textContent.replace('+', ''));
        const duration = 2000; // 2 seconds
        const step = 20; // Update every 20ms
        const increment = target / (duration / step);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
            }
        }, step);
    }
    
    // ============================================
    // 10. ACTIVE NAV LINK HIGHLIGHTING
    // ============================================
    function initActiveNavHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        if (sections.length === 0 || navLinks.length === 0) return;
        
        window.addEventListener('scroll', function() {
            let current = '';
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}` || 
                    (current === '' && link.getAttribute('href') === '#home')) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    // ============================================
    // 11. FORM INPUT ANIMATIONS
    // ============================================
    function initFormAnimations() {
        const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
        
        formInputs.forEach(input => {
            // Add focus effect
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Check if input has value on page load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }
    
    // ============================================
    // 12. LAZY LOADING IMAGES
    // ============================================
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        }
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // ============================================
    // 13. TOUCH DEVICE DETECTION
    // ============================================
    function initTouchDevice() {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            document.body.classList.add('touch-device');
            
            // Improve touch feedback
            const touchElements = document.querySelectorAll('.service-card, .brand-item, .gallery-item, .btn-primary, .btn-secondary');
            
            touchElements.forEach(element => {
                element.addEventListener('touchstart', function() {
                    this.classList.add('touch-active');
                });
                
                element.addEventListener('touchend', function() {
                    this.classList.remove('touch-active');
                });
            });
        }
    }
    
    // ============================================
    // 14. INITIALIZE ALL FUNCTIONS
    // ============================================
    function initAll() {
        // Initialize theme
        initTheme();
        watchSystemTheme();
        
        // Add event listener to theme toggle
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
            
            // Add keyboard support
            themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
            
            // Add ARIA attributes
            themeToggle.setAttribute('role', 'switch');
            themeToggle.setAttribute('aria-checked', document.body.classList.contains('dark-mode'));
            
            // Update ARIA on theme change
            document.addEventListener('themeChanged', (e) => {
                themeToggle.setAttribute('aria-checked', e.detail.theme === 'dark');
            });
        }
        
        // Initialize other features
        initMobileNavigation();
        initGalleryFilter();
        initContactForm();
        initSmoothScrolling();
        initScrollToTop();
        initServiceCardsAnimation();
        initBrandLogosAnimation();
        initStatsCounter();
        initActiveNavHighlight();
        initFormAnimations();
        initLazyLoading();
        initTouchDevice();
        
        // Log initialization
        console.log('Elemech Solution website initialized successfully!');
    }
    
    // Start everything
    initAll();
    
});

// ============================================
// ADDITIONAL UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add CSS for touch active state
const touchStyles = `
.touch-device .touch-active {
    transform: scale(0.98) !important;
    opacity: 0.9 !important;
}

/* Improve scroll on iOS */
.touch-device {
    -webkit-overflow-scrolling: touch;
}

/* Better focus styles for accessibility */
:focus {
    outline: 2px solid var(--primary-color) !important;
    outline-offset: 2px !important;
}

:focus:not(:focus-visible) {
    outline: none !important;
}

/* Loading animation for form submission */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.fa-spinner {
    animation: spin 1s linear infinite;
    margin-right: 8px;
}

/* Active form field */
.form-group.focused label {
    transform: translateY(-20px) scale(0.9);
    color: var(--primary-color);
}

/* Print styles */
@media print {
    .theme-toggle-container,
    .scroll-top,
    .nav-toggle,
    .hero-buttons,
    .contact-form-container button {
        display: none !important;
    }
}
`;

// Inject touch styles
const styleSheet = document.createElement('style');
styleSheet.textContent = touchStyles;
document.head.appendChild(styleSheet);

// Export functions for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleTheme: toggleTheme,
        initTheme: initTheme,
        initMobileNavigation: initMobileNavigation,
        initGalleryFilter: initGalleryFilter,
        initContactForm: initContactForm
    };
}