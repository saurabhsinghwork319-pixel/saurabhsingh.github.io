// Portfolio App JavaScript - Fixed Navigation Edition
class PortfolioApp {
    constructor() {
        this.currentTheme = 'dark';
        this.currentExperience = 0;
        this.isScrolling = false;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isMobile = window.innerWidth <= 768;
        this.isTouch = 'ontouchstart' in window;
        this.resizeTimer = null;
        this.scrollTimer = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupParticleEffects();
        this.setupSkillProgressBars();
        this.setupSmoothScrolling();
        this.setupFormHandling();
        this.initializeAnimations();
        this.setupResponsiveOptimizations();
        
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
        this.setupSkillCardFlips();
        this.setupProfileImageFallback();
        this.setupTouchOptimizations();
        this.loadThemePreference();
        this.setupHeroButtons();
    }

    setupHeroButtons() {
        // Setup Contact Me button in hero
        const contactBtn = document.getElementById('contact-btn');
        if (contactBtn) {
            contactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    this.smoothScrollTo(contactSection);
                    this.setActiveNavLink(document.querySelector('[data-target="contact"]'));
                }
            });
        }

        // Setup Download Resume button in hero
        const resumeBtn = document.getElementById('resume-btn');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const resumeSection = document.getElementById('resume');
                if (resumeSection) {
                    this.smoothScrollTo(resumeSection);
                    this.setActiveNavLink(document.querySelector('[data-target="resume"]'));
                }
            });
        }
    }

    setupResponsiveOptimizations() {
        // Optimize for different screen sizes
        this.updateViewportUnits();
        this.optimizeForDevice();
        
        // Listen for orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.updateViewportUnits();
                this.optimizeForDevice();
            }, 100);
        });
    }

    updateViewportUnits() {
        // Fix viewport height issues on mobile browsers
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    optimizeForDevice() {
        this.isMobile = window.innerWidth <= 768;
        this.isTouch = 'ontouchstart' in window;
        
        // Add device-specific classes
        document.body.classList.toggle('mobile-device', this.isMobile);
        document.body.classList.toggle('touch-device', this.isTouch);
        
        // Optimize animations for mobile
        if (this.isMobile && !this.reducedMotion) {
            this.optimizeAnimationsForMobile();
        }
    }

    optimizeAnimationsForMobile() {
        // Reduce particle complexity on mobile
        const particles = document.getElementById('particles');
        if (particles && this.isMobile) {
            particles.style.opacity = '0.4';
            particles.style.backgroundSize = '150px 100px';
        }
        
        // Optimize orb animations
        const orbs = document.querySelectorAll('.orb');
        orbs.forEach(orb => {
            if (this.isMobile) {
                orb.style.filter = 'blur(60px)';
                orb.style.opacity = '0.15';
            }
        });
    }

    setupTouchOptimizations() {
        if (!this.isTouch) return;
        
        // Add touch-friendly interactions
        const touchElements = document.querySelectorAll('.skill-card, .project-tile, .experience-card, .profile-card-3d');
        
        touchElements.forEach(element => {
            let touchStartTime = 0;
            
            element.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                element.classList.add('touch-active');
            }, { passive: true });
            
            element.addEventListener('touchend', (e) => {
                const touchDuration = Date.now() - touchStartTime;
                element.classList.remove('touch-active');
                
                // Treat quick taps as clicks for card flips
                if (touchDuration < 300) {
                    this.handleCardFlip(element);
                }
            }, { passive: true });
            
            element.addEventListener('touchcancel', () => {
                element.classList.remove('touch-active');
            }, { passive: true });
        });
    }

    handleCardFlip(element) {
        const cardInner = element.querySelector('.skill-card-inner, .project-tile-inner, .experience-card-inner, .card-inner');
        if (!cardInner) return;
        
        const isFlipped = cardInner.style.transform.includes('rotateY(180deg)');
        cardInner.style.transform = isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
    }

    setupProfileImageFallback() {
        const profileImage = document.querySelector('.profile-image');
        const placeholder = document.querySelector('.avatar-placeholder');
        
        if (profileImage && placeholder) {
            // Handle load success
            profileImage.addEventListener('load', () => {
                profileImage.style.display = 'block';
                placeholder.style.display = 'none';
            });
            
            // Handle load error
            profileImage.addEventListener('error', () => {
                profileImage.style.display = 'none';
                placeholder.style.display = 'flex';
            });
            
            // Check initial state
            if (profileImage.complete) {
                if (profileImage.naturalHeight !== 0) {
                    profileImage.style.display = 'block';
                    placeholder.style.display = 'none';
                } else {
                    profileImage.style.display = 'none';
                    placeholder.style.display = 'flex';
                }
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

        // Optimized scroll and resize handlers
        window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 16), { passive: true });
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 100));
        
        // Mouse movement for parallax effects (desktop only)
        if (!this.reducedMotion && !this.isMobile) {
            document.addEventListener('mousemove', this.throttle((e) => this.handleMouseMove(e), 16), { passive: true });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Prevent zoom on double tap for iOS
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    setupNavigation() {
        // Get all navigation links (both data-target and href)
        const allNavLinks = document.querySelectorAll('.nav-link, a[href^="#"], [data-target]');
        
        allNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get target section ID
                let targetId = link.getAttribute('data-target') || 
                              link.getAttribute('href')?.substring(1) || 
                              null;
                
                // Skip empty or just "#" links
                if (!targetId || targetId === '') {
                    return;
                }
                
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    console.log(`Navigating to section: ${targetId}`); // Debug log
                    this.smoothScrollTo(targetSection);
                    this.setActiveNavLink(link);
                    
                    // Close mobile menu if open
                    const navMenu = document.getElementById('nav-menu');
                    if (navMenu && navMenu.classList.contains('active')) {
                        this.toggleMobileMenu();
                    }
                } else {
                    console.warn(`Section not found: ${targetId}`); // Debug log
                }
            });
        });

        // Setup social links
        this.setupSocialLinks();
    }

    setupSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                let url = '';
                const icon = link.querySelector('span').textContent;
                
                // Determine URL based on icon
                if (icon === '💻') {
                    url = 'https://github.com/saurabhsingh319';
                } else if (icon === '💼') {
                    url = 'https://linkedin.com/in/saurabhsingh319';
                } else if (icon === '🐦') {
                    url = 'https://twitter.com/saurabhsingh319';
                }
                
                if (url) {
                    window.open(url, '_blank', 'noopener,noreferrer');
                } else {
                    this.showNotification('Social profile will be available soon!', 'info');
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
            });
        });
    }

    setupSkillCardFlips() {
        const skillCards = document.querySelectorAll('.skill-card');
        const projectTiles = document.querySelectorAll('.project-tile');
        const experienceCards = document.querySelectorAll('.experience-card');
        
        // Combine all flippable cards
        const allCards = [...skillCards, ...projectTiles, ...experienceCards];
        
        allCards.forEach((card) => {
            const cardInner = card.querySelector('.skill-card-inner, .project-tile-inner, .experience-card-inner');
            if (!cardInner) return;
            
            let isFlipped = false;
            let flipTimeout;
            
            // Click to flip (works on all devices)
            card.addEventListener('click', (e) => {
                // Don't flip if clicking on project links
                if (e.target.classList.contains('project-link')) {
                    return;
                }
                
                e.preventDefault();
                isFlipped = !isFlipped;
                cardInner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
            });
            
            // Hover effects for desktop only
            if (!this.isMobile && !this.isTouch) {
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
                        }, 150);
                    }
                });
            }
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.2,
            rootMargin: '-10% 0px -10% 0px'
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
        if (this.reducedMotion) return;

        const particles = document.getElementById('particles');
        if (!particles) return;

        // Reduce particle density on mobile for better performance
        if (this.isMobile) {
            particles.style.opacity = '0.3';
            particles.style.backgroundSize = '150px 100px';
        }
    }

    setupSkillProgressBars() {
        const skillCards = document.querySelectorAll('.skill-card');
        const progressBars = document.querySelectorAll('.progress-bar');
        
        // Initialize progress bars
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
                        }, 300);
                    }
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

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

        // Auto-advance carousel (pause on mobile to save battery)
        if (!this.reducedMotion && !this.isMobile) {
            this.carouselInterval = setInterval(() => this.nextExperience(), 8000);
        }

        // Touch/swipe support for mobile
        if (this.isTouch) {
            this.setupCarouselSwipe(track);
        }

        this.updateExperienceCarousel();
    }

    setupCarouselSwipe(track) {
        let startX = 0;
        let startY = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Prevent scrolling if horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY)) {
                e.preventDefault();
            }
        }, { passive: false });

        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextExperience();
                } else {
                    this.previousExperience();
                }
            }
            
            isDragging = false;
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
        if (profileCard) {
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

        // 3D hover effects for buttons and cards
        const elements3D = document.querySelectorAll('.btn-3d, .social-icon');
        elements3D.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.add3DHoverEffect(e.target);
            });
            
            element.addEventListener('mouseleave', (e) => {
                this.remove3DHoverEffect(e.target);
            });
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
        // This is now handled in setupNavigation()
        console.log('Smooth scrolling setup completed');
    }

    initializeAnimations() {
        if (this.reducedMotion) return;

        // Animate elements on page load with staggered timing
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);

        // Stagger animations for different sections
        const animatedElements = document.querySelectorAll('.skill-card, .project-tile, .experience-card');
        animatedElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 + index * 100);
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
            const isActive = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active', isActive);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? 'hidden' : '';
            
            // Update aria attributes for accessibility
            hamburger.setAttribute('aria-expanded', isActive);
            navMenu.setAttribute('aria-hidden', !isActive);
        }
    }

    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        if (activeLink && activeLink.classList.contains('nav-link')) {
            activeLink.classList.add('active');
        }
    }

    smoothScrollTo(target) {
        if (!target) return;
        
        const headerHeight = document.querySelector('.nav')?.offsetHeight || 70;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        console.log(`Scrolling to position: ${targetPosition}`); // Debug log
        
        // Use native smooth scroll with fallback
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            // Fallback for browsers that don't support smooth scroll
            this.animateScroll(targetPosition, 800);
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
            indicator.classList.toggle('active', index === this.currentExperience);
        });
        
        // Update card states
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === this.currentExperience);
        });
    }

    // Modal Methods
    openModal() {
        const modal = document.getElementById('resume-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Focus management
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            }
            
            this.showNotification('Resume preview opened!', 'success');
        }
    }

    closeModal() {
        const modal = document.getElementById('resume-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    downloadResume() {
        // Create comprehensive resume content
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
- Strong academic performance in computer science fundamentals
- Leadership roles in technology clubs and societies
- Multiple project presentations and technical demonstrations
- Collaborative projects with peer groups

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

Bachelor's Education | Computer Applications (2021 - 2024) 
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
                const subject = encodeURIComponent('Portfolio Contact - ' + data.name);
                const body = encodeURIComponent(
                    `Hello Saurabh,\n\nNew message from your portfolio:\n\nName: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}\n\nBest regards,\n${data.name}`
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
                    transition: opacity 0.3s ease;
                `;
                formGroup.appendChild(errorDiv);
            }
            errorDiv.textContent = message;
            input.style.borderColor = '#ff5454';
        } else {
            if (errorDiv) {
                errorDiv.remove();
            }
            input.style.borderColor = '';
        }
    }

    clearInputError(input) {
        this.toggleInputError(input, false, '');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 3D Effects Methods
    add3DHoverEffect(element) {
        if (this.reducedMotion || this.isMobile) return;
        
        element.style.transform = 'translateY(-6px) scale(1.02)';
        element.style.boxShadow = '0 12px 48px rgba(0, 212, 170, 0.25)';
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
            const opacity = Math.min(scrolled / 100, 0.95);
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
        // Update device detection
        const wasMobile = this.isMobile;
        this.optimizeForDevice();
        
        // Close mobile menu on resize to larger screen
        if (wasMobile && !this.isMobile) {
            const navMenu = document.getElementById('nav-menu');
            const hamburger = document.getElementById('hamburger');
            
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger?.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
        
        // Update viewport units
        this.updateViewportUnits();
        
        // Reinitialize components that depend on screen size
        this.setupSkillCardFlips();
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
            orb.style.transform = `translate(${moveX * 10 * multiplier}px, ${moveY * 10 * multiplier}px)`;
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
                this.toggleMobileMenu();
            }
        }
        
        // Arrow key navigation for carousel
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.closest('.experience-carousel')) {
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
            if (!element.classList.contains('animated')) {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.classList.add('animated');
                }, index * 100);
            }
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const bgColor = type === 'success' ? 'rgba(0, 212, 170, 0.2)' : 
                       type === 'error' ? 'rgba(255, 84, 84, 0.2)' : 
                       'rgba(0, 153, 255, 0.2)';
        
        const borderColor = type === 'success' ? '#00D4AA' : 
                           type === 'error' ? '#ff5454' : 
                           '#0099FF';
        
        notification.style.cssText = `
            position: fixed;
            top: ${this.isMobile ? '70px' : '90px'};
            right: ${this.isMobile ? '10px' : '20px'};
            left: ${this.isMobile ? '10px' : 'auto'};
            padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem);
            background: ${bgColor};
            border: 1px solid ${borderColor};
            border-radius: clamp(8px, 2vw, 10px);
            color: var(--text-primary);
            backdrop-filter: blur(20px);
            box-shadow: var(--shadow-3d);
            z-index: 1500;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: ${this.isMobile ? 'auto' : '320px'};
            font-size: clamp(0.8rem, 2vw, 0.9rem);
            font-weight: 500;
            text-align: center;
            word-wrap: break-word;
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
            }, 400);
        }, 4000);
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    
    // Make app globally accessible for debugging
    window.portfolioApp = app;
    
    // Add performance monitoring
    if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark('portfolio-app-initialized');
    }
    
    // Add smooth reveal animations for initial load
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const revealElements = document.querySelectorAll('.hero-text, .hero-visual');
        revealElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 200 + index * 150);
        });
    }
    
    // Add loading completion class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Handle page visibility changes (optimize performance when tab is inactive)
document.addEventListener('visibilitychange', () => {
    if (window.portfolioApp) {
        if (document.hidden) {
            // Pause animations when page is hidden
            if (window.portfolioApp.carouselInterval) {
                clearInterval(window.portfolioApp.carouselInterval);
            }
        } else {
            // Resume animations when page is visible
            if (!window.portfolioApp.reducedMotion && !window.portfolioApp.isMobile) {
                window.portfolioApp.carouselInterval = setInterval(() => 
                    window.portfolioApp.nextExperience(), 8000);
            }
        }
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    if (window.portfolioApp) {
        window.portfolioApp.showNotification('Connection restored!', 'success');
    }
});

window.addEventListener('offline', () => {
    if (window.portfolioApp) {
        window.portfolioApp.showNotification('You are offline. Some features may not work.', 'info');
    }
});

// Handle page load complete
window.addEventListener('load', () => {
    // Ensure all components are initialized
    if (window.portfolioApp) {
        window.portfolioApp.setupProfileImageFallback();
        
        // Mark performance milestone
        if (typeof performance !== 'undefined' && performance.mark) {
            performance.mark('portfolio-app-loaded');
        }
    }
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker when available
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Add CSS to handle touch states
const touchStyles = document.createElement('style');
touchStyles.textContent = `
    .touch-active {
        transform: scale(0.98) !important;
        transition: transform 0.1s ease !important;
    }
    
    @media (max-width: 768px) {
        .skill-card:hover .skill-card-inner,
        .project-tile:hover .project-tile-inner,
        .experience-card:hover .experience-card-inner {
            transform: none;
        }
        
        .btn-3d:hover,
        .social-link:hover .social-icon {
            transform: none;
        }
        
        .nav-link:hover {
            transform: none;
        }
    }
`;
document.head.appendChild(touchStyles);