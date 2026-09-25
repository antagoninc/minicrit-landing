// ========================================
// Antagon Inc. — site behaviour
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

// Scroll Reveal — progressive enhancement only.
// The previous version set inline opacity:0 on every card before checking
// anything, so if the script failed, or IntersectionObserver was missing, or a
// crawler/screenshotter never scrolled, the page rendered blank. Content is
// visible by default now; the fade is added on top and skipped entirely when
// the viewer has asked for reduced motion.
function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const revealElements = document.querySelectorAll(
        '.problem-card, .pipeline-step, .catch-item, .use-case-card, .section-header, .cap-card, .cap-stat'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                entry.target.classList.remove('reveal-pending');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach((el) => {
        el.classList.add('reveal-pending');
        revealObserver.observe(el);
    });

    // Safety net: if anything goes wrong with the observer, nothing stays
    // hidden for more than a couple of seconds.
    window.setTimeout(() => {
        document.querySelectorAll('.reveal-pending')
            .forEach((el) => el.classList.remove('reveal-pending'));
    }, 2500);
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

// Navbar state on scroll — toggles a class so the stylesheet owns the colours
function initNavbarScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const apply = () => nav.classList.toggle('is-scrolled', window.pageYOffset > 24);
    apply();
    window.addEventListener('scroll', apply, { passive: true });
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
