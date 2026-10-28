const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
function setTheme(theme) {
    root.dataset.theme = theme;
    themeToggle.querySelector('i').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
}
let savedTheme;
try { savedTheme = localStorage.getItem('theme'); } catch { /* Storage may be disabled. */ }
setTheme(savedTheme === 'dark' ? 'dark' : 'light');
themeToggle.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(theme);
    try { localStorage.setItem('theme', theme); } catch { /* The theme still works for this visit. */ }
});

const menuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');
function setMenu(open) {
    navLinks.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuToggle.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
}
menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('active')));
navLinks.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('click', event => {
    if (!event.target.closest('.navbar')) setMenu(false);
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navLinks.classList.contains('active')) {
        setMenu(false);
        menuToggle.focus();
    }
});
matchMedia('(min-width: 901px)').addEventListener('change', () => setMenu(false));

const filters = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');
filters.forEach(button => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    button.addEventListener('click', () => {
        filters.forEach(filter => {
            const selected = filter === button;
            filter.classList.toggle('active', selected);
            filter.setAttribute('aria-pressed', String(selected));
        });
        cards.forEach(card => {
            card.hidden = button.dataset.filter !== 'all' && !card.dataset.category.split(' ').includes(button.dataset.filter);
        });
    });
});

const backToTop = document.getElementById('backToTop');
const sections = [...document.querySelectorAll('section[id]')];
function updateScrollState() {
    backToTop.classList.toggle('visible', scrollY > 500);
    const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= 160);
    navLinks.querySelectorAll('a').forEach(link => {
        const active = link.hash === `#${current?.id || 'home'}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    });
}
let scrollQueued = false;
addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => { updateScrollState(); scrollQueued = false; });
}, { passive: true });
updateScrollState();
