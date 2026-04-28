let e_is_shown = false;

document.getElementById('iemail').addEventListener("click", function(){
    let demail = document.getElementById('demail');
    let msg = "ivannvasic05@gmail.com<br>ivann.vasic@utbm.fr";
    demail.innerHTML = msg;
    demail.style.opacity = e_is_shown ? 0 : 1;
    e_is_shown = !e_is_shown;
});

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    if (window.scrollY > 0) {
        nav.classList.add('scrolled');
        header.classList.remove('gradient-background');
    } else {
        nav.classList.remove('scrolled');
        header.classList.add('gradient-background');
    }
});

document.getElementById('menu-toggle').addEventListener('click', function(){
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('open');
});

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const menu = document.getElementById('mobile-menu');

    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });

                // Hide the menu after clicking a link
                if (menu.classList.contains('open')) {
                    menu.classList.remove('open');
                }
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-project-content');
    const closeBtn = document.querySelector('.close');
    const viewDetailsBtns = document.querySelectorAll('.view-details-btn');

    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const projectCard = this.closest('.project-card');
            const projectDetails = projectCard.querySelector('.project-details').innerHTML;
            const projectTitle = projectCard.querySelector('h4').textContent;
            const projectImage = projectCard.querySelector('img').outerHTML;
            const projectBrief = projectCard.querySelector('.project-brief').innerHTML;
            const projectTools = projectCard.querySelector('.project-tools').textContent;

            modalContent.innerHTML = `
                <h3>${projectTitle}</h3>
                ${projectImage}
                <div class="modal-brief">${projectBrief}</div>
                <div class="modal-tools"><strong>Tools:</strong> ${projectTools}</div>
                ${projectDetails}
            `;
            modal.style.display = 'block';
        });
    });

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    var lazyImages = [].slice.call(document.querySelectorAll("img[data-src]"));

    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.removeAttribute("data-src");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(function(lazyImage) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.removeAttribute("data-src");
        });
    }
});

/* ============================================
   HERO NEURAL NETWORK CANVAS (mouse-reactive)
   ============================================ */
(function initNeuralCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || !canvas.getContext) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const host = canvas.parentElement;
    let width = 0, height = 0;
    let nodes = [];
    let mouse = { x: -9999, y: -9999, active: false };
    let rafId = null;

    const LINK_DIST = 140;
    const MOUSE_RADIUS = 130;

    function resize() {
        const rect = host.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = Math.max(1, Math.floor(width * dpr));
        canvas.height = Math.max(1, Math.floor(height * dpr));
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        seedNodes();
    }

    function seedNodes() {
        const target = Math.max(28, Math.min(70, Math.floor((width * height) / 16000)));
        nodes = [];
        for (let i = 0; i < target; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: 1 + Math.random() * 1.6
            });
        }
    }

    host.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    });

    host.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
        mouse.active = false;
    });

    function draw() {
        ctx.clearRect(0, 0, width, height);

        for (const n of nodes) {
            if (mouse.active) {
                const dx = n.x - mouse.x;
                const dy = n.y - mouse.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < MOUSE_RADIUS * MOUSE_RADIUS) {
                    const dist = Math.sqrt(distSq) || 1;
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    n.vx += (dx / dist) * force * 0.55;
                    n.vy += (dy / dist) * force * 0.55;
                }
            }
            n.vx *= 0.96;
            n.vy *= 0.96;
            n.vx += (Math.random() - 0.5) * 0.02;
            n.vy += (Math.random() - 0.5) * 0.02;
            if (n.vx > 1.2) n.vx = 1.2; else if (n.vx < -1.2) n.vx = -1.2;
            if (n.vy > 1.2) n.vy = 1.2; else if (n.vy < -1.2) n.vy = -1.2;
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0)      { n.x = 0;      n.vx *= -1; }
            if (n.x > width)  { n.x = width;  n.vx *= -1; }
            if (n.y < 0)      { n.y = 0;      n.vy *= -1; }
            if (n.y > height) { n.y = height; n.vy *= -1; }

            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
            ctx.fill();
        }

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < LINK_DIST) {
                    const alpha = (1 - d / LINK_DIST) * 0.35;
                    ctx.strokeStyle = 'rgba(129, 140, 248, ' + alpha + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        rafId = requestAnimationFrame(draw);
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 120);
    });

    resize();
    draw();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
        } else if (!rafId) {
            draw();
        }
    });
})();

/* ============================================
   3D TILT (cards with .tilt-card)
   ============================================ */
(function initTilt() {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('.tilt-card').forEach((card) => {
        card.style.willChange = 'transform';
        let raf = null;
        const baseTransform = 'perspective(1400px)';

        function onMove(e) {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                const ry = x * 4.5;
                const rx = -y * 4.5;
                card.style.transform =
                    baseTransform + ' rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(1.005)';
                raf = null;
            });
        }

        function onLeave() {
            if (raf) { cancelAnimationFrame(raf); raf = null; }
            card.style.transform = baseTransform + ' rotateX(0deg) rotateY(0deg) scale(1)';
        }

        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
    });
})();

/* ============================================
   SCROLL REVEAL for story steps
   ============================================ */
(function initStoryReveal() {
    const steps = document.querySelectorAll('.story-step');
    if (!steps.length) return;

    if (!('IntersectionObserver' in window)) {
        steps.forEach((s) => s.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                steps.forEach((s, i) => {
                    setTimeout(() => s.classList.add('visible'), i * 180);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.18 });

    observer.observe(steps[0]);
})();

/* ============================================
   DEV CONSOLE EASTER EGG
   ============================================ */
(function devGreet() {
    const styleHeader = 'color:#38bdf8;font-size:14px;font-weight:bold;font-family:monospace;';
    const styleBody = 'color:#94a3b8;font-size:12px;font-family:monospace;';
    console.log('%c$ hi, fellow developer 👋', styleHeader);
    console.log('%cIf you found this, you\'re probably curious — let\'s talk: ivannvasic05@gmail.com', styleBody);
})();

document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const timelineEntries = document.querySelectorAll('.timeline .entry[data-position]');

    // Find the maximum position value to compute reversed rows
    let maxPos = 0;
    timelineEntries.forEach(entry => {
        (entry.dataset.position || '').split(',').forEach(part => {
            const n = parseInt(part.trim(), 10);
            if (!Number.isNaN(n) && n > maxPos) maxPos = n;
        });
    });

    timelineEntries.forEach(entry => {
        const positions = (entry.dataset.position || '')
            .split(',')
            .map(part => parseInt(part.trim(), 10))
            .filter(num => !Number.isNaN(num));

        if (!positions.length) {
            return;
        }

        // Reverse chronological order: map position p → (maxPos + 1 - p)
        const reversed = positions.map(p => maxPos + 1 - p).sort((a, b) => a - b);
        const start = reversed[0];
        const end = reversed[reversed.length - 1] + 1;

        entry.style.gridRow = `${start} / ${end}`;
    });
});
