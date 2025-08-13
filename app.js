// Mobile-Optimized Portfolio App JavaScript
class MobilePortfolioApp {
    constructor() {
        this.currentTheme = 'dark';
        this.currentExperience = 0;
        this.isScrolling = false;
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.touchStartY = 0;
        this.touchStartX = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupParticleEffects();
        this.setupSkillProgressBars();
        this.setupSmoothScrolling();
        this.setupFormHandling();
        this.setupTouchHandling();
        this.initializeAnimations();
        
        // Initialize components after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        this.setupNavigation();
        this.setupExperienceCarousel();
        this.setupModalHandling();
        this.setup3DEffects();
        this.setupProjectLinks();
        this.setupMobileInteractions();
        this.setupProfileImageFallback();
        this.loadThemePreference();
        this.setupAccessibility();
    }

    setupProfileImageFallback() {
        const profileImage = document.querySelector('.profile-image');
        const placeholder = document.querySelector('.avatar-placeholder');
        
        if (profileImage && placeholder) {
            // Check if image loads successfully
            profileImage.addEventListener('load', () => {
                profileImage.style.display = 'block';
                placeholder.style.display = 'none';
            });
            
            // Handle image load error
            profileImage.addEventListener('error', () => {
                profileImage.style.display = 'none';
                placeholder.style.display = 'flex';
            });
            
            // Check if image is already loaded
            if (profileImage.complete && profileImage.naturalHeight !== 0) {
                profileImage.style.display = 'block';
                placeholder.style.display = 'none';
            } else if (profileImage.complete && profileImage.naturalHeight === 0) {
                profileImage.style.display = 'none';
                placeholder.style.display = 'flex';
            }
        }
    }

    setupEventListeners() {
        // Navigation
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const themeToggle = document.getElementById('theme-toggle');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }
        
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }

        // Optimized scroll events for mobile
        window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 16), { passive: true });
        window.addEventListener('resize', this.throttle(() => this.handleResize(), 250));
        
        // Mouse movement for parallax effects (desktop only)
        if (!this.reducedMotion && !this.isMobile) {
            document.addEventListener('mousemove', this.throttle((e) => this.handleMouseMove(e), 16));
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Touch events for mobile optimization
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    }

    setupTouchHandling() {
        // Handle touch events for better mobile interactions
        const touchElements = document.querySelectorAll('.skill-card, .project-tile, .experience-card, .profile-card-3d');
        
        touchElements.forEach(element => {
            let touchStartTime;
            let isLongPress = false;
            let longPressTimer;
            
            element.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                isLongPress = false;
                
                // Long press detection for mobile
                longPressTimer = setTimeout(() => {
                    isLongPress = true;
                    this.handleLongPress(element, e);
                }, 500);
            }, { passive: true });
            
            element.addEventListener('touchend', (e) => {
                clearTimeout(longPressTimer);
                const touchDuration = Date.now() - touchStartTime;
                
                if (!isLongPress && touchDuration < 500) {
                    this.handleTap(element, e);
                }
            }, { passive: true });
            
            element.addEventListener('touchmove', () => {
                clearTimeout(longPressTimer);
            }, { passive: true });
        });
    }

    handleTap(element, e) {
        // Handle tap interactions for mobile
        if (element.classList.contains('skill-card')) {
            this.flipCard(element.querySelector('.skill-card-inner'));
        } else if (element.classList.contains('project-tile')) {
            this.flipCard(element.querySelector('.project-tile-inner'));
        } else if (element.classList.contains('experience-card')) {
            this.flipCard(element.querySelector('.experience-card-inner'));
        } else if (element.classList.contains('profile-card-3d')) {
            this.flipCard(element.querySelector('.card-inner'));
        }
        
        // Provide haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    handleLongPress(element, e) {
        // Handle long press for additional context or actions
        console.log('Long press detected on:', element);
        
        // Provide haptic feedback for long press
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }

    flipCard(cardInner) {
        if (!cardInner) return;
        
        const currentTransform = cardInner.style.transform;
        const isFlipped = currentTransform.includes('rotateY(180deg)');
        
        cardInner.style.transform = isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
    }

    setupNavigation() {
        // Navigation links with data-target attribute
        const navLinks = document.querySelectorAll('[data-target]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    this.smoothScrollTo(targetSection);
                    this.setActiveNavLink(link);
                    
                    // Close mobile menu if open
                    const navMenu = document.getElementById('nav-menu');
                    const hamburger = document.getElementById('hamburger');
                    if (navMenu && navMenu.classList.contains('active')) {
                        this.closeMobileMenu();
                    }
                }
            });
        });

        // Handle legacy href navigation as fallback
        const hrefLinks = document.querySelectorAll('a[href^="#"]');
        hrefLinks.forEach(link => {
            if (!link.hasAttribute('data-target')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        this.smoothScrollTo(targetSection);
                    }
                });
            }
        });
    }

    setupMobileInteractions() {
        // Enhanced mobile interactions for cards
        const interactiveCards = document.querySelectorAll('.skill-card, .project-tile, .experience-card');
        
        interactiveCards.forEach(card => {
            const cardInner = card.querySelector('.skill-card-inner, .project-tile-inner, .experience-card-inner');
            if (!cardInner) return;
            
            let isFlipped = false;
            let flipTimeout;
            
            // Touch-friendly flip interaction
            card.addEventListener('click', (e) => {
                // Don't flip if clicking on project links
                if (e.target.classList.contains('project-link')) {
                    return;
                }
                
                e.preventDefault();
                isFlipped = !isFlipped;
                cardInner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
                
                // Update ARIA attributes for accessibility
                card.setAttribute('aria-expanded', isFlipped);
            });
            
            // Desktop hover effects (only for non-touch devices)
            if (!this.isMobile && window.matchMedia('(hover: hover)').matches) {
                card.addEventListener('mouseenter', () => {
                    if (!isFlipped) {
                        clearTimeout(flipTimeout);
                        cardInner.style.transform = 'rotateY(180deg)';
                    }
                });
                
                card.addEventListener('mouseleave', () => {
                    if (!isFlipped) {
                        flipTimeout = setTimeout(() => {
                            cardInner.style.transform = 'rotateY(0deg)';
                        }, 100);
                    }
                });
            }
            
            // Keyboard interaction
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    isFlipped = !isFlipped;
                    cardInner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
                    card.setAttribute('aria-expanded', isFlipped);
                }
            });
        });
    }

    setupProjectLinks() {
        const projectLinks = document.querySelectorAll('.project-link');
        projectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent card flip
                
                const linkText = link.textContent;
                this.showNotification(`${linkText} functionality will be available soon!`, 'info');
                
                // In a real implementation, you would open the actual links:
                // window.open(link.href, '_blank', 'noopener,noreferrer');
            });
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: this.isMobile ? 0.1 : 0.3,
            rootMargin: this.isMobile ? '-5% 0px -5% 0px' : '-10% 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const navLink = document.querySelector(`[data-target="${id}"]`) || 
                                   document.querySelector(`.nav-link[href="#${id}"]`);
                    if (navLink) {
                        this.setActiveNavLink(navLink);
                    }
                    
                    // Trigger animations for sections coming into view
                    this.triggerSectionAnimations(entry.target);
                }
            });
        }, options);

        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }

    setupParticleEffects() {
        if (this.reducedMotion || this.isMobile) return;

        const particles = document.getElementById('particles');
        if (!particles) return;

        // Create fewer particle layers for better mobile performance
        const layerCount = this.isMobile ? 1 : 3;
        
        for (let i = 0; i < layerCount; i++) {
            const layer = document.createElement('div');
            layer.className = `particle-layer particle-layer-${i}`;
            layer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: radial-gradient(1px 1px at 20px 30px, rgba(0, 212, 170, ${0.2 - i * 0.05}), transparent),
                                  radial-gradient(1px 1px at 40px 70px, rgba(0, 153, 255, ${0.2 - i * 0.05}), transparent);
                background-repeat: repeat;
                background-size: ${150 + i * 30}px ${120 + i * 20}px;
                animation: particles-float ${25 + i * 5}s linear infinite;
                animation-delay: ${i * -3}s;
            `;
            particles.appendChild(layer);
        }
    }

    setupSkillProgressBars() {
        const skillCards = document.querySelectorAll('.skill-card');
        const progressBars = document.querySelectorAll('.progress-bar');
        
        // Set up progress bar animations
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress') || '0';
            bar.style.setProperty('--progress-width', '0%');
        });

        // Intersection observer for skill animations
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.progress-bar');
                    if (progressBar) {
                        const progress = progressBar.getAttribute('data-progress');
                        setTimeout(() => {
                            progressBar.style.setProperty('--progress-width', `${progress}%`);
                        }, 200);
                    }
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: this.isMobile ? 0.2 : 0.5 });

        skillCards.forEach(card => skillObserver.observe(card));
    }

    setupExperienceCarousel() {
        const track = document.getElementById('experience-track');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const indicators = document.querySelectorAll('.indicator');
        const cards = document.querySelectorAll('.experience-card');
        
        if (!track || cards.length === 0) return;

        this.totalExperiences = cards.length;

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousExperience();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextExperience();
            });
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToExperience(index);
            });
        });

        // Touch gestures for carousel
        this.setupCarouselTouchGestures(track);

        // Auto-advance carousel (disabled on mobile for better control)
        if (!this.reducedMotion && !this.isMobile) {
            this.carouselInterval = setInterval(() => this.nextExperience(), 10000);
        }

        this.updateExperienceCarousel();
    }

    setupCarouselTouchGestures(track) {
        if (!track) return;
        
        let startX = 0;
        let startY = 0;
        let isSwipe = false;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwipe = false;
        }, { passive: true });
        
        track.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Determine if it's a horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
                isSwipe = true;
            }
        }, { passive: true });
        
        track.addEventListener('touchend', (e) => {
            if (!isSwipe || !startX) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextExperience();
                } else {
                    this.previousExperience();
                }
            }
            
            startX = 0;
            startY = 0;
            isSwipe = false;
        }, { passive: true });
    }

    setupModalHandling() {
        const modal = document.getElementById('resume-modal');
        const downloadBtn = document.getElementById('download-resume');
        const viewBtn = document.getElementById('view-resume');
        const closeBtn = document.getElementById('modal-close');
        const overlay = document.getElementById('modal-overlay');
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadResume();
            });
        }
        
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    setup3DEffects() {
        if (this.reducedMotion || this.isMobile) return;

        // Profile card 3D rotation (desktop only)
        const profileCard = document.getElementById('profile-card');
        if (profileCard && !this.isMobile) {
            profileCard.addEventListener('mousemove', (e) => {
                const rect = profileCard.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                
                const rotateX = (mouseY / rect.height) * 5; // Reduced intensity
                const rotateY = -(mouseX / rect.width) * 5;
                
                profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            profileCard.addEventListener('mouseleave', () => {
                profileCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        }

        // 3D hover effects for buttons and cards (desktop only)
        const elements3D = document.querySelectorAll('.btn-3d, .social-icon');
        elements3D.forEach(element => {
            if (!this.isMobile) {
                element.addEventListener('mouseenter', (e) => {
                    this.add3DHoverEffect(e.target);
                });
                
                element.addEventListener('mouseleave', (e) => {
                    this.remove3DHoverEffect(e.target);
                });
            }
        });
    }

    setupFormHandling() {
        const form = document.getElementById('contact-form');
        const statusDiv = document.getElementById('form-status');
        
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            
            // Basic validation
            if (!data.name || !data.email || !data.message) {
                this.showFormStatus('Please fill in all fields.', 'error');
                return;
            }
            
            if (!this.isValidEmail(data.email)) {
                this.showFormStatus('Please enter a valid email address.', 'error');
                return;
            }
            
            try {
                // Show loading state
                const submitBtn = form.querySelector('.submit-btn');
                const originalText = submitBtn.querySelector('span').textContent;
                submitBtn.querySelector('span').textContent = 'Sending...';
                submitBtn.disabled = true;
                
                await this.submitForm(data);
                this.showFormStatus('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
                
                // Reset button
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.disabled = false;
            } catch (error) {
                this.showFormStatus('Sorry, there was an error sending your message. Please try again.', 'error');
                
                // Reset button
                const submitBtn = form.querySelector('.submit-btn');
                submitBtn.querySelector('span').textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        });
        
        // Real-time validation feedback
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('focus', () => this.clearInputError(input));
        });
    }

    setupSmoothScrolling() {
        // Override default anchor link behavior for any remaining links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            if (!link.hasAttribute('data-target') && link.getAttribute('href') !== '#') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const target = document.getElementById(targetId);
                    if (target) {
                        this.smoothScrollTo(target);
                    }
                });
            }
        });
    }

    setupAccessibility() {
        // Manage focus for mobile menu
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
                hamburger.setAttribute('aria-expanded', !isExpanded);
            });
        }
        
        // Focus management for modals
        const modal = document.getElementById('resume-modal');
        if (modal) {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    this.trapFocus(modal, e);
                }
            });
        }
        
        // Remove focus styles when using mouse
        document.addEventListener('mousedown', () => {
            document.body.classList.add('using-mouse');
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.remove('using-mouse');
            }
        });
    }

    initializeAnimations() {
        if (this.reducedMotion) return;

        // Animate elements on page load with mobile-optimized timing
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);

        // Stagger animations for cards with mobile-friendly delays
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            card.style.animationDelay = `${index * (this.isMobile ? 0.05 : 0.1)}s`;
        });

        const projectTiles = document.querySelectorAll('.project-tile');
        projectTiles.forEach((tile, index) => {
            tile.style.animationDelay = `${index * (this.isMobile ? 0.1 : 0.15)}s`;
        });
    }

    // Utility Methods
    throttle(func, wait) {
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

    debounce(func, wait) {
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

    // Navigation Methods
    toggleMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            const isActive = navMenu.classList.contains('active');
            
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', !isActive);
            
            // Prevent body scroll when menu is open on mobile
            if (this.isMobile) {
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            }
            
            // Focus management
            if (!isActive) {
                // Menu opening - focus first link
                const firstLink = navMenu.querySelector('.nav-link');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 100);
                }
            }
        }
    }

    closeMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            link.setAttribute('aria-current', 'false');
        });
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
        }
    }

    smoothScrollTo(target) {
        if (!target) return;
        
        const headerHeight = document.querySelector('.nav')?.offsetHeight || (this.isMobile ? 70 : 80);
        const targetPosition = target.offsetTop - headerHeight;
        
        // Use native smooth scroll with fallback
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            // Fallback for browsers that don't support smooth scroll
            this.animateScroll(targetPosition, this.isMobile ? 600 : 800);
        }
    }

    animateScroll(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    // Theme Methods
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'dark' ? '🌓' : '☀️';
        }
        
        // Save preference
        try {
            localStorage.setItem('portfolio-theme', this.currentTheme);
        } catch (e) {
            console.warn('Could not save theme preference:', e);
        }
        
        // Announce theme change to screen readers
        this.announceToScreenReader(`Theme changed to ${this.currentTheme} mode`);
    }

    loadThemePreference() {
        try {
            const savedTheme = localStorage.getItem('portfolio-theme');
            if (savedTheme) {
                this.currentTheme = savedTheme;
                document.documentElement.setAttribute('data-theme', this.currentTheme);
                
                const themeIcon = document.querySelector('.theme-icon');
                if (themeIcon) {
                    themeIcon.textContent = this.currentTheme === 'dark' ? '🌓' : '☀️';
                }
            }
        } catch (e) {
            console.warn('Could not load theme preference:', e);
        }
    }

    // Experience Carousel Methods
    nextExperience() {
        this.currentExperience = (this.currentExperience + 1) % this.totalExperiences;
        this.updateExperienceCarousel();
    }

    previousExperience() {
        this.currentExperience = this.currentExperience === 0 ? this.totalExperiences - 1 : this.currentExperience - 1;
        this.updateExperienceCarousel();
    }

    goToExperience(index) {
        if (index >= 0 && index < this.totalExperiences) {
            this.currentExperience = index;
            this.updateExperienceCarousel();
        }
    }

    updateExperienceCarousel() {
        const track = document.getElementById('experience-track');
        const indicators = document.querySelectorAll('.indicator');
        const cards = document.querySelectorAll('.experience-card');
        
        if (!track) return;
        
        track.style.transform = `translateX(-${this.currentExperience * 100}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            const isActive = index === this.currentExperience;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-selected', isActive);
        });
        
        // Update card states
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === this.currentExperience);
        });
        
        // Announce change to screen readers
        const activeCard = cards[this.currentExperience];
        if (activeCard) {
            const title = activeCard.querySelector('h3')?.textContent;
            if (title) {
                this.announceToScreenReader(`Now showing: ${title}`);
            }
        }
    }

    // Modal Methods
    openModal() {
        const modal = document.getElementById('resume-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Focus trap setup
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            }
            
            // Announce modal opening
            this.announceToScreenReader('Resume preview opened');
        }
    }

    closeModal() {
        const modal = document.getElementById('resume-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            
            // Return focus to trigger element
            const viewResumeBtn = document.getElementById('view-resume');
            if (viewResumeBtn) {
                viewResumeBtn.focus();
            }
            
            // Announce modal closing
            this.announceToScreenReader('Resume preview closed');
        }
    }

    downloadResume() {
        const resumeData = this.generateResumeText();
        const blob = new Blob([resumeData], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Saurabh_Singh_Resume.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Resume download started!', 'success');
        this.announceToScreenReader('Resume download started');
    }

    generateResumeText() {
        return `SAURABH SINGH
Aspiring AI/ML Engineer | Data Science Enthusiast

CONTACT INFORMATION
Email: saurabhsinghworks319@gmail.com
Phone: +91 7991280696
Location: India

PROFESSIONAL SUMMARY
Passionate about building intelligent systems and solving complex problems with data. Aspiring AI/ML Engineer with strong foundation in computer science and hands-on experience in machine learning projects.

EDUCATION
Bachelor's of Computer Applications
Jhunjhunwala PG College Faculty of Engineering and Technology • 2021 - 2024
- Strong academic performance
- Leadership in tech clubs  
- Multiple project presentations
- Comprehensive computer science education with focus on programming fundamentals

TECHNICAL SKILLS
Programming Languages:
- Python (Advanced) - 85%
- SQL (Intermediate) - 75%
- Bash/Shell Scripting - 80%

Machine Learning & AI:
- Machine Learning - 80%
- TensorFlow, PyTorch, scikit-learn
- Natural Language Processing
- Predictive Analytics
- AI Tools (OpenAI, Hugging Face, LangChain) - 70%

Data Science:
- Data Science - 85%
- Pandas, NumPy, Matplotlib, Seaborn
- Statistical Analysis - 75%
- Data Visualization
- Business Intelligence

Backend Development:
- Backend Development - 70%
- FastAPI, REST APIs, Django
- Database Management (MySQL, PostgreSQL, SQLite)

Automation & DevOps:
- Automation - 80%
- Linux System Administration
- Git Version Control
- Process Automation Scripts

KEY PROJECTS

1. AI Chat Assistant
   - Built intelligent conversational AI system with NLP capabilities
   - Technologies: Python, TensorFlow, NLP, FastAPI
   - Achievement: 90% user satisfaction rate
   - Features: Natural language understanding, context awareness, scalable architecture

2. Data Analytics Dashboard  
   - Created interactive business intelligence dashboard
   - Technologies: Python, Pandas, Matplotlib, Streamlit
   - Achievement: Improved decision making by 40%
   - Features: Real-time data visualization, interactive filtering, automated reporting

3. Predictive Model System
   - Developed ML system for predictive analytics and forecasting
   - Technologies: Python, scikit-learn, TensorFlow, SQL
   - Achievement: 95% prediction accuracy
   - Features: Ensemble methods, deep learning models, automated feature engineering

4. Automation Toolkit
   - Collection of automation scripts for workflow optimization
   - Technologies: Python, Bash, Linux, Cron
   - Achievement: Saved 20+ hours weekly
   - Features: Task scheduling, process monitoring, error handling

EXPERIENCE & ACHIEVEMENTS

Self-Directed Learning | AI/ML Studies (2023 - Present)
- Built 10+ machine learning projects from concept to deployment
- Completed multiple AI/ML courses and certifications
- Active participant in tech communities and forums
- Focused on practical application of AI/ML concepts
- Continuous learning in emerging technologies

Bachelor's Education | Jhunjhunwala PG College Faculty of Engineering and Technology (2021 - 2024) 
- Strong academic performance in computer science fundamentals
- Leadership roles in technology clubs and societies
- Multiple project presentations and technical demonstrations
- Collaborative projects with peer groups
- Foundation in software development principles

CORE COMPETENCIES
- Problem-solving and analytical thinking
- Machine learning model development and deployment
- Data analysis and visualization
- Software development best practices
- Team collaboration and leadership
- Continuous learning and adaptation
- Technical documentation and communication

INTERESTS
- Artificial Intelligence and Machine Learning research
- Open source contributions
- Tech community participation
- Emerging technology trends
- Data-driven problem solving

Generated on: ${new Date().toLocaleDateString()}`;
    }

    // Form Methods
    async submitForm(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                
                // Create mailto link as fallback
                const subject = encodeURIComponent('Portfolio Contact Form - ' + data.name);
                const body = encodeURIComponent(
                    `Hello Saurabh,\n\nYou have received a new message from your portfolio website:\n\nName: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}\n\nBest regards,\n${data.name}`
                );
                const mailtoLink = `mailto:saurabhsinghworks319@gmail.com?subject=${subject}&body=${body}`;
                
                // Open email client
                window.open(mailtoLink, '_blank');
                
                resolve();
            }, 1500);
        });
    }

    showFormStatus(message, type) {
        const statusDiv = document.getElementById('form-status');
        if (!statusDiv) return;
        
        statusDiv.textContent = message;
        statusDiv.className = `form-status ${type}`;
        
        // Announce to screen readers
        this.announceToScreenReader(message);
        
        setTimeout(() => {
            statusDiv.className = 'form-status';
        }, 5000);
    }

    validateInput(input) {
        const value = input.value.trim();
        let isValid = true;
        let message = '';
        
        if (input.type === 'email') {
            isValid = this.isValidEmail(value);
            message = isValid ? '' : 'Please enter a valid email address';
        } else if (input.required) {
            isValid = value.length > 0;
            message = isValid ? '' : 'This field is required';
        }
        
        this.toggleInputError(input, !isValid, message);
        return isValid;
    }

    toggleInputError(input, hasError, message) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;
        
        let errorDiv = formGroup.querySelector('.input-error');
        
        if (hasError) {
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'input-error';
                errorDiv.style.cssText = `
                    color: #ff5454;
                    font-size: 0.8rem;
                    margin-top: 0.5rem;
                `;
                errorDiv.setAttribute('role', 'alert');
                formGroup.appendChild(errorDiv);
            }
            errorDiv.textContent = message;
            input.classList.add('error');
            input.style.borderColor = '#ff5454';
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', errorDiv.id || 'error-' + input.id);
        } else {
            if (errorDiv) {
                errorDiv.remove();
            }
            input.classList.remove('error');
            input.style.borderColor = '';
            input.setAttribute('aria-invalid', 'false');
            input.removeAttribute('aria-describedby');
        }
    }

    clearInputError(input) {
        this.toggleInputError(input, false, '');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Touch Events
    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
        this.touchStartX = e.touches[0].clientX;
    }

    handleTouchMove(e) {
        // Can be used for custom gesture handling if needed
    }

    handleTouchEnd(e) {
        // Can be used for custom gesture handling if needed
    }

    // 3D Effects Methods
    add3DHoverEffect(element) {
        if (this.reducedMotion || this.isMobile) return;
        
        element.style.transform = 'translateY(-4px) scale(1.02)';
        element.style.boxShadow = '0 8px 32px rgba(0, 212, 170, 0.3)';
    }

    remove3DHoverEffect(element) {
        element.style.transform = '';
        element.style.boxShadow = '';
    }

    // Event Handlers
    handleScroll() {
        const scrolled = window.pageYOffset;
        const nav = document.getElementById('nav');
        
        // Update navigation background opacity
        if (nav) {
            const opacity = Math.min(scrolled / 50, 0.98);
            nav.style.backgroundColor = `rgba(11, 18, 32, ${opacity})`;
        }
        
        // Parallax effect for background elements (desktop only)
        if (!this.reducedMotion && !this.isMobile) {
            const particles = document.getElementById('particles');
            if (particles) {
                particles.style.transform = `translateY(${scrolled * 0.05}px)`;
            }
        }
    }

    handleResize() {
        const newIsMobile = window.innerWidth <= 768;
        const newIsTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        
        // Update device detection
        if (this.isMobile !== newIsMobile || this.isTablet !== newIsTablet) {
            this.isMobile = newIsMobile;
            this.isTablet = newIsTablet;
            
            // Reinitialize mobile-specific features
            this.setupMobileInteractions();
        }
        
        // Close mobile menu on resize to larger screen
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    handleMouseMove(e) {
        if (this.reducedMotion || this.isMobile) return;
        
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;
        
        // Apply subtle parallax to background orbs
        const orbs = document.querySelectorAll('.orb');
        orbs.forEach((orb, index) => {
            const multiplier = (index + 1) * 0.01;
            orb.style.transform = `translate(${moveX * 15 * multiplier}px, ${moveY * 15 * multiplier}px)`;
        });
    }

    handleKeyDown(e) {
        // Handle keyboard navigation
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        // Escape key handlers
        if (e.key === 'Escape') {
            const modal = document.getElementById('resume-modal');
            const navMenu = document.getElementById('nav-menu');
            
            if (modal && !modal.classList.contains('hidden')) {
                this.closeModal();
            } else if (navMenu && navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        }
        
        // Arrow key navigation for carousel
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.closest('.experience-carousel')) {
                e.preventDefault();
                if (e.key === 'ArrowLeft') {
                    this.previousExperience();
                } else {
                    this.nextExperience();
                }
            }
        }
    }

    triggerSectionAnimations(section) {
        if (this.reducedMotion) return;
        
        const animatedElements = section.querySelectorAll('.skill-card, .project-tile, .experience-card');
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * (this.isMobile ? 50 : 100));
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        const bgColor = type === 'success' ? 'rgba(0, 212, 170, 0.2)' : 
                       type === 'error' ? 'rgba(255, 84, 84, 0.2)' : 
                       'rgba(0, 153, 255, 0.2)';
        
        const borderColor = type === 'success' ? '#00D4AA' : 
                           type === 'error' ? '#ff5454' : 
                           '#0099FF';
        
        notification.style.cssText = `
            position: fixed;
            top: ${this.isMobile ? '80px' : '100px'};
            right: ${this.isMobile ? '10px' : '20px'};
            left: ${this.isMobile ? '10px' : 'auto'};
            padding: 1rem 1.5rem;
            background: ${bgColor};
            border: 1px solid ${borderColor};
            border-radius: 10px;
            color: var(--text-primary);
            backdrop-filter: blur(10px);
            box-shadow: var(--shadow-3d);
            z-index: 1500;
            opacity: 0;
            transform: translateY(-20px);
            transition: var(--transition-smooth);
            max-width: ${this.isMobile ? 'calc(100% - 20px)' : '300px'};
            font-size: 0.9rem;
            font-weight: 500;
            text-align: center;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    trapFocus(modal, e) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new MobilePortfolioApp();
    
    // Make app globally available for debugging
    window.portfolioApp = app;
    
    // Add smooth reveal animations for initial load
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const revealElements = document.querySelectorAll('.hero-text, .hero-visual, .skill-card, .project-tile');
        revealElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * (app.isMobile ? 50 : 100));
        });
    }
    
    // Add loading completion class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
    
    // Optimize for mobile performance
    if (app.isMobile) {
        // Disable heavy animations on slower devices
        const isSlowDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        if (isSlowDevice) {
            document.documentElement.style.setProperty('--transition-smooth', 'all 0.2s ease');
            document.documentElement.style.setProperty('--transition-bounce', 'all 0.3s ease');
        }
        
        // Add viewport height CSS custom property for mobile
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
    }
});

// Handle page load complete
window.addEventListener('load', () => {
    // Ensure all components are initialized
    if (window.portfolioApp) {
        window.portfolioApp.setupProfileImageFallback();
    }
    
    // Remove any preloader if present
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 500);
    }
});

// Handle page visibility changes for mobile optimization
document.addEventListener('visibilitychange', () => {
    if (window.portfolioApp && window.portfolioApp.carouselInterval) {
        if (document.hidden) {
            // Pause animations when tab is not visible
            clearInterval(window.portfolioApp.carouselInterval);
        } else {
            // Resume animations when tab becomes visible
            if (!window.portfolioApp.reducedMotion && !window.portfolioApp.isMobile) {
                window.portfolioApp.carouselInterval = setInterval(() => 
                    window.portfolioApp.nextExperience(), 10000);
            }
        }
    }
});