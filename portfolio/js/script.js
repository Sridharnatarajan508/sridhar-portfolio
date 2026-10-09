/* =========================================
   1. DOM ELEMENTS & VARIABLES
   ========================================= */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const header = document.getElementById('navbar');
const contactForm = document.getElementById('contact-form');

// New Elements
const scrollProgress = document.getElementById('scroll-progress');
const breadcrumbs = document.getElementById('breadcrumbs');
const breadcrumbCurrent = breadcrumbs ? breadcrumbs.querySelector('.current-section') : null;
const bgLayers = document.querySelectorAll('.bg-layer');

/* =========================================
   2. MOBILE MENU TOGGLE
   ========================================= */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
}

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
});

/* =========================================
   3. DARK / LIGHT MODE TOGGLE
   ========================================= */
const savedTheme = localStorage.getItem('theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const applyTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    localStorage.setItem('theme', theme);
};

applyTheme(savedTheme || systemTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
});

/* =========================================
   4. SCROLL HANDLING (Progress & Header)
   ========================================= */
window.addEventListener('scroll', () => {
    // Header Blur Effect
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        if (breadcrumbs) breadcrumbs.style.opacity = '1';
    } else {
        header.classList.remove('scrolled');
        header.style.boxShadow = 'none';
        header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
        if (breadcrumbs) breadcrumbs.style.opacity = '0';
    }

    // Scroll Progress Indicator
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

    const scrolledPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    if (scrollProgress) {
        scrollProgress.style.width = `${scrolledPercentage}%`;
    }
});

/* =========================================
   5. INTERSECTION OBSERVER (Active Section & Backgrounds)
   ========================================= */
const sections = document.querySelectorAll('section[id]');

const sectionObserverOptions = {
    threshold: 0.2
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            const sectionTitle = entry.target.querySelector('.section-title')?.innerText || "Intro";

            // 1. Update Navigation
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(currentId)) {
                    link.classList.add('active');
                }
            });

            // 2. Update Breadcrumbs
            if (breadcrumbCurrent) {
                // Capitalize first letter logic or map
                const displayMap = {
                    'home': 'Intro',
                    'about': 'About',
                    'skills': 'Skills',
                    'projects': 'Projects',
                    'certifications': 'Certifications',
                    'contact': 'Contact'
                };
                breadcrumbCurrent.textContent = displayMap[currentId] || currentId;
            }

            // 3. Update Backgrounds
            bgLayers.forEach(layer => {
                layer.classList.remove('active');
                if (layer.classList.contains(`bg-${currentId}`)) {
                    layer.classList.add('active');
                }
            });

            // 4. Trigger Intro Animations (Staggered)
            const animElements = entry.target.querySelectorAll('.fade-in-up, .scale-in');
            animElements.forEach((el, index) => {
                // Determine delay based on index or existing class
                // We add a small programmatic delay if no class exists to ensure stagger behavior
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 150);
            });
        }
    });
}, sectionObserverOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

/* =========================================
   6. SMOOTH SCROLL FOR ANCHORs
   ========================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

/* =========================================
   7. FORM HANDLING
   ========================================= */
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Service ID and Template ID
        const serviceID = 'service_xnmgeve';
        const templateID = 'template_q8uhtxr';

        emailjs.sendForm(serviceID, templateID, contactForm)
            .then(() => {
                // Success feedback
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                submitBtn.style.backgroundColor = '#10b981';
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                }, 4000);
            }, (err) => {
                // Error feedback
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed!';
                submitBtn.style.backgroundColor = '#ce1818'; // Error Red
                console.error('EmailJS Error:', err);
                alert('Failed to send message. Please check your console or try again later.');

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                }, 3000);
            });
    });
}

/* =========================================
   8. CERTIFICATE MODAL LOGIC
   ========================================= */
const modal = document.getElementById('cert-modal');
const modalTitle = document.getElementById('modal-title');
const closeModal = document.querySelector('.close-modal');
// Use delegation or re-query if added dynamically, but here static is fine
// Wait for DOM to be ready or just query now
const certBtns = document.querySelectorAll('.view-cert-btn');

// Open Modal
certBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const title = btn.getAttribute('data-title');
        const certPath = btn.getAttribute('data-cert');
        const modalBody = modal.querySelector('.modal-body');
        const downloadLink = document.getElementById('download-link');

        if (modal && title) {
            modalTitle.textContent = title;

            // content logic
            if (certPath) {
                // If it's a PDF
                if (certPath.toLowerCase().endsWith('.pdf')) {
                    modalBody.innerHTML = `
                        <iframe src="${certPath}" style="width:100%; height:500px; border:none; border-radius:8px;"></iframe>
                    `;
                } else {
                    // Assume Image
                    modalBody.innerHTML = `
                        <img src="${certPath}" alt="${title}" style="max-width:100%; height:auto; border-radius:8px;">
                    `;
                }
                // Update download link
                downloadLink.href = certPath;
                downloadLink.setAttribute('download', '');
                downloadLink.style.display = 'inline-block';
            } else {
                // Placeholder if no specific file linked
                modalBody.innerHTML = `
                    <i class="fas fa-certificate modal-icon"></i>
                    <p>Digital Certificate Preview</p>
                    <div class="cert-placeholder">
                        <span>Certificate Image Not Available</span>
                    </div>
                `;
                downloadLink.style.display = 'none'; // Hide download if no file
            }

            modal.style.display = 'block';

            // Allow slight delay for transition
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close Modal
function closeCertModal() {
    if (!modal) return;

    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scroll
    }, 300);
}

if (closeModal) {
    closeModal.addEventListener('click', closeCertModal);
}

// Close outside click
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeCertModal();
    }
});


/* =========================================
   9. SLIDER / CAROUSEL LOGIC
   ========================================= */
class Slider {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.track = this.container.querySelector('.slider-track');
        this.slides = Array.from(this.track.children);
        this.nextBtn = this.container.querySelector('.next-btn');
        this.prevBtn = this.container.querySelector('.prev-btn');
        this.dotsContainer = this.container.querySelector('.slider-dots');

        this.currentIndex = 0;
        this.slidesToShow = 1;
        this.slideWidth = 0;
        this.gap = 30; // Matches CSS
        this.maxIndex = 0;

        this.startX = 0;
        this.isDragging = false;

        this.init();
    }

    init() {
        this.updateDimensions();
        this.createDots();
        this.updateButtons();

        // Event Listeners
        window.addEventListener('resize', () => {
            this.updateDimensions();
            this.updatePosition();
            this.updateButtons();
        });

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.moveSlide(1));
        }
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.moveSlide(-1));
        }

        // Touch Support
        this.track.addEventListener('touchstart', (e) => this.touchStart(e), { passive: true });
        this.track.addEventListener('touchend', (e) => this.touchEnd(e));
    }

    updateDimensions() {
        const width = window.innerWidth;

        if (width >= 1024) {
            this.slidesToShow = 3;
        } else if (width >= 768) {
            this.slidesToShow = 2;
        } else {
            this.slidesToShow = 1;
        }

        this.maxIndex = Math.max(0, this.slides.length - this.slidesToShow);

        if (this.currentIndex > this.maxIndex) {
            this.currentIndex = this.maxIndex;
        }

        this.slideWidth = this.slides[0].offsetWidth;
    }

    createDots() {
        if (!this.dotsContainer) return;
        this.dotsContainer.innerHTML = '';

        if (this.maxIndex <= 0) return;

        for (let i = 0; i <= this.maxIndex; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === this.currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                this.currentIndex = i;
                this.updatePosition();
                this.updateButtons();
                this.updateDots();
            });
            this.dotsContainer.appendChild(dot);
        }
    }

    updateDots() {
        if (!this.dotsContainer) return;
        const dots = Array.from(this.dotsContainer.children);
        dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    updateButtons() {
        if (!this.prevBtn || !this.nextBtn) return;

        this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.3' : '1';
        this.prevBtn.style.pointerEvents = this.currentIndex === 0 ? 'none' : 'auto';

        this.nextBtn.style.opacity = this.currentIndex === this.maxIndex ? '0.3' : '1';
        this.nextBtn.style.pointerEvents = this.currentIndex === this.maxIndex ? 'none' : 'auto';

        if (this.maxIndex <= 0) {
            this.prevBtn.style.display = 'none';
            this.nextBtn.style.display = 'none';
        } else {
            this.prevBtn.style.display = 'flex';
            this.nextBtn.style.display = 'flex';
        }
    }

    moveSlide(direction) {
        const newIndex = this.currentIndex + direction;
        if (newIndex >= 0 && newIndex <= this.maxIndex) {
            this.currentIndex = newIndex;
            this.updatePosition();
            this.updateButtons();
            this.updateDots();
        }
    }

    updatePosition() {
        this.slideWidth = this.slides[0].offsetWidth;
        const translateX = -(this.slideWidth + this.gap) * this.currentIndex;
        this.track.style.transform = `translateX(${translateX}px)`;
    }

    // Touch Logic
    touchStart(e) {
        this.startX = e.touches[0].clientX;
    }

    touchEnd(e) {
        const endX = e.changedTouches[0].clientX;
        const diff = this.startX - endX;

        if (Math.abs(diff) > 50) { // Threshold 50px
            if (diff > 0) {
                this.moveSlide(1); // Swipe Left -> Next
            } else {
                this.moveSlide(-1); // Swipe Right -> Prev
            }
        }
    }
}

// Initialize Sliders
document.addEventListener('DOMContentLoaded', () => {
    // Only init if elements exist
    if (document.getElementById('projects-slider')) new Slider('projects-slider');
    if (document.getElementById('cert-tech-slider')) new Slider('cert-tech-slider');
});

