// ========================================
// MiniCrit Landing Page - JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Animate counting numbers
    animateCounters();

    // Tab switching for code blocks
    initTabs();

    // Scroll reveal animations
    initScrollReveal();

    // Smooth scroll for navigation
    initSmoothScroll();

    // Navbar background on scroll
    initNavbarScroll();
});

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('[data-target]');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.dataset.target);
                const isDecimal = target % 1 !== 0;
                const duration = 2000;
                const startTime = performance.now();

                const updateCounter = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

                    const current = easeProgress * target;

                    if (isDecimal) {
                        counter.textContent = current.toFixed(1);
                    } else {
                        counter.textContent = Math.floor(current).toLocaleString();
                    }

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                };

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
}

// Tab Switching
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const codeBlocks = document.querySelectorAll('.code-block');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Update button states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update code block visibility
            codeBlocks.forEach(block => {
                block.classList.remove('active');
                if (block.id === targetTab) {
                    block.classList.add('active');
                }
            });
        });
    });
}

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.problem-card, .pipeline-step, .catch-item, .use-case-card, .section-header'
    );

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${index * 0.1}s`;
                entry.target.classList.add('reveal');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.style.opacity = '0';
        revealObserver.observe(el);
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar Background on Scroll
function initNavbarScroll() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.style.background = 'rgba(5, 5, 8, 0.95)';
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            nav.style.background = 'rgba(5, 5, 8, 0.8)';
            nav.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// Terminal typing effect restart on visibility
const terminal = document.querySelector('.terminal');
if (terminal) {
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const command = terminal.querySelector('.typing');
                const output = terminal.querySelector('.terminal-output');

                if (command && output) {
                    // Reset animations
                    command.style.animation = 'none';
                    output.style.animation = 'none';

                    // Trigger reflow
                    void command.offsetWidth;
                    void output.offsetWidth;

                    // Restart animations
                    command.style.animation = 'typing 2s steps(50) forwards, blink 0.7s step-end infinite';
                    output.style.animation = 'fadeIn 0.5s ease forwards';
                    output.style.animationDelay = '2.5s';
                }
            }
        });
    }, { threshold: 0.5 });

    terminalObserver.observe(terminal);
}

// Add parallax effect to background glows
window.addEventListener('mousemove', (e) => {
    const glows = document.querySelectorAll('.bg-glow');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    glows.forEach((glow, index) => {
        const speed = (index + 1) * 20;
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;

        glow.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});
