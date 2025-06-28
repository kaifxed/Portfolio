// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Disable browser scroll restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    // Ensure page starts at top on refresh
    window.scrollTo(0, 0);
    
    // Ensure all content is visible
    ensureContentVisibility();
    
    // Initialize all functionality
    initLoadingScreen();
    initNavigation();
    initScrollAnimations();
    initWorkFilter();
    initContactForm();
    initStatsCounter();
    initParallaxEffects();
    initContactCopy();
});

// Ensure all content is visible
function ensureContentVisibility() {
    // Make sure all sections and their content are visible
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '1';
        section.style.visibility = 'visible';
        
        const content = section.querySelectorAll('.about-content, .work-grid, .contact-content, .about-text, .about-stats, .work-filter, .contact-info, .contact-form');
        content.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.transform = 'none';
        });
    });
    
    // Ensure all text content is visible
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, span, div');
    textElements.forEach(el => {
        if (el.style.opacity === '0' || el.style.visibility === 'hidden') {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        }
    });
}

// Loading Screen
function initLoadingScreen() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loading);

    // Hide loading screen after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loading.classList.add('hidden');
            setTimeout(() => {
                loading.remove();
            }, 300);
        }, 200);
    });
}

// Navigation
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.3)';
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.2)';
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => {
        // Ensure elements are visible by default
        el.style.opacity = '1';
        el.style.transform = 'none';
        observer.observe(el);
    });

    // Add animation classes to sections but ensure they're visible
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (index > 0) { // Skip hero section
            const elements = section.querySelectorAll('.about-content, .work-grid, .contact-content');
            elements.forEach((el, elIndex) => {
                // Ensure elements are visible
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.style.transform = 'none';
                
                if (elIndex % 2 === 0) {
                    el.classList.add('slide-in-left');
                } else {
                    el.classList.add('slide-in-right');
                }
            });
        }
    });
}

// Work Filter
function initWorkFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter work items
            workItems.forEach(item => {
                const categories = item.getAttribute('data-category');
                
                if (categories.includes(filter)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Lazy load YouTube videos for better performance
    const videoIframes = document.querySelectorAll('.video-container iframe');
    videoIframes.forEach(iframe => {
        // Add loading="lazy" attribute for better performance
        iframe.setAttribute('loading', 'lazy');
        
        // Add a subtle loading animation
        const container = iframe.parentElement;
        container.style.opacity = '0.8';
        
        iframe.addEventListener('load', () => {
            container.style.opacity = '1';
        });
    });

    // Ensure all images are visible
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.style.opacity = '1';
        img.style.visibility = 'visible';
        
        // Add error handling for images
        img.addEventListener('error', () => {
            console.log('Image failed to load:', img.src);
        });
        
        img.addEventListener('load', () => {
            img.style.opacity = '1';
            img.style.visibility = 'visible';
        });
    });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        // Initialize EmailJS with your public key
        emailjs.init("_5fQbVxUaeSigZDHG");
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.contact || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Update button state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Send email using EmailJS with your actual credentials
            emailjs.send("service_79k516t", "template_hdw4cx8", {
                from_name: data.name,
                from_contact: data.contact,
                message: data.message,
            })
            .then(function(response) {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, function(error) {
                showNotification('Failed to send message. Please try again.', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Form field animations
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        
        if (input && label) {
            input.addEventListener('focus', () => {
                label.style.color = '#ffffff';
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.style.color = '#cccccc';
                }
            });
        }
    });
}

// Stats Counter Animation
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    };

    // Intersection Observer for stats
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Parallax Effects
function initParallaxEffects() {
    const shapes = document.querySelectorAll('.shape');
    const heroBackground = document.querySelector('.hero-background');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax for floating shapes
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
        
        // Parallax for hero background
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: #ffffff;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Cursor Effects
function initCursorEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Cursor effects on hoverable elements
    const hoverElements = document.querySelectorAll('a, button, .work-item, .skill-tag');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'rgba(255, 255, 255, 0.8)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'rgba(255, 255, 255, 0.5)';
        });
    });

    // Hide cursor when entering video cards
    const videoCards = document.querySelectorAll('.work-item[data-category*="general"]');
    videoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cursor.style.display = 'none';
        });
        
        card.addEventListener('mouseleave', () => {
            cursor.style.display = 'block';
        });
    });
}

// Initialize cursor effects
initCursorEffects();

// Smooth reveal animations for sections
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Add reveal class to sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('reveal');
    });
});

// Particle system for background
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            animation: float-particle ${Math.random() * 15 + 15}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        particleContainer.appendChild(particle);
    }
}

// Add particle animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes float-particle {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    .reveal {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s ease;
    }
    
    .reveal.active {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Initialize particles
createParticles();

// Performance optimization
let ticking = false;

function updateOnScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            revealOnScroll();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', updateOnScroll);

// Add loading animation to images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.opacity = '1';
        img.style.visibility = 'visible';
        img.style.transition = 'opacity 0.5s ease';
    });
});

// Add intersection observer for better performance
const lazyLoadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                lazyLoadObserver.unobserve(img);
            }
        }
    });
});

// Observe images for lazy loading
document.querySelectorAll('img[data-src]').forEach(img => {
    lazyLoadObserver.observe(img);
});

// Contact Copy Functionality
function initContactCopy() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        const contactText = item.querySelector('p');
        const contactTitle = item.querySelector('h4');
        
        if (contactText) {
            const title = contactTitle.textContent;
            
            if (title === 'Email') {
                // Only email is clickable and copyable
                item.classList.add('clickable');
                item.addEventListener('click', () => {
                    const text = contactText.textContent;
                    copyToClipboard(text);
                    showNotification(`${text} copied to clipboard!`, 'success');
                    
                    // Visual feedback
                    const originalBackground = item.style.background;
                    item.style.background = 'rgba(255, 255, 255, 0.2)';
                    item.style.transform = 'scale(1.02)';
                    
                    setTimeout(() => {
                        item.style.background = originalBackground;
                        item.style.transform = 'scale(1)';
                    }, 200);
                });
            } else if (title === 'WhatsApp') {
                // WhatsApp opens messaging
                item.classList.add('clickable');
                item.addEventListener('click', () => {
                    openWhatsApp();
                    
                    // Visual feedback
                    const originalBackground = item.style.background;
                    item.style.background = 'rgba(255, 255, 255, 0.2)';
                    item.style.transform = 'scale(1.02)';
                    
                    setTimeout(() => {
                        item.style.background = originalBackground;
                        item.style.transform = 'scale(1)';
                    }, 200);
                });
            } else if (title === 'Telegram') {
                // Telegram opens messaging
                item.classList.add('clickable');
                item.addEventListener('click', () => {
                    openTelegram();
                    
                    // Visual feedback
                    const originalBackground = item.style.background;
                    item.style.background = 'rgba(255, 255, 255, 0.2)';
                    item.style.transform = 'scale(1.02)';
                    
                    setTimeout(() => {
                        item.style.background = originalBackground;
                        item.style.transform = 'scale(1)';
                    }, 200);
                });
            } else {
                // Location and other items are not clickable
                item.style.cursor = 'default';
            }
        }
    });
}

// Open WhatsApp Function
function openWhatsApp() {
    // Replace 'YOUR_PHONE_NUMBER' with your actual phone number (with country code, no + or spaces)
    const phoneNumber = '918709922877'; // Your number: +91 8709922877
    const message = 'Hi Kaif! I saw your portfolio and would like to discuss a project.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    showNotification('Opening WhatsApp...', 'info');
}

// Open Telegram Function
function openTelegram() {
    // Replace 'YOUR_USERNAME' with your Telegram username (without @)
    const username = 'kaifxed'; // Replace with your actual Telegram username
    const message = 'Hi Kaif! I saw your portfolio and would like to discuss a project.';
    const telegramUrl = `https://t.me/${username}?text=${encodeURIComponent(message)}`;
    
    window.open(telegramUrl, '_blank');
    showNotification('Opening Telegram...', 'info');
}

// Copy to Clipboard Function
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        // Use the modern clipboard API
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied successfully');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyToClipboard(text);
    }
}

// Fallback copy method
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        console.log('Text copied successfully (fallback)');
    } catch (err) {
        console.error('Failed to copy text (fallback): ', err);
    }
    
    document.body.removeChild(textArea);
}
