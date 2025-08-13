// Portfolio App JavaScript
class PortfolioApp {
    constructor() {
        this.currentTheme = 'dark';
        this.currentExperience = 0;
        this.isScrolling = false;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
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
        this.setupProfileImage();
    }

    setupProfileImage() {
        const profileImage = document.getElementById('profile-image');
        const fallbackPlaceholder = document.getElementById('avatar-fallback');
        
        if (!profileImage || !fallbackPlaceholder) return;

        // Function to show/hide elements
        const showImage = () => {
            profileImage.style.opacity = '1';
            profileImage.style.zIndex = '2';
            fallbackPlaceholder.classList.remove('show');
        };

        const showFallback = () => {
            profileImage.style.opacity = '0';
            profileImage.style.zIndex = '1';
            fallbackPlaceholder.classList.add('show');
        };

        // Check if image loads successfully
        if (profileImage.complete) {
            // Image is already loaded
            if (profileImage.naturalWidth > 0) {
                showImage();
            } else {
                showFallback();
            }
        } else {
            // Image is still loading
            profileImage.addEventListener('load', showImage);
            profileImage.addEventListener('error', showFallback);
        }

        // Set up a timeout fallback in case the image takes too long
        setTimeout(() => {
            if (!profileImage.complete || profileImage.naturalWidth === 0) {
                showFallback();
            }
        }, 3000);
    }

    setupEventListeners() {
        // Navigation
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const themeToggle = document.getElementById('theme-toggle');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Scroll events
        window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 16));
        window.addEventListener('resize', this.throttle(() => this.handleResize(), 250));
        
        // Mouse movement for parallax effects
        if (!this.reducedMotion) {
            document.addEventListener('mousemove', this.throttle((e) => this.handleMouseMove(e), 16));
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    this.smoothScrollTo(targetSection);
                    this.setActiveNavLink(link);
                    
                    // Close mobile menu if open
                    const navMenu = document.getElementById('nav-menu');
                    if (navMenu && navMenu.classList.contains('active')) {
                        this.toggleMobileMenu();
                    }
                }
            });
        });

        // CTA button handlers
        const resumeBtn = document.getElementById('resume-btn');
        const contactBtn = document.getElementById('contact-btn');
        
        if (resumeBtn) {
            resumeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const resumeSection = document.getElementById('resume');
                if (resumeSection) {
                    this.smoothScrollTo(resumeSection);
                }
            });
        }
        
        if (contactBtn) {
            contactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    this.smoothScrollTo(contactSection);
                }
            });
        }

        // Footer navigation links
        const footerLinks = document.querySelectorAll('.footer-links a');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    this.smoothScrollTo(targetSection);
                }
            });
        });
    }

    setupProjectLinks() {
        const projectLinks = document.querySelectorAll('.project-link');
        projectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Since these are placeholder links, show a notification instead
                const linkText = link.textContent;
                this.showNotification(`${linkText} functionality will be available soon!`, 'info');
                
                // In a real implementation, you would open the actual links:
                // window.open(link.href, '_blank', 'noopener,noreferrer');
            });
        });
    }

    setupSkillCardFlips() {
        const skillCards = document.querySelectorAll('.skill-card');
        
        skillCards.forEach(card => {
            let isFlipped = false;
            
            card.addEventListener('click', () => {
                const cardInner = card.querySelector('.skill-card-inner');
                if (cardInner) {
                    isFlipped = !isFlipped;
                    cardInner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
                }
            });
            
            // Also trigger on hover for desktop
            if (window.innerWidth > 768) {
                card.addEventListener('mouseenter', () => {
                    const cardInner = card.querySelector('.skill-card-inner');
                    if (cardInner && !isFlipped) {
                        cardInner.style.transform = 'rotateY(180deg)';
                    }
                });
                
                card.addEventListener('mouseleave', () => {
                    const cardInner = card.querySelector('.skill-card-inner');
                    if (cardInner && !isFlipped) {
                        cardInner.style.transform = 'rotateY(0deg)';
                    }
                });
            }
        });

        // Setup project tile flips
        const projectTiles = document.querySelectorAll('.project-tile');
        
        projectTiles.forEach(tile => {
            let isFlipped = false;
            
            tile.addEventListener('click', () => {
                const tileInner = tile.querySelector('.project-tile-inner');
                if (tileInner) {
                    isFlipped = !isFlipped;
                    tileInner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
                }
            });
            
            // Also trigger on hover for desktop
            if (window.innerWidth > 768) {
                tile.addEventListener('mouseenter', () => {
                    const tileInner = tile.querySelector('.project-tile-inner');
                    if (tileInner && !isFlipped) {
                        tileInner.style.transform = 'rotateY(180deg)';
                    }
                });
                
                tile.addEventListener('mouseleave', () => {
                    const tileInner = tile.querySelector('.project-tile-inner');
                    if (tileInner && !isFlipped) {
                        tileInner.style.transform = 'rotateY(0deg)';
                    }
                });
            }
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.3,
            rootMargin: '-10% 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
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

        // Create additional particle layers for depth
        const particleLayers = [];
        for (let i = 0; i < 3; i++) {
            const layer = document.createElement('div');
            layer.className = `particle-layer particle-layer-${i}`;
            layer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: radial-gradient(2px 2px at 20px 30px, rgba(0, 212, 170, ${0.3 - i * 0.1}), transparent),
                                  radial-gradient(2px 2px at 40px 70px, rgba(0, 153, 255, ${0.3 - i * 0.1}), transparent),
                                  radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, ${0.4 - i * 0.1}), transparent);
                background-repeat: repeat;
                background-size: ${200 + i * 50}px ${150 + i * 25}px;
                animation: particles-float ${20 + i * 5}s linear infinite;
                animation-delay: ${i * -2}s;
            `;
            particles.appendChild(layer);
            particleLayers.push(layer);
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
        }, { threshold: 0.5 });

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
            prevBtn.addEventListener('click', () => this.previousExperience());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextExperience());
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToExperience(index));
        });

        // Auto-advance carousel
        if (!this.reducedMotion) {
            setInterval(() => this.nextExperience(), 8000);
        }

        this.updateExperienceCarousel();
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
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => this.closeModal());
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    setup3DEffects() {
        if (this.reducedMotion) return;

        // Profile card 3D rotation
        const profileCard = document.getElementById('profile-card');
        if (profileCard) {
            profileCard.addEventListener('mousemove', (e) => {
                const rect = profileCard.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                
                const rotateX = (mouseY / rect.height) * 10;
                const rotateY = -(mouseX / rect.width) * 10;
                
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
                if (!this.reducedMotion) {
                    this.add3DHoverEffect(e.target);
                }
            });
            
            element.addEventListener('mouseleave', (e) => {
                if (!this.reducedMotion) {
                    this.remove3DHoverEffect(e.target);
                }
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
        // Override default anchor link behavior
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            if (link.getAttribute('href') !== '#') {
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

    initializeAnimations() {
        if (this.reducedMotion) return;

        // Animate elements on page load
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);

        // Stagger animations for skill cards
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });

        // Stagger animations for project tiles
        const projectTiles = document.querySelectorAll('.project-tile');
        projectTiles.forEach((tile, index) => {
            tile.style.animationDelay = `${index * 0.15}s`;
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
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        }
    }

    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    smoothScrollTo(target) {
        if (!target) return;
        
        const headerHeight = document.querySelector('.nav')?.offsetHeight || 80;
        const targetPosition = target.offsetTop - headerHeight;
        
        // Use native smooth scroll
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
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
        localStorage.setItem('portfolio-theme', this.currentTheme);
    }

    loadThemePreference() {
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            
            const themeIcon = document.querySelector('.theme-icon');
            if (themeIcon) {
                themeIcon.textContent = this.currentTheme === 'dark' ? '🌓' : '☀️';
            }
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
        this.currentExperience = index;
        this.updateExperienceCarousel();
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
            
            // Focus trap
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
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
        // Create a more comprehensive resume content
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
        
        // Show success message
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
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // In a real application, replace this with actual form submission
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
                formGroup.appendChild(errorDiv);
            }
            errorDiv.textContent = message;
            input.classList.add('error');
            input.style.borderColor = '#ff5454';
        } else {
            if (errorDiv) {
                errorDiv.remove();
            }
            input.classList.remove('error');
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
        if (this.reducedMotion) return;
        
        element.style.transform = 'translateY(-8px) scale(1.05)';
        element.style.boxShadow = '0 12px 48px rgba(0, 212, 170, 0.3)';
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
        
        // Parallax effect for background elements
        if (!this.reducedMotion) {
            const particles = document.getElementById('particles');
            if (particles) {
                particles.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        }
    }

    handleResize() {
        // Close mobile menu on resize to larger screen
        if (window.innerWidth > 768) {
            const navMenu = document.getElementById('nav-menu');
            const hamburger = document.getElementById('hamburger');
            
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger?.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
        
        // Reinitialize flip interactions based on screen size
        this.setupSkillCardFlips();
    }

    handleMouseMove(e) {
        if (this.reducedMotion) return;
        
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;
        
        // Apply subtle parallax to background orbs
        const orbs = document.querySelectorAll('.orb');
        orbs.forEach((orb, index) => {
            const multiplier = (index + 1) * 0.02;
            orb.style.transform = `translate(${moveX * 20 * multiplier}px, ${moveY * 20 * multiplier}px)`;
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
    }

    triggerSectionAnimations(section) {
        if (this.reducedMotion) return;
        
        const animatedElements = section.querySelectorAll('.skill-card, .project-tile, .experience-card');
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
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
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${bgColor};
            border: 1px solid ${borderColor};
            border-radius: 10px;
            color: var(--text-primary);
            backdrop-filter: blur(20px);
            box-shadow: var(--shadow-3d);
            z-index: 1500;
            opacity: 0;
            transform: translateX(100%);
            transition: var(--transition-smooth);
            max-width: 300px;
            font-size: 0.9rem;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
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
    
    // Load theme preference
    app.loadThemePreference();
    
    // Add smooth reveal animations for initial load
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const revealElements = document.querySelectorAll('.hero-text, .hero-visual, .skill-card, .project-tile');
        revealElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Add loading completion class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});