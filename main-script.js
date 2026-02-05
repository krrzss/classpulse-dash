/* ========================================
   CLASSPULSE - MAIN JAVASCRIPT
   Interactive features for landing page
   ======================================== */

// ========================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  
  // Smooth scroll for all anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only prevent default if it's a valid section anchor
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        
        const targetSection = document.querySelector(href);
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        const targetPosition = targetSection.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // NAVBAR SCROLL EFFECT
  // ========================================
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow on scroll
    if (scrollTop > 50) {
      navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
    } else {
      navbar.style.boxShadow = '0 2px 8px var(--shadow)';
    }
    
    lastScrollTop = scrollTop;
  });

  // ========================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ========================================
  
  // Create observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        // Reinitialize icons after animation
        setTimeout(() => {
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }, 100);
      }
    });
  }, observerOptions);
  
  // Add initial animation state to cards
  const animatedElements = document.querySelectorAll(
    '.feature-card, .step-card, .testimonial-card, .role-card'
  );
  
  animatedElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(element);
  });

  // ========================================
  // ACTIVE NAVIGATION HIGHLIGHTING
  // ========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  
  window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.style.color = 'var(--secondary)';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--primary)';
      }
    });
  });

  // ========================================
  // ROLE CARD QUERY PARAMETER HANDLING
  // ========================================
  
  // Check if there's a role parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get('role');
  
  if (role) {
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
      const cardText = card.querySelector('h3').textContent.toLowerCase();
      if (cardText.includes(role.toLowerCase())) {
        card.style.borderColor = 'var(--primary)';
        card.style.boxShadow = '0 12px 32px rgba(37, 99, 235, 0.2)';
      }
    });
  }

  // ========================================
  // HERO BUTTONS INTERACTION
  // ========================================
  const heroPrimaryBtn = document.querySelector('.hero-buttons .btn-primary-large');
  const heroOutlineBtn = document.querySelector('.hero-buttons .btn-outline');
  
  if (heroOutlineBtn) {
    heroOutlineBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Scroll to features section when "View Demo" is clicked
      const featuresSection = document.querySelector('#features');
      if (featuresSection) {
        const navbarHeight = navbar.offsetHeight;
        window.scrollTo({
          top: featuresSection.offsetTop - navbarHeight - 20,
          behavior: 'smooth'
        });
      }
    });
  }

  // ========================================
  // FEATURE CARDS HOVER EFFECT ENHANCEMENT
  // ========================================
  const featureCards = document.querySelectorAll('.feature-card');
  
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.borderColor = 'var(--primary)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.borderColor = 'transparent';
    });
  });

  // ========================================
  // TESTIMONIAL CARDS ANIMATION
  // ========================================
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  
  testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
      this.style.boxShadow = '0 16px 40px var(--shadow)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 4px 12px var(--shadow)';
    });
  });

  // ========================================
  // ROLE CARDS INTERACTION
  // ========================================
  const roleCards = document.querySelectorAll('.role-card');
  
  roleCards.forEach(card => {
    const button = card.querySelector('.btn-primary');
    
    card.addEventListener('mouseenter', function() {
      if (button) {
        button.style.transform = 'translateY(-4px)';
        button.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.3)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (button) {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'none';
      }
    });
  });

  // ========================================
  // SCROLL TO TOP FUNCTIONALITY
  // ========================================
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '↑';
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 40px;
    right: 40px;
    width: 50px;
    height: 50px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
  `;
  
  document.body.appendChild(scrollToTopBtn);
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 500) {
      scrollToTopBtn.style.opacity = '1';
      scrollToTopBtn.style.visibility = 'visible';
    } else {
      scrollToTopBtn.style.opacity = '0';
      scrollToTopBtn.style.visibility = 'hidden';
    }
  });
  
  scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  scrollToTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px)';
    this.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.5)';
  });
  
  scrollToTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
  });

  // ========================================
  // COUNTER ANIMATION FOR TRUSTED SECTION
  // ========================================
  const trustedSection = document.querySelector('.trusted span');
  
  if (trustedSection && trustedSection.textContent.includes('50+')) {
    let hasAnimated = false;
    
    const counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateCounter();
        }
      });
    }, { threshold: 0.5 });
    
    counterObserver.observe(trustedSection);
    
    function animateCounter() {
      let count = 0;
      const target = 50;
      const duration = 2000;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          count = target;
          clearInterval(timer);
        }
        trustedSection.textContent = `Trusted by ${Math.floor(count)}+ Schools with ClassPulse`;
      }, 16);
    }
  }

  // ========================================
  // MOBILE MENU TOGGLE (for responsive design)
  // ========================================
  
  // Check if screen is mobile
  function isMobile() {
    return window.innerWidth <= 768;
  }
  
  // Add mobile menu functionality if needed
  if (isMobile()) {
    const navLinks = document.querySelector('.nav-links');
    
    // Create hamburger menu button
    const hamburger = document.createElement('button');
    hamburger.innerHTML = '☰';
    hamburger.className = 'hamburger-menu';
    hamburger.style.cssText = `
      display: none;
      font-size: 28px;
      background: none;
      border: none;
      color: var(--foreground);
      cursor: pointer;
      padding: 8px;
    `;
    
    navbar.querySelector('.nav-left').appendChild(hamburger);
    
    // Show hamburger on mobile
    if (isMobile()) {
      hamburger.style.display = 'block';
    }
  }

  // ========================================
  // FORM VALIDATION (for future forms)
  // ========================================
  
  // This can be extended when login forms are added
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // ========================================
  // PAGE LOAD ANIMATION
  // ========================================
  
  // Animate hero section on page load
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 100);
  }

  // ========================================
  // CONSOLE MESSAGE
  // ========================================
  console.log('%c🎓 ClassPulse ', 'background: #2563eb; color: white; padding: 8px 16px; border-radius: 4px; font-size: 16px; font-weight: bold;');
  console.log('%cWelcome to ClassPulse - AI-Powered Student Performance Platform', 'color: #2563eb; font-size: 14px;');
  console.log('%cVersion 2.0 is now live!', 'color: #10b981; font-size: 12px; font-weight: bold;');

});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for performance
function debounce(func, wait) {
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

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}