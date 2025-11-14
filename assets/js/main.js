

/*
================================================================================
DAVAI - CUSTOM ANIMATIONS MASTER FILE
(Replaces all Webflow JS, jQuery, and custom inline scripts)
================================================================================
*/

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. --- GLOBAL SETUP (PLUGINS & SCROLL) ---
  // =================================================

  // Register only the plugins we are actually using
  gsap.registerPlugin(Flip, ScrollTrigger);

  // Use your more detailed Lenis setup
  const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false
  });

  // Update ScrollTrigger on scroll
  lenis.on('scroll', ScrollTrigger.update);

  // Animation frame loop for Lenis
  function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Store Lenis globally if needed elsewhere
  window.lenis = lenis;

  // This event tells our scroll-based animations when it's safe to run
  const sendGsapEvent = () => {
    window.dispatchEvent(new CustomEvent("GSAPReady", { detail: { lenis } }));
  };
  sendGsapEvent();

  
  // 2. --- CORE ANIMATIONS (from original inline scripts) ---
  // ==========================================================

  // Hero Text Background Animation
  gsap.to(".big-text.v1", { backgroundPosition: "200% center", duration: 20, ease: "none", repeat: -1, yoyo: true });
  gsap.to(".big-text.v2", { backgroundPosition: "200% center", duration: 20, ease: "none", repeat: -1, yoyo: true });
  gsap.to(".big-text.tight.v-1", { backgroundPosition: "200% center", duration: 20, ease: "none", repeat: -1, yoyo: true });
  gsap.to(".big-text.tight.v-2", { backgroundPosition: "200% center", duration: 20, ease: "none", repeat: -1, yoyo: true });
  gsap.to(".big-text.tight.v-3", { backgroundPosition: "200% center", duration: 20, ease: "none", repeat: -1, yoyo: true });

  // Hero Image Trail Effect (Mouse + Touch)
  const wrapper = document.querySelector("[data-anim='image-trail-wrap']");
  if (wrapper) {
    const images = gsap.utils.toArray(".content-img-wrap");
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let cache = { x: mouse.x, y: mouse.y };
    let index = 0;
    let threshold = 80;

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      mouse.x = touch.clientX;
      mouse.y = touch.clientY;
      showNextImage();
    });
    window.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      mouse.x = touch.clientX;
      mouse.y = touch.clientY;
    });

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
      index++;
      const img = images[index % images.length];
      const rect = img.getBoundingClientRect();
      gsap.killTweensOf(img);
      gsap.set(img, {
        opacity: 0, scale: 0, zIndex: index,
        x: cache.x - rect.width / 2, y: cache.y - rect.height / 2
      });
      gsap.timeline()
        .to(img, {
          duration: 0.4, opacity: 1, scale: 1,
          x: mouse.x - rect.width / 2, y: mouse.y - rect.height / 2,
          ease: "power2.out"
        })
        .to(img, {
          duration: 0.8, opacity: 0, scale: 0.2,
          ease: "power2.in",
          x: cache.x - rect.width / 2, y: cache.y - rect.height / 2
        }, "+=0.3");
    }
  }

  // Glitch Effect (Desktop Hover)
  const glitchTL = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } })
    .to("#glitchNoise", { attr: { baseFrequency: "0.05 1.2" }, duration: 0.12 })
    .to("#glitchDisp", { attr: { scale: 60 }, duration: 0.12 }, "<")
    .to("#glitchRGB", { attr: { dx: 6 }, duration: 0.12 }, "<")
    .to("#glitchNoise", { attr: { baseFrequency: "0.02 0.6" }, duration: 0.2 })
    .to("#glitchDisp", { attr: { scale: 30 }, duration: 0.2 }, "<")
    .to("#glitchRGB", { attr: { dx: 3 }, duration: 0.2 }, "<")
    .to("#glitchNoise", { attr: { baseFrequency: "0 0" }, duration: 0.25 })
    .to("#glitchDisp", { attr: { scale: 0 }, duration: 0.25 }, "<")
    .to("#glitchRGB", { attr: { dx: 0 }, duration: 0.25 }, "<");

  function resetFilterAttrs() {
    gsap.set("#glitchNoise", { attr: { baseFrequency: "0 0" } });
    gsap.set("#glitchDisp", { attr: { scale: 0 } });
    gsap.set("#glitchRGB", { attr: { dx: 0 } });
  }
  resetFilterAttrs();

  gsap.utils.toArray('[data-anim="cursor-glitch"]').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const cursor = document.querySelector('.cursor-pointer');
      if (!cursor) return;
      cursor.style.filter = 'none';
      cursor.offsetWidth; // Force reflow
      resetFilterAttrs();
      cursor.style.filter = 'url(#cyberGlitch)';
      glitchTL.restart(true);
    });
    card.addEventListener('mouseleave', () => {
      const cursor = document.querySelector('.cursor-pointer');
      if (!cursor) return;
      gsap.to({}, { duration: 0.05, onComplete: () => cursor.style.filter = 'none' });
    });
  });

  // Glitch Effect (Mobile Tap)
  const mobileGlitchTL = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } })
    .to("#glitchNoise", { attr: { baseFrequency: "0.05 1.2" }, duration: 0.12 })
    .to("#glitchDisp", { attr: { scale: 60 }, duration: 0.12 }, "<")
    .to("#glitchRGB", { attr: { dx: 6 }, duration: 0.12 }, "<")
    .to("#glitchNoise", { attr: { baseFrequency: "0.02 0.6" }, duration: 0.2 })
    .to("#glitchDisp", { attr: { scale: 30 }, duration: 0.2 }, "<")
    .to("#glitchRGB", { attr: { dx: 3 }, duration: 0.2 }, "<")
    .to("#glitchNoise", { attr: { baseFrequency: "0 0" }, duration: 0.25 })
    .to("#glitchDisp", { attr: { scale: 0 }, duration: 0.25 }, "<")
    .to("#glitchRGB", { attr: { dx: 0 }, duration: 0.25 }, "<");

  function playMobileGlitch(el) {
    el.style.filter = "url(#cyberGlitch)";
    mobileGlitchTL.restart(true);
    gsap.delayedCall(mobileGlitchTL.duration(), () => {
      el.style.filter = "none";
      resetFilterAttrs();
    });
  }

  gsap.utils.toArray(".single-project-wrap").forEach(trigger => {
    const mobileButton = trigger.querySelector(".mobile-button");
    if (!mobileButton) return;
    const isTabletOrBelow = () => window.innerWidth <= 991;
    trigger.addEventListener("touchstart", e => { if (isTabletOrBelow()) playMobileGlitch(mobileButton); }, { passive: true });
    trigger.addEventListener("click", e => { if (isTabletOrBelow()) playMobileGlitch(mobileButton); });
  });


  // 3. --- NEW GSAP REPLACEMENTS (for Webflow Components & IX2) ---
  // ===============================================================
  
  // All scroll-based animations wait for the "GSAPReady" event
  window.addEventListener("GSAPReady", (e) => {
    
    // --- REPLACEMENT: Navbar (Webflow Component + IX2) ---
    // Replaces Webflow's navbar component and interactions e-165, e-166, etc.
    function initNavbar() {
      const menu = document.querySelector('[data-anim-nav="menu"]');
      const openButton = document.querySelector('[data-anim-nav="open"]');
      const closeButton = document.querySelector('[data-anim-nav="close"]');
      const links = gsap.utils.toArray('[data-anim-nav="link"]');
      
      if (!menu || !openButton || !closeButton) return;

      // This is the fix for the menu being open on load
      gsap.set(menu, { xPercent: 100, display: 'none' }); 
      gsap.set(links, { x: 50, opacity: 0 });

      const navTl = gsap.timeline({ paused: true, defaults: { ease: "outQuint", duration: 0.6 } })
        .set(menu, { display: 'flex' })
        .to(menu, { xPercent: 0 })
        .to(links, {
          x: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.4
        }, "-=0.3");

      openButton.addEventListener('click', () => navTl.play());
      closeButton.addEventListener('click', () => navTl.reverse());
      
      // Replicates the original IX2 link hover animations (a-92, a-93)
      links.forEach(link => {
        const linkTl = gsap.timeline({ paused: true })
            .to(link, { x: -500, duration: 0.5, ease: "outQuint" })
            .set(link, { x: -500 })
            .to(link, { x: 0, duration: 0.5, ease: "outQuint" });
        
        // We set the initial state from the *end* of the "out" animation (a-93)
        gsap.set(link, { x: -500 }); 
        linkTl.play(); // Play to the "in" state (x: 0)
        
        link.addEventListener('mouseenter', () => linkTl.play());
        link.addEventListener('mouseleave', () => linkTl.reverse());

        // Close menu on link click
        link.addEventListener('click', () => {
          if (window.innerWidth <= 991) {
            navTl.reverse();
          }
        });
      });
    }

    // --- REPLACEMENT: Hero & Page Load (IX2) ---
    // Replaces interaction a-77
    function initPageLoadAnimations() {
      const loadTl = gsap.timeline({
        delay: 0.5, 
        defaults: { ease: "outQuint" }
      });
      
      // Replicates the hero title scale/move
      loadTl.from("[data-anim-load='hero-title']", {
        scale: 2,
        x: "30vw",
        y: "30vh",
        duration: 2.0,
        ease: "inOutQuint"
      });
      
      // Replicates the subtext fade-in-up
      loadTl.from("[data-anim-load='fade-in-up']", {
        y: "100%",
        opacity: 0,
        duration: 1.0,
        stagger: 0.2
      }, "-=0.5");
      
      // Replicates the image trail fade-in
      loadTl.fromTo("[data-anim='image-trail-wrap']", 
        { display: 'none', opacity: 0 },
        { display: 'block', opacity: 1, duration: 0.5, ease: "inOutQuint" }, 
        "<"
      );
    }
    
    // --- REPLACEMENT: Scroll-triggered Parallax (IX2) ---
    // Replaces interactions a-80, a-83, a-87
    function initParallax() {
      gsap.utils.toArray('[data-anim-parallax]').forEach(container => {
        const target = container.querySelector('[data-anim-parallax-target]');
        if (target) {
          gsap.to(target, {
            yPercent: -10, // All original parallax animations were 0% to -10%
            ease: "none",
            scrollTrigger: {
              trigger: container,
              scrub: 1.2 
            }
          });
        }
      });
    }

    // --- REPLACEMENT: Cursor Animations (IX2) ---
    // Replaces interactions a-94, a-95, a-97, a-98
    function initCursor() {
      const cursorCore = document.querySelector(".cursor-core");
      const cursor = document.querySelector(".cursor-pointer");
      const cursorText = document.querySelector(".pointer-text");
      const cursorBg = document.querySelector(".bg-cursor");
      if (!cursorCore || !cursor || !cursorText || !cursorBg) return;
      
      // Cursor Follow (from original a)
      gsap.set(cursorCore, { xPercent: -50, yPercent: -50 });
      window.addEventListener('mousemove', e => {
        gsap.to(cursorCore, {
          duration: 0.8,
          x: e.clientX,
          y: e.clientY,
          ease: "power3.out"
        });
      });

      // Cursor "Grow" on project hover (a-94, a-95)
      gsap.utils.toArray('[data-anim="cursor-grow"]').forEach(el => {
        el.addEventListener('mouseenter', () => {
          gsap.to(cursor, { width: "6vw", height: "6vw", duration: 0.5, ease: "outQuint" });
          gsap.to(cursorText, { opacity: 1, duration: 0.5, ease: "outQuint" });
          gsap.to(cursorBg, { opacity: 1, duration: 0.25, ease: "outQuint" });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(cursor, { width: "1vw", height: "1vw", duration: 0.5, ease: "outQuint" });
          gsap.to(cursorText, { opacity: 0, duration: 0.3, ease: "outQuint" });
          gsap.to(cursorBg, { opacity: 0, duration: 0.5, ease: "outQuint" });
        });
      });

      // Cursor "Invert" and Hide Image Trail (a-97, a-98)
      gsap.utils.toArray('[data-anim="cursor-invert"]').forEach(el => {
        const trailWrap = document.querySelector("[data-anim='image-trail-wrap']");
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { backdropFilter: "invert(0)", duration: 0.3 });
            if (trailWrap) gsap.to(trailWrap, { opacity: 0, duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { backdropFilter: "invert(1)", duration: 0.3 });
            if (trailWrap) gsap.to(trailWrap, { opacity: 1, duration: 0.3 });
        });
      });
    }

    // --- REPLACEMENT: Animated Link Underline (IX2) ---
    // Replaces interaction a-89
    function initLinkHovers() {
      gsap.utils.toArray('[data-anim="link-underline"]').forEach(link => {
        const line = link.querySelector('.animated-link-line');
        if (!line) return;
        
        // This replicates the specific "slide out, jump left, slide in" effect from a-89
        const tl = gsap.timeline({ paused: true })
          .to(line, { x: "101%", duration: 0.5, ease: "outQuint" })
          .set(line, { x: "-101%" })
          .to(line, { x: "0%", duration: 0.5, ease: "outQuint" });

        // Set initial state (line is at -101%) and play() to x:0
        tl.play(tl.duration()); // Go to end
        gsap.set(line, { x: "-101%" }); // Then set start

        link.addEventListener('mouseenter', () => tl.play(0));
      });
    }

    // --- REPLACEMENT: Accordion (Webflow Tabs Component) ---
    // Replaces Webflow Tabs logic and interactions a-81, a-82
    function initAccordions() {
      const accordions = gsap.utils.toArray("[data-anim-accordion='item']");
      
      accordions.forEach((item, index) => {
        const header = item.querySelector("[data-anim-accordion='header']");
        const content = item.querySelector("[data-anim-accordion='content']");
        const icon = item.querySelector("[data-anim-accordion='icon']");

        // Set initial states (closed)
        gsap.set(content, { height: 0, opacity: 0, display: 'none' });
        
        // Open the first one by default (as per original site)
        if (index === 0) {
          item.classList.add("is-active");
          gsap.set(content, { height: 'auto', opacity: 1, display: 'flex' });
          gsap.set(icon, { rotate: 90 });
        }

        header.addEventListener("click", () => {
          const isActive = item.classList.contains("is-active");

          // Close all other accordions
          accordions.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains("is-active")) {
              otherItem.classList.remove("is-active");
              gsap.to(otherItem.querySelector("[data-anim-accordion='content']"), {
                height: 0, opacity: 0, duration: 0.5, ease: "outQuint",
                onComplete: () => gsap.set(otherItem.querySelector("[data-anim-accordion='content']"), { display: 'none' })
              });
              gsap.to(otherItem.querySelector("[data-anim-accordion='icon']"), {
                rotate: 0, duration: 0.5, ease: "outQuint"
              });
            }
          });
          
          // Toggle the clicked one
          if (isActive) {
            item.classList.remove("is-active");
            gsap.to(content, {
              height: 0, opacity: 0, duration: 0.5, ease: "outQuint",
              onComplete: () => gsap.set(content, { display: 'none' })
            });
            gsap.to(icon, { rotate: 0, duration: 0.5, ease: "outQuint" });
          } else {
            item.classList.add("is-active");
            // Use Flip to animate height from 0 to 'auto'
            const state = Flip.getState(content);
            gsap.set(content, { display: 'flex', height: 'auto' });
            
            Flip.from(state, {
                duration: 0.5,
                ease: "outQuint",
                onStart: () => gsap.set(content, { opacity: 1 }),
                onInterrupt: () => ScrollTrigger.refresh()
            });

            gsap.to(icon, { rotate: 90, duration: 0.5, ease: "outQuint" });
          }
        });
      });
    }

    // --- REPLACEMENT: Marquee / Scrolling Text (IX2) ---
    // Replaces interactions a-84, a-85, a-86
    function initMarquees() {
      gsap.utils.toArray("[data-anim-marquee='wrap']").forEach(wrap => {
        const inner = wrap.querySelector("[data-anim-marquee='inner']");
        const content = inner.querySelector("[data-anim-marquee='content']");
        if (!inner || !content) return;
        
        const isReverse = wrap.classList.contains("reverse");

        // Clone content for seamless loop
        const contentClone = content.cloneNode(true);
        inner.appendChild(contentClone);

        gsap.set(inner, { xPercent: isReverse ? -50 : 0 });
        
        // Looping animation (a-84, a-85)
        const loop = gsap.to(inner, {
          xPercent: isReverse ? 0 : -50,
          duration: 120, // 120,000ms = 2 minutes
          ease: "none",
          repeat: -1,
        });

        // Scroll-based animation (a-86)
        const scrub = gsap.to(inner, {
          xPercent: isReverse ? -25 : -25,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            scrub: 1.2
          }
        });
      });
    }

    // --- REPLACEMENT: CTA Fog Animation (IX2) ---
    // Replaces interaction a-88
    function initCtaFog() {
      const fog = document.querySelector("[data-anim='cta-fog']");
      if (!fog) return;

      gsap.set(fog, { x: 0 }); // Start at 0
      gsap.to(fog, {
        x: "-200%", // Move to -200%
        duration: 20,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => parseFloat(x) % 200) // Loop from -200% back to 0
        }
      });
    }


    // --- INITIALIZE ALL NEW ANIMATIONS ---
    initPageLoadAnimations();
    initParallax();
    initCursor();
    initLinkHovers();
    initAccordions();
    initMarquees();
    initNavbar();
    initCtaFog();
    
    // Refresh ScrollTrigger once after all animations are set up
    ScrollTrigger.refresh();

  });
  
});
