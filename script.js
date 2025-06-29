// Polyfill for requestIdleCallback
if (!window.requestIdleCallback) {
    window.requestIdleCallback = function(callback) {
        return setTimeout(() => {
            callback({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50.0 - (Date.now() - performance.now()))
            });
        }, 1);
    };
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    
    // Critical operations first
    initLoadingScreen();
    initNavigation();
    initWorkFilter();
    
    // Defer non-critical operations
    requestIdleCallback(() => {
        ensureContentVisibility();
        initScrollAnimations();
        initContactForm();
        initStatsCounter();
        initParallaxEffects();
        initContactCopy();
        
        // Add loading animation to images
        document.querySelectorAll('img').forEach(img => {
            img.style.opacity = '1';
            img.style.visibility = 'visible';
            img.style.transition = 'opacity 0.5s ease';
        });
        // Add reveal class to sections
        document.querySelectorAll('section').forEach(section => section.classList.add('reveal'));
    });
});

function ensureContentVisibility() {
    // Cache DOM queries
    const sections = document.querySelectorAll('section');
    const contentElements = document.querySelectorAll('.about-content, .work-grid, .contact-content, .about-text, .about-stats, .work-filter, .contact-info, .contact-form');
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, span, div');
    
    sections.forEach(section => {
        section.style.opacity = '1';
        section.style.visibility = 'visible';
    });
    
    contentElements.forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.transform = 'none';
    });
    
    textElements.forEach(el => {
        if (el.style.opacity === '0' || el.style.visibility === 'hidden') {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        }
    });
}

function initLoadingScreen() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loading);
    window.addEventListener('load', () => {
        setTimeout(() => {
            loading.classList.add('hidden');
            setTimeout(() => loading.remove(), 300);
        }, 200);
    });
}

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    navLinks.forEach(link => link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
    window.addEventListener('scroll', () => {
        navbar.style.background = window.scrollY > 100 ? 'rgba(10, 10, 10, 0.3)' : 'rgba(10, 10, 10, 0.2)';
        navbar.style.boxShadow = window.scrollY > 100 ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.3)';
    });
    navLinks.forEach(link => link.addEventListener('click', e => {
        e.preventDefault();
        const targetSection = document.querySelector(link.getAttribute('href'));
        if (targetSection) {
            window.scrollTo({ top: targetSection.offsetTop - 70, behavior: 'smooth' });
        }
    }));
}

function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible'));
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        observer.observe(el);
    });
    document.querySelectorAll('section').forEach((section, idx) => {
        if (idx > 0) {
            section.querySelectorAll('.about-content, .work-grid, .contact-content').forEach((el, elIdx) => {
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.style.transform = 'none';
                el.classList.add(elIdx % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
            });
        }
    });
}

function initWorkFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');
    
    // Store original iframe data for lazy loading
    const iframeData = new Map();
    workItems.forEach(item => {
        const iframe = item.querySelector('iframe');
        if (iframe) {
            iframeData.set(item, {
                src: iframe.getAttribute('data-src') || iframe.src,
                title: iframe.title,
                allow: iframe.allow,
                allowfullscreen: iframe.allowfullscreen
            });
            // Remove iframe initially to prevent loading
            iframe.remove();
        }
    });
    
    function applyFilter(filter) {
        filterBtns.forEach(b => b.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        // Mute all videos before switching categories
        document.querySelectorAll('.work-item iframe').forEach(iframe => {
            if (iframe.src.includes('youtube.com')) {
                // Force mute by updating the URL with mute parameter
                const url = new URL(iframe.src);
                url.searchParams.set('mute', '1');
                iframe.src = url.toString();
            }
        });
        
        workItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    
                    // Lazy load iframe only when category is selected
                    const videoContainer = item.querySelector('.video-container');
                    if (videoContainer && !videoContainer.querySelector('iframe') && iframeData.has(item)) {
                        const data = iframeData.get(item);
                        const newIframe = document.createElement('iframe');
                        
                        // Add autoplay to the URL
                        const url = new URL(data.src);
                        url.searchParams.set('autoplay', '1');
                        url.searchParams.set('volume', '60');
                        url.searchParams.set('enablejsapi', '1');
                        newIframe.src = url.toString();
                        
                        newIframe.title = data.title;
                        newIframe.allow = data.allow;
                        newIframe.allowfullscreen = data.allowfullscreen;
                        newIframe.frameborder = '0';
                        newIframe.setAttribute('loading', 'lazy');
                        videoContainer.appendChild(newIframe);
                        
                        // Add loading effect
                        videoContainer.style.opacity = '0.8';
                        newIframe.addEventListener('load', () => {
                            videoContainer.style.opacity = '1';
                            // Try to set volume after load
                            try {
                                const player = new YT.Player(newIframe, {
                                    events: {
                                        'onReady': function(event) {
                                            event.target.setVolume(60);
                                        }
                                    }
                                });
                            } catch (e) {
                                // Fallback if YouTube API is not available
                                console.log('YouTube API not available for volume control');
                            }
                        });
                    }
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => { item.style.display = 'none'; }, 300);
            }
        });
    }
    
    applyFilter('general');
    filterBtns.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.getAttribute('data-filter'))));
    
    // Optimize image loading
    document.querySelectorAll('img').forEach(img => {
        img.style.opacity = '1';
        img.style.visibility = 'visible';
        img.addEventListener('error', () => console.log('Image failed to load:', img.src));
        img.addEventListener('load', () => {
            img.style.opacity = '1';
            img.style.visibility = 'visible';
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        emailjs.init("_5fQbVxUaeSigZDHG");
        form.addEventListener('submit', e => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(form));
            if (!data.name || !data.contact || !data.message) return showNotification('Please fill in all required fields.', 'error');
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            emailjs.send("service_79k516t", "template_hdw4cx8", {
                from_name: data.name,
                from_contact: data.contact,
                message: data.message,
            }).then(() => {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, () => {
                showNotification('Failed to send message. Please try again.', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
    document.querySelectorAll('.form-group').forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        if (input && label) {
            input.addEventListener('focus', () => { label.style.color = '#ffffff'; });
            input.addEventListener('blur', () => { if (!input.value) label.style.color = '#cccccc'; });
        }
    });
}

function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const animateCounter = el => {
        const target = +el.getAttribute('data-target');
        const duration = 2000, step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current);
        }, 16);
    };
    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach(stat => statsObserver.observe(stat));
}

function initParallaxEffects() {
    const shapes = document.querySelectorAll('.shape');
    const heroBackground = document.querySelector('.hero-background');
    
    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                shapes.forEach((shape, i) => {
                    const speed = 0.5 + i * 0.1;
                    shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
                });
                
                if (heroBackground) {
                    heroBackground.style.transform = `translateY(${rate}px)`;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 15px 20px; border-radius: 10px; color: #fff; font-weight: 500; z-index: 10000;
        transform: translateX(100%); transition: transform 0.3s ease; max-width: 300px; word-wrap: break-word;`;
    if (type === 'success') notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    else if (type === 'error') notification.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
    else notification.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Section reveal on scroll
function revealOnScroll() {
    document.querySelectorAll('.reveal').forEach(element => {
        const windowHeight = window.innerHeight, elementTop = element.getBoundingClientRect().top, elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) element.classList.add('active');
    });
}
window.addEventListener('scroll', revealOnScroll);

// Particle system for background
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; overflow: hidden;`;
    document.body.appendChild(particleContainer);
    
    // Reduced particle count for better performance
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `position: absolute; width: 2px; height: 2px; background: rgba(255,255,255,0.3); border-radius: 50%; animation: float-particle ${Math.random() * 15 + 15}s linear infinite; left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;`;
        particleContainer.appendChild(particle);
    }
}
const style = document.createElement('style');
style.textContent = `@keyframes float-particle {0%{transform:translateY(100vh) rotate(0deg);opacity:0;}10%{opacity:1;}90%{opacity:1;}100%{transform:translateY(-100px) rotate(360deg);opacity:0;}}.reveal{opacity:0;transform:translateY(50px);transition:all 0.8s ease;}.reveal.active{opacity:1;transform:translateY(0);}`;
document.head.appendChild(style);
createParticles();

// Performance optimization for scroll
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => { revealOnScroll(); ticking = false; });
        ticking = true;
    }
});

// Lazy load images
const lazyLoadObserver = new IntersectionObserver(entries => {
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
document.querySelectorAll('img[data-src]').forEach(img => lazyLoadObserver.observe(img));

// Contact Copy Functionality
function initContactCopy() {
    document.querySelectorAll('.contact-item').forEach(item => {
        const contactText = item.querySelector('p');
        const contactTitle = item.querySelector('h4');
        if (contactText) {
            const title = contactTitle.textContent;
            if (title === 'Email') {
                item.classList.add('clickable');
                item.addEventListener('click', () => {
                    copyToClipboard(contactText.textContent);
                    showNotification(`${contactText.textContent} copied to clipboard!`, 'success');
                    const originalBackground = item.style.background;
                    item.style.background = 'rgba(255,255,255,0.2)';
                    item.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        item.style.background = originalBackground;
                        item.style.transform = 'scale(1)';
                    }, 200);
                });
            } else if (title === 'WhatsApp') {
                item.classList.add('clickable');
                item.addEventListener('click', () => { openWhatsApp();
                    const originalBackground = item.style.background;
                    item.style.background = 'rgba(255,255,255,0.2)';
                    item.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        item.style.background = originalBackground;
                        item.style.transform = 'scale(1)';
                    }, 200);
                });
            } else if (title === 'Telegram') {
                item.classList.add('clickable');
                item.addEventListener('click', () => { openTelegram();
                    const originalBackground = item.style.background;
                    item.style.background = 'rgba(255,255,255,0.2)';
                    item.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        item.style.background = originalBackground;
                        item.style.transform = 'scale(1)';
                    }, 200);
                });
            } else {
                item.style.cursor = 'default';
            }
        }
    });
}

function openWhatsApp() {
    const phoneNumber = '918709922877';
    const message = 'Hi Kaif! I saw your portfolio and would like to discuss a project.';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    showNotification('Opening WhatsApp...', 'info');
}

function openTelegram() {
    const username = 'kaifxed';
    const message = 'Hi Kaif! I saw your portfolio and would like to discuss a project.';
    window.open(`https://t.me/${username}?text=${encodeURIComponent(message)}`, '_blank');
    showNotification('Opening Telegram...', 'info');
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(() => fallbackCopyToClipboard(text));
    } else {
        fallbackCopyToClipboard(text);
    }
}
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try { document.execCommand('copy'); } catch (err) {}
    document.body.removeChild(textArea);
}
