(function () {
    'use strict';

    /* ---------- Header: show a hairline once the page has scrolled ---------- */
    const header = document.getElementById('site-header');

    function onScroll() {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- Mobile menu ---------- */
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    function setMenu(open) {
        navLinks.classList.toggle('is-open', open);
        header.classList.toggle('is-open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.textContent = open ? 'Close' : 'Menu';
    }

    function menuIsOpen() {
        return navToggle.getAttribute('aria-expanded') === 'true';
    }

    navToggle.addEventListener('click', function () {
        setMenu(!menuIsOpen());
    });

    navLinks.addEventListener('click', function (event) {
        if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('click', function (event) {
        if (menuIsOpen() && !header.contains(event.target)) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && menuIsOpen()) {
            setMenu(false);
            navToggle.focus();
        }
    });

    /* ---------- Navigation: mark the section being read ---------- */
    const sectionLinks = new Map();
    navLinks.querySelectorAll('a[href^="#"]').forEach(function (link) {
        const section = document.getElementById(link.getAttribute('href').slice(1));
        if (section) sectionLinks.set(section, link);
    });

    if ('IntersectionObserver' in window && sectionLinks.size) {
        const visible = new Set();
        const spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) visible.add(entry.target);
                else visible.delete(entry.target);
            });
            sectionLinks.forEach(function (link, section) {
                if (visible.has(section)) link.setAttribute('aria-current', 'true');
                else link.removeAttribute('aria-current');
            });
        }, { rootMargin: '-45% 0px -55% 0px' });

        sectionLinks.forEach(function (link, section) {
            spy.observe(section);
        });
    }

    /* ---------- Email: reveal both addresses on request ---------- */
    const emailToggle = document.getElementById('email-toggle');
    const emailPanel = document.getElementById('email-panel');

    if (emailToggle && emailPanel) {
        const addresses = [
            ['ivannvasic05', 'gmail.com'],
            ['ivann.vasic', 'utbm.fr']
        ];

        emailToggle.addEventListener('click', function () {
            if (!emailPanel.childElementCount) {
                addresses.forEach(function (parts) {
                    const address = parts.join('@');
                    const link = document.createElement('a');
                    link.href = 'mailto:' + address;
                    link.textContent = address;
                    emailPanel.appendChild(link);
                });
            }
            const open = emailPanel.hidden;
            emailPanel.hidden = !open;
            emailToggle.setAttribute('aria-expanded', String(open));
        });
    }

    /* ---------- Skills: tabs with arrow-key navigation ---------- */
    document.querySelectorAll('[data-tabs]').forEach(function (root) {
        const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
        const panels = tabs.map(function (tab) {
            return document.getElementById(tab.getAttribute('aria-controls'));
        });

        // The list is a column on wide screens and a wrapped row on narrow ones.
        const tablist = root.querySelector('[role="tablist"]');
        const wide = window.matchMedia('(min-width: 900px)');
        function setOrientation() {
            tablist.setAttribute('aria-orientation', wide.matches ? 'vertical' : 'horizontal');
        }
        setOrientation();
        wide.addEventListener('change', setOrientation);

        function select(index, moveFocus) {
            tabs.forEach(function (tab, i) {
                const active = i === index;
                tab.setAttribute('aria-selected', String(active));
                tab.tabIndex = active ? 0 : -1;
                panels[i].hidden = !active;
            });
            if (moveFocus) tabs[index].focus();
        }

        tabs.forEach(function (tab, index) {
            tab.addEventListener('click', function () {
                select(index, false);
            });

            tab.addEventListener('keydown', function (event) {
                let next = null;
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
                else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
                else if (event.key === 'Home') next = 0;
                else if (event.key === 'End') next = tabs.length - 1;
                if (next === null) return;
                event.preventDefault();
                select(next, true);
            });
        });

        select(Math.max(0, tabs.findIndex(function (tab) {
            return tab.getAttribute('aria-selected') === 'true';
        })), false);
    });

    /* ---------- A word for whoever opens the console ---------- */
    console.log('%cHi, fellow developer.', 'font-weight:bold;font-size:14px;');
    console.log('If you found this, you\'re probably curious. Let\'s talk: ivannvasic05@gmail.com');
})();
