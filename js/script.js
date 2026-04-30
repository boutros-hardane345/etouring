// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// ===== SCROLL EFFECTS =====
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero img');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ADD LOADING SPINNER TO BUTTONS =====
function addLoadingToButton(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Loading...';
    button.disabled = true;
    
    return function restore() {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

// ===== COUNTDOWN TIMER FOR EVENTS =====
function createCountdown(targetDate, elementId) {
    const target = new Date(targetDate).getTime();
    
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = target - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
        
        if (distance < 0) {
            clearInterval(interval);
            if (element) element.innerHTML = "Event Started!";
        }
    }, 1000);
}

// ===== BACK TO TOP BUTTON =====
function addBackToTopButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.id = 'backToTop';
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 999;
        transition: var(--transition);
        box-shadow: var(--shadow);
    `;
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.style.display = 'block';
            btn.style.animation = 'fadeInUp 0.3s ease';
        } else {
            btn.style.display = 'none';
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-5px)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
    });
}

// Call this on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    addBackToTopButton();
});

// ===== IMAGE LAZY LOADING WITH FADE =====
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.animation = 'fadeIn 0.5s ease';
        });
    });
});

// ===== HOVER EFFECT FOR SOCIAL LINKS =====
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) rotate(360deg)';
    });
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotate(0deg)';
    });
});

// ===== TYPING EFFECT FOR HERO TEXT =====
function typeEffect(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Apply typing effect to hero heading
const heroHeading = document.querySelector('.hero-content h1');
if (heroHeading && heroHeading.innerText.includes('Far from the Noise')) {
    const originalText = heroHeading.innerText;
    heroHeading.innerText = '';
    setTimeout(() => {
        typeEffect(heroHeading, originalText, 50);
    }, 500);
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-links') && !event.target.closest('.menu-btn')) {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuBtn.innerHTML = '☰';
            }
        }
    });

    // Close menu when clicking on a link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuBtn.innerHTML = '☰';
        });
    });

    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // Load events from API
    loadEventsFromAPI();
    
    // Load testimonials from API
    loadTestimonialsFromAPI();
    
    // Initialize form validation
    initFormValidation();
    
    // Handle file upload
    initFileUpload();
});

// ============ LOAD EVENTS FROM API ============
async function loadEventsFromAPI() {
    const eventsGrid = document.querySelector('.events-grid');
    if (!eventsGrid) return;

    try {
        const response = await fetch('/api/events');
        const events = await response.json();
        
        if (events.length === 0) {
            eventsGrid.innerHTML = '<p class="text-center">No events available. Check back soon!</p>';
            return;
        }
        
        eventsGrid.innerHTML = events.map((event, index) => `
            <div class="card" data-aos="fade-up" data-aos-delay="${(index % 3) * 100}">
                <img src="${event.image || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470'}" alt="${event.title}" class="card-img" loading="lazy">
                <div class="card-content">
                    <h3 class="card-title">${escapeHtml(event.title)}</h3>
                    <p><i class="fas fa-calendar" style="color: var(--primary);"></i> ${event.date || 'Date TBA'}</p>
                    <p><i class="fas fa-map-marker-alt" style="color: var(--primary);"></i> ${event.location || 'Lebanon'}</p>
                    <p><i class="fas fa-tag" style="color: var(--primary);"></i> ${event.price || 'Free'}</p>
                    <p class="mt-2">${escapeHtml(event.description || '')}</p>
                    <button class="btn mt-3" onclick="registerForEvent('${escapeHtml(event.title)}')">Register Now</button>
                </div>
            </div>
        `).join('');
        
        // Refresh AOS animations for new elements
        AOS.refresh();
    } catch (error) {
        console.error('Error loading events:', error);
        eventsGrid.innerHTML = '<p class="text-center">Unable to load events. Please try again later.</p>';
    }
}

// ============ LOAD TESTIMONIALS FROM API ============
async function loadTestimonialsFromAPI() {
    const testimonialsContainer = document.querySelector('.testimonials');
    if (!testimonialsContainer) return;

    try {
        const response = await fetch('/api/feedback');
        const feedbacks = await response.json();
        
        if (feedbacks.length === 0) {
            testimonialsContainer.innerHTML = '<p class="text-center">No testimonials yet. Be the first to share your experience!</p>';
            return;
        }
        
        testimonialsContainer.innerHTML = feedbacks.map((feedback, index) => `
            <div class="testimonial-card" data-aos="fade-up" data-aos-delay="${(index % 3) * 100}">
                <p class="testimonial-text">"${escapeHtml(feedback.message)}"</p>
                <div class="testimonial-author">
                    <div>
                        <h4>${escapeHtml(feedback.name)}</h4>
                        <p class="text-primary">⭐ ${'★'.repeat(feedback.rating || 0)}${'☆'.repeat(5 - (feedback.rating || 0))}</p>
                    </div>
                </div>
            </div>
        `).join('');
        
        AOS.refresh();
    } catch (error) {
        console.error('Error loading testimonials:', error);
        testimonialsContainer.innerHTML = '<p class="text-center">Unable to load testimonials.</p>';
    }
}

// Helper function to escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                showNotification('Form submitted successfully!', 'success');
                this.reset();
            }
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(input);
        }
    });

    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    clearError(input);
    input.classList.add('error');
    
    const error = document.createElement('div');
    error.className = 'error-message';
    error.style.color = '#dc3545';
    error.style.fontSize = '0.875rem';
    error.style.marginTop = '0.25rem';
    error.textContent = message;
    
    formGroup.appendChild(error);
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    input.classList.remove('error');
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// File Upload Handler
function initFileUpload() {
    const fileUploads = document.querySelectorAll('.file-upload input[type="file"]');
    
    fileUploads.forEach(upload => {
        upload.addEventListener('change', function(e) {
            const fileName = this.files[0]?.name;
            const parent = this.closest('.file-upload');
            
            if (fileName) {
                const fileInfo = document.createElement('p');
                fileInfo.className = 'file-info';
                fileInfo.style.color = 'var(--primary)';
                fileInfo.style.marginTop = '0.5rem';
                fileInfo.innerHTML = `<i class="fas fa-check-circle"></i> ${fileName}`;
                
                const existing = parent.querySelector('.file-info');
                if (existing) existing.remove();
                
                parent.appendChild(fileInfo);
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#2f7d32' : '#dc3545'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Event Registration
function registerForEvent(eventName) {
    showNotification(`Registration opened for ${eventName}`, 'success');
    setTimeout(() => {
        window.location.href = 'register_page.html';
    }, 1500);
}

// Newsletter Subscription
document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        if (isValidEmail(email)) {
            showNotification('Successfully subscribed to newsletter!', 'success');
            this.reset();
        } else {
            showNotification('Please enter a valid email address', 'error');
        }
    });
});

// Counter Animation for Stats
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + '+';
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current) + '+';
            }
        }, 30);
    });
}

function checkStatsInView() {
    const stats = document.querySelector('.stats');
    if (!stats) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(stats);
}

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', function() {
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
    checkStatsInView();
});

// Form Submission Handler
class FormHandler {
    constructor() {
        this.initForms();
        this.initBooking();
    }

    initForms() {
        const volunteerForm = document.getElementById('volunteerForm');
        if (volunteerForm) {
            volunteerForm.addEventListener('submit', (e) => this.handleVolunteerSubmit(e));
        }

        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }
    }

    initBooking() {
        document.querySelectorAll('.btn[onclick*="bookPlan"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const planName = e.target.closest('.btn').getAttribute('onclick').match(/'([^']+)'/)[1];
                this.handleBooking(planName);
            });
        });
    }

    async handleVolunteerSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        if (!this.validateForm(data)) return;
        
        // Send to backend
        try {
            const response = await fetch('/api/volunteer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                this.showSuccess('Application submitted successfully! We\'ll contact you soon.');
                e.target.reset();
            } else {
                this.showError('Submission failed. Please try again.');
            }
        } catch (err) {
            // Fallback to localStorage if backend not available
            this.saveToLocalStorage('volunteers', data);
            this.showSuccess('Application submitted successfully! We\'ll contact you soon.');
            e.target.reset();
        }
    }

    async handleContactSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        if (!this.validateForm(data)) return;
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                this.showSuccess('Message sent successfully! We\'ll respond within 24 hours.');
                e.target.reset();
            } else {
                this.showError('Failed to send message. Please try again.');
            }
        } catch (err) {
            this.saveToLocalStorage('contacts', data);
            this.showSuccess('Message sent successfully! We\'ll respond within 24 hours.');
            e.target.reset();
        }
    }

    handleBooking(planName) {
        const booking = {
            plan: planName,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        this.saveToLocalStorage('bookings', booking);
        this.showBookingModal(planName);
    }

    validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(data.email)) {
            this.showError('Please enter a valid email address');
            return false;
        }
        
        if (data.phone && data.phone.trim() !== '') {
            const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
            if (!phoneRegex.test(data.phone)) {
                this.showError('Please enter a valid phone number');
                return false;
            }
        }
        
        return true;
    }

    saveToLocalStorage(type, data) {
        let existing = localStorage.getItem(type);
        existing = existing ? JSON.parse(existing) : [];
        
        data.timestamp = new Date().toISOString();
        data.id = Date.now();
        existing.push(data);
        
        localStorage.setItem(type, JSON.stringify(existing));
        console.log(`Saved to ${type}:`, data);
    }

    showSuccess(message) {
        showNotification(message, 'success');
    }

    showError(message) {
        showNotification(message, 'error');
    }

    showBookingModal(planName) {
        const modal = document.createElement('div');
        modal.className = 'booking-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 12px;
                max-width: 400px;
                width: 90%;
                text-align: center;
            ">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: #2f7d32; margin-bottom: 1rem;"></i>
                <h3>Booking Started!</h3>
                <p>You're booking: <strong>${escapeHtml(planName)}</strong></p>
                <p>Please complete your registration to confirm.</p>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button class="btn" onclick="window.location.href='register_page.html'">Continue to Register</button>
                    <button class="btn btn-outline" onclick="this.closest('.booking-modal').remove()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
}

// ===== MOBILE DETECTION & OPTIMIZATIONS =====
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
}

// Touch-friendly hover effects for mobile
if (isMobile()) {
    document.querySelectorAll('.card, .btn, .stat-card').forEach(el => {
        el.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        el.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
    });
}

// Prevent zoom on input focus (iOS)
document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('focus', () => {
        if (isMobile()) {
            document.body.style.fontSize = '16px';
        }
    });
});

// Smooth scroll for mobile
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle orientation change
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        window.scrollTo(0, 0);
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 100);
});

// Add viewport height fix for mobile browsers
function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setVH);
setVH();

// WhatsApp Booking Function
function bookViaWhatsApp(itemName, itemType = 'event') {
    const phoneNumber = '96170263067';
    let message = '';
    
    if (itemType === 'event') {
        message = `Hello! I'm interested in booking the event: ${itemName}. Can you please provide more information about availability and what to expect?`;
    } else {
        message = `Hello! I'm interested in the plan: ${itemName}. Can you please provide more information about pricing, duration, and availability?`;
    }
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Make it available globally
window.bookViaWhatsApp = bookViaWhatsApp;

// Initialize form handler
document.addEventListener('DOMContentLoaded', () => {
    window.formHandler = new FormHandler();
});