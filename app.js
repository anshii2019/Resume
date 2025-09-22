// Portfolio JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    const themeToggle = document.getElementById('theme-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contact-form');
    const downloadResumeBtn = document.getElementById('download-resume');
    const backToTopBtn = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('section');

    // Theme Management
    function initializeTheme() {
        // Don't use localStorage to avoid sandbox issues
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = prefersDark ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-color-scheme', theme);
        updateThemeIcon(theme);
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        updateThemeIcon(newTheme);

        //fix: update navbar background immediately
        updateNavbarBackground();
        
        // Add visual feedback
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 150);
        
        // Show notification to confirm theme change
        //showNotification(`Switched to ${newTheme} theme`, 'info');
    }

    // Mobile Menu Management
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    function closeMobileMenu() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Smooth Scrolling
    function smoothScrollTo(targetId) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update active navigation link
            updateActiveNavLink(targetId);
        }
    }

    function updateActiveNavLink(targetId) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`a[href="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Scroll-based Navigation Highlighting
    function updateActiveSection() {
        const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                updateActiveNavLink(`#${sectionId}`);
            }
        });
    }

    // Navbar Background on Scroll
    function updateNavbarBackground() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
        
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = currentTheme === 'dark' 
                ? 'rgba(31, 33, 33, 0.98)' 
                : 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = currentTheme === 'dark' 
                ? 'rgba(31, 33, 33, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    // Back to Top Button
    function updateBackToTopButton() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    // Scroll Animations using Intersection Observer
    function initializeScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.highlight-item, .skill-category, .experience-card, .education-card, .project-card'
        );

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Animate accuracy bars for projects
                    const accuracyFill = entry.target.querySelector('.accuracy-fill');
                    if (accuracyFill) {
                        const accuracy = accuracyFill.getAttribute('data-accuracy');
                        setTimeout(() => {
                            accuracyFill.style.width = accuracy + '%';
                        }, 500);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Counter Animation
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2000; // 2 seconds
                    const step = target / (duration / 16); // 60fps
                    let current = 0;

                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };

                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    // Typing Animation for Hero Subtitle
    function initializeTypingAnimation() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (!subtitle) return;

        const text = 'Aspiring AI/ML Engineer';
        const speed = 100; // milliseconds per character
        
        subtitle.textContent = '';
        subtitle.style.borderRight = '2px solid';
        subtitle.style.animation = 'blink 1s infinite';
        
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    subtitle.style.borderRight = 'none';
                    subtitle.style.animation = 'none';
                }, 1000);
            }
        }

        // Start typing after a delay
        setTimeout(typeChar, 1500);
    }

    // Contact Form Validation and Submission - FIXED
    function handleContactForm() {
        if (!contactForm) return;

        // Add real-time validation
        const fields = contactForm.querySelectorAll('.form-control');
        fields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                // Clear error state when user starts typing
                clearFieldError(this);
            });
        });

    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        clearFieldError(field);

        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                break;
            
            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
            
            case 'subject':
                if (!value) {
                    errorMessage = 'Subject is required';
                    isValid = false;
                } else if (value.length < 3) {
                    errorMessage = 'Subject must be at least 3 characters';
                    isValid = false;
                }
                break;
            
            case 'message':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            showFieldError(field, errorMessage);
        }

        return isValid;
    }

    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        
        // Style the field
        field.style.borderColor = 'var(--color-error)';
        field.style.boxShadow = '0 0 0 3px rgba(192, 21, 47, 0.1)';
        
        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--color-error);
            font-size: var(--font-size-xs);
            margin-top: var(--space-4);
            display: flex;
            align-items: center;
            gap: var(--space-4);
        `;
        
        // Add error icon
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        formGroup.appendChild(errorElement);
    }

    function clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const existingError = formGroup.querySelector('.field-error');
        
        if (existingError) {
            existingError.remove();
        }
        
        // Reset field styles
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }

    function clearAllFormErrors() {
        const fields = contactForm.querySelectorAll('.form-control');
        fields.forEach(field => clearFieldError(field));
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification System
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        // Set base styles
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            z-index: 1001;
            min-width: 320px;
            max-width: 400px;
            padding: 16px 20px;
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-family: var(--font-family-base);
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
            backdrop-filter: blur(10px);
        `;
        
        // Set colors and icons based on type
        let icon = '';
        switch (type) {
            case 'success':
                notification.style.backgroundColor = 'rgba(33, 128, 141, 0.15)';
                notification.style.borderLeft = '4px solid var(--color-success)';
                notification.style.color = 'var(--color-success)';
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                notification.style.backgroundColor = 'rgba(192, 21, 47, 0.15)';
                notification.style.borderLeft = '4px solid var(--color-error)';
                notification.style.color = 'var(--color-error)';
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'info':
            default:
                notification.style.backgroundColor = 'rgba(98, 108, 113, 0.15)';
                notification.style.borderLeft = '4px solid var(--color-info)';
                notification.style.color = 'var(--color-info)';
                icon = '<i class="fas fa-info-circle"></i>';
                break;
        }
        
        notification.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    ${icon}
                    <span>${message}</span>
                </div>
                <button class="notification-close" style="background: none; border: none; font-size: 18px; cursor: pointer; color: inherit; opacity: 0.7; transition: opacity 0.2s ease; padding: 4px;">
                    &times;
                </button>
            </div>
        `;
        
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => hideNotification(notification));
        closeButton.addEventListener('mouseenter', () => closeButton.style.opacity = '1');
        closeButton.addEventListener('mouseleave', () => closeButton.style.opacity = '0.7');
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
    }

    function hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Download Resume Functionality
    function handleDownloadResume() {
        if (!downloadResumeBtn) return;

        downloadResumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const originalContent = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Preparing...</span>';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = originalContent;
                this.disabled = false;
                showNotification('Resume download will be available soon! Please contact me directly for a copy.', 'info');
            }, 1500);
        });
    }

    // Social Links Functionality
    function initializeSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link');
        
        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // If it's a placeholder link (href="#"), prevent default and show message
                if (href === '#') {
                    e.preventDefault();
                    
                    const icon = this.querySelector('i');
                    if (icon.classList.contains('fa-linkedin-in') || icon.classList.contains('fa-linkedin')) {
                        showNotification('LinkedIn profile will be updated soon! Feel free to connect via email.', 'info');
                    } else if (icon.classList.contains('fa-github')) {
                        showNotification('GitHub profile will be updated soon! Contact me to view my projects.', 'info');
                    }
                    
                    // Add visual feedback
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                }
            });
        });
    }

    // Project Links Functionality
    function initializeProjectLinks() {
        const projectLinks = document.querySelectorAll('.project-link');
        
        projectLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const icon = this.querySelector('i');
                if (icon.classList.contains('fa-github')) {
                    showNotification('Project repository will be available soon! Contact me for more details about this project.', 'info');
                } else {
                    showNotification('Live demo will be available soon! Feel free to ask me about this project.', 'info');
                }
                
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }

    // Keyboard Navigation
    function initializeKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Close mobile menu with Escape key
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
            
            // Navigate sections with Alt + Arrow keys
            if (e.altKey) {
                const sectionIds = ['#hero', '#about', '#skills', '#experience', '#projects', '#education', '#contact'];
                const currentActive = document.querySelector('.nav-link.active');
                if (!currentActive) return;
                
                const currentHref = currentActive.getAttribute('href');
                const currentIndex = sectionIds.indexOf(currentHref);
                
                if (e.key === 'ArrowDown' && currentIndex < sectionIds.length - 1) {
                    e.preventDefault();
                    smoothScrollTo(sectionIds[currentIndex + 1]);
                } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                    e.preventDefault();
                    smoothScrollTo(sectionIds[currentIndex - 1]);
                }
            }
        });
    }

    // Skill Tags Hover Effect
    function initializeSkillTags() {
        const skillTags = document.querySelectorAll('.skill-tag, .tech-tag');
        
        skillTags.forEach(tag => {
            tag.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            tag.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    // Scroll Event Handler (Throttled)
    let scrollTimeout;
    function handleScroll() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            updateActiveSection();
            updateNavbarBackground();
            updateBackToTopButton();
        }, 10);
    }

    // Event Listeners
    function attachEventListeners() {
        // Navigation
        if (hamburger) {
            hamburger.addEventListener('click', toggleMobileMenu);
        }
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                smoothScrollTo(targetId);
                closeMobileMenu();
            });
        });
        
        // Back to top button
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', function() {
                smoothScrollTo('#hero');
            });
        }
        
        // Scroll events
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Resize events
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
        
        // Footer "Back to Top" link
        const footerBackToTop = document.querySelector('.footer-links a[href="#hero"]');
        if (footerBackToTop) {
            footerBackToTop.addEventListener('click', function(e) {
                e.preventDefault();
                smoothScrollTo('#hero');
            });
        }
    }

    // Page Load Animation
    function initializePageLoadAnimation() {
        window.addEventListener('load', function() {
            document.body.classList.add('loaded');
            
            // Start hero animations
            setTimeout(() => {
                const heroElements = document.querySelectorAll('.hero-title, .hero-description, .hero-buttons, .social-links');
                heroElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, index * 200);
                });
            }, 300);
        });
        
        // Set initial opacity for hero elements
        const heroElements = document.querySelectorAll('.hero-title, .hero-description, .hero-buttons, .social-links');
        heroElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }

    // Initialize everything
    function initialize() {
        initializeTheme();
        initializeScrollAnimations();
        animateCounters();
        initializeTypingAnimation();
        handleContactForm();
        handleDownloadResume();
        initializeSocialLinks();
        initializeProjectLinks();
        initializeKeyboardNavigation();
        initializeSkillTags();
        initializePageLoadAnimation();
        attachEventListeners();
        
        // Initial calls
        updateActiveSection();
        updateNavbarBackground();
        updateBackToTopButton();
        
        // Set initial active link
        const homeLink = document.querySelector('a[href="#hero"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }

    // Add CSS for blink animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 50% { border-color: transparent; }
            51%, 100% { border-color: var(--color-primary); }
        }
        
        .field-error {
            animation: fadeInError 0.3s ease-out;
        }
        
        @keyframes fadeInError {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // Start the application
    initialize();
});

// Performance optimization: Intersection Observer polyfill fallback
if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    function fallbackAnimations() {
        const elements = document.querySelectorAll('.highlight-item, .skill-category, .experience-card, .education-card, .project-card');
        
        function checkVisibility() {
            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible && !element.classList.contains('animate')) {
                    element.classList.add('animate');
                }
            });
        }
        
        window.addEventListener('scroll', checkVisibility);
        checkVisibility(); // Initial check
    }
    
    document.addEventListener('DOMContentLoaded', fallbackAnimations);
}