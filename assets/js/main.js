// main.js - Complete GSAP Replacement for Webflow Interactions
// This replaces all Webflow interaction code with pure GSAP/JS equivalents
// while preserving all functionality and adding performance optimizations

// DEBUG MODE - Set to false in production
const DEBUG_MODE = true;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP plugins
    if (typeof gsap === 'undefined') {
        if (DEBUG_MODE) console.warn('GSAP is not loaded. Please ensure GSAP libraries are loaded before this script.');
        return;
    }

    gsap.registerPlugin(
        ScrollTrigger, 
        CustomEase, 
        CustomBounce, 
        CustomWiggle, 
        EasePack,
        Flip
    );
    
    // Initialize variables to be updated later
    let lenis;
    let isMobile = window.innerWidth <= 767;
    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let scrollPosition = 0;
    
    // Performance optimization: Use requestAnimationFrame for scroll handling
    function handleScroll() {
        scrollPosition = window.scrollY;
        requestAnimationFrame(handleScroll);
    }
    requestAnimationFrame(handleScroll);
    
    // Initialize Lenis smooth scrolling with performance optimizations
    function initScroll() {
        lenis = new Lenis({
            lerp: reducedMotion ? 0.1 : 0.1,
            smoothWheel: true,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
            wheelMultiplier: 0.8,
            normalizeWheel: true,
            orientation: 'vertical'
        });
        
        // Optimize scroll updates
        let lastScrollTime = 0;
        const scrollUpdateThreshold = 16; // ~60fps
        
        lenis.on('scroll', ({ scroll }) => {
            const now = Date.now();
            if (now - lastScrollTime >= scrollUpdateThreshold) {
                ScrollTrigger.update();
                lastScrollTime = now;
            }
        });
        
        // Handle animation frame for Lenis
        function animationFrame(time) {
            lenis.raf(time);
            requestAnimationFrame(animationFrame);
        }
        requestAnimationFrame(animationFrame);
        
        // Ensure ScrollTrigger updates on resize
        window.addEventListener('resize', () => {
            ScrollTrigger.refresh();
            isMobile = window.innerWidth <= 767;
        });
        
        // Optimize font loading handling
        document.fonts.ready.then(() => {
            window.dispatchEvent(new CustomEvent('fontsLoaded'));
        });
        
        // Initial refresh
        ScrollTrigger.refresh();
    }
    
    // Initialize core animations that don't depend on fonts
    function initCoreAnimations() {
        // Hero text background animation - optimized with single timeline
        const heroTextElements = gsap.utils.toArray('.big-text.v1, .big-text.v2, .big-text.tight.v-1, .big-text.tight.v-2, .big-text.tight.v-3');
        heroTextElements.forEach(el => {
            gsap.to(el, {
                backgroundPosition: '200% center',
                duration: reducedMotion ? 0 : 20,
                ease: 'none',
                repeat: -1,
                yoyo: true,
                paused: reducedMotion
            });
        });
        
        // Initialize cursor effects
        initCursorEffects();
        
        // Initialize navbar/mobile menu
        initNavbar();
        
        // Initialize project card interactions
        initProjectCards();
        
        // Initialize accordion and tab interactions
        initAccordions();
        
        // Initialize marquee/carousel effects
        initMarquees();
        
        // Initialize CTA section effects
        initCTA();
        
        // Initialize footer interactions
        initFooter();
    }
    
    // Initialize cursor effects with performance optimizations
    function initCursorEffects() {
        const cursorCore = document.querySelector('.cursor-core');
        const cursor = document.querySelector('.cursor-pointer');
        const cursorText = document.querySelector('.pointer-text');
        const cursorBg = document.querySelector('.bg-cursor');
        
        if (!cursorCore || !cursor || !cursorText || !cursorBg) {
            if (DEBUG_MODE) console.warn('Cursor elements not found');
            return;
        }
        
        // Set initial cursor position
        gsap.set(cursorCore, { xPercent: -50, yPercent: -50 });
        
        // Mouse tracking with requestAnimationFrame optimization
        const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let lastX = mouse.x;
        let lastY = mouse.y;
        let currentX = mouse.x;
        let currentY = mouse.y;
        
        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        
        // Optimized cursor follow animation
        function animateCursor() {
            // Use lerp for smooth following
            currentX += (mouse.x - currentX) * 0.1;
            currentY += (mouse.y - currentY) * 0.1;
            
            // Only update position if movement is significant
            const distance = Math.hypot(currentX - lastX, currentY - lastY);
            if (distance > 0.5) {
                gsap.set(cursorCore, { x: currentX, y: currentY });
                lastX = currentX;
                lastY = currentY;
            }
            
            requestAnimationFrame(animateCursor);
        }
        requestAnimationFrame(animateCursor);
        
        // Project card hover effects
        const projectCards = gsap.utils.toArray('[data-anim="cursor-grow"]');
        
        if (projectCards.length === 0) {
            if (DEBUG_MODE) console.warn('No project cards found - check data-anim="cursor-grow" attributes');
        }
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(cursor, { 
                    width: '6vw', 
                    height: '6vw', 
                    duration: reducedMotion ? 0 : 0.5,
                    ease: 'outQuint'
                });
                gsap.to(cursorText, { 
                    opacity: 1, 
                    duration: reducedMotion ? 0 : 0.5,
                    ease: 'outQuint'
                });
                gsap.to(cursorBg, { 
                    opacity: 1, 
                    duration: reducedMotion ? 0 : 0.25,
                    ease: 'outQuint'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(cursor, { 
                    width: '1vw', 
                    height: '1vw', 
                    duration: reducedMotion ? 0 : 0.5,
                    ease: 'outQuint'
                });
                gsap.to(cursorText, { 
                    opacity: 0, 
                    duration: reducedMotion ? 0 : 0.3,
                    ease: 'outQuint'
                });
                gsap.to(cursorBg, { 
                    opacity: 0, 
                    duration: reducedMotion ? 0 : 0.5,
                    ease: 'outQuint'
                });
            });
        });
        
        // Special cursor effects for certain elements
        const invertElements = gsap.utils.toArray('[data-anim="cursor-invert"]');
        
        if (invertElements.length === 0) {
            if (DEBUG_MODE) console.warn('No invert elements found - check data-anim="cursor-invert" attributes');
        }
        
        const trailWrap = document.querySelector('[data-anim="image-trail-wrap"]');
        
        invertElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, { 
                    backdropFilter: 'invert(0)', 
                    duration: reducedMotion ? 0 : 0.3,
                    ease: 'power2.out'
                });
                if (trailWrap) {
                    gsap.to(trailWrap, { 
                        opacity: 0, 
                        duration: reducedMotion ? 0 : 0.3,
                        ease: 'power2.out'
                    });
                }
            });
            
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, { 
                    backdropFilter: 'invert(1)', 
                    duration: reducedMotion ? 0 : 0.3,
                    ease: 'power2.out'
                });
                if (trailWrap) {
                    gsap.to(trailWrap, { 
                        opacity: 1, 
                        duration: reducedMotion ? 0 : 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }
    
    // Initialize navbar with performance optimizations
    function initNavbar() {
        const menu = document.querySelector('[data-anim-nav="menu"]');
        const openButton = document.querySelector('[data-anim-nav="open"]');
        const closeButton = document.querySelector('[data-anim-nav="close"]');
        const links = gsap.utils.toArray('[data-anim-nav="link"]');
        
        if (!menu || !openButton || !closeButton) {
            if (DEBUG_MODE) console.warn('Navbar elements not found - check data-anim-nav attributes');
            return;
        }
        
        // Set initial menu state
        gsap.set(menu, { xPercent: 100, display: 'none' });
        gsap.set(links, { x: 50, opacity: 0 });
        
        // Create menu animation timeline
        const navTl = gsap.timeline({ 
            paused: true, 
            defaults: { 
                ease: 'outQuint', 
                duration: reducedMotion ? 0 : 0.6 
            }
        })
        .set(menu, { display: 'flex' })
        .to(menu, { xPercent: 0 })
        .to(links, {
            x: 0,
            opacity: 1,
            stagger: 0.05,
            duration: reducedMotion ? 0 : 0.4
        }, '-=0.3');
        
        // Menu open/close handlers
        openButton.addEventListener('click', () => {
            if (!navTl.isActive()) navTl.play();
        });
        
        closeButton.addEventListener('click', () => {
            if (!navTl.isActive()) navTl.reverse();
        });
        
        // Link hover animations
        links.forEach(link => {
            gsap.set(link, { x: 0 }); // Initial state
            
            const linkTl = gsap.timeline({ paused: true })
                .to(link, { 
                    x: -500, 
                    duration: reducedMotion ? 0 : 0.5,
                    ease: 'outQuint'
                })
                .set(link, { x: -500 })
                .to(link, { 
                    x: 0, 
                    duration: reducedMotion ? 0 : 0.5,
                    ease: 'outQuint'
                });
            
            link.addEventListener('mouseenter', () => {
                if (!reducedMotion) linkTl.play();
            });
            
            link.addEventListener('mouseleave', () => {
                if (!reducedMotion) linkTl.reverse();
            });
            
            // Close menu on link click for mobile
            link.addEventListener('click', () => {
                if (isMobile) {
                    navTl.reverse();
                }
            });
        });
    }
    
    // Initialize hero section effects
    function initHeroSection() {
        // Check for hero title element
        const heroTitle = document.querySelector('[data-anim-load="hero-title"]');
        if (!heroTitle) {
            if (DEBUG_MODE) console.warn('Hero title not found - check data-anim-load attributes');
            return;
        }
        
        // Hero text entrance animation
        gsap.set('[data-anim-load="hero-title"]', {
            scale: 2,
            x: '30vw',
            y: '30vh'
        });
        
        const loadTl = gsap.timeline({ 
            delay: reducedMotion ? 0 : 0.5, 
            defaults: { 
                ease: 'outQuint',
                duration: reducedMotion ? 0 : 1
            }
        });
        
        loadTl.to('[data-anim-load="hero-title"]', {
            scale: reducedMotion ? 1 : 1,
            x: reducedMotion ? 0 : 0,
            y: reducedMotion ? 0 : 0,
            duration: reducedMotion ? 0 : 2.0,
            ease: 'inOutQuint'
        });
        
        loadTl.from('[data-anim-load="fade-in-up"]', {
            y: '100%',
            opacity: 0,
            stagger: 0.2,
            duration: reducedMotion ? 0 : 1.0
        }, '-=0.5');
        
        // Check for image trail wrapper
        const wrapper = document.querySelector('[data-anim="image-trail-wrap"]');
        if (!wrapper) {
            if (DEBUG_MODE) console.warn('Image trail wrapper not found - check data-anim attribute');
            return;
        }
        
        loadTl.fromTo(wrapper, 
            { 
                display: 'none', 
                opacity: 0 
            }, {
                display: 'block', 
                opacity: 1, 
                duration: reducedMotion ? 0 : 0.5, 
                ease: 'inOutQuint'
            }, '<'
        );
        
        // Hero image trail effect with mouse and touch support
        const images = gsap.utils.toArray('.content-img-wrap');
        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let cache = { x: mouse.x, y: mouse.y };
        let index = 0;
        let threshold = 80;
        let activeImages = 0;
        let idle = true;
        
        // Mouse movement tracking
        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        
        // Touch support
        window.addEventListener('touchstart', e => {
            const touch = e.touches[0];
            mouse.x = touch.clientX;
            mouse.y = touch.clientY;
            showNextImage();
        }, { passive: true });
        
        window.addEventListener('touchmove', e => {
            const touch = e.touches[0];
            mouse.x = touch.clientX;
            mouse.y = touch.clientY;
        }, { passive: true });
        
        // GSAP ticker for smooth animation
        gsap.ticker.add(() => {
            cache.x = gsap.utils.interpolate(cache.x, mouse.x, 0.1);
            cache.y = gsap.utils.interpolate(cache.y, mouse.y, 0.1);
            
            const dist = Math.hypot(mouse.x - cache.x, mouse.y - cache.y);
            if (dist > threshold) {
                showNextImage();
                cache.x = mouse.x;
                cache.y = mouse.y;
            }
        });
        
        function showNextImage() {
            if (reducedMotion) return;
            
            index++;
            const img = images[index % images.length];
            const rect = img.getBoundingClientRect();
            
            gsap.killTweensOf(img);
            gsap.set(img, {
                opacity: 0,
                scale: 0,
                zIndex: index,
                x: cache.x - rect.width / 2,
                y: cache.y - rect.height / 2
            });
            
            // Image trail animation
            gsap.timeline({
                onStart: () => { activeImages++; idle = false; },
                onComplete: () => {
                    activeImages--;
                    if (activeImages === 0) idle = true;
                }
            })
            .to(img, {
                duration: 0.4,
                opacity: 1,
                scale: 1,
                x: mouse.x - rect.width / 2,
                y: mouse.y - rect.height / 2,
                ease: 'power2.out'
            })
            .to(img, {
                duration: 0.8,
                opacity: 0,
                scale: 0.2,
                ease: 'power2.in',
                x: cache.x - rect.width / 2,
                y: cache.y - rect.height / 2
            }, '+=0.3');
        }
    }
    
    // Initialize parallax effects
    function initParallax() {
        gsap.utils.toArray('[data-anim-parallax]').forEach(container => {
            const target = container.querySelector('[data-anim-parallax-target]');
            if (target && !reducedMotion) {
                gsap.to(target, {
                    yPercent: -10,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: container,
                        scrub: 1.2,
                        invalidateOnRefresh: true
                    }
                });
            }
        });
    }
    
    // Initialize link hover effects
    function initLinkHovers() {
        gsap.utils.toArray('[data-anim="link-underline"]').forEach(link => {
            const line = link.querySelector('.animated-link-line');
            if (!line) return;
            
            // Replicate the specific "slide out, jump left, slide in" effect
            const tl = gsap.timeline({ paused: true, defaults: { duration: reducedMotion ? 0 : 0.5 } })
                .to(line, { x: '101%', ease: 'outQuint' })
                .set(line, { x: '-101%' })
                .to(line, { x: '0%', ease: 'outQuint' });
            
            link.addEventListener('mouseenter', () => {
                if (!reducedMotion) tl.play(0);
            });
        });
    }
    
    // Initialize accordions
    function initAccordions() {
        const accordions = gsap.utils.toArray('[data-anim-accordion="item"]');
        
        if (accordions.length === 0) {
            if (DEBUG_MODE) console.warn('No accordions found - check data-anim-accordion attributes');
        }
        
        accordions.forEach((item, index) => {
            const header = item.querySelector('[data-anim-accordion="header"]');
            const content = item.querySelector('[data-anim-accordion="content"]');
            const icon = item.querySelector('[data-anim-accordion="icon"]');
            
            // Set initial states
            gsap.set(content, { height: 0, opacity: 0, display: 'none' });
            
            // Open the first one by default
            if (index === 0) {
                item.classList.add('is-active');
                gsap.set(content, { height: 'auto', opacity: 1, display: 'flex' });
                gsap.set(icon, { rotation: 90 });
            }
            
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('is-active');
                
                // Close all other accordions
                accordions.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('is-active')) {
                        toggleAccordion(otherItem, false);
                    }
                });
                
                // Toggle current accordion
                toggleAccordion(item, !isActive);
            });
        });
        
        function toggleAccordion(item, open) {
            const content = item.querySelector('[data-anim-accordion="content"]');
            const icon = item.querySelector('[data-anim-accordion="icon"]');
            
            if (open) {
                item.classList.add('is-active');
                gsap.set(content, { display: 'flex', height: 'auto' });
                
                const contentHeight = content.scrollHeight;
                gsap.set(content, { height: 0, opacity: 0 });
                
                gsap.to(content, {
                    height: contentHeight,
                    opacity: 1,
                    duration: reducedMotion ? 0 : 0.5,
                    ease: 'outQuint',
                    onComplete: () => {
                        gsap.set(content, { height: 'auto' });
                    }
                });
                
                gsap.to(icon, {
                    rotation: 90,
                    duration: reducedMotion ? 0 : 0.5,
                    ease: 'outQuint'
                });
            } else {
                item.classList.remove('is-active');
                gsap.to(content, {
                    height: 0,
                    opacity: 0,
                    duration: reducedMotion ? 0 : 0.5,
                    ease: 'outQuint',
                    onComplete: () => {
                        gsap.set(content, { display: 'none' });
                    }
                });
                
                gsap.to(icon, {
                    rotation: 0,
                    duration: reducedMotion ? 0 : 0.5,
                    ease: 'outQuint'
                });
            }
        }
    }
    
    // Initialize marquees/carousels
    function initMarquees() {
        gsap.utils.toArray('[data-anim-marquee="wrap"]').forEach(wrap => {
            const inner = wrap.querySelector('[data-anim-marquee="inner"]');
            const content = inner.querySelector('[data-anim-marquee="content"]');
            if (!inner || !content) return;
            
            const isReverse = wrap.classList.contains('reverse');
            
            // Clone content for seamless loop
            const contentClone = content.cloneNode(true);
            inner.appendChild(contentClone);
            
            gsap.set(inner, { xPercent: isReverse ? -50 : 0 });
            
            if (!reducedMotion) {
                // Looping animation
                gsap.to(inner, {
                    xPercent: isReverse ? 0 : -50,
                    duration: 120,
                    ease: 'none',
                    repeat: -1,
                    paused: true
                }).play();
                
                // Scroll-based animation
                gsap.to(inner, {
                    xPercent: isReverse ? -25 : -25,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: wrap,
                        scrub: 1.2,
                        invalidateOnRefresh: true
                    }
                });
            }
        });
    }
    
    // Initialize CTA section effects
    function initCTA() {
        const fog = document.querySelector('[data-anim="cta-fog"]');
        if (!fog || reducedMotion) return;
        
        // Fog animation
        gsap.set(fog, { x: 0 });
        gsap.to(fog, {
            x: '-200%',
            duration: 20,
            ease: 'none',
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % 200)
            }
        });
    }
    
    // Initialize project cards
    function initProjectCards() {
        // Glitch effect setup
        const glitchTL = gsap.timeline({ 
            paused: true, 
            defaults: { 
                ease: 'power2.inOut'
            }
        })
        .to('#glitchNoise', { attr: { baseFrequency: '0.05 1.2' }, duration: reducedMotion ? 0 : 0.12 })
        .to('#glitchDisp', { attr: { scale: 60 }, duration: reducedMotion ? 0 : 0.12 }, '<')
        .to('#glitchRGB', { attr: { dx: 6 }, duration: reducedMotion ? 0 : 0.12 }, '<')
        .to('#glitchNoise', { attr: { baseFrequency: '0.02 0.6' }, duration: reducedMotion ? 0 : 0.2 })
        .to('#glitchDisp', { attr: { scale: 30 }, duration: reducedMotion ? 0 : 0.2 }, '<')
        .to('#glitchRGB', { attr: { dx: 3 }, duration: reducedMotion ? 0 : 0.2 }, '<')
        .to('#glitchNoise', { attr: { baseFrequency: '0 0' }, duration: reducedMotion ? 0 : 0.25 })
        .to('#glitchDisp', { attr: { scale: 0 }, duration: reducedMotion ? 0 : 0.25 }, '<')
        .to('#glitchRGB', { attr: { dx: 0 }, duration: reducedMotion ? 0 : 0.25 }, '<');
        
        // Helper: reset filter attributes
        function resetFilterAttrs() {
            gsap.set('#glitchNoise', { attr: { baseFrequency: '0 0' } });
            gsap.set('#glitchDisp', { attr: { scale: 0 } });
            gsap.set('#glitchRGB', { attr: { dx: 0 } });
        }
        
        // Reset initial state
        resetFilterAttrs();
        
        // Desktop hover glitch effect
        const cursor = document.querySelector('.cursor-pointer');
        gsap.utils.toArray('[data-anim="cursor-grow"]').forEach(card => {
            if (!cursor) return;
            
            card.addEventListener('mouseenter', () => {
                cursor.style.filter = 'none';
                cursor.offsetWidth; // Force reflow
                resetFilterAttrs();
                cursor.style.filter = 'url(#cyberGlitch)';
                if (!reducedMotion) glitchTL.restart(true);
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to({}, { 
                    duration: reducedMotion ? 0 : 0.05, 
                    onComplete: () => {
                        if (cursor) cursor.style.filter = 'none';
                    }
                });
            });
        });
        
        // Mobile touch glitch effect
        gsap.utils.toArray('.single-project-wrap').forEach(trigger => {
            const mobileButton = trigger.querySelector('.mobile-button');
            if (!mobileButton) return;
            
            const mobileGlitchTL = gsap.timeline({ 
                paused: true, 
                defaults: { 
                    ease: 'power2.inOut'
                }
            })
            .to('#glitchNoise', { attr: { baseFrequency: '0.05 1.2' }, duration: reducedMotion ? 0 : 0.12 })
            .to('#glitchDisp', { attr: { scale: 60 }, duration: reducedMotion ? 0 : 0.12 }, '<')
            .to('#glitchRGB', { attr: { dx: 6 }, duration: reducedMotion ? 0 : 0.12 }, '<')
            .to('#glitchNoise', { attr: { baseFrequency: '0.02 0.6' }, duration: reducedMotion ? 0 : 0.2 })
            .to('#glitchDisp', { attr: { scale: 30 }, duration: reducedMotion ? 0 : 0.2 }, '<')
            .to('#glitchRGB', { attr: { dx: 3 }, duration: reducedMotion ? 0 : 0.2 }, '<')
            .to('#glitchNoise', { attr: { baseFrequency: '0 0' }, duration: reducedMotion ? 0 : 0.25 })
            .to('#glitchDisp', { attr: { scale: 0 }, duration: reducedMotion ? 0 : 0.25 }, '<')
            .to('#glitchRGB', { attr: { dx: 0 }, duration: reducedMotion ? 0 : 0.25 }, '<');
            
            function playMobileGlitch(el) {
                if (reducedMotion) return;
                el.style.filter = 'url(#cyberGlitch)';
                mobileGlitchTL.restart(true);
                gsap.delayedCall(mobileGlitchTL.duration(), () => {
                    el.style.filter = 'none';
                    resetFilterAttrs();
                });
            }
            
            function isTabletOrBelow() {
                return window.innerWidth <= 991;
            }
            
            trigger.addEventListener('touchstart', e => { 
                if (isTabletOrBelow() && !isMobile) playMobileGlitch(mobileButton);
            }, { passive: true });
            
            trigger.addEventListener('click', e => {
                if (isMobile) playMobileGlitch(mobileButton);
            });
        });
    }
    
    // Initialize footer interactions
    function initFooter() {
        const footerLinks = gsap.utils.toArray('.footer-link');
        footerLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    color: '#9f9f9f',
                    duration: reducedMotion ? 0 : 0.3,
                    ease: 'power2.out'
                });
            });
            
            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    color: 'inherit',
                    duration: reducedMotion ? 0 : 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }
    
    // Initialize all animations after fonts are loaded and GSAP is ready
    function initAllAnimations() {
        initCoreAnimations();
        
        // Initialize scroll-triggered animations after a small delay
        gsap.delayedCall(reducedMotion ? 0 : 0.5, () => {
            initHeroSection();
            initParallax();
            initLinkHovers();
        });
    }
    
    // Start the animation system
    function startAnimations() {
        initScroll();
        initAllAnimations();
        
        // Initial page visibility setup
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause all animations when tab is not visible
                gsap.globalTimeline.pause();
            } else {
                // Resume animations when tab becomes visible
                gsap.globalTimeline.play();
            }
        });
        
        // Ensure everything is visible after all animations are set up
        gsap.set('[data-start="hidden"]', { autoAlpha: 1 });
        
        // Debug mode logging
        if (DEBUG_MODE) {
            console.log('Required data attributes check:');
            console.log('- data-anim-nav:', document.querySelectorAll('[data-anim-nav]').length);
            console.log('- data-anim="cursor-grow":', document.querySelectorAll('[data-anim="cursor-grow"]').length);
            console.log('- data-anim-load:', document.querySelectorAll('[data-anim-load]').length);
            console.log('- data-anim-parallax:', document.querySelectorAll('[data-anim-parallax]').length);
            console.log('- data-anim-accordion:', document.querySelectorAll('[data-anim-accordion]').length);
            console.log('- data-anim-marquee:', document.querySelectorAll('[data-anim-marquee]').length);
        }
    }
    
    // Start animations when fonts are loaded
    if (document.fonts.status === 'loaded') {
        startAnimations();
    } else {
        window.addEventListener('fontsLoaded', startAnimations);
        // Fallback in case font loading takes too long
        setTimeout(startAnimations, 3000);
    }
    
    // Expose lenis globally for other scripts
    window.lenis = lenis;
    
    console.log('GSAP animations fully initialized');
});
