// script.js
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 50;
            if (scrollY >= top) current = section.id;
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.href.includes(`#${current}`)) link.classList.add('active');
        });
    });

    document.getElementById('contact-form').addEventListener('submit', e => {
        e.preventDefault();
        if (e.target.checkValidity()) alert('Отправлено!');
    });
});