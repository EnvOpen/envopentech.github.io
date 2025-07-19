/**
 * Env Open Website JavaScript
 * Handles interactive features and enhances user experience
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initProjectFilters();
    initContactForm();
    initScrollAnimations();
    initSmoothScrolling();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    
    if (navToggle && nav) {
        navToggle.addEventListener('click', function() {
            nav.classList.toggle('nav-open');
            navToggle.classList.toggle('nav-toggle-open');
        });
        
        // Close nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
                nav.classList.remove('nav-open');
                navToggle.classList.remove('nav-toggle-open');
            }
        });
        
        // Close nav when pressing escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                nav.classList.remove('nav-open');
                navToggle.classList.remove('nav-toggle-open');
            }
        });
    }
    
    // Add scroll effect to header
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }
}

/**
 * Project filtering functionality
 */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length === 0 || projectCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Contact form handling
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitButton = this.querySelector('.form-submit');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission fail (replace with actual API call)
        setTimeout(() => {
            showNotification('Error occurred while sending your message. Please contact us directly at contact@envopen.org', 'error');
            this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
}

/**
 * Form validation
 */
function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject) {
        errors.push('Please select a subject');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Please enter a message with at least 10 characters');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

/**
 * Email validation
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('notification-show');
    }, 10);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        hideNotification(notification);
    });
}

/**
 * Hide notification
 */
function hideNotification(notification) {
    notification.classList.remove('notification-show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * Scroll animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.feature-card, .project-card, .team-member, .value-card, .faq-item, .role-card, .way-item'
    );
    
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                const offsetTop = targetElement.offsetTop - 80; // Account for header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Utility function to debounce events
 */
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

/**
 * Handle window resize events
 */
window.addEventListener('resize', debounce(function() {
    // Handle any responsive adjustments here
    const nav = document.querySelector('.nav');
    if (window.innerWidth > 768 && nav) {
        nav.classList.remove('nav-open');
    }
}, 250));

/**
 * Add CSS for animations and notifications
 */
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Mobile navigation styles */
        @media (max-width: 768px) {
            .nav {
                position: fixed;
                top: 80px;
                left: 0;
                right: 0;
                background-color: var(--bg-primary);
                border-top: 1px solid var(--border-color);
                padding: var(--spacing-lg);
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all var(--transition-normal);
                flex-direction: column;
                gap: var(--spacing-md);
                z-index: 999;
            }
            
            .nav.nav-open {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
            
            .nav-toggle.nav-toggle-open .hamburger {
                background-color: transparent;
            }
            
            .nav-toggle.nav-toggle-open .hamburger::before {
                transform: rotate(45deg) translate(0, 0);
                top: 0;
            }
            
            .nav-toggle.nav-toggle-open .hamburger::after {
                transform: rotate(-45deg) translate(0, 0);
                bottom: 0;
            }
        }
        
        /* Header scroll effect */
        .header.header-scrolled {
            box-shadow: var(--shadow-md);
            background-color: rgba(255, 255, 255, 0.98);
        }
        
        /* Scroll animations */
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Notification styles */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            z-index: 10000;
            transform: translateX(100%);
            opacity: 0;
            transition: all var(--transition-normal);
        }
        
        .notification.notification-show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification-content {
            background-color: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-lg);
            padding: var(--spacing-lg);
            box-shadow: var(--shadow-xl);
            display: flex;
            align-items: flex-start;
            gap: var(--spacing-md);
        }
        
        .notification-success .notification-content {
            border-color: var(--success-color);
            background-color: #f0fdf4;
        }
        
        .notification-error .notification-content {
            border-color: var(--error-color);
            background-color: #fef2f2;
        }
        
        .notification-message {
            flex: 1;
            font-size: var(--font-size-sm);
            line-height: 1.5;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: var(--font-size-lg);
            cursor: pointer;
            color: var(--text-secondary);
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .notification-close:hover {
            color: var(--text-primary);
        }
        
        @media (max-width: 480px) {
            .notification {
                left: 20px;
                right: 20px;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add dynamic styles when DOM is loaded
addDynamicStyles();
