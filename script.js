(function () {
    'use strict';

    const RESUME_PATH = "Giridhar's Resume.pdf";
    const ROLES = [
        'Full-Stack Developer',
        'Data Engineer',
        'Cybersecurity Enthusiast',
        'Quantum Computing Explorer'
    ];

    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    const backToTop = document.getElementById('back-to-top');
    const roleText = document.getElementById('role-text');
    const yearEl = document.getElementById('year');
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const themeColorMeta = document.getElementById('theme-color-meta');

    const THEME_KEY = 'portfolio-theme';
    const THEME_COLORS = {
        dark: '#0c1222',
        light: '#f4f7fb'
    };

    let roleIndex = 0;
    let roleCharIndex = 0;
    let isDeleting = false;

    function downloadResume() {
        const link = document.createElement('a');
        link.href = encodeURI(RESUME_PATH);
        link.download = '';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    window.downloadResume = downloadResume;

    function initPageLoader() {
        window.addEventListener('load', function () {
            document.body.classList.add('loaded');
        });
        setTimeout(function () {
            document.body.classList.add('loaded');
        }, 2500);
    }

    function initYear() {
        if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    }

    function getStoredTheme() {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch (e) {
            return null;
        }
    }

    function setStoredTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {
            /* ignore storage errors */
        }
    }

    function getPreferredTheme() {
        const stored = getStoredTheme();
        if (stored === 'light' || stored === 'dark') return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function updateThemeToggleUI(theme) {
        const isDark = theme === 'dark';
        const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        const mobileLabel = isDark ? 'Light mode' : 'Dark mode';

        [themeToggle, themeToggleMobile].forEach(function (btn) {
            if (!btn) return;
            btn.setAttribute('aria-label', label);
            btn.setAttribute('title', label);
        });

        if (themeToggleMobile) {
            const labelEl = themeToggleMobile.querySelector('.theme-toggle-label');
            if (labelEl) labelEl.textContent = mobileLabel;
        }

        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', THEME_COLORS[theme]);
        }
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeToggleUI(theme);
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        setStoredTheme(next);
    }

    function initTheme() {
        applyTheme(getPreferredTheme());

        if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
        if (themeToggleMobile) themeToggleMobile.addEventListener('click', function () {
            toggleTheme();
            closeMobileMenu();
        });

        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
            if (!getStoredTheme()) {
                applyTheme(e.matches ? 'light' : 'dark');
            }
        });
    }

    function typeRoles() {
        if (!roleText || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            if (roleText) roleText.textContent = ROLES[0];
            return;
        }

        const current = ROLES[roleIndex];
        const display = isDeleting
            ? current.substring(0, roleCharIndex - 1)
            : current.substring(0, roleCharIndex + 1);

        roleText.textContent = display;
        roleCharIndex = isDeleting ? roleCharIndex - 1 : roleCharIndex + 1;

        let delay = isDeleting ? 40 : 80;

        if (!isDeleting && roleCharIndex === current.length) {
            delay = 2200;
            isDeleting = true;
        } else if (isDeleting && roleCharIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % ROLES.length;
            delay = 400;
        }

        setTimeout(typeRoles, delay);
    }

    function setMobileMenuOpen(open) {
        if (!menuToggle || !mobileNav) return;
        menuToggle.setAttribute('aria-expanded', String(open));
        mobileNav.classList.toggle('open', open);
        mobileNav.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';
    }

    function closeMobileMenu() {
        setMobileMenuOpen(false);
    }

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function () {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            setMobileMenuOpen(!isOpen);
        });

        mobileNav.querySelectorAll('a').forEach(function (anchor) {
            anchor.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMobileMenu();
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', href);
        });
    });

    function updateNavbar() {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 24);
    }

    function updateBackToTop() {
        if (!backToTop) return;
        backToTop.classList.toggle('visible', window.scrollY > 500);
    }

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function setActiveNavLink() {
        let current = '';
        const offset = 120;

        sections.forEach(function (section) {
            const top = section.offsetTop - offset;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            link.classList.toggle('active', href === '#' + current);
        });
    }

    function initRevealAnimations() {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const revealElements = document.querySelectorAll('.reveal');

        if (prefersReduced) {
            revealElements.forEach(function (el) {
                el.classList.add('visible');
            });
            return;
        }

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    let scrollTicking = false;
    window.addEventListener(
        'scroll',
        function () {
            if (!scrollTicking) {
                window.requestAnimationFrame(function () {
                    updateNavbar();
                    setActiveNavLink();
                    updateBackToTop();
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        },
        { passive: true }
    );

    window.addEventListener('resize', closeMobileMenu);

    initPageLoader();
    initTheme();
    initYear();
    typeRoles();
    updateNavbar();
    setActiveNavLink();
    updateBackToTop();
    initRevealAnimations();
})();
